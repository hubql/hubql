import React, { useState } from 'react'
import { Plus, Search, Loader2, X, PanelLeft } from 'lucide-react'
import { useNavigate, useSearch, rootRouteId } from '@tanstack/react-router'
import { Button, Dialog, Heading, Modal } from 'react-aria-components'
import FilesList from './FileList'
import { Button as ButtonUI } from '@hubql/ui/button'

export default function Sidebar() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create file')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-0 left-0 z-50 p-2 text-gray-900 transition-all duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <PanelLeft
          size={24}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 p-2 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div>
            <ButtonUI onClick={createNewFile} disabled={isCreating} className="w-full">
              {isCreating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
              <span>{isCreating ? 'Creating...' : 'New File'}</span>
            </ButtonUI>
            <div className="mt-2 text-center text-sm text-gray-600"></div>
          </div>

          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                value={search.q}
                onChange={(e) => navigate({ search: (prev) => ({ q: e.target.value }) })}
                className="w-full pl-10 pr-4 bg-background py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <FilesList />

          {error && (
            <Modal isDismissable isOpen onOpenChange={() => setError(null)}>
              <Dialog className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <div className="flex justify-between items-start mb-4">
                  <Heading slot="title" className="text-lg font-semibold text-gray-900">
                    Error Creating File
                  </Heading>
                  <Button
                    onPress={() => setError(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </Button>
                </div>
                <p className="text-gray-600">{error}</p>
                <div className="mt-6 flex justify-end">
                  <Button
                    onPress={() => setError(null)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </Button>
                </div>
              </Dialog>
            </Modal>
          )}
        </div>
      </div>
    </>
  )
}
