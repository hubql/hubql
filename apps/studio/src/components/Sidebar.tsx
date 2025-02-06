import React, { useState } from 'react'
import { Plus, Search, Loader2, X, PanelLeft } from 'lucide-react'
import { useNavigate, useSearch, rootRouteId } from '@tanstack/react-router'
import FilesList from './FileList'
import { Button } from '@hubql/ui/button'
import { toast } from 'sonner'

export default function Sidebar() {
  const [isCreating, setIsCreating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const search = useSearch({ from: rootRouteId })

  const createNewFile = async () => {
    setIsCreating(true)
    try {
      const response = await fetch(new URL('/v1/files', import.meta.env.VITE_API_URL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Untitled File' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create file')
      }

      const file = await response.json()
      navigate({ to: '/files/$fileId', params: { fileId: file.id } })
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'Failed to create file')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 p-2 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="h-full flex flex-col">
        <div>
          <Button onClick={createNewFile} disabled={isCreating} className="w-full">
            {isCreating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
            <span>{isCreating ? 'Creating...' : 'New File'}</span>
          </Button>
          <div className="mt-2 text-center text-sm text-gray-600"></div>
        </div>

        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              value={search.q}
              // @ts-ignore
              onChange={(e) => navigate({ search: (prev) => ({ q: e.target.value }) })}
              className="w-full pl-10 pr-4 bg-background py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <FilesList />
      </div>
    </div>
  )
}
