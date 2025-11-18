import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ChatCircleDots,
  Eye,
  EyeSlash,
  PencilSimple,
  Warning,
  CheckCircle,
  Trash,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export interface EditableElementComment {
  id: string
  text: string
  timestamp: string
  resolved: boolean
}

export interface EditableElementProps {
  id: string
  type: 'text' | 'heading' | 'list' | 'card' | 'chart' | 'badge' | 'data' | 'custom'
  label?: string
  editorMode?: boolean
  visible?: boolean
  onToggleVisibility?: (id: string) => void
  onEdit?: (id: string, newValue: any) => void
  onAddComment?: (id: string, text: string) => void
  onResolveComment?: (id: string, commentId: string) => void
  onDeleteComment?: (id: string, commentId: string) => void
  onDelete?: (id: string) => void
  comments?: EditableElementComment[]
  metadata?: Record<string, any>
  children: React.ReactNode
  className?: string
  wrapperClassName?: string
  showInlineControls?: boolean
}

export default function EditableElement({
  id,
  type,
  label,
  editorMode = false,
  visible = true,
  onToggleVisibility,
  onEdit,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  onDelete,
  comments = [],
  metadata,
  children,
  className,
  wrapperClassName,
  showInlineControls = true,
}: EditableElementProps) {
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const unresolvedComments = comments.filter(c => !c.resolved)

  const handleAddComment = () => {
    if (commentText.trim() && onAddComment) {
      onAddComment(id, commentText)
      setCommentText('')
      toast.success('Коментар добавен')
    }
  }

  if (!editorMode) {
    return visible ? <div className={className}>{children}</div> : null
  }

  return (
    <motion.div
      className={cn(
        'relative group/editable',
        wrapperClassName
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {editorMode && isHovered && showInlineControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-2 -right-2 z-50 flex items-center gap-0.5 bg-background/95 backdrop-blur-sm rounded-lg p-0.5 shadow-lg border border-primary/30"
          >
            {label && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-5 mr-1">
                {label}
              </Badge>
            )}
            
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-5 mr-1">
              {type}
            </Badge>

            {onAddComment && (
              <Dialog open={showComments} onOpenChange={setShowComments}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-6 w-6 p-0 hover:bg-primary/10"
                  >
                    <ChatCircleDots size={12} />
                    {unresolvedComments.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-destructive text-white text-[8px] flex items-center justify-center rounded-full font-semibold">
                        {unresolvedComments.length}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Коментари: {label || id}</DialogTitle>
                    <DialogDescription>
                      Добавете коментари и инструкции за този елемент
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Опишете какво трябва да се промени..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <Button
                        onClick={handleAddComment}
                        size="sm"
                        disabled={!commentText.trim()}
                      >
                        <ChatCircleDots size={16} className="mr-2" />
                        Добави Коментар
                      </Button>
                    </div>

                    {comments.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Коментари ({comments.length})</h4>
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className={cn(
                              'p-3 rounded-lg border',
                              comment.resolved && 'bg-muted/50 opacity-70'
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 space-y-1">
                                <p className="text-sm">{comment.text}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.timestamp).toLocaleString('bg-BG')}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {onResolveComment && (
                                  <Button
                                    variant={comment.resolved ? 'ghost' : 'outline'}
                                    size="sm"
                                    onClick={() => onResolveComment(id, comment.id)}
                                  >
                                    {comment.resolved ? (
                                      <CheckCircle size={14} className="text-green-600" weight="fill" />
                                    ) : (
                                      <CheckCircle size={14} />
                                    )}
                                  </Button>
                                )}
                                {onDeleteComment && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeleteComment(id, comment.id)}
                                    className="hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <Trash size={14} />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground text-sm">
                        Все още няма коментари
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {metadata && (
              <Dialog open={showMetadata} onOpenChange={setShowMetadata}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10">
                    <PencilSimple size={12} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Метаданни</DialogTitle>
                    <DialogDescription>{label || id}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 py-4">
                    <div className="text-xs">
                      <span className="font-medium">ID:</span> {id}
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">Тип:</span> {type}
                    </div>
                    <pre className="text-xs p-2 bg-muted rounded overflow-auto max-h-64">
                      {JSON.stringify(metadata, null, 2)}
                    </pre>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" onClick={() => setShowMetadata(false)}>
                      Затвори
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleVisibility(id)}
                className="h-6 w-6 p-0 hover:bg-primary/10"
              >
                {visible ? <Eye size={12} /> : <EyeSlash size={12} />}
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm(`Сигурни ли сте, че искате да изтриете този елемент?`)) {
                    onDelete(id)
                    toast.success('Елемент изтрит')
                  }
                }}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash size={12} />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          'transition-all',
          editorMode && 'ring-1 ring-transparent hover:ring-primary/40 rounded',
          !visible && editorMode && 'opacity-30 pointer-events-none',
          className
        )}
      >
        {!visible && editorMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px] z-10 rounded">
            <Badge variant="outline" className="text-xs">
              <EyeSlash size={14} className="mr-1" />
              Скрит
            </Badge>
          </div>
        )}
        {children}
      </div>

      {editorMode && unresolvedComments.length > 0 && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4 shadow-sm">
            <Warning size={10} className="mr-0.5" weight="fill" />
            {unresolvedComments.length}
          </Badge>
        </div>
      )}
    </motion.div>
  )
}
