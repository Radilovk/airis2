import { ComponentType } from 'react'
import EditableElement from './EditableElement'
import { useEditableElements } from '@/hooks/use-editable-elements'

export interface WithEditingProps {
  editorMode?: boolean
  moduleId?: string
}

export function withDetailedEditing<P extends object>(
  Component: ComponentType<P>,
  moduleId: string
) {
  return function WithEditingComponent(props: P & WithEditingProps) {
    const { editorMode = false, ...restProps } = props as any
    const editor = useEditableElements(moduleId, editorMode)

    if (!editorMode) {
      return <Component {...(restProps as P)} />
    }

    return (
      <div className="space-y-2">
        <EditableElement
          id={`${moduleId}-wrapper`}
          type="custom"
          label={`Модул: ${moduleId}`}
          editorMode={editorMode}
          visible={editor.getElementState(`${moduleId}-wrapper`).visible}
          onToggleVisibility={editor.toggleVisibility}
          onAddComment={editor.addComment}
          onResolveComment={editor.resolveComment}
          onDeleteComment={editor.deleteComment}
          comments={editor.getElementState(`${moduleId}-wrapper`).comments}
          metadata={{ moduleId }}
        >
          <Component {...(restProps as P)} />
        </EditableElement>
      </div>
    )
  }
}
