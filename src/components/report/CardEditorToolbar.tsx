import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  PencilSimple,
  ChatCircleDots,
  Eye,
  EyeSlash,
  Trash,
  ArrowsOutCardinal,
  CornersIn,
  CheckCircle,
  X,
  DotsThreeVertical,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardComment {
  id: string
  text: string
  timestamp: string
  resolved: boolean
}

export interface CardEditorState {
  id: string
  visible: boolean
  expanded: boolean
  comments: CardComment[]
  customStyles?: {
    backgroundColor?: string
    borderColor?: string
    padding?: string
  }
}

interface CardEditorToolbarProps {
  cardId: string
  cardState: CardEditorState
  onUpdate: (cardId: string, updates: Partial<CardEditorState>) => void
  onDelete?: (cardId: string) => void
  compact?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function CardEditorToolbar({
  cardId,
  cardState,
  onUpdate,
  onDelete,
  compact = false,
  position = 'top-right',
}: CardEditorToolbarProps) {
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const unresolvedComments = cardState.comments.filter(c => !c.resolved)

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast.error('Въведете коментар')
      return
    }

    const newComment: CardComment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    onUpdate(cardId, {
      comments: [...cardState.comments, newComment],
    })

    setCommentText('')
    toast.success('Коментар добавен')
  }

  const handleResolveComment = (commentId: string) => {
    onUpdate(cardId, {
      comments: cardState.comments.map(c =>
        c.id === commentId ? { ...c, resolved: true } : c
      ),
    })
    toast.success('Коментар маркиран като решен')
  }

  const handleDeleteComment = (commentId: string) => {
    onUpdate(cardId, {
      comments: cardState.comments.filter(c => c.id !== commentId),
    })
    toast.success('Коментар изтрит')
  }

  const handleToggleVisibility = () => {
    onUpdate(cardId, { visible: !cardState.visible })
    toast.success(cardState.visible ? 'Картата е скрита' : 'Картата е показана')
  }

  const handleToggleExpanded = () => {
    onUpdate(cardId, { expanded: !cardState.expanded })
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(cardId)
      toast.success('Картата е изтрита')
    }
  }

  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
  }

  if (compact) {
    return (
      <div className={cn('absolute z-10', positionClasses[position])}>
        <Popover open={isExpanded} onOpenChange={setIsExpanded}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0 bg-background/95 backdrop-blur-sm shadow-md hover:bg-primary/10 relative"
            >
              <DotsThreeVertical size={16} weight="bold" />
              {unresolvedComments.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unresolvedComments.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="justify-start h-8 gap-2"
                onClick={handleToggleVisibility}
              >
                {cardState.visible ? (
                  <>
                    <EyeSlash size={16} weight="duotone" />
                    <span className="text-xs">Скрий</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} weight="duotone" />
                    <span className="text-xs">Покажи</span>
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="justify-start h-8 gap-2"
                onClick={handleToggleExpanded}
              >
                {cardState.expanded ? (
                  <>
                    <CornersIn size={16} weight="duotone" />
                    <span className="text-xs">Свий</span>
                  </>
                ) : (
                  <>
                    <ArrowsOutCardinal size={16} weight="duotone" />
                    <span className="text-xs">Разгъни</span>
                  </>
                )}
              </Button>

              <Dialog open={showComments} onOpenChange={setShowComments}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="justify-start h-8 gap-2 relative"
                  >
                    <ChatCircleDots size={16} weight="duotone" />
                    <span className="text-xs">Коментари</span>
                    {unresolvedComments.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                      >
                        {unresolvedComments.length}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Коментари за картата</DialogTitle>
                    <DialogDescription>
                      Добавете бележки и инструкции за редакция
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Textarea
                        placeholder="Напишете коментар..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={handleAddComment}
                        className="mt-2 w-full"
                        size="sm"
                      >
                        <ChatCircleDots size={16} weight="duotone" className="mr-2" />
                        Добави коментар
                      </Button>
                    </div>

                    {cardState.comments.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">
                          Всички коментари ({cardState.comments.length})
                        </h4>
                        {cardState.comments.map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={cn(
                              'p-3 rounded-lg border-l-4',
                              comment.resolved
                                ? 'bg-muted/50 border-l-muted-foreground/30'
                                : 'bg-accent/5 border-l-accent'
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p
                                  className={cn(
                                    'text-sm whitespace-pre-wrap',
                                    comment.resolved && 'line-through text-muted-foreground'
                                  )}
                                >
                                  {comment.text}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(comment.timestamp).toLocaleString('bg-BG')}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {!comment.resolved && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleResolveComment(comment.id)}
                                  >
                                    <CheckCircle size={16} weight="duotone" className="text-green-600" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <X size={16} weight="bold" className="text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {onDelete && (
                <>
                  <div className="h-px bg-border my-1" />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="justify-start h-8 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                  >
                    <Trash size={16} weight="duotone" />
                    <span className="text-xs">Изтрий</span>
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('absolute z-10 flex gap-1', positionClasses[position])}
    >
      <Button
        size="sm"
        variant="outline"
        className="h-8 px-2 bg-background/95 backdrop-blur-sm shadow-md hover:bg-accent/10"
        onClick={handleToggleVisibility}
      >
        {cardState.visible ? (
          <EyeSlash size={16} weight="duotone" />
        ) : (
          <Eye size={16} weight="duotone" />
        )}
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="h-8 px-2 bg-background/95 backdrop-blur-sm shadow-md hover:bg-accent/10"
        onClick={handleToggleExpanded}
      >
        {cardState.expanded ? (
          <CornersIn size={16} weight="duotone" />
        ) : (
          <ArrowsOutCardinal size={16} weight="duotone" />
        )}
      </Button>

      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 bg-background/95 backdrop-blur-sm shadow-md hover:bg-accent/10 relative"
          >
            <ChatCircleDots size={16} weight="duotone" />
            {unresolvedComments.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                {unresolvedComments.length}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Коментари за картата</DialogTitle>
            <DialogDescription>
              Добавете бележки и инструкции за редакция
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="Напишете коментар..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={handleAddComment}
                className="mt-2 w-full"
                size="sm"
              >
                <ChatCircleDots size={16} weight="duotone" className="mr-2" />
                Добави коментар
              </Button>
            </div>

            {cardState.comments.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">
                  Всички коментари ({cardState.comments.length})
                </h4>
                {cardState.comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      'p-3 rounded-lg border-l-4',
                      comment.resolved
                        ? 'bg-muted/50 border-l-muted-foreground/30'
                        : 'bg-accent/5 border-l-accent'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p
                          className={cn(
                            'text-sm whitespace-pre-wrap',
                            comment.resolved && 'line-through text-muted-foreground'
                          )}
                        >
                          {comment.text}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(comment.timestamp).toLocaleString('bg-BG')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!comment.resolved && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => handleResolveComment(comment.id)}
                          >
                            <CheckCircle size={16} weight="duotone" className="text-green-600" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <X size={16} weight="bold" className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {onDelete && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2 bg-background/95 backdrop-blur-sm shadow-md hover:bg-destructive/10 text-destructive"
          onClick={handleDelete}
        >
          <Trash size={16} weight="duotone" />
        </Button>
      )}
    </motion.div>
  )
}
