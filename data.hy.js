/* =====================================================================
   C# Deep Dive — content (Armenian)
   Mirror of data.js with the same world/level ids, translated to Armenian.
   Technical terms are deliberately kept in English.
   Wrapped in an IIFE so it can share the page with the other data files.
   ===================================================================== */
(function () {
const WORLDS = [
  {
    id: "generics",
    name: "Generics",
    icon: "◆",
    blurb: "Կոդ, որն աշխատում է ցանկացած type-ի հետ — առանց type safety-ը կորցնելու։",
    levels: [
      {
        id: "gen-1",
        title: "Ի՞նչ է generic-ը",
        subtitle: "Մեկ տուփ ցանկացած պարունակության համար",
        theory: `
<p>Պատկերացրու տուփ։ Սովորական տուփի վրա պիտակ է՝ "միայն խնձորների համար"։ Եթե քեզ գրքերի
համար տուփ է պետք, ստիպված ես նորը՝ առանձինը սարքել։ Ձանձրալի է, և կրկնվող աշխատանք է։</p>
<p><b>Generic</b> — դա տուփ է առանց կոշտ պիտակի։ Դու նրան type-ը ասում ես <i>հենց օգտագործման
պահին</i>՝ «հիմա դու խնձորների համար ես», «իսկ հիմա՝ գրքերի»։ Մեկ կոդ — ցանկացած type։</p>
<p><code>T</code> տառը (<i>Type</i> բառից) տեղապահ է։ Compiler-ը դրա փոխարեն կդնի այն իրական
type-ը, որը դու կնշես։ <code>List&lt;int&gt;</code> — թվերի ցուցակ,
<code>List&lt;string&gt;</code> — տեքստերի ցուցակ։ Իսկ <code>List&lt;T&gt;</code> class-ը
գրվել է ընդամենը մեկ անգամ։</p>`,
        code: `// T — տեղապահ ապագա type-ի համար
public class Box<T>
{
    private T _item;
    public void Put(T item) => _item = item;
    public T Get() => _item;
}

var apples = new Box<int>();   // հիմա T = int
apples.Put(5);
int a = apples.Get();          // հետ ենք ստանում int, առանց type-ի ձևափոխման

var names = new Box<string>(); // նույն class-ը, հիմա T = string
names.Put("Anna");`,
        deep: `<p><b>Ավելի խորը։</b> մինչ generics-ը C#-ում ամեն ինչ լցնում էին
<code>object</code>-ի մեջ։ Բայց այդ դեպքում թիվը վերածվում էր <code>object</code>-ի (սա կոչվում
է <i>boxing</i> — ավելորդ աշխատանք և աղբ հիշողության մեջ), իսկ հետ վերցնելիս պետք էր ձեռքով
նորից ձևափոխել type-ը և ռիսկի դիմել՝ սխալ ստանալ ծրագրի աշխատանքի ընթացքում։ Generics-ը տալիս է
<b>type safety compile time-ում</b> և վերացնում է boxing-ը։</p>`,
        links: [
          { label: "MS Docs — Generics", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics" },
          { label: "Գիրք՝ C# in Depth (Jon Skeet), generics-ի գլուխը", url: "https://csharpindepth.com/" }
        ],
        task: {
          q: "Ինչի՞ համար է պետք List&lt;T&gt;-ն այն փոխարեն, որ ամեն ինչ պահենք object-երի ցուցակում?",
          options: [
            "Որպեսզի կոդն ավելի գեղեցիկ տեսք ունենա",
            "Որպեսզի type-ի սխալը բռնվի compile time-ում և boxing-ից խուսափենք",
            "Որպեսզի ծրագիրն ավելի դանդաղ, բայց ավելի հուսալի աշխատի",
            "Generics-ը պետք է միայն թվերի համար"
          ],
          answer: 1,
          explain: "Generic-ը type-երը ստուգում է դեռ մինչ գործարկումը և value type-երը չի փաթեթավորում object-ի մեջ — սա և՛ ավելի ապահով է, և՛ ավելի արագ։"
        }
      },
      {
        id: "gen-2",
        title: "Generic մեթոդներ",
        subtitle: "Ոչ ամբողջ class-ը — ընդամենը մեկ մեթոդ",
        theory: `
<p>Երբեմն ամբողջ class-ը generic դարձնելու կարիք չկա — բավական է մեկ մեթոդ։ Մեթոդը նույնպես
կարող է ունենալ իր type-ի տեղապահը։</p>
<p>Հետաքրքիրն այն է, որ compiler-ը հաճախ <b>ինքն է կռահում</b>, թե որ type-ը փոխանցեցիր —
սա կոչվում է <i>type inference</i>։ Կարիք չկա գրել
<code>Swap&lt;int&gt;</code>, բավական է <code>Swap(x, y)</code>։</p>`,
        code: `// <T>-ն կանգնած է մեթոդի, ոչ թե class-ի մոտ
static void Swap<T>(ref T x, ref T y)
{
    T temp = x;
    x = y;
    y = temp;
}

int p = 1, q = 2;
Swap(ref p, ref q);   // compiler-ը հասկացավ՝ T = int
// p == 2, q == 1

string s1 = "a", s2 = "b";
Swap(ref s1, ref s2); // նույն մեթոդը, T = string`,
        deep: `<p><b>Ավելի խորը։</b> type inference-ը աշխատում է <i>արգումենտների</i> հիման վրա, ոչ թե
վերադարձվող արժեքի։ Եթե type-ը հնարավոր չէ հաշվել արգումենտներից, ստիպված ես այն նշել բացահայտ՝
<code>Create&lt;User&gt;()</code>։</p>`,
        links: [
          { label: "MS Docs — Generic Methods", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generic-methods" }
        ],
        task: {
          q: "Ինչու՞ սովորաբար կարելի է գրել Swap(ref a, ref b) և ոչ Swap&lt;int&gt;(ref a, ref b)?",
          options: [
            "Այդպես գրել չի կարելի, type-ը միշտ պետք է նշել",
            "Compiler-ը T-ն դուրս է բերում փոխանցված արգումենտների type-երից",
            "int-ը բոլոր մեթոդների համար լռելյայն type-ն է",
            "Generic մեթոդները անտեսում են type-երը"
          ],
          answer: 1,
          explain: "Սա type inference-ն է։ compiler-ը նայում է արգումենտներին և ինքն է տեղը դնում T-ն։"
        }
      },
      {
        id: "gen-3",
        title: "Constraints (սահմանափակումներ)",
        subtitle: "«T, բայց ոչ բոլորովին ցանկացած»",
        theory: `
<p>Երբեմն «ցանկացած type» չափազանց շատ է։ Օրինակ՝ մեթոդը ուզում է <code>T</code>-ի վրա կանչել
<code>CompareTo</code> մեթոդը։ Բայց ոչ բոլոր type-երն ունեն այն։ Պետք է <b>խոստանալ
compiler-ին</b>, որ <code>T</code>-ն ունի անհրաժեշտ հատկությունները։</p>
<p>Դա անում է <code>where</code> բառը։ Այն պայմաններ է դնում <code>T</code>-ի վրա։</p>
<ul>
<li><code>where T : class</code> — միայն reference type-եր</li>
<li><code>where T : struct</code> — միայն value type-եր</li>
<li><code>where T : IComparable&lt;T&gt;</code> — T-ն պետք է կարողանա համեմատվել</li>
<li><code>where T : new()</code> — T-ն ունի դատարկ constructor (կարելի է գրել <code>new T()</code>)</li>
</ul>`,
        code: `// T-ն պարտավոր է կարողանալ իրեն համեմատել իր նմանի հետ
static T Max<T>(T a, T b) where T : IComparable<T>
{
    // հիմա CompareTo-ն հասանելի է — compiler-ը վստահ է, որ այն կա
    return a.CompareTo(b) >= 0 ? a : b;
}

int big = Max(3, 9);          // 9
string later = Max("a", "z"); // "z"`,
        deep: `<p><b>Ավելի խորը։</b> առանց constraint-ի compiler-ը <code>T</code>-ն համարում է
պարզապես <code>object</code> և թույլ չի տա կանչել <code>CompareTo</code>. Constraint-ը բացում է
մուտքը interface-ի կամ base class-ի անդամներին և միաժամանակ փաստագրում է մտադրությունը՝ «այստեղ
հարմար են միայն համեմատվող type-երը»։</p>`,
        links: [
          { label: "MS Docs — Constraints on type parameters", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters" }
        ],
        task: {
          q: "Ի՞նչ է տալիս where T : IComparable&lt;T&gt; constraint-ը?",
          options: [
            "Ընդհանրապես արգելում է մեթոդի օգտագործումը",
            "Թույլ է տալիս փոխանցել միայն null",
            "Երաշխավորում է, որ T-ն ունի CompareTo, և թույլ է տալիս կանչել այն",
            "Համեմատությունը արագացնում է 2 անգամ"
          ],
          answer: 2,
          explain: "Constraint-ը compiler-ին խոստանում է interface-ի անդամի առկայությունը — և այդ դեպքում այն կարելի է կանչել մեթոդի ներսում։"
        }
      }
    ]
  },
  {
    id: "variance",
    name: "Variance",
    icon: "⇅",
    blurb: "Covariance, contravariance — երբ IEnumerable<Cat>-ը «տեղավորվում» է այնտեղ, որտեղ սպասում են IEnumerable<Animal>.",
    levels: [
      {
        id: "var-1",
        title: "Համատեղելիության խնդիրը",
        subtitle: "Կատուն կենդանի է։ Բայց կատուների ցուցակը կենդանիների ցուցա՞կ է",
        theory: `
<p>Կատուն (<code>Cat</code>) ժառանգում է Կենդանուց (<code>Animal</code>)։ Ուրեմն կատուն կարելի է
դնել այնտեղ, որտեղ սպասում են կենդանի։ Տրամաբանական է։</p>
<p>Բայց ահա որոգայթը՝ արդյո՞ք <code>List&lt;Cat&gt;</code>-ը նույնն է, ինչ
<code>List&lt;Animal&gt;</code>-ը։ <b>Ոչ։</b> Եւ սա bug չէ։ Եթե կատուների ցուցակը համարվեր
կենդանիների ցուցակ, ինչ-որ մեկը կարող էր դրա մեջ շուն ավելացնել — ու ամեն ինչ կփլուզվեր։</p>
<p>Լռելյայն generic տիպերը <b>invariant</b> են՝ <code>List&lt;Cat&gt;</code>-ը եւ
<code>List&lt;Animal&gt;</code>-ը տարբեր, անհամատեղելի տիպեր են։ Variance-ը այն կանոնների
հավաքածուն է, որ <i>անվտանգ</i> դեպքերում այս պատը վերացնում է։</p>`,
        code: `class Animal { }
class Cat : Animal { }

Animal a = new Cat();          // OK: կատուն կենդանի է

List<Cat> cats = new();
// List<Animal> animals = cats; // կոմպիլյացիայի ՍԽԱԼ — invariance
// հակառակ դեպքում կստացվեր՝ animals.Add(new Dog()); — աղետ`,
        deep: `<p><b>Ավելի խորը՝</b> variance-ը աշխատում է միայն <b>interface</b>-ների եւ delegate-ների հետ,
ոչ թե <code>List&lt;T&gt;</code>-ի նման դասերի։ Եւ միայն <b>հղումային</b> (reference) տիպերի հետ։ Հետո
կդիտարկենք երկու անվտանգ դեպք՝ կարդալը (out) եւ գրելը (in)։</p>`,
        links: [
          { label: "MS Docs — Variance in Generics", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance" }
        ],
        task: {
          q: "Ինչու՞ List&lt;Cat&gt;-ը չի կարելի վերագրել List&lt;Animal&gt; փոփոխականին",
          options: [
            "Որովհետեւ Cat-ը չի ժառանգում Animal-ից",
            "Հակառակ դեպքում կատուների ցուցակի մեջ կարելի կլիներ ավելացնել, օրինակ, շուն",
            "Դա թույլատրված է, կոմպիլյատորը սխալվում է",
            "List-ը ընդհանրապես ժառանգում չի աջակցում"
          ],
          answer: 1,
          explain: "List-ը փոփոխելի է։ Թույլ տալով այդպիսի վերագրում՝ մենք դուռ կբացեինք օտար տիպ գրելու համար։ Դրա համար էլ՝ invariance։"
        }
      },
      {
        id: "var-2",
        title: "Covariance (out)",
        subtitle: "Եթե միայն կարդում ենք, տիպը կարելի է լայնացնել",
        theory: `
<p>Իսկ եթե հավաքածուից կարելի է միայն <b>հանել</b>, բայց ոչ դնել։ Այդ դեպքում վտանգ չկա՝ քանի
որ մենք ընդամենը կատուներ ենք կարդում որպես կենդանիներ, ամեն ինչ անվտանգ է։</p>
<p>Հենց դրա համար <code>IEnumerable&lt;out T&gt;</code>-ը նշված է <code>out</code> բառով։ Այն
նշանակում է՝ «T-ը միայն դուրս»։ Այդպիսի interface-ը <b>covariant</b> է — կարելի է
<code>IEnumerable&lt;Cat&gt;</code>-ը վերագրել <code>IEnumerable&lt;Animal&gt;</code> փոփոխականին։</p>
<p>Հուշող կանոն՝ <code>out</code> → տիպը «բարձրանում է» ժառանգման շղթայով (Cat → Animal)։</p>`,
        code: `IEnumerable<Cat> cats = new List<Cat> { new Cat(), new Cat() };

// ԱՇԽԱՏՈՒՄ Է: IEnumerable-ը covariant է (out T)
IEnumerable<Animal> animals = cats;

foreach (Animal x in animals) { /* միայն կարդում ենք — անվտանգ է */ }

// Սահմանումը .NET-ում՝
// public interface IEnumerable<out T> : IEnumerable { ... }`,
        deep: `<p><b>Ավելի խորը՝</b> <code>out</code>-ը թույլատրվում է միայն այն դեպքում, երբ <code>T</code>-ը
հանդիպում է բացառապես <i>վերադարձվող</i> դիրքերում (return, get-հատկություններ)։ Հենց որ
<code>T</code>-ը հայտնվի մեթոդի արգումենտում — կոմպիլյատորը կարգելի <code>out</code>-ը, որովհետեւ
դա գրելու դուռ կբացեր։</p>`,
        links: [
          { label: "MS Docs — Covariance (out)", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance#covariance" }
        ],
        task: {
          q: "Ինչու՞ IEnumerable&lt;Cat&gt;-ը կարելի է վերագրել IEnumerable&lt;Animal&gt;-ին, իսկ List-ը՝ ոչ",
          options: [
            "IEnumerable-ը միայն տալիս է տարրերը (out T), դրա մեջ ավելացնել չի կարելի — սա անվտանգ է",
            "IEnumerable-ը List-ից արագ է",
            "List-ը հնացած է",
            "Տարբերություն չկա, երկուսն էլ չի կարելի"
          ],
          answer: 0,
          explain: "IEnumerable-ը նշված է out-ով՝ T-ը միայն դուրս։ Քանի որ գրելը հնարավոր չէ, տիպը լայնացնելը անվտանգ է։"
        }
      },
      {
        id: "var-3",
        title: "Contravariance (in)",
        subtitle: "Եթե միայն մուտք ենք ընդունում, տիպը կարելի է նեղացնել",
        theory: `
<p>Հիմա հայելային իրավիճակը։ Կա «սպառող», որը ինչ-որ բան <b>ընդունում է մուտքին</b> եւ ոչինչ
չի վերադարձնում։ Օրինակ՝ <code>Action&lt;in T&gt;</code> կամ համեմատողը՝
<code>IComparer&lt;in T&gt;</code>։</p>
<p>Եթե քեզ մոտ կա բան, որ կարող է մշակել <b>ցանկացած կենդանի</b>, ապա նա հաստատ կհաղթահարի
նաեւ <b>կատվին</b> (կատուն կենդանու մասնավոր դեպքն է)։ Ուրեմն
<code>Action&lt;Animal&gt;</code>-ը կարելի է վերագրել այնտեղ, որտեղ սպասում են
<code>Action&lt;Cat&gt;</code>։</p>
<p>Հուշող կանոն՝ <code>in</code> → տիպը «իջնում է» (Animal → Cat)։ Հակառակը covariance-ին։</p>`,
        code: `Action<Animal> handleAny = animal => Console.WriteLine("մշակում եմ կենդանի");

// ԱՇԽԱՏՈՒՄ Է: Action-ը contravariant է (in T)
Action<Cat> handleCat = handleAny;

handleCat(new Cat()); // ով կարող է ցանկացած կենդանի, կարող է նաեւ կատու

// Սահմանումը .NET-ում՝
// public delegate void Action<in T>(T obj);`,
        deep: `<p><b>Ավելի խորը՝</b> <code>in</code>-ը թույլատրվում է միայն այն դեպքում, երբ <code>T</code>-ը կանգնած է
բացառապես <i>մուտքային</i> դիրքերում (մեթոդների արգումենտներ)։ Հիշելու հնարք՝ <b>out — Producer</b>
(տալիս է), <b>in — Consumer</b> (ընդունում է)։ Այստեղից էլ գալիս է generic-ների աշխարհի PECS կանոնը։</p>`,
        links: [
          { label: "MS Docs — Contravariance (in)", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/covariance-and-contravariance#contravariance" }
        ],
        task: {
          q: "Ինչու՞ Action&lt;Animal&gt;-ը կարելի է վերագրել Action&lt;Cat&gt; փոփոխականին",
          options: [
            "Որովհետեւ Cat-ը ավելի լայն է, քան Animal-ը",
            "Ցանկացած կենդանու մշակիչը կհաղթահարի նաեւ մասնավոր դեպքը՝ կատվին (in T, միայն մուտք)",
            "Action-ները միշտ փոխարինելի են",
            "Սա սխալ է, այդպես չի կարելի"
          ],
          answer: 1,
          explain: "in T նշանակում է «միայն մուտքին»։ Ով ընդունում է Animal, կընդունի նաեւ Cat։ Տիպը նեղանում է՝ contravariance։"
        }
      },
      {
        id: "var-4",
        title: "Հավաքում ենք կանոնը մեկտեղ",
        subtitle: "out-ը վեր, in-ը վար, այլապես՝ կանգ",
        theory: `
<p>Երեք դեպք՝</p>
<ul>
<li><b>Covariant (out T):</b> միայն կարդում/վերադարձնում ենք → տիպը կարելի է <i>լայնացնել</i>
(Cat→Animal)։ Օրինակ՝ <code>IEnumerable&lt;out T&gt;</code>, <code>IReadOnlyList&lt;out T&gt;</code>,
<code>Func&lt;out TResult&gt;</code>։</li>
<li><b>Contravariant (in T):</b> միայն մուտք ենք ընդունում → տիպը կարելի է <i>նեղացնել</i>
(Animal→Cat)։ Օրինակ՝ <code>Action&lt;in T&gt;</code>, <code>IComparer&lt;in T&gt;</code>։</li>
<li><b>Invariant:</b> եւ կարդում, եւ գրում ենք → փոխարինումը արգելված է։ Օրինակ՝ <code>List&lt;T&gt;</code>,
<code>IList&lt;T&gt;</code>։</li>
</ul>
<p><code>Func&lt;in T, out TResult&gt;</code>-ը գեղեցիկ օրինակ է՝ մուտքը contravariant է, ելքը՝
covariant։</p>`,
        code: `// Func-ը ընդունում է T (in) եւ վերադարձնում է TResult (out)
// public delegate TResult Func<in T, out TResult>(T arg);

Func<Animal, Cat> f = animal => new Cat();

// մուտքը կարելի է նեղացնել (Animal->Cat), ելքը՝ լայնացնել (Cat->Animal).
Func<Cat, Animal> g = f;  // ԱՇԽԱՏՈՒՄ Է`,
        deep: `<p><b>Ավելի խորը՝</b> կոմպիլյատորն ինքը ստուգում է <code>in</code>/<code>out</code>-ի ճշտությունը
interface հայտարարելիս։ Չես կարողանա նշել <code>out T</code>, եթե գաղտնի օգտագործում ես
<code>T</code>-ը որպես մուտք — սա պաշտպանություն է անվտանգ չեղող վերագրումներից։</p>`,
        links: [
          { label: "MS Docs — Using variance in interfaces", url: "https://learn.microsoft.com/en-us/dotnet/standard/generics/creating-variant-generic-interfaces" }
        ],
        task: {
          q: "Func&lt;Animal, Cat&gt; f։ Ո՞ր վերագրումը ճիշտ է",
          options: [
            "Func&lt;Cat, Animal&gt; g = f;",
            "Func&lt;Animal, Dog&gt; g = f;",
            "Func&lt;Cat, Dog&gt; g = f;",
            "List&lt;Animal&gt; g = f;"
          ],
          answer: 0,
          explain: "Մուտքը contravariant է (Animal-ը կարելի է նեղացնել մինչեւ Cat), ելքը՝ covariant (Cat-ը կարելի է լայնացնել մինչեւ Animal)։ Ուրեմն Func<Cat, Animal>-ը հարմար է։"
        }
      }
    ]
  },
  {
    id: "enumerables",
    name: "Enumerables",
    icon: "↻",
    blurb: "Ինչպես է աշխատում foreach-ը, yield-ը, lazy evaluation-ը և ինչու նույն ցուցակը կարելի է երկու անգամ «անցնել» տարբեր ձևով։",
    levels: [
      {
        id: "enum-1",
        title: "IEnumerable և IEnumerator",
        subtitle: "Ինչ է իրականում անում foreach-ը",
        theory: `
<p><code>foreach</code>-ը կարծես կախարդանք լինի, բայց ներսում ընդամենը երկու մասից բաղկացած պարզ պայմանագիր է:</p>
<ul>
<li><b>IEnumerable</b> — «ինձ կարելի է անցնել տարրերով»: Նրա մոտ մեկ մեթոդ կա՝ <code>GetEnumerator()</code>
— «տուր ինձ մի քայլող, որ տարրերով անցնի»:</li>
<li><b>IEnumerator</b> — հենց այդ քայլողը: Նրա մոտ կա <code>MoveNext()</code> («քայլիր հաջորդին,
վերադարձրու true, եթե այդպիսին կա») և <code>Current</code> («ընթացիկ տարրը»):</li>
</ul>
<p><code>foreach</code>-ը պարզապես վերցնում է քայլողին և ցիկլում կանչում է <code>MoveNext()</code>, մինչև
տարրերը վերջանան: Այսքանը:</p>`,
        code: `// foreach (var x in list) { use(x); }
// կոմպիլյատորը սա վերածում է մոտավորապես սրան՝

IEnumerator<int> e = list.GetEnumerator();
while (e.MoveNext())
{
    int x = e.Current;
    use(x);
}
// (և հետո e.Dispose())`,
        deep: `<p><b>Ավելի խորը՝</b> ֆորմալ առումով <code>foreach</code>-ը նույնիսկ չի պահանջում
<code>IEnumerable</code> — բավական է, որ տիպի մոտ <i>լինի մեթոդ</i>
<code>GetEnumerator()</code> իր <code>MoveNext()</code>/<code>Current</code>-ով (duck typing):
Բայց գործնականում գրեթե ամեն ինչ իրականացնում է <code>IEnumerable&lt;T&gt;</code>:</p>`,
        links: [
          { label: "MS Docs — IEnumerable<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.ienumerable-1" },
          { label: "PDF: Iterator pattern (քո ֆայլում)", url: "#" }
        ],
        task: {
          q: "Ինչ է անում foreach-ը «ներսից»:",
          options: [
            "Ամբողջ collection-ը պատճենում է զանգվածի մեջ",
            "Վերցնում է enumerator և ցիկլում կանչում է MoveNext()/Current",
            "Կանչում է GetEnumerator() մեկ անգամ և վերցնում առաջին տարրը",
            "Աշխատում է միայն զանգվածների հետ"
          ],
          answer: 1,
          explain: "foreach = GetEnumerator() + while(MoveNext()) ցիկլ՝ Current-ի կարդալով: Սա հենց Iterator pattern-ն է քո PDF-ից:"
        }
      },
      {
        id: "enum-2",
        title: "yield return",
        subtitle: "Iterator առանց ձեռքով դաս գրելու",
        theory: `
<p>Սեփական <code>IEnumerator</code>-ը ձեռքով գրելը ձանձրալի է: C#-ը տալիս է կախարդական բառերը՝
<code>yield return</code>։ Գրում ես սովորական մեթոդ, իսկ կոմպիլյատորն ինքն է կառուցում քայլողին:</p>
<p>Ամեն <code>yield return</code> նշանակում է՝ «տուր տարրը և <b>սառիր հենց այստեղ</b>»: Հաջորդ
քայլին մեթոդը կշարունակի <b>ճիշտ նույն տեղից</b>, ասես սեղմել ես «դադար/շարունակել»:</p>`,
        code: `public IEnumerable<int> EvenNumbers(int max)
{
    for (int i = 0; i <= max; i += 2)
        yield return i;   // տալիս ենք թիվը և «սառչում»
}

foreach (var n in EvenNumbers(6))
    Console.Write(n + " ");   // 0 2 4 6`,
        deep: `<p><b>Ավելի խորը՝</b> կոմպիլյատորն այդպիսի մեթոդը վերածում է թաքնված դասի՝
<b>վիճակների մեքենայի</b>: Լոկալ փոփոխականները (<code>i</code>) դառնում են այդ դասի դաշտեր,
որպեսզի քայլերի միջև «հիշվեն»: Հենց դրա համար iterator-ը կարող է տալ անվերջ
հաջորդականություն՝ առանց հիշողությունը լցնելու:</p>`,
        links: [
          { label: "MS Docs — yield", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/yield" }
        ],
        task: {
          q: "Ինչ է տեղի ունենում մեթոդի ներսում yield return-ի ժամանակ:",
          options: [
            "Մեթոդն ընդմիշտ ավարտվում է",
            "Տարրը տրվում է, իսկ մեթոդը «սառչում» է և հաջորդ քայլին կշարունակի հենց այդ տեղից",
            "Ամբողջ ցուցակը հաշվվում է միանգամից և վերադարձվում",
            "Ստեղծվում է նոր հոսք"
          ],
          answer: 1,
          explain: "yield return-ը տալիս է հերթական տարրը և դադարեցնում մեթոդը։ Հաջորդ MoveNext()-ը կշարունակի նույն կետից (վիճակների մեքենա):"
        }
      },
      {
        id: "enum-3",
        title: "Lazy evaluation",
        subtitle: "Query-ն չի հաշվվում այն պահին, երբ գրված է",
        theory: `
<p>LINQ-ի և iterator-ների հիմնական գաղափարը՝ նրանք <b>ծույլ</b> են (deferred execution): Երբ գրում ես
<code>list.Where(...)</code>, դեռ ոչինչ <i>չի հաշվվում</i>: Query-ն ընդամենը «նկարագրված» է:
Իրական աշխատանքը սկսվում է միայն այն ժամանակ, երբ սկսում ես <b>անցնել</b> նրա տարրերով (foreach,
<code>ToList()</code>, <code>Count()</code>...):</p>
<p>Այստեղից՝ երկու թակարդ։</p>
<ul>
<li><b>Տվյալները փոխվել են</b> query-ն նկարագրելուց հետո — արդյունքը կցուցադրի նոր տվյալները:</li>
<li><b>Կրկնակի անցում</b> — query-ն կկատարվի երկու անգամ (ավելորդ աշխատանք), իսկ եթե աղբյուրը
փոխվել է — նաև տարբեր արդյունքներ կստանաս:</li>
</ul>`,
        code: `var nums = new List<int> { 1, 2, 3 };

// query-ն ՆԿԱՐԱԳՐՎԱԾ է, բայց ՉԻ կատարվել
var query = nums.Where(n => n > 1);

nums.Add(4);            // փոխում ենք աղբյուրը նկարագրելուց ՀԵՏՈ

foreach (var n in query)
    Console.Write(n + " ");   // 2 3 4  ← չորսն էլ ընկավ մեջը։`,
        deep: `<p><b>Ավելի խորը՝</b> ուզում ես «լուսանկար» հենց հիմա և այստեղ — մատերիալիզացրու query-ն։
<code>.ToList()</code> կամ <code>.ToArray()</code>: Սա կկատարի այն մեկ անգամ և կֆիքսի
արդյունքը: Կանոն։ Եթե query-ով անցնում ես մի քանի անգամ կամ աղբյուրը կարող է փոխվել —
մատերիալիզացրու:</p>`,
        links: [
          { label: "MS Docs — Deferred execution (LINQ)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/linq/standard-query-operators/query-expression-basics" }
        ],
        task: {
          q: "var q = nums.Where(n => n > 1); հետո nums.Add(4); հետո foreach ըստ q-ի: Ինչ կարտածի:",
          options: [
            "Միայն 2 3 — query-ն ֆիքսվեց միանգամից",
            "2 3 4 — query-ն ծույլ է և կատարվեց անցման պահին, արդեն ավելացված տարրով",
            "Սխալ",
            "Ոչինչ"
          ],
          answer: 1,
          explain: "Lazy evaluation. Where-ը ընդամենը նկարագրեց query-ն: Իրական անցումը տեղի ունեցավ foreach-ում՝ արդեն Add-ից հետո, դրա համար 4-ը ընկավ մեջը:"
        }
      },
      {
        id: "enum-4",
        title: "LINQ Enumerable-ի վրայից",
        subtitle: "Շղթաներ, որոնք կարդացվում են ինչպես նախադասություն",
        theory: `
<p>LINQ-ը ընդլայնող մեթոդների հավաքածու է <code>IEnumerable&lt;T&gt;</code>-ի վրա՝
<code>Where</code> (ֆիլտր), <code>Select</code> (ձևափոխել ամեն մեկը),
<code>OrderBy</code> (դասավորել), <code>First</code>, <code>Sum</code> և այլն: Ամեն մեկը
ընդունում է <code>IEnumerable</code> և վերադարձնում <code>IEnumerable</code> — դրա համար էլ նրանք
կարող են շարվել շղթայի մեջ:</p>
<p>Քանի դեռ շղթան «մատերիալիզացված» չէ, այս ամենը մեկ ծույլ խողովակ է, որով տարրերը
հոսում են մեկ-մեկ:</p>`,
        code: `var people = new[] { "anna", "bob", "alex", "kate" };

var result = people
    .Where(n => n.StartsWith("a"))  // anna, alex
    .Select(n => n.ToUpper())       // ANNA, ALEX
    .OrderBy(n => n);               // ALEX, ANNA

foreach (var n in result)
    Console.WriteLine(n);           // ALEX \n ANNA`,
        deep: `<p><b>Ավելի խորը՝</b> <code>Where/Select</code>-ի նման մեթոդները <i>հետաձգված</i> են
(վերադարձնում են ծույլ <code>IEnumerable</code>): Իսկ <code>ToList/Count/First/Sum</code>-ը
<i>անմիջական</i> են (միանգամից գործի են դնում անցումը): Իմանալ՝ ով որն է, նշանակում է
հասկանալ LINQ-ի արագագործության կեսը:</p>`,
        links: [
          { label: "MS Docs — LINQ overview", url: "https://learn.microsoft.com/en-us/dotnet/csharp/linq/" },
          { label: "Գիրք՝ C# in Depth — LINQ", url: "https://csharpindepth.com/" }
        ],
        task: {
          q: "Այս մեթոդներից որոնք ՉԵՆ կատարում անցումը միանգամից (հետաձգված են):",
          options: [
            "ToList և ToArray",
            "Count և Sum",
            "Where և Select",
            "First և Last"
          ],
          answer: 2,
          explain: "Where/Select-ը ընդամենը կառուցում են ծույլ շղթա: ToList, Count, Sum, First — ընդհակառակը, անմիջապես գործի են դնում անցումը:"
        }
      }
    ]
  },
  {
    id: "filestream",
    name: "FileStream I/O",
    icon: "⤓",
    blurb: "byte-երի stream-եր, ֆայլերի կարդալ/գրել, using և Dispose, ասինխրոն մուտք-ելք։",
    levels: [
      {
        id: "fs-1",
        title: "Ի՞նչ է stream-ը",
        subtitle: "Խողովակ, որով byte-երը հոսում են",
        theory: `
<p>Սկավառակի վրա գտնվող ֆայլը ընդամենը byte-երի երկար ժապավեն է։ Որպեսզի դրա հետ աշխատենք, .NET-ը տալիս է
<b>Stream</b> — վերացարկում, որը նշանակում է «խողովակ, որով byte-երը գնում են այս կամ այն ուղղությամբ»։</p>
<p>Ամենահանճարեղն այն է, որ <code>Stream</code>-ը ընդհանուր լեզու է։ Ֆայլը, ցանցը, հիշողությունը — այս ամենը
stream-եր են նույն <code>Read</code>/<code>Write</code> մեթոդներով։ Սովորեցիր մեկը —
հասկացար բոլորը։</p>
<p><code>FileStream</code>-ը stream է, որը կապված է ֆայլին։ Նրա մեջ կա «դիրքի ցուցիչ»
(<code>Position</code>), որը շարժվում է կարդալու/գրելու ընթացքում։</p>`,
        code: `// ցանկացած Stream-ի մոտ կա ընդհանուր հավաքածու:
//   Read(buffer, offset, count)  — կարդալ byte-երը buffer-ի մեջ
//   Write(buffer, offset, count) — գրել byte-երը
//   Position                     — որտեղ ենք հիմա stream-ի մեջ
//   Length                       — ընդհանուր որքան կա
//   Dispose()                    — փակել և ազատել ֆայլը

// FileStream — Stream, որը «նայում է» սկավառակի վրայի ֆայլին`,
        deep: `<p><b>Ավելի խորը:</b> stream-երն աշխատում են <b>byte</b>-երի հետ, ոչ թե տեքստի։ Տեքստն արդեն
byte-երի մեկնաբանություն է encoding-ի միջոցով (UTF-8 և այլն)։ Դրա համար byte-երի stream-երի վրայից կան
հարմար «փաթաթաններ» ինչպիսիք են <code>StreamReader/StreamWriter</code> — նրանց մասին ավելի ուշ։</p>`,
        links: [
          { label: "MS Docs — Stream դասը", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.stream" },
          { label: "MS Docs — Ֆայլերի և stream-երի I/O", url: "https://learn.microsoft.com/en-us/dotnet/standard/io/" }
        ],
        task: {
          q: "Ինչո՞ւ է Stream-ը հարմար վերացարկում",
          options: [
            "Նա աշխատում է միայն ֆայլերի հետ",
            "Ֆայլը, ցանցը և հիշողությունն ունեն նույն Read/Write ինտերֆեյսը — կոդը վերաօգտագործվում է",
            "Նա byte-երն ինքնաբերաբար վերածում է տեքստի",
            "Նա զանգվածից արագ է"
          ],
          answer: 1,
          explain: "Stream-ը տալիս է գործողությունների միասնական հավաքածու byte-երի տարբեր աղբյուրների համար։ Միևնույն կոդն աշխատում է և ֆայլի, և ցանցի, և հիշողության հետ։"
        }
      },
      {
        id: "fs-2",
        title: "byte-երի կարդալ և գրել",
        subtitle: "FileStream ուղղակիորեն",
        theory: `
<p>Բացում ենք ֆայլը <code>FileStream</code>-ի միջոցով, նշում ենք ռեժիմը (<code>FileMode</code>՝
ստեղծել, բացել, ավելացնել...). byte-երի զանգվածը գրում ենք <code>Write</code>-ով, կարդում ենք՝
<code>Read</code>-ով։</p>
<p><code>Read</code>-ը վերադարձնում է <b>իրականում քանի byte է կարդացվել</b> (կարող է ավելի քիչ լինել, քան
խնդրել ես — ֆայլը վերջացել է)։ Սա կարևոր է։ Չի կարելի ենթադրել, որ մեկ <code>Read</code>-ով կկարդացվի
ամեն ինչ։</p>`,
        code: `byte[] data = { 72, 105 }; // "Hi" ASCII-ով

// գրում
using (var fs = new FileStream("out.bin", FileMode.Create))
{
    fs.Write(data, 0, data.Length);
}

// կարդում
using (var fs = new FileStream("out.bin", FileMode.Open))
{
    byte[] buffer = new byte[16];
    int read = fs.Read(buffer, 0, buffer.Length);
    // read == 2 — կարդացինք հենց 2 byte
}`,
        deep: `<p><b>Ավելի խորը:</b> <code>Read</code>-ը կարող է վերադարձնել խնդրվածից քիչ նույնիսկ
ֆայլի մեջտեղում (հատկապես ցանցային stream-երի մոտ)։ Դրա համար «կարդալ ամեն ինչը» սովորաբար անում են <b>ցիկլով</b>,
քանի դեռ <code>Read</code>-ը 0 չի վերադարձնում, կամ վերցնում են պատրաստի <code>File.ReadAllBytes</code>-ը։</p>`,
        links: [
          { label: "MS Docs — FileStream", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.filestream" },
          { label: "MS Docs — FileMode enum", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.filemode" }
        ],
        task: {
          q: "Ի՞նչ է վերադարձնում fs.Read(buffer, 0, count)-ը",
          options: [
            "Միշտ count",
            "Իրականում կարդացված byte-երի քանակը (կարող է count-ից քիչ լինել, վերջում՝ 0)",
            "Կարդացված byte-երի զանգվածը",
            "true/false — հաջողվե՞ց, թե՞ ոչ"
          ],
          answer: 1,
          explain: "Read-ը վերադարձնում է փաստացի կարդացված byte-երի քանակը։ Ամբողջը կարդալը սովորաբար անում են ցիկլով, մինչև որ 0 վերադարձվի։"
        }
      },
      {
        id: "fs-3",
        title: "using և Dispose",
        subtitle: "Ֆայլը պետք է փակել — միշտ",
        theory: `
<p>Բացված ֆայլը ռեսուրս է, որը պահում է օպերացիոն համակարգը։ Եթե դա չփակես, ֆայլը
կարող է մնալ «զբաղված», տվյալները՝ չհասնել սկավառակին, իսկ ռեսուրսները՝ արտահոսել։</p>
<p><code>FileStream</code>-ը իրականացնում է <code>IDisposable</code>-ը — նրա մոտ կա
<code>Dispose()</code>, որը փակում է ֆայլը։ Բայց ձեռքով կանչելը ռիսկային է։ Կթռչի
բացառություն — և <code>Dispose</code>-ը չի կատարվի։</p>
<p>Լուծումը <code>using</code>-ն է։ Նա <b>երաշխավորում</b> է <code>Dispose()</code>-ի կանչը բլոկից
դուրս գալիս, նույնիսկ եթե սխալ է եղել։</p>`,
        code: `// Դասական using-բլոկ:
using (var fs = new FileStream("a.txt", FileMode.Create))
{
    // ...աշխատում ենք...
} // <-- այստեղ Dispose()-ը կկանչվի ինքնաբերաբար, նույնիսկ բացառության դեպքում

// Ժամանակակից using-declaration (C# 8+):
using var fs2 = new FileStream("b.txt", FileMode.Create);
// Dispose()-ը կկանչվի ընթացիկ բլոկի { } վերջում`,
        deep: `<p><b>Ավելի խորը:</b> տեքստային փաթաթան <code>StreamWriter</code>-ի դեպքում
<code>Dispose</code>-ը նաև <b>դատարկում է buffer-ը</b> (<code>Flush</code>) — գրում է
չգրվածը սկավառակին։ Մոռացար փակել — կարող ես կորցնել վերջին տվյալները։ Դրա համար
<code>using</code>-ը այստեղ ոչ թե «լավ պրակտիկա» է, այլ անհրաժեշտություն։</p>`,
        links: [
          { label: "MS Docs — using հրահանգը", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/using" },
          { label: "MS Docs — IDisposable", url: "https://learn.microsoft.com/en-us/dotnet/api/system.idisposable" }
        ],
        task: {
          q: "Ինչո՞ւ FileStream-ը փաթաթել using-ի մեջ",
          options: [
            "Որպեսզի կոդն ավելի կարճ լինի",
            "Որպեսզի Dispose()-ը (ֆայլի փակումը և buffer-ի դատարկումը) կատարվի երաշխավորված, նույնիսկ բացառության դեպքում",
            "using-ը արագացնում է կարդալը",
            "Առանց using-ի ֆայլը հնարավոր չէ բացել"
          ],
          answer: 1,
          explain: "using-ը երաշխավորում է Dispose-ի կանչը բլոկից ցանկացած ձևով դուրս գալիս — ֆայլը կփակվի և buffer-ը կդատարկվի, նույնիսկ եթե ներսում բացառություն է թռել։"
        }
      },
      {
        id: "fs-4",
        title: "Տեքստ, buffer-ներ և async",
        subtitle: "Հարմար փաթաթաններ և չբլոկավորող I/O",
        theory: `
<p>byte-երի հետ ձեռքով աշխատելը անհարմար է, եթե տեքստ է պետք։ <code>StreamWriter</code>-ը և
<code>StreamReader</code>-ը փաթաթաններ են, որոնք իրենք են տեքստը ↔ byte-եր վերածում encoding-ի միջոցով։</p>
<p>Բացի այդ, սկավառակն ու ցանցը <b>դանդաղ</b> են։ Քանի դեռ ֆայլը կարդացվում է, ծրագրի հոսքը պարապ է մնում։
Ասինխրոն տարբերակները (<code>ReadAsync</code>/<code>WriteAsync</code> + <code>await</code>)
չեն բլոկավորում հոսքը։ Ծրագիրը կարող է այլ բանով զբաղվել, մինչ մուտք-ելքը ընթանում է։</p>`,
        code: `// Տեքստը փաթաթանների միջոցով:
using (var writer = new StreamWriter("log.txt"))
{
    writer.WriteLine("Բարև, ֆայլ!");
}

using (var reader = new StreamReader("log.txt"))
{
    string line = reader.ReadLine();
}

// Ասինխրոն (չի բլոկավորում հոսքը):
async Task SaveAsync()
{
    using var fs = new FileStream("big.bin", FileMode.Create,
                                  FileAccess.Write, FileShare.None,
                                  bufferSize: 4096, useAsync: true);
    byte[] data = new byte[1000];
    await fs.WriteAsync(data, 0, data.Length);
}`,
        deep: `<p><b>Ավելի խորը:</b> <code>bufferSize</code>-ը սահմանում է, թե քանի byte կուտակել
սկավառակին իրական դիմելուց առաջ — մեծ բլոկներով աշխատելն ավելի արագ է, քան byte-առ-byte։
Իսկական ասինխրոն I/O-ի համար կարևոր է stream-ը բացել <code>useAsync: true</code>-ով, հակառակ դեպքում
<code>WriteAsync</code>-ը ներսում կարող է սինխրոն աշխատել։</p>`,
        links: [
          { label: "MS Docs — StreamReader / StreamWriter", url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.streamreader" },
          { label: "MS Docs — Ասինխրոն ֆայլային I/O", url: "https://learn.microsoft.com/en-us/dotnet/standard/io/asynchronous-file-i-o" }
        ],
        task: {
          q: "Ինչո՞վ է օգտակար await fs.WriteAsync(...)-ը fs.Write(...)-ի փոխարեն",
          options: [
            "Նա միշտ ավելի արագ է գրում byte-երը",
            "Չի բլոկավորում հոսքը դանդաղ I/O-ի ընթացքում — ծրագիրը կարող է այլ բանով զբաղվել",
            "Նա չի պահանջում փակել ֆայլը",
            "Նա սեղմում է տվյալները"
          ],
          answer: 1,
          explain: "Async I/O-ն ազատում է հոսքը սկավառակի/ցանցի սպասման ընթացքում։ Սա արձագանքելիության և մասշտաբայնության մասին է, ոչ թե բուն գրելու արագության։"
        }
      }
    ]
  },
  {
    id: "creational",
    name: "Patterns: Creational",
    icon: "⚒",
    blurb: "Ինչպես ստեղծել օբյեկտներ ճկուն և ապահով ձևով՝ Singleton, Factory Method, Abstract Factory, Builder.",
    levels: [
      {
        id: "pat-singleton",
        title: "Singleton",
        subtitle: "Ճիշտ մեկ instance ամբողջ ծրագրի համար",
        theory: `
<p><b>Խնդիրը՝</b> երաշխավորել, որ օբյեկտը գոյություն ունի <b>միայն մեկ</b> օրինակով, և բոլորին տալ
նրան դիմելու ընդհանուր կետ։ Օրինակ՝ ծրագրի միասնական կարգավորումները։</p>
<p>Հնարքը՝ constructor-ը դարձնում են <code>private</code> (դրսից ոչ ոք չի կարող ստեղծել), իսկ
ներսում class-ը պահում է միակ instance-ը և տալիս է այն ստատիկ <code>Instance</code> հատկության միջոցով։</p>
<p><b>Զգույշ եղիր՝</b> Singleton-ը հաճախ անվանում են նաև <i>անտի-pattern</i> — դա թաքնված գլոբալ
վիճակ է։ Օգտագործիր այն <b>անփոփոխ</b> բաների համար (կարգավորումներ, cache), ոչ թե բիզնես-տվյալների։</p>`,
        code: `public sealed class AppConfig
{
    // Lazy: օբյեկտը ստեղծվում է առաջին դիմելու պահին, thread-safe ձևով
    private static readonly Lazy<AppConfig> _instance =
        new(() => new AppConfig());

    public static AppConfig Instance => _instance.Value;

    public string Environment { get; } = "Production";

    private AppConfig() { }   // դրսից ոչ ոք new չի կանչի
}

// Օգտագործումը՝
string env = AppConfig.Instance.Environment;`,
        deep: `<p><b>Ավելի խորը՝</b> <code>Lazy&lt;T&gt;</code>-ն տալիս է thread-safe &quot;lazy&quot;
նախնականացում — instance-ը ստեղծվում է ուղիղ մեկ անգամ, նույնիսկ եթե մի քանի thread միաժամանակ
դիմեն։ Ժամանակակից C#-ում դասական Singleton-ի փոխարեն հաճախ ծառայությունը գրանցում են որպես
<i>singleton</i> DI-կոնտեյներում — այդպես ավելի հեշտ է թեստավորել (կարելի է փոխարինել)։</p>`,
        links: [
          { label: "PDF §7.1 Singleton (քո ֆայլը)", url: "#" },
          { label: "Refactoring.Guru — Singleton", url: "https://refactoring.guru/design-patterns/singleton" }
        ],
        task: {
          q: "Ինչու՞ Singleton-ի constructor-ը դարձնում են private:",
          options: [
            "Որպեսզի class-ից հնարավոր չլինի ժառանգել",
            "Որպեսզի դրսից հնարավոր չլինի new-ով ստեղծել երկրորդ instance",
            "Արագության համար",
            "Այդպես է պահանջում կոմպիլյատորը"
          ],
          answer: 1,
          explain: "private constructor-ը փակում է դրսից ստեղծելու հնարավորությունը։ Միակ instance-ը class-ը ստեղծում է ինքն ու տալիս է Instance-ի միջոցով։"
        }
      },
      {
        id: "pat-factory-method",
        title: "Factory Method",
        subtitle: "Օբյեկտի ստեղծում, բայց թե որ class-ը՝ որոշում է ենթաclass-ը",
        theory: `
<p><b>Խնդիրը՝</b> կոդը պետք է կախված լինի <b>վերացականությունից</b> (interface-ից), իսկ թե <i>որ
կոնկրետ class</i> ստեղծել — թող որոշի առանձին &quot;ֆաբրիկան&quot;։</p>
<p>Սահմանում ենք արտադրանքի interface (<code>IReport</code>) և վերացական ֆաբրիկա
<code>Create()</code> մեթոդով։ Ամեն կոնկրետ ֆաբրիկա վերադարձնում է իր արտադրանքը։ Հաճախորդը
աշխատում է միայն interface-ների հետ և ոչինչ չգիտի կոնկրետ class-երի մասին։</p>`,
        code: `public interface IReport { string Render(); }

public class PdfReport   : IReport { public string Render() => "PDF report"; }
public class ExcelReport : IReport { public string Render() => "Excel report"; }

public abstract class ReportFactory
{
    public abstract IReport Create();   // ֆաբրիկային մեթոդ
}

public class PdfReportFactory   : ReportFactory
{ public override IReport Create() => new PdfReport(); }

public class ExcelReportFactory : ReportFactory
{ public override IReport Create() => new ExcelReport(); }

// Հաճախորդը գիտի միայն IReport և ReportFactory՝
ReportFactory factory = new PdfReportFactory();
IReport report = factory.Create();`,
        deep: `<p><b>Ավելի խորը՝</b> իմաստը՝ հանել <code>new ConcreteClass()</code>-ը հաճախորդի
կոդից և տանել մեկ տեղ։ Այդ դեպքում նոր տեսակի հաշվետվություն ավելացնելը նշանակում է նոր ֆաբրիկա
ավելացնել՝ առանց հաճախորդին դիպչելու (բացության/փակության սկզբունք)։ Միշտ վերադարձրու
<b>interface</b>, երբեք ոչ կոնկրետ class։</p>`,
        links: [
          { label: "PDF §7.2 Factory Method", url: "#" },
          { label: "Refactoring.Guru — Factory Method", url: "https://refactoring.guru/design-patterns/factory-method" }
        ],
        task: {
          q: "Ո՞րն է Factory Method-ի հիմնական իմաստը:",
          options: [
            "Արագ ստեղծել շատ օբյեկտներ",
            "Հաճախորդից հանել կոնկրետ class-երի ստեղծումը — նա կախված է միայն interface-ից",
            "Երաշխավորել մեկ instance",
            "Արագացնել հաշվետվությունների ցուցադրումը"
          ],
          answer: 1,
          explain: "Հաճախորդը աշխատում է IReport/ReportFactory-ի հետ և ոչինչ չգիտի PdfReport/ExcelReport-ի մասին։ Կոնկրետ class-ի ընտրությունը թաքնված է ֆաբրիկայի ներսում։"
        }
      },
      {
        id: "pat-abstract-factory",
        title: "Abstract Factory",
        subtitle: "Համատեղելի օբյեկտների ամբողջ ընտանիքի ստեղծում",
        theory: `
<p><b>Խնդիրը՝</b> ստեղծել ոչ թե մեկ օբյեկտ, այլ <b>իրար հետ կապված</b> օբյեկտների
<b>ընտանիք</b>, որոնք պետք է իրար սազեն։ Դասական օրինակ՝ UI-տարրերի հավաքածու Windows-ի կամ
Mac-ի համար — կոճակն ու երկխոսության պատուհանը պետք է լինեն &quot;մեկ ոճով&quot;։</p>
<p>Տարբերությունը Factory Method-ից՝ Factory Method-ը սարքում է <b>մեկ</b> արտադրանք,
Abstract Factory-ն՝ արտադրանքների <b>ընտանիք</b> (կոճակ + երկխոսություն + մենյու մեկ ոճով)։</p>`,
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
// MacUiFactory — նույն ձևով, բայց Mac-տարրերով`,
        deep: `<p><b>Ավելի խորը՝</b> մեկ ֆաբրիկան երաշխավորում է, որ բոլոր տարրերը նույն
ընտանիքից են (չես խառնի <code>WinButton</code>-ը <code>MacDialog</code>-ի հետ)։ Գինը՝
<i>արտադրանքի նոր տեսակ</i> ավելացնելը (օրինակ՝ մենյու) նշանակում է մեթոդ ավելացնել
<b>բոլոր</b> ֆաբրիկաներում։</p>`,
        links: [
          { label: "PDF §7.3 Abstract Factory", url: "#" },
          { label: "Refactoring.Guru — Abstract Factory", url: "https://refactoring.guru/design-patterns/abstract-factory" }
        ],
        task: {
          q: "Ինչո՞վ է Abstract Factory-ն տարբերվում Factory Method-ից:",
          options: [
            "Ոչնչով, դրանք նույն բանն են",
            "Abstract Factory-ն ստեղծում է կապված օբյեկտների ընտանիք, իսկ Factory Method-ը՝ մեկ արտադրանք",
            "Factory Method-ը ավելի բարդ է",
            "Abstract Factory-ն աշխատում է միայն UI-ի հետ"
          ],
          answer: 1,
          explain: "Factory Method — արտադրանքի մեկ տեսակ։ Abstract Factory — համատեղելի արտադրանքների ամբողջ ընտանիք (կոճակ + երկխոսություն + մենյու մեկ ոճով)."
        }
      },
      {
        id: "pat-builder",
        title: "Builder",
        subtitle: "Բարդ օբյեկտը հավաքել քայլ առ քայլ",
        theory: `
<p><b>Խնդիրը՝</b> օբյեկտն ունի շատ դաշտեր, մի մասը՝ ոչ պարտադիր։ Տասը պարամետրով constructor-ը
անընթեռնելի է։ <b>Builder</b>-ը հավաքում է օբյեկտը <i>քայլ առ քայլ</i>, և ամեն քայլը՝
հասկանալի անուն ունեցող մեթոդ է։</p>
<p>&quot;fluent&quot; հնարքը (հոսուն interface)՝ ամեն մեթոդ վերադարձնում է <code>this</code>, դրա
համար կանչերը շարվում են շղթայի մեջ, որը կարդացվում է ինչպես նախադասություն։</p>`,
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

// Կարդացվում է ինչպես նախադասություն՝
var invoice = new InvoiceBuilder()
    .ForCustomer("Anna")
    .AddLine("Coffee")
    .WithDiscount(0.1m)
    .Build();`,
        deep: `<p><b>Ավելի խորը՝</b> <code>Build()</code>-ի մեջ լավ է ստուգել պարտադիր դաշտերը և
հասկանալի սխալով ընկնել, եթե ինչ-որ բան պակասում է (&quot;fail fast&quot;). Builder-ը
կարճատև է՝ ամեն արտադրանքի համար ստեղծիր նորը, այլապես վիճակը &quot;կկաթի&quot; կանչերի միջև։</p>`,
        links: [
          { label: "PDF §7.4 Builder", url: "#" },
          { label: "Refactoring.Guru — Builder", url: "https://refactoring.guru/design-patterns/builder" }
        ],
        task: {
          q: "Ինչու՞ builder-ի մեթոդները վերադարձնում են this:",
          options: [
            "Որպեսզի հիշողություն խնայեն",
            "Որպեսզի կանչերը շարվեն ընթեռնելի շղթայի մեջ (fluent interface)",
            "Այդպես է պահանջում IBuilder interface-ը",
            "Որպեսզի օբյեկտը դառնա անփոփոխ"
          ],
          answer: 1,
          explain: "this վերադարձնելը թույլ է տալիս գրել .ForCustomer(...).AddLine(...).Build() մեկ շղթայով — սա հենց fluent-ոճն է։"
        }
      }
    ]
  },
  {
    id: "structural",
    name: "Patterns: Structural",
    icon: "▤",
    blurb: "Ինչպես օբյեկտներից կառուցվածքներ հավաքել՝ Adapter, Decorator, Composite.",
    levels: [
      {
        id: "pat-adapter",
        title: "Adapter",
        subtitle: "Անցումային խրոց երկու անհամատեղելի interface-ների միջև",
        theory: `
<p><b>Խնդիրը՝</b> քո մոտ կա ուրիշի գրած class (կողմնակի SDK, հին լեգասի կոդ) «անհարմար»
interface-ով, իսկ քո կոդը սպասում է <i>ուրիշ</i> interface։ Ուրիշի կոդը փոխել չի կարելի։
<b>Adapter</b>-ը հենց այդ խրոցն է՝ իրականացնում է <i>քո</i> interface-ը, իսկ ներսում կանչերը
թարգմանում է ուրիշի լեզվով։</p>
<p>Ինչպես վարդակի իրական խրոցը՝ դրսից քո խրուցակն է, ներսից՝ ուրիշի ձևաչափը։</p>`,
        code: `public interface IPaymentGateway   // այն, ինչ սպասում է քո կոդը
{
    PaymentResult Charge(PaymentRequest request);
}

// Ուրիշի SDK-ն, որը փոխել չի կարելի:
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
        // թարգմանում ենք ՔՈ հարցումը -> SDK-ի ձևաչափ
        var sdkReq = new SdkChargeRequest {
            AmountInCents = (long)(request.Amount * 100m),
            CurrencyCode  = request.Currency,
            Token         = request.CardToken
        };
        var resp = _sdk.ExecuteCharge(sdkReq);
        // և հետ՝ SDK-ի պատասխանը -> ՔՈ ձևաչափ
        return new PaymentResult { Success = resp.Status == "OK" };
    }
}`,
        deep: `<p><b>Ավելի խորը՝</b> պահիր adapter-ը <b>բարակ</b> — նա միայն interface-ը
թարգմանում է, բիզնես-տրամաբանություն չի ավելացնում։ Վտանգը «իմաստային անհամապատասխանությունն» է՝
մեթոդները նման տեսք ունեն, բայց այլ կերպ են աշխատում։ Այդպիսի տարբերությունները փաստագրիր։</p>`,
        links: [
          { label: "PDF §8.1 Adapter", url: "#" },
          { label: "Refactoring.Guru — Adapter", url: "https://refactoring.guru/design-patterns/adapter" }
        ],
        task: {
          q: "Ի՞նչ է անում Adapter-ը",
          options: [
            "Class-ի վրայից ավելացնում է նոր բիզնես-տրամաբանություն",
            "Իրականացնում է քեզ պետք եղած interface-ը, իսկ ներսում կանչերը թարգմանում է ուրիշի անհամատեղելի API-ի",
            "Ստեղծում է միակ օրինակը",
            "Հավաքում է օբյեկտը քայլ առ քայլ"
          ],
          answer: 1,
          explain: "Adapter-ը խրոց է՝ դրսից քո interface-ը, ներսում՝ թարգմանություն ուրիշի interface-ի։ Ուրիշի կոդն այդ ընթացքում չի փոխվում։"
        }
      },
      {
        id: "pat-decorator",
        title: "Decorator",
        subtitle: "Ավելացնել վարքագիծ՝ օբյեկտը փաթաթելով",
        theory: `
<p><b>Խնդիրը՝</b> օբյեկտին ավելացնել հնարավորություններ (լոգավորում, cache, սխալի դեպքում
կրկնում) առանց ամեն համադրության համար մի կույտ ենթաclass ստեղծելու։ <b>Decorator</b>-ը
«փաթաթում» է օբյեկտը նույն interface-ն ունեցող մի ուրիշ օբյեկտի մեջ՝ ավելացնելով իր վարքագիծը
կանչից առաջ կամ հետո։</p>
<p>Ինչպես հագուստը՝ մարմինը մեկ է, բայց շերտերը կարող ես հագնել այնքան, ինչքան ուզես, ցանկացած
հերթականությամբ։ Ամեն շերտ նույն «մարդն» է (նույն interface-ը), պարզապես ինչ-որ հավելումով։</p>`,
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
        Console.WriteLine($"[LOG] եղանակի հարցում {city} քաղաքի համար");
        var result = Inner.GetCurrent(city);   // պատվիրակում ենք ներսի օբյեկտին
        Console.WriteLine($"[LOG] պատասխան: {result}");
        return result;
    }
}

// Հավաքում ենք շերտերը:
IWeatherClient client = new LoggingDecorator(new HttpWeatherClient());`,
        deep: `<p><b>Ավելի խորը՝</b> decorator-ների <b>հերթականությունը</b> կարևոր է՝ retry-ը
logging-ի վրայից և logging-ը retry-ի վրայից տարբեր կերպ են աշխատում։ Հենց այսպես են կառուցված
middleware-խողովակաշարերը (ASP.NET)։ Մինուսը՝ խորը փաթաթվածությունը դժվարացնում է կանչերի
շղթան կարդալը։</p>`,
        links: [
          { label: "PDF §8.2 Decorator", url: "#" },
          { label: "Refactoring.Guru — Decorator", url: "https://refactoring.guru/design-patterns/decorator" }
        ],
        task: {
          q: "Ինչպե՞ս է Decorator-ը վարքագիծ ավելացնում օբյեկտին",
          options: [
            "Փոխում է օբյեկտի սկզբնական class-ը",
            "Փաթաթում է օբյեկտը նույն interface-ն ունեցող ուրիշի մեջ՝ ավելացնելով տրամաբանություն կանչից առաջ/հետո և պատվիրակելով ներսի օբյեկտին",
            "Ամեն ֆունկցիաների համադրության համար ստեղծում է ենթաclass",
            "Պահում է մեկ օրինակ ամբողջ ծրագրի համար"
          ],
          answer: 1,
          explain: "Decorator-ը իրականացնում է նույն interface-ը, պահում է հղում «ներսի» օբյեկտին, ավելացնում է իրենը և կանչը փոխանցում ներս։ Շերտերը համադրվում են։"
        }
      },
      {
        id: "pat-composite",
        title: "Composite",
        subtitle: "Tree, որտեղ տերևն ու ճյուղը մշակվում են նույն կերպ",
        theory: `
<p><b>Խնդիրը՝</b> աշխատել ծառանման կառուցվածքի հետ (թղթապանակներ/ֆայլեր, ապրանքների
կատեգորիաներ, կազմակերպության կառուցվածք) այնպես, որ client-ը <b>չտարբերի</b> առանձին տարրը
(տերևը) և խումբը (ճյուղը)։</p>
<p>Եւ տերևը, և ճյուղը իրականացնում են <b>մեկ interface</b>։ Ճյուղը ներսում պահում է իր
զավակներին և երբ իրեն խնդրում են հաշվել կամ նկարել, recursion-ով հարցնում է իր զավակներին։</p>`,
        code: `public interface ICatalogNode { decimal GetTotalPrice(); }

// Տերևը՝ կոնկրետ ապրանք
public class ProductItem : ICatalogNode
{
    public decimal Price { get; }
    public ProductItem(decimal price) => Price = price;
    public decimal GetTotalPrice() => Price;
}

// Ճյուղը՝ կատեգորիա զավակներով
public class CategoryNode : ICatalogNode
{
    private readonly List<ICatalogNode> _children = new();
    public void Add(ICatalogNode node) => _children.Add(node);
    // recursion-ով գումարում ենք զավակներին — կարևոր չէ՝ տերև է, թե ճյուղ
    public decimal GetTotalPrice() => _children.Sum(c => c.GetTotalPrice());
}

var phones = new CategoryNode();
phones.Add(new ProductItem(999m));
phones.Add(new ProductItem(899m));
var accessories = new CategoryNode();
accessories.Add(new ProductItem(39m));
phones.Add(accessories);           // ճյուղը դնում ենք ճյուղի մեջ
decimal total = phones.GetTotalPrice();  // 1937`,
        deep: `<p><b>Ավելի խորը՝</b> գեղեցկությունն այն է, որ մեկ <code>GetTotalPrice()</code> կանչը
աշխատում է ցանկացած խորության վրա։ Ռիսկերը՝ շատ խորը tree-երը կարող են հասնել recursion-ի
սահմանաչափին, իսկ պատահական ցիկլերը (ճյուղը հղվում է ինքն իրեն) կտան անվերջ շրջում։ Պաշտպանիր
tree-ի ամբողջականությունը։</p>`,
        links: [
          { label: "PDF §8.3 Composite", url: "#" },
          { label: "Refactoring.Guru — Composite", url: "https://refactoring.guru/design-patterns/composite" }
        ],
        task: {
          q: "Ո՞րն է Composite-ի հիմնական գաղափարը",
          options: [
            "Պահել tree-ի մեկ օրինակը",
            "Տերևն ու ճյուղը իրականացնում են մեկ interface, դրա համար client-ը նրանց մշակում է նույն կերպ (recursion-ով)",
            "Փաթաթել օբյեկտը՝ տրամաբանություն ավելացնելու համար",
            "Մի interface-ը թարգմանել ուրիշի"
          ],
          answer: 1,
          explain: "Composite-ը տերևն ու պարունակիչը դարձնում է փոխարինելի ընդհանուր interface-ի միջոցով։ Գործողությունը կանչվում է միատեսակ և recursion-ով իջնում tree-ով ներքև։"
        }
      }
    ]
  },
  {
    id: "behavioral",
    name: "Patterns: Behavioral",
    icon: "⇄",
    blurb: "Ինչպես են օբյեկտները շփվում իրար հետ և փոխում իրենց վարքը՝ Iterator, Observer, Command, Strategy, State, Chain of Responsibility.",
    levels: [
      {
        id: "pat-iterator",
        title: "Iterator",
        subtitle: "Անցնել տարրերի վրայով՝ առանց ներսը բացելու",
        theory: `
<p><b>Խնդիրը՝</b> տալ մի եղանակ, որով կարելի է հավաքածուի տարրերով անցնել մեկ առ մեկ՝ առանց
ցույց տալու, թե ներսում ինչպես է այն կառուցված։ C#-ում այս pattern-ը <b>ներդրված</b> է՝
<code>IEnumerable&lt;T&gt;</code> + <code>IEnumerator&lt;T&gt;</code>, իսկ <code>yield return</code>-ը
iterator-ը կառուցում է քո փոխարեն։</p>
<p>Դու սա արդեն տեսել ես Enumerables աշխարհում — նույն pattern-ն է, պարզապես հիմա նայում ենք
GoF-ի աչքերով։</p>`,
        code: `public class EvenNumbers : IEnumerable<int>
{
    private readonly int _max;
    public EvenNumbers(int max) => _max = max;

    public IEnumerator<int> GetEnumerator()
    {
        for (int i = 0; i <= _max; i += 2)
            yield return i;     // compiler-ը կառուցում է iterator-ը
    }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

foreach (var n in new EvenNumbers(6))
    Console.Write(n + " ");     // 0 2 4 6`,
        deep: `<p><b>Ավելի խորը՝</b> C#-ի iterator-ը <b>ծույլ</b> է և աշխատում է միայն այն պահին,
երբ հաջորդ տարրը խնդրում ես։ Դրական կողմը՝ կարելի է վերադարձնել անվերջ կամ հոսքային
հաջորդականություններ։ Բացասականը՝ երկրորդ անգամ անցնելիս ամբողջ տրամաբանությունը սկսվում է
զրոյից։ Եթե պետք է լուսանկար-վիճակ, օգտագործիր <code>ToList()</code>։</p>`,
        links: [
          { label: "PDF §9.1 Iterator", url: "#" },
          { label: "MS Docs — IEnumerator<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.ienumerator-1" }
        ],
        task: {
          q: "C#-ում Iterator pattern-ը սովորաբար ինչպես է իրականացվում?",
          options: [
            "Միշտ պետք է ձեռքով գրել սեփական IEnumerator դասը — այլ ճանապարհ չկա",
            "IEnumerable<T>-ի և yield return-ի միջոցով — compiler-ը iterator-ը կառուցում է ինքը",
            "Singleton-ի միջոցով",
            "Հավաքածուն զանգվածի մեջ պատճենելով"
          ],
          answer: 1,
          explain: "Iterator-ը լեզվի մեջ արդեն կա։ Իրականացնում ես GetEnumerator-ը yield return-ով և ստանում ես պատրաստ ծույլ iterator, որը թաքցնում է հավաքածուի ներսը։"
        }
      },
      {
        id: "pat-observer",
        title: "Observer",
        subtitle: "Մեկը փոխվում է — շատերն իմանում են",
        theory: `
<p><b>Խնդիրը՝</b> երբ մի օբյեկտ (publisher-ը) փոխվում է, բոլոր հետաքրքրվածները
(subscriber-ները) պետք է ինքնաբերաբար իմանան այդ մասին, ընդ որում publisher-ը <b>չգիտի</b>, թե
կոնկրետ ով է բաժանորդագրված։</p>
<p>Publisher-ը պահում է subscriber-ների ցուցակը և փոփոխության պահին անցնում է նրանցով՝ կանչելով
<code>Update</code>. Subscriber-ները կարող են միանալ կամ հեռանալ ցանկացած պահի։</p>`,
        code: `public interface IObserver { void Update(string value); }

public class PriceFeed
{
    private readonly List<IObserver> _observers = new();
    public void Subscribe(IObserver o)   => _observers.Add(o);
    public void Unsubscribe(IObserver o) => _observers.Remove(o);

    public void SetPrice(string price)
    {
        foreach (var o in _observers.ToList())  // պատճեն — ապահով է
            o.Update(price);                     // տեղեկացնում ենք բոլորին
    }
}

public class Dashboard : IObserver
{ public void Update(string v) => Console.WriteLine($"[Dashboard] {v}"); }

var feed = new PriceFeed();
feed.Subscribe(new Dashboard());
feed.SetPrice("170");   // Dashboard-ը կստանա ծանուցումը`,
        deep: `<p><b>Ավելի խորը՝</b> .NET-ում սա ավելի հաճախ անում են <code>event</code>-ի կամ
<code>IObservable&lt;T&gt;</code>-ի միջոցով։ Դասական թակարդը <b>հիշողության արտահոսքն</b> է։ Եթե
մոռանաս <code>Unsubscribe</code>-ը, publisher-ը շարունակում է հղում պահել subscriber-ի վրա, և GC-ն
երբեք չի ազատում այն։ Նաև՝ մեկուսացրու մեկ subscriber-ի սխալը, որ մնացածների շղթան չկտրվի։</p>`,
        links: [
          { label: "PDF §9.2 Observer", url: "#" },
          { label: "Refactoring.Guru — Observer", url: "https://refactoring.guru/design-patterns/observer" }
        ],
        task: {
          q: "Observer-ն օգտագործելիս հաճախ հանդիպող սխալը?",
          options: [
            "Չափազանց արագ աշխատող կոդ",
            "Մոռանալ Unsubscribe-ը → publisher-ը հղում է պահում → հիշողության արտահոսք",
            "Չի կարելի ունենալ մեկից ավելի subscriber",
            "Publisher-ը պարտավոր է իմանալ բոլոր subscriber-ների դասերը"
          ],
          answer: 1,
          explain: "Առանց բաժանորդագրությունը դադարեցնելու publisher-ը շարունակում է subscriber-ը բռնած պահել, և աղբահանիչը երբեք չի կարողանում ազատել այն — դասական հիշողության արտահոսք։"
        }
      },
      {
        id: "pat-command",
        title: "Command",
        subtitle: "Հարցումը որպես օբյեկտ՝ հերթ, գրանցում, undo",
        theory: `
<p><b>Խնդիրը՝</b> վերածել <i>գործողությունը</i> <b>օբյեկտի</b>։ Այդ դեպքում գործողությունը կարելի է
դնել հերթի մեջ, գրանցել, կատարել ավելի ուշ կամ <b>հետ վերցնել</b> (undo)։</p>
<p>Command-ը պահում է այն ամենը, ինչ պետք է կատարման համար (ստացողն ու պարամետրերը) և այդ ամենը
թաքցնում է մեկ մեթոդի՝ <code>Execute()</code>-ի հետևում։ Ով որ գործարկում է (invoker-ը),
մանրամասները չգիտի — պարզապես կանչում է <code>Execute()</code>։</p>`,
        code: `public interface ICommand { void Execute(); }

public class OrderService
{
    public void CreateOrder(string id) => Console.WriteLine($"Ստեղծվեց {id}");
}

public class CreateOrderCommand : ICommand
{
    private readonly OrderService _service;
    private readonly string _orderId;
    public CreateOrderCommand(OrderService s, string id)
    { _service = s; _orderId = id; }

    public void Execute() => _service.CreateOrder(_orderId);
}

// Command-ների հերթ — կկատարենք, երբ ուզենք․
var queue = new Queue<ICommand>();
queue.Enqueue(new CreateOrderCommand(new OrderService(), "ORD-1001"));
while (queue.Count > 0) queue.Dequeue().Execute();`,
        deep: `<p><b>Ավելի խորը՝</b> ավելացնելով <code>Undo()</code> մեթոդը՝ ստանում ենք undo/redo։ Երկու
կույտ (Stack) — արվածի և հետ վերցվածի։ Հենց այսպես է աշխատում «Ctrl+Z»-ը խմբագրիչներում։
Դժվարությունը սովորաբար <code>Undo</code>-ի մեջ է — հետ գլորելը երբեմն ավելի բարդ է, քան կատարելը։</p>`,
        links: [
          { label: "PDF §9.3 Command (+ Undo/Redo)", url: "#" },
          { label: "Refactoring.Guru — Command", url: "https://refactoring.guru/design-patterns/command" }
        ],
        task: {
          q: "Ի՞նչ է տալիս գործողությունը command-օբյեկտի մեջ «փաթեթավորելը»?",
          options: [
            "Գործողությունը կարելի է կատարել միայն անմիջապես",
            "Գործողությունը կարելի է դնել հերթի մեջ, գրանցել, կատարել ավելի ուշ և հետ վերցնել (undo)",
            "Command-ները միշտ ավելի արագ են, քան սովորական կանչերը",
            "Command-ը փոխարինում է interface-ներին"
          ],
          answer: 1,
          explain: "Command-օբյեկտը պահում է կատարման համար անհրաժեշտ ամեն ինչ։ Կարելի է դնել հերթի մեջ, գրառել, հետաձգել կամ հետ գլորել Undo-ով — այստեղից են գալիս undo/redo-ն ու job-հերթերը։"
        }
      },
      {
        id: "pat-strategy",
        title: "Strategy",
        subtitle: "Փոխարինելի ալգորիթմներ",
        theory: `
<p><b>Խնդիրը՝</b> նույն բանն անելու մի քանի եղանակ կա (առաքման հաշվարկ՝ ստանդարտ /
էքսպրես)։ Հիմնական կոդում մի կույտ <code>if/else</code>-ի փոխարեն՝ ամեն եղանակը տար առանձին
դասի մեջ՝ ընդհանուր interface-ի հետևում, և <b>տեղադրիր հենց այն, որ պետք է</b>։</p>
<p>Հաճախորդը («context»-ը) պահում է հղում <code>IStrategy</code>-ի վրա և ուղղակի կանչում է այն։ Իսկ թե
կոնկրետ որ ալգորիթմն է՝ որոշում ես դրսից։</p>`,
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

// Անհրաժեշտ ալգորիթմը տեղադրում ենք ծրագրի աշխատանքի ընթացքում․
IShippingStrategy strategy = new ExpressShipping();
decimal price = strategy.Calculate(2m, 100m);`,
        deep: `<p><b>Ավելի խորը՝</b> պահիր strategy-ները <b>առանց state-ի</b> (stateless), այդ դեպքում
դրանք կարելի է ապահով կերպով նորից ու նորից օգտագործել։ Strategy-ի ընտրությունը հանիր մեկ
տեղ (factory կամ resolver), փոխարենը որ <code>if</code>-երը ցրես ամբողջ կոդով։ Անունները տուր
բիզնես-իմաստով (VipDiscount), ոչ թե մեխանիկայով։</p>`,
        links: [
          { label: "PDF §9.4 Strategy", url: "#" },
          { label: "Refactoring.Guru — Strategy", url: "https://refactoring.guru/design-patterns/strategy" }
        ],
        task: {
          q: "Strategy-ն օգնում է ազատվել…",
          options: [
            "Կոդի մեջ interface-ներից",
            "if/else ճյուղավորումներից, որոնք փոխում են ալգորիթմը — ամեն ալգորիթմ դառնում է առանձին դաս",
            "Օբյեկտներ ստեղծելու անհրաժեշտությունից",
            "Ծառանման կառուցվածքներից"
          ],
          answer: 1,
          explain: "Strategy-ն ուռճացած if/else-երը փոխարինում է փոխարինելի ալգորիթմ-դասերով՝ ընդհանուր interface-ի հետևում։ Անհրաժեշտն ուղղակի տեղադրվում է context-ի մեջ։"
        }
      },
      {
        id: "pat-state",
        title: "State",
        subtitle: "Օբյեկտը փոխում է վարքը՝ փոխելով իր state-ը",
        theory: `
<p><b>Խնդիրը՝</b> օբյեկտի վարքը կախված է իր state-ից (պատվեր՝ նոր / վճարված / ուղարկված
/ չեղարկված), և ամեն state-ում որոշ գործողություններ թույլատրված են, մյուսները՝ ոչ։ Հսկայական
<code>switch</code>-ի փոխարեն՝ ամեն state-ը դառնում է առանձին դաս, որն ինքը գիտի, թե ուր կարելի է
անցնել։</p>
<p><b>Strategy vs State՝</b> Strategy-ում ալգորիթմն ընտրում է <i>հաճախորդը</i>։ State-ում օբյեկտը
<b>ինքն է իրեն փոխարկում</b> state-երի միջև։</p>`,
        code: `public interface IOrderState
{
    string Name { get; }
    IOrderState Pay();   // կվերադարձնի հաջորդ state-ը
}

public class NewOrderState : IOrderState
{
    public string Name => "New";
    public IOrderState Pay() => new PaidOrderState();  // New -> Paid
}

public class PaidOrderState : IOrderState
{
    public string Name => "Paid";
    public IOrderState Pay() => this;  // արդեն վճարված է — մնում ենք
}

public class OrderContext
{
    private IOrderState _state = new NewOrderState();
    public string Current => _state.Name;
    public void Pay() => _state = _state.Pay();  // օբյեկտն ինքն է փոխում իր state-ը
}

var order = new OrderContext();   // New
order.Pay();                      // -> Paid`,
        deep: `<p><b>Ավելի խորը՝</b> անցումների կանոնները պահիր state-երի <b>ներսում</b>, ոչ թե
քսիր context-ի վրայով։ Գրանցիր անցումները, որ հետո հեշտ լինի վրիպազերծել։ Վտանգը «state-երի
պայթյունն» է՝ շատ ու շատ մանր state-երը բարդացնում են պատկերը։ Նկարիր state-երի դիագրամ։</p>`,
        links: [
          { label: "PDF §9.5 State", url: "#" },
          { label: "Refactoring.Guru — State", url: "https://refactoring.guru/design-patterns/state" }
        ],
        task: {
          q: "State-ի և Strategy-ի հիմնական տարբերությունը?",
          options: [
            "Դրանք նույն բանն են",
            "Strategy-ում ալգորիթմն ընտրում է հաճախորդը, State-ում օբյեկտն ինքն է փոխարկում իր state-երը",
            "State-ն ավելի արագ է",
            "Strategy-ն հնարավոր չէ թեստավորել"
          ],
          answer: 1,
          explain: "Strategy՝ արտաքին կոդը տեղադրում է ալգորիթմը։ State՝ օբյեկտը ներսից անցնում է state-երի միջև, և անցումները սահմանում է ինքը։"
        }
      },
      {
        id: "pat-chain",
        title: "Chain of Responsibility",
        subtitle: "Handler-ների շղթա՝ ամեն մեկը կարող է որոշել կամ փոխանցել առաջ",
        theory: `
<p><b>Խնդիրը՝</b> հարցումը պետք է հերթով անցնի մի քանի handler-ի միջով։ Ամեն մեկը կամ
<b>մշակում</b> է այն, կամ <b>փոխանցում</b> հաջորդին։ Ուղարկողը չգիտի, թե կոնկրետ ով է
մշակելու։ Օրինակ՝ ծախսերի հաստատում (թիմի ղեկավար → մենեջեր → ֆինանսական տնօրեն)։</p>`,
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
        if (r.Amount <= 300m) Console.WriteLine($"Թիմի ղեկավարը հաստատեց {r.Amount}");
        else Next?.Handle(r);        // չեմ կարող — փոխանցում եմ առաջ
    }
}

public class Manager : ApprovalHandler
{
    public override void Handle(ExpenseRequest r)
    {
        if (r.Amount <= 1500m) Console.WriteLine($"Մենեջերը հաստատեց {r.Amount}");
        else Next?.Handle(r);
    }
}

var lead = new TeamLead();
lead.SetNext(new Manager());
lead.Handle(new ExpenseRequest { Amount = 900m });  // կհաստատի Մենեջերը`,
        deep: `<p><b>Ավելի խորը՝</b> անպայման նախատեսիր <b>վերջնական handler</b> (կամ բացահայտ
«չմշակված» արդյունք), այլապես հարցումը լուռ «կընկնի» ոչ մի տեղ։ Նույն ձևով են կառուցված
middleware-խողովակաշարերն ու վալիդացիայի pipeline-ները։ Օղակների հերթականությունը կրիտիկական է —
ծածկիր թեստերով։</p>`,
        links: [
          { label: "PDF §9.6 Chain of Responsibility", url: "#" },
          { label: "Refactoring.Guru — CoR", url: "https://refactoring.guru/design-patterns/chain-of-responsibility" }
        ],
        task: {
          q: "Chain of Responsibility-ում ի՞նչ է կարևոր նախատեսել?",
          options: [
            "Որ handler-ները լինեն ուղիղ երկուսը",
            "Վերջնական (fallback) handler կամ բացահայտ «չմշակված» արդյունք, այլապես հարցումը լուռ կորչում է",
            "Որ handler-ների հերթականությունը լինի պատահական",
            "Շղթայի միակ օրինակը"
          ],
          answer: 1,
          explain: "Առանց վերջնական handler-ի այն հարցումը, որը ոչ ոք չվերցրեց, հանգիստ կվերանա։ Միշտ սահմանիր վերջին օղակը կամ բացահայտ «not handled»."
        }
      }
    ]
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: "⛃",
    blurb: "Big-O, list, stack/queue, dictionary, որոնում, sorting և recursion. «Ինքդ գրիր» առաջադրանքներով։",
    levels: [
      {
        id: "dsa-bigo",
        title: "Բարդություն (Big-O)",
        subtitle: "Ինչպես ենք չափում «արագ»-ը և «դանդաղ»-ը",
        theory: `
<p>Պատկերացրու՝ հեռախոսագրքում անուն ես փնտրում։ Կարող ես էջ առ էջ թերթել, կամ բացել
մեջտեղից և միանգամից դեն նետել կիսով չափը։ Երկրորդ ձևն ավելի արագ է։ <b>Big-O</b>-ն ձև է
նկարագրելու, <i>ինչպես է աճում աշխատանքի ժամանակը</i>, երբ տվյալները շատանում են։</p>
<p>Կարդացվում է այսպես՝ «մոտավորապես այսքան քայլ N տարրի համար»։</p>
<ul>
<li><code>O(1)</code> — հաստատուն։ Ինչքան էլ տվյալ լինի, քայլերը նույնն են (տարրը վերցնել
index-ով)։</li>
<li><code>O(log n)</code> — շատ դանդաղ է աճում։ Կրկնապատկում ես տվյալները՝ ավելանում է ընդամենը
մեկ քայլ (binary search)։</li>
<li><code>O(n)</code> — գծային։ Երկու անգամ շատ տվյալ՝ երկու անգամ շատ քայլ (անցնել ամբողջ
list-ով)։</li>
<li><code>O(n²)</code> — արագ «պայթում է»։ Տվյալների վրայով երկու ներդրված ցիկլ (պարզ
sorting)։</li>
</ul>
<p>Big-O-ն նայում է <b>վատագույն դեպքին</b> և անտեսում մանրուքները։ Կարևորն այն է, թե ինչպես է
ամեն ինչ իրեն պահում մեծ տվյալների վրա։</p>`,
        code: `int[] a = { 5, 8, 1, 9 };

// O(1): մեկ քայլ, չափը կարևոր չէ
int first = a[0];

// O(n): անցնում ենք բոլոր տարրերով
int sum = 0;
foreach (int x in a) sum += x;

// O(n^2): ամեն տարրի համար՝ ևս մեկ ցիկլ բոլորի վրայով
for (int i = 0; i < a.Length; i++)
    for (int j = 0; j < a.Length; j++)
        Console.WriteLine(a[i] + a[j]);`,
        deep: `<p><b>Ավելի խորը։</b> Big-O-ն խոսում է <i>աճի</i> մասին, ոչ թե ճշգրիտ ժամանակի՝
վայրկյաններով։ Մեծ հաստատունով <code>O(1)</code>-ը փոքր տվյալների վրա կարող է ավելի դանդաղ լինել,
քան <code>O(n)</code>-ը, բայց N-ի աճի հետ միշտ հաղթում է։ Դրա համար ալգորիթմն ընտրում են
բարդության դասով, իսկ հաստատունները օպտիմալացնում են հետո։</p>`,
        links: [
          { label: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" },
          { label: "Գիրք՝ Grokking Algorithms (շատ պատկերավոր)", url: "https://www.manning.com/books/grokking-algorithms" }
        ],
        task: {
          q: "Ունես երկու ներդրված ցիկլ, ամեն մեկն անցնում է բոլոր n տարրերով։ Սա ի՞նչ բարդություն է։",
          options: [
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n²)"
          ],
          answer: 3,
          explain: "Ցիկլը ցիկլի մեջ = n բազմապատկած n = n²։ Մեծ տվյալների վրա սա թվարկվածներից ամենա«ծանրն» է։"
        }
      },
      {
        id: "dsa-list",
        title: "Array-ներ և list-եր",
        subtitle: "Ֆիքսված դարակ vs ձգվող դարակ",
        theory: `
<p><b>Array</b>-ը (<code>int[]</code>) նման է ֆիքսված թվով բնիկներ ունեցող դարակի։ Տարրը համարով
վերցնելը ակնթարթային է (<code>O(1)</code>), բայց չափը տրված է նախապես և չի փոխվում։</p>
<p><b>List&lt;T&gt;</b>-ը «խելացի» array է, որն ինքն է աճում, երբ ավելացնում ես։ Ներսում նույն
array-ն է։ Երբ լցվում է, ստեղծում է նորը՝ ավելի մեծ, և պատճենում տվյալները։ Վերջում ավելացնելը
արագ է, իսկ մեջտեղում տեղադրելը հետո եկածներին տեղաշարժում է (<code>O(n)</code>)։</p>`,
        code: `var nums = new List<int>();
nums.Add(10);          // ավելացնել վերջում
nums.Add(20);
nums.Insert(0, 5);     // տեղադրել սկզբում — մնացածը տեղաշարժվում է
int x = nums[1];       // վերցնել index-ով — ակնթարթային
nums.RemoveAt(0);      // հեռացնել index-ով`,
        deep: `<p><b>Ավելի խորը։</b> երբ List-ի ներսի array-ը լցվում է, .NET-ը ստեղծում է նորը՝
<b>երկու անգամ մեծ</b>, և պատճենում տարրերը։ Այդպիսի մեկ գործողությունը թանկ է, բայց հազվադեպ է
պատահում, դրա համար «միջինում» վերջում ավելացնելը համարվում է <code>O(1)</code> (սա անվանում են
ամորտիզացված բարդություն)։</p>`,
        links: [
          { label: "MS Docs — List<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1" }
        ],
        task: {
          kind: "write",
          q: "List&lt;T&gt;-ի ո՞ր մեթոդով են մեկ տարր ավելացնում վերջում։ Գրիր միայն մեթոդի անունը։",
          placeholder: "մեթոդի անունը...",
          must: ["add"],
          solution: "Add",
          explain: "nums.Add(value)-ը տարրը դնում է list-ի վերջում։ Սա արագ գործողություն է — միջինում O(1)."
        }
      },
      {
        id: "dsa-stack-queue",
        title: "Stack և queue",
        subtitle: "Ափսեների բարձ և հերթ դրամարկղի մոտ",
        theory: `
<p><b>Stack</b>-ը նման է ափսեների բարձի։ Դնում և վերցնում ես <i>վերևից</i>։ Վերջինը մտավ՝
առաջինը դուրս եկավ (LIFO)։ Մեթոդներ՝ <code>Push</code> (դնել), <code>Pop</code> (վերցնել
վերևինը)։</p>
<p><b>Queue</b>-ն նման է խանութի հերթի։ Ով առաջինն է եկել, նրան էլ առաջինը կսպասարկեն (FIFO)։
Մեթոդներ՝ <code>Enqueue</code> (կանգնել վերջում), <code>Dequeue</code> (վերցնել առաջինը)։</p>`,
        code: `var stack = new Stack<string>();
stack.Push("A");
stack.Push("B");
string top = stack.Pop();   // "B" — վերջինը մտավ, առաջինը դուրս եկավ

var queue = new Queue<string>();
queue.Enqueue("A");
queue.Enqueue("B");
string first = queue.Dequeue(); // "A" — առաջինը մտավ, առաջինը դուրս եկավ`,
        deep: `<p><b>Ավելի խորը։</b> stack-ը «հետարկման» (Ctrl+Z) և ի խորություն շրջանցման (DFS)
հիմքն է։ Queue-ն՝ ի լայնություն շրջանցման (BFS) և առաջադրանքների ցուցակների հիմքը։ Երկուսի
գործողություններն էլ <code>O(1)</code> են, որովհետև ձեռք է տրվում միայն մեկ ծայրին։</p>`,
        links: [
          { label: "MS Docs — Stack<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.stack-1" },
          { label: "MS Docs — Queue<T>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.queue-1" }
        ],
        task: {
          q: "Stack-ի մեջ դնում ես A, հետո B, հետո C։ Ի՞նչ կվերադարձնի առաջին Pop()-ը։",
          options: [
            "A — ամենաառաջինը",
            "C — ամենավերջինը (LIFO)",
            "B — մեջտեղից",
            "Սխալ"
          ],
          answer: 1,
          explain: "Stack-ն աշխատում է LIFO սկզբունքով՝ վերջինը մտածն առաջինը դուրս է գալիս։ Ուրեմն առաջինը կվերցվի C-ն։"
        }
      },
      {
        id: "dsa-dictionary",
        title: "Dictionary (hash table)",
        subtitle: "Գտնել key-ով մեկ քայլում",
        theory: `
<p><b>Dictionary&lt;TKey, TValue&gt;</b>-ն պահում է «key → value» զույգեր, ինչպես իսկական
բառարան։ Բառով միանգամից գտնում ես թարգմանությունը։ Հրաշքն այն է, որ key-ով որոնումը գրեթե
<b>ակնթարթային</b> է (<code>O(1)</code>), ոչ թե ամեն ինչի հերթով անցում։</p>
<p>Ինչպե՞ս։ Key-ն անցնում է <i>hash-ֆունկցիայի</i> միջով։ Այն key-ը դարձնում է թիվ-հասցե, և այդ
հասցեում արդեն պառկած է value-ն։ Պետք չէ ամեն ինչ թերթել։</p>`,
        code: `var ages = new Dictionary<string, int>();
ages["Anna"] = 20;
ages["Bob"]  = 25;

int a = ages["Anna"];              // 20 — արագ որոնում key-ով
bool has = ages.ContainsKey("Bob"); // true

// ապահով, առանց բացառության, եթե key-ը չկա:
if (ages.TryGetValue("Kate", out int k))
    Console.WriteLine(k);`,
        deep: `<p><b>Ավելի խորը։</b> <code>O(1)</code>-ը «միջինում» է։ Եթե տարբեր key-երի
hash-ը համընկնում է (սա անվանում են <i>կոլիզիա</i>), նրանք դասավորվում են կողք կողքի և որոնումը
մի քիչ դանդաղում է։ Լավ hash-ֆունկցիան կոլիզիաները հազվադեպ է դարձնում։ Չգոյություն ունեցող
key-ին <code>[]</code>-ով դիմելը բացառություն է նետում։ Դրա համար էլ կա
<code>TryGetValue</code>-ն։</p>`,
        links: [
          { label: "MS Docs — Dictionary<TKey,TValue>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2" }
        ],
        task: {
          kind: "write",
          q: "Ինչքա՞ն ժամանակում (O(...) տեսքով) Dictionary-ն միջինում գտնում է value-ն key-ով։",
          placeholder: "O(...)",
          must: ["o(1)"],
          solution: "O(1)",
          explain: "Hash-ֆունկցիան միանգամից ցույց է տալիս value-ի հասցեն, դրա համար որոնումը միջինում կախված չէ չափից — O(1)."
        }
      },
      {
        id: "dsa-binary-search",
        title: "Binary search",
        subtitle: "Ամեն քայլ դեն է նետում կիսով չափը",
        theory: `
<p>Փնտրում ենք թիվ <b>sort արված</b> array-ում։ Փոխանակ հերթով անցնելու, նայում ենք
<i>մեջտեղը</i>։ Եթե այնտեղ փնտրվածից մեծ է, ուրեմն պետքականն ավելի ձախ է։ Դեն ենք նետում աջ կիսը։
Եթե փոքր է՝ դեն ենք նետում ձախը։ Ու այդպես ամեն քայլ որոնման գոտին կիսում ենք։</p>
<p>Դրա շնորհիվ նույնիսկ միլիոն տարրի մեջ բավական է ~20 քայլ — բարդությունը <code>O(log n)</code>
է։ Հիմնական պայմանը՝ array-ը պետք է լինի <b>sort արված</b>։</p>`,
        code: `int BinarySearch(int[] a, int target)
{
    int left = 0, right = a.Length - 1;
    while (left <= right)
    {
        int mid = (left + right) / 2;   // մեջտեղը
        if (a[mid] == target) return mid;   // գտանք
        if (a[mid] < target) left = mid + 1;  // փնտրում ենք ավելի աջ
        else right = mid - 1;                 // փնտրում ենք ավելի ձախ
    }
    return -1;   // չգտանք
}`,
        deep: `<p><b>Ավելի խորը։</b> <code>(left + right) / 2</code>-ը շատ մեծ թվերի դեպքում կարող
է գերլցվել։ Պրոֆեսիոնալները գրում են <code>left + (right - left) / 2</code> — նույն իմաստը, բայց
առանց գերլցման ռիսկի։ .NET-ում արդեն կա պատրաստի <code>Array.BinarySearch</code>-ը։</p>`,
        links: [
          { label: "MS Docs — Array.BinarySearch", url: "https://learn.microsoft.com/en-us/dotnet/api/system.array.binarysearch" }
        ],
        task: {
          kind: "write",
          q: "Ի՞նչ բարդություն ունի binary search-ը։ Պատասխանիր O(...) տեսքով։",
          placeholder: "O(...)",
          must: ["o(logn)"],
          solution: "O(log n)",
          explain: "Ամեն քայլ դեն է նետում տվյալների կիսը, դրա համար քայլերի թիվն աճում է ինչպես լոգարիթմ — O(log n)."
        }
      },
      {
        id: "dsa-recursion",
        title: "Recursion",
        subtitle: "Մեթոդ, որը կանչում է ինքն իրեն",
        theory: `
<p><b>Recursion</b>-ը այն է, երբ ֆունկցիան կանչում է ինքն իրեն ավելի փոքր խնդրի վրա, մինչև հասնի
ամենապարզ դեպքին։ Ինչպես մատրյոշկա։ Բացում ես, ներսում նույնն է, բայց փոքր — և այդպես մինչև
ամենափոքրիկը, որն այլևս չի բացվում։</p>
<p>Երկու պարտադիր մասեր՝</p>
<ul>
<li><b>Բազա</b> — պահը, որտեղ կանգնում ես (այլապես անվերջ կանչ և վայր ընկնում)։</li>
<li><b>Քայլ</b> — ինքն իրեն կանչելը ավելի փոքր խնդրի վրա։</li>
</ul>
<p>Օրինակ՝ ֆակտորիալ։ <code>5! = 5 · 4 · 3 · 2 · 1</code>։</p>`,
        code: `int Factorial(int n)
{
    if (n <= 1) return 1;          // բազա՝ ավելի խորը չենք իջնում
    return n * Factorial(n - 1);   // քայլ՝ կանչում ենք ինքներս մեզ n-1-ի վրա
}

// Factorial(4) = 4 * Factorial(3)
//              = 4 * 3 * Factorial(2)
//              = 4 * 3 * 2 * Factorial(1) = 24`,
        deep: `<p><b>Ավելի խորը։</b> ամեն ներդրված կանչ տեղ է զբաղեցնում <i>կանչերի stack</i>-ում
(հիշողություն «ով ում կանչեց»-ի համար)։ Չափազանց խորը recursion-ը դա գերլցնում է — սա
<code>StackOverflow</code> սխալն է։ Երբեմն recursion-ը հատուկ վերագրում են սովորական ցիկլով, որ
դրանից խուսափեն։</p>`,
        links: [
          { label: "MS Docs — Recursion (tutorial)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/pattern-matching" },
          { label: "Grokking Algorithms — Recursion", url: "https://www.manning.com/books/grokking-algorithms" }
        ],
        task: {
          kind: "write",
          q: "Լրացրու բացը ֆակտորիալի recursion-ի քայլում՝ return n * Factorial(____);",
          placeholder: "ի՞նչ կա փակագծերի ներսում",
          must: ["n-1"],
          solution: "n - 1",
          explain: "Բազային հասնելու համար (n <= 1) ամեն կանչ պետք է փոքրացնի n-ը։ Դրա համար կանչում ենք Factorial(n - 1)."
        }
      },
      {
        id: "dsa-swap",
        title: "Պրակտիկա՝ արժեքների փոխանակում",
        subtitle: "Դասական հնարքը ժամանակավոր փոփոխականով",
        theory: `
<p>Շատ հաճախ հանդիպող խնդիր sorting-ի ներսում՝ <b>տեղերով փոխել</b> array-ի երկու տարրերը։
Միամիտ փորձը՝ <code>a[i] = a[j]; a[j] = a[i];</code> — կոտրվում է։ Առաջին վերագրումն արդեն
ջնջել է <code>a[i]</code>-ի հին արժեքը։</p>
<p>Լուծումը՝ <b>ժամանակավոր փոփոխական</b> (temp), որը կպահի մեկ արժեքը, մինչ մենք տեղափոխում ենք
մյուսը։</p>`,
        code: `// էր՝ a[i] = 3, a[j] = 8
int temp = a[i];   // temp-ը հիշում է 3-ը
a[i] = a[j];       // a[i] դարձավ 8
a[j] = temp;       // a[j] դարձավ 3
// դարձավ՝ a[i] = 8, a[j] = 3`,
        deep: `<p><b>Ավելի խորը։</b> C#-ում կարելի է նաև առանց temp-ի՝ tuple-ների միջոցով։
<code>(a[i], a[j]) = (a[j], a[i]);</code>։ Կոմպիլյատորն ինքը ամեն ինչ զգույշ կվերադասավորի։ Բայց
<code>temp</code>-ով տարբերակը հասկանալը կարևոր է — այն հանդիպում է գրեթե բոլոր լեզուներում։</p>`,
        links: [
          { label: "MS Docs — Tuples (դեկոնստրուկցիա)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-tuples" }
        ],
        task: {
          kind: "write",
          q: "Գրիր 3 տող, որոնք տեղերով փոխում են a[i]-ն և a[j]-ն temp փոփոխականի միջոցով։",
          placeholder: "int temp = ...;\na[i] = ...;\na[j] = ...;",
          must: ["temp=a[i]", "a[i]=a[j]", "a[j]=temp"],
          solution: "int temp = a[i];\na[i] = a[j];\na[j] = temp;",
          explain: "temp-ը պահում է հին a[i]-ն, մինչ մենք a[i]-ի մեջ դնում ենք a[j]-ի արժեքը։ Հետո temp-ից հին a[i]-ն հանում ենք a[j]-ի մեջ։"
        }
      },
      {
        id: "dsa-sorting",
        title: "Sorting",
        subtitle: "Bubble sort vs արագ մեթոդներ",
        theory: `
<p><b>Bubble sort</b>-ը ամենապարզն է։ Անցնում ենք array-ով և տեղերով փոխում հարևաններին, եթե
նրանք «ճիշտ հերթականությամբ չեն»։ Մեծ թվերն աստիճանաբար «վերև են լողում» դեպի վերջ, ինչպես
պղպջակներ։ Պարզ է, բայց դանդաղ — <code>O(n²)</code>։</p>
<p>Խելացի sorting-ները (quicksort, merge sort) աշխատում են <code>O(n log n)</code>-ով —
նկատելիորեն ավելի արագ մեծ տվյալների վրա։ Իրական կոդում գրեթե միշտ վերցնում են պատրաստին՝
<code>list.Sort()</code> կամ <code>Array.Sort()</code>։</p>`,
        code: `void BubbleSort(int[] a)
{
    for (int i = 0; i < a.Length - 1; i++)
        for (int j = 0; j < a.Length - 1 - i; j++)
            if (a[j] > a[j + 1])
            {
                int temp = a[j];       // հարևանները տեղերով փոխում ենք
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
}

// Իրականում:
var nums = new List<int> { 5, 2, 8, 1 };
nums.Sort();   // [1, 2, 5, 8], ներսում՝ արագ ալգորիթմ`,
        deep: `<p><b>Ավելի խորը։</b> <code>Array.Sort</code>/<code>List.Sort</code>-ը օգտագործում
են հիբրիդ (introsort)՝ quicksort գումարած անցում այլ մեթոդների վատ դեպքերում — կայուն
<code>O(n log n)</code>։ Սեփական bubble sort գրելն արժե միայն որ <i>հասկանաս</i> գաղափարը, ոչ թե
մարտական կոդի համար։</p>`,
        links: [
          { label: "MS Docs — Array.Sort", url: "https://learn.microsoft.com/en-us/dotnet/api/system.array.sort" },
          { label: "VisuAlgo — sorting-ների վիզուալիզացիա", url: "https://visualgo.net/en/sorting" }
        ],
        task: {
          q: "Ինչո՞ւ աշխատանքային կոդում սովորաբար գրում են list.Sort(), ոչ թե սեփական bubble sort.",
          options: [
            "bubble sort-ը հնարավոր չէ գրել C#-ում",
            "Ներդրված sorting-ը աշխատում է O(n log n)-ով — ավելի արագ է, և արդեն ստուգված է",
            "list.Sort()-ը sort է անում միայն թվեր",
            "Տարբերություն չկա"
          ],
          answer: 1,
          explain: "Bubble sort-ը O(n²) է և ուսումնական օրինակ։ Ներդրված Sort-ը օգտագործում է արագ հիբրիդային O(n log n) ալգորիթմ և լավ թեստավորված է։"
        }
      }
    ]
  },
  {
    id: "delegates",
    name: "Delegates & Events",
    icon: "⚡",
    blurb: "Պահել գործողությունը փոփոխականի մեջ, փոխանցել այն և տեղեկացնել բոլորին, ովքեր բաժանորդագրվել են։",
    levels: [
      {
        id: "del-1",
        title: "Ինչ է delegate-ը",
        subtitle: "Փոփոխական, որի մեջ պահվում է մեթոդ",
        theory: `
<p>Սովորաբար փոփոխականի մեջ պահվում են <i>տվյալներ</i>՝ թիվ, տեքստ։ Իսկ եթե փոփոխականի մեջ դնենք
ամբողջական <b>գործողություն</b> — հղում մեթոդին։ Այդ դեպքում փոփոխականը կարելի է հանձնել ուրիշ
կոդի, և նա կկանչի մեթոդը՝ առանց նույնիսկ նրա անունը իմանալու։</p>
<p><b>delegate</b> — դա հենց այդպիսի «փոփոխական-մեթոդի-համար» է։ Պատկերացրու <b>հեռակառավարման
վահանակ</b>։ Կոճակն ինքը չգիտի՝ ինչ է միացնում, հեռուստացույցը թե լույսը։ Դու ես դա որոշում, երբ
կոճակին «կապում» ես անհրաժեշտ գործողությունը։ delegate-ը սահմանում է մեթոդի <i>ձևը</i> (ինչ է
ընդունում, ինչ է վերադարձնում), իսկ թե կոնկրետ որ մեթոդը դնես այնտեղ՝ որոշում ես ավելի ուշ։</p>`,
        code: `// հայտարարում ենք ձևը՝ մեթոդ, որը վերցնում է int և վերադարձնում է int
delegate int Operation(int x);

int Double(int x) => x * 2;
int Square(int x) => x * x;

Operation op = Double;   // դնում ենք մեթոդը փոփոխականի մեջ
Console.WriteLine(op(5)); // 10 — կանչեցինք delegate-ի միջոցով

op = Square;             // փոխարինեցինք ուրիշ մեթոդով
Console.WriteLine(op(5)); // 25 — նույն կանչը, այլ վարքագիծ`,
        deep: `<p><b>Ավելի խորը՝</b> delegate-ը տիպերի առումով անվտանգ տիպ է։ Կոմպիլյատորը կստուգի, որ
մեթոդը իսկապես համապատասխանում է ձևին (արգումենտները և վերադարձվող արժեքը)։ Կապոցի տակ delegate-ը
պահում է նաև այն, թե <i>որ օբյեկտի վրա</i> կանչել մեթոդը, դրա համար էլ նա կարող է պահել և՛ սովորական
մեթոդներ, և՛ կոնկրետ օրինակի մեթոդներ։</p>`,
        links: [
          { label: "MS Docs — Delegates", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/" }
        ],
        task: {
          q: "Ինչ է պահում delegate փոփոխականը?",
          options: [
            "Միայն թվեր",
            "Հղում մեթոդին — հենց գործողությունը, որը կարելի է կանչել ավելի ուշ",
            "Ամբողջ class-ի պատճենը",
            "Ծրագրի տեքստը"
          ],
          answer: 1,
          explain: "delegate-ը փոփոխական է, որի մեջ պահվում է հղում մեթոդին։ Այն կարելի է փոխանցել և կանչել՝ առանց նախապես մեթոդի անունը իմանալու։"
        }
      },
      {
        id: "del-2",
        title: "Func, Action, Predicate և lambda-ներ",
        subtitle: "Պատրաստի delegate-ներ — պետք չէ հայտարարել քոնը",
        theory: `
<p>Ամեն անգամ <code>delegate ...</code> գրելը հոգնեցուցիչ է։ C#-ում արդեն կան պատրաստի delegate-ներ
բոլոր դեպքերի համար՝</p>
<ul>
<li><code>Action</code> — մեթոդ, որը <b>ոչինչ չի վերադարձնում</b> (պարզապես ինչ-որ բան անում է)։</li>
<li><code>Func</code> — մեթոդ, որը <b>վերադարձնում է</b> արժեք (վերջին տիպը՝ արդյունքն է)։</li>
<li><code>Predicate</code> — մեթոդ, որը պատասխանում է <b>այո/ոչ</b> (վերադարձնում է <code>bool</code>)։</li>
</ul>
<p>Իսկ առանձին անվանված մեթոդի փոխարեն կարելի է գրել <b>lambda</b> — կարճ «հենց տեղում» գրելաձև՝
<code>x =&gt; x * 2</code> կարդացվում է որպես «վերցնել x-ը և վերադարձնել x·2»։</p>`,
        code: `Action<string> hello = name => Console.WriteLine("Բարև, " + name);
hello("Anna");                     // Բարև, Anna

Func<int, int, int> add = (a, b) => a + b;
Console.WriteLine(add(2, 3));      // 5

Predicate<int> isEven = n => n % 2 == 0;
Console.WriteLine(isEven(4));      // True

// delegate-ները հաճախ ուղղակի փոխանցում են մեթոդներին՝
var nums = new List<int> { 1, 2, 3, 4 };
var evens = nums.FindAll(isEven);  // [2, 4]`,
        deep: `<p><b>Ավելի խորը՝</b> <code>Func&lt;int, int, int&gt;</code>-ում վերջին տիպը այն է, ինչ
մեթոդը <b>վերադարձնում է</b>, իսկ մինչ այն եղածը՝ արգումենտներն են։ lambda-ն ընդամենը կարճ
շարահյուսություն է անանուն մեթոդի համար։ Կոմպիլյատորը այն վերածում է սովորական delegate-ի։ Հենց
lambda-ների վրա է հենված ամբողջ LINQ-ը (<code>Where</code>, <code>Select</code> և այլն)։</p>`,
        links: [
          { label: "MS Docs — Func<>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.func-2" },
          { label: "MS Docs — Lambda expressions", url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions" }
        ],
        task: {
          q: "Ինչով է Func-ը տարբերվում Action-ից?",
          options: [
            "Ոչնչով, դրանք հոմանիշներ են",
            "Func-ը վերադարձնում է արժեք, Action-ը ոչինչ չի վերադարձնում",
            "Action-ը ավելի արագ է աշխատում",
            "Func-ը չի կարելի օգտագործել lambda-ների հետ"
          ],
          answer: 1,
          explain: "Action-ը գործողություն է առանց արդյունքի, Func-ը մեթոդ է, որը վերադարձնում է արժեք (նրա տիպը կանկյունային փակագծերում վերջինն է)."
        }
      },
      {
        id: "del-3",
        title: "Multicast՝ մի քանի մեթոդ մեկ delegate-ում",
        subtitle: "Մեկ կանչ — շատ արձագանքներ",
        theory: `
<p>delegate-ի մեջ կարելի է դնել <b>միանգամից մի քանի</b> մեթոդ <code>+=</code>-ի միջոցով։ Այդ
դեպքում մեկ կանչը կգործարկի դրանք բոլորը՝ հերթով։ Մեթոդը հանելու համար՝ <code>-=</code>։</p>
<p>Սա event-ների հիմքն է՝ publisher-ը պարզապես «քաշում» է delegate-ը, իսկ ներսում գործարկվում են
բոլորը, ովքեր բաժանորդագրվել են։ publisher-ը նույնիսկ չգիտի՝ քանիսն են և ովքեր են։</p>`,
        code: `Action notify = () => Console.WriteLine("SMS ուղարկված է");
notify += () => Console.WriteLine("Email ուղարկված է");
notify += () => Console.WriteLine("Push ուղարկված է");

notify();   // բոլոր երեքը կգործարկվեն հերթով

// SMS ուղարկված է
// Email ուղարկված է
// Push ուղարկված է`,
        deep: `<p><b>Ավելի խորը՝</b> այդպիսի delegate-ը կոչվում է <i>multicast</i> — ներսում նա պահում է
մեթոդների ցուցակ։ Այն delegate-ների մոտ, որոնք <b>վերադարձնում են</b> արժեք, multicast-ի ժամանակ
տեսանելի է միայն <i>վերջին</i> մեթոդի արդյունքը, դրա համար multicast-ը սովորաբար կիրառում են
<code>Action</code>-ի վրա (առանց արդյունքի)։ Իսկ եթե մեթոդներից մեկը սխալ նետի՝ մնացածները կարող են
և չկատարվել։</p>`,
        links: [
          { label: "MS Docs — Multicast delegates", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/how-to-combine-delegates-multicast-delegates" }
        ],
        task: {
          q: "Որ օպերատորով են delegate-ին ավելացնում ևս մեկ մեթոդ?",
          options: [
            "= օպերատորով (վերագրում է)",
            "+= օպերատորով (ավելացնում է ցուցակին)",
            "* օպերատորով ",
            "Ոչ մի կերպ, delegate-ը պահում է մեկ մեթոդ"
          ],
          answer: 1,
          explain: "+= ավելացնում է մեթոդը կանչի ցուցակին, -= հանում է այն։ Սովորական = պարզապես կվերագրի և կջնջի այն ամենը, ինչ եղել է։"
        }
      },
      {
        id: "del-4",
        title: "event",
        subtitle: "publisher-ը գոռում է — subscriber-ները լսում են",
        theory: `
<p><b>event</b>-ը delegate է, բայց «պաշտպանված»։ Մերկ delegate-ի խնդիրը՝ դրսից ցանկացած մեկը կարող է
այն <i>վերագրել</i> (<code>=</code>) կամ <i>կանչել</i>։ <code>event</code> բառը դա արգելում է՝ դրսից
թույլատրված է միայն <b>բաժանորդագրվել</b> (<code>+=</code>) և <b>ապաբաժանորդագրվել</b>
(<code>-=</code>), իսկ event-ը կանչել կարող է միայն ինքը՝ publisher class-ը։</p>
<p>Սա հենց <b>Observer</b> օրինաչափությունն է, ներկառուցված լեզվի մեջ՝ մեկ օբյեկտը փոխվում է, և բոլոր
subscriber-ները ինքնաբերաբար իմանում են, ընդ որում publisher-ը չգիտի՝ կոնկրետ ով է լսում։</p>`,
        code: `class Button
{
    // event՝ դրսից միայն += և -= է հնարավոր
    public event Action? Clicked;

    public void Press()
    {
        Console.WriteLine("Կոճակը սեղմված է");
        Clicked?.Invoke();   // տեղեկացնում ենք subscriber-ներին (եթե նրանք կան)
    }
}

var btn = new Button();
btn.Clicked += () => Console.WriteLine("Բացել մենյուն");
btn.Clicked += () => Console.WriteLine("Նվագարկել ձայնը");

btn.Press();
// Կոճակը սեղմված է
// Բացել մենյուն
// Նվագարկել ձայնը`,
        deep: `<p><b>Ավելի խորը՝</b> <code>Clicked?.Invoke()</code>-ում <code>?</code> նշանը ստուգում է, որ
subscriber-ներ ընդհանրապես կան (այլապես՝ <code>null</code> և սխալ)։ .NET-ի պայմանավորվածությամբ
event-ները հաճախ հայտարարում են <code>EventHandler</code>/<code>EventHandler&lt;T&gt;</code> տիպով՝
<code>(object sender, EventArgs e)</code> պարամետրերով, որպեսզի subscriber-ը իմանա, թե <i>ով</i> և
<i>ինչ տվյալներով</i> է կանչել event-ը։ Կարևոր է չմոռանալ <code>-=</code>-ը դուրս գալիս, այլապես
subscriber-ը չի հավաքվի garbage collector-ի կողմից (հիշողության արտահոսք)։</p>`,
        links: [
          { label: "MS Docs — Events", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/" }
        ],
        task: {
          q: "Ինչու է պետք event բանալի բառը, եթե delegate-ն այնպես էլ կարողանում է += ?",
          options: [
            "Այն արագացնում է կանչը",
            "Այն պաշտպանում է delegate-ը՝ դրսից կարելի է միայն բաժանորդագրվել/ապաբաժանորդագրվել, իսկ կանչել՝ միայն ինքը՝ class-ը",
            "Այն պարտադիր է ցանկացած delegate-ի համար",
            "Տարբերություն չկա, դրանք հոմանիշներ են"
          ],
          answer: 1,
          explain: "event-ը փաթեթավորում է delegate-ը՝ օտար կոդը չի կարող ո՛չ վերագրել (=), ո՛չ կանչել event-ը, միայն բաժանորդագրվել և ապաբաժանորդագրվել։ Կանչում է միայն publisher-ը։"
        }
      },
      {
        id: "del-5",
        title: "EventBus — event-ների ընդհանուր ավտոբուս",
        subtitle: "Բոլորը շփվում են մեկ «հայտարարությունների տախտակի» միջոցով",
        theory: `
<p>Երբ ծրագրում մասերը շատ են, դրանք «ամեն մեկը ամեն մեկի հետ» ուղղակիորեն կապելը խառնաշփոթ է։
Մասերը գիտեն միմյանց մասին, և մեկը փոխելը նշանակում է կոտրել մյուսը։</p>
<p><b>EventBus</b> (event-ների ավտոբուս) — դա միջնորդ է, ընդհանուր «հայտարարությունների տախտակ»։
Ցանկացած մեկը կարող է <b>publish</b> անել event («պատվերը վճարված է»), իսկ ցանկացած մեկը՝
<b>subscribe</b> անել այդ տիպի event-ին։ Ուղարկողը և ստացողը <b>չգիտեն միմյանց մասին</b> — նրանք
գիտեն միայն ավտոբուսը։ Սա Observer օրինաչափությունն է, բարձրացված ամբողջ հավելվածի մակարդակին (այն
նաև անվանում են publish/subscribe)։</p>`,
        code: `// պարզ ավտոբուս՝ event-ի տիպ -> handler-ների ցուցակ
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
            ((Action<T>)h)(evt);   // տեղեկացնում ենք այս տիպի բոլոր subscriber-ներին
    }
}

record OrderPaid(int OrderId);

var bus = new EventBus();
bus.Subscribe<OrderPaid>(e => Console.WriteLine($"Պահեստ՝ հավաքել պատվեր {e.OrderId}"));
bus.Subscribe<OrderPaid>(e => Console.WriteLine($"Փոստ՝ նամակ պատվերի մասին {e.OrderId}"));

bus.Publish(new OrderPaid(42));
// Պահեստ՝ հավաքել պատվեր 42
// Փոստ՝ նամակ պատվերի մասին 42`,
        deep: `<p><b>Ավելի խորը՝</b> ավտոբուսի առավելությունը <i>loose coupling</i>-ն է։ Նոր handler
(օրինակ՝ վերլուծություն) ավելացնել կարելի է՝ առանց ուղարկողին կամ մյուս մասերին դիպչելու։ Թերությունը՝
event-ների հոսքը դառնում է «անտեսանելի»։ Կոդից դժվար է հասկանալ, թե ով ինչին է արձագանքում, և հեշտ է
ստանալ ցիկլեր կամ արտահոսքեր, եթե մոռանաս ապաբաժանորդագրվել։ Դրա համար մեծ նախագծերում վերցնում են
պատրաստի գրադարաններ (օրինակ՝ MediatR)՝ լոգերով և կյանքի ցիկլի կառավարմամբ։</p>`,
        links: [
          { label: "Wikipedia — Publish–subscribe pattern", url: "https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" },
          { label: "MediatR (.NET-ի վրա ավտոբուսի հանրաճանաչ իրականացում)", url: "https://github.com/jbogard/MediatR" }
        ],
        task: {
          kind: "write",
          q: "EventBus-ի հիմնական առավելությունը՝ ուղարկողը և ստացողը ՉԳԻՏԵՆ միմյանց մասին։ Ինչպես է կոչվում այդ հատկությունը (երկու բառ)?",
          placeholder: "օրինակ՝ ... coupling",
          must: ["loose", "coupling"],
          solution: "Loose coupling",
          explain: "EventBus-ը տալիս է loose coupling՝ մասերը շփվում են ավտոբուսի միջոցով, ոչ թե ուղղակիորեն, դրա համար էլ դրանք կարելի է փոխել և ավելացնել անկախ։"
        }
      },
      {
        id: "del-6",
        title: "EventHandler և EventArgs",
        subtitle: "event-ի ստանդարտ ձևը .NET-ում",
        theory: `
<p>Սեփական <code>event Action</code> գրել կարելի է, բայց ամբողջ .NET-ում ընդունված է մեկ
<b>պայմանավորվածություն</b>՝ event-ը subscriber-ին հաղորդում է երկու բան — <b>ով</b> է այն կանչել և
<b>ինչ տվյալներ</b> են եկել դրա հետ։</p>
<p>Դրա համար կա պատրաստի delegate՝ <code>EventHandler&lt;T&gt;</code>։ Այն միշտ փոխանցում է
<code>(object sender, T e)</code>՝ <code>sender</code>-ը event-ի աղբյուրն է (օրինակ՝ ինքը՝ կոճակը),
իսկ <code>e</code>-ն՝ «ծրարիկ» տվյալներով (<code>EventArgs</code>-ի ժառանգորդ)։ Այդպես ցանկացած
subscriber գիտի՝ որտեղից է եկել և ինչ կա ներսում։</p>`,
        code: `// "ծրարիկ" event-ի տվյալներով
class TemperatureEventArgs : EventArgs
{
    public int Degrees { get; init; }
}

class Sensor
{
    public event EventHandler<TemperatureEventArgs>? Changed;

    public void Report(int degrees)
    {
        // sender = this (ինքը՝ սենսորը), e = տվյալները
        Changed?.Invoke(this, new TemperatureEventArgs { Degrees = degrees });
    }
}

var sensor = new Sensor();
sensor.Changed += (sender, e) =>
    Console.WriteLine($"Դարձավ {e.Degrees}°");

sensor.Report(21);   // Դարձավ 21°`,
        deep: `<p><b>Ավելի խորը՝</b> ինչու է պետք այս ծեսը <code>sender</code>-ի և
<code>EventArgs</code>-ի հետ։ Որպեսզի ծրագրի բոլոր event-ները նույն տեսքն ունենան — մեկ subscriber
կարող է լսել շատ աղբյուրներ և միշտ գիտի՝ կոնկրետ որն է գործարկվել։ Իսկ եթե վաղը event-ին ավելանա ևս
մեկ դաշտ՝ դու պարզապես դնում ես այն <code>EventArgs</code>-ի մեջ, և հին subscriber-ները չեն կոտրվում։
Երբ տվյալներ չկան, փոխանցում են <code>EventArgs.Empty</code>։</p>`,
        links: [
          { label: "MS Docs — EventHandler<TEventArgs>", url: "https://learn.microsoft.com/en-us/dotnet/api/system.eventhandler-1" },
          { label: "MS Docs — Standard event pattern", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/how-to-publish-events-that-conform-to-net-guidelines" }
        ],
        task: {
          q: "Ինչ է փոխանցում subscriber-ին ստանդարտ EventHandler<T>-ը?",
          options: [
            "Ոչինչ, պարզապես ազդանշան",
            "event-ի աղբյուրը (sender) և event-ի տվյալները (e)",
            "Միայն թիվ",
            "Ամբողջ ծրագրի պատճենը"
          ],
          answer: 1,
          explain: ".NET-ի ստանդարտը՝ (object sender, T e) — ով է կանչել event-ը և ինչ տվյալներով։ Այդպես subscriber-ը միշտ գիտի աղբյուրը և պարունակությունը։"
        }
      },
      {
        id: "del-7",
        title: "Ապաբաժանորդագրում և հիշողության արտահոսքեր",
        subtitle: "Բաժանորդագրվեցիր — չմոռանաս ապաբաժանորդագրվել",
        theory: `
<p>Երբ գրում ես <code>publisher.Event += handler</code>, publisher-ը սկսում է <b>հղում պահել</b>
subscriber-ի վրա։ Քանի դեռ publisher-ը կենդանի է՝ նա «ձեռքից բռնած» պահում է բոլոր subscriber-ներին։</p>
<p>Խնդիրը՝ եթե subscriber-ը քեզ այլևս պետք չէ, բայց դու չես ապաբաժանորդագրվել (<code>-=</code>),
garbage collector-ը չի կարող այն հեռացնել, չէ՞ որ publisher-ը դեռ հղվում է նրան։ subscriber-ը
«կախված» է մնում հիշողության մեջ իզուր։ Սա հենց <b>հիշողության արտահոսքն</b> է event-ների միջոցով։
Կանոնը՝ ամեն <code>+=</code>-ի համար պետք է գտնվի մեկ <code>-=</code>։</p>`,
        code: `void HandleClick(object? s, EventArgs e)
    => Console.WriteLine("սեղմում");

button.Clicked += HandleClick;   // բաժանորդագրվեցինք

// ...քանի դեռ էկրանը բաց է, մշակում ենք սեղմումները...

button.Clicked -= HandleClick;   // ԷԿՐԱՆԸ ՓԱԿԵԼԻՍ — ապաբաժանորդագրվեցինք

// կարևոր է՝ -= կաշխատի միայն ՆՈՒՅՆ մեթոդի հետ։
// lambda-ն հնարավոր չէ ապաբաժանորդագրել, եթե չես պահել այն փոփոխականում՝
Action handler = () => Console.WriteLine("hi");
timer.Tick += handler;
timer.Tick -= handler;   // լավ է, հղումը նույնն է`,
        deep: `<p><b>Ավելի խորը՝</b> հաճախակի թակարդ՝ բաժանորդագրվել lambda-ով ուղիղ տողում
(<code>+= () =&gt; ...</code>) և հետո փորձել ապաբաժանորդագրվել նույնպիսի lambda-ով։ Չի ստացվի՝ դրանք
երկու <i>տարբեր</i> օբյեկտներ են, <code>-=</code>-ը դրանք չի համադրի։ Դրա համար այն lambda-ն, որը
հետո պետք է հանել, պահում են փոփոխականում։ Երկարակյաց հավելվածներում (UI, ծառայություններ) մոռացված
բաժանորդագրությունը հիշողության աճի դասական պատճառն է։</p>`,
        links: [
          { label: "MS Docs — How to subscribe/unsubscribe", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/how-to-subscribe-to-and-unsubscribe-from-events" }
        ],
        task: {
          q: "Ինչու է event-ի մոռացված բաժանորդագրությունը հանգեցնում հիշողության արտահոսքի?",
          options: [
            "event-ը պատճենում է ամբողջ օբյեկտը",
            "publisher-ը հղում է պահում subscriber-ի վրա, և garbage collector-ը չի կարող այն հեռացնել",
            "Բաժանորդագրությունները տեղ են զբաղեցնում սկավառակի վրա",
            "Դա առասպել է, արտահոսք չի լինում"
          ],
          answer: 1,
          explain: "Քանի դեռ publisher-ը հղվում է subscriber-ին (+=-ի միջոցով), garbage collector-ը նրան համարում է «կենդանի»։ Չես ապաբաժանորդագրվել -=՝ օբյեկտը իզուր կախված է մնում հիշողության մեջ։"
        }
      },
      {
        id: "del-8",
        title: "Հավաքիր ինքդ՝ event զրոյից",
        subtitle: "Ստուգիր, որ հասկացել ես",
        theory: `
<p>Հավաքենք ամեն ինչ միասին։ Պետք է publisher class՝ event-ով, որը գործարկվում է ինչ-որ
գործողության ժամանակ, և subscriber, որը դրան արձագանքում է։</p>
<p>Ներքևի առաջադրանքում լրացրու պակասող տողը՝ <b>event-ի կանչը</b>։ Հուշում՝ event-ը անվտանգ կանչում
են <code>?.Invoke(...)</code>-ի միջոցով, որպեսզի չընկնի, եթե subscriber-ներ չկան։</p>`,
        code: `class Alarm
{
    public event Action<string>? Rang;   // event՝ պատճառի տեքստով

    public void Trigger(string reason)
    {
        // ԱՅՍՏԵՂ պետք է լինի event-ի կանչը ↓
        Rang?.Invoke(reason);
    }
}

var alarm = new Alarm();
alarm.Rang += reason => Console.WriteLine("Ահազանգ՝ " + reason);
alarm.Trigger("ծուխ");   // Ահազանգ՝ ծուխ`,
        deep: `<p><b>Ավելի խորը՝</b> <code>?.Invoke</code> — դա պաշտպանություն է <code>null</code>-ից։
Եթե ոչ ոք բաժանորդագրված չէ, event-ը հավասար է <code>null</code>-ի, և սովորական կանչը կընկներ սխալով։
Հարցականը ասում է՝ «կանչիր միայն այն դեպքում, եթե կա ով պատասխանի»։</p>`,
        links: [
          { label: "MS Docs — Events", url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/" }
        ],
        task: {
          kind: "write",
          q: "Trigger մեթոդի ներսում գրիր տողը, որը անվտանգ կանչում է Rang event-ը և փոխանցում է նրան reason-ը։ (օգտագործիր ?.Invoke)",
          placeholder: "Rang?.Invoke(...);",
          must: ["rang?.invoke(reason)"],
          solution: "Rang?.Invoke(reason);",
          explain: "Rang?.Invoke(reason); — ? նշանը ստուգում է, որ subscriber-ներ կան, իսկ Invoke-ը գործարկում է դրանք բոլորը և փոխանցում է ահազանգի պատճառը։"
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

window.WORLDS_HY = orderedWorlds;
})();
