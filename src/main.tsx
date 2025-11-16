import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { autoRunStartupChecks } from './lib/startup-checks.ts'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

autoRunStartupChecks()

const handleError = (error: Error, errorInfo: { componentStack: string }) => {
  console.error('ErrorBoundary caught error:', error)
  console.error('Component stack:', errorInfo.componentStack)
  
  if (error.message.includes('useKV') || error.message.includes('storage') || error.message.includes('quota')) {
    console.error('⚠️ Storage related error detected! This might be caused by large images.')
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
    <App />
   </ErrorBoundary>
)
