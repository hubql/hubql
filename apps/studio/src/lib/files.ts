import { proxy, useSnapshot, subscribe } from 'valtio'
import { useShape, getShapeStream, Row } from '@electric-sql/react'
import { useMemo } from 'react'
import { matchStream, matchBy } from './stream-utils'

interface File extends Row {
  id: number
  title: string
  created_at: string
}

interface OptimisticUpdate {
  value: Partial<File>
  timestamp: number
}

const optimisticStore = proxy({
  updates: new Map<number, OptimisticUpdate>(),
  errors: new Map<number, string>()
})

const useFiles = () => {

  const url = new URL("/shape-proxy/files", import.meta.env.VITE_API_URL).toString()
  const { data: electricFiles, isLoading, error: electricError } = useShape<File>({
    url: url,
  })

  const { updates, errors } = useSnapshot(optimisticStore)

  const combinedFiles = useMemo(() => {
    if (isLoading || !electricFiles) return []
    
    return electricFiles.map(file => ({
      ...file,
      ...(updates.get(file.id)?.value || {}),
      error: errors.get(file.id)
    }))
  }, [electricFiles, updates, errors, isLoading])

  return { 
    files: combinedFiles, 
    isLoading, 
    error: electricError 
  }
}

const updateFile = async (id: number, update: Partial<File>) => {
  // Create new Maps to trigger reactivity
  optimisticStore.updates = new Map(optimisticStore.updates)
  optimisticStore.errors = new Map(optimisticStore.errors)
  
  optimisticStore.errors.delete(id)
  
  // Store update with timestamp
  const timestamp = Date.now()
  optimisticStore.updates.set(id, {
    value: {
      ...optimisticStore.updates.get(id)?.value,
      ...update
    },
    timestamp
  })

  if ('title' in update) {
    try {
      const [updateResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/v1/files/${id}/title`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: update.title })
        }),
        // Wait for the change to be streamed back from Electric
        matchStream(
          getShapeStream<File>({url: new URL("/shape-proxy/files", import.meta.env.VITE_API_URL).toString()}),
          ['update'],
          matchBy('title', update.title)
        )
      ])

      if (!updateResponse.ok) {
        throw new Error('Failed to update file')
      }

      // Only remove the optimistic update if this was the last update made
      optimisticStore.updates = new Map(optimisticStore.updates)
      const currentUpdate = optimisticStore.updates.get(id)
      if (currentUpdate?.timestamp === timestamp) {
        optimisticStore.updates.delete(id)
      }
    } catch (err) {
      // Only handle the error if this was the last update made
      optimisticStore.updates = new Map(optimisticStore.updates)
      optimisticStore.errors = new Map(optimisticStore.errors)
      const currentUpdate = optimisticStore.updates.get(id)
      if (currentUpdate?.timestamp === timestamp) {
        optimisticStore.updates.delete(id)
        optimisticStore.errors.set(id, err instanceof Error ? err.message : 'Failed to update file')
      }
    }
  }
}

export { useFiles, updateFile, optimisticStore, type File }