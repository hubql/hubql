import { createLazyFileRoute } from '@tanstack/react-router'
import Editor from '../components/Editor'

export const Route = createLazyFileRoute('/files/$fileId')({
  component: File,
})

function File() {
  return <Editor />
}
