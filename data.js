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
  }
];

// доступно глобально для app.js
window.WORLDS = WORLDS;
