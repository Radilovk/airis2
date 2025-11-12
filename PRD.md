# Planning Guide

Приложение за иридологичен анализ, което използва изкуствен интелект за анализиране на ириси от снимки и предоставя персонализирани здравни препоръки на български език.

**Experience Qualities**:
1. **Професионален** - Приложението трябва да внушава доверие и медицински авторитет с прецизни визуализации и ясна терминология
2. **Интерактивен** - Потребителят трябва да се чувства ангажиран чрез плавни анимации, интерактивни диаграми и ясна визуална обратна връзка
3. **Достъпен** - Сложната медицинска информация трябва да бъде представена по разбираем начин с визуални помощни средства иясни обяснения

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Приложението включва множество етапи - въпросник, качване на изображения, AI анализ, генериране на подробни доклади с диаграми, и персонализирани препоръки

## Essential Features

### 1. Здравен Въпросник
- **Functionality**: Събиране на биометрични данни, здравен статус и цели
- **Purpose**: Предоставя контекст за персонализиран анализ
- **Trigger**: Стартов екран с бутон "Започни Анализ"
- **Progression**: Въведение → Лични данни (възраст, пол, тегло, ръст) → Здравни цели (checkbox) → Текущи оплаквания → Потвърждение
- **Success criteria**: Всички задължителни полета попълнени, данните запазени в KV store

### 2. Качване на Ирисови Снимки
- **Functionality**: Качване или заснемане на снимки на ляв и десен ирис
- **Purpose**: Предоставя изображения за AI анализ
- **Trigger**: Завършване на въпросника
- **Progression**: Инструкции за качество → Качване/Заснемане на ляв ирис → Преглед и потвърждение → Качване/Заснемане на десен ирис → Преглед и потвърждение
- **Success criteria**: Двете изображения качени успешно, показан preview

### 3. AI Иридологичен Анализ
- **Functionality**: Анализиране на ирисите по топографски зони с GPT-4o
- **Purpose**: Идентифициране на зони, артефакти и здравни индикатори
- **Trigger**: Потвърждаване на двете снимки
- **Progression**: Loading екран с прогрес → AI анализ на структури → Картографиране на зони → Идентифициране на артефакти → Генериране на заключения
- **Success criteria**: Пълен JSON доклад с всички 12 иридологични зони, артефакти и находки

### 4. Интерактивен Визуален Доклад
- **Functionality**: Показване на анализирани ириси с overlay на зони и артефакти
- **Purpose**: Визуализиране на находките по разбираем начин
- **Trigger**: Завършване на AI анализа
- **Progression**: Преглед на доклад → Интерактивна карта на ириса → Кликване на зони за детайли → Преглед на charts → Четене на обяснения
- **Success criteria**: Всички зони показани, tooltips работят, данните визуално представени

### 5. Диаграми и Визуализации
- **Functionality**: Radial charts, bar charts за здравни показатели по системи
- **Purpose**: Бърза визуална оценка на различни органни системи
- **Trigger**: Scrolling в доклада
- **Progression**: Преглед на обща диаграма → Детайлни графики по системи → Hover за повече информация
- **Success criteria**: Charts се рендерират коректно с данни от анализа

### 6. Персонализирани Препоръки
- **Functionality**: Генериране на хранителни и добавки препоръки базирани на анализа
- **Purpose**: Предоставяне на действени стъпки за подобрение
- **Trigger**: Достигане до секцията с препоръки
- **Progression**: Общи препоръки → Хранителен план → Добавки → Начин на живот → Експорт на доклад
- **Success criteria**: Минимум 5 конкретни препоръки за храна и 3 за добавки

## Edge Case Handling
- **Липсващи снимки**: Показване на placeholder и опция за качване по-късно
- **Некачествени изображения**: Предупреждение преди анализ с препоръка за по-добра снимка
- **AI грешка**: Fallback съобщение и опция за повторен опит
- **Празен въпросник**: Валидация и highlights на задължителни полета
- **Загуба на прогрес**: Запазване на всеки етап в KV store за възстановяване

## Design Direction
Дизайнът трябва да излъчва професионализъм на медицинско ниво със съвременна технологична естетика - съчетание на clean минимализъм с богати, информативни визуализации; интерфейсът да вдъхва доверие чрез прецизни линии, мека цветова палитра и плавни преходи, като същевременно прави сложната информация лесно достъпна.

## Color Selection
Analogous color scheme (сини и зелени тонове) за създаване на успокояващ, медицински професионален вид с акцент на топли тонове за важни елементи.

- **Primary Color**: Дълбок циан синьо (oklch(0.55 0.15 230)) - медицински, професионален, внушава доверие и технологичност
- **Secondary Colors**: Мек тюркоаз (oklch(0.65 0.12 200)) за карти и вторични елементи; светло небесно синьо (oklch(0.85 0.08 220)) за фонове
- **Accent Color**: Топло оранжево (oklch(0.70 0.18 45)) за call-to-action бутони, важни находки и предупреждения
- **Foreground/Background Pairings**: 
  - Background (oklch(0.98 0.01 230)): Foreground oklch(0.25 0.02 240) - Ratio 12.5:1 ✓
  - Card (oklch(1 0 0)): Card-foreground oklch(0.25 0.02 240) - Ratio 13.8:1 ✓
  - Primary (oklch(0.55 0.15 230)): Primary-foreground oklch(1 0 0) - Ratio 7.2:1 ✓
  - Secondary (oklch(0.85 0.08 220)): Secondary-foreground oklch(0.25 0.02 240) - Ratio 11.4:1 ✓
  - Accent (oklch(0.70 0.18 45)): Accent-foreground oklch(1 0 0) - Ratio 5.8:1 ✓
  - Muted (oklch(0.93 0.02 230)): Muted-foreground oklch(0.50 0.05 240) - Ratio 6.1:1 ✓

## Font Selection
Шрифтовете трябва да комбинират медицинска прецизност с модерна четливост - sans-serif с geometric характеристики за заглавия и clean humanist sans за текст.

- **Primary Font**: Inter - за отличен readability на български език и модерен, професионален вид
- **Secondary Font**: JetBrains Mono - за числови данни и технически детайли

**Typographic Hierarchy**:
- H1 (Заглавия на секции): Inter Bold/32px/tight letter-spacing -0.02em
- H2 (Подзаглавия): Inter SemiBold/24px/normal letter-spacing
- H3 (Зони и категории): Inter Medium/18px/normal
- Body (Обяснения): Inter Regular/16px/line-height 1.6
- Caption (Метаданни): Inter Regular/14px/мuted color
- Technical Data: JetBrains Mono Medium/14px/табличен spacing

## Animations
Анимациите създават усещане за плавност и професионализъм, насочвайки вниманието към ключови моменти без да отвличат - subtle фокус на функционалност.

- **Purposeful Meaning**: Fade-in transitions при зареждане на доклади внушават процес на анализ; пулсиращи highlights на зони с проблеми привличат внимание; smooth page transitions поддържат контекст
- **Hierarchy of Movement**: AI анализloader има най-изразителна анимация; zone hover effects са subtle; charts animate-in стъпково за фокус

## Component Selection

- **Components**: 
  - Dialog - за детайли на зони и артефакти
  - Card - за секции във въпросника и доклада
  - Progress - за показване на напредък в анализа
  - Tabs - за превключване между ляв/десен ирис
  - Badge - за категории на находки (нормално/внимание/важно)
  - Accordion - за показване/скриване на детайлни препоръки
  - Button - primary за основни действия, outline за вторични
  - Input/Textarea - за въпросника
  - RadioGroup/Checkbox - за опции в въпросника
  - Tooltip - за обяснения на термини
  - ScrollArea - за дълги списъци с препоръки
  - Separator - за визуално разделяне на секции

- **Customizations**:
  - Iris Zone Overlay компонент - SVG overlay с 12 иридологични зони върху снимка
  - Zone Detail Card - custom карта с зона информация, цвят-coded според сериозност
  - Health Chart компонент - radial chart за органни системи с legend
  - Upload Zone компонент - drag-and-drop с camera integration
  
- **States**:
  - Buttons: Default (gradient background), Hover (slight scale + brightness), Active (pressed), Disabled (opacity 50%)
  - Inputs: Default (subtle border), Focus (primary ring + border), Error (destructive border + message), Filled (success indicator)
  - Cards: Default (white bg), Hover (subtle shadow increase), Active zone (primary border)
  - Badges: Success (green), Warning (orange), Danger (red), Info (blue)

- **Icon Selection**:
  - Eye/EyeClosed - преглед на ириси
  - Camera - качване на снимки
  - Upload - drag and drop
  - CheckCircle - завършени стъпки
  - Warning - предупреждения
  - Info - tooltips и информация
  - Heart - здравни цели
  - Activity - биометрични данни
  - FileText - генериране на доклад
  - Download - експорт
  - ArrowRight/ArrowLeft - навигация
  - Sparkles - AI анализ индикатор

- **Spacing**: 
  - Section gaps: gap-12 (3rem)
  - Card padding: p-6 (1.5rem)
  - Form field spacing: space-y-4 (1rem)
  - Inline elements: gap-2 (0.5rem)
  - Page margins: px-4 md:px-8

- **Mobile**: 
  - Stack въпросник форми вертикално на mobile
  - Single column layout за доклади
  - Tabs за ляв/десен ирис вместо side-by-side
  - Bottom sheet вместо dialogs на mobile
  - Touch-friendly 44px минимум за бутони
  - Колапсиращи секции за дълго съдържание
