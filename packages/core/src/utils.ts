import { EnvironmentVariable, RequestParameter, EnvironmentVariableValue } from './types'

export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS',
}

type HttpMethod = keyof typeof HTTP_METHODS

export const getMethod = (method: string) => {
    const index = method.toUpperCase()
    return HTTP_METHODS[index as HttpMethod]
}


type HeadersRecord = Record<string, string | string[]>
export type HeadersLike =
    | Iterable<[string, string]>
    | HeadersRecord
    | Required<RequestInit>['headers']

export const toTupleArray = (headers: HeadersLike): [string, string][] =>
    'entries' in headers && typeof headers.entries === 'function'
        ? [...(headers as unknown as [])]
        : Object.entries(headers as HeadersRecord).flatMap(([key, value]) =>
            typeof value === 'string'
                ? [[key, value]]
                : value.map((val) => [key, val] as [string, string])
        )
const getHeaderString = (name: string, val: string) =>
    `-H "${name}: ${`${val}`.replace(/(\\|")/g, '\\$1')}"`

const normalizeHeaders = (
    headers: HeadersLike
): {
    headers: [key: string, value: string][]
    isEncoding: boolean
} =>
    toTupleArray(headers).reduce(
        (acc, [key, value]) => {
            if (key.toLocaleLowerCase() === 'accept-encoding') {
                acc.isEncoding = true
            }
            acc.headers.push([key, value])
            return acc
        },
        {
            headers: [] as [string, string][],
            isEncoding: false as boolean,
        }
    )

const escapeBody = (body: string): string =>
    typeof body === 'string' ? body.replace(/'/g, `'\\''`) : body

const generateBody = (body: unknown): string =>
    typeof body === 'object'
        ? escapeBody(JSON.stringify(body))
        : typeof body === 'string'
            ? escapeBody(body)
            : (() => {
                throw new Error(`Invalid body type: ${typeof body}`)
            })()

/**
 * @warn The node and typescript ecosystem are not synchronized with `fetch`
 * types. Node fetch type is incompat with libdom fetch which is incompat
 * with MSW fetch types. Use a loosey goosey Request for max compat.
 */
interface RequestLike {
    url: string

    body?: unknown
    headers?: HeadersLike
    method?: string
}

interface RequestInitLike {
    body?: unknown // RequestInit["body"];
    headers?: HeadersLike
    method?: string
}

/**
 * Psuedo RequestInfo.
 * @see RequestLike
 */
type RequestInfoLike = RequestLike | string | URL

export const buildCurl = (
    requestInfo: RequestInfoLike,
    requestInit?: RequestInitLike,
    serialized?: {
        body?: string
    }
) => {
    const [url, options] =
        typeof requestInfo === 'string' || requestInfo instanceof URL
            ? ([requestInfo.toString(), requestInit ?? {}] as const)
            : ([
                (requestInfo || {}).url,
                requestInfo satisfies RequestInitLike as RequestInitLike,
            ] as const)
    const { body } = options

    const serializedBody = serialized?.body
    const formattedBody = serializedBody ? serializedBody : body ? generateBody(body) : undefined

    const { headers, isEncoding } = normalizeHeaders(options.headers || {})
    return [
        'curl',
        // URL
        `'${url}'`,

        // Method
        '-X',
        getMethod(options.method ?? HTTP_METHODS.GET),

        // Headers
        ...headers.map(([k, v]) => getHeaderString(k, v)),

        // Body
        ...(formattedBody ? ['--data-binary', `'${formattedBody}'`] : []),

        // Flags
        isEncoding ? ' --compressed' : undefined,
    ]
        .filter(Boolean)
        .join(' ')
}

const webStreamToString = async (stream: ReadableStream) => {
    const reader = stream.getReader()
    let result = await reader.read()
    let body = ''
    while (!result.done) {
        body += new TextDecoder().decode(result.value, { stream: true })
        result = await reader.read()
    }
    return body
}

const fromRequest = async (request: RequestLike) => {
    const serializedBody = await maybeSerializeBody(request.body)
    return buildCurl(request, undefined, { body: serializedBody })
}

export const fetchToCurl = async (requestInfo: RequestInfoLike, requestInit?: RequestInitLike) => {
    if (isRequestLike(requestInfo)) {
        return fromRequest(requestInfo)
    }

    if (!requestInit) {
        return buildCurl(requestInfo, requestInit)
    }

    const serializedBody = await maybeSerializeBody(requestInit.body, requestInit)

    return buildCurl(requestInfo, requestInit, { body: serializedBody })
}

/**
 * @warn If there is a backing requestInit, it must be passed, otherwise,
 * the underlying stream will be consumed and break the actual requestInit
 * requesting serialiation.
 */
const maybeSerializeBody = async (initStream: unknown, requestInit?: RequestInitLike) => {
    // if (initStream instanceof Readable) {
    //     return nodeStreamToString(initStream)
    // }

    if (initStream instanceof ReadableStream) {
        const [s1, s2] = initStream.tee()
        if (requestInit) {
            requestInit.body = s2
        }
        return webStreamToString(s1)
    }
}

const isRequestLike = (requestInfo: RequestInfoLike): requestInfo is RequestLike =>
    !!requestInfo && 'url' && typeof requestInfo === 'object' && 'url' in requestInfo

export const isValidUrl = (url: string) => {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

export const replaceVarWithEnv = ({
    value,
    environmentId,
    environmentVariables,
    environmentValues,
}: {
    value: string
    environmentId: string | null
    environmentVariables: EnvironmentVariable[]
    environmentValues: EnvironmentVariableValue[]
}) => {
    if (!value) return value
    const isVar = value.startsWith('{') && value.endsWith('}')

    if (!isVar) return value
    const varName = value.slice(1, -1)
    const envVar = environmentVariables.find((envVar) => envVar.key === varName)
    if (!envVar) {
        return value
    }
    const envValue = environmentValues.find(
        (v) =>
            v.environmentVariableId === envVar.id && v.environmentId === environmentId && v.value !== ''
    )
    const globalValue = environmentValues.find(
        (v) => v.environmentVariableId === envVar.id && !v.environmentId && v.value !== ''
    )
    return envValue?.value ?? globalValue?.value ?? value
}

export const parameteredUrl = ({
    url,
    requestParameters,
    operationId,
    environmentId,
    environmentVariables,
    environmentValues,
}: {
    url: string
    requestParameters: RequestParameter[]
    operationId: string
    environmentId: string | null
    environmentVariables: EnvironmentVariable[]
    environmentValues: EnvironmentVariableValue[]
}) => {
    let adjustedUrl = url
    const pathParams = requestParameters.filter(
        (param) => param.type === 'path' && param.operationId === operationId
    )

    for (const key in pathParams) {
        const kv = `{${pathParams[key]?.key}}`
        const kvv = replaceVarWithEnv({
            value: pathParams[key]?.value,
            environmentId,
            environmentVariables,
            environmentValues,
        })
        adjustedUrl = adjustedUrl.replace(kv, kvv)
    }
    const queryParams = requestParameters.filter(
        (param) => param.type === 'query' && param.operationId === operationId
    )
    adjustedUrl = appendQueryParams({
        currentUrl: adjustedUrl,
        qs: queryParams,
        environmentId,
        environmentVariables,
        environmentValues,
    })
    return adjustedUrl
}

const appendQueryParams = ({
    currentUrl,
    qs,
    environmentId,
    environmentVariables,
    environmentValues,
}: {
    currentUrl: string
    qs: RequestParameter[]
    environmentId: string | null
    environmentVariables: EnvironmentVariable[]
    environmentValues: EnvironmentVariableValue[]
}) => {
    let adjustedUrl = currentUrl
    const paramStrings = []

    for (const key in qs) {
        if (qs[key]?.key && qs[key]?.value) {
            const encodedKey = encodeURIComponent(qs[key].key)
            const encodedValue = encodeURIComponent(
                replaceVarWithEnv({
                    value: qs[key].value,
                    environmentId,
                    environmentVariables,
                    environmentValues,
                })
            )
            paramStrings.push(`${encodedKey}=${encodedValue}`)
        }
    }

    if (paramStrings.length > 0) {
        const queryString = paramStrings.join('&')
        if (adjustedUrl.includes('?')) {
            adjustedUrl += '&' + queryString
        } else {
            adjustedUrl += '?' + queryString
        }
    }

    return adjustedUrl
}
