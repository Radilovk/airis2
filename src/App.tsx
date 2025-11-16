import { useState, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import WelcomeScreen from '@/components/screens/WelcomeScreen'
import QuestionnaireScreen from '@/components/screens/QuestionnaireScreen'
import ImageUploadScreen from '@/components/screens/ImageUploadScreen'
import AnalysisScreen from '@/components/screens/AnalysisScreen'
import ReportScreen from '@/components/screens/ReportScreen'
import HistoryScreen from '@/components/screens/HistoryScreen'
import AdminScreen from '@/components/screens/AdminScreen'
import AboutAirisScreen from '@/components/screens/AboutAirisScreen'
import DiagnosticScreen from '@/components/screens/DiagnosticScreen'
import QuickDebugPanel from '@/components/QuickDebugPanel'
import type { QuestionnaireData, IrisImage, AnalysisReport } from '@/types'

type Screen = 'welcome' | 'questionnaire' | 'upload' | 'analysis' | 'report' | 'history' | 'admin' | 'about' | 'diagnostics'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [questionnaireData, setQuestionnaireData] = useKV<QuestionnaireData | null>('questionnaire-data', null)
  const leftIrisRef = useRef<IrisImage | null>(null)
  const rightIrisRef = useRef<IrisImage | null>(null)
  const [analysisReport, setAnalysisReport] = useKV<AnalysisReport | null>('analysis-report', null)
  const [history, setHistory] = useKV<AnalysisReport[]>('analysis-history', [])
  const screenTransitionLockRef = useRef(false)

  const handleStartAnalysis = () => {
    setCurrentScreen('questionnaire')
  }

  const handleViewHistory = () => {
    setCurrentScreen('history')
  }

  const handleAdminAccess = () => {
    setCurrentScreen('admin')
  }

  const handleAboutAccess = () => {
    setCurrentScreen('about')
  }

  const handleDiagnosticsAccess = () => {
    setCurrentScreen('diagnostics')
  }

  const handleTestStart = () => {
    if (questionnaireData) {
      setCurrentScreen('upload')
    }
  }

  const handleQuestionnaireComplete = (data: QuestionnaireData) => {
    setQuestionnaireData(() => data)
    setTimeout(() => setCurrentScreen('upload'), 50)
  }

  const handleImagesComplete = async (left: IrisImage, right: IrisImage) => {
    if (screenTransitionLockRef.current) {
      console.warn('⚠️ [APP] Смяна на екран вече е в ход, игнориране на дублирано извикване')
      return
    }
    
    try {
      screenTransitionLockRef.current = true
      
      console.log('🖼️ [APP] Получени изображения за анализ')
      console.log(`📊 [APP] Ляв ирис размер: ${Math.round(left.dataUrl.length / 1024)} KB`)
      console.log(`📊 [APP] Десен ирис размер: ${Math.round(right.dataUrl.length / 1024)} KB`)
      
      if (!left?.dataUrl || !right?.dataUrl) {
        console.error('❌ [APP] Невалидни данни на изображенията')
        throw new Error('Невалидни данни на изображенията')
      }

      if (!left.dataUrl.startsWith('data:image/') || !right.dataUrl.startsWith('data:image/')) {
        console.error('❌ [APP] Невалиден формат на изображението')
        throw new Error('Невалиден формат на изображението')
      }

      console.log('✅ [APP] Валидация на изображения успешна')
      console.log('💾 [APP] Запазване на изображения в ref (БЕЗ re-render, БЕЗ KV storage)...')
      
      leftIrisRef.current = left
      rightIrisRef.current = right
      
      console.log('✅ [APP] Изображения запазени в ref')
      console.log('⏳ [APP] Малка пауза преди преминаване към анализ...')
      
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log('🚀 [APP] Преминаване към analysis екран...')
      console.log('📍 [APP] currentScreen ще се смени от "upload" на "analysis"')
      setCurrentScreen('analysis')
      console.log('✅ [APP] setCurrentScreen("analysis") извикан успешно')
      
      setTimeout(() => {
        screenTransitionLockRef.current = false
        console.log('🔓 [APP] Смяна на екран завършена, lock освободен')
      }, 500)
    } catch (error) {
      screenTransitionLockRef.current = false
      console.error('❌ [APP] ГРЕШКА при обработка на изображенията:', error)
      toast.error('Грешка при обработка на изображенията. Опитайте отново.')
    }
  }

  const handleAnalysisComplete = (report: AnalysisReport) => {
    try {
      console.log('📝 [APP] Запазване на репорт...')
      console.log(`📊 [APP] Размер на репорт: ${JSON.stringify(report).length} символа`)
      console.log(`📊 [APP] Размер на ляво изображение: ${report.leftIrisImage.dataUrl.length} символа`)
      console.log(`📊 [APP] Размер на дясно изображение: ${report.rightIrisImage.dataUrl.length} символа`)
      
      console.log('💾 [APP] Записване на ПЪЛЕН репорт в currentReport (с изображения)...')
      setAnalysisReport(() => report)
      
      console.log('📋 [APP] Създаване на "лека" версия на репорт за история (БЕЗ изображения)...')
      const lightReport: AnalysisReport = {
        ...report,
        leftIrisImage: { dataUrl: '', side: 'left' },
        rightIrisImage: { dataUrl: '', side: 'right' }
      }
      
      console.log(`📊 [APP] Размер на "лек" репорт: ${JSON.stringify(lightReport).length} символа`)
      console.log('💾 [APP] Записване на "лек" репорт в история...')
      setHistory((current) => [lightReport, ...(current || [])])
      
      console.log('⏳ [APP] Малка пауза преди преминаване към report екран...')
      setTimeout(() => {
        console.log('🚀 [APP] Преминаване към report екран...')
        setCurrentScreen('report')
      }, 100)
    } catch (error) {
      console.error('❌ [APP] ГРЕШКА при запазване на репорт:', error)
      toast.error('Грешка при запазване на репорт')
    }
  }

  const handleViewReport = (report: AnalysisReport) => {
    try {
      setAnalysisReport(() => report)
      setTimeout(() => setCurrentScreen('report'), 50)
    } catch (error) {
      console.error('Грешка при показване на репорт:', error)
      toast.error('Грешка при показване на репорт')
    }
  }

  const handleRestart = () => {
    setQuestionnaireData(() => null)
    leftIrisRef.current = null
    rightIrisRef.current = null
    setAnalysisReport(() => null)
    setTimeout(() => setCurrentScreen('welcome'), 50)
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <QuickDebugPanel />
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onStart={handleStartAnalysis} onViewHistory={handleViewHistory} onAdmin={handleAdminAccess} onTestStart={handleTestStart} onAbout={handleAboutAccess} onDiagnostics={handleDiagnosticsAccess} />
          </motion.div>
        )}
        {currentScreen === 'questionnaire' && (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionnaireScreen onComplete={handleQuestionnaireComplete} initialData={questionnaireData || null} />
          </motion.div>
        )}
        {currentScreen === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ImageUploadScreen 
              onComplete={handleImagesComplete}
            />
          </motion.div>
        )}
        {currentScreen === 'analysis' && leftIrisRef.current && rightIrisRef.current && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalysisScreen
              questionnaireData={questionnaireData!}
              leftIris={leftIrisRef.current}
              rightIris={rightIrisRef.current}
              onComplete={handleAnalysisComplete}
            />
          </motion.div>
        )}
        {currentScreen === 'report' && analysisReport && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ReportScreen report={analysisReport} onRestart={handleRestart} />
          </motion.div>
        )}
        {currentScreen === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HistoryScreen onViewReport={handleViewReport} onBack={() => setCurrentScreen('welcome')} />
          </motion.div>
        )}
        {currentScreen === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminScreen onBack={() => setCurrentScreen('welcome')} />
          </motion.div>
        )}
        {currentScreen === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AboutAirisScreen onBack={() => setCurrentScreen('welcome')} />
          </motion.div>
        )}
        {currentScreen === 'diagnostics' && (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DiagnosticScreen onBack={() => setCurrentScreen('welcome')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
