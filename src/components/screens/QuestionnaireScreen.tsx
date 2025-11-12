import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Heart } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import type { QuestionnaireData } from '@/types'

interface QuestionnaireScreenProps {
  onComplete: (data: QuestionnaireData) => void
  initialData: QuestionnaireData | null
}

export default function QuestionnaireScreen({ onComplete, initialData }: QuestionnaireScreenProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<QuestionnaireData>>(initialData || {
    goals: [],
    complaints: ''
  })

  const healthGoals = [
    'Подобряване на храносмилането',
    'Увеличаване на енергията',
    'Укрепване на имунната система',
    'Намаляване на стреса',
    'Подобряване на съня',
    'Детоксикация',
    'Контрол на теглото',
    'Подобряване на кожата'
  ]

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step === 1) {
      if (!data.age || !data.gender || !data.weight || !data.height) {
        toast.error('Моля, попълнете всички полета')
        return
      }
      if (data.age < 1 || data.age > 120) {
        toast.error('Моля, въведете валидна възраст')
        return
      }
    }

    if (step === 2) {
      if (!data.goals || data.goals.length === 0) {
        toast.error('Моля, изберете поне една цел')
        return
      }
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(data as QuestionnaireData)
    }
  }

  const toggleGoal = (goal: string) => {
    const currentGoals = data.goals || []
    if (currentGoals.includes(goal)) {
      setData({ ...data, goals: currentGoals.filter(g => g !== goal) })
    } else {
      setData({ ...data, goals: [...currentGoals, goal] })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart size={24} weight="duotone" className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Здравен Въпросник</h2>
              <p className="text-muted-foreground">Стъпка {step} от {totalSteps}</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        <Card className="p-6 md:p-8">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-4">Лични Данни</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Възраст *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="напр. 35"
                    value={data.age || ''}
                    onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Пол *</Label>
                  <RadioGroup
                    value={data.gender}
                    onValueChange={(value) => setData({ ...data, gender: value as any })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer">Мъж</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer">Жена</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="font-normal cursor-pointer">Друго</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weight">Тегло (кг) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="напр. 70"
                    value={data.weight || ''}
                    onChange={(e) => setData({ ...data, weight: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Ръст (см) *</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="напр. 175"
                    value={data.height || ''}
                    onChange={(e) => setData({ ...data, height: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">Здравни Цели</h3>
                <p className="text-muted-foreground">Изберете една или повече цели</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {healthGoals.map((goal) => (
                  <div
                    key={goal}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => toggleGoal(goal)}
                  >
                    <Checkbox
                      id={goal}
                      checked={data.goals?.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                    />
                    <Label htmlFor={goal} className="font-normal cursor-pointer leading-snug">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">Текущи Оплаквания</h3>
                <p className="text-muted-foreground">Опишете вашите здравни оплаквания (по избор)</p>
              </div>

              <div className="space-y-2">
                <Textarea
                  id="complaints"
                  placeholder="напр. Често уморен, главоболие, проблеми със съня..."
                  value={data.complaints}
                  onChange={(e) => setData({ ...data, complaints: e.target.value })}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Назад
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="ml-auto gap-2"
            >
              {step === totalSteps ? 'Напред към Снимките' : 'Напред'}
              <ArrowRight size={16} weight="bold" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
