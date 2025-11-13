import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Download, 
  ArrowClockwise, 
  Share,
  Target,
  Activity,
  ClipboardText
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import type { AnalysisReport } from '@/types'
import OverviewTab from '@/components/report/tabs/OverviewTab'
import IridologyTab from '@/components/report/tabs/IridologyTab'
import PlanTab from '@/components/report/tabs/PlanTab'

interface ReportScreenProps {
  report: AnalysisReport
  onRestart: () => void
}

export default function ReportScreen({ report, onRestart }: ReportScreenProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const avgHealth = Math.round((report.leftIris.overallHealth + report.rightIris.overallHealth) / 2)

  const handleExport = () => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      let yPos = 20

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('ИРИДОЛОГИЧЕН ДОКЛАД', pageWidth / 2, yPos, { align: 'center' })
      yPos += 10

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Дата: ${new Date(report.timestamp).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, yPos, { align: 'center' })
      yPos += 15

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('БИОМЕТРИЧНИ ДАННИ', margin, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Име: ${report.questionnaireData.name}`, margin, yPos)
      yPos += 5
      doc.text(`Възраст: ${report.questionnaireData.age} години | Пол: ${report.questionnaireData.gender === 'male' ? 'Мъж' : report.questionnaireData.gender === 'female' ? 'Жена' : 'Друго'}`, margin, yPos)
      yPos += 5
      doc.text(`Тегло: ${report.questionnaireData.weight} кг | Ръст: ${report.questionnaireData.height} см | BMI: ${(report.questionnaireData.weight / ((report.questionnaireData.height / 100) ** 2)).toFixed(1)}`, margin, yPos)
      yPos += 10

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('ЗДРАВНИ ЦЕЛИ', margin, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      report.questionnaireData.goals.forEach((goal) => {
        doc.text(`• ${goal}`, margin + 5, yPos)
        yPos += 5
      })
      yPos += 5

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('ОБОБЩЕНИЕ', margin, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const summaryLines = doc.splitTextToSize(report.summary, pageWidth - 2 * margin)
      summaryLines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.text(line, margin, yPos)
        yPos += 5
      })
      yPos += 5

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('РЕЗУЛТАТИ', margin, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Общо здравословно състояние: ${avgHealth}/100`, margin, yPos)
      yPos += 5
      doc.text(`Ляв ирис: ${report.leftIris.overallHealth}/100`, margin, yPos)
      yPos += 5
      doc.text(`Десен ирис: ${report.rightIris.overallHealth}/100`, margin, yPos)
      yPos += 5
      doc.text(`Зони за внимание: ${report.leftIris.zones.filter(z => z.status !== 'normal').length + report.rightIris.zones.filter(z => z.status !== 'normal').length}`, margin, yPos)
      yPos += 10

      if (yPos > 240) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('ЛЯВ ИРИС - ЗОНИ С ОТКЛОНЕНИЯ', margin, yPos)
      yPos += 7

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      report.leftIris.zones.filter(z => z.status !== 'normal').forEach((z) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.setFont('helvetica', 'bold')
        doc.text(`${z.name} (${z.organ})`, margin, yPos)
        yPos += 4
        doc.setFont('helvetica', 'normal')
        doc.text(`Статус: ${z.status === 'attention' ? 'Внимание' : 'Притеснение'}`, margin + 5, yPos)
        yPos += 4
        const findingsLines = doc.splitTextToSize(`Находки: ${z.findings}`, pageWidth - 2 * margin - 10)
        findingsLines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          doc.text(line, margin + 5, yPos)
          yPos += 4
        })
        yPos += 2
      })

      if (yPos > 240) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('ДЕСЕН ИРИС - ЗОНИ С ОТКЛОНЕНИЯ', margin, yPos)
      yPos += 7

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      report.rightIris.zones.filter(z => z.status !== 'normal').forEach((z) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.setFont('helvetica', 'bold')
        doc.text(`${z.name} (${z.organ})`, margin, yPos)
        yPos += 4
        doc.setFont('helvetica', 'normal')
        doc.text(`Статус: ${z.status === 'attention' ? 'Внимание' : 'Притеснение'}`, margin + 5, yPos)
        yPos += 4
        const findingsLines = doc.splitTextToSize(`Находки: ${z.findings}`, pageWidth - 2 * margin - 10)
        findingsLines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          doc.text(line, margin + 5, yPos)
          yPos += 4
        })
        yPos += 2
      })

      if (yPos > 240) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('ПРЕПОРЪКИ', margin, yPos)
      yPos += 7

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      report.recommendations.forEach((rec) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.setFont('helvetica', 'bold')
        doc.text(`${rec.title} (${rec.category === 'diet' ? 'Хранене' : rec.category === 'supplement' ? 'Добавка' : 'Начин на живот'})`, margin, yPos)
        yPos += 4
        doc.setFont('helvetica', 'normal')
        const recLines = doc.splitTextToSize(rec.description, pageWidth - 2 * margin - 5)
        recLines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          doc.text(line, margin + 5, yPos)
          yPos += 4
        })
        yPos += 2
      })

      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }
      yPos += 10

      doc.setFontSize(8)
      doc.setFont('helvetica', 'italic')
      doc.text('Този доклад е генериран от AI система за иридологичен анализ и не замества професионална медицинска консултация.', pageWidth / 2, yPos, { align: 'center', maxWidth: pageWidth - 2 * margin })

      doc.save(`iridology-report-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('PDF докладът е изтеглен успешно')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Грешка при генериране на PDF')
    }
  }

  const handleShare = () => {
    const shareText = `Завърших иридологичен анализ! Общо здраве: ${avgHealth}/100. Получих ${report.recommendations.length} персонализирани препоръки.`
    
    if (navigator.share) {
      navigator.share({
        title: 'Иридологичен Анализ',
        text: shareText,
      }).then(() => {
        toast.success('Споделено успешно')
      }).catch(() => {
        toast.error('Грешка при споделяне')
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Копирано в клипборда')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText size={20} weight="duotone" className="text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold truncate">Иридологичен Доклад</h1>
                <p className="text-xs text-muted-foreground truncate">
                  {new Date(report.timestamp).toLocaleDateString('bg-BG', { 
                    day: 'numeric', 
                    month: 'short'
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 w-8 p-0">
                <Share size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExport} className="h-8 w-8 p-0">
                <Download size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={onRestart} className="h-8 w-8 p-0">
                <ArrowClockwise size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col gap-1 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Target size={20} weight="duotone" />
              <span className="text-xs font-medium">Общо състояние</span>
            </TabsTrigger>
            <TabsTrigger 
              value="iridology" 
              className="flex flex-col gap-1 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Activity size={20} weight="duotone" />
              <span className="text-xs font-medium">Анализ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="plan" 
              className="flex flex-col gap-1 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ClipboardText size={20} weight="duotone" />
              <span className="text-xs font-medium">План</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab report={report} avgHealth={avgHealth} />
          </TabsContent>

          <TabsContent value="iridology" className="mt-6">
            <IridologyTab report={report} />
          </TabsContent>

          <TabsContent value="plan" className="mt-6">
            <PlanTab report={report} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
