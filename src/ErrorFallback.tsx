import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { Warning, ArrowClockwise } from "@phosphor-icons/react";

export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  console.error('ErrorFallback показан за:', error)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <Warning size={20} weight="duotone" />
          <AlertTitle>Възникна грешка при изпълнение</AlertTitle>
          <AlertDescription>
            Нещо неочаквано се случи по време на изпълнение на приложението. Детайлите за грешката са показани по-долу.
          </AlertDescription>
        </Alert>
        
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Детайли за грешката:</h3>
          <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32">
            {error.message}
          </pre>
          {error.stack && (
            <details className="mt-3">
              <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                Stack trace
              </summary>
              <pre className="text-xs text-muted-foreground bg-muted/50 p-3 rounded border overflow-auto max-h-40 mt-2">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={resetErrorBoundary} 
            className="flex-1 gap-2"
            variant="outline"
          >
            <ArrowClockwise size={18} />
            Опитай Отново
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            className="flex-1"
            variant="default"
          >
            Презареди
          </Button>
        </div>
      </div>
    </div>
  );
}
