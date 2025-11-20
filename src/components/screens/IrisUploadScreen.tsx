import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, ArrowRight, ArrowLeft, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IrisImage } from '@/types'

interface IrisUploadScreenProps {
  onComplete: (leftIris?: IrisImage, rightIris?: IrisImage) => void
  onBack: () => void
}

export function IrisUploadScreen({ onComplete, onBack }: IrisUploadScreenProps) {
  const [leftIris, setLeftIris] = useState<IrisImage | undefined>()
  const [rightIris, setRightIris] = useState<IrisImage | undefined>()
  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (file: File, eye: 'left' | 'right') => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      const irisImage: IrisImage = {
        id: `${eye}-${Date.now()}`,
        eye,
        imageData,
        timestamp: new Date(),
        processed: false,
      }

      if (eye === 'left') {
        setLeftIris(irisImage)
      } else {
        setRightIris(irisImage)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, eye: 'left' | 'right') => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file, eye)
    }
  }

  const canProceed = leftIris || rightIris

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload на Iris изображения</h1>
            <p className="text-gray-600">Качете снимки на левия и/или десния ирис</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Инструкции</CardTitle>
              <CardDescription>
                За най-добри резултати, следвайте тези насоки:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Използвайте добро осветление</li>
                <li>✓ Снимката трябва да е ясна и фокусирана</li>
                <li>✓ Ирисът трябва да заема по-голямата част от снимката</li>
                <li>✓ Избягвайте отражения и засенчвания</li>
                <li>✓ Максимален размер: 5MB</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Eye */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-indigo-600" />
                  Ляв ирис
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leftIris ? (
                  <div className="relative">
                    <img
                      src={leftIris.imageData}
                      alt="Left iris"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setLeftIris(undefined)}
                      className="mt-4 w-full"
                    >
                      Премахни
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      onClick={() => leftInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Кликнете за избор на файл</p>
                      <p className="text-xs text-gray-500">или плъзнете файл тук</p>
                    </div>
                    <input
                      ref={leftInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'left')}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => leftInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Избери файл
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Eye */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-600" />
                  Десен ирис
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rightIris ? (
                  <div className="relative">
                    <img
                      src={rightIris.imageData}
                      alt="Right iris"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setRightIris(undefined)}
                      className="mt-4 w-full"
                    >
                      Премахни
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      onClick={() => rightInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Кликнете за избор на файл</p>
                      <p className="text-xs text-gray-500">или плъзнете файл тук</p>
                    </div>
                    <input
                      ref={rightInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'right')}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => rightInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Избери файл
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {!canProceed && (
            <Card className="mb-8 border-amber-200 bg-amber-50">
              <CardContent className="py-4">
                <p className="text-sm text-amber-800">
                  ℹ️ Моля, качете поне един ирис за да продължите
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Назад
            </Button>

            <Button 
              onClick={() => onComplete(leftIris, rightIris)}
              disabled={!canProceed}
            >
              Продължи към анализ
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
