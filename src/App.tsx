import { useState } from 'react'
import { AppScreen, HealthQuestionnaire, IrisImage, AIAnalysisResult } from '@/types'
import { WelcomeScreen } from '@/components/screens/WelcomeScreen'
import { QuestionnaireScreen } from '@/components/screens/QuestionnaireScreen'
import { IrisUploadScreen } from '@/components/screens/IrisUploadScreen'
import { AnalysisScreen } from '@/components/screens/AnalysisScreen'
import { ReportScreen } from '@/components/screens/ReportScreen'

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome')
  const [questionnaire, setQuestionnaire] = useState<HealthQuestionnaire | undefined>()
  const [leftIris, setLeftIris] = useState<IrisImage | undefined>()
  const [rightIris, setRightIris] = useState<IrisImage | undefined>()
  const [currentResult, setCurrentResult] = useState<AIAnalysisResult | undefined>()

  const handleStartAnalysis = () => {
    setCurrentScreen('questionnaire')
  }

  const handleQuestionnaireComplete = (data: HealthQuestionnaire) => {
    setQuestionnaire(data)
    setCurrentScreen('iris-upload')
  }

  const handleIrisUploadComplete = (left?: IrisImage, right?: IrisImage) => {
    setLeftIris(left)
    setRightIris(right)
    setCurrentScreen('analysis')
  }

  const handleAnalysisComplete = (result: AIAnalysisResult) => {
    setCurrentResult(result)
    setCurrentScreen('report')
  }

  const handleNewAnalysis = () => {
    setCurrentScreen('welcome')
    setQuestionnaire(undefined)
    setLeftIris(undefined)
    setRightIris(undefined)
    setCurrentResult(undefined)
  }

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStartAnalysis} />
      )}
      
      {currentScreen === 'questionnaire' && (
        <QuestionnaireScreen 
          onComplete={handleQuestionnaireComplete}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}
      
      {currentScreen === 'iris-upload' && (
        <IrisUploadScreen
          onComplete={handleIrisUploadComplete}
          onBack={() => setCurrentScreen('questionnaire')}
        />
      )}
      
      {currentScreen === 'analysis' && questionnaire && (
        <AnalysisScreen
          questionnaire={questionnaire}
          leftIris={leftIris}
          rightIris={rightIris}
          onComplete={handleAnalysisComplete}
        />
      )}
      
      {currentScreen === 'report' && currentResult && (
        <ReportScreen
          result={currentResult}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </>
  )
}

export default App
