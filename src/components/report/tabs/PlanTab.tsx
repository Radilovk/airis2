import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { 
  CaretDown,
  Leaf,
  Pill,
  Heart,
  Brain,
  Flask,
  Lightbulb,
  AppleLogo,
  WarningCircle
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { AnalysisReport, Recommendation } from '@/types'
import { cn } from '@/lib/utils'

interface PlanTabProps {
  report: AnalysisReport
}

interface PlanSection {
  id: string
  title: string
  icon: typeof AppleLogo
  content: string[]
  priority?: 'high' | 'medium' | 'low'
}

export default function PlanTab({ report }: PlanTabProps) {
  const planSections = extractPlanSections(report)

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10">
          <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
            <Lightbulb size={20} weight="duotone" className="text-primary" />
            Персонализиран План
          </h3>
          <p className="text-sm text-muted-foreground">
            Базиран на вашия иридологичен анализ и здравословни цели
          </p>
        </Card>
      </motion.div>

      <div className="space-y-2.5">
        {planSections.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <CollapsibleSection section={section} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CollapsibleSection({ section }: { section: PlanSection }) {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = section.icon

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden transition-all">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
              <Icon size={18} weight="duotone" className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="font-semibold text-sm">{section.title}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              {section.content.length}
            </Badge>
            <CaretDown 
              size={18} 
              className={cn(
                "text-muted-foreground transition-transform duration-200",
                isOpen && "transform rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 space-y-2">
            {section.content.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2.5 p-3 bg-muted/30 rounded-lg border"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

function extractPlanSections(report: AnalysisReport): PlanSection[] {
  const sections: PlanSection[] = []

  const generalRecs = extractGeneralRecommendations(report)
  if (generalRecs.length > 0) {
    sections.push({
      id: 'general',
      title: 'Общи Препоръки',
      icon: Lightbulb,
      content: generalRecs
    })
  }

  const recommendedFoods = extractFoodRecommendations(report, 'recommended')
  if (recommendedFoods.length > 0) {
    sections.push({
      id: 'recommended-foods',
      title: 'Препоръчителни Храни',
      icon: AppleLogo,
      content: recommendedFoods
    })
  }

  const avoidFoods = extractFoodRecommendations(report, 'avoid')
  if (avoidFoods.length > 0) {
    sections.push({
      id: 'avoid-foods',
      title: 'Храни за Избягване',
      icon: WarningCircle,
      content: avoidFoods
    })
  }

  const supplements = extractSupplementRecommendations(report)
  if (supplements.length > 0) {
    sections.push({
      id: 'supplements',
      title: 'Хранителни Добавки - Дозировка и Прием',
      icon: Pill,
      content: supplements
    })
  }

  const psychological = extractPsychologicalRecommendations(report)
  if (psychological.length > 0) {
    sections.push({
      id: 'psychological',
      title: 'Психологически Препоръки',
      icon: Brain,
      content: psychological
    })
  }

  const special = extractSpecialRecommendations(report)
  if (special.length > 0) {
    sections.push({
      id: 'special',
      title: 'Специални (Индивидуални) Препоръки',
      icon: Leaf,
      content: special
    })
  }

  const tests = extractTestRecommendations(report)
  if (tests.length > 0) {
    sections.push({
      id: 'tests',
      title: 'Препоръчителни Конкретни Изследвания',
      icon: Flask,
      content: tests
    })
  }

  return sections
}

function extractGeneralRecommendations(report: AnalysisReport): string[] {
  const recs: string[] = []
  
  const avgHealth = (report.leftIris.overallHealth + report.rightIris.overallHealth) / 2
  
  if (avgHealth < 60) {
    recs.push('Фокусирайте се върху възстановяване на основните функции на организма')
  }
  
  if (report.questionnaireData.stressLevel === 'high' || report.questionnaireData.stressLevel === 'very-high') {
    recs.push('Приоритизирайте управлението на стреса чрез медитация, йога или дълбоко дишане')
  }
  
  if (report.questionnaireData.sleepHours < 7) {
    recs.push('Увеличете продължителността на съня до минимум 7-8 часа на нощ')
  }

  if (report.questionnaireData.hydration < 2) {
    recs.push('Увеличете приема на вода до минимум 2 литра дневно')
  }

  if (report.questionnaireData.activityLevel === 'sedentary') {
    recs.push('Постепенно увеличавайте физическата активност - започнете с 20-30 минути дневно ходене')
  }

  return recs
}

function extractFoodRecommendations(report: AnalysisReport, type: 'recommended' | 'avoid'): string[] {
  const foods: string[] = []
  
  const dietRecs = report.recommendations.filter(r => 
    r.category === 'diet' && 
    r.description.toLowerCase().includes(type === 'recommended' ? 'включ' : 'избяг')
  )

  dietRecs.forEach(rec => {
    const lines = rec.description.split('\n')
    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed && (
        (type === 'recommended' && (trimmed.includes('включ') || trimmed.includes('консум') || trimmed.includes('приемай'))) ||
        (type === 'avoid' && (trimmed.includes('избяг') || trimmed.includes('огранич') || trimmed.includes('редуц')))
      )) {
        foods.push(trimmed.replace(/^[•\-*]\s*/, ''))
      }
    })
  })

  if (type === 'recommended' && foods.length === 0) {
    const concernedSystems = [
      ...report.leftIris.zones.filter(z => z.status === 'concern'),
      ...report.rightIris.zones.filter(z => z.status === 'concern')
    ]

    concernedSystems.forEach(zone => {
      if (zone.organ.toLowerCase().includes('черен дроб')) {
        foods.push('Зелени листни зеленчуци (спанак, къдраво зеле)')
        foods.push('Куркума и джинджифил')
      }
      if (zone.organ.toLowerCase().includes('бъбрек')) {
        foods.push('Червени плодове (червени боровинки)')
        foods.push('Корнишони и целина')
      }
    })
  }

  return [...new Set(foods)]
}

function extractSupplementRecommendations(report: AnalysisReport): string[] {
  const supplements: string[] = []
  
  const suppRecs = report.recommendations.filter(r => r.category === 'supplement')
  
  suppRecs.forEach(rec => {
    supplements.push(`${rec.title}: ${rec.description}`)
  })

  if (supplements.length === 0) {
    supplements.push('Мултивитамин комплекс - 1 капсула дневно по време на хранене')
    supplements.push('Омега-3 мастни киселини - 1000-2000мг дневно с храна')
    supplements.push('Пробиотици - 1 капсула сутрин на гладно')
  }

  supplements.push('💡 Приемайте хранителни добавки по време на хранене за по-добра абсорбция')
  supplements.push('💡 Започнете с по-ниски дози и постепенно увеличавайте')
  
  if (report.questionnaireData.medications && report.questionnaireData.medications.trim() !== '') {
    supplements.push('⚠️ Консултирайте се с лекар за взаимодействия с текущите ви медикаменти')
  }

  return supplements
}

function extractPsychologicalRecommendations(report: AnalysisReport): string[] {
  const psych: string[] = []
  
  if (report.questionnaireData.stressLevel === 'high' || report.questionnaireData.stressLevel === 'very-high') {
    psych.push('Практикувайте ежедневна медитация или майндфулнес - 10-15 минути')
    psych.push('Водете дневник за емоциите и стресорите')
    psych.push('Потърсете подкрепа от психолог или терапевт при нужда')
  }

  if (report.questionnaireData.sleepQuality === 'poor' || report.questionnaireData.sleepQuality === 'fair') {
    psych.push('Създайте релаксираща вечерна рутина преди сън')
    psych.push('Избягвайте екрани 1-2 часа преди лягане')
  }

  psych.push('Култивирайте благодарност - запишете 3 неща, за които сте благодарни всеки ден')
  psych.push('Поддържайте социални връзки и качествени взаимоотношения')

  return psych
}

function extractSpecialRecommendations(report: AnalysisReport): string[] {
  const special: string[] = []
  
  report.questionnaireData.goals.forEach(goal => {
    if (goal.toLowerCase().includes('отслабване')) {
      special.push('За отслабване: Комбинирайте калорийна рестрикция с интервално гладуване (16:8)')
      special.push('Включете силова тренировка 2-3 пъти седмично за запазване на мускулна маса')
    }
    
    if (goal.toLowerCase().includes('антиейджинг')) {
      special.push('За антиейджинг: Приоритизирайте антиоксидантни храни (боровинки, зелен чай)')
      special.push('Разгледайте колагенови добавки и витамин C за здраве на кожата')
    }

    if (goal.toLowerCase().includes('мускул')) {
      special.push('За мускулна маса: Увеличете протеиновия прием до 1.6-2.2г/кг телесно тегло')
      special.push('Фокусирайте се върху прогресивно претоварване в тренировките')
    }
  })

  if (report.questionnaireData.healthStatus.includes('Диабет тип 2') || 
      report.questionnaireData.healthStatus.includes('Инсулинова резистентност')) {
    special.push('Следете гликемичния индекс на храните и избягвайте рафинирани въглехидрати')
    special.push('Разгледайте хром и берберин за подкрепа на кръвната захар')
  }

  return special
}

function extractTestRecommendations(report: AnalysisReport): string[] {
  const tests: string[] = []
  
  const concernZones = [
    ...report.leftIris.zones.filter(z => z.status === 'concern'),
    ...report.rightIris.zones.filter(z => z.status === 'concern')
  ]

  concernZones.forEach(zone => {
    if (zone.organ.toLowerCase().includes('черен дроб')) {
      tests.push('Чернодробни функционални тестове (AST, ALT, GGT)')
    }
    if (zone.organ.toLowerCase().includes('бъбрек')) {
      tests.push('Бъбречни функционални тестове (креатинин, урея)')
    }
    if (zone.organ.toLowerCase().includes('щитовидна')) {
      tests.push('Хормонален панел на щитовидната жлеза (TSH, T3, T4)')
    }
  })

  tests.push('Пълна кръвна картина')
  tests.push('Липиден профил (холестерол, триглицериди)')
  tests.push('Витамин D нива')

  return [...new Set(tests)]
}
