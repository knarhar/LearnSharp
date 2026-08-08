/* =====================================================================
   C# Deep Dive — content
   Each WORLD has levels. Each level:
     id, title, subtitle, theory (HTML), code (C#), deep (HTML note),
     links [{label,url}], task { q, options[], answer(index), explain }
   Keep explanations plain-language but technically correct.
   ===================================================================== */

const WORLDS = [
  /* ================= WORLD: ООП ================= */
  {
    id: "oop",
    name: "ООП: объекты и связи",
    icon: "⬢",
    blurb: "Классы, инкапсуляция, наследование, полиморфизм, интерфейсы и связи между объектами — фундамент всего остального.",
    levels: [
      {
        id: "oop-1",
        title: "Класс и объект",
        subtitle: "Форма для печенья и само печенье",
        theory: `
<p>Есть форма для вырезания печенья и есть печенье. Форма одна, печенек из неё — сколько
захочешь, и каждая своя: одна с шоколадом, другая с орехами.</p>
<p><b>Класс</b> — это форма. Описание: какие данные у вещи есть и что она умеет.
<b>Объект</b> — конкретное печенье, сделанное по этой форме. Слово <code>new</code> как раз
и значит «сделай мне ещё одну штуку по этому образцу».</p>
<p>Внутри класса живут две вещи:</p>
<ul>
<li><b>данные</b> — поля и свойства (что объект <i>знает</i>: имя, здоровье, баланс);</li>
<li><b>поведение</b> — методы (что объект <i>умеет</i>: бежать, платить, здороваться).</li>
</ul>
<p>Главная идея ООП в одном предложении: <b>данные и действия над ними живут вместе</b>, в
одной коробке, а не разбросаны по программе. Тогда программа — это не гора функций, а
компания объектов, которые общаются между собой.</p>`,
        code: `// Класс — форма (описание)
public class Player
{
    // данные: что объект знает
    public string Name { get; set; }
    public int Health { get; set; } = 100;

    // поведение: что объект умеет
    public void TakeDamage(int amount)
    {
        Health -= amount;
        Console.WriteLine($"{Name} получил {amount}, осталось {Health}");
    }
}

// Объекты — конкретные экземпляры, у каждого свои данные
var anna = new Player { Name = "Anna" };
var bob  = new Player { Name = "Bob" };

anna.TakeDamage(30);   // Anna: 70
bob.TakeDamage(10);    // Bob: 90  — данные Анны не тронуты`,
        deep: `<p><b>Глубже:</b> объект класса живёт в куче (heap), а переменная хранит только
<i>ссылку</i> на него — как бумажка с адресом дома, а не сам дом. Поэтому если написать
<code>var b = a;</code>, дом останется один, а бумажек станет две: изменишь через
<code>b</code> — увидишь и через <code>a</code>. У <code>struct</code> поведение другое:
он копируется целиком.</p>`,
        links: [
          { label: "MS Learn — Classes", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes" },
          { label: "MS Learn — Objects", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/objects" }
        ],
        task: {
          q: "В чём разница между классом и объектом?",
          options: [
            "Это два названия одного и того же",
            "Класс — описание (форма), объект — конкретный экземпляр, созданный по этому описанию",
            "Объект — это файл, а класс — папка",
            "Класс хранит данные, а объект только методы"
          ],
          answer: 1,
          explain: "Класс пишется один раз, объектов по нему можно наделать сколько угодно, и у каждого будут свои значения полей."
        }
      },
      {
        id: "oop-2",
        title: "Инкапсуляция",
        subtitle: "Не лезь руками внутрь — есть кнопки",
        theory: `
<p>У банкомата нет дырки, через которую можно потрогать деньги напрямую. Есть кнопки:
«снять», «положить». Банкомат сам решает, можно ли выполнить просьбу.</p>
<p><b>Инкапсуляция</b> — ровно это: спрятать данные внутри объекта и выдать наружу только
безопасные «кнопки». Поля делаем <code>private</code>, а доступ даём через свойства и
методы, где можно <b>проверить</b>, что запрос разумный.</p>
<p>Зачем так, если можно просто сделать поле <code>public</code>? Затем, что публичное поле
любой может испортить — например, записать в баланс минус миллион. И тогда виноват будет не
тот, кто испортил, а твой класс, потому что именно он должен был не допустить такого
состояния.</p>
<p>Правило простое: <b>объект обязан всегда быть в правильном состоянии</b>. Проверки живут
внутри класса, а не рассыпаны по всей программе.</p>`,
        code: `// ПЛОХО: данные нараспашку, любой может сломать
public class BadAccount
{
    public decimal Balance;      // кто угодно: acc.Balance = -1000;
}

// ХОРОШО: поле спрятано, доступ через кнопки с проверкой
public class BankAccount
{
    private decimal _balance;                    // никто снаружи не достанет

    public decimal Balance => _balance;          // только чтение

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Сумма должна быть больше нуля");
        _balance += amount;
    }

    public bool TryWithdraw(decimal amount)
    {
        if (amount <= 0 || amount > _balance) return false;   // нельзя уйти в минус
        _balance -= amount;
        return true;
    }
}`,
        deep: `<p><b>Глубже:</b> инкапсуляция — это не «напиши геттер и сеттер на каждое поле».
Свойство <code>public int Age { get; set; }</code> защищает ровно ничего: это то же самое
публичное поле, только длиннее. Настоящая инкапсуляция начинается там, где есть
<i>правило</i>: возраст не бывает отрицательным, баланс не уходит в минус, заказ нельзя
оплатить дважды. Нет правил — не выдумывай обёртки ради обёрток.</p>`,
        links: [
          { label: "MS Learn — Properties", url: "https://learn.microsoft.com/en-us/dotnet/csharp/properties" },
          { label: "MS Learn — Access modifiers", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/access-modifiers" }
        ],
        task: {
          kind: "write",
          q: "Внутри класса есть поле <code>private int _age;</code>. Напиши свойство <code>Age</code>, которое отдаёт значение наружу, но НЕ позволяет менять его извне (только чтение).",
          placeholder: "public int Age => ...",
          must: ["publicintage=>_age"],
          solution: `private int _age;

public int Age => _age;          // короткая запись: только get

// то же самое подробнее:
// public int Age { get { return _age; } }`,
          explain: "Свойство только с get отдаёт значение наружу, а менять его может лишь код внутри класса. Это и есть контролируемый доступ."
        }
      },
      {
        id: "oop-3",
        title: "Три связи между объектами",
        subtitle: "is-a, has-a, uses-a — и почему это важнее кода",
        theory: `
<p>Объекты не живут поодиночке. Между ними бывает ровно три вида отношений, и почти вся
архитектура — это правильный выбор между ними.</p>
<ul>
<li><b>is-a («является»)</b> — собака <i>является</i> животным. Это <b>наследование</b>.</li>
<li><b>has-a («имеет»)</b> — у машины <i>есть</i> двигатель. Это <b>композиция</b> (сильная,
двигатель без машины не нужен) или <b>агрегация</b> (слабая, игрок живёт и без команды).</li>
<li><b>uses-a («пользуется»)</b> — водитель <i>пользуется</i> машиной. Это
<b>ассоциация</b>.</li>
</ul>
<p>Проверка простая: произнеси связь вслух человеческим предложением. «Машина является
двигателем» звучит как бред — значит, наследование тут неверное. «У машины есть двигатель» —
звучит нормально, значит это has-a.</p>
<p>Запомни главное: <b>плохие программы чаще ломаются не из-за неправильной логики, а из-за
неправильно выбранных связей между объектами.</b> Ошибку в методе исправляют за минуту,
ошибку в связях — переписыванием половины проекта.</p>`,
        code: `// is-a — наследование
class Animal { }
class Dog : Animal { }             // Dog ЯВЛЯЕТСЯ Animal

// has-a (сильное) — композиция: часть рождается и умирает вместе с целым
class Car
{
    private readonly Engine _engine = new Engine();   // машина ВЛАДЕЕТ двигателем
}

// has-a (слабое) — агрегация: части приходят снаружи и живут сами по себе
class Team
{
    private readonly List<Player> _players;
    public Team(List<Player> players) => _players = players;  // игроки были до команды
}

// uses-a — ассоциация: попользовался и отпустил
class Driver
{
    public void Drive(Car car) => car.Start();   // не хранит машину у себя
}`,
        deep: `<p><b>Глубже:</b> сила связи растёт так: <i>uses-a → агрегация → композиция →
наследование</i>. Чем связь сильнее, тем меньше свободы у кода потом. Поэтому опытное правило
звучит так: бери <b>самую слабую связь, которой хватает</b> для задачи. Если хватает передать
объект параметром — не храни его полем. Если хватает поля — не наследуйся.</p>`,
        links: [
          { label: "MS Learn — Object-oriented programming", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop" },
          { label: "Refactoring Guru — отношения между объектами", url: "https://refactoring.guru/ru/design-patterns/what-is-pattern" }
        ],
        task: {
          q: "Программист написал <code>class Car : Engine</code>. Что здесь не так?",
          options: [
            "Ничего, двигатель — важная часть машины",
            "Связь названа неверно: машина не «является» двигателем, у неё двигатель есть — нужна композиция",
            "Нужно было наследовать Engine от Car",
            "Проблема только в имени класса"
          ],
          answer: 1,
          explain: "Наследование выражает is-a. «Машина является двигателем» — ложь, поэтому правильный вариант: поле Engine внутри Car (has-a)."
        }
      },
      {
        id: "oop-4",
        title: "Наследование (is-a)",
        subtitle: "Общее пишем один раз",
        theory: `
<p>У врага, игрока и босса в игре много общего: имя, здоровье, умение получать урон.
Копировать это в каждый класс — значит трижды чинить один и тот же баг.</p>
<p><b>Наследование</b> позволяет вынести общее в <b>базовый класс</b>, а наследники получают
всё это бесплатно и добавляют своё. Пишется двоеточием: <code>class Enemy : Entity</code> —
«Enemy является Entity».</p>
<p>Что важно знать:</p>
<ul>
<li>В C# у класса может быть <b>только один</b> базовый класс. Интерфейсов — сколько угодно.</li>
<li>Наследник видит <code>public</code> и <code>protected</code> члены родителя, но не
<code>private</code>.</li>
<li><code>protected</code> — это «для своих»: снаружи не видно, наследникам видно.</li>
</ul>
<p>И осторожно: глубокие цепочки наследования (класс → класс → класс → класс) становятся
хрупкими. Меняешь что-то наверху — неожиданно ломается внизу. Два уровня — обычно хватает.</p>`,
        code: `public class Entity
{
    public string Name { get; init; } = "";
    protected int Health = 100;               // для своих: видно наследникам

    public void TakeDamage(int amount) => Health -= amount;   // общее поведение
}

public class Enemy : Entity            // Enemy ЯВЛЯЕТСЯ Entity
{
    public int Damage { get; init; } = 10;
    public void Attack(Entity target) => target.TakeDamage(Damage);
}

public class Player : Entity           // и Player тоже
{
    public void Heal(int amount) => Health += amount;   // Health доступен: protected
}

var enemy = new Enemy { Name = "Goblin" };
var hero  = new Player { Name = "Anna" };
enemy.Attack(hero);            // метод из базового класса работает для обоих`,
        deep: `<p><b>Глубже:</b> наследование — самая сильная связь в языке: наследник намертво
привязан к внутреннему устройству родителя. Это называют <i>проблемой хрупкого базового
класса</i>: безобидное изменение в родителе тихо ломает потомков. Поэтому современный совет —
<b>«предпочитай композицию наследованию»</b>: наследуйся, только когда is-a действительно
правда и поведение общее навсегда.</p>`,
        links: [
          { label: "MS Learn — Inheritance", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance" },
          { label: "MS Learn — protected", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/protected" }
        ],
        task: {
          q: "Что означает модификатор <code>protected</code>?",
          options: [
            "Член виден всем, как public",
            "Член виден только внутри самого класса",
            "Член виден внутри класса и в классах-наследниках, но не снаружи",
            "Член нельзя менять после создания объекта"
          ],
          answer: 2,
          explain: "protected — это «private для чужих, public для наследников»: снаружи не достать, а наследник пользуется свободно."
        }
      },
      {
        id: "oop-5",
        title: "Ключевое слово base",
        subtitle: "Позвать родителя на помощь",
        theory: `
<p>Иногда наследник не хочет заменять поведение родителя целиком — он хочет <i>дополнить</i>
его. «Сделай как обычно, а потом ещё вот это».</p>
<p>Для этого есть слово <code>base</code>. Оно значит «родительская версия»:</p>
<ul>
<li><code>base.Describe()</code> — вызвать метод родителя из переопределённого метода;</li>
<li><code>: base(name)</code> — вызвать <b>конструктор</b> родителя, чтобы он настроил свою
часть объекта.</li>
</ul>
<p>Про конструкторы важно: объект строится <b>снизу вверх</b> — сначала работает конструктор
базового класса, потом наследника. Если у родителя нет пустого конструктора, наследник
<b>обязан</b> явно позвать нужный через <code>: base(...)</code>, иначе код не соберётся.</p>`,
        code: `public class Employee
{
    public string Name { get; }
    public decimal Salary { get; }

    public Employee(string name, decimal salary)   // пустого конструктора нет!
    {
        Name = name;
        Salary = salary;
    }

    public virtual string Describe() => $"{Name}, зарплата {Salary}";
}

public class Manager : Employee
{
    public int TeamSize { get; }

    // сначала родитель настроит Name и Salary, потом мы — TeamSize
    public Manager(string name, decimal salary, int teamSize)
        : base(name, salary)
    {
        TeamSize = teamSize;
    }

    // не переписываем родителя, а дополняем его
    public override string Describe()
        => base.Describe() + $", команда: {TeamSize} чел.";
}

Console.WriteLine(new Manager("Anna", 3000, 5).Describe());
// Anna, зарплата 3000, команда: 5 чел.`,
        deep: `<p><b>Глубже:</b> есть коварная деталь — не вызывай <code>virtual</code>-методы из
конструктора базового класса. В этот момент конструктор наследника ещё <i>не отработал</i>,
но вызовется уже его переопределённая версия — и увидит неинициализированные поля (нули и
<code>null</code>). Баг из тех, что ищут полдня.</p>`,
        links: [
          { label: "MS Learn — base", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/base" },
          { label: "MS Learn — Constructors", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/constructors" }
        ],
        task: {
          kind: "write",
          q: "У класса <code>Employee</code> есть только конструктор <code>Employee(string name)</code>. Напиши конструктор наследника <code>Manager(string name)</code>, который передаёт имя родителю.",
          placeholder: "public Manager(string name) ...",
          must: ["base(name)"],
          solution: `public Manager(string name) : base(name)
{
    // здесь — своя часть настройки
}`,
          explain: "Если у родителя нет конструктора без параметров, наследник обязан явно позвать подходящий через : base(...). Родитель настраивает свою часть объекта первым."
        }
      },
      {
        id: "oop-6",
        title: "Ассоциация (uses-a)",
        subtitle: "Попользовался и отпустил",
        theory: `
<p>Учитель пользуется доской. Доска ему не принадлежит, она висит в кабинете и переживёт
любого учителя. Они просто встретились на время урока.</p>
<p><b>Ассоциация</b> — самая слабая связь: объект <i>получает другой объект на время</i>,
обычно параметром метода, и не хранит его у себя. Владения нет, времени жизни он не
контролирует.</p>
<p>Зачем это нужно:</p>
<ul>
<li>объекты остаются <b>независимыми</b> — их легко переиспользовать;</li>
<li>класс легко тестировать: подсунул другую доску — и всё;</li>
<li>нет жёсткой сцепки, когда «тронешь одно — посыплется всё».</li>
</ul>
<p>Признак ассоциации в коде очень простой: <b>объект приходит параметром, а не лежит
полем.</b></p>`,
        code: `public class Whiteboard
{
    public void Write(string text) => Console.WriteLine($"[доска] {text}");
}

public class Teacher
{
    public string Name { get; init; } = "";

    // доска приходит на время урока и уходит — это ассоциация
    public void Teach(Whiteboard board, string topic)
    {
        board.Write($"{topic} — урок ведёт {Name}");
    }
}

var board = new Whiteboard();          // доска существует сама по себе
var anna  = new Teacher { Name = "Anna" };
var bob   = new Teacher { Name = "Bob" };

anna.Teach(board, "ООП");              // одной доской пользуются оба
bob.Teach(board, "LINQ");`,
        deep: `<p><b>Глубже:</b> именно на ассоциации держится <i>внедрение зависимостей</i>
(dependency injection). Класс не создаёт себе помощников через <code>new</code>, а получает
их снаружи — параметром метода или конструктора. Тогда в тестах ему можно подсунуть
поддельную версию, а в бою — настоящую, и сам класс переписывать не придётся.</p>`,
        links: [
          { label: "MS Learn — Dependency injection", url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection" },
          { label: "MS Learn — Methods & parameters", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/methods" }
        ],
        task: {
          q: "Как отличить ассоциацию (uses-a) от композиции (has-a) прямо в коде?",
          options: [
            "По имени класса",
            "При ассоциации объект приходит параметром и не хранится, при композиции — лежит полем и принадлежит владельцу",
            "Ассоциация всегда пишется через интерфейс",
            "Разницы нет, это одно и то же"
          ],
          answer: 1,
          explain: "Параметр = временное пользование (uses-a). Поле, созданное и принадлежащее классу = владение (has-a, композиция)."
        }
      },
      {
        id: "oop-7",
        title: "Агрегация (слабое has-a)",
        subtitle: "Часть есть, но она живёт своей жизнью",
        theory: `
<p>В команде есть игроки. Команда распалась — игроки никуда не делись, они просто перешли в
другие команды. Игрок существовал <i>до</i> команды и переживёт её.</p>
<p><b>Агрегация</b> — это «у меня есть эта штука, но она не моя». Объект хранит другой объект
полем, но <b>не создаёт его и не отвечает за его жизнь</b>. Части приходят снаружи, обычно
через конструктор.</p>
<p>Типичные примеры:</p>
<ul>
<li>Команда → игроки</li>
<li>Отдел → сотрудники</li>
<li>Библиотека → книги (книга не исчезает, если библиотеку закрыли)</li>
</ul>
<p>Смысл в переиспользовании: одна и та же деталь может принадлежать нескольким владельцам,
переходить между ними и жить дальше, когда владельца не стало.</p>`,
        code: `public class Player
{
    public string Name { get; init; } = "";
}

public class Team
{
    private readonly List<Player> _players;

    // игроки приходят СНАРУЖИ — команда их не создаёт
    public Team(List<Player> players) => _players = players;

    public void PrintRoster()
    {
        foreach (var p in _players) Console.WriteLine(p.Name);
    }
}

var anna = new Player { Name = "Anna" };
var bob  = new Player { Name = "Bob" };

var team = new Team(new List<Player> { anna, bob });
team.PrintRoster();

team = null;                 // команды больше нет...
Console.WriteLine(anna.Name); // ...а Anna жива и может играть за другую команду`,
        deep: `<p><b>Глубже:</b> у агрегации есть подводный камень — <i>общее состояние</i>. Если
один и тот же игрок лежит в двух командах, изменение из одной команды увидят обе. Иногда это
именно то, что нужно; иногда — источник загадочных багов. Если хочется независимости, отдавай
наружу копию списка (<code>_players.ToList()</code>) или <code>IReadOnlyList</code>, чтобы
чужой код не менял твою коллекцию.</p>`,
        links: [
          { label: "MS Learn — Collections", url: "https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/tutorials/list-collection" },
          { label: "MS Learn — IReadOnlyList", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.ireadonlylist-1" }
        ],
        task: {
          q: "Чем агрегация отличается от композиции?",
          options: [
            "Ничем, это синонимы",
            "При агрегации часть приходит снаружи и живёт независимо, при композиции — создаётся владельцем и умирает вместе с ним",
            "Агрегация возможна только для коллекций",
            "Композиция всегда через интерфейс, агрегация — через класс"
          ],
          answer: 1,
          explain: "Ключ — время жизни и владение: игрок переживёт команду (агрегация), а комната не переживёт дом (композиция)."
        }
      },
      {
        id: "oop-8",
        title: "Композиция (сильное has-a)",
        subtitle: "Часть рождается и умирает вместе с целым",
        theory: `
<p>В доме есть комнаты. Снесли дом — комнат больше нет. Комната не может «перейти в другой
дом»: она существует только как часть этого.</p>
<p><b>Композиция</b> — сильное владение: объект <b>сам создаёт</b> свои части и полностью
отвечает за них. Наружу они обычно не отдаются, снаружи не подставляются.</p>
<p>Типичные примеры: дом → комнаты, машина → двигатель, заказ → строки заказа.</p>
<p>И самое главное: <b>композиция — это современная замена наследованию</b>. Вместо «стать
чем-то» объект «имеет что-то» и передаёт работу внутрь. Такой код гнётся, а не ломается:
захотел другое поведение — подставил другую деталь, а не выдумал новый класс-наследник.</p>`,
        code: `public class Engine
{
    public void Start() => Console.WriteLine("Двигатель запущен");
}

public class Car
{
    // машина САМА создаёт двигатель и владеет им
    private readonly Engine _engine = new Engine();

    public void Start()
    {
        _engine.Start();            // делегируем работу своей части
        Console.WriteLine("Поехали");
    }
}

var car = new Car();
car.Start();
// снаружи до _engine не добраться: он часть машины, а не отдельная вещь

// car уходит в мусор — двигатель уходит вместе с ним`,
        deep: `<p><b>Глубже:</b> композицию часто путают с наследованием, потому что снаружи
результат похож: у <code>Car</code> появляется метод <code>Start()</code>. Разница в том,
<i>откуда</i> он взялся. При наследовании поведение прибито к типу навсегда. При композиции
деталь можно заменить — хоть в момент работы программы. Отсюда растёт паттерн Strategy: класс
хранит поведение объектом и меняет его на лету.</p>`,
        links: [
          { label: "MS Learn — Object-oriented programming", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop" },
          { label: "Refactoring Guru — Strategy", url: "https://refactoring.guru/ru/design-patterns/strategy" }
        ],
        task: {
          kind: "write",
          q: "Напиши класс <code>House</code>, который ВЛАДЕЕТ комнатой: приватное поле <code>_room</code> типа <code>Room</code>, создаваемое самим классом.",
          placeholder: "public class House ...",
          must: ["private", "_room=newroom()"],
          solution: `public class House
{
    private readonly Room _room = new Room();   // дом сам создаёт комнату
}`,
          explain: "Часть создаётся внутри владельца и не приходит снаружи — это и есть композиция: нет дома, нет и комнаты."
        }
      },
      {
        id: "oop-9",
        title: "Обобщение (generalization)",
        subtitle: "Заметил повтор — вынеси наверх",
        theory: `
<p>У машины есть колёса и она умеет ехать. У велосипеда — тоже. У грузовика — тоже.
Копировать одно и то же в три класса скучно и опасно.</p>
<p><b>Обобщение</b> — это процесс: смотришь на несколько похожих классов, находишь общее и
вытаскиваешь его в общего родителя. Получается <code>Vehicle</code>, а <code>Car</code> и
<code>Bike</code> становятся его частными случаями.</p>
<p>Обобщение — это обратная сторона наследования. Наследование — <i>результат</i>
(«Car is-a Vehicle»), обобщение — <i>путь</i>, которым к нему приходят: снизу вверх, от
конкретного к общему.</p>
<p>Важный момент: обобщать надо <b>по факту повтора</b>, а не заранее. Сначала пишешь два-три
конкретных класса, видишь настоящее общее — и только тогда выносишь. Родители, придуманные
заранее «на будущее», почти всегда оказываются неудобными.</p>`,
        code: `// Было: два класса с одинаковыми кусками
// class Car  { public int Wheels = 4; public void Move() {...} }
// class Bike { public int Wheels = 2; public void Move() {...} }

// Стало: общее вынесено наверх
public abstract class Vehicle
{
    public int Wheels { get; protected set; }
    public virtual void Move() => Console.WriteLine("Транспорт едет");
}

public class Car : Vehicle
{
    public Car() => Wheels = 4;
    public override void Move() => Console.WriteLine("Машина едет на бензине");
}

public class Bike : Vehicle
{
    public Bike() => Wheels = 2;
    public override void Move() => Console.WriteLine("Велосипед едет на педалях");
}

Vehicle[] garage = { new Car(), new Bike() };
foreach (var v in garage) v.Move();   // каждый едет по-своему`,
        deep: `<p><b>Глубже:</b> есть ловушка — <i>ложное обобщение</i>. Два класса могут случайно
иметь похожие поля, не будучи родственниками. Скидка на товар и скидка сотруднику обе имеют
<code>Percent</code>, но общий базовый класс <code>Discount</code> тут только свяжет по рукам:
завтра правила разойдутся, и придётся распутывать. Общий <i>смысл</i> важнее общих полей.</p>`,
        links: [
          { label: "MS Learn — Inheritance", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance" },
          { label: "Refactoring Guru — Extract Superclass", url: "https://refactoring.guru/ru/extract-superclass" }
        ],
        task: {
          q: "Что такое обобщение (generalization)?",
          options: [
            "Превращение класса в дженерик с параметром T",
            "Вынесение общих признаков нескольких классов в общий родительский класс",
            "Удаление лишних методов из класса",
            "Замена классов интерфейсами"
          ],
          answer: 1,
          explain: "Generalization — это движение снизу вверх: находим повторяющееся у нескольких классов и делаем из него базовый класс. С дженериками это никак не связано."
        }
      },
      {
        id: "oop-10",
        title: "Абстрактные классы",
        subtitle: "Заготовка, из которой нельзя сделать вещь",
        theory: `
<p>«Фигура» — это не вещь. Нарисовать можно круг или квадрат, а просто «фигуру» — нельзя.
Но у всех фигур есть общее: площадь, цвет, метод рисования.</p>
<p><b>Абстрактный класс</b> — это класс, из которого <b>нельзя создать объект</b>
(<code>new Shape()</code> не соберётся), но от которого можно наследоваться. Он совмещает
две вещи:</p>
<ul>
<li><b>готовый общий код</b> — обычные методы и поля, которые наследники получают даром;</li>
<li><b>обязательства</b> — <code>abstract</code>-члены без тела: наследник <i>обязан</i> их
реализовать, иначе не соберётся.</li>
</ul>
<p>Это отличие от интерфейса: интерфейс — только обязательства без кода, абстрактный класс —
обязательства <i>плюс</i> общий код. Берёшь абстрактный класс, когда у родственных классов
есть общая реализация, которую жалко копировать.</p>`,
        code: `public abstract class Shape
{
    public string Color { get; init; } = "black";

    // обязательство: тела нет, наследник ОБЯЗАН написать своё
    public abstract double Area();

    // общий готовый код: достаётся всем наследникам бесплатно
    public void Describe()
        => Console.WriteLine($"{GetType().Name} ({Color}), площадь {Area():0.00}");
}

public class Circle : Shape
{
    public double Radius { get; init; }
    public override double Area() => Math.PI * Radius * Radius;
}

public class Rect : Shape
{
    public double W { get; init; }
    public double H { get; init; }
    public override double Area() => W * H;
}

// var s = new Shape();          // ОШИБКА компиляции: абстрактный класс
Shape[] shapes = { new Circle { Radius = 2 }, new Rect { W = 3, H = 4 } };
foreach (var s in shapes) s.Describe();`,
        deep: `<p><b>Глубже:</b> <code>abstract</code> и <code>virtual</code> легко перепутать.
<code>virtual</code> — «у меня есть рабочая версия, можешь заменить». <code>abstract</code> —
«версии нет вовсе, ты обязан написать». Абстрактный член бывает только в абстрактном классе:
иначе можно было бы создать объект с дыркой вместо метода.</p>`,
        links: [
          { label: "MS Learn — abstract", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/abstract" },
          { label: "MS Learn — Abstract and sealed classes", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/abstract-and-sealed-classes-and-class-members" }
        ],
        task: {
          q: "В чём разница между <code>abstract</code> и <code>virtual</code> методом?",
          options: [
            "Никакой, это синонимы",
            "abstract не имеет тела и обязателен к реализации, virtual имеет рабочее тело и переопределяется по желанию",
            "virtual можно объявлять только в интерфейсах",
            "abstract работает быстрее"
          ],
          answer: 1,
          explain: "abstract — обязательство без реализации, virtual — реализация по умолчанию, которую наследник может, но не обязан заменить."
        }
      },
      {
        id: "oop-11",
        title: "Полиморфизм",
        subtitle: "Одна команда — разное поведение",
        theory: `
<p>Скажи классу «беги» — человек побежит ногами, птица полетит, рыба поплывёт. Команда одна,
исполнение разное. Это и есть <b>полиморфизм</b> («много форм»).</p>
<p>В C# он работает так:</p>
<ul>
<li>в базовом классе метод помечают <code>virtual</code> — «эту версию можно заменить»;</li>
<li>в наследнике пишут <code>override</code> — своя версия;</li>
<li>переменная может иметь тип родителя, но <b>решает всегда настоящий тип объекта</b> — и
решает это <i>во время работы программы</i>, а не при компиляции.</li>
</ul>
<p>Зачем это нужно: код, который перебирает массив <code>Entity[]</code>, ничего не знает про
боссов и игроков. Завтра добавишь новый тип врага — этот код <b>трогать не придётся</b>. Вот
ради этого ООП и затевалось.</p>
<p>Есть ещё <code>sealed override</code> — «я переопределил, и дальше менять запрещено». Так
фиксируют поведение, на которое нельзя влиять.</p>`,
        code: `public class Entity
{
    public string Name { get; init; } = "";
    public virtual void Update() => Console.WriteLine($"{Name} стоит");
}

public class Enemy : Entity
{
    public override void Update() => Console.WriteLine($"{Name} ищет игрока");
}

public class Player : Entity
{
    public override void Update() => Console.WriteLine($"{Name} слушает клавиши");
}

public class Boss : Enemy
{
    // sealed: дальше эту версию переопределить уже нельзя
    public sealed override void Update() => Console.WriteLine($"{Name} готовит удар");
}

Entity[] world = { new Player { Name = "Anna" },
                   new Enemy  { Name = "Goblin" },
                   new Boss   { Name = "Dragon" } };

foreach (var e in world)
    e.Update();     // тип переменной — Entity, а работает версия НАСТОЯЩЕГО типа

// Anna слушает клавиши / Goblin ищет игрока / Dragon готовит удар`,
        deep: `<p><b>Глубже:</b> как это устроено внутри — у каждого типа есть таблица виртуальных
методов (<i>v-table</i>), маленький список «какой метод на самом деле вызывать». Поэтому
вызов решается в момент работы программы. Плата за это — один лишний прыжок по указателю,
цена копеечная. А вот <code>new</code> вместо <code>override</code> — не полиморфизм, а
<i>сокрытие</i>: там выбор делается по типу переменной, и результат почти всегда неожиданный.
Помечай <code>override</code>, если хочешь настоящее замещение.</p>`,
        links: [
          { label: "MS Learn — Polymorphism", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/polymorphism" },
          { label: "MS Learn — virtual / override", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/virtual" }
        ],
        task: {
          kind: "write",
          q: "В базовом классе есть <code>public virtual void Update()</code>. Напиши в наследнике свою версию этого метода так, чтобы работал именно он (настоящее переопределение, а не сокрытие).",
          placeholder: "public ... void Update() ...",
          must: ["overridevoidupdate()"],
          solution: `public override void Update()
{
    Console.WriteLine("Своя логика наследника");
}`,
          explain: "Только override даёт настоящий полиморфизм: вызов решается по реальному типу объекта. Слово new вместо него лишь спрятало бы метод родителя."
        }
      },
      {
        id: "oop-12",
        title: "Интерфейсы и абстракция",
        subtitle: "Контракт: что уметь, а не как",
        theory: `
<p>В розетку можно воткнуть чайник, лампу или зарядку. Розетке всё равно, что внутри
устройства — важно, что у него есть подходящая вилка. Вилка — это <b>контракт</b>.</p>
<p><b>Интерфейс</b> — список того, что класс <i>обязан уметь</i>, без единой строчки о том,
<i>как</i> он это делает. Классы «подписывают контракт» словом <code>:</code> и пишут свою
реализацию. Имена интерфейсов по традиции начинаются с <code>I</code>.</p>
<p>А <b>абстракция</b> — это и есть привычка работать с контрактами вместо конкретных
классов. Код зависит от <code>IRepository</code>, а лежит за ним база данных, файл или
подделка для теста — коду всё равно.</p>
<p>Зачем:</p>
<ul>
<li><b>развязка</b> — меняешь реализацию, не трогая тех, кто ей пользуется;</li>
<li><b>тесты</b> — легко подсунуть поддельную реализацию;</li>
<li><b>гибкость</b> — класс может реализовать <b>сколько угодно</b> интерфейсов, хотя
базовый класс у него только один.</li>
</ul>`,
        code: `public interface IRenderable      // контракт: умею рисоваться
{
    void Render();
}

public interface IUpdatable       // контракт: умею обновляться
{
    void Update();
}

// один класс — несколько контрактов сразу
public class Player : IRenderable, IUpdatable
{
    public void Render() => Console.WriteLine("рисую игрока");
    public void Update() => Console.WriteLine("двигаю игрока");
}

public class Rock : IRenderable   // камень только рисуется
{
    public void Render() => Console.WriteLine("рисую камень");
}

// код работает с контрактом и не знает про конкретные классы
List<IRenderable> scene = new() { new Player(), new Rock() };
foreach (var item in scene) item.Render();`,
        deep: `<p><b>Глубже:</b> когда брать интерфейс, а когда абстрактный класс? Интерфейс — про
<i>умение</i> («умеет рисоваться»), его получают классы из разных семейств. Абстрактный класс
— про <i>родство</i> («это фигура») плюс общий код. Правило на практике: начинай с интерфейса,
а абстрактный класс добавляй, когда появился общий код, который жалко копировать. И держи
интерфейсы маленькими: <code>IRenderable</code> с одним методом полезнее, чем
<code>IEverything</code> с двадцатью.</p>`,
        links: [
          { label: "MS Learn — Interfaces", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces" },
          { label: "MS Learn — Interfaces vs abstract classes", url: "https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/choosing-between-class-and-interface" }
        ],
        task: {
          q: "Почему класс может реализовать много интерфейсов, но наследоваться только от одного класса?",
          options: [
            "Так решили ради красоты синтаксиса",
            "Интерфейсы задают только контракт без реализации, поэтому конфликтовать нечему; у классов же может быть спорная реализация одного метода",
            "Интерфейсы работают быстрее классов",
            "На самом деле в C# можно наследовать несколько классов"
          ],
          answer: 1,
          explain: "Множественное наследование классов рождает вопрос «чью реализацию брать?». У интерфейсов реализации нет — брать нечего, конфликта не возникает."
        }
      },
      {
        id: "oop-13",
        title: "Что можно объявить в интерфейсе",
        subtitle: "Список разрешённого и запрещённого",
        theory: `
<p>Интерфейс описывает <i>умения</i>, а не устройство. Отсюда и вытекает, что в него можно
класть, а что нельзя.</p>
<p><b>Можно:</b></p>
<ul>
<li><b>методы</b> — самое частое: подпись без тела;</li>
<li><b>свойства</b> — с <code>get</code>, <code>set</code> или обоими;</li>
<li><b>события</b> — для подписки/оповещения;</li>
<li><b>индексаторы</b> — обращение как к массиву: <code>obj[0]</code>.</li>
</ul>
<p><b>Нельзя:</b></p>
<ul>
<li><b>поля</b> — интерфейс не хранит данные, он про поведение;</li>
<li><b>конструкторы</b> — интерфейс не управляет созданием объектов;</li>
<li><b>деструкторы</b>;</li>
<li><b>модификаторы доступа</b> — всё и так публично, писать <code>public</code> незачем;</li>
<li><b>статические члены</b> — за одним исключением: <code>static abstract</code> из C# 11,
для обобщённой математики.</li>
</ul>`,
        code: `public interface IStorage
{
    // метод — подпись без тела
    void Save(string data);

    // свойство
    int Count { get; }

    // событие
    event Action<string> Saved;

    // индексатор
    string this[int index] { get; }

    // private int _size;              // ОШИБКА: полей нет
    // public IStorage() { }           // ОШИБКА: конструкторов нет
    // public void Save(string d);     // ОШИБКА: модификатор лишний
}

public class MemoryStorage : IStorage
{
    private readonly List<string> _items = new();   // поле живёт в КЛАССЕ

    public int Count => _items.Count;
    public string this[int index] => _items[index];
    public event Action<string>? Saved;

    public void Save(string data)
    {
        _items.Add(data);
        Saved?.Invoke(data);
    }
}`,
        deep: `<p><b>Глубже:</b> с C# 8 у интерфейсов появились <i>методы с реализацией по
умолчанию</i> (default interface methods). Это сделали не для удобства, а чтобы можно было
дописать метод в опубликованный интерфейс, не сломав всех, кто его уже реализовал. Пользуйся
этим редко: если реализации становится много, это уже не контракт, а абстрактный класс,
только переодетый.</p>`,
        links: [
          { label: "MS Learn — Interfaces", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/interface" },
          { label: "MS Learn — Default interface methods", url: "https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/interface-implementation/default-interface-methods-versions" }
        ],
        task: {
          q: "Что из перечисленного НЕЛЬЗЯ объявить в интерфейсе?",
          options: [
            "Метод без тела",
            "Свойство с get и set",
            "Поле для хранения данных",
            "Событие"
          ],
          answer: 2,
          explain: "Интерфейс не хранит данные — полей в нём нет. Методы, свойства, события и индексаторы объявлять можно."
        }
      },
      {
        id: "oop-14",
        title: "Проблема ромба",
        subtitle: "Почему нельзя наследовать два класса",
        theory: `
<p>Представь: класс <b>A</b> умеет <code>DoWork()</code>. Классы <b>B</b> и <b>C</b>
наследуются от A и каждый переписывает <code>DoWork()</code> по-своему. Теперь класс <b>D</b>
хочет унаследовать сразу B и C. Вопрос: чей <code>DoWork()</code> он получит — от B или от
C?</p>
<p>Ответа нет. Схема наследования на картинке похожа на ромб, поэтому это и называют
<b>проблемой ромба</b> (diamond problem). Именно из-за неё C# <b>запрещает наследовать
больше одного класса</b>: лучше без этой возможности, чем с непредсказуемым кодом.</p>
<p>Замена — интерфейсы. У них нет реализации, значит спорить не о чем: сколько бы интерфейсов
класс ни реализовал, тело метода всё равно пишет он сам, в одном месте.</p>
<p>А если два интерфейса требуют метод с одинаковым именем, но разным смыслом? Тогда есть
<b>явная реализация</b>: пишешь <code>void IFile.Save()</code> с именем интерфейса впереди.
Такой метод виден только через этот интерфейс — путаницы не будет.</p>`,
        code: `// Так НЕЛЬЗЯ: class D : B, C  → компилятор не пропустит

public interface IFile
{
    void Save();      // сохранить в файл
}

public interface ICloud
{
    void Save();      // сохранить в облако — то же имя, другой смысл
}

public class Document : IFile, ICloud
{
    // явная реализация: у каждого контракта своя версия
    void IFile.Save()  => Console.WriteLine("сохраняю на диск");
    void ICloud.Save() => Console.WriteLine("отправляю в облако");

    // обычный метод класса — для повседневного использования
    public void Save() => Console.WriteLine("сохраняю по умолчанию");
}

var doc = new Document();
doc.Save();                    // сохраняю по умолчанию
((IFile)doc).Save();           // сохраняю на диск
((ICloud)doc).Save();          // отправляю в облако`,
        deep: `<p><b>Глубже:</b> явная реализация полезна ещё и как способ <i>убрать метод с глаз
долой</i>. Например, коллекция реализует устаревший <code>IEnumerable.GetEnumerator()</code>
явно, чтобы в подсказках редактора висела только современная типизированная версия. Минус:
чтобы позвать явный метод, объект приходится приводить к интерфейсу — для <code>struct</code>
это ещё и упаковка (boxing).</p>`,
        links: [
          { label: "MS Learn — Explicit interface implementation", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/interfaces/explicit-interface-implementation" },
          { label: "MS Learn — Why no multiple inheritance", url: "https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/choosing-between-class-and-interface" }
        ],
        task: {
          q: "Класс реализует IFile и ICloud, и в обоих есть метод Save() с разным смыслом. Как дать каждому свою реализацию?",
          options: [
            "Никак, придётся переименовать метод в одном из интерфейсов",
            "Написать явную реализацию: void IFile.Save() и void ICloud.Save()",
            "Сделать оба метода virtual",
            "Унаследовать класс от обоих интерфейсов как от классов"
          ],
          answer: 1,
          explain: "Явная реализация привязывает метод к конкретному интерфейсу. Вызвать его можно только через приведение к этому интерфейсу — двусмысленности не остаётся."
        }
      },
      {
        id: "oop-15",
        title: "Типичные ошибки в связях",
        subtitle: "Три способа испортить проект",
        theory: `
<p>Разберём три реальные ошибки, из-за которых проекты становятся неподвижными.</p>
<p><b>1. Наследование вместо композиции.</b> <code>class Car : Engine</code>. Машина не
является двигателем — связь выдумана. Итог: машина навсегда прибита к одному типу двигателя,
электрическую не сделать.</p>
<p><b>2. Взрыв классов.</b> Нужны уведомления: письмом, пуш-сообщением, срочные,
отложенные. Начинают плодить <code>EmailNotification</code>,
<code>UrgentEmailNotification</code>, <code>DelayedPushNotification</code>… А что делать с
«срочным пушем с задержкой»? Каждое новое свойство <b>умножает</b> число классов. Лечится
композицией: канал доставки хранится объектом и подставляется.</p>
<p><b>3. Композиция там, где хватает ассоциации.</b> <code>Driver</code> хранит машину полем.
Теперь водитель привязан к одной конкретной машине навсегда: пересесть не может, в тесте не
подменить. А хватило бы параметра метода.</p>
<p>Общий вывод один: <b>бери самую слабую связь, которой хватает.</b></p>`,
        code: `// ---------- ОШИБКА: взрыв классов ----------
// class EmailNotification { }
// class UrgentEmailNotification : EmailNotification { }
// class DelayedPushNotification : PushNotification { }   // и так до бесконечности

// ---------- ПРАВИЛЬНО: композиция + подстановка поведения ----------
public interface IChannel
{
    void Send(string text);
}

public class EmailChannel : IChannel
{
    public void Send(string text) => Console.WriteLine($"письмо: {text}");
}

public class PushChannel : IChannel
{
    public void Send(string text) => Console.WriteLine($"пуш: {text}");
}

public class Notification
{
    private readonly IChannel _channel;         // канал ХРАНИТСЯ, а не наследуется
    public bool IsUrgent { get; init; }

    public Notification(IChannel channel) => _channel = channel;

    public void Send(string text)
        => _channel.Send(IsUrgent ? "СРОЧНО! " + text : text);
}

new Notification(new PushChannel()) { IsUrgent = true }.Send("сервер упал");
// срочный пуш — и ни одного нового класса`,
        deep: `<p><b>Глубже:</b> взрыв классов — это признак того, что признаки <i>перемножаются</i>
(канал × срочность × задержка = 8 классов, а с четвёртым признаком уже 16). Наследование
складывать не умеет — оно даёт одну ветку. Композиция умеет: каждое свойство становится
отдельной деталью, и они свободно комбинируются. Отсюда и совет «предпочитай композицию
наследованию» — он не про красоту, а про арифметику.</p>`,
        links: [
          { label: "Refactoring Guru — Replace Inheritance with Delegation", url: "https://refactoring.guru/ru/replace-inheritance-with-delegation" },
          { label: "MS Learn — Inheritance vs composition", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop" }
        ],
        task: {
          q: "Класс Driver хранит Car полем в конструкторе и водит только его. Что здесь стоит поменять?",
          options: [
            "Ничего, так правильно",
            "Наследовать Driver от Car",
            "Передавать Car параметром метода Drive(Car car) — водителю хватает ассоциации, владеть машиной ему не нужно",
            "Сделать поле public"
          ],
          answer: 2,
          explain: "Владение здесь лишнее: водитель просто пользуется машиной. Параметр метода даёт свободу — можно сесть за любую машину и легко подставить другую в тестах."
        }
      },
      {
        id: "oop-16",
        title: "Методы расширения",
        subtitle: "Дописать метод к чужому классу",
        theory: `
<p>Тебе нужен у <code>string</code> метод <code>ToSlug()</code>, превращающий «Привет Мир» в
«привет-мир». Но <code>string</code> написан в Microsoft, залезть внутрь нельзя, а
наследоваться от него запрещено.</p>
<p><b>Метод расширения</b> решает это: ты пишешь метод <i>снаружи</i>, а вызываешь так, будто
он всегда был в классе. Правила простые и их всего четыре:</p>
<ol>
<li>класс должен быть <code>static</code>;</li>
<li>метод должен быть <code>static</code>;</li>
<li>первый параметр помечается словом <code>this</code> — это и есть тот тип, который
расширяем;</li>
<li><code>this</code> бывает только у первого параметра.</li>
</ol>
<p>Никакой магии тут нет: компилятор просто переписывает <code>text.ToSlug()</code> в
<code>StringExtensions.ToSlug(text)</code>. Это <i>синтаксический сахар</i> — то есть более
приятная запись того же самого вызова.</p>
<p>Именно на этом построен весь LINQ: <code>Where</code>, <code>Select</code>,
<code>OrderBy</code> — обычные методы расширения для <code>IEnumerable&lt;T&gt;</code>.</p>`,
        code: `public static class StringExtensions      // 1) класс static
{
    // 2) метод static   3) первый параметр с this
    public static string ToSlug(this string text)
        => text.Trim().ToLower().Replace(" ", "-");

    public static bool IsBlank(this string? text)
        => string.IsNullOrWhiteSpace(text);
}

// Было бы так:
var a = StringExtensions.ToSlug("Привет Мир");

// А можно так — будто метод всегда был у string:
var b = "Привет Мир".ToSlug();       // привет-мир

if ("   ".IsBlank()) Console.WriteLine("пустая строка");

// LINQ — это ровно то же самое, методы расширения для IEnumerable<T>
var evens = new[] { 1, 2, 3, 4 }.Where(x => x % 2 == 0);`,
        deep: `<p><b>Глубже:</b> у расширений есть цена. Они <b>не видят private-членов</b> — снаружи
класса доступно только публичное, поэтому настоящим ООП это не является. Их легко «спрятать»:
метод живёт в чужом файле, и найти его глазами трудно (спасает <code>using</code> нужного
пространства имён — без него метод просто не появится). И приятная деталь: расширение
спокойно вызывается на <code>null</code>, ведь это обычный статический метод — на этом
построены проверки вроде <code>IsBlank()</code>.</p>`,
        links: [
          { label: "MS Learn — Extension methods", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods" },
          { label: "MS Learn — LINQ", url: "https://learn.microsoft.com/en-us/dotnet/csharp/linq/" }
        ],
        task: {
          kind: "write",
          q: "Напиши метод расширения <code>Shout()</code> для <code>string</code>, который возвращает строку в верхнем регистре. Достаточно одной строки-сигнатуры с телом.",
          placeholder: "public static string Shout(...)",
          must: ["staticstringshout(thisstring"],
          solution: `public static class StringExtensions
{
    public static string Shout(this string text) => text.ToUpper() + "!";
}

// использование:
"привет".Shout();   // ПРИВЕТ!`,
          explain: "Статический класс, статический метод, первый параметр с this — три обязательных условия. Дальше компилятор сам превращает text.Shout() в вызов StringExtensions.Shout(text)."
        }
      },
      {
        id: "oop-17",
        title: "Расширения против обычных методов",
        subtitle: "Кто побеждает и что такое fluent API",
        theory: `
<p>Важное правило, на котором спотыкаются даже опытные: <b>настоящий метод класса всегда
побеждает метод расширения</b>.</p>
<p>Логика такая: компилятор сначала ищет метод <i>внутри</i> типа. Нашёл — на этом всё,
расширения он даже не смотрит. И <code>virtual</code>, и <code>override</code>, и спрятанный
через <code>new</code> метод — все они выигрывают. Расширение подключается <b>только если
подходящего метода в классе нет вообще</b>.</p>
<p>Отсюда вывод: расширением нельзя «подменить» поведение чужого класса. Оно только
дописывает недостающее.</p>
<p>А ещё расширения любят за <b>fluent API</b> — цепочки вызовов. Секрет прост: если метод
возвращает сам объект (<code>return this</code> или сам изменённый объект), следующий вызов
можно приписать сразу за ним. Так читается почти как предложение — именно поэтому LINQ такой
приятный.</p>`,
        code: `public class A
{
    public void Print() => Console.WriteLine("метод класса A");
}

public static class Ext
{
    public static void Print(this A a) => Console.WriteLine("метод расширения");
}

new A().Print();          // "метод класса A" — расширение проигрывает всегда


// ---------- fluent API: каждый метод возвращает объект ----------
public class QueryBuilder
{
    private readonly List<string> _parts = new();

    public QueryBuilder From(string table)  { _parts.Add($"FROM {table}");  return this; }
    public QueryBuilder Where(string cond)  { _parts.Add($"WHERE {cond}");  return this; }
    public QueryBuilder OrderBy(string col) { _parts.Add($"ORDER BY {col}"); return this; }

    public override string ToString() => string.Join(" ", _parts);
}

var sql = new QueryBuilder()
    .From("Users")
    .Where("Age > 18")
    .OrderBy("Name")
    .ToString();          // FROM Users WHERE Age > 18 ORDER BY Name`,
        deep: `<p><b>Глубже:</b> у этого правила есть неприятное следствие для авторов библиотек.
Если ты выпустил расширение <code>Print()</code>, а потом в самом классе появился настоящий
<code>Print()</code> — код пользователей молча начнёт вызывать другой метод. Не ошибка
компиляции, а тихая смена поведения. Поэтому расширениям дают имена поспецифичнее и держат в
отдельном пространстве имён, которое подключают осознанно.</p>`,
        links: [
          { label: "MS Learn — Extension methods (binding rules)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods" },
          { label: "Martin Fowler — Fluent Interface", url: "https://martinfowler.com/bliki/FluentInterface.html" }
        ],
        task: {
          q: "У класса A есть метод <code>Print()</code>, и написано расширение <code>Print()</code> для A. Что вызовется при <code>new A().Print()</code>?",
          options: [
            "Метод расширения — он объявлен позже",
            "Метод класса A — расширения рассматриваются только когда подходящего метода в классе нет",
            "Оба по очереди",
            "Ошибка компиляции: неоднозначный вызов"
          ],
          answer: 1,
          explain: "Компилятор сначала ищет метод в самом типе. Нашёл — расширения он даже не рассматривает. Подменить поведение класса расширением невозможно."
        }
      }
    ]
  },
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
  },
  /* ================= WORLD: Сборка мусора ================= */
  {
    id: "gc",
    name: "Сборка мусора (GC)",
    icon: "♻",
    blurb: "Как .NET решает, что объект больше не нужен: корни и достижимость, поколения, mark/compact/sweep, LOH и POH, финализация, Server и Background GC.",
    levels: [
      {
        id: "gc-1",
        title: "Зачем нужен GC и как он думает",
        subtitle: "Он ищет не мусор, а живых",
        theory: `
<p>В C++ каждая вещь на куче — твоя личная ответственность: сам создал, сам решил, когда
выбросить. Звучит честно, но в большой программе разваливается всегда одинаково:</p>
<ul>
<li>забыл освободить → память течёт, процесс пухнет, в конце OOM;</li>
<li>освободил рано, а кто-то ещё пользуется → чтение по мёртвому адресу, падение или дыра
в безопасности;</li>
<li>освободил дважды → испорченная куча, а падает потом и совсем в другом месте;</li>
<li>непонятно, кто владелец → баги времени жизни, размазанные по всему API.</li>
</ul>
<p><b>Управляемая среда переворачивает договор</b>: выделяет память язык, а освобождает
рантайм. Ты рассуждаешь про ссылки и смысл («этот заказ ещё нужен?»), а не про то, кто
владеет сырым указателем.</p>
<p>Сразу убьём миф: управляемая память — <b>не «медленная память»</b>. Само выделение обычно
дешевле, чем <code>malloc</code>: это сдвиг указателя на несколько байт. Платишь ты не за
выделение, а за уборку — она случается пачками и стоит либо паузы, либо фоновой работы
процессора.</p>
<p>Если запретить ручное <code>free</code>, кто-то обязан ответить на один вопрос:</p>
<p><b>«Какие объекты ещё достижимы из работающей программы?»</b></p>
<p>Вот и вся работа GC. Поколения, card table, LOH, фоновая сборка — это всё лишь
оптимизации поверх этого вопроса.</p>
<p>И тут главный переворот в голове, из-за которого джуны обычно и путаются:
<b>GC не ищет объекты, которые надо удалить. Он ищет объекты, до которых можно дойти.</b>
Всё остальное автоматически становится мусором:</p>
<ul>
<li><b>живые</b> = всё, до чего можно дойти по ссылкам, начиная с корней;</li>
<li><b>мусор</b> = вся куча минус живые.</li>
</ul>
<p><b>Корень (root)</b> — это точка входа в граф объектов, то, что живо «просто потому что».
Их несколько видов: локальные переменные на стеке и в регистрах процессора, статические
поля, GC-хэндлы (в том числе закреплённые объекты и интероп), очередь финализации и
«грязные карты» (про них будет отдельный уровень).</p>
<p>Практический вывод, который стоит дороже всей теории: <b>если забытое статическое поле
или неотписанный обработчик события всё ещё держит ссылку — объект жив</b>, сколько бы
«ненужным» он тебе ни казался. «Утечка» в .NET почти всегда означает не потерянную память,
а лишнюю живую ссылку.</p>
<p>Чтобы понимать, почему выбрали именно такой GC, полезно знать соседей по цеху:</p>
<ul>
<li><b>Ручное управление.</b> Аллокатор знает, какие блоки свободны, но не знает, указывает
ли ещё кто-нибудь на занятый блок. Отсюда все беды выше.</li>
<li><b>Подсчёт ссылок.</b> При каждом присваивании счётчик +1, при обнулении −1, дошло до
нуля — сразу освобождаем. Память возвращается мгновенно, но цикл <code>A → B → A</code>
никогда не дойдёт до нуля, и вдобавок каждая запись ссылки стоит атомарной операции.</li>
<li><b>Трассирующий (то, что в .NET).</b> Начинаем с корней, помечаем достижимое,
остальное забираем. Циклы достаются бесплатно: до непривязанного цикла просто никто
не дошёл — значит, он мусор.</li>
<li><b>Поколенческий.</b> Наблюдение: большинство объектов умирает молодыми. Значит, часто
и дёшево собираем «детский сад» и редко — старое поколение.</li>
</ul>
<p>Одной строкой: GC в .NET — <b>точный трассирующий, поколенческий, в основном
уплотняющий на SOH, LOH по умолчанию просто зачищает, есть режимы Workstation/Server
и необязательная фоновая сборка Gen2</b>. Дальше весь мир — про детали этой строки.</p>`,
        code: `// ── Мусор — это НЕ «я больше не пользуюсь». Это «до меня не дойти». ──

class Order { public byte[] Payload = new byte[1_000_000]; }

// 1) Обычная жизнь: ссылка ушла — объект стал мусором
void Normal()
{
    var order = new Order();
    Use(order);
}   // локальная переменная умерла → до Order не дойти → он мусор

// 2) Утечка №1: забытый static. Кэш растёт вечно, GC бессилен —
//    объект достижим из корня, значит он ЖИВОЙ
static readonly List<Order> Cache = new();
void Leaky(Order o) => Cache.Add(o);       // никто никогда не удаляет

// 3) Утечка №2: подписка на событие. Издатель держит подписчика
publisher.Changed += subscriber.OnChanged; // publisher ──► subscriber
// subscriber теперь жив ровно столько, сколько жив publisher
publisher.Changed -= subscriber.OnChanged; // лечится отпиской

// 4) Циклы трассирующему GC не страшны
class Node { public Node? Other; }
var a = new Node();
var b = new Node();
a.Other = b;
b.Other = a;          // A ↔ B — счётчик ссылок тут навсегда застрял бы на 1
a = null;
b = null;             // от корней до пары не дойти → оба умрут на ближайшем GC

// Картинка того, что делает GC:
//
//   Корни: стек | регистры | статики | хэндлы
//        │
//        ▼  идём по полям-ссылкам
//   [ Order ──► Address ──► City ]      ← живые
//
//   [ Orphan ──► Ghost ]                ← сюда не дошли = мусор

// 5) Clear() не освобождает элементы — он лишь роняет ссылки.
//    Память вернётся на ближайшей подходящей сборке, а не на этой строке.
Cache.Clear();`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>«Почему в .NET не подсчёт ссылок, как в COM или Python?»</b> Две причины. Первая —
циклы: граф объектов в реальном приложении полон обратных ссылок (родитель ↔ ребёнок,
издатель ↔ подписчик), и наивный счётчик их не собирает никогда. Вторая — цена: счётчик
надо менять при <i>каждой</i> записи ссылки, потокобезопасно, то есть атомарно. Трассирующий
GC платит только в момент сборки, зато аллокация у него почти бесплатная.</p>
<p><b>Очередь финализации — не постоянный корень.</b> Часто говорят «финализируемые объекты
всегда живые» — это неверно. Объект с финализатором попадает в специальную очередь и
удерживается <i>дополнительно один раз</i>, чтобы успел выполниться <code>Finalize</code>,
а не бессмертен навсегда.</p>
<p><b>WeakReference не корень.</b> Слабая ссылка позволяет дойти до объекта, но не удерживает
его. Классическая ловушка в демо: вызвал <code>TryGetTarget(out var x)</code> — и вот
<code>x</code> уже лежит на стеке как самый настоящий сильный корень, после чего «объект
почему-то не собрался».</p>
<p><b>«Точный» (precise) GC</b> означает, что рантайм знает <i>точные</i> адреса ссылок в
каждый момент остановки, а не гадает «это число похоже на указатель». Именно поэтому в .NET
нет консервативного сканирования стека и объекты можно безопасно двигать.</p>`,
        links: [
          { label: "MS Learn — Основы сборки мусора", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/fundamentals" },
          { label: "MS Learn — Garbage collection (обзор)", url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/" },
          { label: "Book of the Runtime — Garbage Collection Design", url: "https://github.com/dotnet/runtime/blob/main/docs/design/coreclr/botr/garbage-collection.md" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          q: "Объект лежит в статическом кэше, но программа к нему никогда больше не обратится. Что сделает GC?",
          options: [
            "Соберёт его: раз к нему не обращаются, он считается мусором",
            "Соберёт после нескольких сборок, когда счётчик ссылок дойдёт до нуля",
            "Не соберёт: до объекта можно дойти от корня (статического поля), значит он живой",
            "Соберёт только при вызове GC.Collect()"
          ],
          answer: 2,
          explain: "GC не измеряет «пользуются или нет» — он считает достижимость от корней. Статическое поле это корень, поэтому объект живой. Такие «утечки» лечатся не сборщиком, а удалением лишней ссылки."
        }
      },
      {
        id: "gc-2",
        title: "Куча, сегменты и поколения",
        subtitle: "Детский сад, средняя школа и дом престарелых",
        theory: `
<p>Процесс видит не физическую память, а <b>виртуальное адресное пространство</b>. Работа
с ним идёт в три шага, и на собеседовании их любят:</p>
<ul>
<li><b>Reserve</b> — застолбить диапазон адресов. Физической памяти пока ноль.</li>
<li><b>Commit</b> — подкрепить страницы реальной памятью, чтобы к ним можно было
обращаться. Именно это видно как потребление памяти.</li>
<li><b>Decommit / release</b> — вернуть неиспользуемые страницы системе после сборки.</li>
</ul>
<p>Поэтому CLR может зарезервировать большой диапазон заранее (чтобы куча росла непрерывно),
а коммитить понемногу — и после сборки отдать хвост обратно, уменьшив рабочий набор.</p>
<p>Управляемая куча — <b>это не одна плоская арена, а набор сегментов</b>. Среди них есть
особенный: <b>ephemeral segment</b> (эфемерный = недолговечный). Это непрерывный кусок
памяти, где живут молодые поколения — Gen0 и Gen1, а иногда с того же сегмента начинается
и Gen2.</p>
<p>Зачем отдельный сегмент под молодёжь? Потому что почти каждый <code>new</code> маленького
объекта попадает именно сюда — и тогда выделение остаётся простым сдвигом указателя, а
эфемерная сборка обходит только этот небольшой участок, а не всю старую кучу.</p>
<p>Теперь сами <b>поколения</b>. Идея опирается на статистику: <i>большинство объектов
умирает молодыми</i>. Значит, глупо каждый раз перелопачивать всю кучу — достаточно часто
и дёшево чистить «детский сад».</p>
<ul>
<li><b>Gen0</b> — ясли. Сюда попадают все новые маленькие объекты.</li>
<li><b>Gen1</b> — буфер между молодыми и старыми: те, кто пережил сборку Gen0.</li>
<li><b>Gen2</b> — долгожители: кэши, синглтоны, статические структуры.</li>
</ul>
<p>Важно понимать, что <b>поколение — это не возраст в секундах</b>. Это «сколько сборок
объект пережил». Объект, проживший час, но ни разу не попавший под сборку, останется
в Gen0.</p>
<p>Правило вложенности простое и его спрашивают почти всегда:</p>
<ul>
<li>сборка Gen0 собирает только Gen0;</li>
<li>сборка Gen1 собирает Gen0 + Gen1;</li>
<li>сборка Gen2 собирает Gen0 + Gen1 + Gen2 <b>и ещё LOH с POH</b> — это и есть «полная
сборка».</li>
</ul>
<p>То есть <b>сборка поколения N всегда собирает 0..N</b>. Обратного не бывает: нельзя
собрать Gen2, не тронув Gen0.</p>
<p>Пережившие сборку <b>продвигаются</b>: Gen0 → Gen1 → Gen2. Дальше расти некуда, поэтому
выжившие в Gen2 так и остаются в Gen2 — их единственный шанс освободиться — это полная
сборка, где они окажутся недостижимы.</p>
<p>И маленькая нестыковка, на которой ловят: <b>публично поколений три, а внутри
коллектора их больше</b>. Куча больших объектов (LOH) внутри рантайма — это generation 3,
а POH — отдельная куча. Но <code>GC.GetGeneration</code> для объекта на LOH честно вернёт
вам <b>2</b>, потому что публичный API знает только 0, 1, 2. Правильный ответ на собесе:
<i>«публично три поколения; LOH внутри нумеруется как gen3 и собирается вместе с
Gen2»</i>.</p>`,
        code: `// ── Поколения на практике ──
Console.WriteLine(GC.MaxGeneration);          // 2 — всегда

var small = new byte[1_000];
Console.WriteLine(GC.GetGeneration(small));   // 0 — новый маленький объект

var big = new byte[85_000];
Console.WriteLine(GC.GetGeneration(big));     // 2 — это LOH (внутри gen3),
                                              //     но API показывает 2

// ── Продвижение: пережил сборку → поднялся на поколение выше ──
object x = new byte[1024];
Console.WriteLine(GC.GetGeneration(x));       // 0

GC.Collect(0, GCCollectionMode.Forced, blocking: true);
Console.WriteLine(GC.GetGeneration(x));       // 1  (x ещё держится ссылкой)

GC.Collect(1, GCCollectionMode.Forced, blocking: true);
Console.WriteLine(GC.GetGeneration(x));       // 2

GC.KeepAlive(x);   // говорим JIT: ссылка нужна до этой строки

// ── Как это лежит в памяти ──
//
// Ephemeral segment (один на каждую SOH-кучу):
//  младшие адреса                                 старшие адреса
//  +-------------+-------------+---------------------+
//  |    Gen0     |    Gen1     | тут может начаться  |
//  |  new ►►►    | выжившие    | Gen2                |
//  +-------------+-------------+---------------------+
//        ▲
//        └── сюда попадает каждый новый маленький объект
//
// Вся куча целиком:
//  +----------------+   +---------------------+   +---------+
//  | SOH            |   | UOH (с Gen2)        |   | Frozen  |
//  | Gen0 Gen1 Gen2 |   | LOH  |  POH         |   | сегмент |
//  +----------------+   +---------------------+   +---------+
//
// Сборка Gen0 → только Gen0
// Сборка Gen1 → Gen0 + Gen1
// Сборка Gen2 → Gen0 + Gen1 + Gen2 + LOH + POH   (полная)`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>Размеры поколений не константы.</b> «Gen0 — это 256 КБ» — устаревшая заученная цифра.
Бюджет Gen0 динамический: от сотен килобайт до десятков мегабайт, в зависимости от нагрузки,
доли выживших объектов, размера кэша процессора и политики (в контейнерах на это ещё влияет
DATAS). Правильный ответ: «размер подбирается рантаймом, а не задан числом».</p>
<p><b>Эфемерный сегмент ровно один на кучу.</b> В Workstation GC куча одна — значит, и
сегмент один. В Server GC каждая <code>gc_heap</code> имеет свой эфемерный сегмент, поэтому
их столько же, сколько куч. Gen2, в отличие от молодых, может расползаться по
дополнительным сегментам.</p>
<p><b>SOH vs UOH.</b> SOH (Small Object Heap) — маленькие объекты, они продвигаются по
поколениям и часто уплотняются. UOH (User Old Heap) — это LOH + POH: туда пользовательский
код может выделять <i>напрямую</i>, и объекты там сразу «старые». Это важное отличие от
Gen2 на SOH, куда попадают только продвинутые выжившие.</p>
<p><b>Демоушен (demotion).</b> Обычно объект только поднимается, но GC вправе оставить
объект в младшем поколении — например, когда в эфемерном сегменте выжило слишком много
и продвигать всё это в Gen2 невыгодно. Это редкая, но реальная политика, и она хорошо
показывает: «поколение» — это решение коллектора, а не свойство объекта.</p>
<p><b>32 бита против 64.</b> На 32-битных процессах виртуального адресного пространства
~2 ГБ (до ~4 ГБ с LAA), и дыры в адресном пространстве убивали приложения задолго до
исчерпания RAM. На 64 битах адресов практически бесконечно, поэтому ограничением стал
объём закоммиченной памяти и лимит контейнера, а не сами адреса.</p>`,
        links: [
          { label: "MS Learn — Основы сборки мусора (поколения)", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/fundamentals" },
          { label: "MS Learn — Куча больших объектов (LOH)", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/large-object-heap" },
          { label: "API — GC.GetGeneration", url: "https://learn.microsoft.com/en-us/dotnet/api/system.gc.getgeneration" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          q: "Сколько поколений у GC в .NET и куда в этой схеме попадает массив на 100 000 байт?",
          options: [
            "Четыре поколения: 0, 1, 2 и LOH как gen3 — GetGeneration вернёт 3",
            "Три публичных поколения (0–2). Массив уходит на LOH, внутри это gen3, но GetGeneration вернёт 2, и собирается он вместе с Gen2",
            "Три поколения. Массив попадёт в Gen0, как любой новый объект, и продвинется позже",
            "Два поколения: молодое и старое, а LOH вообще не собирается"
          ],
          answer: 1,
          explain: "Публичный API знает 0, 1 и 2. LOH внутри коллектора пронумерован как gen3, но наружу показывается как 2 и собирается только при полной сборке Gen2."
        }
      },
      {
        id: "gc-3",
        title: "Объект в памяти и выделение",
        subtitle: "Что на самом деле хранит переменная",
        theory: `
<p>Когда ты пишешь <code>Person p = new Person();</code>, переменная <code>p</code> хранит
не объект, а <b>адрес</b> — место в куче. Назовём этот адрес <code>obj</code>. Вокруг него
на 64-битной машине лежит вот что:</p>
<ul>
<li><code>obj - 8</code> — <b>заголовок объекта</b> (sync block: биты блокировки, хэш-код).
Он лежит <i>перед</i> адресом, на который ты смотришь;</li>
<li><code>obj + 0</code> — <b>указатель на Method Table</b>. Именно сюда указывает твоя
ссылка;</li>
<li><code>obj + 8</code> — начало полей объекта (<code>Name</code>, <code>Age</code>, …).</li>
</ul>
<p>Это не какие-то магические имена из CLR, а просто смещения в байтах от адреса в
переменной: отнял 8 — заголовок, ничего не прибавил — указатель на таблицу методов,
прибавил 8 — первое поле. На x86 то же самое, но указатели по 4 байта.</p>
<p><b>Method Table (MT)</b> — паспорт типа. Из неё рантайм узнаёт: что это за тип, какого
он размера, таблицу виртуальных методов, флаги и — самое интересное для нас — <b>GC
descriptor</b>.</p>
<p>GC descriptor — это карта: <i>какие именно слоты в объекте являются ссылками</i>. Если
в классе есть <code>string Name</code>, <code>int Age</code> и <code>Address Address</code>,
то при разметке коллектор пройдёт только по <code>Name</code> и <code>Address</code>, а
<code>Age</code> никогда не примет за указатель. Вот что означает слово «точный» (precise)
применительно к GC .NET.</p>
<p>Теперь <b>как происходит выделение</b>. Конвейер примерно такой:</p>
<ol>
<li>тип уже загружен, MT готова;</li>
<li>считаем полный выровненный размер;</li>
<li>размер больше порога LOH? Тогда на LOH, иначе на SOH Gen0;</li>
<li>сдвигаем указатель в allocation context потока;</li>
<li>память уже занулена;</li>
<li>записываем указатель на Method Table;</li>
<li>если у типа есть финализатор — регистрируем его;</li>
<li>вызываем конструктор;</li>
<li>возвращаем ссылку.</li>
</ol>
<p>Шаг 4 — это и есть знаменитый <b>bump pointer</b>. У каждого потока есть свой маленький
кусок кучи (allocation context) и указатель <code>alloc_ptr</code>. Выделить объект —
значит проверить, влезает ли он до конца куска, и сдвинуть указатель. Всё.</p>
<p>Почему это быстро: не надо искать подходящую дырку в списке свободных блоков, кусок
приватный для потока (никаких блокировок), код встраивается JIT-ом прямо в место вызова,
а объекты, созданные подряд, ложатся рядом — процессорному кэшу это очень нравится.</p>
<p>Если объект не влезает в остаток куска, поток берёт новый кусок (а остаток превращается
в служебный «свободный объект»), либо, если бюджет исчерпан, запускается сборка.</p>
<p>Пара мелочей, которые всплывают в вопросах: объекты выравниваются (обычно по 8 байт на
x64), у каждого объекта есть минимальный размер — <b>даже пустой класс платит за заголовок
и указатель на MT</b>, а дырка в куче может считаться свободным блоком только если она не
меньше минимального размера объекта.</p>`,
        code: `// ── Что лежит вокруг адреса, который хранит ссылка (x64) ──
//
//   адреса растут →
//   ... | заголовок (8) | Method Table* (8) | поля... | ...
//       ^               ^                   ^
//    obj - 8          obj                 obj + 8
//                       │
//                       └── ЭТО хранит переменная p
//
// Массив: те же поля, плюс длина перед элементами
//   | header | MT* | length | e0 | e1 | e2 | ...

class Person
{
    string  Name;      // ссылка   → GC пойдёт по ней
    int     Age;       // значение → GC её не тронет
    Address Address;   // ссылка   → GC пойдёт по ней
}
// GC descriptor в Method Table говорит: «слоты 0 и 2 — ссылки»

// ── Bump pointer: как выглядит выделение внутри ──
//
//  alloc_context потока:
//  +----------------------------------------------+
//  |###### занято ######|......... свободно .......|
//  +----------------------------------------------+
//   ^                    ^                         ^
//  start              alloc_ptr                alloc_limit
//
//  (1) чистый кусок      |________________________|
//  (2) new A             |AAAA|___________________|
//  (3) new B             |AAAA|BBBB|______________|
//  (4) не влезло → остаток становится FREE, берём новый кусок

Allocate(size):
    size = Align(size)                       // выравнивание, обычно по 8
    if alloc_ptr + size > alloc_limit:
        return slow_path                     // новый кусок или сборка
    result   = alloc_ptr
    alloc_ptr += size                        // весь «аллокатор» — вот эта строка
    return result

// ── Порог LOH считается по ПОЛНОМУ размеру объекта ──
var a = new byte[80_000];    // SOH, Gen0
var b = new byte[85_000];    // LOH (85 000 байт — порог по умолчанию)
// у массива есть заголовок, MT* и длина, поэтому byte[84_990]
// вместе со служебными байтами уже может перевалить порог`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>«Почему аллокация в .NET быстрее, чем malloc?»</b> Потому что это не поиск, а
арифметика: сравнение и сложение по потоко-локальному указателю, встроенные JIT-ом. Классический
аллокатор обязан найти подходящий блок в списке свободных и синхронизировать это между
потоками. Цена управляемой модели платится не здесь, а во время сборки.</p>
<p><b>Память уже занулена.</b> Именно поэтому в C# поля по умолчанию нули, а не мусор —
это не «доброта компилятора», а следствие того, что рантайм отдаёт чистую память
(и это, кстати, реальная стоимость: обнуление больших массивов не бесплатно).</p>
<p><b>Порог LOH — 85 000 байт, а не 85 КБ.</b> 85 КБ было бы 87 040. И сравнивается общий
размер объекта, а не длина массива. Порог настраивается через <code>GCLOHThreshold</code>,
но крутить его без замеров — плохая идея. Выделения на LOH идут мимо allocation context:
там список свободных блоков, а не сдвиг указателя.</p>
<p><b>Сколько весит пустой объект?</b> На x64 — 24 байта: 8 заголовок, 8 указатель на MT,
плюс выравнивание до минимального размера объекта. Отсюда практическое следствие: миллион
крошечных объектов — это в основном служебные байты, и часто выигрывает
<code>struct</code> в массиве.</p>
<p><b>Почему GC не может «просто посмотреть на стек и угадать указатели»?</b> Потому что
он точный: JIT сохраняет GC-информацию о том, в каких слотах и регистрах в каждой точке
безопасности лежат ссылки. Консервативный сборщик (как в некоторых рантаймах) не смог бы
двигать объекты — а .NET двигает.</p>`,
        links: [
          { label: "MS Learn — Основы сборки мусора (выделение памяти)", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/fundamentals" },
          { label: "Book of the Runtime — Type System / Method Tables", url: "https://github.com/dotnet/runtime/blob/main/docs/design/coreclr/botr/type-loader.md" },
          { label: "MS Learn — Конфигурация GC (GCLOHThreshold)", url: "https://learn.microsoft.com/en-us/dotnet/core/runtime-config/garbage-collector" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          q: "На что указывает ссылка, которую хранит переменная типа класса, и почему GC не путает поле int с указателем?",
          options: [
            "На заголовок объекта; GC проверяет каждое значение — похоже оно на адрес или нет",
            "На указатель Method Table; заголовок лежит перед этим адресом, а по GC descriptor из MT коллектор знает, какие слоты являются ссылками",
            "На первое поле объекта; типы полей GC узнаёт из рефлексии во время сборки",
            "На таблицу виртуальных методов в отдельной области; поля вообще не сканируются"
          ],
          answer: 1,
          explain: "Ссылка указывает на слот с указателем на Method Table (obj+0), заголовок — на obj-8, поля — с obj+8. Карта ссылочных слотов (GC descriptor) лежит в Method Table, поэтому сборщик точный и никогда не примет int за адрес."
        }
      },
      {
        id: "gc-4",
        title: "Когда GC запускается и как останавливает потоки",
        subtitle: "Не «когда память кончилась»",
        theory: `
<p>Самый частый неверный ответ на собеседовании: «GC запускается, когда заканчивается
память». Нет. Чаще всего он запускается, когда <b>исчерпан бюджет поколения</b> — а
свободная память при этом ещё есть.</p>
<p>У каждого поколения есть <b>бюджет</b>: сколько можно выделить (и сколько может выжить),
прежде чем это поколение имеет смысл собрать. Бюджет Gen0 динамический — от сотен килобайт
до десятков мегабайт, рантайм подбирает его сам.</p>
<p>Логика подбора красивая: если объекты умирают массово, бюджет можно увеличить — сборок
станет меньше, а каждая всё равно почти ничего не найдёт живого. Если же выживает много,
наоборот, лучше собрать пораньше, <b>пока мусор не продвинулся в Gen1 и Gen2</b>, откуда
его выковыривать дорого.</p>
<p>Что ещё может запустить сборку:</p>
<ul>
<li>превышен бюджет Gen0 — самая обычная, эфемерная сборка;</li>
<li>достигнуты пороги Gen1/Gen2 — более глубокая сборка;</li>
<li>явный <code>GC.Collect()</code> — «наведённая» сборка;</li>
<li>крупное выделение, которому не нашлось места — попробуем собрать, прежде чем падать
с OOM;</li>
<li>давление со стороны ОС или лимита контейнера — политика становится агрессивнее;</li>
<li>сильная фрагментация (особенно LOH) — может привести к уплотнению или более глубокой
сборке;</li>
<li><code>GC.AddMemoryPressure</code> — способ сказать: «за этой маленькой обёрткой стоит
100 МБ неуправляемой памяти, учитывай это».</li>
</ul>
<p>Влиять на поведение можно <b>режимом задержки</b> (<code>GCSettings.LatencyMode</code>):
<code>Interactive</code> — обычный, <code>LowLatency</code> и
<code>SustainedLowLatency</code> — временно откладывают сборки Gen2,
<code>Batch</code> — максимум пропускной способности. Ни один из них <b>не выключает
GC</b> — они лишь смещают приоритеты.</p>
<p>Теперь вторая половина уровня: <b>чтобы собрать мусор, надо остановить потоки</b>.
Причём остановить не где попало, а в <b>точке безопасности (safe point)</b> — месте, где
рантайм точно знает, где лежат все живые ссылки, и где поток может замереть без вреда.
JIT расставляет такие точки на вызовах методов и вставляет специальные проверки; даже
бесконечный цикл без вызовов обязан содержать такую проверку, иначе поток невозможно было бы
остановить.</p>
<p>Поток при этом находится в одном из двух режимов:</p>
<ul>
<li><b>cooperative</b> — выполняется управляемый код; поток обязан сам дойти до точки
безопасности, GC его ждёт;</li>
<li><b>preemptive</b> — поток ушёл в неуправляемый код или заблокирован; GC может работать
не дожидаясь его.</li>
</ul>
<p>Поэтому длинный вызов через P/Invoke <b>не тормозит</b> сборку: поток переключается в
preemptive. Опасно другое — некорректный интероп, который прячет управляемые ссылки от
рантайма.</p>
<p>Вся остановка выглядит так: <b>SuspendEE</b> (EE = Execution Engine, та часть CLR, что
исполняет управляемый код) → сборщик работает эксклюзивно → <b>RestartEE</b>. Фоновый GC
уменьшает <i>частоту</i> долгих остановок, но эфемерные сборки и часть фаз всё равно
останавливают потоки — просто ненадолго.</p>`,
        code: `// ── Смотрим на бюджеты и режимы ──
using System.Runtime;

// Режим задержки: смещает приоритет, но НЕ выключает GC
GCSettings.LatencyMode = GCLatencyMode.SustainedLowLatency;

// ── Почему GC.Collect() почти всегда вредна ──
void BadIdea()
{
    DoWork();
    GC.Collect();          // 1) сбивает подобранные бюджеты
                           // 2) продвигает ЖИВОЙ мусор в Gen1/Gen2,
                           //    откуда его убрать дороже
                           // 3) платит полную паузу там, где её не просили
}

// Законные исключения: замеры в бенчмарках, точка «приложение свернули
// и надолго уснуло», и уборка после разового огромного пика памяти.

// ── Честно рассказать GC про неуправляемую память ──
class NativeBuffer : IDisposable
{
    private IntPtr _ptr;
    private readonly long _bytes;

    public NativeBuffer(long bytes)
    {
        _bytes = bytes;
        _ptr = Marshal.AllocHGlobal((nint)bytes);
        GC.AddMemoryPressure(bytes);      // «эта мелкая обёртка держит МНОГО»
    }

    public void Dispose()
    {
        if (_ptr == IntPtr.Zero) return;
        Marshal.FreeHGlobal(_ptr);
        _ptr = IntPtr.Zero;
        GC.RemoveMemoryPressure(_bytes);  // обязательно парой
    }
}

// ── Как выглядит остановка потоков ──
//
//   потоки работают
//        │
//        ▼
//   SuspendEE ──► все управляемые потоки замерли в safe points
//        │
//        ▼
//   GC работает эксклюзивно (mark / plan / compact или sweep)
//        │
//        ▼
//   RestartEE ──► потоки поехали дальше
//
// cooperative  — выполняет управляемый код, GC ждёт safe point
// preemptive   — ушёл в native / заблокирован, GC его не ждёт`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>«GC может запуститься, даже если памяти вагон?»</b> Да, и это норма. Решение принимается
по бюджетам, статистике выживания и давлению — рантайм считает, что ждать дороже, чем
собрать сейчас.</p>
<p><b>Почему <code>GC.Collect()</code> вредит.</b> Он не только платит паузу — он ломает
статистику, на которой держится подбор бюджетов, и <b>продвигает</b> всё, что в этот момент
живо. Объект, который умер бы через миллисекунду в Gen0, уезжает в Gen1 или Gen2 и будет
ждать полной сборки. Отсюда классический анти-паттерн: «после обработки запроса зовём
GC.Collect для чистоты».</p>
<p><b>DATAS</b> (Dynamic Adaptation To Application Size) — современный механизм Server GC,
который подстраивает размер кучи и бюджет Gen0 под реальный объём живых данных. Особенно
важен в контейнерах, где Server GC раньше «съедал» память просто потому, что мог. В .NET 9
он включён по умолчанию для Server GC.</p>
<p><b>Про «stop the world».</b> Останавливаются <i>управляемые</i> потоки и только до
ближайшей точки безопасности. Поток, зависший в долгом native-вызове, не задерживает GC —
он в preemptive-режиме. А вот управляемый цикл, в который JIT почему-то не смог вставить
проверку, задержал бы всех: поэтому такие проверки — обязательная часть контракта.</p>
<p><b>Что реально уменьшает паузы:</b> меньше выделять (пулы, <code>Span</code>,
<code>struct</code>), меньше продвигать в Gen2, следить за размером живых данных. Настройки
LatencyMode — тонкая подстройка, а не лекарство.</p>`,
        links: [
          { label: "MS Learn — Наведённые сборки (Induced GC)", url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/induced" },
          { label: "MS Learn — Режимы задержки (Latency modes)", url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/latency" },
          { label: "MS Learn — Параметры конфигурации GC", url: "https://learn.microsoft.com/en-us/dotnet/core/runtime-config/garbage-collector" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          q: "Коллега вставил GC.Collect() в конец обработки каждого HTTP-запроса «чтобы память не росла». Что произойдёт?",
          options: [
            "Память будет стабильнее: мусор убирается сразу после запроса",
            "Ничего не изменится: GC всё равно игнорирует ручные вызовы",
            "Станет хуже: сборки сбивают подобранные бюджеты, платят лишние паузы и продвигают ещё живые объекты в Gen1/Gen2, откуда их убрать дороже",
            "Приложение упадёт: вызывать GC.Collect из рабочего потока запрещено"
          ],
          answer: 2,
          explain: "Наведённые сборки ломают статистику, на которой рантайм подбирает бюджеты, и продвигают всё, что в этот момент живо. Умерший бы в Gen0 объект уезжает в Gen2 и ждёт полной сборки."
        }
      },
      {
        id: "gc-5",
        title: "Mark → Plan → Compact или Sweep",
        subtitle: "Что происходит внутри паузы",
        theory: `
<p>Потоки остановлены. Дальше сборка идёт по фазам, и знать их порядок — обязательная
программа собеседования.</p>
<p><b>1. Mark (разметка).</b> Цель — вычислить множество достижимых объектов. Начинаем с
корней и идём по ссылкам, помечая каждый встреченный объект. Обход делается через
<b>явный стек пометок</b>, а не рекурсией: граф объектов может быть глубиной в миллионы, и
рекурсия просто взорвала бы системный стек.</p>
<p>Циклы тут не проблема: у объекта либо уже стоит бит пометки — и мы разворачиваемся,
либо не стоит — и мы идём дальше. Непривязанный к корням цикл <code>A ↔ B</code> просто
никогда не будет посещён, поэтому умрёт целиком.</p>
<p>Отдельная тонкость — <b>внутренние указатели</b>: <code>fixed</code>, <code>ref</code>-переменные
и закреплённые адреса могут указывать <i>внутрь</i> объекта. При разметке такой адрес
сначала отображают обратно на начало объекта и только потом ставят бит.</p>
<p><b>2. Plan (планирование).</b> Тут живёт самая частая ошибка: «SOH всегда уплотняется,
LOH всегда зачищается». На самом деле <b>решение принимается после разметки</b>. Планировщик
<i>симулирует</i> уплотнение — с учётом закреплённых объектов, которые двигать нельзя, —
считает, сколько памяти реально освободится, и решает: стоит игра свеч или нет.</p>
<p>Иногда уплотнение включают принудительно, минуя эвристику: если попросили явно
(<code>GC.Collect(..., compacting: true)</code>), если так велит конфигурация, если мы у
самого края OOM, если в эфемерном пространстве уже негде оставлять дырки или если система
сильно давит по памяти.</p>
<p>В остальных случаях работает эвристика по фрагментации, и у неё <b>два условия сразу</b>:
освобождаемого места должно быть достаточно и в <i>абсолютных байтах</i>, и в
<i>доле от размера поколения</i>. Ориентиры из CoreCLR: Gen0 — примерно 40 КБ и 50%,
Gen1 — 80 КБ и 50%, Gen2 — 200 КБ и 25%. То есть для Gen2: «освободится около четверти
поколения и это минимум ~200 КБ» → уплотняем. Пара мелких дырок в огромном Gen2 →
скорее всего просто зачистим.</p>
<p><b>3a. Путь уплотнения (compact).</b> Он состоит из трёх шагов: посчитать новые адреса,
<b>relocate</b> — переписать все ссылки (и в корнях, и в полях объектов) на новые адреса,
и <b>compact</b> — физически скопировать байты. Живые объекты съезжаются в начало, а
свободное место собирается одним куском в конце.</p>
<p><b>3b. Путь зачистки (sweep).</b> Никто никуда не двигается. Коллектор проходит по куче,
превращает непомеченные участки в свободные блоки и складывает их в <b>список свободных
блоков</b>; соседние дырки сливаются в одну. Следующее выделение сможет занять подходящую
дырку.</p>
<p>Зачистка дешевле (не копируем байты и не чиним ссылки), но оставляет дыры. Уплотнение
дороже, зато возвращает одну большую непрерывную область. Отсюда и правила по умолчанию:
LOH зачищается (двигать многомегабайтные массивы слишком дорого), а <b>фоновый GC Gen2
уплотнять не умеет в принципе</b> — он только размечает и зачищает.</p>`,
        code: `// ── Фаза 1: MARK. Обход через явный стек, а не рекурсией ──
//
//  Граф:  Root ──► Person ──► Address
//                    └──► Dog ──► Tag
//         Недостижим: Orphan
//
//  push Person
//  pop  Person → пометить → push Address, Dog
//  pop  Dog    → пометить → push Tag
//  ...
//  стек пуст → готово
//
//  Массив пометок:  P A D T O  →  1 1 1 1 0
//
//  Server GC размечает несколько куч параллельно, с перехватом работы
//  (work stealing) между GC-потоками.

// ── Фаза 2: PLAN решает, что делать дальше ──
//
//  mark_phase()
//  plan_phase()          // симулируем уплотнение, считаем выгоду
//     ├─ compact ──► relocate_phase() → compact_phase()
//     └─ sweep   ──► make_free_lists()
//
//  Эвристика (оба условия сразу):
//     фрагментация >= абсолютного порога
//     И доля       >= порога доли
//
//  Gen0 ≈ 40 КБ и 50%   Gen1 ≈ 80 КБ и 50%   Gen2 ≈ 200 КБ и 25%

// ── Фаза 3a: COMPACT — объекты переезжают, адреса меняются ──
//
//  было:  | A | дыра | B | дыра | C |
//  стало: | A | B | C |......................|
//
//  С закреплённым объектом переезд получается кривым:
//  | A | дыра | [PINNED] | дыра | B | C |
//               ▲ этот двигать нельзя

// ── Фаза 3b: SWEEP — никто не двигается, дыры идут в список свободных ──
//
//  после разметки:
//  | A(жив) | B(мёртв) | C(жив) | D(мёртв) | E(жив) |
//  |   1    |    0     |   1    |    0     |   1    |
//
//  после зачистки (адреса не изменились):
//  | A(жив) |  FREE    | C(жив) |  FREE    | E(жив) |
//                ▲ соседние дыры сливаются в одну
//
//  Список свободных: FREE(B) → FREE(D) → ...

// Попросить полную блокирующую сборку С уплотнением (диагностика, не прод):
GC.Collect(2, GCCollectionMode.Forced, blocking: true, compacting: true);`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>«Уплотняет ли GC кучу?»</b> Правильный ответ — «когда план решит, что это окупается».
SOH уплотняется часто, но при сильном закреплении может быть зачищен; LOH по умолчанию
зачищается, но умеет уплотняться по запросу; фоновая сборка Gen2 не уплотняет никогда.</p>
<p><b>Почему после уплотнения адреса объектов меняются</b> — и почему поэтому нельзя просто
сохранить сырой указатель и передать его в native-код. Нужен либо <code>fixed</code> на
короткий срок, либо закреплённый хэндл, либо буфер, выделенный сразу закреплённым.
Фаза relocate чинит ссылки в корнях и полях, но про указатель, который ты спрятал в
<code>IntPtr</code>, она ничего не знает.</p>
<p><b>Почему mark идёт через явный стек.</b> Кроме глубины есть ещё причина: явным стеком
удобно управлять — его можно разделить между потоками в Server GC и реализовать перехват
работы, когда один GC-поток закончил свою кучу раньше других.</p>
<p><b>Стоимость фаз разная.</b> Разметка стоит примерно как объём <i>живых</i> данных
(мёртвые бесплатны — их никто не посещает). Уплотнение стоит как объём копируемых байтов
плюс починка ссылок. Отсюда важное правило: <b>дорогая сборка — это сборка, где много
выжило</b>, а не та, где много мусора.</p>`,
        links: [
          { label: "Book of the Runtime — Garbage Collection Design", url: "https://github.com/dotnet/runtime/blob/main/docs/design/coreclr/botr/garbage-collection.md" },
          { label: "MS Learn — Основы сборки мусора (фазы)", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/fundamentals" },
          { label: "API — GC.Collect(int, GCCollectionMode, bool, bool)", url: "https://learn.microsoft.com/en-us/dotnet/api/system.gc.collect" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          q: "Что верно про выбор между уплотнением (compact) и зачисткой (sweep)?",
          options: [
            "SOH всегда уплотняется, LOH всегда зачищается — это зашито в рантайм",
            "Решение принимает фаза plan после разметки: она симулирует уплотнение и сравнивает выгоду с порогами по абсолютному размеру и доле свободного места",
            "Уплотнение включается только вручную через GC.Collect с compacting: true",
            "Выбор случайный, чтобы избежать предсказуемых пауз"
          ],
          answer: 1,
          explain: "После mark фаза plan симулирует уплотнение с учётом закреплённых объектов и решает по двум условиям сразу (абсолютные байты и доля от поколения). Плюс есть случаи принудительного уплотнения: явный запрос, край OOM, нехватка эфемерного места."
        }
      },
      {
        id: "gc-6",
        title: "Фрагментация",
        subtitle: "Байты есть, а положить некуда",
        theory: `
<p>Фрагментация — это когда <b>свободные байты в куче есть, но воспользоваться ими
нельзя</b>. В .NET важно различать три её вида, и на собеседовании это отличный
разделитель между «слышал про GC» и «понимаю GC».</p>
<p><b>1. Внутренняя фрагментация</b> — потери <i>внутри</i> уже выделенного места. Попросили
18 байт, а объект занял 24 из-за выравнивания. Эти 6 байт принадлежат объекту и никогда
не попадут ни в один список свободных блоков.</p>
<p>Откуда она берётся: выравнивание по размеру указателя, обязательный заголовок и указатель
на Method Table даже у крошечного типа, padding между полями структуры, а также маленькие
огрызки, остающиеся при разрезании большой свободной дырки на LOH.</p>
<p>Важно: <b>уплотнение внутреннюю фрагментацию не лечит</b> — объекту всё равно нужен его
выровненный размер. Это ровный небольшой налог, с которым живут.</p>
<p><b>2. Внешняя фрагментация</b> — свободные байты лежат <i>между</i> живыми объектами, но
ни одна дырка не достаточно велика. Классика: всего свободно 150 КБ, но самая большая дырка
80 КБ, а нужно 100 КБ подряд — и приходится либо запускать сборку, либо просить у системы
ещё памяти. По отчётам всё выглядит прекрасно («полно свободного»), а приложение растёт.</p>
<p>Вот её <b>уплотнение и лечит</b>: живые объекты съезжаются, свободное собирается одним
куском.</p>
<p><b>3. Фрагментация от закрепления (pin / plug)</b> — особый случай внешней. Закреплённый
объект нельзя двигать, поэтому при уплотнении он остаётся на месте «затычкой» (plug), а
вокруг него неизбежно образуются дыры, даже если коллектор очень хотел ровно всё
сдвинуть.</p>
<p>Пара коротких <code>fixed</code> — это нормально. А вот много долгоживущих закреплений
(высоконагруженный интероп, сетевые буферы, некоторые сериализаторы) <b>надолго портят
качество уплотнения SOH</b>: паузы Gen0/Gen1 растут, куча дырявится. Именно ради этого
случая и появилась отдельная куча POH — про неё будет свой уровень.</p>
<p>Как это выглядит в инструментах: трейсы показывают что-то вроде
<code>frag %</code> — доля свободных/фрагментированных байтов в поколении. Высокий процент
в Gen0 после закреплений — обычное дело и часто безвреден: это место тут же переиспользуется
под новые объекты. А вот <b>высокий процент в Gen2 или на LOH вместе с растущим рабочим
набором</b> — это тот самый случай, ради которого зовут уплотняющую сборку.</p>
<p>И главный производственный паттерн, который стоит запомнить дословно: <b>если Gen2 и LOH
огромные, объём продвинутых данных маленький, а фоновых сборок много — это чаще
фрагментация, а не утечка</b>. Проверяется одной блокирующей полной сборкой с уплотнением:
если память резко вернулась — это была фрагментация.</p>`,
        code: `// ── 1. Внутренняя: потери ВНУТРИ объекта ──
//
//  Нужно 18 байт → выделено 24 (выравнивание + служебные поля)
//  |###### полезные данные ######| pad |
//  |<---------- 24 байта -------------->|
//         ▲ эти байты принадлежат объекту, они не в списке свободных
//
//  Уплотнение это НЕ чинит.

// ── 2. Внешняя: дыры МЕЖДУ объектами ──
//
//  +-----+--------+-----+--------+-----+
//  |  A  | FREE   |  C  | FREE   |  E  |
//  |жив  | 40 КБ  |жив  | 80 КБ  |жив  |
//  +-----+--------+-----+--------+-----+
//  Свободно всего 120 КБ, но самая большая дыра — 80 КБ.
//  Запросили 100 КБ подряд → не влезает, хотя «свободно много».
//
//  После уплотнения:
//  | A | C | E |............ одна большая дыра ............|
//
//  Это уплотнение лечит.

// ── 3. От закрепления: дыры вокруг неподвижного объекта ──
//
//  хотели:    [A][B][C][D][ FREE ................ ]
//  получили:  [A][ FREE ][ PINNED ][ FREE ][B][C]
//                          ▲ затычка (plug), двигать нельзя
//
//  Лечится лишь частично: сама затычка остаётся на месте.

// Долгое закрепление на SOH — вот так делать не надо:
var handle = GCHandle.Alloc(buffer, GCHandleType.Pinned);  // живёт часами
// ...
handle.Free();

// Короткое закрепление — нормально:
fixed (byte* p = buffer)
{
    NativeCall(p);        // область видимости маленькая, GC потерпит
}

// Проверка «фрагментация или утечка?» — разово, в диагностике:
var before = GC.GetTotalMemory(false);
GCSettings.LargeObjectHeapCompactionMode =
    GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect(2, GCCollectionMode.Forced, blocking: true, compacting: true);
var after = GC.GetTotalMemory(true);
// резко упало → это была фрагментация, а не утечка`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>Быстрая шпаргалка.</b> Внутренняя — потери внутри слота объекта, уплотнением не
лечится. Внешняя — дыры между объектами, лечится уплотнением. От закрепления — вынужденные
дыры вокруг неподвижных объектов, лечится частично.</p>
<p><b>Кто оставляет дыры.</b> Уплотнение убирает почти все (кроме окрестностей затычек);
зачистка оставляет дыры и строит списки свободных блоков; фоновый Gen2 только зачищает,
поэтому <b>Gen2 и LOH могут оставаться фрагментированными очень долго</b>; LOH по умолчанию
зачищается — отсюда классическое «свободного полно, а места нет».</p>
<p><b>Почему на 64 битах это всё ещё больно.</b> Адресов хватает, но каждая дыра — это
закоммиченная память: растёт рабочий набор, растёт счёт за контейнер, срабатывают лимиты.
На 32 битах убивало именно адресное пространство, на 64 — коммит.</p>
<p><b>Как не доводить до этого.</b> Меньше долгих закреплений (буферы, которые обязаны быть
закреплены надолго, выделять сразу на POH); большие массивы брать из
<code>ArrayPool&lt;T&gt;</code>, а не создавать и выбрасывать; не хранить в Gen2 то, что
живёт один запрос.</p>`,
        links: [
          { label: "MS Learn — Куча больших объектов (фрагментация)", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/large-object-heap" },
          { label: "API — GCSettings.LargeObjectHeapCompactionMode", url: "https://learn.microsoft.com/en-us/dotnet/api/system.runtime.gcsettings.largeobjectheapcompactionmode" },
          { label: "MS Learn — ArrayPool&lt;T&gt;", url: "https://learn.microsoft.com/en-us/dotnet/api/system.buffers.arraypool-1" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          q: "В проде: Gen2 и LOH огромные, объём продвигаемых данных небольшой, фоновых сборок много, память растёт. Что это вероятнее всего и как проверить?",
          options: [
            "Утечка памяти; проверить, вызвав GC.Collect() в цикле",
            "Фрагментация (фоновый Gen2 только зачищает, LOH по умолчанию тоже); проверить блокирующей полной сборкой с уплотнением и CompactOnce для LOH",
            "Слишком маленький бюджет Gen0; увеличить его конфигурацией",
            "Внутренняя фрагментация из-за выравнивания; уменьшить размер объектов"
          ],
          answer: 1,
          explain: "Фоновая сборка Gen2 никогда не уплотняет, а LOH по умолчанию зачищается — поэтому дыры копятся. Если после разовой блокирующей уплотняющей сборки память резко падает, это была фрагментация, а не утечка."
        }
      },
      {
        id: "gc-7",
        title: "Card table и write barrier",
        subtitle: "Почему сборка Gen0 не читает весь Gen2",
        theory: `
<p>Поколения дают огромную экономию: собрал маленький Gen0 — и свободен. Но тут есть дыра
в рассуждении, и именно её любят найти на собеседовании.</p>
<p>Смотри: старый объект в Gen2 хранит ссылку на молодой объект в Gen0.</p>
<p><code>Gen2: Order ──► Gen0: OrderLine</code></p>
<p>Во время сборки Gen0 коллектор идёт только от корней и обходит только молодых. Про поле
внутри старого <code>Order</code> он ничего не знает — и, если ничего не предпринять,
решит, что <code>OrderLine</code> недостижим, и убьёт живой объект.</p>
<p>Первое, что приходит в голову, — просканировать весь Gen2 и поискать в нём ссылки на
молодых. Но Gen2 может быть многогигабайтным, а сборки Gen0 случаются постоянно. Такая
цена убила бы всю идею поколений.</p>
<p>Решение состоит из двух частей: <b>write barrier</b> и <b>card table</b>.</p>
<p><b>Write barrier</b> — маленький кусочек кода, который JIT вставляет <i>на каждую запись
ссылки в поле объекта</i>. Он делает две вещи: собственно записывает значение и, если
записанная ссылка указывает в эфемерную область, помечает соответствующий участок памяти
как «грязный».</p>
<p>Обрати внимание на важную деталь: помечается <b>не объект, а место записи</b> — тот
участок кучи, где физически лежит изменённое поле. Это и есть смысл «где-то в этом районе
кучи кто-то записал ссылку на молодого».</p>
<p><b>Card table</b> — это и есть карта таких пометок: маленький массив, где один байт
(«карта») описывает участок кучи размером примерно 2 КБ. Плюс существуют вспомогательные
структуры (brick tables), которые помогают быстро найти начало объекта внутри грязного
участка — ведь поле может лежать в середине большого объекта.</p>
<p>Теперь эфемерная сборка выглядит так:</p>
<ol>
<li>размечаем от обычных корней (стек, регистры, статики, хэндлы);</li>
<li>дополнительно сканируем <b>только грязные карты</b> в старом пространстве и на UOH,
ища в них ссылки на молодых;</li>
<li>найденные молодые объекты помечаем живыми (и идём по их ссылкам дальше);</li>
<li>сбрасываем карты.</li>
</ol>
<p>Разница в стоимости решающая: полный проход по Gen2 стоил бы как размер Gen2, а
сканирование грязных карт стоит как <i>объём того, что программа реально меняла</i>. Если
старые объекты никто не трогает, эфемерная сборка почти ничего не платит.</p>
<p>Точность тут намеренно грубая: одна карта покрывает 2 КБ, поэтому бывают ложные
срабатывания — карта грязная, а ссылок на молодых в ней уже нет. Это осознанный размен:
дешёвый барьер на записи важнее, чем идеально точная карта.</p>
<p>И маленькое, но полезное следствие для кода: барьер срабатывает <b>только на записи
ссылок</b>. Присваивание <code>int</code>, <code>double</code> или запись в массив чисел
барьера не требует — там ссылок нет и быть не может.</p>`,
        code: `// ── Проблема ──
//
//   Gen2: Order  ──────────►  Gen0: OrderLine
//
//   Сборка Gen0 идёт только от корней и молодых.
//   Как она увидит это ребро, не прочитав весь Gen2?

order.Lines = newLine;      // обычная строка кода на C#

// ── Что на самом деле сгенерирует JIT (упрощённо) ──
WriteBarrier(slot, value):
    *slot = value                                  // сама запись
    if (value указывает в эфемерную область):
        DirtyCard(CardIndex(addressof(slot)))      // помечаем МЕСТО ЗАПИСИ

// ── Card table: 1 карта ≈ 2 КБ кучи ──
//
//  Куча:  |--карта 0--|--карта 1--|--карта 2 (тут поле)--|--карта 3--|
//  Карты: |  чистая   |  чистая   |       ГРЯЗНАЯ        |  чистая   |

// ── Эфемерная сборка ──
//
//  1. mark от корней (стек, регистры, статики, хэндлы)
//  2. просканировать ГРЯЗНЫЕ карты в старом пространстве и UOH
//  3. пометить найденных молодых и пойти по их ссылкам
//  4. сбросить карты
//
//  полный скан Gen2   : O(размер Gen2)      ← непозволительно каждый Gen0
//  скан грязных карт  : O(грязное × карта)  ← платим по факту изменений

// ── Что барьер НЕ трогает ──
person.Age = 42;             // значение — барьер не нужен
numbers[i] = 3.14;           // массив чисел — ссылок нет
person.Address = address;    // ссылка — вот здесь барьер есть

// Практический вывод: «долгоживущий кэш, в который постоянно
// пишут свежие объекты» — это поток грязных карт и более дорогие
// эфемерные сборки. Иногда дешевле держать такой кэш иначе.`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>«Как GC узнаёт про ссылки из старого поколения в молодое?»</b> — это буквально
вопрос про card table и write barrier. Ответ в одну фразу: <i>JIT вставляет барьер на
запись ссылок, барьер помечает карту (≈2 КБ кучи) грязной, эфемерная сборка сканирует
только грязные карты вместо всего Gen2</i>. Без этого механизма поколенческий GC
невозможен.</p>
<p><b>Почему помечается слот, а не объект.</b> Сборщику нужно знать, <i>где искать</i>
ссылку, а не какой объект «виноват». Пометка по адресу записи позволяет потом
просканировать небольшой участок кучи и найти в нём все ссылки на молодых.</p>
<p><b>Ложные срабатывания.</b> Карта грубая (2 КБ), поэтому она может остаться грязной,
когда молодых ссылок там уже нет. Это дешевле, чем усложнять барьер: барьер выполняется
на каждой записи ссылки, а сканирование — раз в сборку.</p>
<p><b>Связь с фоновой сборкой.</b> Барьер участвует не только в поколенческой схеме: пока
фоновый GC размечает Gen2 конкурентно, программа продолжает менять ссылки, и барьер
следит, чтобы новые рёбра не потерялись. Без этого конкурентная разметка была бы неверной.</p>
<p><b>Что из этого следует для производительности.</b> Стоимость эфемерной сборки задают
четыре вещи: размер Gen0/Gen1, количество грязных карт, объём выживших (их надо копировать
и продвигать) и число закреплённых объектов в эфемерной области.</p>`,
        links: [
          { label: "Book of the Runtime — Garbage Collection Design", url: "https://github.com/dotnet/runtime/blob/main/docs/design/coreclr/botr/garbage-collection.md" },
          { label: "MS Learn — Основы сборки мусора", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/fundamentals" },
          { label: "MS Learn — Фоновая сборка мусора", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/background-gc" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          q: "Объект в Gen2 хранит ссылку на объект в Gen0. Как сборка Gen0 узнает, что молодой объект жив, не сканируя весь Gen2?",
          options: [
            "Никак: такие ссылки запрещены, при записи объект сразу продвигается в Gen0",
            "GC всё-таки сканирует весь Gen2, просто это быстро",
            "JIT вставляет write barrier на запись ссылки; барьер помечает карту (≈2 КБ кучи) грязной, и сборка Gen0 сканирует только грязные карты",
            "Молодой объект сам хранит счётчик ссылок из старых поколений"
          ],
          answer: 2,
          explain: "Это и есть механика card table. Барьер помечает участок кучи, где произошла запись, поэтому эфемерная сборка платит за реальные изменения, а не за размер Gen2."
        }
      },
      {
        id: "gc-8",
        title: "LOH, POH и FOH",
        subtitle: "Три кучи, которые живут не по правилам SOH",
        theory: `
<p>Кроме обычной кучи маленьких объектов (SOH) в .NET есть ещё несколько, и каждая появилась
из-за конкретной боли.</p>
<p><b>LOH — Large Object Heap.</b> Сюда попадает всё, чей полный размер не меньше
<b>85 000 байт</b> (порог настраивается через <code>GCLOHThreshold</code>). Причина проста:
копировать многомегабайтный массив при уплотнении слишком дорого, дешевле оставить его на
месте.</p>
<p>Отсюда все особенности LOH:</p>
<ul>
<li>выделение идёт через <b>список свободных блоков</b>, а не сдвигом указателя;</li>
<li>собирается <b>только вместе с Gen2</b> — сборка Gen0 или Gen1 к нему не прикоснётся;</li>
<li>по умолчанию <b>зачищается</b>, а не уплотняется;</li>
<li><code>GC.GetGeneration</code> для такого объекта вернёт 2.</li>
</ul>
<p>Практический вывод: пара больших массивов — не проблема. Проблема — <i>поток</i> больших
массивов: они выделяются, освобождаются, оставляют дыры разных размеров, и рано или поздно
куча выглядит так, что «свободно 900 КБ, а положить 850 КБ некуда». Лечение: брать большие
буферы из <code>ArrayPool&lt;T&gt;</code> и переиспользовать, а не создавать заново. При
необходимости можно один раз попросить уплотнение LOH через
<code>LargeObjectHeapCompactionMode.CompactOnce</code> — но это разовая тяжёлая операция,
а не режим на постоянку.</p>
<p><b>POH — Pinned Object Heap (с .NET 5).</b> Проблема, которую она решает, — из прошлого
уровня: закреплённый объект на SOH становится затычкой и портит уплотнение всей молодой
кучи. Решение элегантное: <b>выделить буфер сразу закреплённым, но в отдельной куче</b>,
чтобы закрепления не сидели внутри уплотняемой SOH.</p>
<p>Ключевая деталь, на которой ловят: <b>на POH попадает только то, что попросили закрепить
в момент выделения</b> — то есть <code>GC.AllocateArray&lt;T&gt;(n, pinned: true)</code>.
Обычные <code>fixed</code> и <code>GCHandleType.Pinned</code> закрепляют уже существующий
объект <i>на месте</i>, на SOH, и никуда его не переносят. POH собирается вместе с Gen2
(она часть UOH), не уплотняется — там закрепления и ожидаются, — а
<code>GC.GetGeneration</code> опять же вернёт 2.</p>
<p><b>FOH — Frozen Object Heap / frozen segments.</b> Бывают данные, которые живут ровно
столько же, сколько процесс, и никогда не меняются: предрассчитанные таблицы, литералы,
подготовленные заранее графы объектов в NativeAOT и ready-to-run образах. Держать их в
обычной куче — значит каждую полную сборку размечать то, что заведомо не умрёт, и,
возможно, зря его двигать.</p>
<p>Замороженные сегменты решают это радикально: такие объекты <b>никогда не собираются и
никогда не двигаются</b>. Обычные объекты кучи спокойно могут на них ссылаться. Но это не
свалка для любых иммутабельных DTO: обычный <code>record</code> по-прежнему живёт на
SOH — на FOH попадает то, что размещает туда сам рантайм или что явно зарегистрировано.</p>
<p>Короткая формула на память: <b>POH лечит фрагментацию от закреплений, FOH убирает
бессмысленную работу GC над данными, которые никогда не умрут.</b></p>`,
        code: `// ── LOH: порог 85 000 байт по полному размеру объекта ──
var a = new byte[80_000];      // SOH, Gen0
var b = new byte[85_000];      // LOH → GetGeneration вернёт 2

GC.Collect(0);                 // LOH не тронут: он собирается только с Gen2
GC.Collect(2);                 // вот теперь LOH зачищается

// Как выглядят дыры на LOH (по умолчанию только зачистка):
//
//  | 2 МБ | FREE 200К | 512К | FREE 700К | 1 МБ | FREE 100К |
//  Список свободных: 700К → 200К → 100К
//  Просим 600К → влезет, разрежет дырку 700К (останется огрызок)
//  Просим 850К → не влезет никуда, куча вырастет,
//                хотя суммарно свободно больше 850К

// Разово попросить уплотнение LOH (тяжёлая операция, для диагностики
// или для редкой точки «мы только что освободили гигабайты»):
GCSettings.LargeObjectHeapCompactionMode =
    GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect(2, GCCollectionMode.Forced, blocking: true, compacting: true);

// Правильный способ не мучить LOH — переиспользовать буферы:
byte[] buffer = ArrayPool<byte>.Shared.Rent(100_000);
try     { Process(buffer); }
finally { ArrayPool<byte>.Shared.Return(buffer); }

// ── POH: закрепление в момент выделения ──
byte[] pinned = GC.AllocateArray<byte>(4096, pinned: true);   // сразу на POH

// А вот это НЕ переносит объект на POH — закрепляет на месте, на SOH:
var h = GCHandle.Alloc(existingBuffer, GCHandleType.Pinned);
h.Free();

//  Без POH:  SOH: [obj][PINNED][obj][ вынужденная дыра ][obj]
//  С POH:    SOH: [obj][obj][obj]...      ← уплотняется нормально
//            POH: [pinned][pinned]...     ← закрепления живут отдельно

// ── FOH: бессмертные и неподвижные данные ──
// Размещает туда рантайм (NativeAOT, ready-to-run, литералы и т.п.).
// Обычный record или immutable-класс на FOH сам по себе НЕ попадает.`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>«LOH вообще не собирается?»</b> Собирается — вместе с Gen2. Не собирается он при
эфемерных сборках, и по умолчанию не <i>уплотняется</i>. Отсюда и живёт миф.</p>
<p><b>Почему порог именно по полному размеру.</b> Сравнивается размер объекта целиком —
с заголовком, указателем на MT и длиной массива, — а не количество элементов. Поэтому
<code>byte[84_990]</code> уже может оказаться на LOH.</p>
<p><b>Историческая деталь:</b> в старом 32-битном CLR массивы <code>double</code> от 1000
элементов уходили на LOH раньше порога — из-за требований к выравниванию. В современном
.NET на это полагаться не нужно, но вопрос иногда всплывает.</p>
<p><b>Все ли закрепления попадают на POH?</b> Нет — только закрепление <i>в момент
выделения</i> (<code>GC.AllocateArray</code> с <code>pinned: true</code>).
<code>fixed</code> и <code>GCHandleType.Pinned</code> закрепляют существующий объект там,
где он лежит. Практическое правило: короткий <code>fixed</code> — нормально; буфер, который
обязан быть закреплён надолго, надо сразу выделять на POH.</p>
<p><b>UOH = LOH + POH.</b> Важное отличие от Gen2 на SOH: в UOH пользовательский код
выделяет объекты <i>напрямую</i>, а в Gen2 объекты только продвигаются. Именно поэтому
свежесозданный большой массив «уже старый» и ждёт полной сборки.</p>`,
        links: [
          { label: "MS Learn — Куча больших объектов (LOH)", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/large-object-heap" },
          { label: "API — GC.AllocateArray (pinned)", url: "https://learn.microsoft.com/en-us/dotnet/api/system.gc.allocatearray" },
          { label: "MS Learn — ArrayPool", url: "https://learn.microsoft.com/en-us/dotnet/api/system.buffers.arraypool-1" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          kind: "write",
          q: "Тебе нужен буфер на 4096 байт для интеропа, и он должен быть закреплён <b>всё время жизни</b>. Выдели его так, чтобы он сразу попал на POH и не портил уплотнение SOH.",
          placeholder: "byte[] buffer = ...",
          must: ["gc.allocatearray<byte>", "4096", "pinned:true"],
          solution: `byte[] buffer = GC.AllocateArray<byte>(4096, pinned: true);

// Почему не так:
// var h = GCHandle.Alloc(new byte[4096], GCHandleType.Pinned);
// — этот массив сначала родится на SOH и останется там затычкой,
//   портя уплотнение молодых поколений всё время, пока закреплён.`,
          explain: "На POH попадает только то, что попросили закрепить в момент выделения. fixed и GCHandleType.Pinned закрепляют уже существующий объект на месте, то есть на SOH."
        }
      },
      {
        id: "gc-9",
        title: "Финализация и Dispose",
        subtitle: "Почему ~MyClass() — это не деструктор",
        theory: `
<p>У класса в C# можно написать <code>~MyClass()</code>, и это выглядит как деструктор из
C++. Это ловушка: <b>финализатор недетерминирован</b>. Ты не знаешь, когда он выполнится,
в каком потоке и выполнится ли вообще.</p>
<p>Вот полный путь финализируемого объекта:</p>
<ol>
<li>объект с финализатором создан → рантайм записывает его в <b>очередь финализации</b>;</li>
<li>программа теряет на него все ссылки — по обычным правилам он мусор;</li>
<li>но GC видит, что финализатор ещё не выполнялся: он <b>оставляет объект живым</b> и
переносит его в очередь «готовых к финализации» (f-reachable);</li>
<li>отдельный <b>поток финализации</b> когда-то потом вызывает <code>~MyClass()</code>;</li>
<li>и только <b>следующая</b> сборка сможет наконец освободить память.</li>
</ol>
<p>Из этой схемы прямо следуют все проблемы финализаторов:</p>
<ul>
<li><b>Объект живёт минимум на одну сборку дольше</b> — а значит, скорее всего, продвинется
в Gen1/Gen2, где его уборка стоит дороже.</li>
<li><b>Живёт не только он</b>: всё, на что он ссылается, тоже держится живым.</li>
<li><b>Поток финализации один</b>: если чей-то финализатор завис на блокировке или сетевом
вызове, финализация всего процесса встала, а память не возвращается.</li>
<li><b>Порядок не гарантирован</b>: нельзя рассчитывать, что объекты финализируются в
каком-то разумном порядке — тот, на кого ты ссылаешься, может быть уже финализирован.</li>
</ul>
<p>Поэтому правильный способ освобождать ресурсы — <b>детерминированный</b>:
<code>IDisposable</code> и <code>using</code>. Ты сам решаешь, где ресурс освобождается,
и это происходит немедленно.</p>
<p>Схема, которую стоит запомнить целиком:</p>
<ul>
<li>для работы с ресурсами ОС (файлы, сокеты, хэндлы) используем
<b><code>SafeHandle</code></b> — он уже правильно написан и сам умеет корректно
финализироваться;</li>
<li>наш класс реализует <code>IDisposable</code> и в <code>Dispose()</code> освобождает
вложенные ресурсы;</li>
<li>в конце <code>Dispose()</code> вызываем <b><code>GC.SuppressFinalize(this)</code></b> —
это говорит рантайму «финализатор больше не нужен, вычеркни меня из очереди», и объект
уходит за одну сборку, а не за две;</li>
<li>свой финализатор пишем <b>только</b> если класс напрямую держит неуправляемый ресурс,
и то как страховку на случай, если <code>Dispose</code> забыли позвать.</li>
</ul>
<p>Ещё одна вещь, которую любят спросить: <b>воскрешение (resurrection)</b>. Если внутри
финализатора записать <code>this</code> в статическое поле, объект снова становится
достижимым и оживает. Память не освобождается, а финализатор повторно вызван <i>не будет</i>
(если только явно не позвать <code>GC.ReRegisterForFinalize</code>). Это учебный
анти-паттерн — знать надо, писать не надо.</p>`,
        code: `// ── Путь финализируемого объекта ──
//
//  создан (есть финализатор) → попал в очередь финализации
//        │
//        ▼
//  все ссылки потеряны → по обычным правилам мусор
//        │
//        ▼
//  GC оставляет живым и ставит в f-reachable очередь
//        │
//        ▼
//  поток финализации вызывает ~MyClass()
//        │
//        ▼
//  СЛЕДУЮЩАЯ сборка освобождает память

// ── Как делать правильно: SafeHandle + Dispose + SuppressFinalize ──
public sealed class FileReader : IDisposable
{
    private readonly SafeFileHandle _handle;   // сам умеет освобождаться
    private bool _disposed;

    public FileReader(string path)
        => _handle = File.OpenHandle(path);

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;

        _handle.Dispose();          // детерминированно, прямо здесь
        GC.SuppressFinalize(this);  // финализатор не нужен → уйдём за 1 сборку
    }
}

// Пользуемся так — освобождение гарантировано даже при исключении:
using (var reader = new FileReader("data.bin"))
{
    Process(reader);
}

// ── Свой финализатор — только если держим неуправляемое напрямую ──
public class NativeResource : IDisposable
{
    private IntPtr _ptr = Marshal.AllocHGlobal(1024);

    public void Dispose()
    {
        Free();
        GC.SuppressFinalize(this);
    }

    ~NativeResource() => Free();     // страховка, если Dispose забыли

    private void Free()
    {
        if (_ptr == IntPtr.Zero) return;
        Marshal.FreeHGlobal(_ptr);
        _ptr = IntPtr.Zero;
    }
}

// ── Анти-паттерн: воскрешение ──
~Zombie()
{
    Registry.Instance = this;   // объект снова достижим и живёт дальше
}
// Память не освободилась, а финализатор второй раз сам не вызовется.`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>«Чем финализатор отличается от деструктора C++?»</b> Деструктор детерминирован и
вызывается ровно там, где объект уничтожается. Финализатор вызывается когда-нибудь, другим
потоком, в непредсказуемом порядке, а при завершении процесса может не вызваться вовсе.
Единственный детерминированный механизм в .NET — это <code>Dispose</code>.</p>
<p><b>Почему <code>SuppressFinalize</code> так важен.</b> Без него объект, у которого
ресурсы уже освобождены, всё равно проедет полный маршрут: лишняя сборка, лишний проход
потока финализации, лишнее продвижение в старшее поколение. Одна строка экономит целый
цикл жизни.</p>
<p><b>Почему <code>SafeHandle</code> лучше своего финализатора.</b> Он критически финализируем,
корректно работает при выгрузке и в гонках, защищает от преждевременного освобождения хэндла
во время native-вызова (проблема «handle recycling»). Своя ручная реализация всё это обычно
не учитывает.</p>
<p><b>Куда девать асинхронную очистку.</b> Если ресурс освобождается асинхронно (сетевые
соединения, потоки с буферами), есть <code>IAsyncDisposable</code> и
<code>await using</code>. Делать асинхронную работу в финализаторе нельзя.</p>
<p><b>Итог одной фразой:</b> финализатор — это страховка на случай чужой ошибки, а не
способ управлять ресурсами. Управляет ресурсами <code>Dispose</code>.</p>`,
        links: [
          { label: "MS Learn — Реализация Dispose", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/implementing-dispose" },
          { label: "MS Learn — Очистка неуправляемых ресурсов", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/unmanaged" },
          { label: "MS Learn — Финализаторы в C#", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/finalizers" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          kind: "write",
          q: "У класса есть поле <code>SafeFileHandle _handle</code> и финализатор на всякий случай. Напиши <code>Dispose()</code>: освободи хэндл и скажи рантайму, что финализатор для этого объекта больше не нужен.",
          placeholder: "public void Dispose()\n{\n    ...\n}",
          must: ["gc.suppressfinalize(this)"],
          solution: `public void Dispose()
{
    if (_disposed) return;
    _disposed = true;

    _handle.Dispose();          // освобождаем детерминированно
    GC.SuppressFinalize(this);  // вычёркиваем себя из очереди финализации
}`,
          explain: "GC.SuppressFinalize(this) убирает объект из очереди финализации. Без него объект прожил бы лишнюю сборку, лишний раз продвинулся бы в старшее поколение и зря занял поток финализации."
        }
      },
      {
        id: "gc-10",
        title: "Workstation, Server, Background GC и диагностика",
        subtitle: "Как это настраивают и как смотрят в проде",
        theory: `
<p>Один и тот же сборщик работает в разных режимах, и от выбора режима зависит поведение
приложения куда сильнее, чем от любых микрооптимизаций кода.</p>
<p><b>Workstation GC</b> — куча обычно одна, приоритет у отзывчивости, работа сборки часто
выполняется прямо на том потоке, который её спровоцировал, базовое потребление памяти
скромное. Это разумный выбор для десктопа и для маленьких сервисов в тесных контейнерах.</p>
<p><b>Server GC</b> — куч много (грубо говоря, по числу ядер), у каждой свой эфемерный
сегмент, и есть <b>выделенные GC-потоки</b>, которые размечают и уплотняют параллельно.
Приоритет у пропускной способности. Плата — больше памяти и более заметные единичные паузы.
ASP.NET-хостинг часто включает Server GC сам, так что перед разговором «у нас Workstation»
стоит проверить конфигурацию.</p>
<p><b>Background GC</b> — это не третий режим, а способ выполнять сборку Gen2. Разметка
Gen2 идёт <b>конкурентно</b>, пока приложение работает. Ключевые факты, которые надо знать
дословно:</p>
<ul>
<li>фоновая сборка Gen2 <b>размечает и зачищает, но никогда не уплотняет</b>;</li>
<li>пока она идёт, эфемерные сборки Gen0/Gen1 могут случаться как обычно — их называют
<b>foreground</b>-сборками, и они коротко останавливают потоки;</li>
<li>значит, «у нас включён BGC» не означает «у нас нет пауз» — оно означает «у нас реже
случаются <i>длинные</i> паузы».</li>
</ul>
<p>Отсюда, кстати, следствие, которое мы уже видели: раз фоновый Gen2 не уплотняет, старая
куча и LOH могут долго оставаться дырявыми.</p>
<p>Теперь <b>диагностика</b>. Гадать про GC бессмысленно — на него смотрят
инструментами:</p>
<ul>
<li><code>dotnet-counters</code> — живые счётчики: скорость выделения, размер кучи,
количество сборок по поколениям, доля времени в GC, размер LOH;</li>
<li><code>dotnet-trace</code> и PerfView — по каждой сборке: причина, какое поколение
собирали, длительность паузы, фоновая она или блокирующая, сколько выжило;</li>
<li><code>dotnet-gcdump</code> — снимок управляемой кучи: кто занимает память и кто его
держит;</li>
<li>SOS в отладчике — <code>!eeheap -gc</code>, <code>!dumpheap -stat</code>,
<code>!gcroot</code>, <code>!gchandles</code>.</li>
</ul>
<p>Глядя на каждую сборку в трейсе, полезно задавать пять вопросов: <b>причина? какое
поколение собрали (2 — значит и UOH)? фоновая или блокирующая? уплотняла? сколько
выжило?</b></p>
<p>И как это читать: частые сборки Gen0 с крошечными паузами — обычно здоровая жизнь
приложения, ничего чинить не надо. А вот <b>частые сборки Gen2 при растущей куче и малом
объёме выживших</b> — повод искать кэши, лишние ссылки, дыры на LOH и закрепления.</p>
<p>Напоследок — мифы, которые почти дословно повторяются на собеседованиях:</p>
<ul>
<li>«GC освободит память, как только я закончил работать с объектом» — нет, только на
сборке и только по достижимости;</li>
<li>«поколение — это возраст в секундах» — нет, это число пережитых сборок;</li>
<li>«Gen2 — это навсегда» — нет, он собирается при полных сборках;</li>
<li>«LOH никогда не собирается» — собирается вместе с Gen2, просто обычно не уплотняется;</li>
<li>«фоновая сборка держит Gen2 в порядке» — она не уплотняет;</li>
<li>«все закрепления уезжают на POH» — только закрепление при выделении;</li>
<li>«<code>list.Clear()</code> освобождает элементы» — он лишь роняет ссылки;</li>
<li>«Server GC всегда лучше» — это размен пропускной способности на память и задержки.</li>
</ul>`,
        code: `<!-- ── Включаем режимы в csproj ── -->
<PropertyGroup>
  <ServerGarbageCollection>true</ServerGarbageCollection>
  <ConcurrentGarbageCollection>true</ConcurrentGarbageCollection>
</PropertyGroup>

// ── То же самое в runtimeconfig.json ──
{
  "runtimeOptions": {
    "configProperties": {
      "System.GC.Server": true,
      "System.GC.Concurrent": true
    }
  }
}

// ── Или переменной окружения (удобно сравнить два прогона) ──
// DOTNET_gcServer=1
// DOTNET_gcServer=0 dotnet run

// ── Проверить из кода, что реально включено ──
Console.WriteLine(GCSettings.IsServerGC);          // True / False
Console.WriteLine(GCSettings.LatencyMode);         // текущий режим задержки
Console.WriteLine(GC.CollectionCount(0));          // сколько было сборок Gen0
Console.WriteLine(GC.GetTotalMemory(false));       // байты в управляемой куче

// ── Server GC: несколько куч и свои GC-потоки ──
//
//  Heap0        Heap1        Heap2
//  [SOH+UOH]    [SOH+UOH]    [SOH+UOH]
//     ▲            ▲            ▲
//   поток        поток        поток   (+ балансировка нагрузки)
//  после SuspendEE GC-потоки размечают и уплотняют параллельно

// ── Background GC на таймлайне ──
//
//  ВРЕМЯ ────────────────────────────────────────────►
//  App   ██████ выделяет Gen0/Gen1 ███████████████████
//  EE    █пауза█                    █пауза█
//  BGC        ==== конкурентная разметка ====  ==sweep==
//             (БЕЗ УПЛОТНЕНИЯ — только списки свободных)
//
//  Если Gen0 переполнился посреди BGC:
//    → короткая foreground-сборка Gen0/Gen1
//    → BGC продолжается дальше

// ── Смотрим живые счётчики ──
// dotnet-counters monitor System.Runtime -p <pid>
//   Allocation Rate, GC Heap Size, Gen 0/1/2 Collections,
//   % Time in GC, LOH Size`,
        deep: `<p><b>Глубже (спросят на собесе):</b></p>
<p><b>«Что выбрать — Workstation или Server?»</b> Правильный ответ — «зависит и измеряется».
Server GC даёт пропускную способность на многоядерной машине с приличным запасом памяти.
В тесном контейнере он раньше легко съедал лимит: куч много, каждая со своим бюджетом.
Современный ответ на эту проблему — <b>DATAS</b>, который подстраивает размер кучи под
объём живых данных; в .NET 9 он включён для Server GC по умолчанию.</p>
<p><b>Блокирующая, фоновая, foreground — три разных слова.</b> Блокирующая сборка держит
потоки остановленными и может уплотнять. Фоновая — это конкурентная разметка и зачистка
Gen2 без уплотнения. Foreground — обычная эфемерная сборка, случившаяся <i>во время</i>
фоновой. Путаница между ними — самый частый провал в вопросе «как работает BGC».</p>
<p><b>Как отличить утечку от фрагментации по цифрам.</b> Утечка: растёт объём выживших
данных, gcdump показывает всё больше живых объектов одного типа, <code>!gcroot</code>
находит держателя. Фрагментация: живых данных мало, а куча и LOH большие, много фоновых
сборок, и разовая блокирующая уплотняющая сборка резко возвращает память.</p>
<p><b>Итоговая модель в шести пунктах:</b> (1) жизнь определяется точной трассировкой от
корней; (2) публичных поколений три, и основную работу делает Gen0; (3) write barrier и
card table делают эфемерную сборку дешёвой; (4) фаза plan выбирает уплотнение или зачистку,
а фоновый Gen2 не уплотняет никогда; (5) LOH и POH — это UOH, собираются с Gen2, а не с
Gen0; (6) для ресурсов используем <code>Dispose</code> и <code>SafeHandle</code>, а не
финализаторы.</p>`,
        links: [
          { label: "MS Learn — Workstation и Server GC", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/workstation-server-gc" },
          { label: "MS Learn — Фоновая сборка мусора", url: "https://learn.microsoft.com/ru-ru/dotnet/standard/garbage-collection/background-gc" },
          { label: "MS Learn — dotnet-counters", url: "https://learn.microsoft.com/ru-ru/dotnet/core/diagnostics/dotnet-counters" },
          { label: "MS Learn — dotnet-gcdump", url: "https://learn.microsoft.com/ru-ru/dotnet/core/diagnostics/dotnet-gcdump" },
          { label: "Лекция (PDF) — .NET GC Internals", url: "attachments/dotnet-gc.pdf" }
        ],
        task: {
          q: "В приложении включён Background GC. Какое утверждение верно?",
          options: [
            "Пауз больше нет: вся сборка идёт параллельно приложению",
            "Фоновая сборка Gen2 размечает и зачищает конкурентно, но не уплотняет; эфемерные сборки Gen0/Gen1 при этом всё равно коротко останавливают потоки",
            "Background GC работает только вместе с Workstation GC",
            "Фоновая сборка уплотняет Gen2 и поэтому убирает фрагментацию LOH"
          ],
          answer: 1,
          explain: "BGC уменьшает частоту ДЛИННЫХ пауз, а не убирает паузы вообще: эфемерные (foreground) сборки продолжаются. И он никогда не уплотняет — поэтому Gen2 и LOH могут долго оставаться фрагментированными."
        }
      }
    ]
  },
];

// Порядок миров на сайте (по id). Меняй здесь — контент трогать не нужно.
const WORLD_ORDER = [
  "oop",           // ООП: объекты и связи
  "dsa",           // Структуры данных и алгоритмы
  "enumerables",   // Инумерабл
  "delegates",     // Делегаты и события
  "generics",      // Дженерики
  "variance",      // Вариантность (ковариантность/контравариантность)
  "filestream",    // FileStream I/O
  "creational",    // Паттерны — порождающие
  "structural",    // Паттерны — структурные
  "behavioral",    // Паттерны — поведенческие
  "assemblies",    // Namespaces, сборки и NuGet
  "reflection",    // Reflection — чтение метаданных в рантайме
  "gc",           // Сборка мусора: куча, поколения, mark/compact/sweep
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
