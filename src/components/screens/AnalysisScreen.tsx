import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { QuestionnaireData, IrisImage, AnalysisReport, IrisAnalysis } from '@/types'

interface AnalysisScreenProps {
  questionnaireData: QuestionnaireData
  leftIris: IrisImage
  rightIris: IrisImage
  onComplete: (report: AnalysisReport) => void
}

export default function AnalysisScreen({
  questionnaireData,
  leftIris,
  rightIris,
  onComplete
}: AnalysisScreenProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Подготовка за анализ...')

  useEffect(() => {
    performAnalysis()
  }, [])

  const performAnalysis = async () => {
    try {
      setProgress(10)
      setStatus('Анализиране на ляв ирис...')
      
      const leftAnalysis = await analyzeIris(leftIris, 'left', questionnaireData)
      
      setProgress(40)
      setStatus('Анализиране на десен ирис...')
      
      const rightAnalysis = await analyzeIris(rightIris, 'right', questionnaireData)
      
      setProgress(70)
      setStatus('Генериране на препоръки...')
      
      const recommendations = await generateRecommendations(
        leftAnalysis,
        rightAnalysis,
        questionnaireData
      )
      
      setProgress(90)
      setStatus('Подготовка на доклад...')
      
      const summary = await generateSummary(leftAnalysis, rightAnalysis, questionnaireData)
      
      setProgress(100)
      setStatus('Завършено!')
      
      const report: AnalysisReport = {
        timestamp: new Date().toISOString(),
        questionnaireData,
        leftIris: leftAnalysis,
        rightIris: rightAnalysis,
        recommendations,
        summary
      }
      
      setTimeout(() => {
        onComplete(report)
      }, 1000)
    } catch (error) {
      console.error('Analysis error:', error)
      setStatus('Грешка при анализа. Моля, опитайте отново.')
    }
  }

  const analyzeIris = async (
    iris: IrisImage,
    side: 'left' | 'right',
    questionnaire: QuestionnaireData
  ): Promise<IrisAnalysis> => {
    const prompt = (window.spark.llmPrompt as any)`Ти си експерт иридолог. Анализирай този ${side === 'left' ? 'ляв' : 'десен'} ирис и генерирай детайлен иридологичен анализ.

Пациент информация:
- Възраст: ${questionnaire.age}
- Пол: ${questionnaire.gender === 'male' ? 'мъж' : questionnaire.gender === 'female' ? 'жена' : 'друго'}
- BMI: ${(questionnaire.weight / ((questionnaire.height / 100) ** 2)).toFixed(1)}
- Здравни цели: ${questionnaire.goals.join(', ')}
- Оплаквания: ${questionnaire.complaints || 'Няма'}

Анализирай според 12-те иридологични зони (по часовника):
1. Мозък/Хипофиза (12:00)
2. Бронхи/Щитовидна жлеза (1:00)
3. Рамо/Белодробна зона (2:00)
4. Черен дроб/Жлъчка (3:00 за десен, 9:00 за ляв)
5. Стомах/Панкреас (4:00-5:00)
6. Дебело черво (5:00-7:00)
7. Урогенитална зона (6:00)
8. Бъбреци (5:00-7:00)
9. Далак (3:00 за ляв, 9:00 за десен)
10. Сърце (2:00-3:00 за ляв)
11. Ендокринна система (централно)
12. Нервна система (автономен пръстен)

За всяка зона оцени:
- Статус: normal (норма), attention (внимание), concern (притеснение)
- Конкретни находки

Също така идентифицирай типични иридологични артефакти:
- Лакуни (празнини в структурата)
- Криптe (вдлъбнатини)
- Пигментни петна
- Радиални линии
- Контракционни пръстени
- Плътност на ириса

Генерирай оценки за различни органни системи (0-100):
- Храносмилателна система
- Имунна система  
- Нервна система
- Сърдечно-съдова система
- Детоксикация
- Ендокринна система

Върни резултата като JSON обект с property "analysis" съдържащ: 
{
  "zones": [{"id": 1-12, "name": "име на зоната", "organ": "орган", "status": "normal/attention/concern", "findings": "описание", "angle": [начало, край в градуси]}],
  "artifacts": [{"type": "тип", "location": "локация", "description": "описание", "severity": "low/medium/high"}],
  "overallHealth": 0-100,
  "systemScores": [{"system": "система", "score": 0-100, "description": "кратко описание"}]
}`

    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const parsed = JSON.parse(response)
    
    return {
      side,
      ...parsed.analysis
    }
  }

  const generateRecommendations = async (
    leftAnalysis: IrisAnalysis,
    rightAnalysis: IrisAnalysis,
    questionnaire: QuestionnaireData
  ) => {
    const prompt = (window.spark.llmPrompt as any)`Базирано на иридологичния анализ, генерирай персонализирани препоръки на български език.

Ляв ирис находки: ${JSON.stringify(leftAnalysis.zones.filter(z => z.status !== 'normal'))}
Десен ирис находки: ${JSON.stringify(rightAnalysis.zones.filter(z => z.status !== 'normal'))}

Здравни цели: ${questionnaire.goals.join(', ')}
Оплаквания: ${questionnaire.complaints || 'Няма'}

Генерирай минимум:
- 5 специфични хранителни препоръки (храни за консумация/избягване)
- 3-5 препоръки за хранителни добавки
- 2-3 препоръки за начин на живот

Всяка препоръка трябва да има:
- category: "diet", "supplement" или "lifestyle"
- title: кратко заглавие
- description: подробно обяснение (2-3 изречения)
- priority: "high", "medium" или "low"

Върни като JSON с property "recommendations" съдържащ масив от препоръки.`

    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const parsed = JSON.parse(response)
    return parsed.recommendations
  }

  const generateSummary = async (
    leftAnalysis: IrisAnalysis,
    rightAnalysis: IrisAnalysis,
    questionnaire: QuestionnaireData
  ) => {
    const prompt = (window.spark.llmPrompt as any)`Генерирай кратко резюме (3-4 параграфа) на иридологичния анализ на български език.

Общо здравословно състояние:
- Ляв ирис: ${leftAnalysis.overallHealth}/100
- Десен ирис: ${rightAnalysis.overallHealth}/100

Основни находки (зони с проблеми):
Ляв: ${leftAnalysis.zones.filter(z => z.status !== 'normal').map(z => z.organ).join(', ')}
Десен: ${rightAnalysis.zones.filter(z => z.status !== 'normal').map(z => z.organ).join(', ')}

Здравни цели на пациента: ${questionnaire.goals.join(', ')}

Създай професионално, но разбираемо резюме което:
1. Обобщава общото здравословно състояние
2. Посочва основните зони, които изискват внимание
3. Свързва находките със заявените здравни цели
4. Дава обща перспектива и насърчение

Върни само текста на резюмето (не JSON).`

    const response = await window.spark.llm(prompt, 'gpt-4o', false)
    return response
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="p-8 md:p-12">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6"
            >
              <Sparkle size={40} weight="duotone" className="text-primary-foreground" />
            </motion.div>

            <h2 className="text-2xl font-bold mb-2">AI Анализ в ход</h2>
            <p className="text-muted-foreground mb-8">
              Анализираме вашите ириси с изкуствен интелект
            </p>

            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <p className="text-sm font-medium text-center">{status}</p>
              <p className="text-xs text-muted-foreground text-center">
                {progress}% завършено
              </p>
            </div>

            <div className="mt-8 space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${progress >= 10 ? 'bg-primary' : 'bg-muted'}`} />
                <span className={progress >= 10 ? 'text-foreground' : 'text-muted-foreground'}>
                  Анализ на структура
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${progress >= 40 ? 'bg-primary' : 'bg-muted'}`} />
                <span className={progress >= 40 ? 'text-foreground' : 'text-muted-foreground'}>
                  Картографиране на зони
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${progress >= 70 ? 'bg-primary' : 'bg-muted'}`} />
                <span className={progress >= 70 ? 'text-foreground' : 'text-muted-foreground'}>
                  Генериране на препоръки
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${progress >= 90 ? 'bg-primary' : 'bg-muted'}`} />
                <span className={progress >= 90 ? 'text-foreground' : 'text-muted-foreground'}>
                  Финализиране на доклад
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
