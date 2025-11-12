import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Download, 
  ArrowClockwise, 
  Warning,
  CheckCircle,
  Info,
  Leaf,
  Pill,
  Activity
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import type { AnalysisReport } from '@/types'
import IrisVisualization from '@/components/report/IrisVisualization'
import SystemScoresChart from '@/components/report/SystemScoresChart'

interface ReportScreenProps {
  report: AnalysisReport
  onRestart: () => void
}

export default function ReportScreen({ report, onRestart }: ReportScreenProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const handleExport = () => {
    const reportData = JSON.stringify(report, null, 2)
    const blob = new Blob([reportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iridology-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    toast.success('Докладът е изтеглен успешно')
  }

  const getStatusBadge = (status: 'normal' | 'attention' | 'concern') => {
    const variants = {
      normal: { variant: 'default' as const, icon: CheckCircle, text: 'Норма', color: 'text-green-600' },
      attention: { variant: 'secondary' as const, icon: Info, text: 'Внимание', color: 'text-yellow-600' },
      concern: { variant: 'destructive' as const, icon: Warning, text: 'Притеснение', color: 'text-red-600' }
    }
    const config = variants[status]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon size={14} weight="fill" className={config.color} />
        {config.text}
      </Badge>
    )
  }

  const getCategoryIcon = (category: 'diet' | 'supplement' | 'lifestyle') => {
    const icons = {
      diet: Leaf,
      supplement: Pill,
      lifestyle: Activity
    }
    return icons[category]
  }

  const getCategoryLabel = (category: 'diet' | 'supplement' | 'lifestyle') => {
    const labels = {
      diet: 'Хранене',
      supplement: 'Добавки',
      lifestyle: 'Начин на живот'
    }
    return labels[category]
  }

  const avgHealth = Math.round((report.leftIris.overallHealth + report.rightIris.overallHealth) / 2)

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText size={24} weight="duotone" className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Иридологичен Доклад</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date(report.timestamp).toLocaleDateString('bg-BG', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport} className="gap-2">
                <Download size={16} />
                Изтегли
              </Button>
              <Button variant="outline" onClick={onRestart} className="gap-2">
                <ArrowClockwise size={16} />
                Нов Анализ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Преглед</TabsTrigger>
            <TabsTrigger value="left">Ляв Ирис</TabsTrigger>
            <TabsTrigger value="right">Десен Ирис</TabsTrigger>
            <TabsTrigger value="recommendations">Препоръки</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <h2 className="text-2xl font-bold mb-4">Обобщение</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-base leading-relaxed whitespace-pre-line">{report.summary}</p>
                </div>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{avgHealth}</div>
                  <div className="text-sm text-muted-foreground">Общо Здраве (от 100)</div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {report.leftIris.zones.filter(z => z.status !== 'normal').length + 
                     report.rightIris.zones.filter(z => z.status !== 'normal').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Зони за Внимание</div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {report.leftIris.artifacts.length + report.rightIris.artifacts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Идентифицирани Артефакти</div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Оценка на Органни Системи</h3>
              <SystemScoresChart 
                leftScores={report.leftIris.systemScores}
                rightScores={report.rightIris.systemScores}
              />
            </Card>
          </TabsContent>

          <TabsContent value="left" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Ляв Ирис</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Здравословно състояние:</span>
                  <span className="text-2xl font-bold text-primary">{report.leftIris.overallHealth}/100</span>
                </div>
              </div>
              <IrisVisualization analysis={report.leftIris} />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Иридологични Зони</h3>
              <div className="space-y-4">
                {report.leftIris.zones
                  .filter(zone => zone.status !== 'normal')
                  .map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{zone.name}</h4>
                          <p className="text-sm text-muted-foreground">{zone.organ}</p>
                        </div>
                        {getStatusBadge(zone.status)}
                      </div>
                      <p className="text-sm mt-2">{zone.findings}</p>
                    </div>
                  ))}
              </div>
            </Card>

            {report.leftIris.artifacts.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Артефакти</h3>
                <div className="space-y-3">
                  {report.leftIris.artifacts.map((artifact, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Warning size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{artifact.type}</p>
                        <p className="text-sm text-muted-foreground">{artifact.location}</p>
                        <p className="text-sm mt-1">{artifact.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="right" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Десен Ирис</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Здравословно състояние:</span>
                  <span className="text-2xl font-bold text-primary">{report.rightIris.overallHealth}/100</span>
                </div>
              </div>
              <IrisVisualization analysis={report.rightIris} />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Иридологични Зони</h3>
              <div className="space-y-4">
                {report.rightIris.zones
                  .filter(zone => zone.status !== 'normal')
                  .map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{zone.name}</h4>
                          <p className="text-sm text-muted-foreground">{zone.organ}</p>
                        </div>
                        {getStatusBadge(zone.status)}
                      </div>
                      <p className="text-sm mt-2">{zone.findings}</p>
                    </div>
                  ))}
              </div>
            </Card>

            {report.rightIris.artifacts.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Артефакти</h3>
                <div className="space-y-3">
                  {report.rightIris.artifacts.map((artifact, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Warning size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{artifact.type}</p>
                        <p className="text-sm text-muted-foreground">{artifact.location}</p>
                        <p className="text-sm mt-1">{artifact.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Персонализирани Препоръки</h2>
              
              <Accordion type="multiple" className="space-y-4">
                {['diet', 'supplement', 'lifestyle'].map((category) => {
                  const categoryRecs = report.recommendations.filter(r => r.category === category)
                  if (categoryRecs.length === 0) return null
                  
                  const Icon = getCategoryIcon(category as any)
                  
                  return (
                    <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon size={20} weight="duotone" className="text-primary" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">{getCategoryLabel(category as any)}</div>
                            <div className="text-sm text-muted-foreground">{categoryRecs.length} препоръки</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Separator className="my-4" />
                        <div className="space-y-4">
                          {categoryRecs.map((rec, idx) => (
                            <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold">{rec.title}</h4>
                                <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'}>
                                  {rec.priority === 'high' ? 'Висок' : rec.priority === 'medium' ? 'Среден' : 'Нисък'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
