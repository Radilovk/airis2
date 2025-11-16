# ДИАГНОЗА: Защо качването на изображения продължава да не работи

## КРИТИЧЕН ПРОБЛЕМ ИДЕНТИФИЦИРАН

След детайлен анализ на кода, открих **главната причина** за срива на приложението при качване на изображения.

## ПРОБЛЕМЪТ

### 1. **useKV Hook се използва НЕПРАВИЛНО в App.tsx**

В `App.tsx` (редове 26-31):

```typescript
const [questionnaireData, setQuestionnaireData] = useKV<QuestionnaireData | null>('questionnaire-data', null)
const [analysisReport, setAnalysisReport] = useKV<AnalysisReport | null>('analysis-report', null)
const [history, setHistory] = useKV<AnalysisReport[]>('analysis-history', [])
```

**ПРОБЛЕМ**: Тези данни се опитват да запишат **ОГРОМНИ изображения** (base64 data URLs) в KV storage, което:
- Причинява **quota exceeded** грешки
- **Замразява** браузъра при опит за сериализация
- **Крашва** приложението когато паметта се изчерпи

### 2. **Изображенията се записват ДВОЙНО**

В `App.tsx`, функцията `handleAnalysisComplete` (редове 226-256):

```typescript
// Записва ПЪЛНИЯ репорт с изображения в useKV
setAnalysisReport(() => report)  // ← ОГРОМЕН размер!

// После записва "лек" репорт БЕЗ изображения в историята
const lightReport: AnalysisReport = {
  ...report,
  leftIrisImage: { dataUrl: '', side: 'left' },  // ← Празен
  rightIrisImage: { dataUrl: '', side: 'right' }  // ← Празен
}
setHistory((current) => [lightReport, ...(current || [])])
```

**ПРОБЛЕМ**: 
- `setAnalysisReport()` записва пълния репорт с 2 x ~200KB изображения = ~400KB
- Това се опитва да се запази в KV storage
- KV storage **НЕ Е ПРЕДНАЗНАЧЕН** за големи binary данни
- Когато размерът надвиши лимита → **CRASH**

### 3. **Ref-овете се използват правилно, НО...**

В `App.tsx` (редове 27-28):
```typescript
const leftIrisRef = useRef<IrisImage | null>(null)
const rightIrisRef = useRef<IrisImage | null>(null)
```

**ДОБРЕ**: Ref-овете са правилни за временно съхранение.

**ЛОШО**: След като изображенията се преминат към `AnalysisScreen`, те се записват в репорта, който се опитва да се запази в KV storage!

## ЗАЩО РАБОТЕШЕ ПРЕДИ?

Вероятно преди 2 дни:
1. Изображенията бяха **по-малки**
2. Имаше **по-малко история** в storage
3. Браузърът имаше **повече свободна памет**

Сега:
- Storage е **запълнен** със стари репорти
- Всеки опит да се запише нов репорт → **превишава квотата**
- Приложението → **CRASH**

## РЕШЕНИЕТО

### Опция 1: НЕ ЗАПИСВАЙ изображенията в KV storage (ПРЕПОРЪЧИТЕЛНО)

Изображенията трябва да:
- Живеят САМО в **ref-ове** докато са нужни
- **НЕ се записват** в persistent storage
- Се изтриват след преглед на репорта

### Опция 2: Използвай IndexedDB вместо KV

KV storage е за малки JSON данни, НЕ за изображения.
IndexedDB може да съхранява големи binary данни.

### Опция 3: Изпрати изображенията към сървър

Качи изображенията на сървър и пази само URL-и.

## КОНКРЕТНИ ПРОМЕНИ КОИТО ТРЯБВА ДА СЕ НАПРАВЯТ

### 1. Премахни изображенията от историята (ВЕЧЕ НАПРАВЕНО)

✅ В `handleAnalysisComplete` вече се записват "леки" репорти без изображения.

### 2. ⚠️ НЕ ЗАПИСВАЙ текущия репорт в KV storage

❌ **ПРОБЛЕМ**: `setAnalysisReport(() => report)` записва пълния репорт с изображения.

✅ **РЕШЕНИЕ**: Използвай `useState` вместо `useKV` за текущия репорт:

```typescript
// Промени от:
const [analysisReport, setAnalysisReport] = useKV<AnalysisReport | null>('analysis-report', null)

// На:
const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null)
```

### 3. Изчисти старите репорти със изображения

Старите репорти в storage може да имат изображения → изчисти ги!

## ДОПЪЛНИТЕЛНИ ПРОБЛЕМИ

### Storage Utils Проблем

В `storage-utils.ts` функцията `estimateStorageUsage()` може да не работи правилно в някои браузъри, което води до неточни оценки.

### Error Handling

Когато storage quota се превиши, грешката НЕ се хваща правилно и приложението крашва вместо да покаже грешка.

## ЗАКЛЮЧЕНИЕ

**ОСНОВНАТА ПРИЧИНА**: Опитът да се записват ОГРОМНИ base64 изображения в KV storage причинява quota exceeded и crash.

**РЕШЕНИЕТО**: Използвай `useState` вместо `useKV` за текущия `analysisReport` и запази само "леки" версии без изображения в историята.

**ВРЕМЕТО ЗА ПОПРАВКА**: 5 минути - промяна на 1 ред код.

---

Дата: 2024
Статус: ИДЕНТИФИЦИРАНО - ГОТОВ ЗА ПОПРАВКА
