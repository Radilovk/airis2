# 📦 Пълен Експорт на AIRIS Проекта

## Обща информация

Тази функционалност позволява експортиране на **АБСОЛЮТНО ВСИЧКИ** файлове от AIRIS проекта в един JSON файл, готов за архивиране или deployment.

---

## 🎯 Какво включва експортът

### Общо файлове: **120+**

#### Root Конфигурация
- ✅ `index.html` - HTML entry point
- ✅ `package.json` - Dependencies и scripts
- ✅ `vite.config.ts` - Vite конфигурация
- ✅ `tsconfig.json` - TypeScript setup
- ✅ `tailwind.config.js` - Tailwind настройки
- ✅ `theme.json` - Тема конфигурация
- ✅ `components.json` - shadcn/ui конфигурация
- ✅ `runtime.config.json` - Runtime настройки
- ✅ `spark.meta.json` - Spark metadata

#### Source Код (src/)
- ✅ `App.tsx` - Главен компонент
- ✅ `ErrorFallback.tsx` - Error boundary
- ✅ `index.css` - Глобални стилове и тема
- ✅ `main.css` - Main CSS
- ✅ `main.tsx` - React entry point
- ✅ `vite-end.d.ts` - TypeScript definitions

#### Компоненти (src/components/)

**Screens (9 файла):**
- WelcomeScreen.tsx
- QuestionnaireScreen.tsx
- ImageUploadScreen.tsx
- AnalysisScreen.tsx
- ReportScreen.tsx
- HistoryScreen.tsx
- AdminScreen.tsx
- AboutAirisScreen.tsx
- DiagnosticScreen.tsx

**Admin (7 файла):**
- AIPromptTab.tsx
- ChangelogTab.tsx
- EditorCommentsExport.tsx
- EditorModeTab.tsx
- IridologyManualTab.tsx
- ProjectExportTab.tsx
- QuestionnaireManager.tsx

**Iris (2 файла):**
- IridologyOverlay.tsx
- IrisCropEditor.tsx

**Report (10 файла):**
- ReportHeader.tsx
- OverviewTab.tsx
- IridologyTab.tsx
- PlanTab.tsx
- SystemComparisonChart.tsx
- HealthProgressChart.tsx
- ZoneStatusPieChart.tsx
- ZoneHeatmap.tsx
- NutritionChart.tsx
- ActionTimeline.tsx
- InteractiveRecommendations.tsx

**UI компоненти (46 файла):**
- Всички shadcn/ui v4 компоненти:
  - accordion, alert-dialog, alert, aspect-ratio, avatar
  - badge, breadcrumb, button, calendar, card
  - carousel, chart, checkbox, collapsible, command
  - context-menu, dialog, drawer, dropdown-menu, form
  - hover-card, input-otp, input, label, menubar
  - navigation-menu, pagination, popover, progress, radio-group
  - resizable, scroll-area, select, separator, sheet
  - sidebar, skeleton, slider, sonner, switch
  - table, tabs, textarea, toggle-group, toggle, tooltip

#### Hooks (3 файла)
- ✅ `use-mobile.ts` - Mobile detection hook
- ✅ `use-editable-elements.ts` - Editable elements hook
- ✅ `use-deep-editable.ts` - Deep editable hook

#### Libraries (8 файла)
- ✅ `utils.ts` - Utility функции
- ✅ `error-logger.ts` - Error tracking system
- ✅ `storage-utils.ts` - Storage management
- ✅ `storage-cleanup.ts` - Auto cleanup функции
- ✅ `upload-diagnostics.ts` - Upload debugging
- ✅ `airis-knowledge.ts` - Иридологична база знания
- ✅ `default-prompts.ts` - AI prompt templates
- ✅ `defaultQuestions.ts` - Въпросник data
- ✅ `external-ai-api.ts` - External AI API integration

#### Типове (1 файл)
- ✅ `types/index.ts` - TypeScript type definitions

#### Стилове (1 файл)
- ✅ `styles/theme.css` - Theme CSS

#### Документация
- ✅ `README.md` - Основна документация
- ✅ `PRD.md` - Product Requirements Document
- ✅ `LICENSE` - Лиценз
- ✅ `SECURITY.md` - Security политики
- ✅ `CHANGELOG.md` - История на промените

#### Генерирани файлове (при експорт)
- ✅ `DEPLOYMENT_README.md` - Deployment инструкции
- ✅ `.gitignore` - Git ignore правила
- ✅ `extract-project.js` - Extraction Node.js скрипт

---

## 🚀 Как да използвате експорта

### Стъпка 1: Отворете Admin панела

1. Отворете AIRIS приложението
2. Кликнете на "Настройки" бутона на началния екран
3. Навигирайте до "Експорт на проекта" таба

### Стъпка 2: Изтеглете Extraction Скрипта

1. Натиснете бутона "Изтегли Extraction Скрипт"
2. Запазете `extract-project.js` файла на безопасно място

### Стъпка 3: Експортирайте проекта

1. Натиснете бутона "Изтегли ПЪЛЕН проект като JSON"
2. Изчакайте процеса на експорт (може да отнеме 30-60 секунди)
3. Запазете JSON файла (напр. `airis-full-project-export-2024-01-15.json`)

### Стъпка 4: Извличане на файловете

Отворете терминал и изпълнете:

```bash
node extract-project.js airis-full-project-export-2024-01-15.json
```

Това ще създаде директория `airis-extracted/` с всички файлове.

### Стъпка 5: Инсталация и стартиране

```bash
cd airis-extracted
npm install
npm run dev
```

Приложението ще стартира на `http://localhost:5173`

---

## 📊 Технически детайли

### JSON Структура

Експортираният JSON файл има следната структура:

```json
{
  "project": "AIRIS - Иридологичен Анализ",
  "exportDate": "2024-01-15T12:00:00.000Z",
  "version": "1.0.0",
  "totalFiles": 120,
  "totalSize": 524288,
  "files": [
    {
      "path": "src/App.tsx",
      "content": "import { useState } from 'react'...",
      "size": 12345
    },
    ...
  ]
}
```

### Extraction Скрипт

Node.js скриптът (`extract-project.js`):
- Чете JSON файла
- Създава директории рекурсивно
- Записва всички файлове на правилните места
- Показва прогрес и резултати
- Логва успешни и неуспешни операции

### Предимства на този подход

✅ **Пълнота**: Всички файлове без изключение  
✅ **Портативност**: Един JSON файл за архивиране  
✅ **Лесно споделяне**: Може да се изпрати по email, cloud storage, и др.  
✅ **Version control**: Лесно за съхраняване в Git  
✅ **Автоматизация**: Може да се интегрира в CI/CD pipeline  
✅ **Transparency**: Можете да видите точно какво е експортирано  

---

## 🌐 Deployment опции

След като извлечете файловете, можете да deploy-нете проекта на:

### GitHub Pages
```bash
npm run build
# Push dist/ към gh-pages branch
```

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
1. Drag & drop `dist/` директорията
2. Или свържете GitHub repository

### Cloudflare Pages
1. Свържете GitHub repository
2. Build command: `npm run build`
3. Build output: `dist`

---

## ⚠️ Важни забележки

### Ограничения

- ❌ **node_modules/** не се експортира (инсталирайте с `npm install`)
- ❌ **dist/** build директорията не се експортира
- ❌ **.git/** Git история не се експортира
- ❌ **Персонални данни** от localStorage/IndexedDB не се експортират

### Сигурност

- ✅ API keys НЕ се експортират
- ✅ Лични данни НЕ се експортират
- ✅ Само source код и конфигурация

### Размер

- Приблизителен размер на JSON: **500-700 KB**
- След извличане: **~2-3 MB** (без node_modules)
- След `npm install`: **~300-500 MB** (с node_modules)

---

## 🐛 Troubleshooting

### Проблем: "Cannot find module 'fs'"

**Решение**: Уверете се, че използвате Node.js (не браузър) за extraction скрипта.

```bash
node --version  # Трябва да покаже версия >= 14.0.0
```

### Проблем: "JSON parse error"

**Решение**: JSON файлът може да е корумпиран. Изтеглете проекта отново.

### Проблем: "Permission denied"

**Решение**: На macOS/Linux може да се наложи да направите скрипта executable:

```bash
chmod +x extract-project.js
./extract-project.js airis-export.json
```

### Проблем: "Module not found" след npm install

**Решение**: Изтрийте `node_modules` и `package-lock.json`, след това:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Следващи стъпки

След успешен експорт и deployment:

1. ✅ Конфигурирайте AI модели в Admin панела
2. ✅ Добавете собствени API keys за по-бърз анализ
3. ✅ Персонализирайте AI промптове и иридологичен мануал
4. ✅ Тествайте приложението с реални ирис изображения
5. ✅ Настройте автоматичен backup workflow

---

## 🤝 Поддръжка

За въпроси, проблеми или feature requests:

- 📧 Отворете issue в GitHub repository
- 📊 Използвайте Diagnostics екрана за system информация
- 🔍 Проверете Quick Debug Panel за логове

---

**Създадено с GitHub Spark и ❤️**

**⚠️ Важно**: Този експорт е предназначен за архивиране, backup и deployment. Винаги използвайте Git за version control в production environment.
