/* =====================================================================
   C# Deep Dive — content (English)
   Mirror of data.js with the same world/level ids, translated to English.
   Wrapped in an IIFE so it can share the page with the Russian data.js.
   ===================================================================== */
(function () {
const WORLDS = [
  {
    id: "generics",
    name: "Generics",
    icon: "◆",
    blurb: "Code that works with any type — without giving up safety.",
    levels: [
      {
        id: "gen-1",
        title: "What a generic is",
        subtitle: "One box for any contents",
        theory: `
<p>Picture a box. An ordinary box has a label: "apples only". If you need a box
for books, you have to build a brand new, separate one. Boring, and it duplicates work.</p>
<p>A <b>generic</b> is a box with no fixed label. You tell it the type <i>at the moment you
use it</i>: "right now you're for apples", "and now you're for books". One piece of code — any type.</p>
<p>The letter <code>T</code> (for <i>Type</i>) is a placeholder. The compiler swaps it for the
real type you name. <code>List&lt;int&gt;</code> is a list of numbers,
<code>List&lt;string&gt;</code> is a list of strings. And the <code>List&lt;T&gt;</code> class was written
just once.</p>`,
        code: `// T is a placeholder for a future type
public class Box<T>
{
    private T _item;
    public void Put(T item) => _item = item;
    public T Get() => _item;
}

var apples = new Box<int>();   // now T = int
apples.Put(5);
int a = apples.Get();          // we get an int back, no casting

var names = new Box<string>(); // same class, now T = string
names.Put("Anna");`,
        deep: `<p><b>Deeper:</b> before generics, C# put everything into <code>object</code>. But then
a number turned into an <code>object</code> (this is called <i>boxing</i> — extra work and
extra garbage in memory), and when taking it out you had to cast it back by hand and risk an
error while the program was running. Generics give you <b>type safety at compile time</b>
and remove the boxing.</p>`,
        links: [
          { label: "MS Docs — Generics", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics" },
          { label: "Book: C# in Depth (Jon Skeet), the generics chapter", url: "https://csharpindepth.com/" }
        ],
        task: {
          q: "Why use List&lt;T&gt; instead of storing everything in a list of object?",
          options: [
            "To make the code look prettier",
            "To catch type errors at compile time and avoid boxing",
            "To make the program slower but more reliable",
            "Generics are only for numbers"
          ],
          answer: 1,
          explain: "A generic checks types before the program even runs, and it doesn't box value types into object — that's both safer and faster."
        }
      },
      {
        id: "gen-2",
        title: "Generic methods",
        subtitle: "Not the whole class — just one method",
        theory: `
<p>Sometimes you don't need to make the whole class generic — one method is enough. A method
can have its own type placeholder too.</p>
<p>The nice part is that the compiler often <b>figures out on its own</b> which type you passed —
this is called <i>type inference</i>. You don't need to write
<code>Swap&lt;int&gt;</code>; <code>Swap(x, y)</code> is enough.</p>`,
        code: `// <T> sits on the method, not on the class
static void Swap<T>(ref T x, ref T y)
{
    T temp = x;
    x = y;
    y = temp;
}

int p = 1, q = 2;
Swap(ref p, ref q);   // the compiler worked out: T = int
// p == 2, q == 1

string s1 = "a", s2 = "b";
Swap(ref s1, ref s2); // same method, T = string`,
        deep: `<p><b>Deeper:</b> type inference works from the <i>arguments</i>, not from the return
value. If the type can't be worked out from the arguments, you have to state it explicitly:
<code>Create&lt;User&gt;()</code>.</p>`,
        links: [
          { label: "MS Docs — Generic Methods", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generic-methods" }
        ],
        task: {
          q: "Why can you usually write Swap(ref a, ref b) instead of Swap&lt;int&gt;(ref a, ref b)?",
          options: [
            "You can't — the type must always be stated",
            "The compiler infers T from the types of the arguments you passed",
            "int is the default type for every method",
            "Generic methods ignore types"
          ],
          answer: 1,
          explain: "That's type inference: the compiler looks at the arguments and fills in T for you."
        }
      },
      {
        id: "gen-3",
        title: "Constraints",
        subtitle: "\"T, but not quite anything\"",
        theory: `
<p>Sometimes "any type" is too much. For example, a method wants to call <code>CompareTo</code>
on <code>T</code>. But not every type has it. You need to <b>promise the compiler</b> that
<code>T</code> has the features you need.</p>
<p>The word <code>where</code> does that. It sets conditions on <code>T</code>:</p>
<ul>
<li><code>where T : class</code> — reference types only</li>
<li><code>where T : struct</code> — value types only</li>
<li><code>where T : IComparable&lt;T&gt;</code> — T must be comparable</li>
<li><code>where T : new()</code> — T has a parameterless constructor (so you can write <code>new T()</code>)</li>
</ul>`,
        code: `// T must be able to compare itself with its own kind
static T Max<T>(T a, T b) where T : IComparable<T>
{
    // now CompareTo is available — the compiler knows it exists
    return a.CompareTo(b) >= 0 ? a : b;
}

int big = Max(3, 9);          // 9
string later = Max("a", "z"); // "z"`,
        deep: `<p><b>Deeper:</b> without a constraint the compiler treats <code>T</code> as plain
<code>object</code> and won't let you call <code>CompareTo</code>. A constraint opens access to
the members of the interface or base class, and it also documents your intent: "only comparable
types belong here".</p>`,
        links: [
          { label: "MS Docs — Constraints on type parameters", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters" }
        ],
        task: {
          q: "What does the constraint where T : IComparable&lt;T&gt; give you?",
          options: [
            "It forbids using the method at all",
            "It allows passing only null",
            "It guarantees that T has CompareTo, and lets you call it",
            "It makes comparison twice as fast"
          ],
          answer: 2,
          explain: "The constraint promises the compiler that the interface member is there — and then you can call it inside the method."
        }
      }
    ]
  },
  {
    id: "variance",
    name: "Variance",
    icon: "⇅",
    blurb: "Covariance, contravariance — when IEnumerable<Cat> «fits» where IEnumerable<Animal> is expected.",
    levels: [
      {
        id: "var-1",
        title: "The compatibility problem",
        subtitle: "A cat is an animal. But is a list of cats a list of animals?",
        theory: `
<p>A Cat (<code>Cat</code>) inherits from Animal (<code>Animal</code>). So you can put a cat
anywhere an animal is expected. Makes sense.</p>
<p>But here is the catch: is <code>List&lt;Cat&gt;</code> the same thing as
<code>List&lt;Animal&gt;</code>? <b>No!</b> And that is not a bug. If a list of cats counted as
a list of animals, someone could add a dog to it — and everything would break.</p>
<p>By default generic types are <b>invariant</b>: <code>List&lt;Cat&gt;</code> and
<code>List&lt;Animal&gt;</code> are different, incompatible types. Variance is the set of rules
that removes this wall in the <i>safe</i> cases.</p>`,
        code: `class Animal { }
class Cat : Animal { }

Animal a = new Cat();          // OK: a cat is an animal

List<Cat> cats = new();
// List<Animal> animals = cats; // COMPILE ERROR — invariance
// otherwise you could do: animals.Add(new Dog()); — disaster`,
        deep: `<p><b>Deeper:</b> variance only works with <b>interfaces and delegates</b>,
not with classes like <code>List&lt;T&gt;</code>. And only with <b>reference</b> types. Next
we will look at the two safe cases: reading (out) and writing (in).</p>`,
        links: [
          { label: "MS Docs — Variance in Generics", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance" }
        ],
        task: {
          q: "Why can't List&lt;Cat&gt; be assigned to a List&lt;Animal&gt; variable?",
          options: [
            "Because Cat does not inherit from Animal",
            "Otherwise you could add, say, a dog to a list of cats",
            "It is allowed, the compiler is wrong",
            "List does not support inheritance at all"
          ],
          answer: 1,
          explain: "List is mutable: allowing that assignment would open the door to writing in a foreign type. Hence — invariance."
        }
      },
      {
        id: "var-2",
        title: "Covariance (out)",
        subtitle: "If we only read, we can widen the type",
        theory: `
<p>What if you can only <b>take things out</b> of a collection, never put them in? Then there is
no danger: if we are just reading cats as animals, everything is safe.</p>
<p>That is exactly why <code>IEnumerable&lt;out T&gt;</code> is marked with the word
<code>out</code>. It means: «T only goes out». Such an interface is <b>covariant</b> — you can
assign <code>IEnumerable&lt;Cat&gt;</code> to an <code>IEnumerable&lt;Animal&gt;</code> variable.</p>
<p>Handy rule: <code>out</code> → the type «moves up» the inheritance chain (Cat → Animal).</p>`,
        code: `IEnumerable<Cat> cats = new List<Cat> { new Cat(), new Cat() };

// WORKS: IEnumerable is covariant (out T)
IEnumerable<Animal> animals = cats;

foreach (Animal x in animals) { /* we only read — safe */ }

// The definition in .NET:
// public interface IEnumerable<out T> : IEnumerable { ... }`,
        deep: `<p><b>Deeper:</b> <code>out</code> is allowed only if <code>T</code>
appears exclusively in <i>output</i> positions (return values, get properties). The moment
<code>T</code> shows up as a method argument, the compiler forbids <code>out</code>, because
that would open the door to writing.</p>`,
        links: [
          { label: "MS Docs — Covariance (out)", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance#covariance" }
        ],
        task: {
          q: "Why can IEnumerable&lt;Cat&gt; be assigned to IEnumerable&lt;Animal&gt;, but List can't?",
          options: [
            "IEnumerable only hands out elements (out T), you cannot add to it — that is safe",
            "IEnumerable is faster than List",
            "List is obsolete",
            "There is no difference, neither one is allowed"
          ],
          answer: 0,
          explain: "IEnumerable is marked out — T only goes out. Since writing is impossible, widening the type is safe."
        }
      },
      {
        id: "var-3",
        title: "Contravariance (in)",
        subtitle: "If we only accept input, we can narrow the type",
        theory: `
<p>Now the mirror situation. There is a «consumer» that <b>takes something in</b> and returns
nothing. For example, <code>Action&lt;in T&gt;</code> or the comparer
<code>IComparer&lt;in T&gt;</code>.</p>
<p>If you have a thing that can handle <b>any animal</b>, then it will certainly handle
a <b>cat</b> too (a cat is a special case of an animal). So
<code>Action&lt;Animal&gt;</code> can be assigned where an
<code>Action&lt;Cat&gt;</code> is expected.</p>
<p>Handy rule: <code>in</code> → the type «moves down» (Animal → Cat). The opposite of
covariance.</p>`,
        code: `Action<Animal> handleAny = animal => Console.WriteLine("handling an animal");

// WORKS: Action is contravariant (in T)
Action<Cat> handleCat = handleAny;

handleCat(new Cat()); // whoever can handle any animal can handle a cat

// The definition in .NET:
// public delegate void Action<in T>(T obj);`,
        deep: `<p><b>Deeper:</b> <code>in</code> is allowed only if <code>T</code> stands
exclusively in <i>input</i> positions (method arguments). Mnemonic: <b>out — Producer</b>
(gives out), <b>in — Consumer</b> (takes in). That is where the PECS rule from the world of
generics comes from.</p>`,
        links: [
          { label: "MS Docs — Contravariance (in)", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance#contravariance" }
        ],
        task: {
          q: "Why can Action&lt;Animal&gt; be assigned to an Action&lt;Cat&gt; variable?",
          options: [
            "Because Cat is broader than Animal",
            "A handler for any animal will also handle the special case — a cat (in T, input only)",
            "Actions are always interchangeable",
            "That is an error, you cannot do it"
          ],
          answer: 1,
          explain: "in T means «input only». Whoever accepts Animal will also accept Cat. The type narrows — contravariance."
        }
      },
      {
        id: "var-4",
        title: "Putting the rule together",
        subtitle: "out goes up, in goes down, otherwise — stop",
        theory: `
<p>Three cases:</p>
<ul>
<li><b>Covariant (out T):</b> we only read/return → the type can be <i>widened</i>
(Cat→Animal). Examples: <code>IEnumerable&lt;out T&gt;</code>, <code>IReadOnlyList&lt;out T&gt;</code>,
<code>Func&lt;out TResult&gt;</code>.</li>
<li><b>Contravariant (in T):</b> we only take input → the type can be <i>narrowed</i>
(Animal→Cat). Examples: <code>Action&lt;in T&gt;</code>, <code>IComparer&lt;in T&gt;</code>.</li>
<li><b>Invariant:</b> we both read and write → substitution is forbidden. Examples: <code>List&lt;T&gt;</code>,
<code>IList&lt;T&gt;</code>.</li>
</ul>
<p><code>Func&lt;in T, out TResult&gt;</code> is a beautiful example: the input is contravariant,
the output is covariant.</p>`,
        code: `// Func takes T (in) and returns TResult (out)
// public delegate TResult Func<in T, out TResult>(T arg);

Func<Animal, Cat> f = animal => new Cat();

// the input can be narrowed (Animal->Cat), the output widened (Cat->Animal):
Func<Cat, Animal> g = f;  // WORKS`,
        deep: `<p><b>Deeper:</b> the compiler itself checks that <code>in</code>/<code>out</code>
are used correctly when you declare an interface. You will not be able to mark <code>out T</code>
if you secretly use <code>T</code> as input — this is protection against unsafe assignments.</p>`,
        links: [
          { label: "MS Docs — Using variance in interfaces", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/creating-variant-generic-interfaces" }
        ],
        task: {
          q: "Func&lt;Animal, Cat&gt; f. Which assignment is correct?",
          options: [
            "Func&lt;Cat, Animal&gt; g = f;",
            "Func&lt;Animal, Dog&gt; g = f;",
            "Func&lt;Cat, Dog&gt; g = f;",
            "List&lt;Animal&gt; g = f;"
          ],
          answer: 0,
          explain: "The input is contravariant (Animal can be narrowed to Cat), the output is covariant (Cat can be widened to Animal). So Func<Cat, Animal> works."
        }
      }
    ]
  },
  {
    id: "enumerables",
    name: "Enumerables",
    icon: "↻",
    blurb: "How foreach works, yield, lazy evaluation, and why you can walk the same list twice and get different results.",
    levels: [
      {
        id: "enum-1",
        title: "IEnumerable and IEnumerator",
        subtitle: "What foreach really does",
        theory: `
<p><code>foreach</code> looks like magic, but under the hood it is a simple two-part agreement:</p>
<ul>
<li><b>IEnumerable</b> — &quot;I can be walked through&quot;. It has one method: <code>GetEnumerator()</code>
— &quot;give me a walker over the elements&quot;.</li>
<li><b>IEnumerator</b> — the walker itself. It has <code>MoveNext()</code> (&quot;step to the next one,
return true if there is one&quot;) and <code>Current</code> (&quot;the current element&quot;).</li>
</ul>
<p><code>foreach</code> just takes the walker and keeps calling <code>MoveNext()</code> in a loop until the
elements run out. That's all.</p>`,
        code: `// foreach (var x in list) { use(x); }
// the compiler turns this into roughly:

IEnumerator<int> e = list.GetEnumerator();
while (e.MoveNext())
{
    int x = e.Current;
    use(x);
}
// (and then e.Dispose())`,
        deep: `<p><b>Deeper:</b> strictly speaking, <code>foreach</code> doesn't even require
<code>IEnumerable</code> — it is enough that the type <i>has a method</i>
<code>GetEnumerator()</code> with <code>MoveNext()</code>/<code>Current</code> (duck typing).
But in practice almost everything implements <code>IEnumerable&lt;T&gt;</code>.</p>`,
        links: [
          { label: "MS Docs — IEnumerable<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.ienumerable-1" },
          { label: "PDF: Iterator pattern (in your file)", url: "#" }
        ],
        task: {
          q: "What does foreach do &quot;under the hood&quot;?",
          options: [
            "Copies the whole collection into an array",
            "Takes an enumerator and calls MoveNext()/Current in a loop",
            "Calls GetEnumerator() once and takes the first element",
            "Only works with arrays"
          ],
          answer: 1,
          explain: "foreach = GetEnumerator() + a while(MoveNext()) loop that reads Current. That is exactly the Iterator pattern from your PDF."
        }
      },
      {
        id: "enum-2",
        title: "yield return",
        subtitle: "An iterator without writing a class by hand",
        theory: `
<p>Writing your own <code>IEnumerator</code> by hand is tedious. C# gives you the magic words
<code>yield return</code>: write an ordinary method, and the compiler builds the walker for you.</p>
<p>Every <code>yield return</code> means &quot;hand out this element and <b>freeze right here</b>&quot;. On the next
step the method continues <b>from exactly that spot</b>, as if you pressed pause and then resume.</p>`,
        code: `public IEnumerable<int> EvenNumbers(int max)
{
    for (int i = 0; i <= max; i += 2)
        yield return i;   // hand out the number and "freeze"
}

foreach (var n in EvenNumbers(6))
    Console.Write(n + " ");   // 0 2 4 6`,
        deep: `<p><b>Deeper:</b> the compiler turns such a method into a hidden class —
a <b>state machine</b>. Local variables (<code>i</code>) become fields of that class
so they are &quot;remembered&quot; between steps. That's exactly why an iterator can hand out an infinite
sequence without filling up memory.</p>`,
        links: [
          { label: "MS Docs — yield", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/yield" }
        ],
        task: {
          q: "What happens on a yield return inside a method?",
          options: [
            "The method ends for good",
            "An element is handed out, and the method &quot;freezes&quot; and continues from that spot on the next step",
            "The whole list is computed at once and returned",
            "A new thread is created"
          ],
          answer: 1,
          explain: "yield return hands out the next element and pauses the method; the next MoveNext() continues from the same point (a state machine)."
        }
      },
      {
        id: "enum-3",
        title: "Lazy evaluation",
        subtitle: "A query doesn't run when you write it",
        theory: `
<p>The key idea behind LINQ and iterators: they are <b>lazy</b> (deferred execution). When you write
<code>list.Where(...)</code>, nothing is <i>computed</i> yet. The query is only &quot;described&quot;.
The real work starts only when you begin <b>walking through</b> it (foreach,
<code>ToList()</code>, <code>Count()</code>...).</p>
<p>That leads to two traps:</p>
<ul>
<li><b>The data changed</b> after the query was described — the result will reflect the new data.</li>
<li><b>Walking twice</b> — the query runs twice (wasted work), and if the source changed in between,
you also get different results.</li>
</ul>`,
        code: `var nums = new List<int> { 1, 2, 3 };

// the query is DESCRIBED, but NOT executed
var query = nums.Where(n => n > 1);

nums.Add(4);            // we change the source AFTER describing it

foreach (var n in query)
    Console.Write(n + " ");   // 2 3 4  ← the four made it in!`,
        deep: `<p><b>Deeper:</b> if you want a &quot;snapshot&quot; of right here and now — materialize the query:
<code>.ToList()</code> or <code>.ToArray()</code>. That runs it once and locks in the
result. Rule of thumb: if you walk through a query more than once, or the source can change —
materialize it.</p>`,
        links: [
          { label: "MS Docs — Deferred execution (LINQ)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/linq/standard-query-operators/query-expression-basics" }
        ],
        task: {
          q: "var q = nums.Where(n => n > 1); then nums.Add(4); then foreach over q. What gets printed?",
          options: [
            "Only 2 3 — the query was locked in right away",
            "2 3 4 — the query is lazy and ran during the walk, already with the added element",
            "An error",
            "Nothing"
          ],
          answer: 1,
          explain: "Lazy evaluation: Where only described the query. The actual walk happened in the foreach — after Add — so the 4 made it in."
        }
      },
      {
        id: "enum-4",
        title: "LINQ on top of Enumerable",
        subtitle: "Chains that read like a sentence",
        theory: `
<p>LINQ is a set of extension methods over <code>IEnumerable&lt;T&gt;</code>:
<code>Where</code> (filter), <code>Select</code> (transform each one),
<code>OrderBy</code> (sort), <code>First</code>, <code>Sum</code> and so on. Each one
takes an <code>IEnumerable</code> and returns an <code>IEnumerable</code> — which is why you can
stack them into a chain.</p>
<p>Until the chain is &quot;materialized&quot;, all of it is one lazy pipe with elements
flowing through it one at a time.</p>`,
        code: `var people = new[] { "anna", "bob", "alex", "kate" };

var result = people
    .Where(n => n.StartsWith("a"))  // anna, alex
    .Select(n => n.ToUpper())       // ANNA, ALEX
    .OrderBy(n => n);               // ALEX, ANNA

foreach (var n in result)
    Console.WriteLine(n);           // ALEX \n ANNA`,
        deep: `<p><b>Deeper:</b> methods like <code>Where/Select</code> are <i>deferred</i>
(they return a lazy <code>IEnumerable</code>). But <code>ToList/Count/First/Sum</code> are
<i>immediate</i> (they run the walk right away). Knowing which is which is half of understanding
LINQ performance.</p>`,
        links: [
          { label: "MS Docs — LINQ overview", url: "https://learn.microsoft.com/en-us/dotnet/csharp/linq/" },
          { label: "Book: C# in Depth — LINQ", url: "https://csharpindepth.com/" }
        ],
        task: {
          q: "Which of these methods do NOT run the walk right away (deferred)?",
          options: [
            "ToList and ToArray",
            "Count and Sum",
            "Where and Select",
            "First and Last"
          ],
          answer: 2,
          explain: "Where/Select only build a lazy chain. ToList, Count, Sum, First do the opposite — they start the walk immediately."
        }
      }
    ]
  },
  {
    id: "filestream",
    name: "FileStream I/O",
    icon: "⤓",
    blurb: "Byte streams, reading and writing files, using and Dispose, asynchronous I/O.",
    levels: [
      {
        id: "fs-1",
        title: "What a Stream is",
        subtitle: "A pipe with bytes flowing through it",
        theory: `
<p>A file on disk is just a long ribbon of bytes. To work with it, .NET gives you
<b>Stream</b> — an abstraction meaning &quot;a pipe that bytes travel through, one way or the other&quot;.</p>
<p>The clever part is that <code>Stream</code> is a shared language. A file, the network, memory —
they are all streams with the same <code>Read</code>/<code>Write</code> methods. Learn one and
you understand them all.</p>
<p><code>FileStream</code> is a stream attached to a file. It has a &quot;position pointer&quot;
(<code>Position</code>) that moves along as you read or write.</p>`,
        code: `// every Stream shares the same basic set:
//   Read(buffer, offset, count)  — read bytes into a buffer
//   Write(buffer, offset, count) — write bytes
//   Position                     — where we are in the stream right now
//   Length                       — how much there is in total
//   Dispose()                    — close and release the file

// FileStream — a Stream that "looks at" a file on disk`,
        deep: `<p><b>Deeper:</b> streams work with <b>bytes</b>, not with text. Text is already an
interpretation of bytes through an encoding (UTF-8 and so on). That is why there are handy
&quot;wrappers&quot; on top of byte streams, like <code>StreamReader/StreamWriter</code> — more on those later.</p>`,
        links: [
          { label: "MS Docs — Stream class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.stream" },
          { label: "MS Docs — File and stream I/O", url: "https://learn.microsoft.com/en-us/dotnet/standard/io/" }
        ],
        task: {
          q: "Why is Stream such a handy abstraction?",
          options: [
            "It only works with files",
            "Files, the network and memory all share the same Read/Write interface — so code can be reused",
            "It turns bytes into text automatically",
            "It is faster than an array"
          ],
          answer: 1,
          explain: "Stream gives one common set of operations for different sources of bytes. The very same code works with a file, with the network and with memory."
        }
      },
      {
        id: "fs-2",
        title: "Reading and writing bytes",
        subtitle: "FileStream directly",
        theory: `
<p>We open a file with <code>FileStream</code> and say which mode we want (<code>FileMode</code>:
create, open, append...). We write a byte array with <code>Write</code>, and read with
<code>Read</code>.</p>
<p><code>Read</code> returns <b>how many bytes were actually read</b> (it can be fewer than you
asked for — the file ended). That matters: you cannot assume a single <code>Read</code> will
read everything.</p>`,
        code: `byte[] data = { 72, 105 }; // "Hi" in ASCII

// writing
using (var fs = new FileStream("out.bin", FileMode.Create))
{
    fs.Write(data, 0, data.Length);
}

// reading
using (var fs = new FileStream("out.bin", FileMode.Open))
{
    byte[] buffer = new byte[16];
    int read = fs.Read(buffer, 0, buffer.Length);
    // read == 2 — we read exactly 2 bytes
}`,
        deep: `<p><b>Deeper:</b> <code>Read</code> can return less than you asked for even in the
middle of a file (network streams especially). So &quot;read everything&quot; is usually done <b>in a loop</b>
until <code>Read</code> returns 0, or you just use the ready-made <code>File.ReadAllBytes</code>.</p>`,
        links: [
          { label: "MS Docs — FileStream", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.filestream" },
          { label: "MS Docs — FileMode enum", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.filemode" }
        ],
        task: {
          q: "What does fs.Read(buffer, 0, count) return?",
          options: [
            "Always count",
            "The number of bytes actually read (can be less than count, and 0 at the end)",
            "An array of the bytes that were read",
            "true/false — whether it worked"
          ],
          answer: 1,
          explain: "Read returns the number of bytes it actually read. Reading everything is usually done with a loop that keeps going until 0 comes back."
        }
      },
      {
        id: "fs-3",
        title: "using and Dispose",
        subtitle: "A file must always be closed",
        theory: `
<p>An open file is a resource the operating system holds on to. If you never close it, the file
can stay &quot;busy&quot;, data may not be flushed to disk, and resources leak.</p>
<p><code>FileStream</code> implements <code>IDisposable</code> — it has a
<code>Dispose()</code> that closes the file. But calling it by hand is risky: if an exception is
thrown, <code>Dispose</code> never runs.</p>
<p>The answer is <code>using</code>. It <b>guarantees</b> that <code>Dispose()</code> is called
when you leave the block, even if something went wrong.</p>`,
        code: `// The classic using block:
using (var fs = new FileStream("a.txt", FileMode.Create))
{
    // ...do the work...
} // <-- Dispose() is called here automatically, even on an exception

// The modern using declaration (C# 8+):
using var fs2 = new FileStream("b.txt", FileMode.Create);
// Dispose() will be called at the end of the current block { }`,
        deep: `<p><b>Deeper:</b> for the text wrapper <code>StreamWriter</code>, <code>Dispose</code>
also <b>flushes the buffer</b> (<code>Flush</code>) — it writes whatever is still pending to disk.
Forget to close it and you can lose your last bit of data. So here <code>using</code> is not just
&quot;good practice&quot;, it is a necessity.</p>`,
        links: [
          { label: "MS Docs — using statement", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/using" },
          { label: "MS Docs — IDisposable", url: "https://learn.microsoft.com/en-us/dotnet/api/system.idisposable" }
        ],
        task: {
          q: "Why wrap a FileStream in using?",
          options: [
            "To make the code shorter",
            "So Dispose() (closing the file and flushing the buffer) is guaranteed to run, even on an exception",
            "using makes reading faster",
            "Without using you cannot open a file"
          ],
          answer: 1,
          explain: "using guarantees Dispose is called however you leave the block — the file gets closed and the buffer flushed, even if an exception was thrown inside."
        }
      },
      {
        id: "fs-4",
        title: "Text, buffers and async",
        subtitle: "Handy wrappers and non-blocking I/O",
        theory: `
<p>Handling raw bytes yourself is awkward when what you really want is text.
<code>StreamWriter</code> and <code>StreamReader</code> are wrappers that convert
text ↔ bytes for you using an encoding.</p>
<p>Also, disks and networks are <b>slow</b>. While a file is being read, the program's thread just
sits there. The asynchronous versions (<code>ReadAsync</code>/<code>WriteAsync</code> +
<code>await</code>) do not block the thread: the program can get on with something else while the
I/O happens.</p>`,
        code: `// Text through the wrappers:
using (var writer = new StreamWriter("log.txt"))
{
    writer.WriteLine("Hello, file!");
}

using (var reader = new StreamReader("log.txt"))
{
    string line = reader.ReadLine();
}

// Asynchronously (does not block the thread):
async Task SaveAsync()
{
    using var fs = new FileStream("big.bin", FileMode.Create,
                                  FileAccess.Write, FileShare.None,
                                  bufferSize: 4096, useAsync: true);
    byte[] data = new byte[1000];
    await fs.WriteAsync(data, 0, data.Length);
}`,
        deep: `<p><b>Deeper:</b> <code>bufferSize</code> sets how many bytes to gather up before
actually touching the disk — working in big blocks is faster than going byte by byte.
For truly asynchronous I/O it matters that you open the stream with <code>useAsync: true</code>,
otherwise <code>WriteAsync</code> may end up working synchronously inside.</p>`,
        links: [
          { label: "MS Docs — StreamReader / StreamWriter", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.streamreader" },
          { label: "MS Docs — Async file I/O", url: "https://learn.microsoft.com/en-us/dotnet/standard/io/asynchronous-file-i-o" }
        ],
        task: {
          q: "What is the benefit of await fs.WriteAsync(...) instead of fs.Write(...)?",
          options: [
            "It always writes the bytes faster",
            "It does not block the thread during slow I/O — the program can do something else",
            "It means you do not have to close the file",
            "It compresses the data"
          ],
          answer: 1,
          explain: "Async I/O frees up the thread while waiting on disk or network. It is about responsiveness and scalability, not about the speed of the write itself."
        }
      }
    ]
  },
  {
    id: "creational",
    name: "Patterns: Creational",
    icon: "⚒",
    blurb: "How to create objects flexibly and safely: Singleton, Factory Method, Abstract Factory, Builder.",
    levels: [
      {
        id: "pat-singleton",
        title: "Singleton",
        subtitle: "Exactly one instance for the whole application",
        theory: `
<p><b>The goal:</b> guarantee that an object exists only <b>once</b>, and give everyone a shared
way to reach it. Example: a single configuration for the app.</p>
<p>The trick: the constructor is made <code>private</code> (nobody outside can create one), and
inside the class keeps the single instance and hands it out through a static <code>Instance</code> property.</p>
<p><b>Careful:</b> Singleton is often called an <i>anti-pattern</i> too — it is hidden global
state. Use it for <b>unchanging</b> things (settings, a cache), not for business data.</p>`,
        code: `public sealed class AppConfig
{
    // Lazy: the object is created on first use, and it is thread-safe
    private static readonly Lazy<AppConfig> _instance =
        new(() => new AppConfig());

    public static AppConfig Instance => _instance.Value;

    public string Environment { get; } = "Production";

    private AppConfig() { }   // nobody outside can call new
}

// Usage:
string env = AppConfig.Instance.Environment;`,
        deep: `<p><b>Going deeper:</b> <code>Lazy&lt;T&gt;</code> gives you thread-safe &quot;lazy&quot;
initialization — the instance is created exactly once, even if several threads race for it. In modern C#,
instead of the classic Singleton people often register a service as a <i>singleton</i> in a
DI container — that way it is easier to test (you can swap it out).</p>`,
        links: [
          { label: "PDF §7.1 Singleton (your file)", url: "#" },
          { label: "Refactoring.Guru — Singleton", url: "https://refactoring.guru/design-patterns/singleton" }
        ],
        task: {
          q: "Why is a Singleton's constructor made private?",
          options: [
            "So the class cannot be inherited from",
            "So nobody outside can create a second instance with new",
            "For speed",
            "Because the compiler requires it"
          ],
          answer: 1,
          explain: "A private constructor blocks creation from outside. The class creates the single instance itself and hands it out through Instance."
        }
      },
      {
        id: "pat-factory-method",
        title: "Factory Method",
        subtitle: "Creating an object, but a subclass decides which class",
        theory: `
<p><b>The goal:</b> your code should depend on an <b>abstraction</b> (an interface), and <i>which
concrete class</i> gets created should be decided by a separate &quot;factory&quot;.</p>
<p>We define a product interface (<code>IReport</code>) and an abstract factory with a
<code>Create()</code> method. Each concrete factory returns its own product. The client works
only with interfaces and knows nothing about the concrete classes.</p>`,
        code: `public interface IReport { string Render(); }

public class PdfReport   : IReport { public string Render() => "PDF report"; }
public class ExcelReport : IReport { public string Render() => "Excel report"; }

public abstract class ReportFactory
{
    public abstract IReport Create();   // the factory method
}

public class PdfReportFactory   : ReportFactory
{ public override IReport Create() => new PdfReport(); }

public class ExcelReportFactory : ReportFactory
{ public override IReport Create() => new ExcelReport(); }

// The client only knows IReport and ReportFactory:
ReportFactory factory = new PdfReportFactory();
IReport report = factory.Create();`,
        deep: `<p><b>Going deeper:</b> the point is to move <code>new ConcreteClass()</code> out of the
client code into one single place. Then adding a new report type means adding a new factory, without
touching the client (the open/closed principle). Always return an <b>interface</b>, never a concrete class.</p>`,
        links: [
          { label: "PDF §7.2 Factory Method", url: "#" },
          { label: "Refactoring.Guru — Factory Method", url: "https://refactoring.guru/design-patterns/factory-method" }
        ],
        task: {
          q: "What is the main point of Factory Method?",
          options: [
            "To create lots of objects quickly",
            "To take the creation of concrete classes away from the client — it depends only on an interface",
            "To guarantee a single instance",
            "To make report rendering faster"
          ],
          answer: 1,
          explain: "The client works with IReport/ReportFactory and knows nothing about PdfReport/ExcelReport. The choice of concrete class is hidden inside the factory."
        }
      },
      {
        id: "pat-abstract-factory",
        title: "Abstract Factory",
        subtitle: "Creating a whole family of matching objects",
        theory: `
<p><b>The goal:</b> create not one object, but a <b>family of related</b> objects that have to fit
together. The classic example: a set of UI elements for Windows or for Mac — the button and the
dialog must be &quot;in the same style&quot;.</p>
<p>The difference from Factory Method: Factory Method makes <b>one</b> product, Abstract Factory makes
a <b>family</b> of products (button + dialog + menu in one style).</p>`,
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
// MacUiFactory — the same idea, but with Mac elements`,
        deep: `<p><b>Going deeper:</b> one factory guarantees that every element comes from the same
family (you can't mix a <code>WinButton</code> with a <code>MacDialog</code>). The price: adding
a <i>new kind of product</i> (a menu, say) means adding a method to <b>every</b> factory.</p>`,
        links: [
          { label: "PDF §7.3 Abstract Factory", url: "#" },
          { label: "Refactoring.Guru — Abstract Factory", url: "https://refactoring.guru/design-patterns/abstract-factory" }
        ],
        task: {
          q: "How is Abstract Factory different from Factory Method?",
          options: [
            "There is no difference, they are the same thing",
            "Abstract Factory creates a family of related objects, while Factory Method creates one product",
            "Factory Method is harder",
            "Abstract Factory only works with UI"
          ],
          answer: 1,
          explain: "Factory Method — one type of product. Abstract Factory — a whole family of matching products (button + dialog + menu in one style)."
        }
      },
      {
        id: "pat-builder",
        title: "Builder",
        subtitle: "Assembling a complex object step by step",
        theory: `
<p><b>The goal:</b> an object has many fields, and some of them are optional. A constructor with ten
parameters is unreadable. <b>Builder</b> assembles the object <i>step by step</i>, and each step is
a clearly named method.</p>
<p>The &quot;fluent&quot; trick (a fluent interface): every method returns <code>this</code>, so the
calls line up in a chain that reads like a sentence.</p>`,
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

// It reads like a sentence:
var invoice = new InvoiceBuilder()
    .ForCustomer("Anna")
    .AddLine("Coffee")
    .WithDiscount(0.1m)
    .Build();`,
        deep: `<p><b>Going deeper:</b> <code>Build()</code> is a good place to check the required fields
and fail with a clear error if something is missing (&quot;fail fast&quot;). A builder is short-lived:
create a new one for each product, otherwise state will &quot;leak&quot; between calls.</p>`,
        links: [
          { label: "PDF §7.4 Builder", url: "#" },
          { label: "Refactoring.Guru — Builder", url: "https://refactoring.guru/design-patterns/builder" }
        ],
        task: {
          q: "Why do builder methods return this?",
          options: [
            "To save memory",
            "So the calls line up in a readable chain (a fluent interface)",
            "Because the IBuilder interface requires it",
            "To make the object immutable"
          ],
          answer: 1,
          explain: "Returning this lets you write .ForCustomer(...).AddLine(...).Build() as one chain — that is exactly the fluent style."
        }
      }
    ]
  },
  {
    id: "structural",
    name: "Patterns: Structural",
    icon: "▤",
    blurb: "How to assemble objects into structures: Adapter, Decorator, Composite.",
    levels: [
      {
        id: "pat-adapter",
        title: "Adapter",
        subtitle: "A plug adapter between incompatible interfaces",
        theory: `
<p><b>The problem:</b> you have someone else's class (a third-party SDK, legacy code) with an
"awkward" interface, but your code expects a <i>different</i> one. You can't change their code.
An <b>Adapter</b> is the plug adapter: it implements <i>your</i> interface and, inside, translates
the calls into theirs.</p>
<p>Like a physical travel plug: on the outside it's your plug, on the inside it's their format.</p>`,
        code: `public interface IPaymentGateway   // what your code expects
{
    PaymentResult Charge(PaymentRequest request);
}

// Someone else's SDK that you can't change:
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
        // translate YOUR request -> the SDK's format
        var sdkReq = new SdkChargeRequest {
            AmountInCents = (long)(request.Amount * 100m),
            CurrencyCode  = request.Currency,
            Token         = request.CardToken
        };
        var resp = _sdk.ExecuteCharge(sdkReq);
        // and back again: the SDK's answer -> YOUR format
        return new PaymentResult { Success = resp.Status == "OK" };
    }
}`,
        deep: `<p><b>Going deeper:</b> keep the adapter <b>thin</b> — it only translates the
interface, it doesn't add business logic. The danger is a "semantic mismatch": the methods look
similar but behave differently. Document differences like that.</p>`,
        links: [
          { label: "PDF §8.1 Adapter", url: "#" },
          { label: "Refactoring.Guru — Adapter", url: "https://refactoring.guru/design-patterns/adapter" }
        ],
        task: {
          q: "What does an Adapter do?",
          options: [
            "Adds new business logic on top of a class",
            "Implements the interface you need and, inside, translates the calls into someone else's incompatible API",
            "Creates a single instance",
            "Builds an object step by step"
          ],
          answer: 1,
          explain: "An Adapter is a plug adapter: your interface on the outside, translation into theirs on the inside. Their code stays untouched."
        }
      },
      {
        id: "pat-decorator",
        title: "Decorator",
        subtitle: "Adding behaviour by wrapping an object",
        theory: `
<p><b>The problem:</b> you want to give an object extra abilities (logging, caching, retry on
error) without creating a pile of subclasses for every combination. A <b>Decorator</b> "wraps" the
object in another object with the same interface, adding its own behaviour before/after.</p>
<p>Like clothes: there's one body, but you can put on as many layers as you like, in any order.
Every layer is still the same "person" (the interface), just with something added.</p>`,
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
        Console.WriteLine($"[LOG] weather request for {city}");
        var result = Inner.GetCurrent(city);   // delegate to the inner one
        Console.WriteLine($"[LOG] answer: {result}");
        return result;
    }
}

// Stacking the layers:
IWeatherClient client = new LoggingDecorator(new HttpWeatherClient());`,
        deep: `<p><b>Going deeper:</b> the <b>order</b> of decorators matters: retry on top of
logging and logging on top of retry behave differently. This is exactly how middleware pipelines
(ASP.NET) work. The downside — deep nesting makes the call stack harder to read.</p>`,
        links: [
          { label: "PDF §8.2 Decorator", url: "#" },
          { label: "Refactoring.Guru — Decorator", url: "https://refactoring.guru/design-patterns/decorator" }
        ],
        task: {
          q: "How does a Decorator add behaviour to an object?",
          options: [
            "It changes the object's original class",
            "It wraps the object in another one with the same interface, adding logic before/after and delegating to the inner object",
            "It creates a subclass for every combination of features",
            "It keeps one instance for the whole application"
          ],
          answer: 1,
          explain: "A decorator implements the same interface, holds a reference to the \"inner\" object, adds its own bit and passes the call inwards. Layers can be combined."
        }
      },
      {
        id: "pat-composite",
        title: "Composite",
        subtitle: "A tree where a leaf and a branch are handled the same way",
        theory: `
<p><b>The problem:</b> you want to work with a tree structure (folders/files, product categories,
a company org chart) so that the client <b>can't tell the difference</b> between a single item
(a leaf) and a group (a branch).</p>
<p>Both the leaf and the branch implement <b>one interface</b>. A branch stores its children
inside, and when it's asked to count or draw something, it recursively asks its children.</p>`,
        code: `public interface ICatalogNode { decimal GetTotalPrice(); }

// A leaf — a single product
public class ProductItem : ICatalogNode
{
    public decimal Price { get; }
    public ProductItem(decimal price) => Price = price;
    public decimal GetTotalPrice() => Price;
}

// A branch — a category with children
public class CategoryNode : ICatalogNode
{
    private readonly List<ICatalogNode> _children = new();
    public void Add(ICatalogNode node) => _children.Add(node);
    // recursively sum up the children — it doesn't matter if they're leaves or branches
    public decimal GetTotalPrice() => _children.Sum(c => c.GetTotalPrice());
}

var phones = new CategoryNode();
phones.Add(new ProductItem(999m));
phones.Add(new ProductItem(899m));
var accessories = new CategoryNode();
accessories.Add(new ProductItem(39m));
phones.Add(accessories);           // put a branch inside a branch
decimal total = phones.GetTotalPrice();  // 1937`,
        deep: `<p><b>Going deeper:</b> the beauty is that a single <code>GetTotalPrice()</code> call
works at any depth. The risks: very deep trees can hit the recursion limit, and accidental cycles
(a branch pointing at itself) give you an endless walk. Protect the integrity of the tree.</p>`,
        links: [
          { label: "PDF §8.3 Composite", url: "#" },
          { label: "Refactoring.Guru — Composite", url: "https://refactoring.guru/design-patterns/composite" }
        ],
        task: {
          q: "What's the main idea of Composite?",
          options: [
            "Storing a single instance of a tree",
            "A leaf and a branch implement one interface, so the client handles them the same way (recursively)",
            "Wrapping an object to add logic",
            "Translating one interface into another"
          ],
          answer: 1,
          explain: "Composite makes a leaf and a container interchangeable through a shared interface. The operation is called the same way everywhere and recursively walks down the tree."
        }
      }
    ]
  },
  {
    id: "behavioral",
    name: "Patterns: Behavioral",
    icon: "⇄",
    blurb: "How objects talk to each other and change their behaviour: Iterator, Observer, Command, Strategy, State, Chain of Responsibility.",
    levels: [
      {
        id: "pat-iterator",
        title: "Iterator",
        subtitle: "Walk through items without exposing the insides",
        theory: `
<p><b>The problem:</b> give people a way to go through a collection one item at a time, without
showing how it is built inside. In C# this pattern is <b>built in</b>: <code>IEnumerable&lt;T&gt;</code> +
<code>IEnumerator&lt;T&gt;</code>, and <code>yield return</code> builds the iterator for you.</p>
<p>You already saw this in the Enumerables world — same pattern, now seen through the GoF lens.</p>`,
        code: `public class EvenNumbers : IEnumerable<int>
{
    private readonly int _max;
    public EvenNumbers(int max) => _max = max;

    public IEnumerator<int> GetEnumerator()
    {
        for (int i = 0; i <= _max; i += 2)
            yield return i;     // the compiler builds the iterator
    }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

foreach (var n in new EvenNumbers(6))
    Console.Write(n + " ");     // 0 2 4 6`,
        deep: `<p><b>Going deeper:</b> an iterator in C# is <b>lazy</b> — it runs only when you ask
for the next item. The upside: you can hand out endless or streaming sequences. The downside: going
through it again runs the logic from scratch; if you need a snapshot, use <code>ToList()</code>.</p>`,
        links: [
          { label: "PDF §9.1 Iterator", url: "#" },
          { label: "MS Docs — IEnumerator<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.ienumerator-1" }
        ],
        task: {
          q: "How is the Iterator pattern usually implemented in C#?",
          options: [
            "You always have to write your own IEnumerator class by hand",
            "With IEnumerable<T> and yield return — the compiler builds the iterator for you",
            "With a Singleton",
            "By copying the collection into an array"
          ],
          answer: 1,
          explain: "Iterator is baked into the language: implement GetEnumerator with yield return and you get a ready-made lazy iterator that hides the collection's insides."
        }
      },
      {
        id: "pat-observer",
        title: "Observer",
        subtitle: "One changes — many find out",
        theory: `
<p><b>The problem:</b> when one object (the publisher) changes, everyone interested (the
subscribers) should find out automatically — and the publisher <b>does not know</b> who exactly is
subscribed.</p>
<p>The publisher keeps a list of subscribers and, when something changes, goes through them calling
<code>Update</code>. Subscribers can join or leave at any moment.</p>`,
        code: `public interface IObserver { void Update(string value); }

public class PriceFeed
{
    private readonly List<IObserver> _observers = new();
    public void Subscribe(IObserver o)   => _observers.Add(o);
    public void Unsubscribe(IObserver o) => _observers.Remove(o);

    public void SetPrice(string price)
    {
        foreach (var o in _observers.ToList())  // a copy — safe
            o.Update(price);                     // notify everyone
    }
}

public class Dashboard : IObserver
{ public void Update(string v) => Console.WriteLine($"[Dashboard] {v}"); }

var feed = new PriceFeed();
feed.Subscribe(new Dashboard());
feed.SetPrice("170");   // Dashboard gets the notification`,
        deep: `<p><b>Going deeper:</b> in .NET this is usually done with an <code>event</code> or
<code>IObservable&lt;T&gt;</code>. The classic trap is a <b>memory leak</b>: if you forget
<code>Unsubscribe</code>, the publisher still holds a reference to the subscriber, so the GC can
never free it. Also, isolate one subscriber's error so it does not break the rest of the chain.</p>`,
        links: [
          { label: "PDF §9.2 Observer", url: "#" },
          { label: "Refactoring.Guru — Observer", url: "https://refactoring.guru/design-patterns/observer" }
        ],
        task: {
          q: "What is a common mistake when using Observer?",
          options: [
            "Code that runs too fast",
            "Forgetting Unsubscribe → the publisher keeps a reference → memory leak",
            "You cannot have more than one subscriber",
            "The publisher must know the classes of all subscribers"
          ],
          answer: 1,
          explain: "Without unsubscribing, the publisher keeps holding on to the subscriber, so the garbage collector can never release it — the classic memory leak."
        }
      },
      {
        id: "pat-command",
        title: "Command",
        subtitle: "A request as an object: queue it, log it, undo it",
        theory: `
<p><b>The problem:</b> turn an <i>action</i> into an <b>object</b>. Then you can put the action in a
queue, log it, run it later, or <b>undo</b> it.</p>
<p>A command holds everything it needs to run (the receiver and the parameters) and hides all that
behind one method, <code>Execute()</code>. Whoever triggers it (the invoker) knows none of the
details — it just calls <code>Execute()</code>.</p>`,
        code: `public interface ICommand { void Execute(); }

public class OrderService
{
    public void CreateOrder(string id) => Console.WriteLine($"Created {id}");
}

public class CreateOrderCommand : ICommand
{
    private readonly OrderService _service;
    private readonly string _orderId;
    public CreateOrderCommand(OrderService s, string id)
    { _service = s; _orderId = id; }

    public void Execute() => _service.CreateOrder(_orderId);
}

// A queue of commands — we run them whenever we want:
var queue = new Queue<ICommand>();
queue.Enqueue(new CreateOrderCommand(new OrderService(), "ORD-1001"));
while (queue.Count > 0) queue.Dequeue().Execute();`,
        deep: `<p><b>Going deeper:</b> add an <code>Undo()</code> method and you get undo/redo: two
stacks — one for what was done, one for what was undone. That is exactly how "Ctrl+Z" works in
editors. The hard part is usually <code>Undo</code> — rolling back can be trickier than doing.</p>`,
        links: [
          { label: "PDF §9.3 Command (+ Undo/Redo)", url: "#" },
          { label: "Refactoring.Guru — Command", url: "https://refactoring.guru/design-patterns/command" }
        ],
        task: {
          q: "What do you gain by wrapping an action into a command object?",
          options: [
            "The action can only be run immediately",
            "The action can be queued, logged, run later and undone",
            "Commands are always faster than plain calls",
            "A command replaces interfaces"
          ],
          answer: 1,
          explain: "A command object holds everything needed to run. You can queue it, record it, postpone it or roll it back with Undo — that is where undo/redo and job queues come from."
        }
      },
      {
        id: "pat-strategy",
        title: "Strategy",
        subtitle: "Interchangeable algorithms",
        theory: `
<p><b>The problem:</b> there are several ways to do the same thing (calculating shipping: standard /
express). Instead of a pile of <code>if/else</code> in your main code, move each way into its own
class behind a shared interface and <b>plug in the one you need</b>.</p>
<p>The client (the "context") holds a reference to <code>IStrategy</code> and simply calls it. Which
algorithm it actually is — you decide from the outside.</p>`,
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

// Plug in the algorithm we want at runtime:
IShippingStrategy strategy = new ExpressShipping();
decimal price = strategy.Calculate(2m, 100m);`,
        deep: `<p><b>Going deeper:</b> keep strategies <b>stateless</b>, and you can safely reuse
them. Put the choice of strategy in one single place (a factory or resolver) instead of scattering
<code>if</code> statements all over the code. Name them after the business meaning (VipDiscount),
not after the mechanics.</p>`,
        links: [
          { label: "PDF §9.4 Strategy", url: "#" },
          { label: "Refactoring.Guru — Strategy", url: "https://refactoring.guru/design-patterns/strategy" }
        ],
        task: {
          q: "Strategy helps you get rid of…",
          options: [
            "Interfaces in your code",
            "if/else branches that switch the algorithm — each algorithm becomes its own class",
            "The need to create objects",
            "Tree structures"
          ],
          answer: 1,
          explain: "Strategy replaces sprawling if/else with interchangeable algorithm classes behind a shared interface. You plug the one you need into the context."
        }
      },
      {
        id: "pat-state",
        title: "State",
        subtitle: "An object changes behaviour by changing its state",
        theory: `
<p><b>The problem:</b> an object's behaviour depends on its state (an order: new / paid / shipped /
cancelled), and in each state some actions are allowed and others are not. Instead of one giant
<code>switch</code>, make each state its own class that knows where it is allowed to go next.</p>
<p><b>Strategy vs State:</b> in Strategy the <i>client</i> picks the algorithm. In State the object
<b>switches itself</b> between states.</p>`,
        code: `public interface IOrderState
{
    string Name { get; }
    IOrderState Pay();   // returns the next state
}

public class NewOrderState : IOrderState
{
    public string Name => "New";
    public IOrderState Pay() => new PaidOrderState();  // New -> Paid
}

public class PaidOrderState : IOrderState
{
    public string Name => "Paid";
    public IOrderState Pay() => this;  // already paid — stay here
}

public class OrderContext
{
    private IOrderState _state = new NewOrderState();
    public string Current => _state.Name;
    public void Pay() => _state = _state.Pay();  // the object changes its own state
}

var order = new OrderContext();   // New
order.Pay();                      // -> Paid`,
        deep: `<p><b>Going deeper:</b> keep the transition rules <b>inside</b> the states instead of
smearing them across the context. Log the transitions so you can debug. The danger is a "state
explosion": too many tiny states make the picture harder to follow. Draw a state diagram.</p>`,
        links: [
          { label: "PDF §9.5 State", url: "#" },
          { label: "Refactoring.Guru — State", url: "https://refactoring.guru/design-patterns/state" }
        ],
        task: {
          q: "What is the key difference between State and Strategy?",
          options: [
            "They are the same thing",
            "In Strategy the client picks the algorithm; in State the object switches its own states",
            "State is faster",
            "Strategy cannot be tested"
          ],
          answer: 1,
          explain: "Strategy: outside code plugs in the algorithm. State: the object moves between states internally, and it defines the transitions itself."
        }
      },
      {
        id: "pat-chain",
        title: "Chain of Responsibility",
        subtitle: "A chain of handlers: each one can decide or pass it on",
        theory: `
<p><b>The problem:</b> a request has to go through several handlers in order. Each one either
<b>handles</b> it or <b>passes</b> it to the next. The sender does not know who will end up handling
it. Example: approving expenses (team lead → manager → finance director).</p>`,
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
        if (r.Amount <= 300m) Console.WriteLine($"Team lead approved {r.Amount}");
        else Next?.Handle(r);        // can't do it — pass it on
    }
}

public class Manager : ApprovalHandler
{
    public override void Handle(ExpenseRequest r)
    {
        if (r.Amount <= 1500m) Console.WriteLine($"Manager approved {r.Amount}");
        else Next?.Handle(r);
    }
}

var lead = new TeamLead();
lead.SetNext(new Manager());
lead.Handle(new ExpenseRequest { Amount = 900m });  // the Manager will approve it`,
        deep: `<p><b>Going deeper:</b> always provide a <b>final handler</b> (or an explicit "not
handled" result), otherwise the request quietly falls through into nowhere. Middleware pipelines and
validation pipelines work the same way. The order of the links matters a lot — cover it with
tests.</p>`,
        links: [
          { label: "PDF §9.6 Chain of Responsibility", url: "#" },
          { label: "Refactoring.Guru — CoR", url: "https://refactoring.guru/design-patterns/chain-of-responsibility" }
        ],
        task: {
          q: "What is important to provide in a Chain of Responsibility?",
          options: [
            "Exactly two handlers",
            "A final (fallback) handler or an explicit \"not handled\" result, otherwise the request is silently lost",
            "A random order of handlers",
            "A single instance of the chain"
          ],
          answer: 1,
          explain: "Without a terminal handler, a request nobody took just quietly disappears. Always set a final link or an explicit \"not handled\" result."
        }
      }
    ]
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: "⛃",
    blurb: "Big-O, lists, stack/queue, dictionary, search, sorting and recursion. With \"write it yourself\" tasks.",
    levels: [
      {
        id: "dsa-bigo",
        title: "Complexity (Big-O)",
        subtitle: "How we measure \"fast\" and \"slow\"",
        theory: `
<p>Imagine looking up a name in a phone book. You could flip through page by page — or you
could open it in the middle and throw away half at once. The second way is faster. <b>Big-O</b>
is a way to describe <i>how the running time grows</i> as the data gets bigger.</p>
<p>Read it as "roughly this many steps for N items":</p>
<ul>
<li><code>O(1)</code> — constant: no matter how much data there is, the steps stay the same
(grabbing an item by index).</li>
<li><code>O(log n)</code> — grows very slowly: double the data and you add just one step
(binary search).</li>
<li><code>O(n)</code> — linear: twice the data, twice the steps (walking through a whole
list).</li>
<li><code>O(n²)</code> — blows up fast: two nested loops over the data (a simple sort).</li>
</ul>
<p>Big-O looks at the <b>worst case</b> and ignores small details — what matters is how things
behave on big data.</p>`,
        code: `int[] a = { 5, 8, 1, 9 };

// O(1): one step, size doesn't matter
int first = a[0];

// O(n): we go through every element
int sum = 0;
foreach (int x in a) sum += x;

// O(n^2): for each element — another loop over all of them
for (int i = 0; i < a.Length; i++)
    for (int j = 0; j < a.Length; j++)
        Console.WriteLine(a[i] + a[j]);`,
        deep: `<p><b>Deeper:</b> Big-O is about <i>growth</i>, not exact time in seconds.
An <code>O(1)</code> with a big constant can be slower than <code>O(n)</code> on small data,
but as N grows it always wins. That's why you pick the algorithm by its complexity class first
and optimise the constants later.</p>`,
        links: [
          { label: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" },
          { label: "Book: Grokking Algorithms (very visual)", url: "https://www.manning.com/books/grokking-algorithms" }
        ],
        task: {
          q: "You have two nested loops, each going through all n elements. What complexity is that?",
          options: [
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n²)"
          ],
          answer: 3,
          explain: "A loop inside a loop = n times n = n². On big data that's the \"heaviest\" of the options listed."
        }
      },
      {
        id: "dsa-list",
        title: "Arrays and lists",
        subtitle: "A fixed shelf vs a stretchy one",
        theory: `
<p>An <b>array</b> (<code>int[]</code>) is like a shelf with a fixed number of slots. Grabbing
an item by its number is instant (<code>O(1)</code>), but the size is set up front and never
changes.</p>
<p><b>List&lt;T&gt;</b> is a "smart" array that grows on its own as you add things. Inside it's
the same array — when it fills up it makes a bigger one and copies the data over. Adding to the
end is fast, but inserting in the middle shifts everything after it (<code>O(n)</code>).</p>`,
        code: `var nums = new List<int>();
nums.Add(10);          // add to the end
nums.Add(20);
nums.Insert(0, 5);     // insert at the front — shifts the rest
int x = nums[1];       // get by index — instant
nums.RemoveAt(0);      // remove by index`,
        deep: `<p><b>Deeper:</b> when the array inside a List fills up, .NET creates a new one
<b>twice as big</b> and copies the elements. That single operation is expensive, but it happens
rarely, so "on average" adding to the end counts as <code>O(1)</code> (this is called amortised
complexity).</p>`,
        links: [
          { label: "MS Docs — List<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1" }
        ],
        task: {
          kind: "write",
          q: "Which List&lt;T&gt; method adds a single element to the end? Write just the method name.",
          placeholder: "method name...",
          must: ["add"],
          solution: "Add",
          explain: "nums.Add(value) puts the element at the end of the list. It's a fast operation — O(1) on average."
        }
      },
      {
        id: "dsa-stack-queue",
        title: "Stack and queue",
        subtitle: "A pile of plates and a checkout line",
        theory: `
<p>A <b>stack</b> is like a pile of plates: you put them on and take them off the <i>top</i>.
Last in, first out (LIFO). Methods: <code>Push</code> (put on), <code>Pop</code> (take the top
off).</p>
<p>A <b>queue</b> is like a line in a shop: whoever came first gets served first (FIFO).
Methods: <code>Enqueue</code> (join the back), <code>Dequeue</code> (take the first one).</p>`,
        code: `var stack = new Stack<string>();
stack.Push("A");
stack.Push("B");
string top = stack.Pop();   // "B" — last in, first out

var queue = new Queue<string>();
queue.Enqueue("A");
queue.Enqueue("B");
string first = queue.Dequeue(); // "A" — first in, first out`,
        deep: `<p><b>Deeper:</b> a stack is the basis of "undo" (Ctrl+Z) and depth-first search
(DFS). A queue is the basis of breadth-first search (BFS) and to-do lists. Both have
<code>O(1)</code> operations, because only one end is ever touched.</p>`,
        links: [
          { label: "MS Docs — Stack<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.stack-1" },
          { label: "MS Docs — Queue<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.queue-1" }
        ],
        task: {
          q: "You push A onto a stack, then B, then C. What does the first Pop() return?",
          options: [
            "A — the very first one",
            "C — the very last one (LIFO)",
            "B — from the middle",
            "An error"
          ],
          answer: 1,
          explain: "A stack works LIFO: the last one in comes out first. So C comes off first."
        }
      },
      {
        id: "dsa-dictionary",
        title: "Dictionary (hash table)",
        subtitle: "Find something by key in one step",
        theory: `
<p><b>Dictionary&lt;TKey, TValue&gt;</b> stores "key → value" pairs, just like a real
dictionary: you look up a word and get the translation straight away. The magic is that looking
up by key is almost <b>instant</b> (<code>O(1)</code>), not a scan through everything.</p>
<p>How? The key goes through a <i>hash function</i> — it turns the key into a number, an
address, and the value is sitting right at that address. No flipping through everything.</p>`,
        code: `var ages = new Dictionary<string, int>();
ages["Anna"] = 20;
ages["Bob"]  = 25;

int a = ages["Anna"];              // 20 — fast lookup by key
bool has = ages.ContainsKey("Bob"); // true

// safe, no exception if the key is missing:
if (ages.TryGetValue("Kate", out int k))
    Console.WriteLine(k);`,
        deep: `<p><b>Deeper:</b> <code>O(1)</code> is "on average". If two different keys end up
with the same hash (that's called a <i>collision</i>), they get stored side by side and the
lookup slows down a little. A good hash function makes collisions rare. Asking for a key that
doesn't exist with <code>[]</code> throws an exception — that's why <code>TryGetValue</code>
exists.</p>`,
        links: [
          { label: "MS Docs — Dictionary<TKey,TValue>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2" }
        ],
        task: {
          kind: "write",
          q: "In what time (as O(...)) does a Dictionary find a value by key on average?",
          placeholder: "O(...)",
          must: ["o(1)"],
          solution: "O(1)",
          explain: "The hash function points straight at the value's address, so on average the lookup doesn't depend on size — O(1)."
        }
      },
      {
        id: "dsa-binary-search",
        title: "Binary search",
        subtitle: "Every step throws away half",
        theory: `
<p>We're looking for a number in a <b>sorted</b> array. Instead of walking through it one by
one, we look at the <i>middle</i>. If what's there is bigger than our target, the answer is to
the left, so we drop the right half. If it's smaller, we drop the left half. Every step cuts
the search area in half.</p>
<p>Because of that, even a million elements only take about 20 steps — the complexity is
<code>O(log n)</code>. The one requirement: the array must be <b>sorted</b>.</p>`,
        code: `int BinarySearch(int[] a, int target)
{
    int left = 0, right = a.Length - 1;
    while (left <= right)
    {
        int mid = (left + right) / 2;   // the middle
        if (a[mid] == target) return mid;   // found it
        if (a[mid] < target) left = mid + 1;  // search to the right
        else right = mid - 1;                 // search to the left
    }
    return -1;   // not found
}`,
        deep: `<p><b>Deeper:</b> <code>(left + right) / 2</code> can overflow with very large
numbers. Pros write <code>left + (right - left) / 2</code> — same meaning, no overflow risk.
.NET already ships <code>Array.BinarySearch</code>.</p>`,
        links: [
          { label: "MS Docs — Array.BinarySearch", url: "https://learn.microsoft.com/en-us/dotnet/api/system.array.binarysearch" }
        ],
        task: {
          kind: "write",
          q: "What's the complexity of binary search? Answer as O(...).",
          placeholder: "O(...)",
          must: ["o(logn)"],
          solution: "O(log n)",
          explain: "Every step throws away half the data, so the number of steps grows like a logarithm — O(log n)."
        }
      },
      {
        id: "dsa-recursion",
        title: "Recursion",
        subtitle: "A method that calls itself",
        theory: `
<p><b>Recursion</b> is when a function calls itself on a smaller version of the problem, until
it reaches the simplest case. Like nesting dolls: you open one, there's the same doll inside
but smaller — down to a tiny one that doesn't open at all.</p>
<p>Two parts are mandatory:</p>
<ul>
<li>The <b>base case</b> — where it stops (otherwise it calls forever and crashes).</li>
<li>The <b>step</b> — calling itself on a smaller problem.</li>
</ul>
<p>An example — factorial: <code>5! = 5 · 4 · 3 · 2 · 1</code>.</p>`,
        code: `int Factorial(int n)
{
    if (n <= 1) return 1;          // base case: we go no deeper
    return n * Factorial(n - 1);   // step: call ourselves on n-1
}

// Factorial(4) = 4 * Factorial(3)
//              = 4 * 3 * Factorial(2)
//              = 4 * 3 * 2 * Factorial(1) = 24`,
        deep: `<p><b>Deeper:</b> every nested call takes up room on the <i>call stack</i>
(memory for "who called whom"). Recursion that goes too deep overflows it — that's the
<code>StackOverflow</code> error. Sometimes people deliberately rewrite recursion as an
ordinary loop to avoid it.</p>`,
        links: [
          { label: "MS Docs — Recursion (tutorial)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/pattern-matching" },
          { label: "Grokking Algorithms — Recursion", url: "https://www.manning.com/books/grokking-algorithms" }
        ],
        task: {
          kind: "write",
          q: "Fill in the blank in the recursive step of factorial: return n * Factorial(____);",
          placeholder: "what goes inside the brackets?",
          must: ["n-1"],
          solution: "n - 1",
          explain: "To reach the base case (n <= 1), every call has to make n smaller. So we call Factorial(n - 1)."
        }
      },
      {
        id: "dsa-swap",
        title: "Practice: swapping values",
        subtitle: "The classic trick with a temporary variable",
        theory: `
<p>A very common little problem inside sorting: <b>swap</b> two elements of an array. The naive
attempt <code>a[i] = a[j]; a[j] = a[i];</code> breaks — the first assignment has already wiped
out the old value of <code>a[i]</code>.</p>
<p>The fix is a <b>temporary variable</b> (temp) that holds one value while we move the
other.</p>`,
        code: `// before: a[i] = 3, a[j] = 8
int temp = a[i];   // temp remembers 3
a[i] = a[j];       // a[i] is now 8
a[j] = temp;       // a[j] is now 3
// after: a[i] = 8, a[j] = 3`,
        deep: `<p><b>Deeper:</b> in C# you can skip temp entirely with tuples:
<code>(a[i], a[j]) = (a[j], a[i]);</code>. The compiler shuffles everything carefully for you.
But understanding the <code>temp</code> version matters — you'll meet it in almost every
language.</p>`,
        links: [
          { label: "MS Docs — Tuples (deconstruction)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-tuples" }
        ],
        task: {
          kind: "write",
          q: "Write the 3 lines that swap a[i] and a[j] using a temp variable.",
          placeholder: "int temp = ...;\na[i] = ...;\na[j] = ...;",
          must: ["temp=a[i]", "a[i]=a[j]", "a[j]=temp"],
          solution: "int temp = a[i];\na[i] = a[j];\na[j] = temp;",
          explain: "temp holds the old a[i] while we put a[j]'s value into a[i]; then we take the old a[i] out of temp into a[j]."
        }
      },
      {
        id: "dsa-sorting",
        title: "Sorting",
        subtitle: "Bubble sort vs the fast methods",
        theory: `
<p><b>Bubble sort</b> is the simplest one: walk through the array and swap neighbours whenever
they're "in the wrong order". Big numbers gradually "bubble up" to the end. Simple, but slow —
<code>O(n²)</code>.</p>
<p>Smart sorts (quicksort, merge sort) run in <code>O(n log n)</code> — noticeably faster on
big data. In real code you almost always use what's built in: <code>list.Sort()</code> or
<code>Array.Sort()</code>.</p>`,
        code: `void BubbleSort(int[] a)
{
    for (int i = 0; i < a.Length - 1; i++)
        for (int j = 0; j < a.Length - 1 - i; j++)
            if (a[j] > a[j + 1])
            {
                int temp = a[j];       // swap the neighbours
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
}

// In real life:
var nums = new List<int> { 5, 2, 8, 1 };
nums.Sort();   // [1, 2, 5, 8], a fast algorithm inside`,
        deep: `<p><b>Deeper:</b> <code>Array.Sort</code>/<code>List.Sort</code> use a hybrid
(introsort): quicksort plus a switch to other methods in bad cases — reliably
<code>O(n log n)</code>. Writing your own bubble sort is only worth it to <i>understand</i> the
idea, not for production code.</p>`,
        links: [
          { label: "MS Docs — Array.Sort", url: "https://learn.microsoft.com/en-us/dotnet/api/system.array.sort" },
          { label: "VisuAlgo — sorting visualisations", url: "https://visualgo.net/en/sorting" }
        ],
        task: {
          q: "Why does production code usually use list.Sort() instead of your own bubble sort?",
          options: [
            "You can't write bubble sort in C#",
            "The built-in sort runs in O(n log n) — faster, and already battle-tested",
            "list.Sort() only sorts numbers",
            "There's no difference"
          ],
          answer: 1,
          explain: "Bubble sort is O(n²) and a teaching example. The built-in Sort uses a fast hybrid O(n log n) algorithm and is well tested."
        }
      }
    ]
  },
  {
    id: "delegates",
    name: "Delegates & Events",
    icon: "⚡",
    blurb: "Store an action in a variable, pass it around, and notify everyone who subscribed.",
    levels: [
      {
        id: "del-1",
        title: "What is a delegate",
        subtitle: "A variable that holds a method",
        theory: `
<p>Usually a variable holds <i>data</i>: a number, a string. But what if you put a whole
<b>action</b> in a variable — a reference to a method? Then you can hand that variable to other
code, and it will call the method without even knowing its name.</p>
<p>A <b>delegate</b> is exactly that kind of "variable-for-a-method". Think of a <b>remote
control</b>: the button itself doesn't know what it switches on — the TV or the lights. You decide
that when you "bind" an action to the button. A delegate defines the <i>shape</i> of a method (what
it takes, what it returns), and which method actually goes in there is something you decide
later.</p>`,
        code: `// declare the shape: a method that takes an int and returns an int
delegate int Operation(int x);

int Double(int x) => x * 2;
int Square(int x) => x * x;

Operation op = Double;   // put the method into a variable
Console.WriteLine(op(5)); // 10 — called through the delegate

op = Square;             // swap in another method
Console.WriteLine(op(5)); // 25 — same call, different behaviour`,
        deep: `<p><b>Deeper:</b> a delegate is a type-safe type: the compiler checks that the
method really fits the shape (arguments and return value). Under the hood a delegate also stores
<i>which object</i> to call the method on, which is why it can hold both plain methods and
methods of a specific instance.</p>`,
        links: [
          { label: "MS Docs — Delegates", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/" }
        ],
        task: {
          q: "What does a delegate variable hold?",
          options: [
            "Only numbers",
            "A reference to a method — the action itself, which you can call later",
            "A copy of the whole class",
            "The text of the program"
          ],
          answer: 1,
          explain: "A delegate is a variable holding a reference to a method. You can pass it around and call it without knowing the method's name in advance."
        }
      },
      {
        id: "del-2",
        title: "Func, Action, Predicate and lambdas",
        subtitle: "Ready-made delegates — no need to declare your own",
        theory: `
<p>Writing <code>delegate ...</code> every time is tedious. C# already ships with ready-made
delegates for every case:</p>
<ul>
<li><code>Action</code> — a method that <b>returns nothing</b> (it just does something).</li>
<li><code>Func</code> — a method that <b>returns</b> a value (the last type is the result).</li>
<li><code>Predicate</code> — a method that answers <b>yes/no</b> (returns <code>bool</code>).</li>
</ul>
<p>And instead of a separate named method you can write a <b>lambda</b> — a short "right here"
form: <code>x =&gt; x * 2</code> reads as "take x and return x·2".</p>`,
        code: `Action<string> hello = name => Console.WriteLine("Hello, " + name);
hello("Anna");                     // Hello, Anna

Func<int, int, int> add = (a, b) => a + b;
Console.WriteLine(add(2, 3));      // 5

Predicate<int> isEven = n => n % 2 == 0;
Console.WriteLine(isEven(4));      // True

// delegates are often passed straight into methods:
var nums = new List<int> { 1, 2, 3, 4 };
var evens = nums.FindAll(isEven);  // [2, 4]`,
        deep: `<p><b>Deeper:</b> in <code>Func&lt;int, int, int&gt;</code> the last type is what the
method <b>returns</b>, and everything before it are the arguments. A lambda is just short syntax
for a nameless method; the compiler turns it into an ordinary delegate. Lambdas are exactly what
all of LINQ rests on (<code>Where</code>, <code>Select</code> and so on).</p>`,
        links: [
          { label: "MS Docs — Func<>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.func-2" },
          { label: "MS Docs — Lambda expressions", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions" }
        ],
        task: {
          q: "How is Func different from Action?",
          options: [
            "No difference, they are synonyms",
            "Func returns a value, Action returns nothing",
            "Action runs faster",
            "Func can't be used with lambdas"
          ],
          answer: 1,
          explain: "Action is an action with no result, Func is a method that returns a value (its type comes last inside the angle brackets)."
        }
      },
      {
        id: "del-3",
        title: "Multicast: several methods in one delegate",
        subtitle: "One call — many reactions",
        theory: `
<p>You can put <b>several</b> methods into one delegate using <code>+=</code>. Then a single call
runs them all, one after another. To remove a method, use <code>-=</code>.</p>
<p>This is the foundation of events: the publisher simply "pulls" the delegate, and everyone who
subscribed to it fires. The publisher doesn't even know how many they are or who they are.</p>`,
        code: `Action notify = () => Console.WriteLine("SMS sent");
notify += () => Console.WriteLine("Email sent");
notify += () => Console.WriteLine("Push sent");

notify();   // all three run in order

// SMS sent
// Email sent
// Push sent`,
        deep: `<p><b>Deeper:</b> such a delegate is called <i>multicast</i> — inside, it keeps a list
of methods. For delegates that <b>return</b> a value, a multicast call only shows you the result of
the <i>last</i> method, which is why multicast is usually used with <code>Action</code>
(no result). And if one of the methods throws an exception, the rest may never run.</p>`,
        links: [
          { label: "MS Docs — Multicast delegates", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/how-to-combine-delegates-multicast-delegates" }
        ],
        task: {
          q: "Which operator adds one more method to a delegate?",
          options: [
            "The = operator (it overwrites)",
            "The += operator (it adds to the list)",
            "The * operator ",
            "You can't — a delegate holds a single method"
          ],
          answer: 1,
          explain: "+= adds a method to the invocation list, -= removes it. A plain = simply overwrites and wipes out everything that was there."
        }
      },
      {
        id: "del-4",
        title: "Event",
        subtitle: "The publisher shouts — the subscribers hear",
        theory: `
<p>An <b>event</b> is a delegate, but a "protected" one. The problem with a bare delegate: anyone
from outside can <i>overwrite</i> it (<code>=</code>) or <i>call</i> it. The word
<code>event</code> forbids that: from outside you may only <b>subscribe</b> (<code>+=</code>) and
<b>unsubscribe</b> (<code>-=</code>), and only the publisher class itself can raise the event.</p>
<p>This is the <b>Observer</b> pattern, built into the language: one object changes and all the
subscribers find out automatically, while the publisher has no idea who is listening.</p>`,
        code: `class Button
{
    // event: from outside, only += and -= are allowed
    public event Action? Clicked;

    public void Press()
    {
        Console.WriteLine("Button pressed");
        Clicked?.Invoke();   // notify the subscribers (if there are any)
    }
}

var btn = new Button();
btn.Clicked += () => Console.WriteLine("Open the menu");
btn.Clicked += () => Console.WriteLine("Play a sound");

btn.Press();
// Button pressed
// Open the menu
// Play a sound`,
        deep: `<p><b>Deeper:</b> in <code>Clicked?.Invoke()</code> the <code>?</code> checks that there
are any subscribers at all (otherwise it's <code>null</code> and you get an error). By .NET
convention, events are often declared with the type
<code>EventHandler</code>/<code>EventHandler&lt;T&gt;</code> with the parameters
<code>(object sender, EventArgs e)</code> — so the subscriber knows <i>who</i> raised the event and
<i>with what data</i>. Don't forget the <code>-=</code> when you leave, or the subscriber won't be
collected by the garbage collector (a memory leak).</p>`,
        links: [
          { label: "MS Docs — Events", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/" }
        ],
        task: {
          q: "Why do we need the event keyword if a delegate already supports += ?",
          options: [
            "It makes the call faster",
            "It protects the delegate: from outside you can only subscribe/unsubscribe, and only the class itself can raise it",
            "It's required for every delegate",
            "There's no difference, they are synonyms"
          ],
          answer: 1,
          explain: "event encapsulates the delegate: outside code can neither overwrite it (=) nor raise the event — only subscribe and unsubscribe. Only the publisher raises it."
        }
      },
      {
        id: "del-5",
        title: "EventBus — a shared event bus",
        subtitle: "Everyone talks through one \"noticeboard\"",
        theory: `
<p>When a program has many parts, wiring them "everyone to everyone" directly turns into a mess.
The parts know about each other, so changing one means breaking another.</p>
<p>An <b>EventBus</b> is a middleman, a shared "noticeboard". Anyone can <b>publish</b> an event
("order paid"), and anyone can <b>subscribe</b> to that type of event. Sender and receiver
<b>know nothing about each other</b> — they only know the bus. It's the Observer pattern raised to
the level of the whole application (it's also called publish/subscribe).</p>`,
        code: `// a simple bus: event type -> list of handlers
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
            ((Action<T>)h)(evt);   // notify every subscriber of this type
    }
}

record OrderPaid(int OrderId);

var bus = new EventBus();
bus.Subscribe<OrderPaid>(e => Console.WriteLine($"Warehouse: pack order {e.OrderId}"));
bus.Subscribe<OrderPaid>(e => Console.WriteLine($"Mail: send a letter about order {e.OrderId}"));

bus.Publish(new OrderPaid(42));
// Warehouse: pack order 42
// Mail: send a letter about order 42`,
        deep: `<p><b>Deeper:</b> the upside of a bus is <i>loose coupling</i>: you can add a new
handler (analytics, say) without touching the sender or any other part. The downside is that the
flow of events becomes "invisible": it's hard to tell from the code who reacts to what, and it's
easy to end up with cycles or leaks if you forget to unsubscribe. That's why big projects use
ready-made libraries (MediatR, for example) with logging and lifetime management.</p>`,
        links: [
          { label: "Wikipedia — Publish–subscribe pattern", url: "https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" },
          { label: "MediatR (a popular .NET bus implementation)", url: "https://github.com/jbogard/MediatR" }
        ],
        task: {
          kind: "write",
          q: "The main upside of an EventBus is that sender and receiver do NOT know about each other. What is this property called (two words)?",
          placeholder: "for example: ... coupling",
          must: ["loose", "coupling"],
          solution: "Loose coupling",
          explain: "An EventBus gives you loose coupling: the parts talk through the bus instead of directly, so you can change and add them independently."
        }
      },
      {
        id: "del-6",
        title: "EventHandler and EventArgs",
        subtitle: "The standard shape of an event in .NET",
        theory: `
<p>You can write your own <code>event Action</code>, but all of .NET follows one <b>convention</b>:
an event tells the subscriber two things — <b>who</b> raised it and <b>what data</b> came with
it.</p>
<p>For that there's a ready-made delegate, <code>EventHandler&lt;T&gt;</code>. It always passes
<code>(object sender, T e)</code>: <code>sender</code> is the source of the event (the button
itself, for example), and <code>e</code> is the "envelope" with the data (a subclass of
<code>EventArgs</code>). That way any subscriber knows where it came from and what's inside.</p>`,
        code: `// the "envelope" with the event data
class TemperatureEventArgs : EventArgs
{
    public int Degrees { get; init; }
}

class Sensor
{
    public event EventHandler<TemperatureEventArgs>? Changed;

    public void Report(int degrees)
    {
        // sender = this (the sensor itself), e = the data
        Changed?.Invoke(this, new TemperatureEventArgs { Degrees = degrees });
    }
}

var sensor = new Sensor();
sensor.Changed += (sender, e) =>
    Console.WriteLine($"It's now {e.Degrees}°");

sensor.Report(21);   // It's now 21°`,
        deep: `<p><b>Deeper:</b> why all this ritual with <code>sender</code> and
<code>EventArgs</code>? So that every event in the program looks the same — one subscriber can
listen to many sources and always knows which one fired. And if tomorrow the event needs one more
field, you just put it into the <code>EventArgs</code> and old subscribers keep working. When
there's no data to send, you pass <code>EventArgs.Empty</code>.</p>`,
        links: [
          { label: "MS Docs — EventHandler<TEventArgs>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.eventhandler-1" },
          { label: "MS Docs — Standard event pattern", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/how-to-publish-events-that-conform-to-net-guidelines" }
        ],
        task: {
          q: "What does the standard EventHandler<T> pass to a subscriber?",
          options: [
            "Nothing, just a signal",
            "The source of the event (sender) and the event data (e)",
            "Only a number",
            "A copy of the whole program"
          ],
          answer: 1,
          explain: "The .NET standard: (object sender, T e) — who raised the event and with what data. That way the subscriber always knows the source and the contents."
        }
      },
      {
        id: "del-7",
        title: "Unsubscribing and memory leaks",
        subtitle: "You subscribed — don't forget to unsubscribe",
        theory: `
<p>When you write <code>publisher.Event += handler</code>, the publisher starts <b>holding a
reference</b> to the subscriber. As long as the publisher is alive, it "holds the hand" of every
subscriber.</p>
<p>The problem: if you no longer need the subscriber but never unsubscribed (<code>-=</code>), the
garbage collector can't remove it — the publisher still points at it. The subscriber just "hangs"
in memory for nothing. That's a <b>memory leak</b> through events. The rule: every
<code>+=</code> needs a matching <code>-=</code>.</p>`,
        code: `void HandleClick(object? s, EventArgs e)
    => Console.WriteLine("click");

button.Clicked += HandleClick;   // subscribed

// ...while the screen is open, we handle clicks...

button.Clicked -= HandleClick;   // CLOSING the screen — unsubscribed

// important: -= only works with the SAME method.
// You can't unsubscribe a lambda unless you saved it in a variable:
Action handler = () => Console.WriteLine("hi");
timer.Tick += handler;
timer.Tick -= handler;   // fine, it's the same reference`,
        deep: `<p><b>Deeper:</b> a common trap is subscribing with an inline lambda
(<code>+= () =&gt; ...</code>) and then trying to unsubscribe with an identical-looking lambda. It
won't work: those are two <i>different</i> objects, and <code>-=</code> won't match them. So a
lambda you'll need to remove later gets saved in a variable. In long-lived applications (UIs,
services) a forgotten subscription is the classic reason memory keeps growing.</p>`,
        links: [
          { label: "MS Docs — How to subscribe/unsubscribe", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/how-to-subscribe-to-and-unsubscribe-from-events" }
        ],
        task: {
          q: "Why does a forgotten event subscription cause a memory leak?",
          options: [
            "The event copies the whole object",
            "The publisher holds a reference to the subscriber, so the garbage collector can't remove it",
            "Subscriptions take up disk space",
            "It's a myth, there is no leak"
          ],
          answer: 1,
          explain: "As long as the publisher references the subscriber (through +=), the garbage collector considers it \"alive\". No -= means the object hangs in memory for nothing."
        }
      },
      {
        id: "del-8",
        title: "Build it yourself: an event from scratch",
        subtitle: "Check that you got it",
        theory: `
<p>Let's put it all together. We need a publisher class with an event that fires on some action,
and a subscriber that reacts to it.</p>
<p>In the task below, write the missing line — the <b>raising of the event</b>. Hint: an event is
raised safely through <code>?.Invoke(...)</code>, so it doesn't crash when there are no
subscribers.</p>`,
        code: `class Alarm
{
    public event Action<string>? Rang;   // event carrying the reason text

    public void Trigger(string reason)
    {
        // THE event call goes HERE ↓
        Rang?.Invoke(reason);
    }
}

var alarm = new Alarm();
alarm.Rang += reason => Console.WriteLine("Alarm: " + reason);
alarm.Trigger("smoke");   // Alarm: smoke`,
        deep: `<p><b>Deeper:</b> <code>?.Invoke</code> is protection against <code>null</code>: if
nobody is subscribed, the event is <code>null</code> and a normal call would crash. The question
mark says: "only call it if there's someone to answer".</p>`,
        links: [
          { label: "MS Docs — Events", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/" }
        ],
        task: {
          kind: "write",
          q: "Inside the Trigger method, write the line that safely raises the Rang event and passes reason to it. (use ?.Invoke)",
          placeholder: "Rang?.Invoke(...);",
          must: ["rang?.invoke(reason)"],
          solution: "Rang?.Invoke(reason);",
          explain: "Rang?.Invoke(reason); — the ? checks that there are subscribers, and Invoke runs them all and passes the alarm reason."
        }
      }
    ]
  },
];

// Same world order as the Russian data file.
const WORLD_ORDER = [
  "dsa",
  "enumerables",
  "delegates",
  "generics",
  "variance",
  "filestream",
  "creational",
  "structural",
  "behavioral",
];
const orderedWorlds = WORLD_ORDER
  .map(id => WORLDS.find(w => w.id === id))
  .filter(Boolean);
for (const w of WORLDS) {
  if (!orderedWorlds.includes(w)) orderedWorlds.push(w);
}

window.WORLDS_EN = orderedWorlds;
})();
