import { Component, ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Warning, ArrowClockwise } from '@phosphor-icons/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Warning size={32} weight="duotone" className="text-destructive" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Възникна грешка</h2>
                <p className="text-muted-foreground mb-4">
                  Съжаляваме, нещо се обърка при показване на доклада.
                </p>
              </div>

              <div className="w-full p-4 bg-muted rounded-lg text-left">
                <p className="text-sm font-mono text-destructive mb-2">
                  {this.state.error?.message || 'Неизвестна грешка'}
                </p>
                {this.state.error?.stack && (
                  <details className="text-xs font-mono text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">
                      Технически детайли
                    </summary>
                    <pre className="mt-2 overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={this.handleReset}
                  className="gap-2"
                >
                  <ArrowClockwise size={18} />
                  Опитай отново
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Презареди страницата
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
