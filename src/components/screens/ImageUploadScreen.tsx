import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Camera, Upload, CheckCircle, ArrowRight, X, Crop } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import IrisCropEditor from '@/components/iris/IrisCropEditor'
import type { IrisImage } from '@/types'

interface ImageUploadScreenProps {
  onComplete: (left: IrisImage, right: IrisImage) => void
  initialLeft: IrisImage | null
  initialRight: IrisImage | null
}

export default function ImageUploadScreen({ onComplete, initialLeft, initialRight }: ImageUploadScreenProps) {
  const [leftImage, setLeftImage] = useState<IrisImage | null>(initialLeft)
  const [rightImage, setRightImage] = useState<IrisImage | null>(initialRight)
  const [editingSide, setEditingSide] = useState<'left' | 'right' | null>(null)
  const [tempImageData, setTempImageData] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)
  const fileReaderRef = useRef<FileReader | null>(null)

  useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort()
      }
    }
  }, [])

  const handleFileSelect = (side: 'left' | 'right', file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Моля, качете изображение')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Файлът е твърде голям. Максимум 10MB.')
      return
    }

    setIsProcessing(true)

    if (fileReaderRef.current) {
      fileReaderRef.current.abort()
    }

    const reader = new FileReader()
    fileReaderRef.current = reader

    reader.onload = (e) => {
      try {
        const dataUrl = e.target?.result as string
        if (dataUrl && typeof dataUrl === 'string') {
          setTempImageData(dataUrl)
          setEditingSide(side)
        } else {
          throw new Error('Невалидни данни от изображението')
        }
      } catch (error) {
        console.error('Грешка при обработка на изображението:', error)
        toast.error('Грешка при обработка на изображението')
      } finally {
        setIsProcessing(false)
      }
    }

    reader.onerror = (error) => {
      console.error('Грешка при четене на файла:', error)
      toast.error('Грешка при четене на файла')
      setIsProcessing(false)
    }

    reader.onabort = () => {
      setIsProcessing(false)
    }

    try {
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Грешка при стартиране на четене:', error)
      toast.error('Грешка при зареждане на изображението')
      setIsProcessing(false)
    }
  }

  const handleCropSave = (croppedDataUrl: string) => {
    if (!editingSide) return
    
    try {
      if (!croppedDataUrl || typeof croppedDataUrl !== 'string') {
        throw new Error('Невалидни данни от crop редактора')
      }
      
      const image: IrisImage = { dataUrl: croppedDataUrl, side: editingSide }
      
      if (editingSide === 'left') {
        setLeftImage(image)
      } else {
        setRightImage(image)
      }
      
      setEditingSide(null)
      setTempImageData(null)
      toast.success(`${editingSide === 'left' ? 'Ляв' : 'Десен'} ирис запазен успешно`)
    } catch (error) {
      console.error('Грешка при запазване на изображението:', error)
      toast.error('Грешка при запазване на изображението')
      setEditingSide(null)
      setTempImageData(null)
    }
  }

  const handleCropCancel = () => {
    setEditingSide(null)
    setTempImageData(null)
    setIsProcessing(false)
  }

  const handleEditImage = (side: 'left' | 'right') => {
    const image = side === 'left' ? leftImage : rightImage
    if (!image) return
    
    setTempImageData(image.dataUrl)
    setEditingSide(side)
  }

  const handleDrop = (side: 'left' | 'right', e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(side, file)
    }
  }

  const handleNext = () => {
    if (!leftImage || !rightImage) {
      toast.error('Моля, качете и двете снимки')
      return
    }
    onComplete(leftImage, rightImage)
  }

  const removeImage = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftImage(null)
    } else {
      setRightImage(null)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Camera size={32} weight="duotone" className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Качване на Снимки</h2>
            <p className="text-muted-foreground">
              Качете ясни снимки на левия и десния си ирис
            </p>
          </motion.div>

          <Card className="p-6 mb-6 bg-secondary/30">
            <h3 className="font-semibold mb-3">📋 Инструкции за качествени снимки:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Осигурете добро осветление - естествена светлина е най-добра</li>
              <li>• Заснемете отблизо, за да се вижда ириса ясно</li>
              <li>• Уверете се, че снимката е фокусирана и не е замъглена</li>
              <li>• Избягвайте отражения и сенки</li>
              <li>• След качване, позиционирайте ириса в редактора</li>
            </ul>
          </Card>

          {isProcessing && (
            <Card className="p-4 mb-6 bg-primary/10">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <p className="text-sm font-medium">Обработка на изображението...</p>
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Ляв Ирис</Label>
                
                {!leftImage ? (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                    onDrop={(e) => handleDrop('left', e)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => leftInputRef.current?.click()}
                  >
                    <Upload size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-2">Кликнете или пуснете снимка</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG до 10MB</p>
                    <input
                      ref={leftInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect('left', file)
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={leftImage.dataUrl}
                      alt="Ляв ирис"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditImage('left')}
                        className="gap-2"
                      >
                        <Crop size={16} />
                        Редактирай
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage('left')}
                        className="gap-2"
                      >
                        <X size={16} />
                        Премахни
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2">
                      <CheckCircle size={20} weight="fill" />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Десен Ирис</Label>
                
                {!rightImage ? (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                    onDrop={(e) => handleDrop('right', e)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => rightInputRef.current?.click()}
                  >
                    <Upload size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-2">Кликнете або пуснете снимка</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG до 10MB</p>
                    <input
                      ref={rightInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect('right', file)
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={rightImage.dataUrl}
                      alt="Десен ирис"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditImage('right')}
                        className="gap-2"
                      >
                        <Crop size={16} />
                        Редактирай
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage('right')}
                        className="gap-2"
                      >
                        <X size={16} />
                        Премахни
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2">
                      <CheckCircle size={20} weight="fill" />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!leftImage || !rightImage}
              className="gap-2"
            >
              Започни Анализ
              <ArrowRight size={20} weight="bold" />
            </Button>
          </motion.div>
        </div>
      </div>

      {editingSide && tempImageData && (
        <IrisCropEditor
          imageDataUrl={tempImageData}
          side={editingSide}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </>
  )
}
