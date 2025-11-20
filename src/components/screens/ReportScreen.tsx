import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Download, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsTrigger } from '@/components/ui/tabs'
import { AIAnalysisResult } from '@/types'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts'

interface ReportScreenProps {
  result: AIAnalysisResult
  onNewAnalysis: () => void
}

export function ReportScreen({ result, onNewAnalysis }: ReportScreenProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Prepare chart data
  const systemComparisonData = [
    { system: 'Нервна', left: 75, right: 82 },
    { system: 'Храносмилателна', left: 60, right: 65 },
    { system: 'Сърдечно-съдова', left: 88, right: 90 },
    { system: 'Дихателна', left: 85, right: 83 },
  ]

  const zoneStatusData = [
    { name: 'Нормално', value: 8, color: '#10b981' },
    { name: 'Леки промени', value: 3, color: '#3b82f6' },
    { name: 'Умерени промени', value: 1, color: '#f59e0b' },
    { name: 'Сериозни', value: 0, color: '#ef4444' },
  ]

  const progressData = [
    { month: 'Текущо', score: 65 },
    { month: '1 месец', score: 70 },
    { month: '2 месеца', score: 75 },
    { month: '3 месеца', score: 80 },
    { month: '4 месеца', score: 85 },
    { month: '6 месеца', score: 90 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Резултати от анализа</h1>
              <p className="text-gray-600">
                {new Date(result.timestamp).toLocaleDateString('bg-BG', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Експорт
              </Button>
              <Button onClick={onNewAnalysis}>
                <Home className="w-4 h-4 mr-2" />
                Нов анализ
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
              <TabsTrigger 
                value="overview" 
                isActive={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                className="flex-1"
              >
                Общ преглед
              </TabsTrigger>
              <TabsTrigger 
                value="iridology" 
                isActive={activeTab === 'iridology'}
                onClick={() => setActiveTab('iridology')}
                className="flex-1"
              >
                Иридология
              </TabsTrigger>
              <TabsTrigger 
                value="plan" 
                isActive={activeTab === 'plan'}
                onClick={() => setActiveTab('plan')}
                className="flex-1"
              >
                План за действие
              </TabsTrigger>
            </div>

            <div className={activeTab === 'overview' ? '' : 'hidden'}>
              <div className="space-y-6">
                {/* Findings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Находки</CardTitle>
                    <CardDescription>Категоризирани резултати от анализа</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.analysis.findings.alarming.length > 0 && (
                      <div className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                          <h4 className="font-semibold text-red-900">Алармиращи</h4>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {result.analysis.findings.alarming.map((finding, i) => (
                            <li key={i} className="text-red-700">• {finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.analysis.findings.important.length > 0 && (
                      <div className="border-l-4 border-amber-500 pl-4 py-2">
                        <div className="flex items-center mb-2">
                          <Info className="w-5 h-5 text-amber-500 mr-2" />
                          <h4 className="font-semibold text-amber-900">Важни</h4>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {result.analysis.findings.important.map((finding, i) => (
                            <li key={i} className="text-amber-700">• {finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.analysis.findings.minor.length > 0 && (
                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2" />
                          <h4 className="font-semibold text-blue-900">Второстепенни</h4>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {result.analysis.findings.minor.map((finding, i) => (
                            <li key={i} className="text-blue-700">• {finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Health Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Прогнозен прогрес</CardTitle>
                    <CardDescription>Очакван здравен статус при следване на препоръките</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          name="Здравен резултат"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Zone Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Статус на зоните</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={zoneStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {zoneStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Сравнение ляв/десен</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={systemComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="system" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="left" fill="#6366f1" name="Ляв ирис" />
                          <Bar dataKey="right" fill="#a855f7" name="Десен ирис" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className={activeTab === 'iridology' ? '' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.leftIris && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Ляв ирис - Анализ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={result.leftIris.imageData} 
                        alt="Left iris" 
                        className="w-full rounded-lg mb-4"
                      />
                      <div className="space-y-2">
                        {result.analysis.leftIrisZones.slice(0, 4).map((zone, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-semibold">Зона {zone.zone} ({zone.name}):</span>
                            <span className="text-gray-600 ml-2">{zone.findings[0]}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {result.rightIris && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Десен ирис - Анализ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={result.rightIris.imageData} 
                        alt="Right iris" 
                        className="w-full rounded-lg mb-4"
                      />
                      <div className="space-y-2">
                        {result.analysis.rightIrisZones.slice(0, 4).map((zone, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-semibold">Зона {zone.zone} ({zone.name}):</span>
                            <span className="text-gray-600 ml-2">{zone.findings[0]}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Корелации</CardTitle>
                    <CardDescription>Връзки между иридологичните находки и симптомите</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.analysis.correlations.map((correlation, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-indigo-600 mr-2">→</span>
                          <span className="text-gray-700">{correlation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className={activeTab === 'plan' ? '' : 'hidden'}>
              <div className="space-y-6">
                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>🥗 Хранене</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.nutrition.map((rec, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>💊 Добавки</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.supplements.map((rec, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>🧘 Психологическо</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.psychological.map((rec, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>🔬 Медицински</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.medical.map((rec, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Plan Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>План за действие (Timeline)</CardTitle>
                    <CardDescription>Поетапен план за следващите 6+ месеца</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { phase: 'Фаза 1 (0-2 месеца)', items: result.actionPlan.phase1, color: 'indigo' },
                        { phase: 'Фаза 2 (2-4 месеца)', items: result.actionPlan.phase2, color: 'purple' },
                        { phase: 'Фаза 3 (4-6 месеца)', items: result.actionPlan.phase3, color: 'pink' },
                        { phase: 'Фаза 4 (6+ месеца)', items: result.actionPlan.phase4, color: 'green' },
                      ].map((phase, index) => (
                        <div key={index} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-0">
                          <div className={`absolute left-0 top-0 w-4 h-4 rounded-full bg-${phase.color}-500 -translate-x-[9px]`} />
                          <h4 className="font-semibold text-lg mb-2">{phase.phase}</h4>
                          <ul className="space-y-1">
                            {phase.items.map((item, i) => (
                              <li key={i} className="text-sm text-gray-700">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
