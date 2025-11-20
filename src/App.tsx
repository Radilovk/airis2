import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Sparkles, Activity, Heart } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

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

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Добре дошли в AIRIS - модерно уеб приложение за AI-базиран иридологичен анализ. 
              Използваме advanced AI модели (GPT-4, Gemini) за детайлен анализ на ирисите и 
              генериране на здравни препоръки.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
          </div>

          <div className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Приложението е в процес на разработка
            </h2>
            <p className="text-lg mb-6">
              Репото е успешно конфигурирано като функционално React/Vite приложение!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCount(count + 1)}
              className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Брой кликвания: {count}
            </motion.button>
          </div>

          <div className="mt-12 text-gray-500 text-sm">
            <p>⚠️ Важно: Това приложение предоставя информационни AI-базирани анализи и</p>
            <p className="font-semibold">НЕ заменя професионална медицинска консултация</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default App
