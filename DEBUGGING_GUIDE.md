# Ръководство за Диагностика на Проблеми

## Проблем: Рестартиране при Качване на Изображение

### Какво Направихме

1. **Създадена система за error logging** (`/src/lib/error-logger.ts`)
   - Записва всички грешки, предупреждения и информация
   - Автоматично улавя глобални грешки и unhandled promises
   - Персистира логовете в KV storage
   - Може да се експортират като текстов файл

2. **Интегриран error logger в App.tsx**
   - Записва всички screen transitions
   - Следи handleImagesComplete функцията
   - Валидира изображения преди преминаване към анализ

3. **Интегриран error logger в ImageUploadScreen.tsx**
   - Записва mount/unmount събития
   - Следи handleNext функцията
   - Записва размери на изображения и валидация

4. **Подобрен DiagnosticScreen**
   - Показва последните 50 error logs
   - Позволява експортиране на логовете
   - Позволява изтриване на логовете
   - Детайлен преглед на всяка грешка с данни и stack trace

### Как Да Използваш Диагностичната Система

1. **Отидете на Welcome екран**
2. **Кликнете "Диагностика" бутона** (долу в страничното меню)
3. **Опитайте да репродуцирате проблема**:
   - Върнете се на Welcome екран
   - Започнете нов анализ
   - Попълнете въпросника
   - Качете изображения
   - Кликнете "Започни Анализ"
4. **Ако приложението се рестартира, вижте логовете**:
   - Отидете отново на Diagnostics екран
   - Прегледайте Error Logs секцията
   - Последните записи ще покажат какво е станало преди рестарта

### Какво Да Търсите в Логовете

Логовете ще покажат:
- **APP_MOUNT**: Приложението е стартирано
- **UPLOAD_MOUNT**: Upload екранът е зареден
- **UPLOAD_NEXT**: Потребителят кликна "Започни Анализ"
- **APP_IMAGES_COMPLETE**: App получи изображенията
- **UPLOAD_UNMOUNT**: Upload екранът се unmount-ва
- **APP_UNMOUNT**: Цялото приложение се unmount-ва (РЕСТАРТ!)

Ако видите APP_UNMOUNT без очаквана причина, това е рестартът!

### Възможни Причини за Рестарт

1. **JavaScript грешка** - Ще се покаже в error logs със stack trace
2. **Memory pressure** - Твърде голямо изображение в паметта
3. **React state грешка** - Некоректен state update
4. **Browser crash** - Браузърът сам се рестартира

### Експортиране на Логовете

За да споделите логовете:
1. В Diagnostics екран
2. Кликнете "Експорт" в Error Logs секцията
3. Свалете `error-logs-TIMESTAMP.txt` файла
4. Споделете файла за анализ

### Следващи Стъпки

След като видим какво показват логовете, можем да:
1. Идентифицираме точната причина за рестарта
2. Добавим специфични защити срещу проблема
3. Оптимизираме memory usage ако е нужно
4. Променим flow-а на приложението ако има race condition

## Техническа Информация

### Error Logger API

```typescript
import { errorLogger } from '@/lib/error-logger'

// Log info
errorLogger.info('CONTEXT', 'Message', { data: 'optional' })

// Log warning
errorLogger.warning('CONTEXT', 'Warning message', { data: 'optional' })

// Log error
errorLogger.error('CONTEXT', 'Error message', errorObject, { data: 'optional' })

// Get logs
const logs = errorLogger.getRecentLogs(50)
const allLogs = errorLogger.getLogs()

// Export as text
const text = errorLogger.getLogsAsText()

// Clear logs
errorLogger.clearLogs()
```

### Контексти (Contexts)

- `APP_*`: Основни събития в App.tsx
- `UPLOAD_*`: События в ImageUploadScreen
- `ANALYSIS_*`: Wydarzenia в AnalysisScreen
- `GLOBAL_ERROR`: Глобални JavaScript грешки
- `UNHANDLED_PROMISE`: Unhandled promise rejections

### Персистентност

Логовете се записват автоматично в `spark.kv` storage под ключ `error-logs`.
При презареждане на страницата, логовете се запазват и могат да бъдат прегледани.
