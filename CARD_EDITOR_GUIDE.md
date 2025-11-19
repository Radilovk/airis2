# Ръководство за Директни Редакторски Инструменти на Card

## Обзор

Всяка карта в репорт страницата има вградени директни редакторски инструменти, които се показват автоматично, когато Editor Mode е активен от Админ Панела.

## Активиране на Editor Mode

1. Отидете в Админ Панела
2. Включете "Editor Mode"
3. Върнете се към репорт страницата
4. Всяка карта ще има малък бутон с три точки в горния десен ъгъл

## Функционалности на Редакторските Инструменти

### 1. Видимост на Картата
- **Скрий/Покажи**: Контролирайте дали картата се показва на потребителите
- Скритите карти се виждат само в Editor Mode като placeholder
- В нормален режим скритите карти изчезват напълно

### 2. Разгъване/Свиване
- **Разгъни/Свий**: Контролирайте дали картата е разгъната или свита по подразбиране
- Подходящо за карти с много съдържание
- Позволява на потребителите да видят само най-важното

### 3. Коментари и Инструкции
- **Добави Коментар**: Добавете бележки и инструкции за корекция
- Всеки коментар има:
  - Текст на коментара
  - Timestamp (дата и час)
  - Статус (нерешен/решен)
- **Маркирай като решен**: След изпълнение на инструкцията
- **Изтрий коментар**: Премахване на остарели коментари
- **Брой нерешени коментари**: Показва се като badge на бутона

### 4. Изтриване на Карта
- **Изтрий**: Премахнете цялата карта от репорта
- Внимание: Изтриването е перманентно!

## Използване на Компонента

### Метод 1: EditableCard Component

```tsx
import { EditableCard } from '@/components/report/withCardEditor'

<EditableCard 
  cardId="unique-card-id"
  editorMode={editorMode}
  defaultVisible={true}
  defaultExpanded={true}
  compact={true}
  position="top-right"
>
  {/* Съдържанието на картата */}
  <Card>
    <CardHeader>
      <CardTitle>Заглавие</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Съдържание */}
    </CardContent>
  </Card>
</EditableCard>
```

### Метод 2: withCardEditor HOC

```tsx
import { withCardEditor } from '@/components/report/withCardEditor'
import MyCustomCard from './MyCustomCard'

const EditableMyCard = withCardEditor(MyCustomCard)

// Използване
<EditableMyCard
  cardId="my-custom-card"
  editorMode={editorMode}
  // ... други props за MyCustomCard
/>
```

## Параметри

### EditableCard Props

| Prop | Тип | По подразбиране | Описание |
|------|-----|-----------------|----------|
| `cardId` | `string` | **задължително** | Уникален идентификатор на картата |
| `editorMode` | `boolean` | `false` | Активирани ли са редакторските инструменти |
| `defaultVisible` | `boolean` | `true` | Видима ли е картата по подразбиране |
| `defaultExpanded` | `boolean` | `true` | Разгъната ли е картата по подразбиране |
| `compact` | `boolean` | `true` | Компактен режим (бутон с 3 точки) |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Позиция на редакторския панел |
| `onDelete` | `(cardId: string) => void` | `undefined` | Callback при изтриване (ако липсва, бутонът не се показва) |

## Persistence

Всички настройки на картите се запазват автоматично в `card-editor-states` KV store:

- Видимост
- Разгънато/свито състояние
- Коментари (включително timestamp и статус)
- Персонализирани стилове (бъдеща функционалност)

## Примери за Използване

### Основна Употреба

```tsx
export default function MyReportTab({ report, editorMode }) {
  return (
    <div className="space-y-6">
      <EditableCard 
        cardId="health-score" 
        editorMode={editorMode}
      >
        <Card>
          <CardHeader>
            <CardTitle>Здравен Резултат</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={report.healthScore} />
          </CardContent>
        </Card>
      </EditableCard>

      <EditableCard 
        cardId="recommendations" 
        editorMode={editorMode}
        defaultExpanded={false}
      >
        <Card>
          <CardHeader>
            <CardTitle>Препоръки</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Препоръки */}
          </CardContent>
        </Card>
      </EditableCard>
    </div>
  )
}
```

### С Възможност за Изтриване

```tsx
const [deletedCards, setDeletedCards] = useState<string[]>([])

const handleDelete = (cardId: string) => {
  setDeletedCards(prev => [...prev, cardId])
}

<EditableCard 
  cardId="optional-card" 
  editorMode={editorMode}
  onDelete={handleDelete}
>
  {/* Съдържание */}
</EditableCard>
```

### Некомпактен Режим (Всички Бутони Видими)

```tsx
<EditableCard 
  cardId="important-card" 
  editorMode={editorMode}
  compact={false}
  position="top-left"
>
  {/* Съдържание */}
</EditableCard>
```

## Работен Процес

### За Редактор/Админ:

1. **Активирайте Editor Mode** от Админ Панела
2. **Разгледайте репорта** - всяка карта ще има редакторски инструменти
3. **Скривайте ненужни карти** - намалете претрупването
4. **Добавяйте коментари** за всяка карта, която се нуждае от промени
5. **Маркирайте като решени** след изпълнение
6. **Деактивирайте Editor Mode** за да видите резултата като потребител

### За AI Асистент:

1. **Четете коментарите** от card states
2. **Изпълнявайте инструкциите** точно както са описани
3. **Запазвайте структурата** на картите
4. **Уведомявайте** за завършени задачи

## Технически Детайли

### State Management

Всяка карта има собствен `CardEditorState`:

```typescript
interface CardEditorState {
  id: string
  visible: boolean
  expanded: boolean
  comments: CardComment[]
  customStyles?: {
    backgroundColor?: string
    borderColor?: string
    padding?: string
  }
}
```

### Storage

- Използва `useKV` hook за persistence
- Store key: `'card-editor-states'`
- Формат: `Record<cardId, CardEditorState>`
- Автоматично синхронизиране между компоненти

### Visual States

В Editor Mode картите имат:
- Субтилен ring ефект (ring-2 ring-primary/20)
- Hover ефект (hover:ring-primary/40)
- Transition за smooth промени
- Badge за нерешени коментари

## Бъдещи Подобрения

- [ ] Drag & drop за преподреждане
- [ ] Визуален стил редактор (цветове, padding)
- [ ] Експорт на коментари
- [ ] История на промените
- [ ] Версиониране на карти
- [ ] Templates за често използвани карти
- [ ] Bulk операции (скрий всички, показва всички)
- [ ] Филтриране по карти с коментари

## Troubleshooting

### Картата не показва редакторски инструменти
- Проверете дали Editor Mode е включен
- Проверете дали `editorMode` prop е правилно подаден
- Проверете дали `cardId` е уникален

### Коментарите не се запазват
- Проверете browser console за грешки
- Уверете се, че имате достъп до KV store
- Проверете дали `cardId` е същият при re-render

### Картата изчезва след refresh
- Проверете `visible` в card state
- Проверете дали не е изтрита
- Деактивирайте Editor Mode за да видите потребителския изглед
