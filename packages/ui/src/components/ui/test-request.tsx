import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import React from 'react'

export const TestRequestButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate()
  return (
    <Button
      className={cn('', className)}
      variant={'outline'}
      size={'sm'}
      onClick={() => navigate('/')}
    >
      <Play className="w-3 h-3" />
      Test Request
    </Button>
  )
}
