import { motion } from 'framer-motion'
import { Eye, Sparkles, Activity, Heart, ArrowRight, FileText, Upload, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Eye className="w-24 h-24 text-indigo-600" />
            </motion.div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            AIRIS
          </h1>
          
          <p className="text-2xl text-gray-600 mb-8">
            AI Иридологичен Анализ
          </p>

          <Card className="max-w-3xl mx-auto mb-12">
            <CardHeader>
              <CardDescription className="text-lg text-gray-700 leading-relaxed">
                Добре дошли в AIRIS - модерно уеб приложение за AI-базиран иридологичен анализ. 
                Използваме advanced AI модели (GPT-4, Gemini) за детайлен анализ на ирисите и 
                генериране на здравни препоръки.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-6 bg-indigo-50 rounded-xl">
                  <Sparkles className="w-12 h-12 text-indigo-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">AI Анализ</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Мултивалентен корелиран анализ с GPT-4 и Gemini
                  </p>
                </div>

                <div className="flex flex-col items-center p-6 bg-purple-50 rounded-xl">
                  <Activity className="w-12 h-12 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Визуализации</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Интерактивни графики и топографски карти
                  </p>
                </div>

                <div className="flex flex-col items-center p-6 bg-pink-50 rounded-xl">
                  <Heart className="w-12 h-12 text-pink-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Препоръки</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Персонализирани здравни и хранителни препоръки
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-4xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Процес на анализ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                    <FileText className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold mb-2">1. Въпросник</h4>
                  <p className="text-sm text-gray-600">Попълнете здравен въпросник</p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">2. Upload</h4>
                  <p className="text-sm text-gray-600">Качете снимки на ирисите</p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="w-8 h-8 text-pink-600" />
                  </div>
                  <h4 className="font-semibold mb-2">3. AI Анализ</h4>
                  <p className="text-sm text-gray-600">Автоматичен AI анализ</p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">4. Доклад</h4>
                  <p className="text-sm text-gray-600">Детайлен визуален репорт</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg" 
              onClick={onStart}
              className="text-lg px-12 py-6 h-auto"
            >
              Започни анализ
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <div className="mt-12 text-gray-500 text-sm">
            <p>⚠️ Важно: Това приложение предоставя информационни AI-базирани анализи и</p>
            <p className="font-semibold">НЕ заменя професионална медицинска консултация</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
