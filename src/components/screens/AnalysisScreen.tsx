import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AIAnalysisResult, HealthQuestionnaire, IrisImage } from '@/types'

interface AnalysisScreenProps {
  questionnaire: HealthQuestionnaire
  leftIris?: IrisImage
  rightIris?: IrisImage
  onComplete: (result: AIAnalysisResult) => void
}

export function AnalysisScreen({ 
  questionnaire, 
  leftIris, 
  rightIris, 
  onComplete 
}: AnalysisScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const analysisSteps = [
    'Обработка на изображения...',
    'Анализ на ляв ирис...',
    'Анализ на десен ирис...',
    'Топографски зонов анализ...',
    'Корелация с въпросник...',
    'Генериране на препоръки...',
    'Създаване на доклад...',
    'Финализиране...',
  ]

  useEffect(() => {
    // Simulate AI analysis
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          clearInterval(interval)
          // Simulate completion
          setTimeout(() => {
            const mockResult: AIAnalysisResult = {
              id: `analysis-${Date.now()}`,
              timestamp: new Date(),
              questionnaire,
              leftIris,
              rightIris,
              analysis: {
                leftIrisZones: generateMockZones('left'),
                rightIrisZones: generateMockZones('right'),
                correlations: [
                  'Главоболието може да е свързано с находки в зона 12 (мозък)',
                  'Стресът корелира с находки в зона 3 (адренални жлези)',
                  'Стомашните проблеми съответстват на зона 6 (храносмилателна система)',
                ],
                findings: {
                  alarming: [
                    'Силни пигментации в зона 6 - препоръчва се медицинска консултация',
                  ],
                  important: [
                    'Умерени находки в зона 12 - възможен стрес или умора',
                    'Леки промени в зона 3 - адренална умора',
                  ],
                  minor: [
                    'Нормални вариации в зона 1',
                    'Липсаферни петна в зона 8',
                  ],
                },
              },
              recommendations: {
                nutrition: [
                  'Увеличете приема на зелени листни зеленчуци',
                  'Консумирайте повече антиоксиданти (боровинки, ягоди)',
                  'Намалете захарта и обработените храни',
                  'Пийте поне 2 литра вода дневно',
                ],
                supplements: [
                  'Магнезий - 400mg дневно за намаляване на стреса',
                  'Омега-3 мастни киселини - 1000mg дневно',
                  'Витамин D - 2000IU дневно',
                  'Пробиотици за здраве на червата',
                ],
                psychological: [
                  'Ежедневна медитация - 10-15 минути',
                  'Дълбоко дишане - 3 пъти дневно по 5 минути',
                  'Редовна физическа активност',
                  'Подобрете качеството на съня',
                ],
                medical: [
                  'Консултация с гастроентеролог',
                  'Кръвни изследвания - пълна кръвна картина',
                  'Изследване на щитовидната жлеза',
                ],
              },
              actionPlan: {
                phase1: [
                  'Започнете с основните хранителни промени',
                  'Добавете магнезий и витамин D',
                  'Започнете с кратки медитации',
                ],
                phase2: [
                  'Добавете омега-3 и пробиотици',
                  'Увеличете физическата активност',
                  'Направете първоначалните изследвания',
                ],
                phase3: [
                  'Оценете прогреса',
                  'Коригирайте диетата при нужда',
                  'Продължете с добавките',
                ],
                phase4: [
                  'Поддържайте постигнатите резултати',
                  'Периодични контролни прегледи',
                  'Адаптирайте плана според нуждите',
                ],
              },
            }
            onComplete(mockResult)
          }, 1000)
        }
        
        const stepIndex = Math.floor((newProgress / 100) * analysisSteps.length)
        setCurrentStep(Math.min(stepIndex, analysisSteps.length - 1))
        
        return Math.min(newProgress, 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [questionnaire, leftIris, rightIris, onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-16 h-16 text-indigo-600" />
                </motion.div>
              </div>
              <CardTitle className="text-3xl">AI Анализ в процес</CardTitle>
              <p className="text-gray-600 mt-2">
                Анализираме вашите данни с advanced AI модели...
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Прогрес</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="space-y-3">
                {analysisSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: index <= currentStep ? 1 : 0.3,
                      x: 0 
                    }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : index === currentStep ? (
                      <Loader2 className="w-5 h-5 text-indigo-600 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <p className="text-sm text-indigo-800">
                  ⏱️ Този процес може да отнеме 1-2 минути. Моля, изчакайте...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function generateMockZones(_eye: 'left' | 'right') {
  const zones = [
    { name: 'Мозък', position: 12 },
    { name: 'Ухо', position: 1 },
    { name: 'Рамо', position: 2 },
    { name: 'Адренални жлези', position: 3 },
    { name: 'Бъбреци', position: 4 },
    { name: 'Долна част на гърба', position: 5 },
    { name: 'Храносмилателна система', position: 6 },
    { name: 'Черен дроб', position: 7 },
    { name: 'Панкреас', position: 8 },
    { name: 'Сърце', position: 9 },
    { name: 'Белодробно', position: 10 },
    { name: 'Шийни прешлени', position: 11 },
  ]

  return zones.map(zone => ({
    zone: zone.position,
    name: zone.name,
    findings: Math.random() > 0.5 
      ? [`Леки промени в зона ${zone.name}`]
      : [`Нормално състояние на ${zone.name}`],
    severity: (Math.random() > 0.7 
      ? 'moderate' 
      : Math.random() > 0.5 
        ? 'minor' 
        : 'normal') as 'normal' | 'minor' | 'moderate' | 'severe',
  }))
}
