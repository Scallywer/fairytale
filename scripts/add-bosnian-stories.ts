import Database from 'better-sqlite3'
import path from 'path'
import { randomUUID } from 'crypto'
import { calculateReadingTime } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface StoryData {
  title: string
  author: string
  body: string
}

const stories: StoryData[] = [
  {
    title: 'Baš-Čelik',
    author: 'Tradicionalna priča',
    body: `U davna vremena, u jednom dalekom kraljevstvu, živio je zli čarobnjak po imenu Baš-Čelik. Bio je to strašan neprijatelj, jak poput čelika, i nitko nije mogao pobijediti ga u borbi. Baš-Čelik je oteo prekrasnu princezu i zatvorio je u svoju tamnu kulu na vrhu najviše planine. Svi su se bojali Baš-Čelika, jer je bio neuništiv i okrutan.

Kralj je bio očajan. "Tko će spasiti moju kćer?" plakao je svaki dan. "Nitko nije dovoljno hrabar da se suoči s Baš-Čelikom!"

Tada se pojavio mladi princ po imenu Marko. Bio je hrabar i odlučan, ali i mudar. "Ja ću spasiti princezu!" rekao je kralju. "Ali trebam pomoć. Čuo sam da postoje tri čarobne sestre koje mogu pomoći - kraljica zmajeva, kraljica orlova i kraljica sokolova."

Kralj je bio skeptičan. "Kako ćeš ih pronaći? One žive u najdubljim šumama i najvišim planinama!"

"Pronaći ću ih," odgovorio je Marko s odlučnošću. "Ljubav i hrabrost vode pravi put."

Marko je krenuo na svoj put. Prvo je otišao u najdublju šumu gdje je živjela kraljica zmajeva. Šuma je bila tako gusta da je jedva mogao proći, a zvuci životinja su ga plašili. Ali Marko nije odustao. "Moram pronaći kraljicu zmajeva," govorio je sam sebi.

Nakon dugog putovanja, stigao je do velikog jezera gdje je živjela kraljica zmajeva. Bila je to prekrasna žena s očima poput zlata i haljinom koja je blistala poput ljuskica. "Tko si ti i što tražiš?" upitala je kraljica zmajeva.

"Ja sam princ Marko," odgovorio je. "Tražim pomoć da spasim princezu od zlog Baš-Čelika."

Kraljica zmajeva se nasmiješila. "Vidim da si hrabar i iskren. Pomoci ću ti, ali moraš mi obećati da ćeš biti dobar i pravedan."

"Obećavam!" rekao je Marko.

Kraljica zmajeva mu je dala čarobni mač koji je mogao probiti bilo koji oklop. "Ovaj mač će ti pomoći, ali trebaš i pomoć mojih sestara," rekla je.

Marko je krenuo dalje, prema najvišoj planini gdje je živjela kraljica orlova. Planina je bila strma i opasna, puna oštrih stijena i vjetrova koji su pokušavali oboriti ga. Ali Marko je bio uporan. "Ne mogu odustati sada," govorio je sam sebi.

Kada je stigao do vrha planine, ugledao je kraljicu orlova kako leti nebom. Bila je to veličanstvena žena s krilima poput orla i očima koje su vidjele sve. "Zašto si došao ovdje, mladi princu?" upitala je.

"Tražim pomoć da spasim princezu od Baš-Čelika," odgovorio je Marko.

Kraljica orlova mu je dala čarobni štit koji je mogao zaštititi od bilo koje opasnosti. "Ovaj štit će te zaštititi, ali trebaš i pomoć moje najmlađe sestre," rekla je.

Marko je krenuo prema najudaljenijoj šumi gdje je živjela kraljica sokolova. Putovanje je bilo najteže, jer je morao proći kroz opasne doline i preko rijeka punih opasnosti. Ali Marko nije odustao. "Moram spasiti princezu," ponavljao je.

Kada je stigao do kraljice sokolova, ona mu je dala čarobni prsten koji je mogao otvoriti bilo koja vrata. "Ovaj prsten će ti pomoći da uđeš u kulu Baš-Čelika," rekla je. "Ali pazi - Baš-Čelik je jak. Moraš biti pametan, ne samo hrabar."

Marko je zahvalio sve tri sestre i krenuo prema kuli Baš-Čelika. Kada je stigao, kula je bila ogromna i strašna, okružena tamnim oblacima. Marko je koristio čarobni prsten da otvori vrata i ušao je unutra.

Baš-Čelik ga je dočekao s bijesom. "Tko si ti da se usudiš ući u moju kulu?" viknuo je.

"Ja sam princ Marko, i došao sam da spasim princezu!" odgovorio je Marko hrabro.

Počela je velika borba. Baš-Čelik je bio jak, ali Marko je koristio svoj čarobni mač i štit. Borba je trajala dugo, ali na kraju, Marko je pobijedio zahvaljujući svojoj hrabrosti i pomoći triju čarobnih sestara.

Kada je Baš-Čelik bio poražen, Marko je oslobodio princezu. "Hvala ti što si me spasio!" rekla je princeza s osmijehom.

"Zajedno smo pobijedili zlo," odgovorio je Marko. "Hrabrost, ljubav i prijateljstvo su jači od bilo koje zle moći."

I tako su se Marko i princeza vratili u kraljevstvo, gdje su bili dočekani s velikom radošću. Kralj je bio oduševljen, a svi su slavili hrabrost mladog princa. Od tog dana, kraljevstvo je bilo sigurno, a Marko i princeza su živjeli sretno do kraja svojih dana, znajući da su zajedno pobijedili najveće zlo.`
  },
  {
    title: 'Vila Planinka',
    author: 'Tradicionalna priča',
    body: `Visoko u planinama Bosne, gdje se nebo dotiče vrhova, živjela je čarobna vila po imenu Planinka. Bila je to dobra i mudra vila koja je čuvala sve planinske životinje, biljke i ljude koji su dolazili u planine. Njezina haljina bila je bijela poput snijega, a kosa joj je blistala poput zlata na suncu. Oči su joj bile plave poput planinskih jezera, a osmijeh je mogao osvijetliti i najtamniju noć.

Planinka je voljela sve što je živjelo u planinama. Svako jutro bi pozdravljala ptice koje su pjevale, životinje koje su trčale, i cvijeće koje je cvjetalo. "Dobro jutro, dragi prijatelji!" govorila bi s toplim glasom. "Neka vam dan bude pun radosti i ljubavi!"

Jednog dana, dok je Planinka letjela iznad planina, primijetila je mladog pastira po imenu Davora. Davor je bio tužan jer je izgubio svoje ovce u gustoj magli. "Gdje su moje ovce?" plakao je, a suze su mu padale niz obraze. "Kako ću se vratiti kući bez njih?"

Planinka je osjetila njegovu tugu i spustila se do njega. "Ne brini, mladi pastiru," rekla je s nježnim glasom. "Pomoći ću ti pronaći tvoje ovce."

Davor je bio iznenađen. "Tko si ti?" upitao je, gledajući prekrasnu vilu.

"Ja sam Vila Planinka, čuvarica ovih planina," odgovorila je. "Vidim da si dobar i brižan prema svojim ovcama. Zato ću ti pomoći."

Planinka je podigla svoje ruke i začarala maglu. Magla se počela razilaziti, otkrivajući put prema mjestu gdje su se ovce sakrile. "Slijedi me," rekla je Planinka, a Davor ju je slijedio kroz planinske staze.

Nakon što su prošli kroz gustu šumu i preko brzih potoka, stigli su do male livade gdje su se ovce pasle. "Evo ih!" uzviknula je Planinka s radošću.

Davor je bio oduševljen. "Hvala ti, Vila Planinka! Kako mogu uzvratiti tvoju dobrotu?"

Planinka se nasmiješila. "Samo nastavi biti dobar prema svojim ovcama i prema prirodi. To je sve što trebam."

Od tog dana, Davor i Planinka su postali prijatelji. Svaki dan bi Davor dolazio u planine sa svojim ovcama, a Planinka bi mu pričala priče o životinjama, biljkama i čarobnosti prirode. "Znaš li, Davoru," govorila bi, "svaka životinja ima svoju priču. Svako drvo ima svoju tajnu. Ako slušaš pažljivo, priroda će ti otkriti sve svoje tajne."

Davor je učio mnogo toga od Planinke. Naučio je kako da prepozna različite vrste biljaka, kako da sluša ptičje pjesme, i kako da se ponaša prema prirodi s poštovanjem. "Planinka, ti si najbolji prijatelj koji sam ikada imao!" govorio bi.

Jednog dana, dok su se šetali planinama, primijetili su ranjenog orla koji je ležao na stijeni. "Ovaj orao je ozlijeđen!" rekla je Planinka zabrinuto. "Moramo mu pomoći!"

Planinka je stavila svoje ruke na orla i počela pjevati čarobnu pjesmu. Njezin glas bio je mekan i utješan, a svjetlost je počela obasjavati orla. Rana se počela cijeliti, a orao je polako otvarao oči.

"Kako si to učinila?" upitao je Davor začuđeno.

"Ljubav i briga mogu izliječiti mnoge rane," odgovorila je Planinka. "Kada volimo prirodu i sve što u njoj živi, priroda nam vraća tu ljubav."

Orao je polako ustao i raširio krila. "Hvala vam!" rekao je glasom koji je zvučao poput vjetra. "Sada mogu letjeti ponovno!"

Od tog dana, Davor je shvatio koliko je važno brinuti se o prirodi i svim njezinim stvorenjima. "Planinka, naučila si me da je prijateljstvo s prirodom najveće bogatstvo," rekao je jednog dana.

"Da, Davoru," odgovorila je Planinka s osmijehom. "Kada volimo i štitimo prirodu, priroda nas voli i štiti. To je najveća čarolija na svijetu."

I tako su Davor i Planinka nastavili svoje prijateljstvo, dijeleći ljubav i radost u planinama. Davor je postao čuvar planina, pomažući svima koji su dolazili u planine, a Planinka je nastavila čuvati sve što je živjelo u njenom čarobnom svijetu. Zajedno su stvarali ljepotu i harmoniju koja će trajati vječno.`
  },
  {
    title: 'Aždaha i selo',
    author: 'Tradicionalna priča',
    body: `U jednom malom selu u Bosni, živjeli su ljudi koji su bili sretni i zadovoljni svojim životom. Selo je bilo smješteno u dolini, okruženo zelenim brdima i bistrim potocima. Ljudi su radili na svojim poljima, uzgajali stoku i uživali u jednostavnom životu. Ali jednog dana, sve se promijenilo.

Iz dubine šume došao je strašan aždaha - ogroman zmaj s ljuskama poput čelika i očima koje su sijale poput vatre. Aždaha je bio zao i pohlepan, i zahtijevao je da mu seljani daju sve što imaju - hranu, stoku, pa čak i svoje najdraže stvari.

"Morate mi dati sve što imate!" viknuo je aždaha jednog dana, dok je letio iznad sela. "Ako ne, uništit ću vaše kuće i vaša polja!"

Seljani su bili prestrašeni. "Što ćemo učiniti?" pitali su jedni druge. "Aždaha je prejak! Ne možemo se boriti protiv njega!"

Tada se pojavio stari seljak po imenu Stjepan. Bio je mudar i pametan, i uvijek je imao dobre ideje. "Ne možemo se boriti snagom," rekao je, "ali možemo biti pametniji od aždaha. Zajedno možemo pronaći rješenje."

Svi su se okupili u selu i počeli razmišljati. "Možemo sakriti sve što imamo!" predložio je jedan seljak.

"Ne, to neće pomoći," odgovorio je Stjepan. "Aždaha će nas pronaći."

"Možemo pobjeći!" predložio je drugi.

"Ne, ovo je naše selo," rekla je jedna žena. "Ne možemo ga napustiti."

Tada je mlada djevojka po imenu Marija rekla: "Možemo mu dati nešto što izgleda vrijedno, ali zapravo nije. Možemo ga prevariti!"

Stjepan se zamislio. "To je dobra ideja, Marija! Ali kako?"

Marija je imala plan. "Možemo napraviti lažno blago - koristiti kamenje koje blista poput zlata, i pokazati mu to. Dok on misli da je to pravo blago, možemo sakriti sve što nam je stvarno važno."

Svi su se složili. Zajedno su počeli raditi na planu. Neki su pripremali lažno blago, drugi su sakrivali svoje stvarno blago u sigurno mjesto, a treći su pripremali zamku za aždaha.

Kada je aždaha ponovno došao u selo, Stjepan ga je dočekao. "Dragi aždaha," rekao je, "imamo za tebe najveće blago koje si ikada vidio! Ali je sakriveno u šumi, jer je preveliko da ga donesemo ovdje."

Aždaha je bio znatiželjan. "Gdje je to blago?" upitao je pohlepno.

"Slijedi me," rekao je Stjepan, a aždaha ga je slijedio u šumu.

U šumi, seljani su pripremili zamku. Napravili su veliku jamu pokrivenu granjem i lišćem, a na dnu jame postavili su oštro kamenje. Kada je aždaha stigao do jame, seljani su mu pokazali lažno blago koje je blistalo na suncu.

"Evo blaga!" uzviknuo je Stjepan, pokazujući prema jami.

Aždaha je bio toliko pohlepan da je poletio prema jami, ali nije vidio zamku. Upao je u jamu i zarobio se. "Što se događa?" viknuo je bijesno.

"Zarobili smo te!" uzviknula je Marija s radošću. "Sada ne možeš više prijetiti našem selu!"

Aždaha je pokušavao pobjeći, ali jama je bila prevelika i preopasna. "Pustite me!" molio je. "Neću više prijetiti vašem selu!"

Stjepan se zamislio. "Možemo te pustiti, ali samo ako nam obećaš da više nikada nećeš dolaziti u naše selo i da ćeš živjeti u miru."

Aždaha je bio poražen. "Dobro, obećavam!" rekao je. "Vi ste bili pametniji od mene. Poštujem vašu hrabrost i mudrost."

Seljani su pomogli aždaha da izađe iz jame, a on je odletio u daljinu, znajući da je upoznao ljude koji su bili hrabri i pametni.

Od tog dana, selo je bilo sigurno, a seljani su naučili važnu lekciju: "Zajedno možemo pobijediti bilo koje zlo, ako koristimo svoju pamet i hrabrost. Prijateljstvo i suradnja su jači od bilo koje zle moći."

I tako su seljani nastavili živjeti sretno, znajući da su zajedno pobijedili najveću opasnost koja im je prijetila.`
  },
  {
    title: 'Vila i pastir',
    author: 'Tradicionalna priča',
    body: `U planinama Bosne, gdje se šume protežu beskrajno, živio je mladi pastir po imenu Luka. Luka je bio dobar i marljiv, i volio je svoje ovce više od svega. Svaki dan bi ih vodio na ispašu, pazio na njih i pjevao im pjesme dok su se pasle na zelenim livadama.

Jednog ljetnog dana, dok je Luka sjedio pod starim hrastom i gledao svoje ovce, začuo je prekrasan glas koji je pjevao u daljini. Glas je bio tako lijep da je Luka morao saznati tko pjeva. "Tko li to pjeva tako prekrasno?" pitao se, dok je krenuo prema izvoru zvuka.

Hodao je kroz gustu šumu, prateći glas koji ga je vikao. Što je dalje išao, to je glas bio ljepši. Konačno je stigao do malog jezera okruženog cvijećem i drvećem. U sredini jezera, na velikom kamenu, sjedila je prekrasna vila.

Vila je imala dugu plavu kosu koja je blistala poput zlata na suncu, haljinu bijelu poput snijega, i oči plave poput jezera. Pjevala je prekrasnu pjesmu o ljubavi, prirodi i čarobnosti života.

Luka je stajao u začuđenju, gledajući vilu. "Tko si ti?" upitao je tiho, ne želeći prekinuti njezinu pjesmu.

Vila se okrenula prema njemu i nasmiješila se. "Ja sam Vila Zora, čuvarica ovog jezera i šume," odgovorila je. "A tko si ti, mladi pastiru?"

"Ja sam Luka," odgovorio je. "Čuo sam tvoju pjesmu i morao sam doći da vidim tko pjeva tako prekrasno."

Vila Zora se nasmiješila. "Vidim da voliš prirodu i glazbu. To je lijepo. Želiš li da te naučim pjevati kao vilu?"

Luka je bio oduševljen. "Da, molim te! Volio bih naučiti!"

Vila Zora je počela učiti Luku kako da pjeva kao vilu. Pjevala je različite pjesme - o suncu koje izlazi, o mjesecu koji svijetli, o zvijezdama koje sjaje, i o životinjama koje žive u šumi. Luka je slušao pažljivo i pokušavao pjevati s njom.

"Pjevanje je čarolija," govorila je Vila Zora. "Kada pjevaš s ljubavlju, tvoja pjesma može osvijetliti i najtamniju noć i donijeti radost svima koji je čuju."

Luka je učio svaki dan. Dolazio bi do jezera sa svojim ovcama, a Vila Zora bi mu pričala priče o prirodi i učila ga pjevati. "Znaš li, Luka," govorila bi, "svaka životinja ima svoju pjesmu. Svako drvo ima svoj glas. Ako slušaš pažljivo, možeš čuti sve te pjesme."

Luka je počeo slušati pažljivije. Čuo je kako ptice pjevaju svoje pjesme, kako vjetar šušti kroz drveće, i kako potok žubori svoju melodiju. "To je nevjerojatno!" uzviknuo je. "Cijela priroda pjeva!"

"Da," odgovorila je Vila Zora s osmijehom. "Priroda je puna glazbe. Samo trebaš znati slušati."

Jednog dana, dok su Luka i Vila Zora sjedili uz jezero, primijetili su da se jedna od Lukinih ovaca izgubila. "Gdje je moja ovca?" pitao je Luka zabrinuto.

"Ne brini," rekla je Vila Zora. "Pomoci ću ti je pronaći." Zatvorila je oči i počela pjevati čarobnu pjesmu. Njezin glas se širio kroz šumu, a sve životinje su počele dolaziti - ptice, zecovi, čak i medvjedi.

"Tko traži pomoć?" upitala je jedna ptica.

"Luka je izgubio svoju ovcu," odgovorila je Vila Zora. "Možete li nam pomoći da je pronađemo?"

Sve životinje su krenule u potragu, a ubrzo su pronašle Lukinu ovcu koja se pasla u maloj dolini. "Evo je!" uzviknula je Vila Zora s radošću.

Luka je bio oduševljen. "Hvala ti, Vila Zora! Kako mogu uzvratiti tvoju dobrotu?"

"Jednostavno nastavi voljeti prirodu i pjevati s ljubavlju," odgovorila je Vila Zora. "To je sve što trebam."

Od tog dana, Luka je postao poznat kao najbolji pjevač u cijelom selu. Njegove pjesme su donosile radost svima koji su ih čuli, a on je uvijek pričao o Vila Zori i čarobnosti prirode.

"Ljudi, priroda je puna glazbe i čarolije," govorio bi. "Samo trebate znati slušati. Kada slušate prirodu, ona vam otkriva sve svoje tajne."

I tako je Luka nastavio svoje prijateljstvo s Vilom Zorom, dijeleći ljubav i glazbu s cijelim svijetom. Naučio je da je prijateljstvo s prirodom najveće bogatstvo, i da glazba i ljubav mogu povezati sve živote na svijetu.`
  },
  {
    title: 'Čarobna voda',
    author: 'Tradicionalna priča',
    body: `U davna vremena, u jednom malom selu u Bosni, živjela je stara žena po imenu Anka. Anka je bila bolesna i slaba, i svi su mislili da neće dugo živjeti. Njezin unuk, mladić po imenu Petar, bio je tužan jer je volio svoju baku više od svega na svijetu.

"Bako, moram pronaći način da te izliječim!" govorio je Petar svaki dan, držeći Ankinu ruku.

"Ne brini, dragi unuče," odgovarala bi Anka s osmijehom. "Sve će biti u redu."

Ali Petar nije mogao prestati razmišljati o tome kako da pomogne svojoj baki. Jednog dana, čuo je priču o čarobnoj vodi koja se nalazi u najdubljoj šumi, vodi koja može izliječiti bilo koju bolest. "Moram pronaći tu vodu!" odlučio je Petar.

Krenuo je na putovanje kroz gustu šumu. Putovanje je bilo opasno i teško - morao je proći kroz tamne šume, preko brzih rijeka, i kroz opasne doline. Ali Petar nije odustao. "Moram spasiti svoju baku," ponavljao je sam sebi.

Nakon dugog putovanja, stigao je do malog izvora okruženog cvijećem i drvećem. Voda je bila bistra poput kristala i blistala je na suncu. "Ovo mora biti čarobna voda!" pomislio je Petar s radošću.

Ali tada se pojavio čuvar izvora - stari čovjek s dugačkom bradom i mudrim očima. "Tko si ti i zašto tražiš čarobnu vodu?" upitao je čuvar.

"Ja sam Petar," odgovorio je. "Tražim vodu da izliječim svoju baku. Ona je bolesna i slaba, i volim je više od svega na svijetu."

Čuvar se zamislio. "Čarobna voda može izliječiti bilo koju bolest," rekao je, "ali samo ako je uzmeš s čistim srcem i ljubavlju. Također, moraš mi obećati da ćeš koristiti vodu samo za dobro, nikada za zlo."

"Obećavam!" rekao je Petar odlučno. "Samo želim pomoći svojoj baki."

Čuvar mu je dao malu bočicu čarobne vode. "Uzmi ovu vodu i daj je svojoj baki. Ali zapamti - ljubav i briga su najveće lijekove. Voda će pomoći, ali tvoja ljubav je ono što će je stvarno izliječiti."

Petar je zahvalio čuvaru i krenuo natrag kući. Putovanje je bilo još teže, jer je morao paziti da ne prolije vodu. Ali Petar je bio oprezan i hrabar, i konačno je stigao kući.

Kada je došao do svoje bake, Anka je bila još slabija. "Bako, donio sam ti čarobnu vodu!" rekao je Petar, dajući joj bočicu.

Anka je popila vodu, a Petar je sjedio pored nje, držeći joj ruku i pričajući joj priče. "Bako, volim te," govorio je. "Molim te, ozdravi."

Nakon nekoliko dana, Anka se počela osjećati bolje. Njezina snaga se vraćala, a njezin osmijeh bio je sve ljepši. "Hvala ti, dragi unuče," rekla je. "Tvoja ljubav i čarobna voda su me izliječili."

Petar je bio oduševljen. "Bako, ti si najvažnija osoba u mom životu. Nisam mogao dopustiti da te izgubim."

Od tog dana, Anka i Petar su bili još bliži. Petar je naučio važnu lekciju: "Ljubav i briga su najveće moći na svijetu. Kada volimo nekoga, možemo učiniti čuda."

Anka je nastavila živjeti dugo i sretno, a Petar je uvijek bio tu za nju. Zajedno su dijelili ljubav i radost, znajući da je njihova ljubav najveća čarolija na svijetu.

A čarobna voda? Ostala je u izvoru, čekajući sljedeću osobu koja će je tražiti s čistim srcem i ljubavlju, jer samo takvi zaslužuju njezinu moć.`
  }
]

function addStories(stories: StoryData[]) {
  const now = new Date().toISOString()
  const stmt = db.prepare(`
    INSERT INTO stories (id, title, author, body, imageUrl, isApproved, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  const transaction = db.transaction((stories: StoryData[]) => {
    for (const story of stories) {
      const id = randomUUID()
      stmt.run(
        id,
        story.title,
        story.author,
        story.body,
        null,
        1, // isApproved = true
        now,
        now
      )
      const readingTime = calculateReadingTime(story.body)
      const wordCount = story.body.trim().split(/\s+/).filter(w => w.length > 0).length
      console.log(`✓ "${story.title}": ${readingTime} min (${wordCount} words)`)
      
      if (readingTime > 10) {
        console.log(`  ⚠️  WARNING: Reading time exceeds 10 minutes!`)
      }
    }
  })
  
  transaction(stories)
  console.log(`\n✅ Added ${stories.length} stories successfully.`)
}

if (stories.length > 0) {
  console.log(`Adding ${stories.length} Bosnian folk tales...\n`)
  addStories(stories)
} else {
  console.log('No stories to add.')
}

db.close()
