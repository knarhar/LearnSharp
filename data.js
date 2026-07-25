/* =====================================================================
   C# Deep Dive — content
   Each WORLD has levels. Each level:
     id, title, subtitle, theory (HTML), code (C#), deep (HTML note),
     links [{label,url}], task { q, options[], answer(index), explain }
   Keep explanations plain-language but technically correct.
   ===================================================================== */

const WORLDS = [
  /* ================= WORLD 1: GENERICS ================= */
  {
    id: "generics",
    name: "Generics",
    icon: "◆",
    blurb: "Код, который работает с любым типом — без потери безопасности.",
    levels: [
      {
        id: "gen-1",
        title: "Что такое дженерик",
        subtitle: "Одна коробка для любого содержимого",
        theory: `
<p>Представь коробку. Обычная коробка подписана: "только для яблок". Если тебе нужна коробка
для книг — приходится делать новую, отдельную. Скучно и дублирование.</p>
<p><b>Дженерик</b> — это коробка без жёсткой подписи. Ты говоришь ей тип <i>в момент
использования</i>: «сейчас ты для яблок», «а теперь для книг». Один код — любые типы.</p>
<p>Буква <code>T</code> (от <i>Type</i>) — это заглушка. Компилятор подставит вместо неё
реальный тип, который ты укажешь. <code>List&lt;int&gt;</code> — список чисел,
<code>List&lt;string&gt;</code> — список строк. Класс <code>List&lt;T&gt;</code> написан
один раз.</p>`,
        code: `// T — заглушка под будущий тип
public class Box<T>
{
    private T _item;
    public void Put(T item) => _item = item;
    public T Get() => _item;
}

var apples = new Box<int>();   // теперь T = int
apples.Put(5);
int a = apples.Get();          // достаём int, без приведения типов

var names = new Box<string>(); // тот же класс, теперь T = string
names.Put("Anna");`,
        deep: `<p><b>Глубже:</b> до дженериков в C# всё складывали в <code>object</code>. Но тогда
число превращалось в <code>object</code> (это называется <i>boxing</i> — упаковка, лишняя
работа и мусор в памяти), а доставая, приходилось вручную приводить обратно и рисковать
ошибкой во время работы программы. Дженерики дают <b>безопасность типов на этапе компиляции</b>
и убирают упаковку.</p>`,
        links: [
          { label: "MS Docs — Generics", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics" },
          { label: "Книга: C# in Depth (Jon Skeet), гл. про дженерики", url: "https://csharpindepth.com/" }
        ],
        task: {
          q: "Зачем нужен List&lt;T&gt; вместо того, чтобы хранить всё в списке object?",
          options: [
            "Чтобы код красивее выглядел",
            "Чтобы поймать ошибку типа на компиляции и избежать упаковки (boxing)",
            "Чтобы программа работала медленнее, но надёжнее",
            "Дженерики нужны только для чисел"
          ],
          answer: 1,
          explain: "Дженерик проверяет типы ещё до запуска и не упаковывает значимые типы в object — это и безопаснее, и быстрее."
        }
      },
      {
        id: "gen-2",
        title: "Обобщённые методы",
        subtitle: "Не весь класс — только один метод",
        theory: `
<p>Иногда обобщать весь класс не нужно — достаточно одного метода. Метод тоже может иметь
свою заглушку типа.</p>
<p>Прелесть в том, что компилятор часто <b>сам догадывается</b>, какой тип ты передал —
это называется <i>вывод типа</i> (type inference). Тебе не нужно писать
<code>Swap&lt;int&gt;</code>, достаточно <code>Swap(x, y)</code>.</p>`,
        code: `// <T> стоит у метода, а не у класса
static void Swap<T>(ref T x, ref T y)
{
    T temp = x;
    x = y;
    y = temp;
}

int p = 1, q = 2;
Swap(ref p, ref q);   // компилятор понял: T = int
// p == 2, q == 1

string s1 = "a", s2 = "b";
Swap(ref s1, ref s2); // тот же метод, T = string`,
        deep: `<p><b>Глубже:</b> вывод типа работает по <i>аргументам</i>, но не по возвращаемому
значению. Если тип нельзя вычислить из аргументов, придётся указать его явно:
<code>Create&lt;User&gt;()</code>.</p>`,
        links: [
          { label: "MS Docs — Generic Methods", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generic-methods" }
        ],
        task: {
          q: "Почему обычно можно писать Swap(ref a, ref b), а не Swap&lt;int&gt;(ref a, ref b)?",
          options: [
            "Так писать нельзя, нужно всегда указывать тип",
            "Компилятор выводит T из типов переданных аргументов",
            "int — тип по умолчанию для всех методов",
            "Дженерик-методы игнорируют типы"
          ],
          answer: 1,
          explain: "Это вывод типа (type inference): компилятор смотрит на аргументы и сам подставляет T."
        }
      },
      {
        id: "gen-3",
        title: "Ограничения (constraints)",
        subtitle: "«T, но не совсем любой»",
        theory: `
<p>Иногда «любой тип» — это слишком. Например, метод хочет вызвать у <code>T</code> метод
<code>CompareTo</code>. Но не у всех типов он есть. Нужно <b>пообещать компилятору</b>, что
<code>T</code> обладает нужными свойствами.</p>
<p>Это делает слово <code>where</code>. Оно ставит условия на <code>T</code>:</p>
<ul>
<li><code>where T : class</code> — только ссылочные типы</li>
<li><code>where T : struct</code> — только значимые типы</li>
<li><code>where T : IComparable&lt;T&gt;</code> — T должен уметь сравниваться</li>
<li><code>where T : new()</code> — у T есть пустой конструктор (можно писать <code>new T()</code>)</li>
</ul>`,
        code: `// T обязан уметь сравнивать себя с себе подобным
static T Max<T>(T a, T b) where T : IComparable<T>
{
    // теперь CompareTo доступен — компилятор уверен, что он есть
    return a.CompareTo(b) >= 0 ? a : b;
}

int big = Max(3, 9);          // 9
string later = Max("a", "z"); // "z"`,
        deep: `<p><b>Глубже:</b> без ограничения компилятор считает <code>T</code> просто
<code>object</code> и не даст вызвать <code>CompareTo</code>. Ограничение открывает доступ к
методам интерфейса/базового класса и заодно документирует намерение: «сюда подходят только
сравнимые типы».</p>`,
        links: [
          { label: "MS Docs — Constraints on type parameters", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters" }
        ],
        task: {
          q: "Что даёт ограничение where T : IComparable&lt;T&gt;?",
          options: [
            "Запрещает использовать метод вообще",
            "Разрешает передавать только null",
            "Гарантирует, что у T есть CompareTo, и разрешает его вызывать",
            "Ускоряет сравнение в 2 раза"
          ],
          answer: 2,
          explain: "Ограничение обещает компилятору наличие члена интерфейса — и тогда его можно вызывать внутри метода."
        }
      }
    ]
  },

  /* ================= WORLD 2: VARIANCE ================= */
  {
    id: "variance",
    name: "Variance",
    icon: "⇅",
    blurb: "Ковариантность, контравариантность — когда IEnumerable<Cat> «подходит» под IEnumerable<Animal>.",
    levels: [
      {
        id: "var-1",
        title: "Проблема совместимости",
        subtitle: "Кошка — это животное. А список кошек — это список животных?",
        theory: `
<p>Кошка (<code>Cat</code>) наследует Животное (<code>Animal</code>). Значит кошку можно
положить туда, где ждут животное. Логично.</p>
<p>Но вот подвох: является ли <code>List&lt;Cat&gt;</code> тем же, что
<code>List&lt;Animal&gt;</code>? <b>Нет!</b> И это не баг. Если бы список кошек считался
списком животных, кто-то мог бы добавить в него собаку — и всё сломалось бы.</p>
<p>По умолчанию дженерик-типы <b>инвариантны</b>: <code>List&lt;Cat&gt;</code> и
<code>List&lt;Animal&gt;</code> — разные, несовместимые типы. Вариантность — это правила,
которые в <i>безопасных</i> случаях эту стену убирают.</p>`,
        code: `class Animal { }
class Cat : Animal { }

Animal a = new Cat();          // OK: кошка — это животное

List<Cat> cats = new();
// List<Animal> animals = cats; // ОШИБКА компиляции — инвариантность
// иначе можно было бы: animals.Add(new Dog()); — катастрофа`,
        deep: `<p><b>Глубже:</b> вариантность работает только с <b>интерфейсами и делегатами</b>,
не с классами вроде <code>List&lt;T&gt;</code>. И только со <b>ссылочными</b> типами. Дальше
разберём два безопасных случая: чтение (out) и запись (in).</p>`,
        links: [
          { label: "MS Docs — Variance in Generics", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance" }
        ],
        task: {
          q: "Почему List&lt;Cat&gt; нельзя присвоить переменной List&lt;Animal&gt;?",
          options: [
            "Потому что Cat не наследует Animal",
            "Иначе в список кошек можно было бы добавить, например, собаку",
            "Это разрешено, компилятор ошибается",
            "List вообще не поддерживает наследование"
          ],
          answer: 1,
          explain: "List изменяемый: разрешив такое присваивание, мы бы открыли дверь для записи чужого типа. Поэтому — инвариантность."
        }
      },
      {
        id: "var-2",
        title: "Ковариантность (out)",
        subtitle: "Если только читаем — можно расширять тип",
        theory: `
<p>А что если из коллекции можно только <b>доставать</b>, но нельзя класть? Тогда опасности
нет: раз мы лишь читаем кошек как животных — всё безопасно.</p>
<p>Именно поэтому <code>IEnumerable&lt;out T&gt;</code> помечен словом <code>out</code>. Оно
означает: «T только на выход». Такой интерфейс <b>ковариантен</b> — можно присвоить
<code>IEnumerable&lt;Cat&gt;</code> переменной <code>IEnumerable&lt;Animal&gt;</code>.</p>
<p>Правило-подсказка: <code>out</code> → тип «едет вверх» по наследованию (Cat → Animal).</p>`,
        code: `IEnumerable<Cat> cats = new List<Cat> { new Cat(), new Cat() };

// РАБОТАЕТ: IEnumerable ковариантен (out T)
IEnumerable<Animal> animals = cats;

foreach (Animal x in animals) { /* только читаем — безопасно */ }

// Определение в .NET:
// public interface IEnumerable<out T> : IEnumerable { ... }`,
        deep: `<p><b>Глубже:</b> <code>out</code> разрешён, только если <code>T</code>
встречается исключительно в <i>возвращаемых</i> позициях (return, get-свойства). Как только
<code>T</code> появится в аргументе метода — компилятор запретит <code>out</code>, потому что
это открыло бы запись.</p>`,
        links: [
          { label: "MS Docs — Covariance (out)", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance#covariance" }
        ],
        task: {
          q: "Почему IEnumerable&lt;Cat&gt; можно присвоить IEnumerable&lt;Animal&gt;, а List — нет?",
          options: [
            "IEnumerable только отдаёт элементы (out T), добавить в него нельзя — это безопасно",
            "IEnumerable быстрее List",
            "List устарел",
            "Разницы нет, оба нельзя"
          ],
          answer: 0,
          explain: "IEnumerable помечен out — T только на выход. Раз запись невозможна, расширять тип безопасно."
        }
      },
      {
        id: "var-3",
        title: "Контравариантность (in)",
        subtitle: "Если только принимаем — можно сужать тип",
        theory: `
<p>Теперь зеркальная ситуация. Есть «потребитель», который что-то <b>принимает на вход</b> и
ничего не возвращает. Например, <code>Action&lt;in T&gt;</code> или сравниватель
<code>IComparer&lt;in T&gt;</code>.</p>
<p>Если у тебя есть штука, умеющая обрабатывать <b>любое животное</b>, то она точно справится
и с <b>кошкой</b> (кошка — частный случай животного). Значит
<code>Action&lt;Animal&gt;</code> можно присвоить туда, где ждут
<code>Action&lt;Cat&gt;</code>.</p>
<p>Правило-подсказка: <code>in</code> → тип «едет вниз» (Animal → Cat). Противоположно
ковариантности.</p>`,
        code: `Action<Animal> handleAny = animal => Console.WriteLine("обрабатываю животное");

// РАБОТАЕТ: Action контравариантен (in T)
Action<Cat> handleCat = handleAny;

handleCat(new Cat()); // тот, кто умеет любое животное, умеет и кошку

// Определение в .NET:
// public delegate void Action<in T>(T obj);`,
        deep: `<p><b>Глубже:</b> <code>in</code> разрешён, только если <code>T</code> стоит
исключительно во <i>входных</i> позициях (аргументы методов). Мнемоника: <b>out — Producer</b>
(отдаёт), <b>in — Consumer</b> (принимает). Отсюда правило PECS из мира дженериков.</p>`,
        links: [
          { label: "MS Docs — Contravariance (in)", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance#contravariance" }
        ],
        task: {
          q: "Почему Action&lt;Animal&gt; можно присвоить переменной Action&lt;Cat&gt;?",
          options: [
            "Потому что Cat шире, чем Animal",
            "Обработчик любого животного справится и с частным случаем — кошкой (in T, только вход)",
            "Action всегда взаимозаменяемы",
            "Это ошибка, так делать нельзя"
          ],
          answer: 1,
          explain: "in T означает «только на вход». Кто принимает Animal, тот примет и Cat. Тип сужается — контравариантность."
        }
      },
      {
        id: "var-4",
        title: "Собираем правило воедино",
        subtitle: "out вверх, in вниз, иначе — стоп",
        theory: `
<p>Три случая:</p>
<ul>
<li><b>Ковариантно (out T):</b> только читаем/возвращаем → тип можно <i>расширять</i>
(Cat→Animal). Пример: <code>IEnumerable&lt;out T&gt;</code>, <code>IReadOnlyList&lt;out T&gt;</code>,
<code>Func&lt;out TResult&gt;</code>.</li>
<li><b>Контравариантно (in T):</b> только принимаем на вход → тип можно <i>сужать</i>
(Animal→Cat). Пример: <code>Action&lt;in T&gt;</code>, <code>IComparer&lt;in T&gt;</code>.</li>
<li><b>Инвариантно:</b> и читаем, и пишем → замена запрещена. Пример: <code>List&lt;T&gt;</code>,
<code>IList&lt;T&gt;</code>.</li>
</ul>
<p><code>Func&lt;in T, out TResult&gt;</code> — красивый пример: вход контравариантен, выход
ковариантен.</p>`,
        code: `// Func принимает T (in) и возвращает TResult (out)
// public delegate TResult Func<in T, out TResult>(T arg);

Func<Animal, Cat> f = animal => new Cat();

// вход можно сузить (Animal->Cat), выход расширить (Cat->Animal):
Func<Cat, Animal> g = f;  // РАБОТАЕТ`,
        deep: `<p><b>Глубже:</b> компилятор сам проверяет корректность <code>in</code>/<code>out</code>
при объявлении интерфейса. Ты не сможешь пометить <code>out T</code>, если тайком используешь
<code>T</code> как вход — это защита от небезопасных присваиваний.</p>`,
        links: [
          { label: "MS Docs — Using variance in interfaces", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/creating-variant-generic-interfaces" }
        ],
        task: {
          q: "Func&lt;Animal, Cat&gt; f. Какое присваивание корректно?",
          options: [
            "Func&lt;Cat, Animal&gt; g = f;",
            "Func&lt;Animal, Dog&gt; g = f;",
            "Func&lt;Cat, Dog&gt; g = f;",
            "List&lt;Animal&gt; g = f;"
          ],
          answer: 0,
          explain: "Вход контравариантен (Animal можно сузить до Cat), выход ковариантен (Cat можно расширить до Animal). Значит Func<Cat, Animal> подходит."
        }
      }
    ]
  },

  /* ================= WORLD 3: ENUMERABLES ================= */
  {
    id: "enumerables",
    name: "Enumerables",
    icon: "↻",
    blurb: "Как работает foreach, yield, ленивое выполнение и почему список можно «пройти» дважды по-разному.",
    levels: [
      {
        id: "enum-1",
        title: "IEnumerable и IEnumerator",
        subtitle: "Что на самом деле делает foreach",
        theory: `
<p><code>foreach</code> выглядит как магия, но под капотом — простой договор из двух частей:</p>
<ul>
<li><b>IEnumerable</b> — «меня можно перебрать». У него один метод: <code>GetEnumerator()</code>
— «дай мне ходока по элементам».</li>
<li><b>IEnumerator</b> — сам ходок. У него <code>MoveNext()</code> («шагни к следующему,
верни true если он есть») и <code>Current</code> («текущий элемент»).</li>
</ul>
<p><code>foreach</code> просто берёт ходока и в цикле дёргает <code>MoveNext()</code>, пока не
кончатся элементы. Всё.</p>`,
        code: `// foreach (var x in list) { use(x); }
// компилятор превращает это примерно в:

IEnumerator<int> e = list.GetEnumerator();
while (e.MoveNext())
{
    int x = e.Current;
    use(x);
}
// (и потом e.Dispose())`,
        deep: `<p><b>Глубже:</b> формально <code>foreach</code> даже не требует
<code>IEnumerable</code> — ему достаточно, чтобы у типа <i>был метод</i>
<code>GetEnumerator()</code> с <code>MoveNext()</code>/<code>Current</code> (duck typing).
Но на практике почти всё реализует <code>IEnumerable&lt;T&gt;</code>.</p>`,
        links: [
          { label: "MS Docs — IEnumerable<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.ienumerable-1" },
          { label: "PDF: Iterator pattern (у тебя в файле)", url: "#" }
        ],
        task: {
          q: "Что делает foreach «под капотом»?",
          options: [
            "Копирует всю коллекцию в массив",
            "Берёт enumerator и в цикле вызывает MoveNext()/Current",
            "Вызывает GetEnumerator() один раз и берёт первый элемент",
            "Работает только с массивами"
          ],
          answer: 1,
          explain: "foreach = GetEnumerator() + цикл while(MoveNext()) с чтением Current. Это и есть паттерн Iterator из твоего PDF."
        }
      },
      {
        id: "enum-2",
        title: "yield return",
        subtitle: "Итератор без ручного класса",
        theory: `
<p>Писать свой <code>IEnumerator</code> руками — нудно. C# даёт волшебное слово
<code>yield return</code>: пиши обычный метод, а компилятор сам построит ходока.</p>
<p>Каждый <code>yield return</code> — это «отдай элемент и <b>замри тут</b>». При следующем
шаге метод продолжится <b>ровно с этого места</b>, как будто нажали «пауза/продолжить».</p>`,
        code: `public IEnumerable<int> EvenNumbers(int max)
{
    for (int i = 0; i <= max; i += 2)
        yield return i;   // отдаём число и «замираем»
}

foreach (var n in EvenNumbers(6))
    Console.Write(n + " ");   // 0 2 4 6`,
        deep: `<p><b>Глубже:</b> компилятор превращает такой метод в скрытый класс —
<b>машину состояний</b>. Локальные переменные (<code>i</code>) становятся полями этого класса,
чтобы «запомниться» между шагами. Именно поэтому итератор может отдавать бесконечную
последовательность, не заполняя память.</p>`,
        links: [
          { label: "MS Docs — yield", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/yield" }
        ],
        task: {
          q: "Что происходит при yield return внутри метода?",
          options: [
            "Метод завершается навсегда",
            "Отдаётся элемент, а метод «замирает» и при следующем шаге продолжит с этого места",
            "Весь список считается сразу и возвращается",
            "Создаётся новый поток"
          ],
          answer: 1,
          explain: "yield return отдаёт очередной элемент и приостанавливает метод; следующий MoveNext() продолжит с той же точки (машина состояний)."
        }
      },
      {
        id: "enum-3",
        title: "Ленивое выполнение",
        subtitle: "Запрос считается не тогда, когда написан",
        theory: `
<p>Ключевая идея LINQ и итераторов: они <b>ленивые</b> (deferred execution). Когда ты пишешь
<code>list.Where(...)</code>, ничего ещё <i>не считается</i>. Запрос лишь «описан».
Реальная работа начинается, только когда ты начинаешь его <b>перебирать</b> (foreach,
<code>ToList()</code>, <code>Count()</code>...).</p>
<p>Отсюда две ловушки:</p>
<ul>
<li><b>Данные изменились</b> после описания запроса — результат отразит новые данные.</li>
<li><b>Двойной перебор</b> — запрос выполнится дважды (лишняя работа), а если источник
менялся — ещё и разные результаты.</li>
</ul>`,
        code: `var nums = new List<int> { 1, 2, 3 };

// запрос ОПИСАН, но НЕ выполнен
var query = nums.Where(n => n > 1);

nums.Add(4);            // меняем источник ПОСЛЕ описания

foreach (var n in query)
    Console.Write(n + " ");   // 2 3 4  ← четвёрка попала!`,
        deep: `<p><b>Глубже:</b> хочешь «снимок» здесь и сейчас — материализуй запрос:
<code>.ToList()</code> или <code>.ToArray()</code>. Это выполнит его один раз и зафиксирует
результат. Правило: если по запросу проходишь несколько раз или источник может меняться —
материализуй.</p>`,
        links: [
          { label: "MS Docs — Deferred execution (LINQ)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/linq/standard-query-operators/query-expression-basics" }
        ],
        task: {
          q: "var q = nums.Where(n => n > 1); потом nums.Add(4); потом foreach по q. Что выведет?",
          options: [
            "Только 2 3 — запрос зафиксировался сразу",
            "2 3 4 — запрос ленивый и выполнился при переборе, уже с добавленным элементом",
            "Ошибку",
            "Ничего"
          ],
          answer: 1,
          explain: "Ленивое выполнение: Where лишь описал запрос. Реальный перебор случился в foreach — уже после Add, поэтому 4 попала."
        }
      },
      {
        id: "enum-4",
        title: "LINQ поверх Enumerable",
        subtitle: "Цепочки, которые читаются как фраза",
        theory: `
<p>LINQ — это набор методов-расширений над <code>IEnumerable&lt;T&gt;</code>:
<code>Where</code> (фильтр), <code>Select</code> (преобразовать каждый),
<code>OrderBy</code> (сортировать), <code>First</code>, <code>Sum</code> и т.д. Каждый
принимает <code>IEnumerable</code> и возвращает <code>IEnumerable</code> — поэтому их можно
складывать в цепочку.</p>
<p>Пока цепочка не «материализована», всё это — одна ленивая труба, по которой элементы
текут по одному.</p>`,
        code: `var people = new[] { "anna", "bob", "alex", "kate" };

var result = people
    .Where(n => n.StartsWith("a"))  // anna, alex
    .Select(n => n.ToUpper())       // ANNA, ALEX
    .OrderBy(n => n);               // ALEX, ANNA

foreach (var n in result)
    Console.WriteLine(n);           // ALEX \n ANNA`,
        deep: `<p><b>Глубже:</b> методы вроде <code>Where/Select</code> — <i>отложенные</i>
(возвращают ленивый <code>IEnumerable</code>). А <code>ToList/Count/First/Sum</code> —
<i>немедленные</i> (сразу гоняют перебор). Знать, кто есть кто, — половина понимания
производительности LINQ.</p>`,
        links: [
          { label: "MS Docs — LINQ overview", url: "https://learn.microsoft.com/en-us/dotnet/csharp/linq/" },
          { label: "Книга: C# in Depth — LINQ", url: "https://csharpindepth.com/" }
        ],
        task: {
          q: "Какие из методов НЕ выполняют перебор сразу (отложенные)?",
          options: [
            "ToList и ToArray",
            "Count и Sum",
            "Where и Select",
            "First и Last"
          ],
          answer: 2,
          explain: "Where/Select лишь строят ленивую цепочку. ToList, Count, Sum, First — наоборот, немедленно запускают перебор."
        }
      }
    ]
  },

  /* ================= WORLD 4: FILESTREAM I/O ================= */
  {
    id: "filestream",
    name: "FileStream I/O",
    icon: "⤓",
    blurb: "Потоки байтов, чтение/запись файлов, using и Dispose, асинхронный ввод-вывод.",
    levels: [
      {
        id: "fs-1",
        title: "Что такое поток (Stream)",
        subtitle: "Труба, по которой текут байты",
        theory: `
<p>Файл на диске — это просто длинная лента байтов. Чтобы работать с ним, .NET даёт
<b>Stream</b> (поток) — абстракцию «труба, по которой байты идут туда или обратно».</p>
<p>Гениальность в том, что <code>Stream</code> — общий язык. Файл, сеть, память — всё это
потоки с одинаковыми методами <code>Read</code>/<code>Write</code>. Научился одному —
понял все.</p>
<p><code>FileStream</code> — это поток, привязанный к файлу. Есть «указатель позиции»
(<code>Position</code>), который двигается по мере чтения/записи.</p>`,
        code: `// у любого Stream есть общий набор:
//   Read(buffer, offset, count)  — прочитать байты в буфер
//   Write(buffer, offset, count) — записать байты
//   Position                     — где мы сейчас в потоке
//   Length                       — сколько всего
//   Dispose()                    — закрыть и освободить файл

// FileStream — Stream, который «смотрит» в файл на диске`,
        deep: `<p><b>Глубже:</b> потоки работают с <b>байтами</b>, не с текстом. Текст — это уже
интерпретация байтов через кодировку (UTF-8 и т.п.). Поэтому поверх байтовых потоков есть
удобные «обёртки» вроде <code>StreamReader/StreamWriter</code> — о них дальше.</p>`,
        links: [
          { label: "MS Docs — Stream class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.stream" },
          { label: "MS Docs — File and stream I/O", url: "https://learn.microsoft.com/en-us/dotnet/standard/io/" }
        ],
        task: {
          q: "Почему Stream — удобная абстракция?",
          options: [
            "Он работает только с файлами",
            "Файл, сеть и память имеют одинаковый интерфейс Read/Write — код переиспользуется",
            "Он превращает байты в текст автоматически",
            "Он быстрее массива"
          ],
          answer: 1,
          explain: "Stream даёт единый набор операций для разных источников байтов. Один и тот же код работает и с файлом, и с сетью, и с памятью."
        }
      },
      {
        id: "fs-2",
        title: "Чтение и запись байтов",
        subtitle: "FileStream напрямую",
        theory: `
<p>Открываем файл через <code>FileStream</code>, указываем режим (<code>FileMode</code>:
создать, открыть, дописать...). Записываем массив байтов через <code>Write</code>, читаем —
через <code>Read</code>.</p>
<p><code>Read</code> возвращает <b>сколько байт реально прочитано</b> (может быть меньше, чем
просили — файл кончился). Это важно: нельзя считать, что за один <code>Read</code> прочитается
всё.</p>`,
        code: `byte[] data = { 72, 105 }; // "Hi" в ASCII

// запись
using (var fs = new FileStream("out.bin", FileMode.Create))
{
    fs.Write(data, 0, data.Length);
}

// чтение
using (var fs = new FileStream("out.bin", FileMode.Open))
{
    byte[] buffer = new byte[16];
    int read = fs.Read(buffer, 0, buffer.Length);
    // read == 2 — прочитали ровно 2 байта
}`,
        deep: `<p><b>Глубже:</b> <code>Read</code> может вернуть меньше запрошенного даже
посреди файла (особенно у сетевых потоков). Поэтому «прочитать всё» обычно делают <b>в цикле</b>,
пока <code>Read</code> не вернёт 0, либо берут готовый <code>File.ReadAllBytes</code>.</p>`,
        links: [
          { label: "MS Docs — FileStream", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.filestream" },
          { label: "MS Docs — FileMode enum", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.filemode" }
        ],
        task: {
          q: "Что возвращает fs.Read(buffer, 0, count)?",
          options: [
            "Всегда count",
            "Число реально прочитанных байт (может быть меньше count, 0 в конце)",
            "Массив прочитанных байт",
            "true/false — удалось ли"
          ],
          answer: 1,
          explain: "Read возвращает фактически прочитанное количество байт. Полное чтение обычно делают циклом до тех пор, пока не вернётся 0."
        }
      },
      {
        id: "fs-3",
        title: "using и Dispose",
        subtitle: "Файл нужно закрывать — всегда",
        theory: `
<p>Открытый файл — это ресурс, который держит операционная система. Если его не закрыть, файл
может остаться «занят», данные — не сброситься на диск, а ресурсы — утечь.</p>
<p><code>FileStream</code> реализует <code>IDisposable</code> — у него есть
<code>Dispose()</code>, который закрывает файл. Но вызывать вручную рискованно: вылетит
исключение — и <code>Dispose</code> не выполнится.</p>
<p>Решение — <code>using</code>. Он <b>гарантирует</b> вызов <code>Dispose()</code> при выходе
из блока, даже если случилась ошибка.</p>`,
        code: `// Классический using-блок:
using (var fs = new FileStream("a.txt", FileMode.Create))
{
    // ...работаем...
} // <-- здесь Dispose() вызовется автоматически, даже при исключении

// Современный using-declaration (C# 8+):
using var fs2 = new FileStream("b.txt", FileMode.Create);
// Dispose() вызовется в конце текущего блока { }`,
        deep: `<p><b>Глубже:</b> для текстовых обёрток <code>StreamWriter</code> при
<code>Dispose</code> ещё и <b>сбрасывает буфер</b> (<code>Flush</code>) — записывает
недописанное на диск. Забыл закрыть — можешь потерять последние данные. Поэтому
<code>using</code> здесь не «хорошая практика», а необходимость.</p>`,
        links: [
          { label: "MS Docs — using statement", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/using" },
          { label: "MS Docs — IDisposable", url: "https://learn.microsoft.com/en-us/dotnet/api/system.idisposable" }
        ],
        task: {
          q: "Зачем оборачивать FileStream в using?",
          options: [
            "Чтобы код был короче",
            "Чтобы Dispose() (закрытие файла и сброс буфера) выполнился гарантированно, даже при исключении",
            "using ускоряет чтение",
            "Без using файл нельзя открыть"
          ],
          answer: 1,
          explain: "using гарантирует вызов Dispose при любом выходе из блока — файл закроется и буфер сбросится, даже если внутри вылетело исключение."
        }
      },
      {
        id: "fs-4",
        title: "Текст, буферы и async",
        subtitle: "Удобные обёртки и неблокирующий I/O",
        theory: `
<p>Работать с байтами руками — неудобно, если нужен текст. <code>StreamWriter</code> и
<code>StreamReader</code> — обёртки, которые сами превращают текст ↔ байты по кодировке.</p>
<p>А ещё диск и сеть — <b>медленные</b>. Пока файл читается, поток программы простаивает.
Асинхронные версии (<code>ReadAsync</code>/<code>WriteAsync</code> + <code>await</code>)
не блокируют поток: программа может заняться другим, пока идёт ввод-вывод.</p>`,
        code: `// Текст через обёртки:
using (var writer = new StreamWriter("log.txt"))
{
    writer.WriteLine("Привет, файл!");
}

using (var reader = new StreamReader("log.txt"))
{
    string line = reader.ReadLine();
}

// Асинхронно (не блокирует поток):
async Task SaveAsync()
{
    using var fs = new FileStream("big.bin", FileMode.Create,
                                  FileAccess.Write, FileShare.None,
                                  bufferSize: 4096, useAsync: true);
    byte[] data = new byte[1000];
    await fs.WriteAsync(data, 0, data.Length);
}`,
        deep: `<p><b>Глубже:</b> <code>bufferSize</code> задаёт, сколько байт копить перед
реальным обращением к диску — большими блоками работать быстрее, чем по байту.
Для настоящего асинхронного I/O важно открывать поток с <code>useAsync: true</code>, иначе
<code>WriteAsync</code> может внутри работать синхронно.</p>`,
        links: [
          { label: "MS Docs — StreamReader / StreamWriter", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.streamreader" },
          { label: "MS Docs — Async file I/O", url: "https://learn.microsoft.com/en-us/dotnet/standard/io/asynchronous-file-i-o" }
        ],
        task: {
          q: "Чем полезен await fs.WriteAsync(...) вместо fs.Write(...)?",
          options: [
            "Он всегда быстрее записывает байты",
            "Не блокирует поток на время медленного I/O — программа может заниматься другим",
            "Он не требует закрывать файл",
            "Он сжимает данные"
          ],
          answer: 1,
          explain: "Async I/O освобождает поток на время ожидания диска/сети. Это про отзывчивость и масштабируемость, а не про скорость самой записи."
        }
      }
    ]
  },

  /* ================= WORLD 5: CREATIONAL PATTERNS ================= */
  {
    id: "creational",
    name: "Паттерны: Creational",
    icon: "⚒",
    blurb: "Как создавать объекты гибко и безопасно: Singleton, Factory Method, Abstract Factory, Builder.",
    levels: [
      {
        id: "pat-singleton",
        title: "Singleton",
        subtitle: "Ровно один экземпляр на всё приложение",
        theory: `
<p><b>Задача:</b> гарантировать, что объект существует в <b>единственном</b> числе, и дать к
нему общую точку доступа. Пример: единая конфигурация приложения.</p>
<p>Трюк: конструктор делают <code>private</code> (никто снаружи не создаст), а внутри держат
единственный экземпляр и отдают его через статическое свойство <code>Instance</code>.</p>
<p><b>Осторожно:</b> Singleton часто называют и <i>анти-паттерном</i> — это скрытое глобальное
состояние. Используй его для <b>неизменяемых</b> вещей (настройки, кэш), не для бизнес-данных.</p>`,
        code: `public sealed class AppConfig
{
    // Lazy: объект создастся при первом обращении, потокобезопасно
    private static readonly Lazy<AppConfig> _instance =
        new(() => new AppConfig());

    public static AppConfig Instance => _instance.Value;

    public string Environment { get; } = "Production";

    private AppConfig() { }   // никто снаружи не вызовет new
}

// Использование:
string env = AppConfig.Instance.Environment;`,
        deep: `<p><b>Глубже:</b> <code>Lazy&lt;T&gt;</code> даёт потокобезопасную «ленивую»
инициализацию — экземпляр создаётся один раз даже при гонке потоков. В современном C# вместо
классического Singleton часто регистрируют сервис как <i>singleton</i> в
DI-контейнере — так его проще тестировать (можно подменить).</p>`,
        links: [
          { label: "PDF §7.1 Singleton (твой файл)", url: "#" },
          { label: "Refactoring.Guru — Singleton", url: "https://refactoring.guru/design-patterns/singleton" }
        ],
        task: {
          q: "Почему конструктор Singleton делают private?",
          options: [
            "Чтобы класс нельзя было наследовать",
            "Чтобы снаружи нельзя было создать второй экземпляр через new",
            "Для скорости",
            "Так требует компилятор"
          ],
          answer: 1,
          explain: "Приватный конструктор закрывает создание извне. Единственный экземпляр класс создаёт сам и отдаёт через Instance."
        }
      },
      {
        id: "pat-factory-method",
        title: "Factory Method",
        subtitle: "Создание объекта, но какой класс — решает подкласс",
        theory: `
<p><b>Задача:</b> код должен зависеть от <b>абстракции</b> (интерфейса), а <i>какой конкретный
класс</i> создать — пусть решает отдельная «фабрика».</p>
<p>Определяем интерфейс продукта (<code>IReport</code>) и абстрактную фабрику с методом
<code>Create()</code>. Каждая конкретная фабрика возвращает свой продукт. Клиент работает
только с интерфейсами и не знает про конкретные классы.</p>`,
        code: `public interface IReport { string Render(); }

public class PdfReport   : IReport { public string Render() => "PDF report"; }
public class ExcelReport : IReport { public string Render() => "Excel report"; }

public abstract class ReportFactory
{
    public abstract IReport Create();   // фабричный метод
}

public class PdfReportFactory   : ReportFactory
{ public override IReport Create() => new PdfReport(); }

public class ExcelReportFactory : ReportFactory
{ public override IReport Create() => new ExcelReport(); }

// Клиент знает только IReport и ReportFactory:
ReportFactory factory = new PdfReportFactory();
IReport report = factory.Create();`,
        deep: `<p><b>Глубже:</b> смысл — вынести <code>new ConcreteClass()</code> из клиентского
кода в одно место. Тогда добавить новый тип отчёта = добавить новую фабрику, не трогая клиента
(принцип открытости/закрытости). Возвращай <b>интерфейс</b>, никогда не конкретный класс.</p>`,
        links: [
          { label: "PDF §7.2 Factory Method", url: "#" },
          { label: "Refactoring.Guru — Factory Method", url: "https://refactoring.guru/design-patterns/factory-method" }
        ],
        task: {
          q: "В чём главный смысл Factory Method?",
          options: [
            "Создать много объектов быстро",
            "Убрать создание конкретных классов из клиента — он зависит только от интерфейса",
            "Гарантировать один экземпляр",
            "Ускорить рендеринг отчётов"
          ],
          answer: 1,
          explain: "Клиент работает с IReport/ReportFactory и не знает про PdfReport/ExcelReport. Выбор конкретного класса спрятан в фабрике."
        }
      },
      {
        id: "pat-abstract-factory",
        title: "Abstract Factory",
        subtitle: "Создание целого семейства совместимых объектов",
        theory: `
<p><b>Задача:</b> создавать не один объект, а <b>семейство связанных</b> объектов, которые
должны быть совместимы между собой. Классика: набор UI-элементов под Windows или под Mac —
кнопка и диалог должны быть «в одном стиле».</p>
<p>Отличие от Factory Method: Factory Method делает <b>один</b> продукт, Abstract Factory —
<b>семью</b> продуктов (кнопка + диалог + меню одного стиля).</p>`,
        code: `public interface IButton { string Paint(); }
public interface IDialog { string Show();  }

public class WinButton : IButton { public string Paint() => "Windows Button"; }
public class WinDialog : IDialog { public string Show()  => "Windows Dialog"; }
public class MacButton : IButton { public string Paint() => "Mac Button"; }
public class MacDialog : IDialog { public string Show()  => "Mac Dialog"; }

public interface IUiFactory
{
    IButton CreateButton();
    IDialog CreateDialog();
}

public class WinUiFactory : IUiFactory
{
    public IButton CreateButton() => new WinButton();
    public IDialog CreateDialog() => new WinDialog();
}
// MacUiFactory — аналогично, но Mac-элементы`,
        deep: `<p><b>Глубже:</b> одна фабрика гарантирует, что все элементы — из одного
семейства (не смешаешь <code>WinButton</code> с <code>MacDialog</code>). Цена: добавить
<i>новый вид продукта</i> (например, меню) — надо дописать метод во <b>все</b> фабрики.</p>`,
        links: [
          { label: "PDF §7.3 Abstract Factory", url: "#" },
          { label: "Refactoring.Guru — Abstract Factory", url: "https://refactoring.guru/design-patterns/abstract-factory" }
        ],
        task: {
          q: "Чем Abstract Factory отличается от Factory Method?",
          options: [
            "Ничем, это синонимы",
            "Abstract Factory создаёт семейство связанных объектов, а Factory Method — один продукт",
            "Factory Method сложнее",
            "Abstract Factory работает только с UI"
          ],
          answer: 1,
          explain: "Factory Method — один тип продукта. Abstract Factory — целое семейство совместимых продуктов (кнопка+диалог+меню одного стиля)."
        }
      },
      {
        id: "pat-builder",
        title: "Builder",
        subtitle: "Собирать сложный объект по шагам",
        theory: `
<p><b>Задача:</b> объект имеет много полей, часть — необязательные. Конструктор с десятью
параметрами нечитаем. <b>Builder</b> собирает объект <i>по шагам</i>, каждый шаг —
понятный метод.</p>
<p>Приём «fluent» (текучий интерфейс): каждый метод возвращает <code>this</code>, поэтому
вызовы складываются в цепочку, читаемую как фраза.</p>`,
        code: `public class Invoice
{
    public string Customer { get; set; } = "";
    public List<string> Lines { get; set; } = new();
    public decimal Discount { get; set; }
}

public class InvoiceBuilder
{
    private readonly Invoice _invoice = new();

    public InvoiceBuilder ForCustomer(string name)
    { _invoice.Customer = name; return this; }

    public InvoiceBuilder AddLine(string line)
    { _invoice.Lines.Add(line); return this; }

    public InvoiceBuilder WithDiscount(decimal d)
    { _invoice.Discount = d; return this; }

    public Invoice Build() => _invoice;
}

// Читается как предложение:
var invoice = new InvoiceBuilder()
    .ForCustomer("Anna")
    .AddLine("Coffee")
    .WithDiscount(0.1m)
    .Build();`,
        deep: `<p><b>Глубже:</b> в <code>Build()</code> хорошо проверять обязательные поля и
падать с понятной ошибкой, если чего-то не хватает («fail fast»). Билдер — короткоживущий:
создавай новый на каждый продукт, иначе состояние «протечёт» между вызовами.</p>`,
        links: [
          { label: "PDF §7.4 Builder", url: "#" },
          { label: "Refactoring.Guru — Builder", url: "https://refactoring.guru/design-patterns/builder" }
        ],
        task: {
          q: "Почему методы билдера возвращают this?",
          options: [
            "Чтобы экономить память",
            "Чтобы вызовы складывались в читаемую цепочку (fluent interface)",
            "Так требует интерфейс IBuilder",
            "Чтобы объект стал неизменяемым"
          ],
          answer: 1,
          explain: "Возврат this позволяет писать .ForCustomer(...).AddLine(...).Build() одной цепочкой — это и есть fluent-стиль."
        }
      }
    ]
  },

  /* ================= WORLD 6: STRUCTURAL PATTERNS ================= */
  {
    id: "structural",
    name: "Паттерны: Structural",
    icon: "▤",
    blurb: "Как собирать объекты в структуры: Adapter, Decorator, Composite.",
    levels: [
      {
        id: "pat-adapter",
        title: "Adapter",
        subtitle: "Переходник между несовместимыми интерфейсами",
        theory: `
<p><b>Задача:</b> у тебя есть чужой класс (сторонний SDK, легаси) с «неудобным» интерфейсом, а
твой код ждёт <i>другой</i>. Менять чужой код нельзя. <b>Adapter</b> — переходник: реализует
<i>твой</i> интерфейс, а внутри переводит вызовы в чужой.</p>
<p>Как физический переходник для розетки: снаружи — твоя вилка, внутри — чужой формат.</p>`,
        code: `public interface IPaymentGateway   // то, что ждёт твой код
{
    PaymentResult Charge(PaymentRequest request);
}

// Чужой SDK, который менять нельзя:
public class ThirdPartyPaySdk
{
    public SdkChargeResponse ExecuteCharge(SdkChargeRequest r) => new();
}

public class PaymentGatewayAdapter : IPaymentGateway
{
    private readonly ThirdPartyPaySdk _sdk;
    public PaymentGatewayAdapter(ThirdPartyPaySdk sdk) => _sdk = sdk;

    public PaymentResult Charge(PaymentRequest request)
    {
        // переводим ТВОЙ запрос -> формат SDK
        var sdkReq = new SdkChargeRequest {
            AmountInCents = (long)(request.Amount * 100m),
            CurrencyCode  = request.Currency,
            Token         = request.CardToken
        };
        var resp = _sdk.ExecuteCharge(sdkReq);
        // и обратно: ответ SDK -> ТВОЙ формат
        return new PaymentResult { Success = resp.Status == "OK" };
    }
}`,
        deep: `<p><b>Глубже:</b> держи адаптер <b>тонким</b> — он переводит только интерфейс, а
не добавляет бизнес-логику. Опасность — «семантическое несовпадение»: методы выглядят похоже,
но ведут себя по-разному. Такие различия документируй.</p>`,
        links: [
          { label: "PDF §8.1 Adapter", url: "#" },
          { label: "Refactoring.Guru — Adapter", url: "https://refactoring.guru/design-patterns/adapter" }
        ],
        task: {
          q: "Что делает Adapter?",
          options: [
            "Добавляет новую бизнес-логику поверх класса",
            "Реализует нужный тебе интерфейс, а внутри переводит вызовы в чужой несовместимый API",
            "Создаёт единственный экземпляр",
            "Собирает объект по шагам"
          ],
          answer: 1,
          explain: "Adapter — переходник: снаружи твой интерфейс, внутри трансляция в чужой. Чужой код при этом не меняется."
        }
      },
      {
        id: "pat-decorator",
        title: "Decorator",
        subtitle: "Добавлять поведение, оборачивая объект",
        theory: `
<p><b>Задача:</b> добавить объекту возможности (логирование, кэш, повтор при ошибке) без
создания кучи подклассов на каждую комбинацию. <b>Decorator</b> «оборачивает» объект в другой
объект с тем же интерфейсом, добавляя своё поведение до/после.</p>
<p>Как одежда: тело одно, а слоёв можно надеть сколько угодно, в любом порядке. Каждый слой —
тот же «человек» (интерфейс), но с добавкой.</p>`,
        code: `public interface IWeatherClient { string GetCurrent(string city); }

public class HttpWeatherClient : IWeatherClient
{
    public string GetCurrent(string city) => $"{city}: 29C, Sunny";
}

public abstract class WeatherDecorator : IWeatherClient
{
    protected readonly IWeatherClient Inner;
    protected WeatherDecorator(IWeatherClient inner) => Inner = inner;
    public virtual string GetCurrent(string city) => Inner.GetCurrent(city);
}

public class LoggingDecorator : WeatherDecorator
{
    public LoggingDecorator(IWeatherClient inner) : base(inner) { }
    public override string GetCurrent(string city)
    {
        Console.WriteLine($"[LOG] запрос погоды для {city}");
        var result = Inner.GetCurrent(city);   // делегируем внутреннему
        Console.WriteLine($"[LOG] ответ: {result}");
        return result;
    }
}

// Собираем слои:
IWeatherClient client = new LoggingDecorator(new HttpWeatherClient());`,
        deep: `<p><b>Глубже:</b> <b>порядок</b> декораторов важен: retry поверх logging и logging
поверх retry ведут себя по-разному. Именно так устроены middleware-конвейеры (ASP.NET). Минус —
глубокая вложенность усложняет чтение стека вызовов.</p>`,
        links: [
          { label: "PDF §8.2 Decorator", url: "#" },
          { label: "Refactoring.Guru — Decorator", url: "https://refactoring.guru/design-patterns/decorator" }
        ],
        task: {
          q: "Как Decorator добавляет поведение объекту?",
          options: [
            "Меняет исходный класс объекта",
            "Оборачивает объект в другой с тем же интерфейсом, добавляя логику до/после и делегируя внутреннему",
            "Создаёт подкласс на каждую комбинацию функций",
            "Хранит один экземпляр на всё приложение"
          ],
          answer: 1,
          explain: "Декоратор реализует тот же интерфейс, держит ссылку на «внутренний» объект, добавляет своё и делегирует вызов внутрь. Слои комбинируются."
        }
      },
      {
        id: "pat-composite",
        title: "Composite",
        subtitle: "Дерево, где лист и ветка обрабатываются одинаково",
        theory: `
<p><b>Задача:</b> работать с древовидной структурой (папки/файлы, категории товаров,
оргструктура) так, чтобы клиент <b>не различал</b> одиночный элемент (лист) и группу (ветку).</p>
<p>И лист, и ветка реализуют <b>один интерфейс</b>. Ветка внутри хранит детей и, когда её
просят посчитать/отрисовать, рекурсивно спрашивает своих детей.</p>`,
        code: `public interface ICatalogNode { decimal GetTotalPrice(); }

// Лист — конкретный товар
public class ProductItem : ICatalogNode
{
    public decimal Price { get; }
    public ProductItem(decimal price) => Price = price;
    public decimal GetTotalPrice() => Price;
}

// Ветка — категория с детьми
public class CategoryNode : ICatalogNode
{
    private readonly List<ICatalogNode> _children = new();
    public void Add(ICatalogNode node) => _children.Add(node);
    // рекурсивно суммируем детей — не важно, лист это или ветка
    public decimal GetTotalPrice() => _children.Sum(c => c.GetTotalPrice());
}

var phones = new CategoryNode();
phones.Add(new ProductItem(999m));
phones.Add(new ProductItem(899m));
var accessories = new CategoryNode();
accessories.Add(new ProductItem(39m));
phones.Add(accessories);           // ветку вкладываем в ветку
decimal total = phones.GetTotalPrice();  // 1937`,
        deep: `<p><b>Глубже:</b> красота — единый вызов <code>GetTotalPrice()</code> работает на
любой глубине. Риски: очень глубокие деревья могут упереться в глубину рекурсии, а случайные
циклы (ветка ссылается на себя) дадут бесконечный обход. Защищай целостность дерева.</p>`,
        links: [
          { label: "PDF §8.3 Composite", url: "#" },
          { label: "Refactoring.Guru — Composite", url: "https://refactoring.guru/design-patterns/composite" }
        ],
        task: {
          q: "Главная идея Composite?",
          options: [
            "Хранить один экземпляр дерева",
            "Лист и ветка реализуют один интерфейс, поэтому клиент обрабатывает их одинаково (рекурсивно)",
            "Оборачивать объект для добавления логики",
            "Переводить один интерфейс в другой"
          ],
          answer: 1,
          explain: "Composite делает лист и контейнер взаимозаменяемыми через общий интерфейс. Операция вызывается единообразно и рекурсивно спускается по дереву."
        }
      }
    ]
  },

  /* ================= WORLD 7: BEHAVIORAL PATTERNS ================= */
  {
    id: "behavioral",
    name: "Паттерны: Behavioral",
    icon: "⇄",
    blurb: "Как объекты общаются и меняют поведение: Iterator, Observer, Command, Strategy, State, Chain of Responsibility.",
    levels: [
      {
        id: "pat-iterator",
        title: "Iterator",
        subtitle: "Перебирать элементы, не раскрывая внутренности",
        theory: `
<p><b>Задача:</b> дать способ пройтись по элементам коллекции по одному, не показывая, как она
устроена внутри. В C# этот паттерн <b>встроен</b>: <code>IEnumerable&lt;T&gt;</code> +
<code>IEnumerator&lt;T&gt;</code>, а <code>yield return</code> строит итератор за тебя.</p>
<p>Ты уже видел это в мире Enumerables — здесь тот же паттерн, взгляд со стороны GoF.</p>`,
        code: `public class EvenNumbers : IEnumerable<int>
{
    private readonly int _max;
    public EvenNumbers(int max) => _max = max;

    public IEnumerator<int> GetEnumerator()
    {
        for (int i = 0; i <= _max; i += 2)
            yield return i;     // компилятор строит итератор
    }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

foreach (var n in new EvenNumbers(6))
    Console.Write(n + " ");     // 0 2 4 6`,
        deep: `<p><b>Глубже:</b> итератор в C# <b>ленивый</b> и с отложенным выполнением. Плюс —
можно отдавать бесконечные/потоковые последовательности. Минус — повторный перебор запускает
логику заново; если нужен снимок — <code>ToList()</code>.</p>`,
        links: [
          { label: "PDF §9.1 Iterator", url: "#" },
          { label: "MS Docs — IEnumerator<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.ienumerator-1" }
        ],
        task: {
          q: "Как в C# обычно реализуют паттерн Iterator?",
          options: [
            "Пишут свой класс IEnumerator вручную — иначе никак",
            "Через IEnumerable<T> и yield return, компилятор строит итератор сам",
            "Через Singleton",
            "Копированием коллекции в массив"
          ],
          answer: 1,
          explain: "Iterator встроен в язык: реализуешь GetEnumerator с yield return — и получаешь готовый ленивый итератор, скрывающий внутренности коллекции."
        }
      },
      {
        id: "pat-observer",
        title: "Observer",
        subtitle: "Один меняется — многие узнают",
        theory: `
<p><b>Задача:</b> когда один объект (издатель) меняет состояние, все заинтересованные
(подписчики) должны узнать об этом автоматически, при этом издатель <b>не знает</b>, кто
именно подписан.</p>
<p>Издатель хранит список подписчиков и при изменении обходит их, вызывая <code>Update</code>.
Подписчики могут появляться и уходить в любой момент.</p>`,
        code: `public interface IObserver { void Update(string value); }

public class PriceFeed
{
    private readonly List<IObserver> _observers = new();
    public void Subscribe(IObserver o)   => _observers.Add(o);
    public void Unsubscribe(IObserver o) => _observers.Remove(o);

    public void SetPrice(string price)
    {
        foreach (var o in _observers.ToList())  // копия — безопасно
            o.Update(price);                     // уведомляем всех
    }
}

public class Dashboard : IObserver
{ public void Update(string v) => Console.WriteLine($"[Dashboard] {v}"); }

var feed = new PriceFeed();
feed.Subscribe(new Dashboard());
feed.SetPrice("170");   // Dashboard получит уведомление`,
        deep: `<p><b>Глубже:</b> в .NET это чаще делают через <code>event</code> или
<code>IObservable&lt;T&gt;</code>. Классическая ловушка — <b>утечки памяти</b>: если забыть
<code>Unsubscribe</code>, издатель держит ссылку на подписчика, и тот не соберётся GC. Ещё —
изолируй ошибку одного подписчика, чтобы не сломать цепочку остальных.</p>`,
        links: [
          { label: "PDF §9.2 Observer", url: "#" },
          { label: "Refactoring.Guru — Observer", url: "https://refactoring.guru/design-patterns/observer" }
        ],
        task: {
          q: "Частая ошибка при использовании Observer?",
          options: [
            "Слишком быстрый код",
            "Забыть Unsubscribe → издатель держит ссылку → утечка памяти",
            "Нельзя иметь больше одного подписчика",
            "Издатель обязан знать классы всех подписчиков"
          ],
          answer: 1,
          explain: "Без отписки издатель продолжает держать подписчика, мешая сборщику мусора его освободить — классическая утечка памяти."
        }
      },
      {
        id: "pat-command",
        title: "Command",
        subtitle: "Запрос как объект: очередь, лог, undo",
        theory: `
<p><b>Задача:</b> превратить <i>действие</i> в <b>объект</b>. Тогда действие можно положить в
очередь, залогировать, выполнить позже или <b>отменить</b> (undo).</p>
<p>Команда хранит всё нужное для выполнения (получателя и параметры) и прячет это за методом
<code>Execute()</code>. Тот, кто запускает (invoker), не знает деталей — просто зовёт
<code>Execute()</code>.</p>`,
        code: `public interface ICommand { void Execute(); }

public class OrderService
{
    public void CreateOrder(string id) => Console.WriteLine($"Создан {id}");
}

public class CreateOrderCommand : ICommand
{
    private readonly OrderService _service;
    private readonly string _orderId;
    public CreateOrderCommand(OrderService s, string id)
    { _service = s; _orderId = id; }

    public void Execute() => _service.CreateOrder(_orderId);
}

// Очередь команд — выполним, когда захотим:
var queue = new Queue<ICommand>();
queue.Enqueue(new CreateOrderCommand(new OrderService(), "ORD-1001"));
while (queue.Count > 0) queue.Dequeue().Execute();`,
        deep: `<p><b>Глубже:</b> добавив метод <code>Undo()</code>, получаем undo/redo: две
стопки (Stack) — сделанного и отменённого. Именно так работают «Ctrl+Z» в редакторах.
Сложность обычно в <code>Undo</code> — откатить бывает труднее, чем выполнить.</p>`,
        links: [
          { label: "PDF §9.3 Command (+ Undo/Redo)", url: "#" },
          { label: "Refactoring.Guru — Command", url: "https://refactoring.guru/design-patterns/command" }
        ],
        task: {
          q: "Что даёт «упаковка» действия в объект-команду?",
          options: [
            "Действие можно выполнить только сразу",
            "Действие можно ставить в очередь, логировать, выполнять позже и отменять (undo)",
            "Команды всегда быстрее обычных вызовов",
            "Команда заменяет интерфейсы"
          ],
          answer: 1,
          explain: "Команда как объект хранит всё для выполнения. Её можно поставить в очередь, записать, отложить или откатить через Undo — отсюда undo/redo, job-очереди."
        }
      },
      {
        id: "pat-strategy",
        title: "Strategy",
        subtitle: "Взаимозаменяемые алгоритмы",
        theory: `
<p><b>Задача:</b> есть несколько способов сделать одно и то же (посчитать доставку: стандарт /
экспресс). Вместо кучи <code>if/else</code> в основном коде — вынеси каждый способ в отдельный
класс с общим интерфейсом и <b>подставляй нужный</b>.</p>
<p>Клиент («контекст») держит ссылку на <code>IStrategy</code> и просто вызывает её. Какой
именно алгоритм — решаешь снаружи.</p>`,
        code: `public interface IShippingStrategy
{
    decimal Calculate(decimal weightKg, decimal distanceKm);
}

public class StandardShipping : IShippingStrategy
{
    public decimal Calculate(decimal w, decimal d) => 5m + w * 0.8m + d * 0.02m;
}

public class ExpressShipping : IShippingStrategy
{
    public decimal Calculate(decimal w, decimal d) => 15m + w * 1.2m + d * 0.04m;
}

// Подставляем нужный алгоритм в рантайме:
IShippingStrategy strategy = new ExpressShipping();
decimal price = strategy.Calculate(2m, 100m);`,
        deep: `<p><b>Глубже:</b> держи стратегии <b>без состояния</b> (stateless), тогда их можно
безопасно переиспользовать. Выбор стратегии выноси в одно место (фабрика/резолвер), а не
разбрасывай <code>if</code> по коду. Имена давай по бизнес-смыслу (VipDiscount), а не по
механике.</p>`,
        links: [
          { label: "PDF §9.4 Strategy", url: "#" },
          { label: "Refactoring.Guru — Strategy", url: "https://refactoring.guru/design-patterns/strategy" }
        ],
        task: {
          q: "Strategy помогает избавиться от…",
          options: [
            "Интерфейсов в коде",
            "Ветвлений if/else, переключающих алгоритм — каждый алгоритм становится отдельным классом",
            "Необходимости создавать объекты",
            "Древовидных структур"
          ],
          answer: 1,
          explain: "Strategy заменяет разросшиеся if/else взаимозаменяемыми классами-алгоритмами за общим интерфейсом. Нужный подставляется в контекст."
        }
      },
      {
        id: "pat-state",
        title: "State",
        subtitle: "Объект меняет поведение, меняя состояние",
        theory: `
<p><b>Задача:</b> поведение объекта зависит от его состояния (заказ: новый / оплачен / отправлен
/ отменён), и в каждом состоянии одни действия разрешены, другие — нет. Вместо огромного
<code>switch</code> — каждое состояние это отдельный класс, который сам знает, куда можно
перейти.</p>
<p><b>Strategy vs State:</b> в Strategy алгоритм выбирает <i>клиент</i>. В State объект
<b>сам переключает</b> себя между состояниями.</p>`,
        code: `public interface IOrderState
{
    string Name { get; }
    IOrderState Pay();   // вернёт следующее состояние
}

public class NewOrderState : IOrderState
{
    public string Name => "New";
    public IOrderState Pay() => new PaidOrderState();  // New -> Paid
}

public class PaidOrderState : IOrderState
{
    public string Name => "Paid";
    public IOrderState Pay() => this;  // уже оплачен — остаёмся
}

public class OrderContext
{
    private IOrderState _state = new NewOrderState();
    public string Current => _state.Name;
    public void Pay() => _state = _state.Pay();  // объект сам меняет состояние
}

var order = new OrderContext();   // New
order.Pay();                      // -> Paid`,
        deep: `<p><b>Глубже:</b> правила переходов держи <b>внутри</b> состояний, а не размазывай
по контексту. Логируй переходы для отладки. Опасность — «взрыв состояний»: слишком много мелких
состояний усложняют картину. Рисуй диаграмму состояний.</p>`,
        links: [
          { label: "PDF §9.5 State", url: "#" },
          { label: "Refactoring.Guru — State", url: "https://refactoring.guru/design-patterns/state" }
        ],
        task: {
          q: "Ключевое отличие State от Strategy?",
          options: [
            "Это одно и то же",
            "В Strategy алгоритм выбирает клиент; в State объект сам переключает свои состояния",
            "State быстрее",
            "Strategy нельзя тестировать"
          ],
          answer: 1,
          explain: "Strategy: внешний код подставляет алгоритм. State: объект внутренне переходит между состояниями, и переходы задаёт сам."
        }
      },
      {
        id: "pat-chain",
        title: "Chain of Responsibility",
        subtitle: "Цепочка обработчиков: каждый может решить или передать дальше",
        theory: `
<p><b>Задача:</b> запрос должен пройти через несколько обработчиков по порядку. Каждый либо
<b>обрабатывает</b> его, либо <b>передаёт</b> следующему. Отправитель не знает, кто именно
обработает. Пример: согласование расходов (тимлид → менеджер → финдиректор).</p>`,
        code: `public class ExpenseRequest { public decimal Amount { get; set; } }

public abstract class ApprovalHandler
{
    protected ApprovalHandler? Next;
    public ApprovalHandler SetNext(ApprovalHandler next) { Next = next; return next; }
    public abstract void Handle(ExpenseRequest r);
}

public class TeamLead : ApprovalHandler
{
    public override void Handle(ExpenseRequest r)
    {
        if (r.Amount <= 300m) Console.WriteLine($"Тимлид одобрил {r.Amount}");
        else Next?.Handle(r);        // не могу — передаю дальше
    }
}

public class Manager : ApprovalHandler
{
    public override void Handle(ExpenseRequest r)
    {
        if (r.Amount <= 1500m) Console.WriteLine($"Менеджер одобрил {r.Amount}");
        else Next?.Handle(r);
    }
}

var lead = new TeamLead();
lead.SetNext(new Manager());
lead.Handle(new ExpenseRequest { Amount = 900m });  // одобрит Менеджер`,
        deep: `<p><b>Глубже:</b> обязательно предусмотри <b>конечный обработчик</b> (или явный
результат «не обработано»), иначе запрос молча «провалится» в никуда. Так же устроены
middleware-конвейеры и пайплайны валидации. Порядок звеньев критичен — покрывай тестами.</p>`,
        links: [
          { label: "PDF §9.6 Chain of Responsibility", url: "#" },
          { label: "Refactoring.Guru — CoR", url: "https://refactoring.guru/design-patterns/chain-of-responsibility" }
        ],
        task: {
          q: "Что важно предусмотреть в Chain of Responsibility?",
          options: [
            "Чтобы обработчиков было ровно два",
            "Конечный (fallback) обработчик или явный результат «не обработано», иначе запрос молча теряется",
            "Чтобы порядок обработчиков был случайным",
            "Единственный экземпляр цепочки"
          ],
          answer: 1,
          explain: "Без терминального обработчика запрос, который никто не взял, тихо исчезнет. Всегда задавай финальное звено или явный «not handled»."
        }
      }
    ]
  },

  /* ================= WORLD 8: DATA STRUCTURES & ALGORITHMS ================= */
  {
    id: "dsa",
    name: "Структуры данных и алгоритмы",
    icon: "⛃",
    blurb: "Big-O, списки, стек/очередь, словарь, поиск, сортировка и рекурсия. С заданиями «напиши сам».",
    levels: [
      {
        id: "dsa-bigo",
        title: "Сложность (Big-O)",
        subtitle: "Как мы измеряем «быстро» и «медленно»",
        theory: `
<p>Представь, что ищешь имя в телефонной книге. Можно листать подряд — а можно открыть
посередине и сразу отбросить половину. Второй способ быстрее. <b>Big-O</b> — это способ
описать, <i>как растёт время работы</i>, когда данных становится больше.</p>
<p>Читается как «примерно столько шагов на N элементов»:</p>
<ul>
<li><code>O(1)</code> — постоянно: сколько бы данных ни было, шаги те же (взять элемент по
индексу).</li>
<li><code>O(log n)</code> — очень медленно растёт: удваиваешь данные — добавляется один шаг
(бинарный поиск).</li>
<li><code>O(n)</code> — линейно: вдвое больше данных — вдвое больше шагов (пройти список
целиком).</li>
<li><code>O(n²)</code> — быстро «взрывается»: два вложенных цикла по данным (простая
сортировка).</li>
</ul>
<p>Big-O смотрит на <b>худший случай</b> и игнорирует мелочи — важно, как всё ведёт себя
на больших данных.</p>`,
        code: `int[] a = { 5, 8, 1, 9 };

// O(1): один шаг, размер не важен
int first = a[0];

// O(n): проходим все элементы
int sum = 0;
foreach (int x in a) sum += x;

// O(n^2): для каждого элемента — ещё один цикл по всем
for (int i = 0; i < a.Length; i++)
    for (int j = 0; j < a.Length; j++)
        Console.WriteLine(a[i] + a[j]);`,
        deep: `<p><b>Глубже:</b> Big-O говорит про <i>рост</i>, а не про точное время в секундах.
<code>O(1)</code> с большой константой может на маленьких данных быть медленнее <code>O(n)</code>,
но при росте N выигрывает всегда. Поэтому выбирают алгоритм по классу сложности, а константы
оптимизируют потом.</p>`,
        links: [
          { label: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" },
          { label: "Книга: Grokking Algorithms (очень наглядно)", url: "https://www.manning.com/books/grokking-algorithms" }
        ],
        task: {
          q: "У тебя два вложенных цикла, каждый проходит все n элементов. Какая это сложность?",
          options: [
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n²)"
          ],
          answer: 3,
          explain: "Цикл в цикле = n умножить на n = n². На больших данных это самый «тяжёлый» из перечисленных вариантов."
        }
      },
      {
        id: "dsa-list",
        title: "Массивы и списки",
        subtitle: "Фиксированная полка vs растягивающаяся",
        theory: `
<p><b>Массив</b> (<code>int[]</code>) — как полка с фиксированным числом ячеек. Взять элемент
по номеру — мгновенно (<code>O(1)</code>), но размер задан заранее и не меняется.</p>
<p><b>List&lt;T&gt;</b> — «умный» массив, который сам растёт, когда добавляешь. Внутри это тот
же массив, просто при заполнении он заводит новый побольше и копирует данные. Добавление в
конец — быстрое, а вот вставка в середину сдвигает всё дальше (<code>O(n)</code>).</p>`,
        code: `var nums = new List<int>();
nums.Add(10);          // добавить в конец
nums.Add(20);
nums.Insert(0, 5);     // вставить в начало — сдвигает остальные
int x = nums[1];       // взять по индексу — мгновенно
nums.RemoveAt(0);      // удалить по индексу`,
        deep: `<p><b>Глубже:</b> когда внутренний массив List заполняется, .NET создаёт новый
<b>вдвое больше</b> и копирует элементы. Одна такая операция дорогая, но случается редко,
поэтому «в среднем» добавление в конец считается <code>O(1)</code> (это называют
амортизированной сложностью).</p>`,
        links: [
          { label: "MS Docs — List<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1" }
        ],
        task: {
          kind: "write",
          q: "Каким методом List&lt;T&gt; добавляют один элемент в конец? Напиши только имя метода.",
          placeholder: "имя метода...",
          must: ["add"],
          solution: "Add",
          explain: "nums.Add(value) кладёт элемент в конец списка. Это быстрая операция — O(1) в среднем."
        }
      },
      {
        id: "dsa-stack-queue",
        title: "Стек и очередь",
        subtitle: "Стопка тарелок и очередь в кассу",
        theory: `
<p><b>Стек (Stack)</b> — как стопка тарелок: кладёшь и берёшь <i>сверху</i>. Последний
пришёл — первый ушёл (LIFO). Методы: <code>Push</code> (положить), <code>Pop</code> (снять
верхнюю).</p>
<p><b>Очередь (Queue)</b> — как очередь в магазине: кто пришёл первым, того и обслужат первым
(FIFO). Методы: <code>Enqueue</code> (встать в конец), <code>Dequeue</code> (взять первого).</p>`,
        code: `var stack = new Stack<string>();
stack.Push("A");
stack.Push("B");
string top = stack.Pop();   // "B" — последний вошёл, первым вышел

var queue = new Queue<string>();
queue.Enqueue("A");
queue.Enqueue("B");
string first = queue.Dequeue(); // "A" — первый вошёл, первым вышел`,
        deep: `<p><b>Глубже:</b> стек — основа «отмены» (Ctrl+Z) и обхода в глубину (DFS).
Очередь — основа обхода в ширину (BFS) и списков задач. Обе операции у них — <code>O(1)</code>,
потому что трогается только один край.</p>`,
        links: [
          { label: "MS Docs — Stack<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.stack-1" },
          { label: "MS Docs — Queue<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.queue-1" }
        ],
        task: {
          q: "Ты кладёшь в стек A, потом B, потом C. Что вернёт первый Pop()?",
          options: [
            "A — самый первый",
            "C — самый последний (LIFO)",
            "B — из середины",
            "Ошибку"
          ],
          answer: 1,
          explain: "Стек работает по принципу LIFO: последний вошедший выходит первым. Значит первым снимется C."
        }
      },
      {
        id: "dsa-dictionary",
        title: "Словарь (хеш-таблица)",
        subtitle: "Найти по ключу за один шаг",
        theory: `
<p><b>Dictionary&lt;TKey, TValue&gt;</b> хранит пары «ключ → значение», как настоящий словарь:
по слову сразу находишь перевод. Волшебство в том, что поиск по ключу — почти
<b>мгновенный</b> (<code>O(1)</code>), а не перебор всего подряд.</p>
<p>Как? Ключ прогоняют через <i>хеш-функцию</i> — она превращает ключ в число-адрес, и по
этому адресу сразу лежит значение. Не нужно листать всё.</p>`,
        code: `var ages = new Dictionary<string, int>();
ages["Anna"] = 20;
ages["Bob"]  = 25;

int a = ages["Anna"];              // 20 — быстрый поиск по ключу
bool has = ages.ContainsKey("Bob"); // true

// безопасно, без исключения если ключа нет:
if (ages.TryGetValue("Kate", out int k))
    Console.WriteLine(k);`,
        deep: `<p><b>Глубже:</b> <code>O(1)</code> — это «в среднем». Если у разных ключей
совпадает хеш (это называют <i>коллизией</i>), они складываются рядом и поиск чуть замедляется.
Хорошая хеш-функция делает коллизии редкими. Обращение к несуществующему ключу через
<code>[]</code> бросает исключение — поэтому есть <code>TryGetValue</code>.</p>`,
        links: [
          { label: "MS Docs — Dictionary<TKey,TValue>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2" }
        ],
        task: {
          kind: "write",
          q: "За какое время (в форме O(...)) Dictionary в среднем находит значение по ключу?",
          placeholder: "O(...)",
          must: ["o(1)"],
          solution: "O(1)",
          explain: "Хеш-функция сразу указывает адрес значения, поэтому поиск в среднем не зависит от размера — O(1)."
        }
      },
      {
        id: "dsa-binary-search",
        title: "Бинарный поиск",
        subtitle: "Каждый шаг выкидывает половину",
        theory: `
<p>Ищем число в <b>отсортированном</b> массиве. Вместо того чтобы идти подряд, смотрим в
<i>середину</i>. Если там больше искомого — нужное левее, отбрасываем правую половину. Если
меньше — отбрасываем левую. И так каждый шаг режем зону поиска пополам.</p>
<p>Из-за этого даже в миллионе элементов хватает ~20 шагов — сложность <code>O(log n)</code>.
Главное условие: массив должен быть <b>отсортирован</b>.</p>`,
        code: `int BinarySearch(int[] a, int target)
{
    int left = 0, right = a.Length - 1;
    while (left <= right)
    {
        int mid = (left + right) / 2;   // середина
        if (a[mid] == target) return mid;   // нашли
        if (a[mid] < target) left = mid + 1;  // ищем правее
        else right = mid - 1;                 // ищем левее
    }
    return -1;   // не нашли
}`,
        deep: `<p><b>Глубже:</b> <code>(left + right) / 2</code> на очень больших числах может
переполниться. Профессионалы пишут <code>left + (right - left) / 2</code> — тот же смысл,
но без риска переполнения. В .NET уже есть готовый <code>Array.BinarySearch</code>.</p>`,
        links: [
          { label: "MS Docs — Array.BinarySearch", url: "https://learn.microsoft.com/en-us/dotnet/api/system.array.binarysearch" }
        ],
        task: {
          kind: "write",
          q: "Какая сложность у бинарного поиска? Ответь в форме O(...).",
          placeholder: "O(...)",
          must: ["o(logn)"],
          solution: "O(log n)",
          explain: "Каждый шаг отбрасывает половину данных, поэтому число шагов растёт как логарифм — O(log n)."
        }
      },
      {
        id: "dsa-recursion",
        title: "Рекурсия",
        subtitle: "Метод, который зовёт сам себя",
        theory: `
<p><b>Рекурсия</b> — когда функция вызывает саму себя на задаче поменьше, пока не дойдёт до
самого простого случая. Как матрёшка: открываешь, внутри такая же, но меньше — и так до
крошечной, которую уже не открыть.</p>
<p>Две обязательные части:</p>
<ul>
<li><b>База</b> — момент, где остановиться (иначе бесконечный вызов и падение).</li>
<li><b>Шаг</b> — вызов себя же на меньшей задаче.</li>
</ul>
<p>Пример — факториал: <code>5! = 5 · 4 · 3 · 2 · 1</code>.</p>`,
        code: `int Factorial(int n)
{
    if (n <= 1) return 1;          // база: дальше не спускаемся
    return n * Factorial(n - 1);   // шаг: зовём себя на n-1
}

// Factorial(4) = 4 * Factorial(3)
//              = 4 * 3 * Factorial(2)
//              = 4 * 3 * 2 * Factorial(1) = 24`,
        deep: `<p><b>Глубже:</b> каждый вложенный вызов занимает место в <i>стеке вызовов</i>
(память под «кто кого позвал»). Слишком глубокая рекурсия его переполняет — это ошибка
<code>StackOverflow</code>. Иногда рекурсию специально переписывают в обычный цикл, чтобы
этого избежать.</p>`,
        links: [
          { label: "MS Docs — Recursion (tutorial)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/pattern-matching" },
          { label: "Grokking Algorithms — Recursion", url: "https://www.manning.com/books/grokking-algorithms" }
        ],
        task: {
          kind: "write",
          q: "Заполни пропуск в шаге рекурсии факториала: return n * Factorial(____);",
          placeholder: "что внутри скобок?",
          must: ["n-1"],
          solution: "n - 1",
          explain: "Чтобы дойти до базы (n <= 1), каждый вызов должен уменьшать n. Поэтому зовём Factorial(n - 1)."
        }
      },
      {
        id: "dsa-swap",
        title: "Практика: обмен значений",
        subtitle: "Классический трюк с временной переменной",
        theory: `
<p>Очень частая задачка внутри сортировок: <b>поменять местами</b> два элемента массива.
Наивная попытка <code>a[i] = a[j]; a[j] = a[i];</code> ломается — первое присваивание уже
затёрло старое значение <code>a[i]</code>.</p>
<p>Решение — <b>временная переменная</b> (temp), которая подержит одно значение, пока мы
перекладываем другое.</p>`,
        code: `// было: a[i] = 3, a[j] = 8
int temp = a[i];   // temp запоминает 3
a[i] = a[j];       // a[i] стало 8
a[j] = temp;       // a[j] стало 3
// стало: a[i] = 8, a[j] = 3`,
        deep: `<p><b>Глубже:</b> в C# можно и без temp — через кортежи:
<code>(a[i], a[j]) = (a[j], a[i]);</code>. Компилятор сам аккуратно всё переставит. Но понимать
вариант с <code>temp</code> важно — он встречается почти в любом языке.</p>`,
        links: [
          { label: "MS Docs — Tuples (деконструкция)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-tuples" }
        ],
        task: {
          kind: "write",
          q: "Напиши 3 строки, которые меняют местами a[i] и a[j] через переменную temp.",
          placeholder: "int temp = ...;\na[i] = ...;\na[j] = ...;",
          must: ["temp=a[i]", "a[i]=a[j]", "a[j]=temp"],
          solution: "int temp = a[i];\na[i] = a[j];\na[j] = temp;",
          explain: "temp держит старое a[i], пока мы кладём в a[i] значение a[j]; затем из temp достаём старое a[i] в a[j]."
        }
      },
      {
        id: "dsa-sorting",
        title: "Сортировка",
        subtitle: "Bubble sort vs быстрые методы",
        theory: `
<p><b>Пузырьковая сортировка (bubble sort)</b> — самая простая: проходим по массиву и меняем
местами соседей, если они «не в том порядке». Большие числа постепенно «всплывают» в конец,
как пузырьки. Просто, но медленно — <code>O(n²)</code>.</p>
<p>Умные сортировки (быстрая, слиянием) работают за <code>O(n log n)</code> — заметно быстрее
на больших данных. В реальном коде почти всегда берут готовое: <code>list.Sort()</code> или
<code>Array.Sort()</code>.</p>`,
        code: `void BubbleSort(int[] a)
{
    for (int i = 0; i < a.Length - 1; i++)
        for (int j = 0; j < a.Length - 1 - i; j++)
            if (a[j] > a[j + 1])
            {
                int temp = a[j];       // меняем соседей местами
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
}

// В реальности:
var nums = new List<int> { 5, 2, 8, 1 };
nums.Sort();   // [1, 2, 5, 8], внутри — быстрый алгоритм`,
        deep: `<p><b>Глубже:</b> <code>Array.Sort</code>/<code>List.Sort</code> используют
гибрид (introsort): быстрая сортировка + переключение на другие методы в плохих случаях —
стабильно <code>O(n log n)</code>. Писать свой bubble sort стоит только чтобы <i>понять</i>
идею, не для боевого кода.</p>`,
        links: [
          { label: "MS Docs — Array.Sort", url: "https://learn.microsoft.com/en-us/dotnet/api/system.array.sort" },
          { label: "VisuAlgo — визуализация сортировок", url: "https://visualgo.net/en/sorting" }
        ],
        task: {
          q: "Почему в рабочем коде обычно пишут list.Sort(), а не свой bubble sort?",
          options: [
            "bubble sort нельзя написать в C#",
            "Встроенная сортировка работает за O(n log n) — быстрее, и уже проверена",
            "list.Sort() сортирует только числа",
            "Разницы нет"
          ],
          answer: 1,
          explain: "Пузырёк — это O(n²) и учебный пример. Встроенный Sort использует быстрый гибридный алгоритм O(n log n) и хорошо оттестирован."
        }
      }
    ]
  },

  /* ================= WORLD: DELEGATES & EVENTS ================= */
  {
    id: "delegates",
    name: "Делегаты и события",
    icon: "⚡",
    blurb: "Хранить действие в переменной, передавать его и оповещать всех, кто подписан.",
    levels: [
      {
        id: "del-1",
        title: "Что такое делегат",
        subtitle: "Переменная, в которой лежит метод",
        theory: `
<p>Обычно в переменной лежат <i>данные</i>: число, строка. А что, если положить в переменную
целое <b>действие</b> — ссылку на метод? Тогда переменную можно передать другому коду, и тот
вызовет метод, даже не зная его имени.</p>
<p><b>Делегат</b> — это и есть такая «переменная-для-метода». Представь <b>пульт</b>: сама
кнопка не знает, что она включает — телевизор или свет. Ты решаешь это, когда «привязываешь»
к кнопке нужное действие. Делегат задаёт <i>форму</i> метода (что принимает, что возвращает),
а какой именно метод туда положить — решаешь позже.</p>`,
        code: `// объявляем форму: метод, который берёт int и возвращает int
delegate int Operation(int x);

int Double(int x) => x * 2;
int Square(int x) => x * x;

Operation op = Double;   // кладём метод в переменную
Console.WriteLine(op(5)); // 10 — вызвали через делегат

op = Square;             // переложили другой метод
Console.WriteLine(op(5)); // 25 — тот же вызов, другое поведение`,
        deep: `<p><b>Глубже:</b> делегат — это тип, безопасный по типам: компилятор проверит, что
метод точно подходит по форме (аргументы и возвращаемое значение). Под капотом делегат хранит
ещё и <i>на каком объекте</i> вызывать метод, поэтому он умеет держать и обычные методы, и
методы конкретного экземпляра.</p>`,
        links: [
          { label: "MS Docs — Delegates", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/" }
        ],
        task: {
          q: "Что хранит переменная-делегат?",
          options: [
            "Только числа",
            "Ссылку на метод — само действие, которое можно вызвать позже",
            "Копию всего класса",
            "Текст программы"
          ],
          answer: 1,
          explain: "Делегат — это переменная, в которой лежит ссылка на метод. Её можно передавать и вызывать, не зная имени метода заранее."
        }
      },
      {
        id: "del-2",
        title: "Func, Action, Predicate и лямбды",
        subtitle: "Готовые делегаты — не надо объявлять свои",
        theory: `
<p>Каждый раз писать <code>delegate ...</code> лень. В C# уже есть готовые делегаты на все
случаи:</p>
<ul>
<li><code>Action</code> — метод, который <b>ничего не возвращает</b> (что-то делает).</li>
<li><code>Func</code> — метод, который <b>возвращает</b> значение (последний тип — результат).</li>
<li><code>Predicate</code> — метод, который отвечает <b>да/нет</b> (возвращает <code>bool</code>).</li>
</ul>
<p>А вместо отдельного именованного метода можно писать <b>лямбду</b> — короткую запись
«прямо на месте»: <code>x =&gt; x * 2</code> читается как «взять x и вернуть x·2».</p>`,
        code: `Action<string> hello = name => Console.WriteLine("Привет, " + name);
hello("Anna");                     // Привет, Anna

Func<int, int, int> add = (a, b) => a + b;
Console.WriteLine(add(2, 3));      // 5

Predicate<int> isEven = n => n % 2 == 0;
Console.WriteLine(isEven(4));      // True

// делегаты часто передают прямо в методы:
var nums = new List<int> { 1, 2, 3, 4 };
var evens = nums.FindAll(isEven);  // [2, 4]`,
        deep: `<p><b>Глубже:</b> в <code>Func&lt;int, int, int&gt;</code> последний тип — это то, что
метод <b>возвращает</b>, а всё до него — аргументы. Лямбда — это просто короткий синтаксис для
безымянного метода; компилятор превращает её в обычный делегат. Именно на лямбдах держится
весь LINQ (<code>Where</code>, <code>Select</code> и т.д.).</p>`,
        links: [
          { label: "MS Docs — Func<>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.func-2" },
          { label: "MS Docs — Lambda expressions", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions" }
        ],
        task: {
          q: "Чем Func отличается от Action?",
          options: [
            "Ничем, это синонимы",
            "Func возвращает значение, Action ничего не возвращает",
            "Action быстрее работает",
            "Func нельзя использовать с лямбдами"
          ],
          answer: 1,
          explain: "Action — действие без результата, Func — метод, который возвращает значение (его тип стоит последним в угловых скобках)."
        }
      },
      {
        id: "del-3",
        title: "Мультикаст: несколько методов в одном делегате",
        subtitle: "Один вызов — много реакций",
        theory: `
<p>В делегат можно положить <b>сразу несколько</b> методов через <code>+=</code>. Тогда один
вызов запустит их все по очереди. Убрать метод — через <code>-=</code>.</p>
<p>Это фундамент событий: издатель просто «дёргает» делегат, а внутри срабатывают все, кто
туда подписался. Издатель даже не знает, сколько их и кто они.</p>`,
        code: `Action notify = () => Console.WriteLine("SMS отправлено");
notify += () => Console.WriteLine("Email отправлен");
notify += () => Console.WriteLine("Push отправлен");

notify();   // сработают все три по очереди

// SMS отправлено
// Email отправлен
// Push отправлен`,
        deep: `<p><b>Глубже:</b> такой делегат называют <i>мультикастным</i> — внутри он держит список
методов. У делегатов, которые <b>возвращают</b> значение, при мультикасте виден только
результат <i>последнего</i> метода, поэтому мультикаст обычно применяют к <code>Action</code>
(без результата). Если один из методов кинет исключение — остальные могут не выполниться.</p>`,
        links: [
          { label: "MS Docs — Multicast delegates", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/how-to-combine-delegates-multicast-delegates" }
        ],
        task: {
          q: "Каким оператором добавляют ещё один метод к делегату?",
          options: [
            "Оператором = (перезаписывает)",
            "Оператором += (добавляет к списку)",
            "Оператором * ",
            "Никак, делегат хранит один метод"
          ],
          answer: 1,
          explain: "+= добавляет метод к списку вызова, -= убирает. Знак = просто перезапишет и сотрёт всё, что было."
        }
      },
      {
        id: "del-4",
        title: "Событие (event)",
        subtitle: "Издатель кричит — подписчики слышат",
        theory: `
<p><b>Событие</b> — это делегат, но «защищённый». Проблема голого делегата: любой снаружи может
его <i>перезаписать</i> (<code>=</code>) или <i>вызвать</i>. Слово <code>event</code> это
запрещает: снаружи разрешено только <b>подписаться</b> (<code>+=</code>) и
<b>отписаться</b> (<code>-=</code>), а вызвать событие может только сам класс-издатель.</p>
<p>Это и есть паттерн <b>Observer</b>, встроенный в язык: один объект меняется — все подписчики
узнают автоматически, при этом издатель не знает, кто именно слушает.</p>`,
        code: `class Button
{
    // событие: наружу можно только += и -=
    public event Action? Clicked;

    public void Press()
    {
        Console.WriteLine("Кнопка нажата");
        Clicked?.Invoke();   // оповещаем подписчиков (если они есть)
    }
}

var btn = new Button();
btn.Clicked += () => Console.WriteLine("Открыть меню");
btn.Clicked += () => Console.WriteLine("Проиграть звук");

btn.Press();
// Кнопка нажата
// Открыть меню
// Проиграть звук`,
        deep: `<p><b>Глубже:</b> <code>Clicked?.Invoke()</code> — знак <code>?</code> проверяет, что
подписчики вообще есть (иначе <code>null</code> и ошибка). По соглашению .NET события часто
объявляют типом <code>EventHandler</code>/<code>EventHandler&lt;T&gt;</code> с параметрами
<code>(object sender, EventArgs e)</code> — чтобы подписчик знал, <i>кто</i> и <i>с какими
данными</i> вызвал событие. Важно не забывать <code>-=</code> при выходе, иначе подписчик не
соберётся сборщиком мусора (утечка памяти).</p>`,
        links: [
          { label: "MS Docs — Events", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/" }
        ],
        task: {
          q: "Зачем нужно ключевое слово event, если делегат и так умеет += ?",
          options: [
            "Оно ускоряет вызов",
            "Оно защищает делегат: снаружи можно только подписаться/отписаться, а вызвать — только сам класс",
            "Оно обязательно для любого делегата",
            "Разницы нет, это синонимы"
          ],
          answer: 1,
          explain: "event инкапсулирует делегат: чужой код не может ни перезаписать (=), ни вызвать событие — только подписаться и отписаться. Вызывает его только издатель."
        }
      },
      {
        id: "del-5",
        title: "EventBus — общая шина событий",
        subtitle: "Все общаются через одну «доску объявлений»",
        theory: `
<p>Когда частей в программе много, связывать их «каждый с каждым» напрямую — каша. Части знают
друг о друге, и поменять одну — значит сломать другую.</p>
<p><b>EventBus</b> (шина событий) — это посредник, общая «доска объявлений». Кто угодно может
<b>опубликовать</b> событие («заказ оплачен»), а кто угодно — <b>подписаться</b> на такой тип
события. Отправитель и получатель <b>не знают друг о друге</b> — они знают только шину. Это
паттерн Observer, поднятый на уровень всего приложения (его ещё зовут publish/subscribe).</p>`,
        code: `// простая шина: тип события -> список обработчиков
class EventBus
{
    private readonly Dictionary<Type, List<Delegate>> _subs = new();

    public void Subscribe<T>(Action<T> handler)
    {
        if (!_subs.ContainsKey(typeof(T)))
            _subs[typeof(T)] = new List<Delegate>();
        _subs[typeof(T)].Add(handler);
    }

    public void Publish<T>(T evt)
    {
        if (!_subs.ContainsKey(typeof(T))) return;
        foreach (var h in _subs[typeof(T)])
            ((Action<T>)h)(evt);   // оповещаем всех подписчиков этого типа
    }
}

record OrderPaid(int OrderId);

var bus = new EventBus();
bus.Subscribe<OrderPaid>(e => Console.WriteLine($"Склад: собрать заказ {e.OrderId}"));
bus.Subscribe<OrderPaid>(e => Console.WriteLine($"Почта: письмо о заказе {e.OrderId}"));

bus.Publish(new OrderPaid(42));
// Склад: собрать заказ 42
// Почта: письмо о заказе 42`,
        deep: `<p><b>Глубже:</b> плюс шины — <i>слабая связанность</i>: добавить новый обработчик
(например, аналитику) можно, не трогая ни отправителя, ни другие части. Минус — поток событий
становится «невидимым»: по коду трудно понять, кто на что реагирует, и легко получить
циклы/утечки, если забыть отписаться. Поэтому в больших проектах берут готовые библиотеки
(например, MediatR) с логами и управлением жизненным циклом.</p>`,
        links: [
          { label: "Wikipedia — Publish–subscribe pattern", url: "https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" },
          { label: "MediatR (популярная реализация шины на .NET)", url: "https://github.com/jbogard/MediatR" }
        ],
        task: {
          kind: "write",
          q: "Главный плюс EventBus — отправитель и получатель НЕ знают друг о друге. Как называется такое свойство (два слова)?",
          placeholder: "например: ... связанность",
          must: ["слабая", "связанность"],
          solution: "Слабая связанность (loose coupling)",
          explain: "EventBus даёт слабую связанность: части общаются через шину, а не напрямую, поэтому их можно менять и добавлять независимо."
        }
      },
      {
        id: "del-6",
        title: "EventHandler и EventArgs",
        subtitle: "Стандартная форма события в .NET",
        theory: `
<p>Своё <code>event Action</code> писать можно, но во всём .NET принято одно <b>соглашение</b>:
событие сообщает подписчику две вещи — <b>кто</b> его вызвал и <b>какие данные</b> с ним пришли.</p>
<p>Для этого есть готовый делегат <code>EventHandler&lt;T&gt;</code>. Он всегда передаёт
<code>(object sender, T e)</code>: <code>sender</code> — источник события (например, сама кнопка),
а <code>e</code> — «конвертик» с данными (наследник <code>EventArgs</code>). Так любой подписчик
знает, откуда прилетело и что внутри.</p>`,
        code: `// "конвертик" с данными события
class TemperatureEventArgs : EventArgs
{
    public int Degrees { get; init; }
}

class Sensor
{
    public event EventHandler<TemperatureEventArgs>? Changed;

    public void Report(int degrees)
    {
        // sender = this (сам датчик), e = данные
        Changed?.Invoke(this, new TemperatureEventArgs { Degrees = degrees });
    }
}

var sensor = new Sensor();
sensor.Changed += (sender, e) =>
    Console.WriteLine($"Стало {e.Degrees}°");

sensor.Report(21);   // Стало 21°`,
        deep: `<p><b>Глубже:</b> зачем этот ритуал с <code>sender</code> и <code>EventArgs</code>? Чтобы
все события в программе выглядели одинаково — один подписчик может слушать много источников и
всегда знает, кто именно сработал. А если завтра к событию добавится ещё одно поле — ты просто
кладёшь его в <code>EventArgs</code>, и старые подписчики не ломаются. Когда данных нет, передают
<code>EventArgs.Empty</code>.</p>`,
        links: [
          { label: "MS Docs — EventHandler<TEventArgs>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.eventhandler-1" },
          { label: "MS Docs — Standard event pattern", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/how-to-publish-events-that-conform-to-net-guidelines" }
        ],
        task: {
          q: "Что передаёт подписчику стандартный EventHandler<T>?",
          options: [
            "Ничего, просто сигнал",
            "Источник события (sender) и данные события (e)",
            "Только число",
            "Копию всей программы"
          ],
          answer: 1,
          explain: "Стандарт .NET: (object sender, T e) — кто вызвал событие и с какими данными. Так подписчик всегда знает источник и содержимое."
        }
      },
      {
        id: "del-7",
        title: "Отписка и утечки памяти",
        subtitle: "Подписался — не забудь отписаться",
        theory: `
<p>Когда ты пишешь <code>publisher.Event += handler</code>, издатель начинает <b>держать
ссылку</b> на подписчика. Пока издатель жив — он «держит за руку» всех подписчиков.</p>
<p>Проблема: если подписчик тебе больше не нужен, но ты не отписался (<code>-=</code>), сборщик
мусора не может его убрать — ведь издатель всё ещё на него ссылается. Подписчик «висит» в
памяти зря. Это и есть <b>утечка памяти</b> через события. Правило: на каждый <code>+=</code>
должен найтись <code>-=</code>.</p>`,
        code: `void HandleClick(object? s, EventArgs e)
    => Console.WriteLine("клик");

button.Clicked += HandleClick;   // подписались

// ...пока экран открыт, обрабатываем клики...

button.Clicked -= HandleClick;   // ЗАКРЫВАЯ экран — отписались

// важно: -= сработает только с ТЕМ ЖЕ методом.
// Лямбду отписать нельзя, если не сохранил её в переменную:
Action handler = () => Console.WriteLine("hi");
timer.Tick += handler;
timer.Tick -= handler;   // ок, ссылка та же`,
        deep: `<p><b>Глубже:</b> частая ловушка — подписаться лямбдой прямо в строке
(<code>+= () =&gt; ...</code>) и потом пытаться отписаться такой же лямбдой. Не выйдет: это два
<i>разных</i> объекта, <code>-=</code> их не сопоставит. Поэтому лямбду, которую надо будет
снять, сохраняют в переменную. В долгоживущих приложениях (UI, сервисы) забытая подписка —
классическая причина роста памяти.</p>`,
        links: [
          { label: "MS Docs — How to subscribe/unsubscribe", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/how-to-subscribe-to-and-unsubscribe-from-events" }
        ],
        task: {
          q: "Почему забытая подписка на событие приводит к утечке памяти?",
          options: [
            "Событие копирует весь объект",
            "Издатель держит ссылку на подписчика, и сборщик мусора не может его удалить",
            "Подписки занимают место на диске",
            "Это миф, утечки не бывает"
          ],
          answer: 1,
          explain: "Пока издатель ссылается на подписчика (через +=), сборщик мусора считает его «живым». Не отписался -= — объект висит в памяти зря."
        }
      },
      {
        id: "del-8",
        title: "Собери сам: событие с нуля",
        subtitle: "Проверь, что понял",
        theory: `
<p>Соберём всё вместе. Нужен класс-издатель с событием, которое срабатывает при каком-то
действии, и подписчик, который на него реагирует.</p>
<p>В задании ниже допиши недостающую строчку — <b>вызов события</b>. Подсказка: событие
безопасно вызывают через <code>?.Invoke(...)</code>, чтобы не упасть, если подписчиков нет.</p>`,
        code: `class Alarm
{
    public event Action<string>? Rang;   // событие с текстом-причиной

    public void Trigger(string reason)
    {
        // ЗДЕСЬ должен быть вызов события ↓
        Rang?.Invoke(reason);
    }
}

var alarm = new Alarm();
alarm.Rang += reason => Console.WriteLine("Тревога: " + reason);
alarm.Trigger("дым");   // Тревога: дым`,
        deep: `<p><b>Глубже:</b> <code>?.Invoke</code> — это защита от <code>null</code>: если никто не
подписан, событие равно <code>null</code>, и обычный вызов упал бы с ошибкой. Знак вопроса
говорит: «вызывай, только если есть кому отвечать».</p>`,
        links: [
          { label: "MS Docs — Events", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/" }
        ],
        task: {
          kind: "write",
          q: "Внутри метода Trigger напиши строку, которая безопасно вызывает событие Rang и передаёт ему reason. (используй ?.Invoke)",
          placeholder: "Rang?.Invoke(...);",
          must: ["rang?.invoke(reason)"],
          solution: "Rang?.Invoke(reason);",
          explain: "Rang?.Invoke(reason); — знак ? проверяет, что подписчики есть, а Invoke запускает их всех и передаёт причину тревоги."
        }
      }
    ]
  },

  /* ================= WORLD 10: REFLECTION ================= */
  {
    id: "reflection",
    name: "Reflection",
    icon: "◉",
    blurb: "Программа читает свои же метаданные: находит типы, создаёт объекты и вызывает методы по имени.",
    levels: [
      {
        id: "refl-1",
        title: "Что такое reflection",
        subtitle: "На каждой детали выгравирована табличка",
        theory: `
<p>Представь ящик с незнакомыми инструментами. На каждом выгравирована табличка: как называется,
для чего, какие насадки подходят. Ты можешь взять инструмент, которого никогда не видел, прочитать
табличку и сразу им пользоваться.</p>
<p>Компилятор кладёт в сборку (DLL или EXE) не только код, но и такие таблички — <b>метаданные</b>:
все типы, их методы, свойства, параметры, атрибуты. <b>Reflection</b> — это API, который читает эти
таблички <i>во время выполнения</i> и умеет вызвать то, что нашёл.</p>
<p>Разница проста. Обычный код знает имена заранее: ты пишешь <code>user.Name</code>, и компилятор
это проверяет. Reflection узнаёт имена в рантайме — из строки, из конфига, из чужой DLL. Ты
работаешь не с <code>User</code>, а с объектом <code>Type</code>, который <i>описывает</i>
<code>User</code>.</p>`,
        code: `// Обычный код: имена известны на этапе компиляции
var user = new User();
user.Name = "Anna";
Console.WriteLine(user.Name);

// То же самое через reflection: имена находим в рантайме
using System.Reflection;

Type type = typeof(User);
object instance = Activator.CreateInstance(type)!;

PropertyInfo? nameProp = type.GetProperty("Name");
nameProp!.SetValue(instance, "Anna");
Console.WriteLine(nameProp.GetValue(instance));   // Anna

// Метаданные лежат в самой сборке — их можно просто листать
Assembly asm = type.Assembly;
Console.WriteLine(asm.FullName);`,
        deep: `<p><b>Глубже:</b> reflection ничего не «декомпилирует» и не гадает. Она читает те же самые
таблицы метаданных, по которым работает сама среда выполнения: CLR по ним делает JIT, проверяет
типы и находит методы. То есть ты получаешь доступ к внутреннему справочнику .NET. Отсюда и цена:
<code>typeof(User)</code> — это почти константа, а <code>Type.GetType(&quot;User&quot;)</code> —
настоящий поиск по строке. И отсюда же главная опасность: trimming и Native AOT вырезают то, что
«никто не вызывает», а вызов через строку они не видят.</p>`,
        links: [
          { label: "MS Docs — Reflection and attributes", url: "https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/reflection-and-attributes/" },
          { label: "MS Docs — Reflection in .NET", url: "https://learn.microsoft.com/en-us/dotnet/fundamentals/reflection/reflection" }
        ],
        task: {
          q: "Чем reflection отличается от обычного вызова метода?",
          options: [
            "Reflection быстрее, потому что обходит компилятор",
            "Reflection находит типы и члены во время выполнения — по метаданным, а не по именам, вписанным в код",
            "Reflection нужна только для работы с базами данных",
            "Reflection выключает проверку типов во всей программе"
          ],
          answer: 1,
          explain: "Reflection читает метаданные сборки в рантайме. Поэтому имя может прийти строкой из конфига — но компилятор такую строку уже не проверит."
        }
      },
      {
        id: "refl-2",
        title: "Type и сборка",
        subtitle: "Type — это паспорт типа",
        theory: `
<p><code>Type</code> — паспорт. В нём написано всё про тип: имя, класс он или структура, кто его
родитель, какие интерфейсы реализует. Сам объект — это человек, а <code>Type</code> — документ
о нём.</p>
<p>Паспорт можно получить тремя способами:</p>
<ul>
<li><code>typeof(User)</code> — тип известен на этапе компиляции. Самый быстрый и безопасный путь.</li>
<li><code>obj.GetType()</code> — спросить у существующего объекта, кто он на самом деле.</li>
<li><code>Type.GetType(&quot;имя&quot;)</code> — имя пришло строкой в рантайме. Легко ошибиться:
вернётся <code>null</code>, а не исключение.</li>
</ul>
<p><b>Assembly</b> — это сама коробка, то есть загруженная DLL или EXE. У неё есть
<code>GetTypes()</code>: список всех типов внутри. С этого начинается любой сканер — плагины,
DI-контейнеры, тесты.</p>`,
        code: `using System.Reflection;

// 1) Тип известен на этапе компиляции
Type t1 = typeof(string);
Type t2 = typeof(List<>);        // открытый generic: T ещё не задан
Type t3 = typeof(List<int>);     // закрытый generic

// 2) Тип берём у существующего объекта
object value = "hello";
Type t4 = value.GetType();       // System.String

// 3) Тип из строки — имя приходит в рантайме
Type? t5 = Type.GetType("System.Int32");
Type? t6 = Type.GetType("Acme.Shop.Order, Acme.Shop");  // и имя сборки тоже

// Осмотр всей сборки целиком
Assembly asm = typeof(Program).Assembly;
Console.WriteLine(asm.FullName);

foreach (Type type in asm.GetTypes())
{
    if (!type.IsClass || type.IsAbstract) continue;
    Console.WriteLine(type.FullName + "  base=" + type.BaseType?.Name);
}`,
        deep: `<p><b>Глубже:</b> <code>Type.GetType(&quot;Acme.Shop.Order&quot;)</code> ищет тип
только в двух местах: в сборке, откуда ты вызываешь, и в системной библиотеке. Чужую DLL он сам
не подгрузит — поэтому нужно <i>assembly-qualified</i> имя вида
<code>&quot;Acme.Shop.Order, Acme.Shop&quot;</code>. Второй капкан: <code>typeof(List&lt;&gt;)</code>
даёт «открытый» тип, у него <code>IsGenericTypeDefinition == true</code>, и создать из него объект
нельзя. Сначала закрой его: <code>MakeGenericType(typeof(int))</code>.</p>`,
        links: [
          { label: "MS Docs — Type", url: "https://learn.microsoft.com/en-us/dotnet/api/system.type" },
          { label: "MS Docs — Type.GetType", url: "https://learn.microsoft.com/en-us/dotnet/api/system.type.gettype" }
        ],
        task: {
          q: "Имя типа приходит из конфига: «Acme.Shop.Order». Type.GetType вернул null, хотя класс точно существует. Самая вероятная причина?",
          options: [
            "Type.GetType работает только со значимыми типами",
            "Имя не assembly-qualified, а нужную сборку GetType сам не ищет",
            "Надо было написать typeof вместо Type.GetType",
            "Для публичных классов GetType всегда возвращает null"
          ],
          answer: 1,
          explain: "GetType смотрит в вызывающую сборку и в системную библиотеку. Для чужой DLL нужно имя вида «Acme.Shop.Order, Acme.Shop» — иначе тихий null."
        }
      },
      {
        id: "refl-3",
        title: "Члены типа: свойства и методы",
        subtitle: "Список кнопок на незнакомом пульте",
        theory: `
<p>Ты нашёл пульт без подписи. Reflection даёт список всех его кнопок: как называется каждая, что
она принимает, можно ли её нажать. И позволяет нажать.</p>
<p>Кнопки описываются классами-«инфошками»: <code>PropertyInfo</code> (свойство,
<code>GetValue</code> / <code>SetValue</code>), <code>MethodInfo</code> (метод,
<code>Invoke</code>), <code>FieldInfo</code> (поле), <code>ConstructorInfo</code> (конструктор).
У всех общий родитель — <code>MemberInfo</code>.</p>
<p>Важная деталь: <code>GetMethod</code> и <code>GetProperty</code> по умолчанию видят только
<b>public</b> и <b>нестатические</b> члены. Приватный метод вернёт <code>null</code>, пока ты не
попросишь явно через <code>BindingFlags.Instance | BindingFlags.NonPublic</code>. Да, reflection
умеет вызывать private — это спасает фреймворки и тесты, но ломает инкапсуляцию.</p>`,
        code: `using System.Reflection;

public class Product
{
    public string Name { get; set; } = "";
    public decimal Price { get; private set; }
    public void ApplyDiscount(decimal percent) => Price *= 1 - percent;
    private void Touch() { }
}

Type type = typeof(Product);
object product = Activator.CreateInstance(type)!;

// Свойство: читаем и пишем
PropertyInfo name = type.GetProperty("Name")!;
name.SetValue(product, "Tea");
Console.WriteLine(name.GetValue(product));       // Tea

// Метод: вызываем, аргументы передаём массивом object
MethodInfo apply = type.GetMethod("ApplyDiscount")!;
apply.Invoke(product, new object[] { 0.10m });   // минус 10%

// Приватное — только если попросить BindingFlags
MethodInfo? touch = type.GetMethod("Touch",
    BindingFlags.Instance | BindingFlags.NonPublic);
touch?.Invoke(product, null);`,
        deep: `<p><b>Глубже:</b> у <code>Invoke</code> подпись
<code>object Invoke(object, object[])</code> — значит каждый <code>int</code> и
<code>decimal</code> по пути упаковывается в <code>object</code> (<i>boxing</i>), а результат
приходится приводить обратно. И ещё: если метод внутри бросит исключение, ты поймаешь не его, а
<code>TargetInvocationException</code> — настоящая причина спрятана в
<code>InnerException</code>. Отладчики и логи на этом регулярно путают людей.</p>`,
        links: [
          { label: "MS Docs — PropertyInfo", url: "https://learn.microsoft.com/en-us/dotnet/api/system.reflection.propertyinfo" },
          { label: "MS Docs — BindingFlags", url: "https://learn.microsoft.com/en-us/dotnet/api/system.reflection.bindingflags" }
        ],
        task: {
          kind: "write",
          q: "Есть Type type и объект product. Прочитай через reflection значение публичного свойства «Name»: сначала получи PropertyInfo, потом возьми значение.",
          placeholder: "две строки C#...",
          must: ["getproperty", "getvalue"],
          solution: "var prop = type.GetProperty(nameof(Product.Name));\nobject? value = prop.GetValue(product);",
          explain: "GetProperty находит описание свойства по имени, GetValue читает значение у конкретного экземпляра. nameof лучше строки: при переименовании сломается компиляция, а не рантайм."
        }
      },
      {
        id: "refl-4",
        title: "Создание объектов: Activator",
        subtitle: "3D-принтер: даёшь чертёж — получаешь вещь",
        theory: `
<p><code>Activator.CreateInstance(type)</code> — это 3D-принтер. Ты не пишешь <code>new</code>,
ты подаёшь чертёж (объект <code>Type</code>) и получаешь готовый предмет. Чертёж мог прийти из
конфига или из чужой DLL — принтеру всё равно.</p>
<p>Варианты: без аргументов, с аргументами конструктора, или напрямую через
<code>ConstructorInfo.Invoke</code>. Для дженериков сначала закрываешь тип
<code>MakeGenericType</code>, иначе создавать нечего.</p>
<p>Вот зачем это нужно на практике. Соедини «создать объект» и «пройти по свойствам» — и получится
<b>маппер</b>: копирование одноимённых свойств из одного объекта в другой. Именно так, только
намного оптимизированнее, работают сериализаторы, ORM и AutoMapper.</p>`,
        code: `using System.Reflection;

// Пустой конструктор
object? a = Activator.CreateInstance(typeof(Product));

// Конструктор с аргументами
object? b = Activator.CreateInstance(typeof(List<int>), new object[] { 16 });

// Открытый generic нужно сначала «закрыть»
Type closed = typeof(List<>).MakeGenericType(typeof(string));
object list = Activator.CreateInstance(closed)!;      // List<string>

// Практика: копируем одноимённые свойства source -> target
static void CopyProperties(object source, object target)
{
    Type srcType = source.GetType();
    Type dstType = target.GetType();

    foreach (PropertyInfo src in srcType.GetProperties())
    {
        if (!src.CanRead) continue;

        PropertyInfo? dst = dstType.GetProperty(src.Name);
        if (dst is null || !dst.CanWrite) continue;

        // типы должны быть совместимы, иначе SetValue упадёт
        if (!dst.PropertyType.IsAssignableFrom(src.PropertyType)) continue;

        dst.SetValue(target, src.GetValue(source));
    }
}`,
        deep: `<p><b>Глубже:</b> <code>Activator.CreateInstance</code> каждый вызов заново ищет
конструктор и проверяет аргументы. Для горячего кода это чинят так: один раз находят
<code>ConstructorInfo</code> и <b>компилируют</b> из него делегат —
<code>Expression.Lambda&lt;Func&lt;object&gt;&gt;(Expression.New(ctor)).Compile()</code>. Дальше
создание объекта стоит почти как обычный <code>new</code>. Reflection здесь работает один раз, на
старте; в рантайме её уже нет. Плюс мелочь: у структур пустой конструктор искать не надо —
<code>CreateInstance</code> просто вернёт значение по умолчанию.</p>`,
        links: [
          { label: "MS Docs — Activator.CreateInstance", url: "https://learn.microsoft.com/en-us/dotnet/api/system.activator.createinstance" },
          { label: "MS Docs — Reflection and generic types", url: "https://learn.microsoft.com/en-us/dotnet/fundamentals/reflection/reflection-and-generic-types" }
        ],
        task: {
          kind: "write",
          q: "В переменной Type t лежит тип с пустым конструктором. Создай его экземпляр во время выполнения — одна строка.",
          placeholder: "одна строка C#...",
          must: ["activator.createinstance"],
          solution: "object? obj = Activator.CreateInstance(t);",
          explain: "Activator.CreateInstance(t) находит конструктор без параметров и вызывает его. Результат — object, поэтому дальше его приводят к интерфейсу или базовому типу."
        }
      },
      {
        id: "refl-5",
        title: "Атрибуты и Reflection",
        subtitle: "Наклейки на коробках при переезде",
        theory: `
<p>При переезде ты клеишь на коробки стикеры: «хрупкое», «на кухню». Сами стикеры ничего не делают.
Они работают только потому, что грузчик их <i>читает</i>.</p>
<p><b>Атрибут</b> — такой же стикер, только на классе или методе. Он попадает в метаданные и лежит
там молча. Reflection — это грузчик: <code>GetCustomAttribute&lt;T&gt;()</code> достаёт стикер и
даёт по нему решение.</p>
<p>Вся эта магия построена на одной паре: пометил в исходнике — прочитал в рантайме. Так работают
маршруты ASP.NET (<code>[HttpGet]</code>), валидация (<code>[Required]</code>), сериализация
(<code>[JsonPropertyName]</code>) и любые твои собственные метки. Атрибут описывается обычным
классом, унаследованным от <code>Attribute</code>.</p>`,
        code: `using System.Reflection;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class RouteAttribute : Attribute
{
    public string Template { get; }
    public RouteAttribute(string template) => Template = template;
}

[Route("api/products")]
public class ProductsController
{
    [Route("")]
    public void List() { }

    [Route("{id}")]
    public void GetById(int id) { }
}

// Читаем стикеры в рантайме
Type type = typeof(ProductsController);
RouteAttribute? onType = type.GetCustomAttribute<RouteAttribute>();
Console.WriteLine(onType?.Template);          // api/products

foreach (MethodInfo m in type.GetMethods(BindingFlags.Public
        | BindingFlags.Instance | BindingFlags.DeclaredOnly))
{
    RouteAttribute? route = m.GetCustomAttribute<RouteAttribute>();
    if (route is null) continue;
    Console.WriteLine(m.Name + " -> " + route.Template);
}`,
        deep: `<p><b>Глубже:</b> экземпляра атрибута в памяти не существует, пока ты его не
запросил. В метаданных лежат только <i>аргументы</i> — как константы. Каждый вызов
<code>GetCustomAttribute&lt;T&gt;()</code> создаёт <b>новый</b> объект атрибута. Отсюда два
следствия: хранить в атрибуте изменяемое состояние бессмысленно (в следующий раз получишь чистый
экземпляр), а аргументы атрибута обязаны быть константами времени компиляции — вычислить их в
конструкторе нельзя.</p>`,
        links: [
          { label: "MS Docs — Creating custom attributes", url: "https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/reflection-and-attributes/creating-custom-attributes" },
          { label: "MS Docs — Accessing attributes by using reflection", url: "https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/reflection-and-attributes/accessing-attributes-by-using-reflection" }
        ],
        task: {
          q: "Что делает атрибут [Route(«api/products»)] сам по себе, если reflection его не читает?",
          options: [
            "Регистрирует маршрут в веб-сервере автоматически",
            "Ничего — это просто метка в метаданных, пока кто-то её не прочитает",
            "Переименовывает метод в api/products",
            "Проверяется компилятором и сам вызывает метод при запросе"
          ],
          answer: 1,
          explain: "Атрибут — данные, а не поведение. Работает он только потому, что фреймворк проходит reflection по типам и читает эти метки."
        }
      },
      {
        id: "refl-6",
        title: "Плагины и scan-and-register",
        subtitle: "Ищем всех, кто умеет нужное",
        theory: `
<p>Ты вешаешь объявление: «нужны все, кто умеет играть на гитаре». Имён ты не знаешь — знаешь
только умение. Кто откликнется, того и берёшь.</p>
<p>В .NET «умение» — это интерфейс. Reflection берёт сборку, перебирает
<code>GetTypes()</code>, отбрасывает абстрактные и интерфейсы, а остальных проверяет вопросом
<code>typeof(IPlugin).IsAssignableFrom(type)</code> — «можно ли положить этот тип в переменную
<code>IPlugin</code>?». Подошёл — создаём через <code>Activator</code>.</p>
<p>Тот же приём даёт <b>scan-and-register</b> для DI: находим все классы по соглашению
(<code>OrderService</code> реализует <code>IOrderService</code>) и регистрируем их одним циклом,
вместо сотни строк вручную. Правило одно: сканируй <i>один раз при старте</i>, а не на каждый
запрос.</p>`,
        code: `using System.Reflection;

public interface IPlugin
{
    string Name { get; }
    void Execute();
}

public static class PluginScanner
{
    public static IEnumerable<IPlugin> Load(Assembly assembly)
    {
        foreach (Type type in assembly.GetTypes())
        {
            // сам интерфейс и абстрактные классы создать нельзя
            if (type.IsInterface || type.IsAbstract) continue;

            // «влезает ли type в переменную IPlugin?»
            if (!typeof(IPlugin).IsAssignableFrom(type)) continue;

            if (Activator.CreateInstance(type) is IPlugin plugin)
                yield return plugin;
        }
    }
}

// Своя сборка или чужая DLL — код один и тот же
Assembly asm = Assembly.LoadFrom("plugins/SamplePlugin.dll");
foreach (IPlugin p in PluginScanner.Load(asm))
    p.Execute();`,
        deep: `<p><b>Глубже:</b> порядок в <code>IsAssignableFrom</code> путают почти все. Читай его
как «слева можно присвоить справа»: <code>typeof(IPlugin).IsAssignableFrom(impl)</code>. Наоборот —
почти всегда <code>false</code>. Второй подводный камень: <code>GetTypes()</code> у чужой DLL может
бросить <code>ReflectionTypeLoadException</code>, если часть зависимостей не нашлась — у этого
исключения есть свойство <code>Types</code> с уже загруженными типами, так что сканер можно
продолжить. И третий: одна и та же DLL, загруженная в два разных
<code>AssemblyLoadContext</code>, даёт <b>разные</b> объекты <code>Type</code>, и проверка на
интерфейс внезапно вернёт <code>false</code>.</p>`,
        links: [
          { label: "MS Docs — Create an app with plugin support", url: "https://learn.microsoft.com/en-us/dotnet/core/tutorials/creating-app-with-plugin-support" },
          { label: "MS Docs — Type.IsAssignableFrom", url: "https://learn.microsoft.com/en-us/dotnet/api/system.type.isassignablefrom" }
        ],
        task: {
          q: "Почему в сканере плагинов пишут typeof(IPlugin).IsAssignableFrom(type), а не type.IsAssignableFrom(typeof(IPlugin))?",
          options: [
            "Порядок не важен, оба варианта дают одно и то же",
            "Метод читается как «слева можно присвоить справа», значит интерфейс должен быть слева",
            "Наоборот нельзя: у интерфейсов нет объекта Type",
            "Так требует Activator.CreateInstance"
          ],
          answer: 1,
          explain: "IsAssignableFrom отвечает на вопрос «влезет ли значение правого типа в переменную левого». Плагин присваивают переменной IPlugin, поэтому интерфейс слева."
        }
      },
      {
        id: "refl-7",
        title: "Цена reflection и альтернативы",
        subtitle: "Каждый раз спрашивать дорогу — долго",
        theory: `
<p>Можно каждый раз искать номер в толстом справочнике. А можно один раз найти и сохранить в
контакты. Reflection — это справочник: поиск по метаданным, проверки, упаковка аргументов в
<code>object</code>. Прямой вызов <code>product.Name</code> — это контакт.</p>
<p>Отсюда одно железное правило: <b>отражай один раз при старте</b>, складывай результат в
<code>Dictionary&lt;string, PropertyInfo&gt;</code> и дальше работай с ним. Никогда не вызывай
<code>GetProperty</code>, <code>GetMethod</code> или <code>GetCustomAttribute</code> внутри
горячего цикла без кеша — это самый частый источник тормозов во «своих фреймворках».</p>
<p>А часто reflection просто не нужна. Проверь альтернативы:</p>
<ul>
<li>Типы известны заранее — <b>интерфейс</b> или дженерик.</li>
<li>Нужен JSON — <code>System.Text.Json</code>, а для скорости его source generation.</li>
<li>Вызов в горячем пути — <b>делегат</b>, построенный один раз.</li>
<li>Нужен код «по метке» на компиляции — <b>source generators</b>: они пишут обычный C#, который
переживает trimming и Native AOT.</li>
</ul>`,
        code: `using System.Reflection;

static class PropCache<T>
{
    private static readonly Dictionary<string, PropertyInfo?> Cache = new();

    public static PropertyInfo? Get(string name)
    {
        if (Cache.TryGetValue(name, out PropertyInfo? prop)) return prop;
        prop = typeof(T).GetProperty(name);   // поиск по метаданным — один раз
        Cache[name] = prop;
        return prop;
    }
}

static void PrintNames(List<Product> products)
{
    // Плохо: GetProperty повторяется на каждом элементе
    // foreach (Product p in products)
    //     Console.WriteLine(typeof(Product).GetProperty("Name")!.GetValue(p));

    // Нормально: нашли один раз, дальше только чтение
    PropertyInfo? prop = PropCache<Product>.Get("Name");
    foreach (Product p in products)
        Console.WriteLine(prop?.GetValue(p));

    // Быстро: reflection один раз превращаем в делегат
    var getName = typeof(Product).GetProperty("Name")!.GetMethod!
        .CreateDelegate<Func<Product, string>>();
    foreach (Product p in products)
        Console.WriteLine(getName(p));       // почти как обычный вызов
}`,
        deep: `<p><b>Глубже:</b> кеширование <code>PropertyInfo</code> убирает только <i>поиск</i>.
Сам <code>GetValue</code> всё равно идёт через проверки доступа и упаковывает результат в
<code>object</code>. Настоящий скачок даёт превращение найденного члена в типизированный делегат
(<code>CreateDelegate&lt;Func&lt;Product, string&gt;&gt;()</code> или скомпилированное
<code>Expression</code>): после этого вызов почти не отличается от прямого, потому что JIT видит
обычный вызов метода. Именно так устроены быстрые сериализаторы: reflection у них живёт только на
этапе «прогрева».</p>`,
        links: [
          { label: "MS Docs — Prepare libraries for trimming", url: "https://learn.microsoft.com/en-us/dotnet/core/deploying/trimming/prepare-libraries-for-trimming" },
          { label: "MS Docs — Source generators", url: "https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/source-generators-overview" }
        ],
        task: {
          q: "Фреймворк на каждый HTTP-запрос читает атрибут [Route] у метода контроллера. Что правильнее?",
          options: [
            "Оставить как есть: GetCustomAttribute — дешёвая операция",
            "Просканировать контроллеры один раз при старте и сложить маршруты в Dictionary",
            "Отключить оптимизации компилятора, чтобы reflection работала быстрее",
            "Заменить чтение атрибута на Type.GetType по имени из строки"
          ],
          answer: 1,
          explain: "Каждый GetCustomAttribute — это поиск по метаданным плюс новый объект атрибута. Сканируют один раз на старте, а в рантайме бьют по готовому словарю."
        }
      }
    ]
  },

  /* ================= WORLD 11: NAMESPACES / ASSEMBLIES / NUGET ================= */
  {
    id: "assemblies",
    name: "Namespaces, сборки и NuGet",
    icon: "▦",
    blurb: "Как код получает адреса, превращается в DLL с паспортом и приезжает пакетами из NuGet.",
    levels: [
      {
        id: "asm-1",
        title: "Namespace — адрес типа",
        subtitle: "Город, улица, дом — чтобы имена не путались",
        theory: `
<p>В большом городе живут сотни Ани. Различают их по адресу: «Аня с улицы Абовяна» и «Аня
с проспекта Маштоца». <b>namespace</b> — это ровно такой адрес для типов. Полное имя типа —
это его адрес: <code>Acme.Shop.Order</code> и <code>Contoso.Crm.Order</code> — два разных
класса, хотя короткое имя у них одинаковое.</p>
<p>Важно понять, чего namespace <i>не</i> делает: он не создаёт файл, не создаёт папку и не
равен сборке. Он только группирует имена. Совпадение «папка = namespace» — это удобная
договорённость людей, а не правило компилятора.</p>
<p>Писать полные адреса каждый раз больно, поэтому есть <code>using</code>:</p>
<ul>
<li><code>using System.IO;</code> — «типы отсюда зови коротким именем».</li>
<li><code>using Json = System.Text.Json;</code> — псевдоним (alias), спасает при конфликте имён.</li>
<li><code>using static System.Math;</code> — тянет статические члены: вместо <code>Math.PI</code>
просто <code>PI</code>.</li>
<li><code>global using System;</code> — импорт сразу на весь проект, обычно в одном файле
<code>GlobalUsings.cs</code>.</li>
</ul>
<p>А свойство <code>ImplicitUsings</code> в проекте — это когда SDK сам дописывает пачку
<code>global using</code> за тебя (в сгенерированный файл под <code>obj/</code>). Поэтому в
новом проекте <code>Console.WriteLine</code> работает без единой строки <code>using</code>.</p>`,
        code: `// namespace = адрес, а не файл и не папка
namespace Acme.Shop.Orders;   // file-scoped форма, C# 10+

public class Order { }

// ---------- другой файл ----------
using System;
using Acme.Shop.Orders;

// два разных Order — разводим псевдонимами
using ShopOrder = Acme.Shop.Order;
using CrmOrder  = Contoso.Crm.Order;

// статические члены без имени типа: Math.PI -> PI
using static System.Math;

// ---------- GlobalUsings.cs: импорт на весь проект ----------
global using System.Linq;
global using System.Collections.Generic;

// полное имя работает всегда, даже без using
var direct = new Acme.Shop.Orders.Order();
double area = Round(PI * Pow(2, 2), 2);   // это из using static`,
        deep: `<p><b>Глубже:</b> одна сборка легко держит много namespace — и наоборот, один
namespace технически может быть размазан по нескольким сборкам (так делают редко, потому что
потом непонятно, какую DLL подключать). А ещё переименование namespace — это <b>ломающее
изменение</b> для всех, кто твою библиотеку уже использует: их <code>using</code> перестанет
компилироваться. Поэтому адрес выбирают один раз и надолго.</p>`,
        links: [
          { label: "MS Learn — namespace", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/namespace" },
          { label: "MS Learn — using directive (alias, static, global)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/using-directive" }
        ],
        task: {
          kind: "write",
          q: "Ты не хочешь писать using System.Linq; в каждом файле проекта. Напиши одну директиву, которая импортирует этот namespace во ВСЕ файлы проекта.",
          placeholder: "директива...",
          must: ["globalusing", "system.linq"],
          solution: "global using System.Linq;",
          explain: "global using действует на весь проект. Обычно такие строки складывают в один файл GlobalUsings.cs, чтобы их было легко найти."
        }
      },
      {
        id: "asm-2",
        title: "Сборка и её manifest",
        subtitle: "Что лежит внутри DLL, кроме кода",
        theory: `
<p>Представь посылку. Внутри — товар, а снаружи наклейка: от кого, что внутри, что ещё нужно
доложить. <b>Assembly</b> (сборка) — это такая посылка с кодом. Обычно это один файл
<code>.dll</code> (библиотека) или исполняемый выход приложения. Сборка — минимальная единица,
которую ты <i>поставляешь</i>, <i>версионируешь</i> и на которую ссылаешься.</p>
<p>Внутри сборки четыре вещи:</p>
<ul>
<li><b>IL</b> (Intermediate Language) — скомпилированный код, ещё не машинный.</li>
<li><b>Metadata</b> — описание типов, методов, полей, подписей.</li>
<li><b>Manifest</b> — наклейка на посылке: имя, версия, culture, ключ, список нужных сборок.</li>
<li><b>Resources</b> — необязательное: строки, картинки, встроенные файлы.</li>
</ul>
<p>Manifest — это не отдельный файлик, который ты правишь руками. Компилятор встраивает его в
ту же DLL. Именно по манифесту рантайм понимает, что загрузил, и что ещё надо подтянуть.</p>
<p>Ещё одна вещь, которую путают: <code>internal</code> — это граница <i>сборки</i>, а не
namespace. Снаружи DLL видно только <code>public</code>.</p>`,
        code: `// Внутри Acme.Shop.dll:
//   Manifest   — «кто я» + «что мне нужно»
//   Metadata   — типы, методы, поля
//   IL         — сам код
//   Resources  — необязательные строки и картинки

using System.Reflection;

Assembly asm = Assembly.GetExecutingAssembly();

Console.WriteLine(asm.FullName);
// Acme.Shop, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null

Console.WriteLine(asm.GetName().Name);     // Acme.Shop
Console.WriteLine(asm.GetName().Version);  // 1.0.0.0

// список зависимостей — тоже строки из манифеста
foreach (AssemblyName dep in asm.GetReferencedAssemblies())
    Console.WriteLine(dep.Name + " " + dep.Version);

public class VisibleOutsideAssembly { }   // видно тем, кто подключил DLL
internal class OnlyInsideThisAssembly { } // видно только внутри этой сборки`,
        deep: `<p><b>Глубже:</b> исторически сборка могла состоять из нескольких файлов —
<i>модулей</i> (<code>.netmodule</code>). Манифест лежал только в одном из них, а остальные
просто принадлежали той же identity: снаружи это по-прежнему <b>одна</b> сборка, и
<code>internal</code> был общим для всех её модулей. Так собирали «C# плюс VB в одной сборке»
и грузили части по требованию. Сегодня <code>dotnet build</code> делает один проект → одна
сборка → один файл, и модули ты встретишь только в старых документах.</p>`,
        links: [
          { label: "MS Learn — Assemblies in .NET", url: "https://learn.microsoft.com/en-us/dotnet/standard/assembly/" },
          { label: "MS Learn — Assembly manifest", url: "https://learn.microsoft.com/en-us/dotnet/standard/assembly/manifest" }
        ],
        task: {
          q: "Какая часть сборки описывает саму сборку — её имя, версию и список нужных зависимостей?",
          options: [
            "IL — скомпилированный код методов",
            "Manifest",
            "Resources — встроенные строки и картинки",
            "Metadata о типах и подписях методов"
          ],
          answer: 1,
          explain: "Manifest — это «удостоверение и накладная» сборки: identity плюс перечень зависимостей. Metadata описывает типы, IL — код, resources — данные."
        }
      },
      {
        id: "asm-3",
        title: "Identity и версии",
        subtitle: "Имя файла — это ещё не паспорт",
        theory: `
<p>Двух людей с именем «Иванов» не путают, потому что у каждого паспорт: фамилия, дата
рождения, номер. У сборки то же самое. Её <b>identity</b> — это четыре поля:
<code>simple name</code>, <code>version</code>, <code>culture</code> и
<code>public key token</code>. Две DLL с одинаковым именем файла <code>Utils.dll</code> для
рантайма — разные сборки, если хоть одно поле отличается.</p>
<p>Версия пишется как <code>Major.Minor.Build.Revision</code>. Major — ломающие изменения,
Minor — новые возможности без поломок, Build — исправления, Revision — счётчик сборок.</p>
<p>В проекте живут сразу несколько «версий», и это разные вещи:</p>
<ul>
<li><code>AssemblyVersion</code> — часть identity, по ней исторически шло связывание (binding).</li>
<li><code>FileVersion</code> — только свойства файла в Windows, на загрузку не влияет.</li>
<li><code>InformationalVersion</code> — для людей и логов, можно дописать хеш коммита.</li>
<li><code>Version</code> — версия NuGet-пакета по SemVer.</li>
</ul>
<p><b>Strong name</b> — это подпись сборки парой ключей. В identity появляется
<code>PublicKeyToken</code> — короткий хеш публичного ключа. Он доказывает происхождение и
целостность файла, но <i>не</i> делает код безопасным сам по себе.</p>`,
        code: `<!-- Acme.Billing.csproj -->
<PropertyGroup>
  <!-- версия NuGet-пакета (SemVer) -->
  <Version>2.4.1</Version>

  <!-- часть identity сборки: по ней шло binding -->
  <AssemblyVersion>2.4.1.0</AssemblyVersion>

  <!-- только свойства файла в проводнике Windows -->
  <FileVersion>2.4.1.1234</FileVersion>

  <!-- для людей и логов: можно дописать коммит -->
  <InformationalVersion>2.4.1+git.abc123</InformationalVersion>

  <!-- strong name: подпись ключом (раньше требовалась для GAC) -->
  <SignAssembly>true</SignAssembly>
  <AssemblyOriginatorKeyFile>acme.snk</AssemblyOriginatorKeyFile>
</PropertyGroup>

<!-- Полная identity читается так:

Acme.Billing, Version=2.4.1.0, Culture=neutral, PublicKeyToken=b77a5c561934e089
 ^simple name          ^version         ^culture             ^хеш публичного ключа

Culture=neutral — обычная сборка; culture вроде hy-AM бывает
у satellite-сборок с переводами.                                        -->`,
        deep: `<p><b>Глубже:</b> ломать версию бывает полезно, а бывает больно. Если ты каждый
патч поднимаешь <code>AssemblyVersion</code>, то на .NET Framework все, кто был скомпилирован
против прежней версии, просят её по точному номеру — и без redirect падают. Поэтому многие
библиотеки держат <code>AssemblyVersion</code> «грубым» (например <code>2.0.0.0</code> на всю
major-линейку), а точную сборку показывают через <code>FileVersion</code> и
<code>InformationalVersion</code>. В современном .NET версию выбирают на этапе restore, так что
проблема мягче — но привычка осталась.</p>`,
        links: [
          { label: "MS Learn — Assembly names (identity)", url: "https://learn.microsoft.com/en-us/dotnet/standard/assembly/identify" },
          { label: "MS Learn — Strong-named assemblies", url: "https://learn.microsoft.com/en-us/dotnet/standard/assembly/strong-named" }
        ],
        task: {
          q: "На диске две DLL, обе называются Utils.dll. Что делает их разными сборками с точки зрения рантайма?",
          options: [
            "Разный размер файла",
            "Разные дата и время создания",
            "Отличия в identity: version, culture или public key token",
            "То, что они лежат в разных папках"
          ],
          answer: 2,
          explain: "Имя файла — для людей. Identity — это simple name + version + culture + public key token; отличие в любом из этих полей означает другую сборку."
        }
      },
      {
        id: "asm-4",
        title: "Private, shared и «DLL Hell»",
        subtitle: "Своя копия в рюкзаке против общего склада",
        theory: `
<p>Два варианта жизни с инструментом. Первый: у каждого своя отвёртка в рюкзаке — тяжелее,
зато никто ни у кого её не забирает. Второй: одна отвёртка на общем складе — экономно, но если
кто-то заменит её на другую модель, сломается работа у всех. Это ровно <b>private</b> и
<b>shared</b> сборки.</p>
<p><b>Private assembly</b> лежит в папке приложения, рядом с ним. Два приложения на одной
машине спокойно используют разные версии одной библиотеки — у каждого своя копия. Это
поведение по умолчанию во всём современном .NET.</p>
<p><b>Shared assembly</b> — одна установленная копия для многих приложений. На .NET Framework
это был <b>GAC</b> (Global Assembly Cache): он умел держать версии side-by-side, но требовал
strong name, отдельной установки и политик обновления. Именно вокруг этого выросло название
<b>DLL Hell</b>: обновил общую библиотеку — и неизвестно, какое приложение сломалось.</p>
<p>В .NET Core и дальше классического GAC нет. «Общее» сегодня — это NuGet-кэш, shared
framework от рантайма и, при желании, один список версий на весь репозиторий. Правило:
<i>по умолчанию private, делимся через пакеты</i>.</p>`,
        code: `# Современно: приватные копии рядом с приложением
dotnet publish -c Release

# MyApp/
#   MyApp.dll
#   Acme.Billing.dll            <- своя копия версии 2.0
#   Acme.Shared.dll
#   MyApp.deps.json             <- граф зависимостей, решённый заранее
#   MyApp.runtimeconfig.json    <- настройки рантайма

# Другое приложение на той же машине:
# OtherApp/
#   Acme.Billing.dll            <- версия 1.0, и никто никому не мешает

# ------------------------------------------------------------------
# Классика .NET Framework: общий склад GAC
# GAC
#  |-- Acme.Billing 1.0.0.0     <- side-by-side версии
#  |-- Acme.Billing 2.0.0.0
# Требовал strong name и установки в систему.
# ------------------------------------------------------------------

<!-- Латка для конфликта версий в app.config (.NET Framework) -->
<dependentAssembly>
  <assemblyIdentity name="Newtonsoft.Json" publicKeyToken="30ad4fe6b2a6aeed" />
  <bindingRedirect oldVersion="0.0.0.0-13.0.0.0" newVersion="13.0.0.0" />
</dependentAssembly>
<!-- «кто просит до 13.0.0.0 — получит 13.0.0.0» -->`,
        deep: `<p><b>Глубже:</b> <code>bindingRedirect</code> лечит только <i>несовпадение
номеров</i>, а не несовместимость API. Если библиотека A вызывает метод, который в версии 13.0
удалили, redirect честно подсунет 13.0 — и приложение упадёт уже во время работы, с
<code>MissingMethodException</code>. Поэтому современный подход другой: конфликт решают
<b>до запуска</b>, на этапе restore, выбирая одну версию для всех. Компиляция говорит «меня
собрали против 1.2», restore говорит «поедет 2.0», рантайм просто грузит то, что положили
рядом.</p>`,
        links: [
          { label: "MS Learn — Global Assembly Cache", url: "https://learn.microsoft.com/en-us/dotnet/framework/app-domains/gac" },
          { label: "MS Learn — .NET application publishing", url: "https://learn.microsoft.com/en-us/dotnet/core/deploying/" }
        ],
        task: {
          q: "Почему в современном .NET по умолчанию не используют общее системное хранилище сборок вроде GAC?",
          options: [
            "GAC работает только на Linux, а .NET кроссплатформенный",
            "Приватные копии рядом с приложением дают каждому приложению свою версию, поэтому обновление одного не ломает остальные",
            "GAC требует NuGet, а NuGet появился позже",
            "Из общего хранилища сборки загружаются медленнее, поэтому от него отказались"
          ],
          answer: 1,
          explain: "Изоляция важнее экономии места. Своя копия в папке приложения означает, что версии не конфликтуют между приложениями — это и есть выход из «DLL Hell»."
        }
      },
      {
        id: "asm-5",
        title: "Библиотеки классов и TFM",
        subtitle: ".NET Standard — это спецификация розетки",
        theory: `
<p><b>Class library</b> — проект без точки входа, который компилируется в DLL, чтобы код можно
было переиспользовать. Доменные модели, контракты, хелперы — всё это обычно живёт в
библиотеках, а приложение (API, worker) их подключает.</p>
<p><b>TFM</b> (Target Framework Moniker) — строчка вроде <code>net8.0</code> в проекте. Она
отвечает на два вопроса: какие API доступны при компиляции и кто сможет использовать
результат.</p>
<p>Дальше самое путаемое место. <b>.NET Standard</b> — это <i>спецификация</i>, список API, а
не платформа: приложения на нём не запускаются. Это как стандарт розетки — он описывает форму,
но сам не даёт электричество. <b>Современный .NET</b> (<code>net8.0</code>) — наоборот,
реальная платформа: рантайм, SDK, библиотеки; это конкретная розетка в стене, которая работает.</p>
<p>Практика простая: если библиотеку должны подключать старые приложения на .NET Framework —
берёшь <code>netstandard2.0</code>. Если все потребители на современном .NET — сразу
<code>net8.0</code>. Нужно и то и то — multi-targeting. И выбирай TFM по потребителям, а не по
привычке: <code>net48</code>-приложение подключит <code>netstandard2.0</code>-библиотеку, но
не подключит библиотеку, собранную только под <code>net8.0</code>.</p>`,
        code: `# новая библиотека классов -> Acme.Shop.Domain.dll
dotnet new classlib -n Acme.Shop.Domain

# подключаем её из приложения (project reference, без NuGet)
dotnet add Acme.Shop.Api reference Acme.Shop.Domain

<!-- вариант 1: только современный .NET -->
<TargetFramework>net8.0</TargetFramework>

<!-- вариант 2: нужен и старый .NET Framework -->
<TargetFramework>netstandard2.0</TargetFramework>

<!-- вариант 3: сразу два таргета, две DLL в пакете -->
<TargetFrameworks>netstandard2.0;net8.0</TargetFrameworks>

// при multi-targeting код можно ветвить по таргету
public static string Describe()
{
#if NET8_0_OR_GREATER
    return "доступны современные API";
#else
    return "режим широкой совместимости";
#endif
}

// внутри решения — project reference; между репозиториями — NuGet-пакет`,
        deep: `<p><b>Глубже:</b> <code>netstandard2.1</code> выглядит как «просто версия побольше»,
но у него есть ловушка: .NET Framework его <b>не поддерживает вообще</b>. То есть переход с
<code>2.0</code> на <code>2.1</code> не добавляет немного API — он выкидывает всю
Framework-аудиторию, ради которой Standard и брали. Поэтому реально живых вариантов два:
<code>netstandard2.0</code> (максимальная совместимость) или современный
<code>net8.0</code>. Промежуточный <code>2.1</code> почти всегда худший из миров.</p>`,
        links: [
          { label: "MS Learn — .NET Standard", url: "https://learn.microsoft.com/en-us/dotnet/standard/net-standard" },
          { label: "MS Learn — Target frameworks (TFM)", url: "https://learn.microsoft.com/en-us/dotnet/standard/frameworks" }
        ],
        task: {
          q: "Твою библиотеку должны подключать и старые приложения на .NET Framework 4.8. Какой TargetFramework выбрать?",
          options: [
            "net8.0 — самый новый, значит совместим со всем",
            "netstandard2.1 — новее, чем 2.0, и поддерживает Framework",
            "netstandard2.0",
            "net48 — другого варианта нет"
          ],
          answer: 2,
          explain: "netstandard2.0 — единственная версия Standard, которую понимает .NET Framework 4.6.1+; современный .NET такие библиотеки тоже подключает. netstandard2.1 Framework не поддерживает вообще."
        }
      },
      {
        id: "asm-6",
        title: "NuGet: PackageReference и restore",
        subtitle: "Магазин готовых деталей — со списком покупок",
        theory: `
<p>Ты не выплавляешь болты сам — покупаешь готовые. <b>NuGet</b> — это магазин деталей для
.NET, а пакет <code>.nupkg</code> — коробка: внутри собранные DLL под один или несколько TFM,
плюс метаданные (id, версия, зависимости, лицензия).</p>
<p>Ты не хранишь эти DLL в репозитории. В проекте лежит только <i>список покупок</i> —
&lt;PackageReference /&gt; с id и версией. Команда <code>dotnet restore</code> читает список,
строит граф зависимостей, скачивает недостающее в общий кэш
(<code>~/.nuget/packages</code>) и записывает решённый результат в
<code>obj/project.assets.json</code>.</p>
<p>Дальше начинается интересное: <b>транзитивные</b> зависимости. Ты подключил один пакет, а он
притащил три своих. Если два пакета хотят разные версии одной и той же библиотеки, NuGet
пытается выбрать <i>одну</i>, которая устроит всех. Не получается — restore ругается.</p>
<p>Лечение по порядку: посмотреть граф командой
<code>dotnet list package --include-transitive</code>; обновить пакеты до совместимых версий;
если нужно — закрепить версию явной ссылкой; в большом репозитории вынести все версии в один
файл <code>Directory.Packages.props</code>. И никогда не копировать DLL в
<code>bin</code> руками.</p>`,
        code: `dotnet add package Serilog --version 4.0.0
# info : PackageReference for package 'Serilog' version '4.0.0' added to project.

<!-- в csproj появилась строка списка покупок -->
<ItemGroup>
  <PackageReference Include="Serilog" Version="4.0.0" />
</ItemGroup>

dotnet restore
# качает пакеты в общий кэш ~/.nuget/packages
# и пишет решённый граф в obj/project.assets.json

dotnet list package --include-transitive
#   Serilog             4.0.0        <- попросил я сам
#   > Acme.Shared       2.0.0        <- пришёл транзитивно, я его не просил

# Конфликт: пакету A нужен Acme.Shared >= 1.0, пакету B нужен >= 2.0.
# NuGet ищет одну версию для всех. Если не находит — restore падает.

<!-- решение: закрепить версию явной ссылкой -->
<PackageReference Include="Acme.Shared" Version="2.1.0" />

dotnet list package --outdated   # что уже устарело`,
        deep: `<p><b>Глубже:</b> в графе NuGet побеждает не самая новая версия, а <b>самая низкая,
которая удовлетворяет все ограничения</b>. Это сделано специально: так результат restore
предсказуем и не меняется сам от того, что кто-то выложил на nuget.org новый релиз. Отсюда же
следствие — если ты хочешь конкретную версию, её нужно попросить <i>прямой</i>
&lt;PackageReference /&gt;: прямая ссылка всегда сильнее любых транзитивных пожеланий.</p>`,
        links: [
          { label: "NuGet — PackageReference in project files", url: "https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files" },
          { label: "NuGet — Dependency resolution", url: "https://learn.microsoft.com/en-us/nuget/concepts/dependency-resolution" }
        ],
        task: {
          kind: "write",
          q: "Напиши команду CLI, которая добавит в проект пакет Serilog именно версии 4.0.0.",
          placeholder: "dotnet ...",
          must: ["dotnetaddpackage", "serilog", "4.0.0"],
          solution: "dotnet add package Serilog --version 4.0.0",
          explain: "dotnet add package дописывает PackageReference в csproj и сразу делает restore. Без --version возьмётся последняя стабильная версия."
        }
      },
      {
        id: "asm-7",
        title: "Настройки: appsettings vs NuGet.config",
        subtitle: "Что читает программа и что читает сборка",
        theory: `
<p>В квартире два разных «регулятора»: термостат, которым ты крутишь температуру каждый день,
и щиток с автоматами, который определяет, как вообще заведён свет. Их путают, а это разные
слои. В .NET то же самое: настройки <i>приложения</i> и настройки <i>проекта</i>.</p>
<p><b>appsettings.json</b> — термостат. Его читает твой код во время работы: строки подключения,
таймауты, флаги функций. Значения складываются слоями, и каждый следующий слой перекрывает
предыдущий: <code>appsettings.json</code> → <code>appsettings.Development.json</code> →
user secrets → переменные окружения → аргументы командной строки. Вложенный ключ в переменной
окружения пишется через двойное подчёркивание: <code>Shipping__DefaultCarrier</code>.</p>
<p><b>NuGet.config</b> и <code>.csproj</code> — щиток. Их читает не приложение, а
<code>restore</code> и сборка: откуда качать пакеты и какие версии брать.</p>
<p>Отсюда рождается классика «у меня работает, в CI падает». NuGet склеивает конфиги с
нескольких уровней: машина → пользователь → репозиторий. Разработчик добавил приватный фид в
своём user-конфиге — у него restore зелёный, у коллеги и в CI «package not found». Лечится
файлом <code>NuGet.config</code> в корне репозитория с <code>&lt;clear /&gt;</code> и явным
списком источников: тогда все клоны и CI берут пакеты из одного и того же места.</p>`,
        code: `// appsettings.json — настройки приложения (их читает твой код)
{
  "ConnectionStrings": {
    "ShopDb": "Server=localhost;Database=Shop"
  },
  "Shipping": {
    "DefaultCarrier": "DHL",
    "TimeoutSeconds": 30
  }
}

// Слои, где каждый следующий перекрывает предыдущий:
//   appsettings.json -> appsettings.{Environment}.json -> user secrets
//   -> переменные окружения -> аргументы командной строки
// Вложенный ключ в переменной окружения: Shipping__DefaultCarrier=UPS

<!-- NuGet.config в корне репозитория — настройки сборки (их читает restore) -->
<configuration>
  <packageSources>
    <clear />   <!-- забыть фиды, настроенные на конкретной машине -->
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="acme-private" value="https://pkgs.example.com/acme/index.json" />
  </packageSources>
</configuration>
<!-- Пароли и токены здесь не хранят: их дают через CI-секреты
     или credential provider. -->`,
        deep: `<p><b>Глубже:</b> <code>NuGet.config</code> отвечает только на вопрос «откуда
качать», а <i>какую версию</i> взять — решают <code>PackageReference</code> и центральное
управление версиями. Полностью воспроизводимый restore получается лишь когда зафиксировано и
то, и другое. И самый неприятный сценарий именно здесь: если один и тот же id и version лежит
на двух фидах с разным содержимым, победит тот, что ответит первым — а он на разных машинах
разный. Спасает <code>packageSourceMapping</code>: правило «всё, что начинается с
<code>Acme.</code>, брать только с приватного фида» делает выбор однозначным.</p>`,
        links: [
          { label: "NuGet — nuget.config reference", url: "https://learn.microsoft.com/en-us/nuget/reference/nuget-config-file" },
          { label: "MS Learn — Configuration in .NET", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration" }
        ],
        task: {
          q: "Локально dotnet restore проходит, а в CI падает с «package not found» на внутреннем пакете Acme.Shared. Что вероятнее всего?",
          options: [
            "В CI не хватает оперативной памяти для restore",
            "Приватный фид прописан только в user-level конфиге разработчика, а не в NuGet.config репозитория",
            "В appsettings.json неверная строка подключения к базе",
            "В PackageReference версия записана словами, а не цифрами"
          ],
          answer: 1,
          explain: "NuGet склеивает конфиги машины, пользователя и репозитория. Источник, добавленный только у себя, в CI не существует. Фиды объявляют в NuGet.config в корне репозитория, с &lt;clear /&gt; перед списком."
        }
      }
    ]
  }
];

// Порядок миров на сайте (по id). Меняй здесь — контент трогать не нужно.
const WORLD_ORDER = [
  "dsa",           // Структуры данных и алгоритмы
  "enumerables",   // Инумерабл
  "delegates",     // Делегаты и события
  "generics",      // Дженерики
  "variance",      // Вариантность (ковариантность/контравариантность)
  "filestream",    // FileStream I/O
  "creational",    // Паттерны — порождающие
  "structural",    // Паттерны — структурные
  "behavioral",    // Паттерны — поведенческие
  "reflection",    // Reflection — чтение метаданных в рантайме
  "assemblies",    // Namespaces, сборки и NuGet
];
const orderedWorlds = WORLD_ORDER
  .map(id => WORLDS.find(w => w.id === id))
  .filter(Boolean);
// на всякий случай добавим миры, не попавшие в список, в конец
for (const w of WORLDS) {
  if (!orderedWorlds.includes(w)) orderedWorlds.push(w);
}

// доступно глобально для app.js (английская версия — в data.en.js)
window.WORLDS_RU = orderedWorlds;
