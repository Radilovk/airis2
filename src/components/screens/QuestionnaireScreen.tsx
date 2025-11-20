import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { HealthQuestionnaire } from '@/types'

interface QuestionnaireScreenProps {
  onComplete: (data: HealthQuestionnaire) => void
  onBack: () => void
}

export function QuestionnaireScreen({ onComplete, onBack }: QuestionnaireScreenProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const [formData, setFormData] = useState<HealthQuestionnaire>({
    personalInfo: {
      name: '',
      age: 0,
      gender: 'other',
      occupation: '',
      weight: 0,
      height: 0,
    },
    symptoms: [],
    medicalHistory: [],
    lifestyle: {
      sleepHours: 7,
      exerciseFrequency: '',
      diet: '',
      smoking: false,
      alcohol: false,
    },
    familyHistory: [],
    emotionalState: [],
    additionalNotes: '',
  })

  const commonSymptoms = [
    'Главоболие', 'Умора', 'Безсъние', 'Стрес', 'Тревожност',
    'Стомашни проблеми', 'Гадене', 'Задух', 'Болки в ставите',
    'Болки в гърба', 'Алергии', 'Кожни проблеми', 'Замаяност'
  ]

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(formData)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      onBack()
    }
  }

  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Здравен въпросник</h1>
            <p className="text-gray-600">Стъпка {step} от {totalSteps}</p>
            <Progress value={progress} className="mt-4" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && 'Персонална информация'}
                {step === 2 && 'Симптоми и здравословно състояние'}
                {step === 3 && 'Начин на живот'}
                {step === 4 && 'Семейна история и допълнителни данни'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Моля, попълнете вашите основни данни'}
                {step === 2 && 'Изберете симптомите, които изпитвате'}
                {step === 3 && 'Информация за вашия начин на живот'}
                {step === 4 && 'Допълнителна информация за по-точен анализ'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div>
                    <Label htmlFor="name">Име</Label>
                    <Input
                      id="name"
                      value={formData.personalInfo.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: e.target.value }
                      }))}
                      placeholder="Въведете вашето име"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Възраст</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.personalInfo.age || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, age: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="Години"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">Пол</Label>
                      <select
                        id="gender"
                        value={formData.personalInfo.gender}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, gender: e.target.value as any }
                        }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="male">Мъж</option>
                        <option value="female">Жена</option>
                        <option value="other">Друго</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="occupation">Професия</Label>
                    <Input
                      id="occupation"
                      value={formData.personalInfo.occupation}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, occupation: e.target.value }
                      }))}
                      placeholder="Вашата професия"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Тегло (кг)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.personalInfo.weight || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, weight: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="кг"
                      />
                    </div>

                    <div>
                      <Label htmlFor="height">Ръст (см)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.personalInfo.height || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, height: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="см"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <Label>Изберете симптомите, които изпитвате:</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {commonSymptoms.map((symptom) => (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => handleSymptomToggle(symptom)}
                          className={`p-3 rounded-lg border-2 text-sm transition-colors ${
                            formData.symptoms.includes(symptom)
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="medicalHistory">Медицинска история (заболявания)</Label>
                    <Textarea
                      id="medicalHistory"
                      value={formData.medicalHistory.join(', ')}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        medicalHistory: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      placeholder="Например: диабет, хипертония, астма..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <Label htmlFor="sleepHours">Часове сън на нощ</Label>
                    <Input
                      id="sleepHours"
                      type="number"
                      min="0"
                      max="24"
                      value={formData.lifestyle.sleepHours}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        lifestyle: { ...prev.lifestyle, sleepHours: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="exercise">Физическа активност</Label>
                    <select
                      id="exercise"
                      value={formData.lifestyle.exerciseFrequency}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        lifestyle: { ...prev.lifestyle, exerciseFrequency: e.target.value }
                      }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Изберете...</option>
                      <option value="none">Никаква</option>
                      <option value="rare">Рядко (1-2 пъти месечно)</option>
                      <option value="moderate">Умерено (1-2 пъти седмично)</option>
                      <option value="regular">Редовно (3-5 пъти седмично)</option>
                      <option value="intense">Интензивно (всеки ден)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="diet">Хранителен режим</Label>
                    <Input
                      id="diet"
                      value={formData.lifestyle.diet}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        lifestyle: { ...prev.lifestyle, diet: e.target.value }
                      }))}
                      placeholder="Например: вегетариански, всеядна, кето..."
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="smoking"
                        checked={formData.lifestyle.smoking}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, smoking: e.target.checked }
                        }))}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="smoking" className="font-normal">Пуша</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="alcohol"
                        checked={formData.lifestyle.alcohol}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, alcohol: e.target.checked }
                        }))}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="alcohol" className="font-normal">Консумирам алкохол редовно</Label>
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div>
                    <Label htmlFor="familyHistory">Семейна анамнеза</Label>
                    <Textarea
                      id="familyHistory"
                      value={formData.familyHistory.join(', ')}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        familyHistory: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      placeholder="Заболявания в семейството (диабет, сърдечни проблеми и др.)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Емоционално състояние</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {['Спокоен/на', 'Тревожен/на', 'Стресиран/а', 'Щастлив/а', 'Депресиран/а', 'Енергичен/на'].map((state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              emotionalState: prev.emotionalState.includes(state)
                                ? prev.emotionalState.filter(s => s !== state)
                                : [...prev.emotionalState, state]
                            }))
                          }}
                          className={`p-3 rounded-lg border-2 text-sm transition-colors ${
                            formData.emotionalState.includes(state)
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additionalNotes">Допълнителни бележки</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        additionalNotes: e.target.value
                      }))}
                      placeholder="Всякаква друга информация, която смятате за важна..."
                      rows={4}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Назад
            </Button>

            <Button onClick={handleNext}>
              {step === totalSteps ? 'Завърши' : 'Напред'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
