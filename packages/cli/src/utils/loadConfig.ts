import path from 'path'
import fs from 'fs-extra'
import { pathToFileURL } from 'url'
import Ajv from 'ajv'
import { register } from 'ts-node'
import { createRequire } from 'module'

const ajv = new Ajv()

const schema = {
  type: 'object',
  properties: {
    workspaces: { type: 'array' },
  },
  required: ['workspaces'],
}

const validate = ajv.compile(schema)

export async function loadConfig(configPath?: string): Promise<any> {
  try {
    // Register TypeScript loader
    register({
      transpileOnly: true,
      compilerOptions: {
        module: 'CommonJS', // Change to CommonJS
        moduleResolution: 'node',
      },
      esm: true, // Enable ESM support
    })

    // Use require for TypeScript files
    const require = createRequire(import.meta.url)
    const importPath = (p: string) => {
      if (p.endsWith('.ts')) {
        return require(p)
      }
      return import(pathToFileURL(path.resolve(p)).href)
    }

    // Check command-line argument
    if (configPath) {
      const resolvedPath = path.resolve(configPath)
      if (!resolvedPath.endsWith('.ts') && !resolvedPath.endsWith('.js')) {
        throw new Error(`Invalid file extension for config file: ${resolvedPath}`)
      }
      if (await fs.pathExists(resolvedPath)) {
        const config = await importPath(resolvedPath)
        return { config: validateConfig(config.default), configPath: resolvedPath }
      }
    }

    // Check HUBQL_CONFIG_PATH environment variable
    const envConfigPath = process.env.HUBQL_CONFIG_PATH
    if (envConfigPath) {
      const resolvedPath = path.resolve(envConfigPath)
      if (!resolvedPath.endsWith('.ts') && !resolvedPath.endsWith('.js')) {
        throw new Error(`Invalid file extension for config file: ${resolvedPath}`)
      }
      if (await fs.pathExists(resolvedPath)) {
        const config = await importPath(resolvedPath)
        return { config: validateConfig(config.default), configPath: resolvedPath }
      }
    }

    // Default paths
    const defaultPaths = [


      //root
      path.resolve(process.cwd(), 'hubql', 'config.ts'),
      path.resolve(process.cwd(), 'hubql', 'hubql.config.ts'),
      path.resolve(process.cwd(), 'package.json'),

      //local
      path.resolve(process.cwd(), '../..', 'hubql', 'config.ts'),
      path.resolve(process.cwd(), '../..', 'hubql', 'hubql.config.ts'),
      path.resolve(process.cwd(), '../..', 'package.json'),

    ]


    for (const defaultPath of defaultPaths) {
      if (await fs.pathExists(defaultPath)) {
        if (defaultPath.endsWith('package.json')) {
          const packageJson = await fs.readJson(defaultPath)
          if (packageJson.hubql) {
            if (packageJson.hubql.config) {
              // Handle path to config file in package.json
              const configPath = path.resolve(process.cwd(), packageJson.hubql.config)

              if (await fs.pathExists(configPath)) {
                const config = await importPath(configPath)
                return { config: validateConfig(config.default), configPath }
              }
            } else {
              // Handle inline config in package.json
              return { config: validateConfig(packageJson.hubql), configPath: defaultPath }
            }
          }
          continue
        }
        const config = await importPath(defaultPath)
        return { config: validateConfig(config.default), configPath: defaultPath }
      }
    }

    console.error('Configuration file not found.')
    return {}
  } catch (error: Error | any) {
    console.error(`Error loading configuration file: ${error.message}`)
    return {}
  }
}

function validateConfig(config: any) {
  if (!validate(config)) {
    throw new Error('Configuration file did not pass validation.')
  }
  return config
}
