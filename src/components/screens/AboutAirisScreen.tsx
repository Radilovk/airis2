import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Eye, Brain, ChartLine, ShieldCheck, CaretDown } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useState } from 'react'

interface AboutAirisScreenProps {
  onBack: () => void
}

export default function AboutAirisScreen({ onBack }: AboutAirisScreenProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 gap-2"
          >
            <ArrowLeft size={20} />
            Назад
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Eye size={32} weight="duotone" className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">airis</h1>
              <p className="text-lg text-muted-foreground">
                конституционен здравен профил от окото ти
              </p>
            </div>
          </div>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <p className="text-lg leading-relaxed">
              <strong>airis</strong> комбинира изкуствен интелект, клинични очни маркери и ирисова
              топография, за да изгради цялостна картина на тялото ти от една снимка на окото и
              кратък здравен въпросник.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Как работи airis?</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-5">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Eye size={24} weight="duotone" className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Разпознава очни сигнали</h3>
              <p className="text-sm text-muted-foreground">
                Доказани очни маркери за системно натоварване – липиди, възпаление, анемия,
                чернодробен стрес и др.
              </p>
            </Card>

            <Card className="p-5">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain size={24} weight="duotone" className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Анализира структурата на ириса</h3>
              <p className="text-sm text-muted-foreground">
                Тъканна устойчивост, нервен тонус, метаболитни „следи" и конституционни слаби места.
              </p>
            </Card>

            <Card className="p-5">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ChartLine size={24} weight="duotone" className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Съпоставя данните</h3>
              <p className="text-sm text-muted-foreground">
                Възраст, пол, тегло, хранене, стрес, сън, активност и заболявания за пълна картина.
              </p>
            </Card>
          </div>

          <Card className="p-6 border-accent/30 bg-accent/5">
            <div className="flex items-start gap-3">
              <ShieldCheck size={24} weight="duotone" className="text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-2">
                  Резултатът не е диагноза, а ясна карта на силните и уязвимите зони в организма
                </p>
                <p className="text-sm text-muted-foreground">
                  Получавате приоритети за режим, превенция и оптимизация на начина на живот –
                  конкретно за твоето тяло, не по общи шаблони.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4">Подробно обяснение</h2>

          <Collapsible
            open={openSections['approach']}
            onOpenChange={() => toggleSection('approach')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">
                  1. Два подхода към окото – и къде стои airis
                </h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['approach'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-3 text-muted-foreground">
                  <p>
                    Исторически анализът на окото се е развил в две посоки:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Клинична офталмология и вътрешни болести</strong> – търси конкретни,
                      доказани очни признаци, които са пряко свързани със заболявания (черен дроб,
                      кръв, обмяна на веществата, съдове).
                    </li>
                    <li>
                      <strong>Холистична иридология</strong> – използва карта на ириса, за да оцени
                      конституционалната сила, слабите места и функционалните дисбаланси в организма.
                    </li>
                  </ul>
                  <p className="font-medium text-foreground">
                    airis комбинира тези два подхода: използва научно признатите очни маркери като
                    твърда основа, върху тях надгражда конституционен анализ по ирисова карта.
                  </p>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections['biology']}
            onOpenChange={() => toggleSection('biology')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">
                  2. Биологична основа: защо ирисът има значение
                </h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['biology'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-3 text-muted-foreground">
                  <p>
                    Ирисът е директно свързан с нервната и съединителната тъкан:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Част от слоевете и мускулите, които управляват зеницата, произлизат от същия
                      зародишен слой, от който се развиват мозъкът и ретината.
                    </li>
                    <li>
                      Стромата на ириса (видимите влакна, „пукнатини" и релеф) се формира от клетки,
                      които участват в изграждането на периферната нервна система и съединителната
                      тъкан.
                    </li>
                    <li>
                      Ирисът се управлява от вегетативната нервна система – същата, която регулира
                      реакциите на стрес и почивка, съдовия тонус и работата на вътрешните органи.
                    </li>
                  </ul>
                  <p className="font-medium text-foreground">
                    Затова в модела ирисът се използва като концентрирана карта на конституцията –
                    място, където са „събрани" следи за структурата на тъканите, характера на нервния
                    тонус и натрупаното във времето натоварване.
                  </p>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections['markers']}
            onOpenChange={() => toggleSection('markers')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">
                  3. Какво разпознава airis от клиничната медицина
                </h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['markers'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-3 text-muted-foreground">
                  <p>
                    airis е обучен да открива редица научно признати очни маркери, които в медицината
                    се свързват със системни състояния:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Arcus senilis (липиден пръстен)</h4>
                      <p className="text-sm">
                        Сиво-белезникав пръстен по периферията на ириса. Традиционно се свързва с
                        нарушения в мастния профил (липиди, холестерол) и повишен сърдечно-съдов риск
                        при определени възрастови групи.
                      </p>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Пожълтяване на склерата (иктер)</h4>
                      <p className="text-sm">
                        Жълто оцветяване на „бялото" на окото – класически сигнал за повишен билирубин
                        и натоварване в черен дроб, жлъчка или кръвотворна система.
                      </p>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Бледост на конюнктивата</h4>
                      <p className="text-sm">
                        Бледа вътрешна повърхност на долния клепач – белег, който в клиничната практика
                        насочва към нисък хемоглобин и анемични състояния.
                      </p>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">
                        Конюнктивална хиперемия (зачервени съдове)
                      </h4>
                      <p className="text-sm">
                        Разширени, напрегнати съдове – знак за локално възпаление, раздразнение,
                        хронична сухота и/или по-системно натоварване (включително артериално налягане).
                      </p>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Пръстени на Кайзер–Флайшер</h4>
                      <p className="text-sm">
                        Кафеникаво-зелени пръстени по периферията на ириса, класически свързвани с
                        нарушения в обмяната на медта.
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections['constitutional']}
            onOpenChange={() => toggleSection('constitutional')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">
                  4. Конституционен ирисов анализ: сила, слабости, тенденции
                </h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['constitutional'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-4 text-muted-foreground">
                  <p>
                    Над клиничния слой airis прилага ирисова топографска карта – модел, който разглежда
                    ириса като карта на вродената сила на тъканите, натрупаното във времето натоварване,
                    конституционните „слаби места" и взаимодействието между стрес, нервна система,
                    храносмилане, обмяна и др.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">4.1. Тъканна структура</h4>
                      <p className="text-sm mb-2">
                        <strong>Какво се разглежда:</strong> плътност, равномерност и „стегнатост" на
                        видимите влакна в ириса.
                      </p>
                      <p className="text-sm">
                        <strong>Как се тълкува:</strong> плътна, стегната структура → висок вроден
                        резерв на съединителната тъкан, добра устойчивост; рехава, разкъсана структура
                        → по-лесно изчерпване при стрес, по-голяма податливост към хронични оплаквания.
                      </p>
                    </div>

                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">4.2. Нервен и вегетативен тонус</h4>
                      <p className="text-sm mb-2">
                        <strong>Какво се разглежда:</strong> концентрични „нервни пръстени" в ириса.
                      </p>
                      <p className="text-sm">
                        <strong>Как се тълкува:</strong> изразени пръстени → склонност към вътрешно
                        напрежение, спазми, трудно отпускане и „изключване"; гладка картина → по-лесно
                        преминаване към покой и възстановяване.
                      </p>
                    </div>

                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">4.3. Метаболитни следи</h4>
                      <p className="text-sm mb-2">
                        <strong>Какво се разглежда:</strong> пигментни натрупвания (цвят, форма,
                        разположение).
                      </p>
                      <p className="text-sm">
                        <strong>Как се тълкува:</strong> като „памет" за дългогодишно натоварване на
                        системите за очистване и възпалителния фон – насочване към черен дроб,
                        храносмилане, общо метаболитно поведение, хранителни навици, сън, стрес.
                      </p>
                    </div>

                    <div className="bg-background p-4 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">4.4. Локални уязвимости</h4>
                      <p className="text-sm mb-2">
                        <strong>Какво се разглежда:</strong> лакуни, крипти и по-светли „дупки" в тъканта.
                      </p>
                      <p className="text-sm">
                        <strong>Как се тълкува:</strong> като конституционни зони с по-нисък ресурс. В
                        топографската карта тези зони се свързват с определени области – храносмилателна
                        система, гръбначен стълб, нервна система, сърдечно-съдова система и др.
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections['questionnaire']}
            onOpenChange={() => toggleSection('questionnaire')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">
                  5. Ролята на въпросника: картина на реалния живот
                </h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['questionnaire'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-3 text-muted-foreground">
                  <p>
                    Снимката на окото сама по себе си дава само конституционната „карта". Затова airis
                    задължително я комбинира с детайлен въпросник, който обхваща:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>възраст, пол, ръст, тегло</li>
                    <li>тип хранене и хранителни навици</li>
                    <li>ниво и характер на стреса</li>
                    <li>сън – продължителност и качество</li>
                    <li>хидратация</li>
                    <li>двигателна активност – честота, интензивност, вид натоварване</li>
                    <li>настоящи и прекарани заболявания</li>
                    <li>фамилна обремененост</li>
                  </ul>
                  <p className="font-medium text-foreground">
                    Така се изграждат две карти: ирисът → как е „сглобено" тялото и къде носи
                    потенциални слабости; въпросникът → как живеете и с какво реално натоварвате тялото.
                  </p>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections['process']}
            onOpenChange={() => toggleSection('process')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">
                  6. Как работи airis – стъпка по стъпка
                </h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['process'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-3 text-muted-foreground">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Снимка на окото</h4>
                        <p className="text-sm">
                          Извличат се клинични маркери (пръстени, оцветяване, съдове) и ирисовата структура.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Ирисов конституционен анализ</h4>
                        <p className="text-sm">
                          Оценяват се тъканна плътност, нервни пръстени, пигменти, лакуни, позицията им
                          по топографската карта.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Обработка на въпросника</h4>
                        <p className="text-sm">
                          Структуриране на данните за хранене, сън, стрес, активност, заболявания,
                          фамилна обремененост.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Съпоставяне на двете нива</h4>
                        <p className="text-sm">
                          Търсят се съвпадения между конституционна слабост в дадена зона и реален стрес
                          върху същата система.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Извеждане на здравен профил</h4>
                        <p className="text-sm">
                          Изгражда се карта на силните страни, уязвимите зони и приоритети за корекция
                          на режим, хранене, активност и възстановяване.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections['limitations']}
            onOpenChange={() => toggleSection('limitations')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">7. Какво airis не прави</h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['limitations'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-3 text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>не поставя медицински диагнози</li>
                    <li>не назначава лечение и не отменя лекарски преглед</li>
                    <li>не се използва при остри, спешни състояния</li>
                  </ul>
                  <p className="font-medium text-foreground">
                    Ролята на airis е конституционен и превантивен анализ – да покаже къде тялото ви има
                    резерв, къде е по-уязвимо и как ежедневните ви навици се вписват в тази картина.
                  </p>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections['results']}
            onOpenChange={() => toggleSection('results')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">8. Какво получавате накрая</h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['results'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-3 text-muted-foreground">
                  <p>Резултатът от airis включва:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Конституционен профил</strong> – силни и слаби места на тъканите, нервната
                      система и метаболитния фон
                    </li>
                    <li>
                      <strong>Карта на рисковете</strong> – системи и зони, които изискват по-внимателна грижа
                    </li>
                    <li>
                      <strong>Карта на ресурсите</strong> – области, където сте по-устойчиви и по-адаптивни
                    </li>
                    <li>
                      <strong>Конкретни насоки</strong> – храни, навици, вид движение, сън и управление на
                      стреса, подредени по приоритет според вашия профил
                    </li>
                    <li>
                      <strong>При наличие на клинично значими сигнали</strong> – препоръка да ги обсъдите с лекар
                    </li>
                  </ul>
                  <p className="font-medium text-foreground">
                    Целта не е „етикет" и диагноза, а ясен, структуриран план къде си струва да вложите
                    най-много внимание, за да пазите и развивате здравето си в дългосрочен план.
                  </p>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections['bibliography']}
            onOpenChange={() => toggleSection('bibliography')}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold text-lg text-left">9. Библиографска справка</h3>
                <CaretDown
                  size={20}
                  className={`transition-transform ${openSections['bibliography'] ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Класически и съвременни трудове по ирисов анализ и холистична медицина:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Bernard Jensen – The Science and Practice of Iridology, Vol. 1 & 2</li>
                      <li>Farida Sharan – Iridology: A Complete Guide</li>
                      <li>Ellen Tart-Jensen – Techniques in Iris Analysis</li>
                      <li>John Andrews – Iris & Pupillary Signs; Immunology & Iridology</li>
                      <li>Dorothy Hall – Iridology: How the Eyes Reveal Your Health and Personality</li>
                      <li>Bill Caradonna – The Evolving Science of Iridology</li>
                      <li>Daniele Lo Rito – The Time Risk in the Iris</li>
                      <li>Ignatz von Peczely – Discoveries in the Realm of Nature and the Art of Healing</li>
                      <li>Henry Lindlahr – Nature Cure</li>
                      <li>John R. Christopher – School of Natural Healing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Медицински контекст (очни маркери и системно здраве):
                    </h4>
                    <p className="text-sm mb-2">
                      Съвременни учебници по офталмология и вътрешни болести, разглеждащи очните прояви
                      на системни заболявания (липидни отлагания, анемии, чернодробни и жлъчни заболявания,
                      нарушения в обмяната на медта, съдови промени).
                    </p>
                    <p className="text-sm">
                      Научни статии и клинични ръководства, посветени на: arcus senilis и връзката му с
                      липидния профил; scleral icterus и чернодробни/жлъчни заболявания; conjunctival
                      pallor като клиничен белег на анемия; Kaiser–Fleischer rings при нарушения в обмяната
                      на медта; очни съдови промени при хипертония и системни възпалителни процеси.
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Върху този фундамент airis изгражда собствена, формализирана система за анализ, която
                    комбинира знанията от класическите школи с изчислителната мощ на изкуствения интелект,
                    за да превърне погледа към окото в практичен инструмент за конституционен и превантивен
                    здравен профил.
                  </p>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={onBack}
            size="lg"
            className="px-8"
          >
            Започнете вашия анализ
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
