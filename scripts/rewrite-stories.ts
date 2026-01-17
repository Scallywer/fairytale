import Database from 'better-sqlite3'
import path from 'path'
import { calculateReadingTime } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface StoryUpdate {
  id: string
  body: string
}

// This will contain all the rewritten stories
const storyUpdates: StoryUpdate[] = []

// Helper function to update stories
function applyUpdates(updates: StoryUpdate[]) {
  const now = new Date().toISOString()
  const stmt = db.prepare('UPDATE stories SET body = ?, updatedAt = ? WHERE id = ?')
  
  const transaction = db.transaction((updates: StoryUpdate[]) => {
    for (const update of updates) {
      stmt.run(update.body, now, update.id)
      const readingTime = calculateReadingTime(update.body)
      const wordCount = update.body.trim().split(/\s+/).filter(w => w.length > 0).length
      const story = db.prepare('SELECT title FROM stories WHERE id = ?').get(update.id) as any
      console.log(`✓ "${story?.title}": ${readingTime} min (${wordCount} words)`)
      
      if (readingTime > 10) {
        console.log(`  ⚠️  WARNING: Reading time exceeds 10 minutes!`)
      }
    }
  })
  
  transaction(updates)
  console.log(`\n✅ Updated ${updates.length} stories successfully.`)
}

// Add your rewritten stories here
// Working through stories systematically, extending where appropriate

// 1. Kralj Lavova (2 min -> extend to 4-5 min)
storyUpdates.push({
  id: '1d33844f-252c-43ab-ade2-a4c3003f6b7c',
  body: `U dalekoj afričkoj savani, gdje sunce svijetli svaki dan i gdje životinje žive u miru, živio je mali lavić po imenu Simba. Simba je bio sin velikog kralja Mufase, najhrabrijeg i najmudrijeg kralja svih životinja u savani. Mufasa je učio Simbu sve što mora znati budući kralj, jer jednog dana Simba će postati kralj cijele savane.

"Simba, dragi moj sine," govorio bi Mufasa dok su stajali na vrhu velikog stijena, gledajući preko cijele savane, "sve što vidiš pripada nama, ali i svim životinjama koje žive ovdje. Kralj mora biti mudar i hrabar, ali i dobar prema svima."

Simba je bio jako znatiželjan mali lavić koji je volio istraživati. Svaki dan bi trčao kroz visoku travu, skakao preko kamenja, i igrao se sa svojom najboljom prijateljicom Nalom. Nala je bila hrabra i pametna, i uvijek bi pratila Simbu u njegovim avanturama.

"Simba, gdje idemo danas?" pitala bi Nala, dok su trčali kroz savanu.

"Idemo u zabranjenu zemlju!" odgovarao bi Simba uzbuđeno. "Tamo su opasni hijeni, ali ja sam hrabar!"

Jednog dana, Simba i Nala otišli su u zabranjenu zemlju, gdje su živjeli opasni hijeni. To je bio veliki problem, jer hijeni nisu bili dobri i mogli su povrijediti male laviće. Kada su hijeni vidjeli Simbu i Nalu, počeli su ih proganjati.

"Bježimo!" viknula je Nala, dok su trčali što su brže mogli.

Srećom, Mufasa je čuo njihove glasove i brzo je došao da ih spasi. "Simba! Nala! Trčite ovamo!" vikao je, dok je jurio prema hijenama. Mufasa je bio tako moćan i hrabar da su hijeni odmah pobjegli.

Ali Simbin stric Scar, koji nije volio Simbu ni Mufasu, planirao je zlu stvar. Želio je postati kralj umjesto Mufase. Scar je bio zavidan i ljubomoran, i mislio je da zaslužuje biti kralj.

"Jednog dana ću biti kralj," šapnuo bi Scar sam sebi, gledajući kako Mufasa uči Simbu. "A onda će sve biti drugačije."

Jednog dana, kada je Mufasa spašavao Simbu iz opasne situacije s hijenama, Scar je napravio nešto jako zlo. Dok je Mufasa visio na rubu stijene, pokušavajući se popeti, Scar je stao iznad njega.

"Pomozi mi, Scar!" molio je Mufasa.

"Zbogom, brate," rekao je Scar hladno, i gurnuo je Mufasu s litice. Mufasa je pao i umro, a Scar je rekao Simbi da je on kriv za očevu smrt.

Simba je bio jako tužan i mislio je da je stvarno kriv za očevu smrt. Scar mu je rekao da bježi i da se nikada ne vraća. "Ako se vratiš, svi će znati da si ubio svog oca," rekao je Scar lažljivo.

Simba je pobjegao daleko, daleko, i na putu je sreo dva prekrasna prijatelja - surkata Timona i vratara Pumbu. Timon i Pumba su bili jako veseli i učili su Simbu da život može biti jednostavan i sretan ako se ne brinete o ničemu.

"Hakuna Matata!" govorili bi Timon i Pumba. "To znači bez brige! Živi dan za danom i uživaj u životu!"

Prošlo je puno godina i Simba je odrastao u snažnog mladog lava. Ali u njegovom srcu još uvijek je bila tuga i strah od vraćanja kući. Tada je došla Nala, Simbina stara prijateljica, koja je također odrasla u lijepu mladu lavicu.

"Simba! Ti si živ!" uzviknula je Nala, ne vjerujući vlastitim očima.

"Nala! Kako si me našla?" upitao je Simba.

"Tražila sam te svugdje," rekla je Nala. "Scar vlada zlo i životinje u savani trebaju pomoć. More je presušilo, hrane nema, i svi su gladni. Moramo se vratiti!"

Nala je pokušala nagovoriti Simbu da se vrati, ali Simba se bojao. "Ne mogu se vratiti, Nala. Ja sam kriv za očevu smrt."

"To nije istina, Simba!" rekla je Nala. "Ti si dobar i hrabar. Trebamo te!"

Tada se pojavio duh Mufase, Simbin otac, koji mu je rekao: "Simba, ti si moj sin i jedini pravi kralj. Ne možeš bježati od onoga tko si. Moras se vratiti i braniti svoj narod. Sjećaj se tko si."

Simba je shvatio da mora biti hrabar. Vratio se u savanu sa svojim prijateljima i suprotstavio se zlu Scaru. Bila je to velika borba, ali Simba je bio hrabar i mudar, baš kao njegov otac. Na kraju je pobijedio Scar i otkrio istinu o tome što se dogodilo njegovom ocu.

Od tog dana, Simba je vladao sa mudrošću i ljubavlju, učio je mlade životinje važnosti hrabrosti, prijateljstva i ljubavi prema domovini. Naučio je da je prava hrabrost u tome da branimo one koje volimo i da nikada ne odustajemo od onoga u što vjerujemo. I zajedno s Nalom, koja je postala kraljica, vodio je savanu u novu eru mira i sreće.`
})

// 2. Aladin (3 min -> extend to 5-6 min)
storyUpdates.push({
  id: '3b3e2397-b4ed-41b3-a4a1-cb0f61531e6e',
  body: `U čarobnom gradu Agrabah, u dalekoj arapskoj zemlji, živio je mladi lopov po imenu Aladdin. Aladdin nije imao ništa - nije imao kuću, ni novac, ni hranu. Živio je na ulicama s majmunom po imenu Abu i krao je hranu da bi preživio. Ali unatoč tome, Aladdin je bio dobar čovjek - dijelio je ono što je imao s drugima i pomagao onima kojima je trebalo pomoći.

Svakog jutra, Aladdin i Abu bi se probudili u svojoj maloj skrovištu iza tržnice. "Dobro jutro, Abu," govorio bi Aladdin, dok je majmun skakao po njegovim ramenima. "Danas ćemo pronaći nešto za jesti!"

Ali život na ulici bio je težak. Ljudi su ga gledali s podozrenjem, a čuvar grada bi ga proganjao. "Opet si tu, lopove!" vikao bi čuvar. "Odlazi odavde!"

Jednog dana, Aladdin je vidio lijepu princezu po imenu Jasmine. Jasmine je živjela u palači, ali nije bila sretna jer nije mogla biti slobodna i morala je udati se za nekog koga ne voli. Aladdin i Jasmine zaljubili su se na prvi pogled, ali nisu mogli biti zajedno jer je Aladdin bio siromašan lopov, a Jasmine bila princeza.

"Tko si ti?" upitala je Jasmine, kada je Aladdin pomogao djevojčici koja je pala na ulici.

"Ja sam Aladdin," odgovorio je, ne znajući da razgovara s princezom. "A ti?"

"Ja sam... samo djevojka koja želi biti slobodna," rekla je Jasmine, ne želeći otkriti svoj identitet.

Tada se pojavio zli vezir Jafar, koji je želio vladati kraljevstvom. Jafar je bio moćan čarobnjak i koristio je svoju moć da kontrolira sultana, Jasmine oca. Jafar je saznao da postoji čarobna špilja puna blaga, ali samo osoba s "diamantnim srcem" može ući u nju. Jafar je mislio da je to Aladdin jer je bio dobar čovjek unatoč tome što je bio siromašan.

"Aladdin," rekao je Jafar, pretvarajući se da je dobar, "želim ti pomoći. Ako uđeš u tu špilju i doneseš mi čarobnu svjetiljku, dat ću ti bogatstvo i moć."

Aladdin je bio sumnjičav, ali je pristao jer je mislio da će tako moći biti s Jasmine. Jafar je natjerao Aladdina da uđe u špilju, koja je bila puna opasnosti i čarolija.

U špilji, Aladdin je našao čarobnu lampu i kada ju je protrljao, pojavio se Džin - ogromno plavo stvorenje koje može ispuniti tri želje. Džin je bio jako prijateljski i zabavan, ali bio je zarobljen u lampi tisuću godina.

"Tko si ti?" upitao je Aladdin začuđeno.

"Ja sam Džin lampa!" odgovorio je Džin veselo. "Ispunit ću ti tri želje! Bilo što što poželiš, bit će tvoje!"

Aladdin je oslobodio Džina i postali su prijatelji. Ali Aladdin je bio zbunjen - trebao je dati lampu Jafaru, ali nije želio jer je znao da je Jafar zao. Umjesto toga, Aladdin je koristio svoju prvu želju da postane princ, jer je mislio da tako može biti s Jasmine.

"Želim biti princ!" rekao je Aladdin.

Džin je ispunio želju, i Aladdin je postao bogat princ s velikom pratnjom. Došao je u palaču i pokušao impresionirati Jasmine, ali Jasmine je vidjela da to nije pravi Aladdin - bio je lažan princ koji pokušava prevariti.

"Ti nisi pravi princ," rekla je Jasmine. "Vidim da se pretvaraš."

Na kraju, Aladdin je morao biti iskren. Rekao je Jasmine tko je stvarno - siromašan lopov koji je dobio pomoć od Džina. Ali Jasmine ga je i dalje voljela, jer je znala da je pravi Aladdin dobar čovjek u srcu, bez obzira tko je bio.

"Volim te zbog onoga što si, ne zbog onoga što imaš," rekla je Jasmine.

Tada se pojavio Jafar i ukrao lampu s Džinom. Postao je moćan čarobnjak i pokušao uzeti prijestolje. "Sada ću vladati kraljevstvom!" vikao je Jafar.

Ali Aladdin i njegovi prijatelji - Abu, Džin i čarobni tepih - zajedno su pobijedili Jafara. Na kraju, Aladdin je oslobodio Džina iz lampe koristeći svoju posljednju želju, jer je želio da njegov prijatelj bude slobodan.

"Želim da budeš slobodan, Džine," rekao je Aladdin.

"Aladdin, hvala ti!" rekao je Džin, i odletio je u slobodu.

Od tog dana, Aladdin i Jasmine živjeli su sretno zajedno, a Aladdin je naučio da pravo bogatstvo nije u zlatu ili draguljima, već u prijateljstvu, ljubavi i u tome da budemo dobri prema drugima. Naučio je da je najvažnije biti iskren i biti ono što jesi, a ne pretvarati se da si nešto što nisi. I zajedno s Jasmine, koja je postala sultana, vodio je Agrabah u novu eru mira i sreće.`
})

// 3. Bambi (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: '3c2ff347-240b-443e-864e-0c4b3c9a2166',
  body: `U velikoj, prekrasnoj šumi punoj visokog drveća i zelenog lišća, živjela je mala mlada srna po imenu Bambi. Bambi je bio najljepša mala srna koju je šuma ikada vidjela - imao je velike smeđe oči koje su blistale od znatiželje i mekan smeđi kaput s bijelim pjegama.

Kada se Bambi rodio, cijela šuma je slavila. Sve životinje su dolazile da vide malog princa šume, jer je Bambi bio sin Velikog Princa, najhrabrijeg i najmudrijeg jelena u cijeloj šumi. Bambi je rastao u ljubavi i zaštiti svoje majke, koja ga je učila svemu što treba znati o životu u šumi.

"Bambi, dragi moj," govorila bi majka nježno, dok su šetali kroz šumu, "ova šuma je naš dom. Ovdje raste hrana koju trebamo, ovdje su naši prijatelji, i ovdje smo sigurni. Ali moraš biti oprezan, jer šuma također skriva opasnosti."

Bambi je ubrzo upoznao svoje prijatelje - malog zečića Thumpera, koji je uvijek lupao nogom kada je bio uzbuđen, i skunka Flowera, koji je bio stidljiv ali jako drag. Zajedno su se igrali kroz šumu, trčali kroz livade, i učili sve o životu u prirodi.

"Bambi, pogledaj ovo!" vikao bi Thumper, dok je skakao po kamenju. "Mogu skakati visoko!"

"Ja mogu trčati brzo!" odgovarao bi Bambi, dok su trčali kroz visoku travu.

Flower bi se stidljivo pridružio, govoreći: "Ja... ja mogu pronaći najljepše cvijeće!"

Bambi je uživao u svemu što šuma nudi - gledao je kako ptice pjevaju, kako cvijeće cvjeta, i kako lišće pada u jesen. Učio je kako pronaći hranu, kako piti vodu iz potoka, i kako biti siguran od opasnosti.

"Majko, zašto lišće pada s drveća?" pitao bi Bambi, gledajući kako se zlatno lišće spušta na zemlju.

"To je priroda, dragi," odgovarala bi majka. "Svako godišnje doba donosi promjene. Jesen donosi padanje lišća, a zima donosi snijeg. Ali uvijek dolazi proljeće, kada sve ponovno raste."

Ali život u šumi nije uvijek bio lako. Jednog dana, Bambi je doživio nešto strašno - čuo je glasni zvuk koji je šumio kroz šumu, i vidio je kako životinje bježe. Bila je to opasnost koju je njegova majka uvijek spominjala - čovjek.

"Bambi, trči!" vikala je majka. "Trči što brže možeš!"

Bambi i njegova majka bježali su što su brže mogli, ali njegova majka je ostala zaostala i nikada se više nije vratila. Bambi je bio jako tužan i osjećao se usamljeno. "Gdje je mama?" pitao je, trčeći kroz šumu i tražeći je.

Ali Veliki Princ, njegov otac, došao je i pomogao mu. "Tvoja majka više ne može biti s tobom," rekao mu je nježno. "Ali ja ću biti tu za tebe. Moramo biti hrabri, Bambi, jer to je ono što čini kralja."

Prošle su godine i Bambi je odrastao u lijepog mladog jelena. Naučio je biti hrabar i mudar, baš kao njegov otac. Jednog dana je sreo lijepu mladu srnu po imenu Faline, i zaljubili su se. Zajedno su trčali kroz šumu i uživali u ljepoti prirode.

"Bambi, ti si najljepši jelen u cijeloj šumi," rekla je Faline, dok su stajali na vrhu brda, gledajući zalazak sunca.

"A ti si najljepša srna," odgovorio je Bambi, s ljubavlju u očima.

Ali opasnost se ponovno vratila - veliki požar je zahvatio šumu i sve životinje su morale bježati. Bambi je bio hrabar i pomagao je drugim životinjama da pobježu, uključujući svoje prijatelje Thumpera i Flowera.

"Thumper, Flower, idite ovamo!" vikao je Bambi, dok su svi trčali prema rijeci.

Na kraju, zajedno su se uspjeli spasiti. Kada se požar ugasio i životinje su se vratile u šumu, Bambi je vidio da je šuma počela ponovno rasti. Nova drveća su rastla, novi cvijet je procvjetao, i život se vratio.

"Pogledaj, Bambi," rekla je Faline, "šuma se vraća. Život nastavlja."

Bambi je shvatio da život nastavlja, čak i nakon teških trenutaka. Od tog dana, Bambi je postao Veliki Princ šume, naslijedivši titulu od svog oca. Vodio je životinje u šumi s mudrošću i hrabrošću, i naučio je da je najvažnije biti hrabar, voljeti svoje prijatelje, i štititi domovinu koju volimo. I zajedno s Faline, koja je postala kraljica, vodio je šumu u novu eru mira i sreće.`
})

// 4. Coco (3 min -> extend to 5-6 min)
storyUpdates.push({
  id: '06ec7151-bdee-4daf-9e57-427863c0f343',
  body: `U malom meksičkom selu, živjela je obitelj Rivera koja je vodila obrt za izradu cipela. Ali u toj obitelji bila je velika tajna - nitko nije smio svirati glazbu ili pjevati, jer je glazba bila zabranjena u kući već mnogo godina.

Mladi dječak po imenu Miguel želio je više od svega postati glazbenik, baš kao njegov heroj Ernesto de la Cruz, najslavniji glazbenik u Meksiku. Miguel je volio gitaru i pjevati, ali njegova obitelj mu nije dopuštala. "Glazba je prokletstvo u ovoj obitelji," govorili su mu. "Naš pradjed je bio glazbenik i napustio je obitelj zbog glazbe. Od tada nismo dozvolili glazbu."

Ali Miguel nije mogao prestati voljeti glazbu. Svake večeri bi se skrivao u sobi i slušao glazbu Ernesta de la Cruza, sanjajući da jednog dana postane veliki glazbenik kao on. U svojoj sobi, Miguel je imao skrivenu gitaru i slike Ernesta de la Cruza na zidovima.

"Jednog dana ću biti kao on," šapnuo bi Miguel, dok je gledao slike svog heroja. "Jednog dana ću svirati na velikoj pozornici i svi će me slušati."

Jednog dana, na Dan mrtvih, poseban dan kada Meksikanci slave svoje preminule voljene osobe, Miguel je pokušao uzeti gitaru iz Ernestove grobnice. Ali kada je to učinio, dogodila se čarolija - Miguel je mogao vidjeti i razgovarati s mrtvima!

Saznao je da je u svijetu mrtvih, gdje žive svi preminuli ljudi. Tamo je sreo svoje preminule rođake koji su mu rekli da mora vratiti se u svijet živih prije zore, inače će zauvijek ostati mrtav. Ali da bi se vratio, netko iz obitelji mora mu dati blagoslov.

Miguel je tražio svoju prabaku Coco i ostale rođake u svijetu mrtvih, ali nitko mu nije želio dati blagoslov jer nije htio odustati od glazbe. "Miguel, glazba je prokletstvo," govorili su mu. "Moramo zaštititi obitelj."

Tada je sreo Hectora, prijateljskog duha koji je pomogao Miguelu pronaći Ernest de la Cruza, jer je Miguel mislio da je Ernesto njegov pradjed. Hector je bio veseli i zabavan, i brzo su postali prijatelji.

"Hector, kako si došao ovdje?" pitao je Miguel.

"Ah, to je duga priča," odgovorio je Hector. "Ali sada sam ovdje i pomoći ću ti pronaći Ernesta."

Hector i Miguel krenuli su u pustolovinu kroz svijet mrtvih, pronalazeći Ernest. Ali kada su ga konačno našli, Miguel je saznao strašnu istinu - Ernesto je ukrao pjesme od Hectora i ubio ga tako da bi postao slavan. A Hector je zapravo bio Miguelov pravi pradjed, a ne Ernesto!

"To nije moguće!" uzviknuo je Miguel. "Ernesto je moj heroj!"

"Miguel, ponekad naši heroji nisu ono što mislimo da jesu," rekao je Hector tužno. "Ali to ne znači da ne možemo biti heroji sami."

Na kraju, Miguel i Hector zajedno su razotkrili istinu o Ernestu i spasili obitelj Rivera od zaborava. Miguel se vratio u svijet živih i pjevao je pjesmu svojoj stara baki Coco, što je pomoglo njoj da se sjeti svog oca Hectora.

"Papa Hector," šapnula je Coco, dok je slušala pjesmu. "Sjećam se tebe."

Od tog dana, obitelj Rivera dozvolila je glazbu u kući, jer su shvatili da je glazba dio njihove obitelji i njihove povijesti. Miguel je mogao svirati gitaru i pjevati koliko god je htjelo, a obitelj je naučila da je važno čuvati sjećanja na one koje volimo, jer dok ih se sjećamo, oni žive u našim srcima zauvijek. I Miguel je naučio da pravi heroji nisu oni koji su slavni, već oni koji su dobri i voljeni.`
})

// 5. Priča o Igračkama (2 min -> extend to 3-4 min)
storyUpdates.push({
  id: '18f1c255-cefc-4654-8819-1e6c807db0a2',
  body: `U sobi malog dječaka po imenu Andy živjelo je mnogo igračaka. Igračke nisu bile obične igračke - one su bile žive kada ljudi nisu gledali! Kada bi ljudi otišli iz sobe, igračke bi se probudile i živjele svoje živote puni avantura i zabave.

Andy je imao mnogo igračaka, ali najvažnija igračka bila mu je sheriff Woody - cowboy lutka koja je bila vođa svih igračaka. Woody je bio hrabar, mudar i uvijek je pazilo na sve ostale igračke. Bio je Andyjev najdraža igračka i sve ostale igračke su ga voljele i poštovale.

"Woody, što ćemo danas raditi?" pitala bi Bo Peep, mala pastirica lutka.

"Čekat ćemo da Andy dođe kući," odgovarao bi Woody. "Tada ćemo se igrati s njim."

Ali jednog dana, na Andyjev rođendan, dogodilo se nešto što je promijenilo sve. Andy je dobio novu igračku - Space Ranger Buzz Lightyear, široka akcijska figura koja je mogla letjeti i imala je lasere. Buzz je bio najnovija i najmodernija igračka, i Andy ga je odmah zavolio.

"Pogledajte Buzza!" uzviknule su igračke. "On može letjeti!"

Woody je bio ljubomoran. Mislio je da će Andy zaboraviti na njega i da će Buzz biti njegov najbolji prijatelj umjesto Woodyja. Woody je pokušao pokazati da je još uvijek važan, ali sve je išlo loše i slučajno je gurnuo Buzza kroz prozor.

"Woody, zašto si to učinio?" pitala je Bo Peep.

"Ne znam," odgovorio je Woody tužno. "Samo sam htjela biti važan."

Tada su se dogodile velike nevolje. Buzz i Woody su završili u kući zlog susjeda Sida, dječaka koji je volio uništavati igračke. U Sidovoj sobi bile su strašne igračke - igračke koje je Sid napravio kombiniranjem različitih dijelova. Bile su opasne i htjele su ubiti Buzz i Woody.

"Ne bojte se," rekao je Woody hrabro. "Zajedno možemo pobjeći."

Ali Woody i Buzz su radili zajedno i uspjeli su pobjeći iz Sidove kuće. Na putu natrag u Andyjevu sobu, Woody i Buzz su postali prijatelji. Woody je shvatio da ne mora biti ljubomoran na Buzz, i Buzz je shvatio da je igračka i da je to u redu - ne mora biti pravi Space Ranger da bude poseban.

"Buzz, oprosti što sam te gurnuo," rekao je Woody.

"Woody, sada smo prijatelji," odgovorio je Buzz. "To je sve što je važno."

Kada su se vratili kući, Andy je bio jako sretan što ih je našao. Od tog dana, Woody i Buzz postali su najbolji prijatelji i zajedno su pazili na sve ostale igračke u Andyjevoj sobi.

Woody je naučio da prava ljubav nije u tome da si jedini važan, već u tome da dijeliš ljubav s drugima. Naučio je da prijateljstvo može nastati između bilo koga, čak i između dvije igračke koje su na početku bile neprijatelji. I naučio je da je najvažnije raditi zajedno i pomagati jedno drugome.`
})

// 6. Ljepotica i Zvijer (3 min -> extend to 5-6 min)
storyUpdates.push({
  id: '7baede15-5fd2-4dba-a40f-5e214c2dc3a7',
  body: `U malom francuskom selu, davno prije, živjela je prekrasna djevojka po imenu Belle. Belle je bila posebna jer je voljela čitati knjige više od svega. Dok su druge djevojke razgovarale o ljepoti i odjeći, Belle je čitala priče o čarobnim mjestima i avanturama. Njezin otac Maurice bio je izumitelj koji je pravio čudne strojeve koji nikada nisu radili kako treba, ali Belle ga je voljela jer je bio dobar i brižan.

"Belle, dragi moj," govorio bi Maurice, dok je radilo na novom izumu, "ti si najpametnija djevojka koju poznajem. Jednog dana ćeš postati velika učenjakinja."

Belle je često šetala selom s knjigom u ruci, zanemarujući ljude koji su je gledali čudno. "Zašto čitaš toliko knjiga?" pitali bi je seljani. "Zašto ne razgovaraš s nama?"

"Knjige su moji prijatelji," odgovarala bi Belle. "U njima mogu pronaći avanture i čarolije koje ne mogu pronaći ovdje."

Jednog dana, Maurice je otišao na sajam s jednim od svojih izuma. Na putu se izgubio i došao do velikog, mračnog dvorca okruženog ogradom. Ušao je unutra tražeći pomoć, ali našao je prijezir i hladnoću. Vlasnik dvorca bio je čudovište - velika zvijer koja je bila jako ljuta i samoživa.

"Tko si ti?" vikala je Zvijer. "Kako si se usudio ući u moj dvorac?"

"Molim vas, trebam pomoć," molio je Maurice. "Izgubio sam se."

Zvijer je zatvorila Mauricea u tamnicu jer je ušao u dvorac bez dopuštenja. Belle je brzo saznala što se dogodilo i odlučila spasiti svog oca. Otišla je u dvorac i ponudila sebe umjesto oca da ostane u dvorcu kao zarobljenica.

"Oče, idem po tebe," rekla je Belle hrabro, dok je ulazila u dvorac.

Zvijer je pristala, ali Belle nije bila zarobljenica dugo. Dvorac je bio čaroban - živi namještaj koji je govorio i kretao se, čajnice koje su plesale i šalice koje su pjevale. Ali Zvijer je bila ljuta i samoživa, vikala je i prijetila svima oko sebe.

"Ne bojte se, Belle," rekla je čajnica Mrs. Potts. "Zvijer nije zla, samo je usamljena."

Ali Belle nije bila prestrašena. Bila je dobra i ljubazna prema svima u dvorcu, čak i prema Zvijeri. Postepeno, Zvijer je počela mijenjati. Vidjela je da Belle nije kao drugi ljudi koji su bili zli i pohlepni. Belle je bila dobra, hrabra i znala je vidjeti ljepotu u svemu, čak i u Zvijeri.

Svaki dan, Belle i Zvijer bi provodili vrijeme zajedno. Čitali bi knjige, jeli zajedno, i razgovarali o svemu. Postepeno, Zvijer se pretvorila iz zlog čudovišta u dobrog prijatelja.

"Belle, hvala ti što si došla," rekla je Zvijer jednog dana. "Nisam imao prijatelja već dugo vremena."

"Zvijer, ti si dobar," odgovorila je Belle. "Samo si bio usamljen."

Belle je shvatila da Zvijer nije stvarno zla - samo je bila usamljena i tužna i potrebno joj je bilo prijateljstvo. Kada je Belle vidjela da joj otac treba pomoć, Zvijer ju je pustila da ide. Ali Belle se vratila jer je voljela Zvijer i znala je da joj treba pomoć.

"Belle, zašto si se vratila?" pitala je Zvijer.

"Zato što si moj prijatelj," odgovorila je Belle. "I prijatelji se ne napuštaju."

Tada su zli ljudi napali dvorac, ali Belle i Zvijer zajedno su ih pobijedili. Kada je Zvijer bila ranjena, Belle ju je poljubila i rekao joj kako je voli. Tada se dogodila čarolija - Zvijer se pretvorila u lijepog princa! Ispostavilo se da je princ bio proklet jer nije bio dobar, ali sada kada je našao pravu ljubav, čarolija je bila slomljena.

Od tog dana, Belle i princ živjeli su sretno zajedno u dvorcu, a Belle je naučila da prava ljepota nije u tome kako netko izgleda, već u tome kako se ponaša i koliko dobrota i ljubavi ima u srcu. Naučila je da nikada ne treba suditi nekome po izgledu, već po srcu. I naučila je da prijateljstvo i ljubav mogu promijeniti sve, čak i najveće prokletstvo.`
})

// 7. Mala Sirena (3 min -> extend to 5-6 min)
storyUpdates.push({
  id: 'ff7b14ad-a6b0-4e31-8593-3b6eaf403a22',
  body: `Duboko, duboko u moru, u čarobnom podvodnom kraljevstvu koje se zove Atlantika, živjela je mala sirena po imenu Ariel. Ariel je bila najmlađa kći kralja Tritona, kralja svih mora. Bila je to prekrasna sirena s dugom crvenom kosom koja je plivala kao riba u vodi i imala najljepši glas u cijelom oceanu.

Ariel je bila jako znatiželjna o svijetu ljudi koji žive na kopnu. Voljela je skupljati predmete iz brodoloma - vilice, čaše, ogrlice i sve što bi našla na dnu mora. Njezina najbolja prijateljica bila je morska ribica po imenu Flounder, mala žuta ribica koja je uvijek bila tamo za nju.

"Ariel, zašto te zanima svijet ljudi?" pitao bi Flounder, dok su plivali kroz špilju punu predmeta.

"Zato što je tako zanimljivo!" odgovarala bi Ariel. "Pogledaj ove stvari! Što misliš da rade?"

Ali Arielin otac kralj Triton nije volio da Ariel misli o ljudima. Mislio je da su ljudi opasni i da treba ostati u moru. "Ariel, ljudi su zli," govorio bi. "Oni uništavaju more i ubijaju naše prijatelje. Ne smiješ ići blizu njih."

Ali Ariel nije mogla prestati razmišljati o svijetu iznad vode, o suncu, oblacima i ljudima koji žive na kopnu. Jednog dana, dok je plivala blizu površine, vidjela je lijepog princa po imenu Eric na njegovom brodu. Zaljubila se u njega na prvi pogled.

"Tko je on?" pitala je Flounder.

"Ne znam," odgovorila je Ariel. "Ali želim ga upoznati."

Ali tada se dogodila oluja i princ Eric je pao u more. Ariel ga je spasila i odvela ga na obalu. Ali kao sirena, nije mogla ostati s njim na kopnu.

"Moram se vratiti u more," rekla je Ariel tužno, dok je gledala kako Eric leži na obali.

Tada se pojavila zla morska vještica po imenu Ursula. Ursula je bila jako zla i željela je vladati morem. Ponudila je Arieli čaroliju koja će joj omogućiti da postane čovjek, ali uz cijenu - Ariel mora dati Ursuli svoj glas, najljepši glas u oceanu. I mora poljubiti princa Erika za tri dana, inače će postati dio Ursuline zbirke.

"Ariel, želiš li biti s princem?" pitala je Ursula. "Mogu ti pomoći, ali moraš mi dati svoj glas."

Ariel je pristala, jako je željela biti s Ericom. Dobila je noge umjesto repa, ali izgubila je glas. Sada je mogla hodati, ali nije mogla pjevati niti govoriti. Prinč Eric ju je primio u svoj dvorac, ali nije znao da je ona ta koja ga je spasila.

"Tko si ti?" pitao je Eric.

Ariel nije mogla odgovoriti, ali je pokušala pokazati da je dobra i ljubazna. Eric je brzo zavolio njezinu ljubaznost i hrabrost, iako nije mogla govoriti.

Tri dana su prošla jako brzo. Ursula se pretvorila u lijepu djevojku s Arielinim glasom i pokušala zavesti princa Erika. Ali Ariel je uspjela razotkriti Ursulu i princ Eric je shvatio tko je prava Ariel.

"Ariel, ti si ta koja me je spasila!" uzviknuo je Eric.

Ali bilo je prekasno - Ariel je postala morska vještica u Ursulinoj zbirci. Ali princ Eric nije odustao. Napao je Ursulu i spasio Ariel. Kralj Triton, koji je vidio koliko Ariel voli Erika, pretvorio je Ariel u čovjeka zauvijek, jer je shvatio da je ljubav najvažnija stvar na svijetu.

Od tog dana, Ariel i Eric živjeli su sretno zajedno, i Ariel je mogla ići u more kad god je htjela, jer je imala i noge za kopno i rep za more. Naučila je da su najvažnije stvari u životu hrabrost, ljubav i nikada ne odustajati od svojih snova. I naučila je da ljubav može prevladati sve prepreke, čak i razlike između svjetova.`
})

// 8. Moana (3 min -> extend to 5-6 min)
storyUpdates.push({
  id: '8c100828-da6c-43e4-aa5f-36bb36731a1e',
  body: `Na prekrasnom otoku Motunui u Tihom oceanu, živjela je hrabra djevojčica po imenu Moana. Moana je bila kći poglavice otoka, što znači da će jednog dana postati vođa svog naroda. Ali Moana je bila posebna - voljela je more više od svega, jako više nego što bi trebala voljeti vladar otoka.

Njezin otac poglavica Tui uvijek joj je govorio: "Moana, more je opasno. Naš narod živi ovdje na otoku, i tu ćemo ostati zauvijek. Ne treba nam more." Ali Moana je osjećala da more zove njezino ime. Svaki dan bi gledala more i sanjala o putovanjima daleko preko horizonta.

"Zašto ne mogu ići u more?" pitala bi Moana svoju baku Talu.

"More te bira, Moana," odgovarala bi baka. "Ali tvoj otac se boji. On je izgubio svog najboljeg prijatelja u moru kada je bio mlad."

Jednog dana, Moana je saznala pravu priču o svom narodu. Nekada davno, njezini preci bili su veliki moreplovci koji su putovali daleko i istraživali različite otoke. Ali tada se bog Maui, polubog koji je imao čarobnu štapinu, ukrao zeleni dragulj od boginje Te Fiti. Te Fiti je bila boginja koja je stvarala živu i koraljne grebene, i kada joj je dragulj ukraden, sve je počelo propadati.

Maui je pokušao pobjeći s draguljem, ali ga je proganjao ogromni lavlji demon po imenu Te Ka. Maui je izgubio svoju čarobnu štapinu i dragulj, a Te Ka je započeo uništavati sve otoke u oceanu, uključujući i Motunui.

Moana je shvatila da mora vratiti dragulj Te Fiti da spasi svoj otok i sve otoke u oceanu. Njezina baka Tala, koja je poznavala stare priče, dala joj je dragulj i rekla: "More te bira, Moana. To je tvoja sudbina."

Tako je Moana krenula u opasno putovanje preko okeana, sama u malom čamcu. Na putu je srela Mavericka, njezinog velikog psa koji ju je pratio, i konačno našla Mauija na malom otoku gdje je živio sam tisuću godina.

Maui nije bio sretan što ga je Moana našla. Bio je ljut i nije želio vratiti dragulj. "Zašto bih ti pomogao?" pitao je. "Ljudi su me izdali prije."

Ali Moana nije odustala. Dokazala mu je da je hrabra i da može navigirati morem, i natjerala ga da pristane vratiti dragulj zajedno s njom. "Maui, moramo spasiti sve otoke," rekla je. "To je naša dužnost."

Putovanje je bilo opasno - suočili su se s Te Ka, ogromnim lavljim demonom koji je bio zapravo Te Fiti bez svog srca. Borili su se protiv njega, ali Moana je shvatila pravu tajnu - Te Ka nije bio demon, bio je Te Fiti koji je izgubio svoje srce.

"Te Fiti, ovo je tvoje srce," rekla je Moana, dok je vraćala dragulj. "Oprosti nam što smo ga uzeli."

Moana je vratila dragulj Te Fiti, i sve se vratilo u normalu. Otoci su ponovno procvjetali, koraljni grebeni su bili živi, a Maui je dobio svoju štapinu natrag. Moana se vratila na svoj otok kao heroj i vodio je svoj narod u veliko putovanje preko oceana, vraćajući im njihovo pravo naslijeđe kao moreplovaca.

Od tog dana, Moana je naučila da je najvažnije slušati svoje srce i slijediti svoju sudbinu, čak i kada drugi kažu da je to nemoguće. Naučila je da hrabrost, upornost i ljubav prema domovini mogu dovesti do najvećih uspjeha. I naučila je da ponekad moramo biti hrabri i ići protiv onoga što drugi kažu, ako znamo da je to pravo.`
})

// 9. Pinokio (4 min -> extend to 6-7 min)
storyUpdates.push({
  id: 'a39e9756-6e1f-4d71-8799-3e3b0add6299',
  body: `U malom talijanskom selu, živio je stari drvodelja po imenu Geppetto. Geppetto je bio jako usamljen i želio je sina da dijeli svoju ljubav. Svake večeri bi sjedio u svojoj radionici i pravio igračke za djecu, ali u srcu je želio sina.

"Kako bi bilo lijepo imati sina," govorio bi Geppetto, dok je gledao kroz prozor na djecu koja su se igrala na ulici. "Kako bi bilo lijepo imati nekoga tko bi me volio i s kim bih mogao dijeliti svoju ljubav."

Jedne večeri, Geppetto je napravio lijepu lutku od drveta koja je izgledala kao mali dječak. Nazvao ju je Pinokio i učinio je s tolikom ljubavlju da je bio najljepša lutka koju je ikada napravio. Te noći, kada je Geppetto gledao kroz prozor prema zvijezdama, molio se da bi Pinokio mogao biti pravi dječak.

Njegova molitva je uslišena! Plava Vila, dobra čarobnica koja živi među zvijezdama, došla je i oživjela Pinokia. "Geppetto je dobar čovjek i zaslužuje sina," rekla je Vila. "Dat ću ti život, Pinokio, ali moraš biti hrabar, iskren i dobrog srca. Ako budeš dobar dječak, jednog dana ćeš postati pravi dječak od krvi i kostiju."

Ali Vila je također dala Pinokiu posebnog prijatelja - malu zrikavca po imenu Jiminy Cricket, koji će biti Pinokiov savjetnik i pomoći mu da bude dobar. "Slušaj svoju savjest, Pinokio," rekla mu je Vila, pokazujući mu na Jiminyja.

Pinokio je bio oduševljen što je živ! Mogao je razgovarati, hodati, i osjećati. Geppetto je bio najsretniji čovjek na svijetu jer je konačno dobio sina. "Pinokio, moj sine!" uzviknuo je, zagrljujući ga. "Konačno imam sina!"

Ali Pinokio je bio mlad i znatiželjan, i ponekad nije slušao savjet svoje savjesti. Sljedećeg dana, kada je Pinokio krenuo u školu, sreo je dva zla muškarca - Honest John i Gideon - koji su ga prevrli i rekli mu da može postati glumac i biti slavan umjesto da ide u školu.

"Pinokio, zašto ideš u školu?" pitao je Honest John. "Možeš biti slavan glumac i zaraditi puno novca!"

Pinokio je bio iskušen i pratio ih je u kazalište, ali to je bila greška. Kazalište je bilo zlo mjesto gdje je zli čovjek po imenu Stromboli držao dječake zarobljene i tjeranja ih da rade za njega. Pinokio je bio zarobljen, ali na sreću, Plava Vila ga je spasila.

Ali kada je Vila pitala Pinokia zašto nije išao u školu, Pinokio je lagao, i svaki put kada bi lagao, njegov nos bi narastao! "Zašto mi nos raste?" pitao je Pinokio uplašeno.

"Zato što lažeš," odgovorila je Vila. "Kada lažeš, tvoj nos raste. Kada govoriš istinu, vraća se na normalnu veličinu."

Jiminy Cricket pokušao je reći Pinokiu da prestane lagati, ali Pinokio je lagao još više i njegov nos je postao tako velik da više nije mogao hodati. Vila mu je rekla da će mu nos ostati tako velik dok ne počne biti iskren.

Pinokio je shvatio svoju grešku i počeo govoriti istinu. Njegov nos se vratio na normalnu veličinu, a Vila mu je rekla da mora biti hrabriji i slušati svoju savjest.

Ali tada su se dogodile nove nevolje. Pinokio je sreo zlog čovjeka po imenu Coachman, koji je vozio dječake na čarobni otok gdje su se mogli zabavljati bez odraslih. Ali taj otok bio je zapravo zamka - dječaci koji su tamo otišli pretvarali su se u magarce i prodavali u radnje!

Pinokio i njegov prijatelj Lampwick otišli su na taj otok i počeli se zabavljati. Ali brzo su se počeli pretvarati u magarce - prvo su dobili repove, zatim uši, a zatim su se potpuno pretvorili u magarce. Pinokio je bio užasnut i pokušao pobjeći, ali već je imao rep i uši magarca!

Kada se Pinokio vratio kući, saznao je da je Geppetto otišao u more tražeći ga i da ga je progutao veliki kit po imenu Monstro. Pinokio je bio hrabar i otišao je u more tražeći svog oca. Ušao je u kitovu utrobu i našao Geppetta.

"Oče, našao sam te!" uzviknuo je Pinokio.

"Pinokio, moj sine!" odgovorio je Geppetto. "Kako si me našao?"

Zajedno su osmisli plan kako pobjeći - zapalili su vatru unutar kita, što ga je navelo da kihe i ispljunuo je ih. Vraćajući se kući, Pinokio je spašavao Geppetta od utapanja, ali sam je pao u vodu i umro.

Ali Plava Vila je vidjela koliko je Pinokio bio hrabar i iskren. Oživjela ga je i pretvorila u pravog dječaka od krvi i kostiju, jer je pokazao da je stvarno hrabar, iskren i dobar.

Od tog dana, Pinokio je bio pravi dječak i živio je sretno s Geppettom. Naučio je da je važno biti iskren, slušati svoju savjest, i biti hrabar kada treba zaštititi one koje volimo. I naučio je da prava ljubav i hrabrost mogu pretvoriti bilo koga u pravu osobu.`
})

// 10. Pronalaženje Nema (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: '8b0d4f41-ea3c-4efe-a2d6-4873ee7a2236',
  body: `Duboko u toplim vodama Velikog koraljnog grebena, živjela je mala ribica po imenu Nemo. Nemo je bio posebna mala ribica jer je imao jednu malu peraju koja je bila drugačija od druge - bio je hrabar i znatiželjan, ali njegov otac Marlin bio je jako zabrinut.

Marlin je bio morski klovn, vrsta ribe koja živi u anemoni. Bio je jako zaštitnički prema Nemu jer je Nema majka umrla kada je Nemo bio jajašce. Marlin je uvijek bio zabrinut i nije dopuštao Nemu da ide daleko ili da se igra s drugim ribama.

"Okean je opasan, Nemo," govorio bi mu svaki dan. "Moraš ostati blizu doma. Ne idi daleko, ne razgovaraj s strancima, i uvijek me slušaj."

Ali Nemo je bio znatiželjan i želio je istraživati veliki okean. "Oče, zašto ne mogu ići daleko?" pitao bi. "Sve druge ribe mogu."

"Zato što si poseban, Nemo," odgovarao bi Marlin. "I moram te zaštititi."

Jednog dana, kada je Marlin bio jako zabrinut i govorio mu da ne ide daleko, Nemo se ljutio. "Nisam bebica!" rekao je ljutito i otplivao daleko od doma, prema velikom brodu koji je plovio na površini.

Ali to je bila velika greška. Ribolovac - čovjek koji lovi ribu - ulovio je Nema u mrežu i odnio ga na brod. Marlin je vidio sve to i užasnuo se. Znao je da mora spasiti svog sina, bez obzira koliko daleko mora plivati.

"Ne mogu vjerovati," šapnuo je Marlin. "Moj sin je otišao. Moram ga pronaći."

Tako je započelo najveće putovanje Marlina - plivao je kroz cijeli okean tražeći svog sina. Na putu je sreo prijateljsku, ali malo zaboravnu ribicu po imenu Dory. Dory je imala problema s pamćenjem - zaboravljala je stvari vrlo brzo, ali imala je veliko srce i uvijek je željela pomoći.

"Dory, možeš li mi pomoći pronaći svog sina?" pitao je Marlin.

"Naravno!" odgovorila je Dory veselo. "Ali... tko si ti? I tko je tvoj sin?"

Zajedno, Marlin i Dory plivali su kroz opasne vode, izbjegavali morske pse, susreli morske kornjače koje su ih voze, i konačno stigli do Sydneya u Australiji, gdje je Nemo bio zarobljen u akvariju u zubarskoj ordinaciji.

U međuvremenu, Nemo je ušao u akvarij pun drugih riba koje su također bile ulovljene. Bile su tužne jer su željele vratiti se u okean. Nemo je bio hrabar i pomogao im da osmisle plan kako pobjeći iz akvarija i vratiti se u more.

"Ne možemo pobjeći," govorile su ribe. "Akvarij je zatvoren."

"Možemo!" rekao je Nemo hrabro. "Moramo samo biti pametni i raditi zajedno."

Kada su Marlin i Dory konačno stigli do zubarske ordinacije, Nemo je već bio u akvariju. Marlin je bio tužan jer nije mogao doći do Nema. Ali Nemo je bio pametan - pomogao je Dory da se zapleše u mrežu i tako privuče pažnju ribolovca, dok su ostale ribe pomogle Nemu da pobegne kroz prozor u more.

Na kraju, Marlin i Nemo su se konačno ponovno sjedinili u velikom okeanu. Marlin je shvatio da je Nemo bio hrabar i pametan sve vrijeme, i naučio je da ponekad treba biti hrabar i dopustiti djeci da budu neovisna, ali da se uvijek možemo vratiti jedno drugome.

"Nemo, oprosti što sam bio previše zaštitnički," rekao je Marlin.

"Oče, razumijem," odgovorio je Nemo. "Znao sam da me voliš."

Od tog dana, Marlin i Nemo živjeli su sretno zajedno, a Dory je postala dio njihove obitelji. Nemo je naučio da je očev zaštitnički stav dolazio iz ljubavi, a Marlin je naučio da povjerenje i hrabrost mogu biti važnije od straha. I naučili su da zajedno mogu prevladati svaku prepreku.`
})

// 11. Čarobna Obitelj Madrigal (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: '39eb0095-ff9b-4664-b40a-4f5de256f792',
  body: `U magičnom kolumbijskom gradu sakrivenom u planinama, živjela je posebna obitelj po imenu Madrigal. Obitelj Madrigal bila je posebna jer su svi članovi obitelji imali čarobne moći - osim jedne djevojčice po imenu Mirabel.

Mirabelina obitelj živjela je u čarobnoj kući koja je bila živa - kuća je mogla kretati prozore i vrata, stvarati stepenice i pomagati obitelji u svakodnevnom životu. Kuća je bila čarobna jer je prije mnogo godina prabaka Alma dobila magičnu svijeću koja je dala cijeloj obitelji posebne moći.

Svi u obitelji su imali posebne darove. Mirabelina starija sestra Luisa bila je najjača osoba na svijetu - mogla je podići bilo što, čak i cijele kuće. Druga sestra Isabela mogla je stvarati najljepše cvijeće i biljke samo zamislim. Mirabelin brat Camilo mogao se pretvoriti u bilo koga koga je želio. Majka Julieta mogla je liječiti bilo koga hranom koju je skuhala. Stričevi i tete također su imali posebne moći - mogli su kontrolirati vremenske prilike, razgovarati sa životinjama, i puno više.

Ali Mirabel nije imala nikakvu moć. Kada je bila mala i došao je njezin dan da dobije dar, ništa se nije dogodilo. Bila je jedina u obitelji bez magije, i često se osjećala kao da ne pripada.

"Zašto nemam dar?" pitala bi Mirabel svoju majku.

"Draga, ti si posebna na svoj način," odgovarala bi majka. "Ne trebaš magiju da budeš posebna."

Ali Mirabel nije odustala. Voljela je svoju obitelj i željela je pomoći, čak i bez magije. Bila je hrabra, pametna i uvijek spremna pomoći drugima.

Jednog dana, Mirabel je primijetila da se čarobna kuća počela raspadati. Stakla su pucala, zidovi su pucali, a sve magične moći u obitelji počele su nestajati. Nitko nije znao zašto se to događa, osim Mirabel.

"Što se događa?" pitala je Mirabel. "Zašto se kuća raspada?"

Mirabel je otkrila da je prabaka Alma, koja je vodila obitelj, bila previše zaštitnička i nije dopuštala obitelji da budu ono što su stvarno bili. Svi su pokušavali biti savršeni i skrivati svoje probleme, što je uzrokovalo da magija nestaje.

"Abuela, moramo biti ono što jesmo," rekla je Mirabel. "Ne možemo biti savršeni."

Mirabel je pomogla svojoj obitelji da shvati da su svi posebni na svoj način, čak i ona koja nema magiju. Pomogla je svojoj sestri Isabeli da prizna da ne želi biti savršena, već da želi biti ono što jest. Pomogla je bratu Antoniju da shvati da može razgovarati sa životinjama na svoj način.

Na kraju, Mirabel je spasila čarobnu kuću tako što je pobjegla od Abuela Alme i pokazala joj da se trebaju voljeti takvi kakvi jesu, a ne pokušavati biti savršeni. Kuća je ponovno izgrađena, ali ovaj put svi su imali pravu magiju - magiju ljubavi, prihvaćanja i biti ono što jesi.

Od tog dana, Mirabel je shvatila da je njezin dar bio što je bila - hrabra, ljubazna i spremna pomoći drugima bez magije. Naučila je da je prava magija u ljubavi i prihvaćanju, a ne u posebnim moćima. I obitelj je naučila da je najvažnije biti ono što jesi i voljeti jedno drugo bez obzira na sve.`
})

// 12. Dumbo (3 min -> extend to 4-5 min)  
storyUpdates.push({
  id: '9372fdab-10da-45bf-9134-f371487da836',
  body: `U velikom cirkusu koji putuje kroz Ameriku, živjela je mala slonica po imenu Dumbo. Dumbo je bio poseban, ali ne na način na koji bi htio biti - imao je ogromne, ogromne uši koje su bile mnogo veće nego uši bilo koje druge slonice u cirkusu.

Dumbo je bio jako tužan jer su se sve druge životinje u cirkusu rugale njegovim velikim ušima. "Pogledaj Dumboa!" govorili bi smijući se. "Ima najveće uši koje smo ikada vidjeli!" Dumbo je bio stidljiv i osjećao se kao da ne pripada, jer nije bio kao ostali slonovi.

Ali Dumbo je imao najbolju majku na svijetu - mamu slonicu po imenu Mrs. Jumbo. Mrs. Jumbo je voljela svog sina više od svega na svijetu, bez obzira na njegove velike uši. Svaki put kada bi se netko rugao Dumbo, njegova majka bi ga zaštitila i rekla: "Moj Dumbo je najljepši slon na svijetu, i njegove uši su posebne jer čine ga posebnim."

"Dumbo, ne slušaj ih," govorila bi majka nježno. "Ti si poseban na svoj način, i to je dobro."

Ali jedan dan, kada su se dječaci u cirkusu počeli rugati Dumbo i njegovoj majci, Mrs. Jumbo je postala jako ljuta i zaštitila je svog sina. Zbog toga su je ljudi u cirkusu zatvorili u kavez i nazvali je "luda slonica", iako nije bila luda - samo je voljela svog sina.

Dumbo je bio jako tužan jer više nije mogao biti s majkom. "Mama, zašto su te zatvorili?" pitao je, dok su suze tekle niz njegov obraz.

"Zato što te volim, Dumbo," odgovorila bi majka. "I uvijek ću te voljeti."

Ali tada je sreo malog miša po imenu Timothy Q. Mouse, koji je postao njegov najbolji prijatelj. Timothy je vidio koliko je Dumbo poseban i pomogao mu je da shvati da su njegove velike uši zapravo dar, a ne problem.

"Tvoje uši su tvoj dar, Dumbo," rekao mu je Timothy. "One te čine posebnim, a posebno je dobro!"

Jedne noći, dok su Dumbo i Timothy razgovarali, dogodilo se nešto čarobno. Timothy je dao Dumbo čarobno perje, rekavši mu da će mu donijeti sreću. Ali stvarno čarobno bilo je ono što je Dumbo shvatio - mogao je letjeti pomoću svojih velikih ušiju!

Dumbo je bio iznenađen - mogao je letjeti! Njegove velike uši nisu bile problem - bile su njegov najveći dar! Kada bi mahao ušima, mogao je poletjeti u zrak kao ptica, i to je bilo najljepše osjećanje na svijetu.

"Timothy, mogu letjeti!" uzviknuo je Dumbo.

"Znao sam da možeš!" odgovorio je Timothy. "Tvoje uši su tvoj dar!"

Dumbo je počeo vježbati letenje svaki dan, i Timothy mu je pomogao. Zajedno su stvorili najljepši cirkuski nastup koji je itko ikada vidio - Dumbo je letio kroz cirkus kao ptice, a svi su bili oduševljeni.

Kada su ljudi u cirkusu vidjeli kako Dumbo leti, sve se promijenilo. Dumbo je postao najpoznatiji i najvoljeniji slon u cijelom cirkusu. Svi su htjeli vidjeti letećeg slona s velikim ušima, i Dumbo je postao velika zvijezda.

Na kraju, Mrs. Jumbo je oslobođena i mogla je biti s Dumbo ponovno. Oboje su bili sretni, a Dumbo je naučio da je njegova posebnost - velike uši koje omogućuju letenje - zapravo najveći dar koji je dobio.

Od tog dana, Dumbo je naučio da ono što ga činilo drugačijim - velike uši - zapravo ga je činilo posebnim i jedinstvenim. Naučio je da treba biti ponosan na ono što jesi, jer svatko ima svoje darove i posebnosti koje ga čine posebnim. I naučio je da prava prijateljstva i ljubav majke mogu pomoći da prevladamo bilo kakve teškoće.`
})

// 13. Pepeljuga (4 min -> extend to 6-7 min)
storyUpdates.push({
  id: 'babb2afa-4b4c-4f4e-8cfc-81815e91f342',
  body: `U malom selu, okruženom zelenim brdima i šumama, živjela je djevojka po imenu Pepeljuga. Iako je bila veoma lijepa i dobra, nije imala sretan život. Njena zla maćeha, gospođa Zora, bila je stroga i uvijek ju je tjerala da obavlja sve kućanske poslove.

"Pepeljugo, brzo mi operi suđe! Ne mogu ja raditi sve sama!", vikala bi Zora, dok su njene dvije polusestre, Mila i Lila, sjedile na sofi i čitale časopise.

"Ali mama, ja sam umorna!", žalila se Mila, koja je imala dugu plavu kosu i često se ponašala kao princeza. Lila, s crnim uvojcima, dodala bi: "Da, Pepeljuga, ti si uvijek tako vrijedna! Mi smo previše zauzete da bismo radile."

Pepeljuga bi samo uzdahnula i nastavila s poslom. Svakog dana bi se budila rano ujutro, čistila kuću, prala odjeću, i pripremala hranu za cijelu obitelj. Ali unatoč svemu, Pepeljuga nije gubila nadu. Svakog je dana sanjala o ljepšem životu, o prijateljima i avanturama.

"Jednog dana ću biti sretna", često bi ponavljala dok je prala podove i čistila dimnjake. "Jednog dana ću pronaći svoju sreću."

Jednog jutra, dok je brala cvijeće u vrtu, Pepeljuga je čula veseli zvuk trubljenja. "Što li to može biti?", pomislila je i potrčala prema selu. Tamo je saznala da kralj organizira veliki bal i da su sve djevojke u kraljevstvu pozvane!

"Oh, kako bih voljela ići na bal!", uzviknula je s nadom u očima. "Kako bih voljela plesati i upoznati nove ljude!"

Kad se Pepeljuga vratila kući, odmah je rekla svojoj maćehi: "Mama, mogu li ići na bal? Molim vas!" Gospođa Zora ju je pogledala s neodobravanjem. "Ne, ti ćeš ostati ovdje i raditi! Osim toga, tko bi te uopće htio vidjeti na balu?", odgovorila je zla maćeha.

Mila i Lila su se nasmijale i dodale: "Da, Pepeljugo, nemaš šanse! Ti si samo sluškinja!"

S tugom u srcu, Pepeljuga se vratila u svoju sobu. "Ali ja ću ići na bal!", odlučila je. I tada se pojavila njezina dobra vila, s blistavim krilima i osmijehom. "Draga Pepeljugo, čula sam tvoje želje. Ne brini, pomoći ću ti!", rekla je vila.

"Kako? Što ću nositi?", upitala je Pepeljuga, uzbuđena i sretna. Vila se nasmiješila i zamahnula svojim čarobnim štapićem. U trenutku, Pepeljuga je nosila predivnu haljinu od svjetlucavog svile i staklene cipele koje su se sjajile poput zvijezda.

"Ali pazi, moraš se vratiti prije ponoći!", upozorila je vila. "Nakon ponoći, čarolija će nestati."

Na balu, svjetlost svijeća plesala je po zidu, a glazba je bila prekrasna. Pepeljuga je ušla i svi su se okrenuli prema njoj. Princ, zgodan i hrabar, odmah je primijetio Pepeljugu. "Tko si ti, ljepotice?", upitao je s osmijehom.

"Ja sam Pepeljuga", odgovorila je sramežljivo, osjećajući se kao da leti.

Plesali su zajedno, a vrijeme je prolazilo brzo. "Nikada nisam upoznao nekoga poput tebe", rekao je princ. "I ja nikada nisam srela nekoga tko me tako usrećuje", uzvratila je Pepeljuga.

Ali kada je sat otkucao ponoć, Pepeljuga se sjetila što joj je vila rekla. "Moram ići!", povikala je i pobjegla iz dvorca. U bijegu, ispustila je jednu staklenu papučicu. Princ je trčao za njom, ali ona je nestala u noći.

Sljedećih dana, princ je tražio djevojku kojoj pripada papučica. Čuo je svaku djevojku u kraljevstvu kako se pokušava uklopiti u cipelu, ali nijedna nije uspjela. "Mora biti ona koja je ukrala moje srce!", odlučio je.

Na kraju je došao do Pepeljuginog doma. "Nadam se da će ti ova papučica odgovarati", rekao je dok je gledao Pepeljugu. Njene polusestre su pokušavale obući papučicu, ali im nije odgovarala. Kada je Pepeljuga probala, cipela je savršeno pristajala!

"Ti si moja princeza!", uzviknuo je princ. Pepeljuga je bila sretna i ispunjena ljubavlju. "Hvala vam, što ste me pronašli!", rekla je. Princ ju je poveo natrag u dvorac gdje su proslavili njihovu ljubav.

Svi u kraljevstvu su bili sretni zbog njih. Pepeljuga je naučila da dobrota i ljubav mogu pobijediti svako zlo. "Sanjala sam o ovom trenutku i nikada neću odustati od svojih snova", rekla je s osmijehom. I tako su Pepeljuga i princ živjeli sretno do kraja života, okruženi ljubavlju i prijateljstvom.`
})

// 14. Snjeguljica i sedam patuljaka (4 min -> extend to 6-7 min)
storyUpdates.push({
  id: '335015a8-c539-468a-b2c5-5c36466f1f41',
  body: `U dalekom kraljevstvu, u kojem su cvjetale šarene cvjetne livade i gdje su se rijeke slijevale poput srebrnih traka, živjela je prekrasna princeza po imenu Snjeguljica. Svi su u kraljevstvu znali za njezinu ljepotu. Imala je kožu bijelu poput snijega, kosu crnu poput ebonita i usne crvene poput ruže. Ali, unatoč svojoj ljepoti, Snjeguljica nije bila sretna. Naime, imala je zlu maćehu, kraljicu koja je bila ljuta i ljubomorna na njezinu ljepotu.

Jednog dana, dok je Snjeguljica šetala po vrtu, maćeha joj se obratila. "Snjeguljice, dođi ovamo!" povikala je. Snjeguljica je nervozno prišla. "Što želiš, majko?" upitala je tiho.

"Znaš li ti koliko si lijepa? Previše si lijepa! To mi ne prija. Zbog tvoje ljepote, svi me zaboravljaju!" vikala je zla maćeha.

Snjeguljica je bila uplašena, ali je odlučila ostati mirna. "Ja samo želim biti dobra i voljeti sve oko sebe," rekla je.

Zla maćeha je bijesno slegnula ramenima. "Pogledaj se! Ti si prijetnja za mene! Moraš nestati!" Uzela je otrovnu jabuku i odjednom je Snjeguljici došlo do srca. U tom trenutku, Snjeguljica je znala da mora pobjeći. "Moram ići," rekla je i potrčala prema šumi.

U šumi je bilo mnogo drveća, a ptice su cvrčale. Snjeguljica se osjećala slobodno, ali i dalje uplašeno. Dok je trčala, srela je sedam patuljaka koji su kopali zlato. Patuljci su bili veseli i ljubazni. Najstariji među njima, po imenu Grga, prišao je Snjeguljici i rekao: "Hej, tko si ti, draga djevojko?"

"Ja sam Snjeguljica," odgovorila je tiho. "Bježim od zle maćehe koja želi da mi naudi."

"Samo uđi u našu kuću!" rekao je Grga. "Bit ćemo ti prijatelji i čuvat ćemo te."

Snjeguljica se nasmiješila i ušla u njihovu malu kućicu. Unutra je sve bilo šareno i toplo. Patuljci su je dočekali s ljubaznošću. "Zovemo se: Grga, Miki, Luki, Roki, Piko, Tiko i Dido," predstavili su se svi.

"Kako je lijepo ovdje!" rekla je Snjeguljica. "Hvala vam što ste me primili."

"Možemo zajedno raditi i igrati se!" uzviknuo je Roki. "Što voliš raditi?"

"Volim pjevati i plesati," odgovorila je Snjeguljica veselo. Tako su patuljci organizirali zabavu. Pjevali su, plesali i veselili se do mraka.

No, zla maćeha nije odustajala. U svom dvorcu, stajala je ispred čarobnog ogledala i upitala: "Ogledalo, ogledalo, tko je najljepši u ovoj zemlji?"

Ogledalo je odgovorilo: "Snjeguljica je najljepša, ona je u šumi s patuljcima."

Maćeha je bila bijesna. "Onda ću je pronaći i završiti s njom jednom zauvijek!" rekla je.

Obukla se kao starica i donijela otrovnu jabuku. Kada je došla do kuće patuljaka, pokucala je na vrata. "Dobar dan, mala djevojčice," rekla je Snjeguljici. "Došla sam ti donijeti ovu jabuku."

Snjeguljica je bila sumnjičava. "Tko si ti?" upitala je.

"Ja sam starica koja donosi sreću," rekla je maćeha. "Pokušaj ovu jabuku, bit ćeš najsretnija na svijetu."

Snjeguljica je, nažalost, zagrizla jabuku i odmah se srušila. Patuljci su se vratili kući i vidjeli je ležati. "Ne! Što se dogodilo?" povikali su u glas.

Grga je brzo rekao: "Moramo je spasiti! Mogu li neki od vas otići po čarobnjaka?"

Miki je odmah otrčao, a patuljci su se okupili oko Snjeguljice, plačući. "Draga Snjeguljice, molimo te, probudi se!" govorili su.

Nakon nekog vremena, čarobnjak je stigao. "Što se ovdje događa?" upitao je.

"Naša draga prijateljica je zaspala zbog otrovne jabuke!" objasnio je Grga.

Čarobnjak je prišao Snjeguljici i poljubio je u čelo. "Ova čarolija može se slomiti samo poljupcem prave ljubavi," rekao je.

U tom trenutku, princ iz obližnjeg kraljevstva, koji je čuo za Snjeguljicu, došao je do kuće patuljaka. Vidjevši Snjeguljicu, poljubio ju je. Odjednom, Snjeguljica se probudila!

"Što se dogodilo?" upitala je zbunjeno.

"Spasio si nas, dragi princ!" rekli su patuljci sretno. "Tvoja ljubav je oslobodila Snjeguljicu."

Snjeguljica je bila presretna. "Hvala ti, princu! S tobom se osjećam sigurno."

Princ se nasmiješio. "Zajedno ćemo uvijek biti tu jedni za druge."

Na kraju, Snjeguljica i princ su se vjenčali, a patuljci su bili njihovi gosti na svadbi. Svi su se veselili i plesali do kasno u noć. Snjeguljica je naučila da ljubav i prijateljstvo mogu pobijediti svaku zlu čaroliju. I živjeli su sretno zauvijek!`
})

// 15. Devojka postala iz pomaranče (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: '4bed7315-0c5a-4801-b460-bc6757187e76',
  body: `U davnim vremenima, u prekrasnom kraljevstvu, živio je mladi kraljević po imenu Luka. Luka je bio hrabar i ljubazan, ali je imao jedan veliki problem - nije mogao pronaći svoju pravu ljubav. Njegovo srce je bilo ispunjeno tugom, jer je putovao kroz mnoge zemlje, sreo mnogo princeza, ali nitko od njih nije mogao osvojiti njegovo srce.

"Zašto ne mogu pronaći pravu ljubav?" pitao bi Luka sam sebi, dok je gledao kroz prozor svoje palače. "Sve princeze su lijepe, ali nitko nije pravi."

Jednog dana, dok je šetao kroz šumu, Luka je sreo staricu koja je sjedila na klupi. "Dobar dan, mladi kraljeviću," rekla je starica sa smiješkom. "Zašto si tužan?"

"Tražim svoju pravu ljubav," uzdahnuo je Luka. "Putovao sam daleko, ali nitko nije pravi."

Starica ga je pogledala s razumijevanjem. "Možda ćeš naći ljubav u čarobnom vrtu. Tamo raste drvo s tri zlatne naranče. Tko god dotakne naranču, otkrit će svoju sudbinu."

Luka je bio znatiželjan. "Kako mogu doći do tog vrta?" upitao je.

"Slijedi put koji vodi prema suncu, i naći ćeš ga," odgovorila je starica. Luka joj se zahvalio i krenuo na put.

Nakon dugog putovanja, napokon je stigao u čarobni vrt. Drvo s tri zlatne naranče bilo je prekrasno i blistavo poput sunca. Luka nije mogao vjerovati vlastitim očima. "Wow, ovo je najljepše drvo koje sam ikada vidio!" rekao je sam sebi.

Prišao je drvetu i pažljivo uzeo jednu naranču. Odjednom, naranča se otvorila, i iz nje je izašla prekrasna djevojka. Imala je zlatnu kosu koja je sjajila kao zlato, plave oči koje su se smijale, i osmijeh koji je mogao osvijetliti cijeli svijet.

"Tko si ti?" upitao je Luka začuđeno, ne vjerujući vlastitim očima.

"Ja sam Mia, djevojka iz naranče," odgovorila je ona s osmijehom. "Čekala sam te ovdje, znajući da ćeš doći. Ja sam tvoja prava ljubav."

Luka je bio oduševljen. "Mia, ti si najljepša djevojka koju sam ikada vidio! Kako to da si ovdje?"

"Čarolija naranče me čuvala," objasnila je Mia. "Sviđaš mi se jer si hrabar i odan. Zajedno možemo učiniti mnogo čarobnih stvari."

Njihova ljubav je bila toliko snažna da je mogla prevladati sve prepreke. Luka i Mia odlučili su se vratiti u kraljevstvo. Dok su hodali, razgovarali su o svojim snovima.

"Što voliš raditi, Mia?" upitao je Luka.

"Volim plesati i pjevati," rekla je Mia veselo. "Kada plešem, osjećam se slobodno kao ptica. A ti?"

"Ja volim istraživati nova mjesta i pomagati ljudima," odgovorio je Luka. "Zajedno bismo mogli učiniti naše kraljevstvo najsretnijim mjestom!"

Kada su konačno stigli u kraljevstvo, ljudi su ih dočekali s oduševljenjem. "Kraljeviću Luko, tko je ova prekrasna djevojka?" pitali su.

"To je Mia, moja prava ljubav!" rekao je Luka ponosno.

Mia je pozdravila sve s osmijehom. "Drago mi je što vas upoznajem! Zajedno možemo učiniti naše kraljevstvo boljim."

I tako su Luka i Mia počeli raditi zajedno. Organizirali su zabave, plesove i igre za djecu. Svi su ih voljeli, a njihova ljubav je rasla svakim danom. Luka je bio sretan, a Mia je bila njegova svjetlost.

Njihova priča brzo je postala legenda u kraljevstvu. Priča o ljubavi koja se nalazi na najneočekivanijim mjestima, o ljubavi koja je čekala pravi trenutak, i o ljubavi koja traje zauvijek. Luka i Mia su živjeli sretno, pomažući svima oko sebe, i nikada nisu zaboravili čarobni vrt s tri zlatne naranče.

I tako, svaki put kada bi netko prošao kroz šumu, mogli su čuti smijeh i pjesmu iz kraljevstva, a svi su znali - prava ljubav može se pronaći čak i u čarobnim narančama.`
})

// 16. Dječak i šuma (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: 'c551fb33-2ab7-45d5-99ab-71eb5cf51777',
  body: `U malom selu na rubu velike šume, živio je mali dječak po imenu Marko. Marko je bio veseli dječak s ljubavlju prema prirodi. Imao je kratku smeđu kosu i uvijek se smiješkao. Njegove oči sjajile su poput zvjezdica kada bi gledao u šumu. "Šuma je moje najdraže mjesto na svijetu!", često je govorio prijateljima.

Svaki dan, čim bi se probudio, Marko bi obuo svoje omiljene čizme, uzeo svoj mali ruksak i trčao prema šumi. Šuma je bila puna raznolikih boja - zelene krošnje, smeškanih cvjetova i šarenih leptira koji su plesali u zraku. "Pogledaj, crveni leptir! I plavi cvijet!" uzvikivao bi Marko, sretno trčeći kroz šumske staze.

Jednog dana, dok je istraživao šumske proplanke, Marko je ugledao malog vjevericu kako skakuće s drveta na drvo. "Hej, mali prijatelju! Kako se zoveš?" upitao je Marko. Vjeverica se zaustavila i odgovorila: "Ja sam Viki! Tražim orahe za večeru." Marko se nasmijao i rekao: "Mogu ti pomoći! Zajedno ćemo ih pronaći!"

Tako su Marko i Viki proveli cijeli dan tražeći orahe. Pronašli su ih mnogo, a Viki je bila presretna. "Hvala ti, Marko! Ti si najbolji prijatelj!" rekla je vjeverica dok je poskakivala oko njega. Marko je bio sretan jer je znao da šuma nije samo mjesto, već i dom mnogim prijateljima.

No, jednog jutra, dok se igrao, čuo je zabrinjavajuće vijesti. Ljudi iz sela govorili su da će posjeći drveće kako bi napravili nova gradilišta. "Ne! Šuma treba pomoći!" pomislio je Marko, osjećajući se prestrašeno. Sjetio se kako mu je šuma uvijek bila prijatelj i kako ga je tješila kada je bio tužan. "Moram nešto učiniti!" odlučio je.

Uzeo je svoj ruksak i trčao do središta sela. Tamo su se okupljali svi mještani. "Ljudi! Molim vas, slušajte me!" povikao je Marko. "Naša šuma je u opasnosti! Trebamo je zaštititi!" Mještani su ga čudno gledali, a neki su se smijali. "Marko, to je samo drveće", rekli su.

Ali Marko se nije predavao. "Šuma je naš prijatelj! Ona nam daje zrak, hladovinu i dom životinjama! Zamislite koliko će životinja izgubiti dom!" rekao je, dok su mu se oči napunile suzama. Mnogi su se počeli okupljati oko njega, a neki su klimali glavama. "Istina je! Šuma je važna za sve nas!" rekla je starija žena iz sela.

Uzbuđeni, Marko je okupio sve ljude iz sela i ispričao im priče o šumi. Govorio je o svojim avanturama s Viki i drugim životinjama. "Kada sam tužan, šuma me tješi. Kada sam sretan, ona dijeli moju radost. Pomozite mi da je zaštitimo!"

Ljudi su ga slušali s pažnjom. "Marko, imaš pravo. Šuma nije samo drveće; ona je naše blago", rekao je jedan od farmera. "Moramo nešto poduzeti!" dodala je druga žena.

Od tog dana, selo je odlučilo zaštititi šumu. Organizirali su akcije sadnje novih drveća i postavili znakove da se ne siječe. Marko je bio sretan i ponosan. "Hvala vam svima!", rekao je s osmijehom. "Zajedno možemo učiniti velike stvari!"

Kako su dani prolazili, Marko je postao čuvar šume. Svaki vikend, on i njegovi prijatelji dolazili su u šumu da je čiste i paze. Upoznali su nove prijatelje, poput malog zeca koji se zvao Zoki i simpatične ptice koje su pjevale. "Hej, Zoki! Dođi s nama!", pozivao je Marko svaki put kada bi ga vidio.

Marko je naučio da ljubav i hrabrost mogu prevladati svaku opasnost. Šuma je bila sretna, a Marko je znao da će uvijek štititi ono što voli. "Nikada neću zaboraviti kako sam naučio da zajedno možemo učiniti svijet boljim mjestom!" rekao je Marko s osmijehom, gledajući u prekrasnu šumu koja je bila njegov najbolji prijatelj.`
})

// 17. Ivica i Marica (3 min -> extend to 4-5 min) - already read, adding extended version
storyUpdates.push({
  id: '75839667-63c2-4528-a69d-0ae3759494bc',
  body: `U malom, slikovitom selu, okruženom zelenim brdima i mirisnim cvjetovima, živjela je obitelj koja, iako siromašna, bila je vrlo sretna. U toj obitelji su bila dvoje djece - Ivica i Marica. Ivica je bio stariji brat, s plavim očima koje su uvijek sjajile od radosti, dok je Marica bila njegova mlađa sestra s dugom, smeškom punom sreće i kovrdžavom, smešnom kosom. Njih dvoje su bili najbolji prijatelji i uvijek su provodili vrijeme zajedno, bilo igrajući se na livadi ili pomažući roditeljima u vrtu.

Jednog sunčanog jutra, dok su se igrali u dvorištu, njihovi roditelji su došli s tužnim licima. "Djeco, moramo vam nešto reći," započela je mama s tišinom u glasu. "Naša situacija je teža nego što smo mislili. Nemamo dovoljno hrane i ne znamo kako ćemo preživjeti do sljedeće žetve."

Ivica i Marica su se pogledali, a zatim hrabro rekli: "Ne brinite, mama! Mi ćemo vam pomoći!" Njihova mama se nasmiješila, iako joj je u očima bila vidljiva briga. "Ali, djeco, šuma je puna opasnosti. Trebate biti oprezni."

"Ne brinemo se, mama! Zajedno smo hrabri!" rekao je Ivica, dok je Marica klimala glavom u znak potpore. Njihova odlučnost bila je snažna, i tako su krenuli prema šumi, odlučni da pronađu hranu za svoju obitelj.

Šuma je bila gusta i puna drveća, a sunčeva svjetlost prolazila je kroz lišće stvarajući čarobne sjene. "Pogledaj, Marice! Tamo su gljive!" uzviknuo je Ivica. Marica je trčala za njim, a njihova sreća bila je zarazna. Dok su skupljali gljive, primijetili su i jagode koje su rasle u grmlju. "Ove su sjajne! Uzet ćemo ih puno!" rekla je Marica, dok je sretno punila svoju košaru.

Nakon što su skupili puno hrane, odlučili su istražiti još malo. "Idemo do onog velikog drveta! Čini se da je tu nešto zanimljivo," predložio je Ivica. Kada su stigli, ugledali su pticu s prekrasnim šarenim perjem. "Pogledaj, Marice! Ta ptica je prekrasna!" rekla je Marica, zapanjena ljepotom ptice.

"Možda nam može pomoći," rekao je Ivica. "Hej, ptico! Možeš li nam pokazati gdje možemo pronaći još hrane?" Ptica je nabrala glavu i zapjevala. Ivica i Marica su je slijedili, nadajući se da će ih odvesti do još više hrane.

Nakon što su putovali nekoliko minuta, ptica ih je odvela do mjesta punog oraha! "Ovo je pravo blago!" uzviknula je Marica, a Ivica se nasmijejao. "Zajedno ćemo skupiti koliko god možemo!"

Kada su napunili svoje košare, krenuli su natrag kući. Putem su razgovarali o svemu što su vidjeli i doživjeli. "Znaš, Marice, stvarno je dobro imati hrabrost i zajedno raditi," rekao je Ivica. "Da, brate! Nikad ne bih skupila toliko hrane bez tebe!" odgovorila je Marica, ponosna na njihovu suradnju.

Kada su stigli kući, njihova obitelj je bila iznenađena i sretna. "Pogledajte što smo donijeli!" rekli su uglas, pokazujući punu košaru. Mama i tata su se zagrlili, a oči su im se napunile suzama radosnicama. "Vi ste naši heroji!" rekao je tata s osmijehom.

Ivica i Marica su naučili važnu lekciju tog dana - zajedno mogu prevladati svaku prepreku. Njihova ljubav i hrabrost donijeli su im ne samo hranu, već i sreću i ponos. Od tog dana, obitelj je živjela sretno, uvijek znajući da zajedno mogu sve, bez obzira na to koliko su veliki problemi bili. A šuma je postala njihovo posebno mjesto, gdje su se uvijek vraćali po nove avanture.`
})

// 18. Crvenkapica (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: '0979ba54-954d-40b4-978c-c3f84b43d320',
  body: `U malom, slikovitom selu, okruženom prekrasnim livadama i šumama, živjela je mala djevojčica po imenu Crvenkapica. Svakoga dana nosila je svoju omiljenu crvenu kapu, koja je bila šivana od najmekšeg platna. Svi su je u selu voljeli, a posebno su je zvali Crvenkapica zbog njezina prepoznatljivog izgleda.

"Crvenkapice, dođi van, igramo se!", zvali su je njezini prijatelji, ali ona je imala posebno mjesto u srcu za svoju baku. "Moram posjetiti baku!", odgovorila bi s osmijehom i veselo je trčala prema šumi.

Njezina baka živjela je u maloj kućici na rubu šume, gdje su cvjetale najljepše ruže i mirisale slatke jagode. Svakodnevno bi Crvenkapica odabrala najljepše cvijeće iz svog vrta i pripremila košaru s hranom. „Bako, donijela sam ti kruh, kolače i malo jagoda!“, uzviknula bi sretno dok bi hodala putem prema bakinoj kući.

Jednog sunčanog jutra, Crvenkapica je odlučila posjetiti svoju baku. "Mama, mogu li ići do bake?", upitala je. "Naravno, draga, ali budi oprezna i ne skreći s puta", odgovorila je mama, brinući se za svoju kćer.

Putovanje do bakine kuće bilo je uzbudljivo, ali i pomalo zastrašujuće. Šuma je bila gusta i puna neobičnih zvukova. "Samo naprijed, Crvenkapice!", ohrabrivala se, dok su ptice cvrčale i vjetar šuškao kroz lišće.

Međutim, dok je hodala, naišla je na vuka. Vuk je bio ogromnog tijela i imao je sjajne, zle oči. "Hej, mala djevojčice, kuda ideš?", upitao je s lažnim osmijehom.

"Idem posjetiti svoju baku koja živi u kućici na kraju šume", odgovorila je Crvenkapica, ne sluteći opasnost.

"Zar ne bi bilo brže ako kreneš ovim putem?", upitao je vuk, pokazujući na skretanje koje je vodilo daleko od glavnog puta. "Možeš ubrati nekoliko cvjetova za svoju baku!"

Crvenkapica je pomislila: "To zvuči zabavno!" i odlučila se skrenuti. "Hvala, vuku! To je odlična ideja!", rekla je veselo, dok je počela brati cvijeće.

Međutim, vuk je bio lukav i iskoristio je priliku. "Ja ću otići do bake i reći joj da ti dolaziš. Tako će je iznenaditi!", rekao je i potrčao prema bakinoj kući.

Kada je vuk stigao, pokucao je na vrata. "Tko je?", upitala je baka. "Ja sam Crvenkapica. Donijela sam ti hranu!", lažno je rekao vuk, imitirajući Crvenkapicin glas.

"Bako, to sam ja!", povikao je vuk dok je ulazio u kuću. Baka je odmah shvatila da nešto nije u redu. "O, ne! To nisi ti, Crvenkapice!", uzviknula je, ali bilo je prekasno. Vuk ju je zarobio i sakrio u ormar.

U tom trenutku, Crvenkapica je završila s branjem cvijeća i odlučila se vratiti na put. "Bako, dolazim!", povikala je. Kada je stigla do bakine kuće, primijetila je da su vrata otvorena. "Bako, gdje si?", upitala je s zabrinutošću.

Ušla je unutra i vidjela vuka kako leži u bakinom krevetu, prekriven pokrivačem. "Bako, zašto imaš tako velike oči?", upitala je, pokušavajući ostati mirna.

"Da te bolje vidim, draga!", odgovorio je vuk, trudeći se da izgleda prijateljski.

"Ali bako, zašto imaš tako velike uši?", nastavila je pitati.

"Da te bolje čujem!", rekao je vuk, sve više se približavajući Crvenkapici.

"Ali bako, zašto imaš tako velike zube?", povikala je sada već uplašena.

"Da te bolje pojedem!", uzviknuo je vuk i skočio iz kreveta.

U tom trenutku, Crvenkapica je shvatila da treba biti hrabra. "Neću te pustiti da povrijediš moju baku!", povikala je.

Srećom, čuo je lovac koji je prolazio obližnjim putem. "Što se događa?", upitao je, čuvši viku. Brzo je ušao u kuću i ugledao vuka.

"Stani, zlo stvorenje!", povikao je lovac. Zgrabio je svoj strijelu i brzo je gađa vuka. "Odlazi od njih!"

Vuk je pobjegao kroz vrata i više ga nikada nisu vidjeli.

Crvenkapica i baka su se zagrlile. "Hvala ti što si došao, lovče!", rekla je baka sretno. "Zajedno smo jači!", dodala je Crvenkapica, učeći da hrabrost i pamet mogu pobijediti svaku opasnost.

Od tog dana, Crvenkapica je postala još bliža svojoj baki, a zajedno su često pričale o važnosti ljubavi, hrabrosti i prijateljstvu. "Zauvijek ću te čuvati, bako!", obećala je Crvenkapica, a s osmijehom su gledale zalazak sunca, znajući da su zajedno sigurni.`
})

// 19. Jagor (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: 'd14bdeb6-986c-4eb2-9897-13596dcb27cd',
  body: `U davnim vremenima, postojalo je čarobno stvorenje po imenu Jagor. Jagor je bio mali, ali vrlo mudar, s dugim ušima i krznenim tijelom koje je sjajilo na suncu. Imao je moć da vidi u budućnost i da razumije jezik svih živih bića. Bio je čuvar prirode, prijatelj svih životinja i uvijek je bio spreman pomoći onima kojima je potrebna podrška.

Jagor je živio u šumi, u maloj špilji koja je bila okružena šarenim cvijećem i visokim drvećem. Svakog jutra, kada je sunce počelo izlaziti, Jagor bi se probudio uz zvukove ptica koje su pjevale svoje radosne pjesme. "Ah, kakav divan dan!" rekao bi Jagor, istegnuvši svoje dugine uši. "Vrijeme je za nove avanture!"

Jednog dana, dok je šetao kroz šumu i slušao priče koje su pričale životinje, Jagor je iznenada čuo tihi plač. "Tko to plače?" upitao je sebe. Krenuo je prema zvuku i ubrzo ugledao malu djevojčicu po imenu Luka. Imala je plavu haljinicu i smešak koji je blistao, ali sada je bila prestrašena i izgubljena. "Oh, kako ću se vratiti kući?" plakala je. "Ne znam gdje sam!"

Jagor se približio i rekao tiho, poput šaptanja lista: "Ne brini, mala Luka. Ja sam Jagor, čuvar ove šume. Došao sam ti pomoći!" Luka je gledala u njega s nevjericom. "Ti si stvarno čarobno stvorenje?" upitala je. "Da, i zajedno ćemo pronaći put do tvog doma," odgovorio je Jagor s osmijehom.

Jagor je pozvao sve svoje prijatelje iz šume. "Ptice, dođite! Zecovi, brže! Trebamo pomoć!" brzo je povikao. Ptice su se okupile oko njega, pjevajući veselu pjesmu. "Mi ćemo ti pokazati put, Luka!" rekle su ptice. Zecovi su skakali oko njih, veselo se smiješeći. "Svi ćemo ti pomoći da se vratiš kući!" dodali su.

Jagor je počeo hodati, a ptice su letele iznad njih. "Luka, ovo je drvo staro tisuću godina," objasnio je Jagor dok su prolazili pored jednog velikog hrasta. "Ono zna sve tajne šume." Luka je gledala u drvo s divljenjem. "Stvarno? Što sve zna?" upitala je. "Zna priče o svim životinjama koje su ovdje živjele i o svemu što se dogodilo u ovoj šumi," odgovorio je Jagor.

Dok su hodali, Luka je primijetila kako su se cvjetovi na tlu otvorili, a mirisne boje su je očarale. "Kako su lijepi!" uzviknula je. Jagor se nasmiješio. "Svaki cvijet ima svoju priču. Ovaj ovdje se zove Ljubičica. Ona donosi sreću svima koji se nađu u njenom društvu."

Nakon nekog vremena, Jagor je rekao: "Evo nas, Luka! Tu je tvoj put kući." Luka je bila oduševljena. "Hvala ti, Jagore! Ti si pravi heroj!" povikala je. "Zahvaljujući tebi, mogu se vratiti svojoj obitelji!"

"Ali, Luka, sjeti se," rekao je Jagor ozbiljno, "priroda je naš prijatelj, i trebamo je čuvati. Uvijek se sjeti da svako stvorenje ima svoju priču i da sve što radimo utječe na naš svijet." Luka je kimnula. "Obećavam, Jagore. Brinut ću se o prirodi i svim njenim stvorenjima."

Od tog dana, Luka je postala prijateljica Jagora i svih stvorenja u šumi. Svakog vikenda dolazila bi u šumu, donoseći kolače za ptice i šapćući tajne drveću. Naučila je da priroda nije nešto čega se treba bojati, već nešto što nas voli i želi nam pomoći. Zajedno su stvarali najljepše priče, a svaki put kad bi se Luka vraćala kući, nosila bi sjećanje na čarobnu šumu i prijateljstvo s Jagorom.

I tako su Jagor i Luka zajedno istraživali šumu, svaki dan otkrivajući nove tajne i učili jedni od drugih. A šuma, puna života i ljubavi, svjedočila je prijateljstvu koje je raslo iz dana u dan.`
})

// 20. Koko i duhovi (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: '64f0fb6b-1056-4ad4-8522-76a72c80a07e',
  body: `U staroj kući na rubu grada, živio je mali mačak po imenu Koko. Koko je bio hrabar i znatiželjan mačić s mekanim, narančastim krznom i velikim, sjajnim očima koje su uvijek sjajile od uzbuđenja. Volio je istraživati sve kutove kuće, od tavana do podruma, i svaki put bi otkrio nešto novo.

"Jupi! Što ću danas otkriti?" govorila je Koko, trčeći prema starim drvenim stepenicama koje su vodile do tavana.

U kući su živjeli i duhovi - dobri duhovi! Bili su veseli i prijateljski raspoloženi, a Koko ih je obožavao. Najviše je volio duhicu po imenu Luna. Luna je bila blistava i imala je sjajnu, srebrnu haljinu koja je svijetlila kao zvijezde na nebu.

"Hej, Koko! Spreman za igru?" pitala je Luna dok se pojavila ispred njega, smiješeći se.

"Naravno, Luna! Što ćemo raditi?" odgovorio je Koko, a u njegovim očima od radosti su zaiskrile zvjezdice.

Duhovi su često organizirali igre skrivalice u kući. Koko je volio trčati kroz prostrane hodnike, dok su se duhovi skrivali iza starih namještaja. "Naći ću vas sve!" viknuo je Koko, a duhovi su se smijali, cijela kuća bila je ispunjena njihovim veseljem. Koko je naučio da duhovi nisu nešto čega se treba bojati - oni su bili prijatelji koji su ga voljeli i željeli pomoći.

Jednog dana, dok se Koko igrao s duhovima, čuo je zvukove iz prizemlja. "Tko je to?" upitao se. Odjednom, vrata su se otvorila i u kuću je ušla nova obitelj. Bili su malo sramežljivi i uplašeni, a Koko ih je odmah primijetio. "Mama, tata! Tko su ti ljudi?" upitao je.

"To su novi susjedi, Koko," rekla je Luna. "Izgledaju kao da se boje duhova. Moramo im pomoći da shvate da smo mi prijatelji."

Koko je odlučio da će im pokazati koliko su duhovi zapravo dobri. Približio se obitelji, a onda rekao: "Bok! Ja sam Koko. Ne brinite se, duhovi su ovdje da bi se igrali s nama!"

Obitelj se malo prepala i otac je rekao: "Mačke govore? I duhovi? O čemu to pričaš?"

"Da, da! Duhovi su naši prijatelji! Dođite, pokazaću vam!" Koko je veselo skakao oko njih, dok su duhovi počeli izlaziti iz sjena i smiješiti se.

"Ja sam Luna," rekla je duhica, "i ovdje smo da budemo vaši prijatelji!"

Majka je bila znatiželjna. "Stvarno? Duhovi su prijatelji?"

"Da! Pokažemo vam kako se igramo," rekao je Koko. "Svi, dođite van!"

Obitelj je malo oklijevala, ali znatiželja ih je natjerala da krenu s Kokom i duhovima. Igrali su se zajedno u vrtu, trčali, smijali se i uživali. Koko je pokazao obitelji kako duhovi mogu biti zabavni.

Nakon nekoliko sati igre, obitelj je shvatila da duhovi nisu opasni, već prijatelji. "Hvala ti, Koko! Vi ste zaista divni!" rekla je majka dok su se svi smijali.

Od tog dana, kuća je bila puna ljubavi i radosti. Koko i duhovi su postali najbolji prijatelji s novom obitelji. Svakog dana su se zajedno igrali, pričali priče i stvarali nezaboravne uspomene.

"Znaš, Koko," rekla je Luna jednog dana, "sad imamo još više prijatelja. Ovo je najbolja kuća na svijetu!"

Koko je sretno mahao repom. "Da! Svi smo zajedno, i to je ono što je najvažnije!"

I tako je stara kuća na rubu grada postala mjesto sreće, igre i prijateljstva, zahvaljujući malom mačku Koku i njegovim duhovnim prijateljima.`
})

// 21. Mačak Džingiskan i Miki Trasi (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: 'ca3ea621-abdc-4c43-95b0-354cac4ffa72',
  body: `U malom, živopisnom selu, među mirisnim cvjetovima i zelenim livadama, živjeli su dva neobična mačka - Džingiskan i Miki Trasi. Džingiskan je bio hrabar mačak s krznenim repom koji je uvijek bio uspravan, a oči su mu sjajile poput zvijezda. Bio je poznat po svojim avanturama i strasti prema istraživanju. "Svijet je pun čuda!", često je govorio. S druge strane, tu je bio Miki Trasi, pametan i mudar mačak, s naočalama koje su mu visjele na nosu. "Učenje je ključno za sve!", volio je ponavljati dok je čitao knjige pod stablom jabuke.

Jednog sunčanog jutra, dok su se Džingiskan i Miki Trasi igrali u dvorištu, čuli su kako se djeca u selu žale. "Što se događa?", upitao je Džingiskan, nadolazeći bliže. "Nestao je mali Marko!", odgovorila je Anja, djevojčica s dugim pletenicama. "Svi ga tražimo, ali ne možemo ga pronaći!"

Džingiskan je odmah osjetio da nešto mora učiniti. "Ne brinite, pronaći ćemo Marka!", hrabro je rekao. Miki Trasi je odmah dodao: "Moramo smisliti plan. Prvo, trebamo razgovarati s njegovim prijateljima kako bismo saznali gdje ga posljednji put nisu vidjeli."

Krenuli su prema igralištu gdje su se okupljali Markovi prijatelji. "Hej, gdje ste vidjeli Marka?", upitao je Džingiskan. Luka, Markov najbolji prijatelj, uzdahnuo je: "Igrali smo se u šumi, a on je otišao malo dalje, ali se nije vratio."

Miki Trasi je brzo zabilježio sve informacije u svoj bilježnicu. "Dakle, krenut ćemo prema šumi", rekao je odlučno. "Džingiskane, ti vodiš, a ja ću paziti na znakove."

Dok su hodali prema šumi, Džingiskan je govorio: "Znaš, Miki, uvijek sam se bojao šume. Ali, ako možemo pomoći Marku, onda ću se suočiti s bilo čime!" Miki mu je odgovorio: "Zajedno smo jači. Ako budemo radili kao tim, ništa nas ne može zaustaviti!"

Kada su ušli u šumu, svijet oko njih je bio drugačiji. Drveće je bilo visoko i gusto, a sunčeva svjetlost je prolazila kroz lišće poput zlatnih zraka. Odjednom su čuli tihi plač. "To mora biti Marko!", rekao je Džingiskan i potrčao prema zvuku. Ispod velikog hrasta, pronašli su Marka kako sjedi s tužnim licem.

"Marko, jesi li dobro?", upitao je Miki Trasi dok su mu prišli. "Ne znam kako se vratiti kući", odgovorio je Marko kroz suze. "Izgubio sam se igrajući se."

"Ne brini, sada si s nama", rekao je Džingiskan. "Zajedno ćemo se vratiti!" Miki je dodao: "Prvo, trebamo pronaći put natrag. Gledaj, ovdje su tragovi. Možda možemo slijediti ih."

Pružili su ruke, odnosno šape, i zajedno su krenuli. Džingiskan je hrabro vodio put, dok je Miki pažljivo proučavao tragove. "Ovdje idemo lijevo, a zatim desno prema onom velikom kamenju!", rekao je Miki s osmijehom.

Nakon nekoliko minuta, napokon su stigli do ruba šume. "Pogledaj, tamo je naše selo!", povikao je Džingiskan. Marko je sretno uskočio. "Moji roditelji će biti tako sretni!"

Kada su stigli do Markove kuće, svi u selu su ih dočekali s radošću. "Hvala vam, Džingiskane i Miki Trasi!", vikali su. Markova mama ih je zagrlila. "Ne znam što bismo bez vas!", rekla je sretan.

Od tog dana, Džingiskan i Miki Trasi postali su heroji sela. Djeca su ih zvala "Mačke hrabrosti". "Sjećate se kada smo zajedno tražili Marka?", pitala je Anja. "Da, i to je bila najbolja avantura!", odgovorio je Miki Trasi s osmijehom.

Naučili su da prijateljstvo i hrabrost mogu donijeti najljepše trenutke. "Zajedno možemo sve!", ponovili su Džingiskan i Miki Trasi, a njihovo prijateljstvo postalo je jače nego ikad. I tako su nastavljali istraživati svijet oko sebe, uvijek spremni za nove avanture, jer su znali da će zajedno uvijek pronaći put.`
})

// 22. Moć prijateljstva (3 min -> extend to 4-5 min) - already read, adding extended version
storyUpdates.push({
  id: '249ca163-ab74-4eec-a767-7409276dea67',
  body: `U malom, šarenom selu, smještenom među brdima i rijekama, živjela su dva najbolja prijatelja - dječak po imenu Marko i djevojčica po imenu Ana. Marko je bio veseli dječak s crnom kosom i širokim osmijehom, dok je Ana imala duge plave uvojke i uvijek je nosila šarene haljine. Njihovo prijateljstvo bilo je najjače u cijelom selu, a svi su ih voljeli.

Svaki dan nakon škole, trčali bi do rijeke da se igraju. "Hej, Marko, ajmo na most!" viknula bi Ana, dok bi se penjala na drveni most. "Čekaj, Ana! Pazi da ne padneš!" smijao se Marko, trčeći za njom. Zajedno su provodili sate praveći brodiće od lišća i gledajući kako plove niz rijeku.

Jednog dana, dok su se igrali, čuli su uznemirujuće vijesti. Stariji mještanin, djed Luka, trčao je prema njima s zabrinutim izrazom na licu. "Marko! Ana! Požar se približava našem selu! Moramo se pripremiti!" rekao je drhtavim glasom. Djeca su se u prvi tren uplašila. "Što ćemo napraviti, djed Luka?" upitala je Ana, držeći Marka za ruku.

"Moramo obavijestiti sve ljude u selu i pomoći im da se spreme. Ti, Marko, trči do trgovine i reci im da zatvore prozore. Ana, ti idi do škole i obavijesti učitelje!" rekao je djed Luka. "U redu! Idemo!" odlučili su jednoglasno.

Marko je trčao prema trgovini, dok je Ana uzela svoj bicikl. "Brže, brže!" vikala je dok je pedalirala kroz ulice. "Moramo pomoći svima!" Na putu prema školi, susrela je svoju najbolju prijateljicu Lanu. "Lana, dođi! Požar dolazi! Moramo reći učiteljima!" rekla je Ana, a Lana je odmah klimnula glavom. "Idemo zajedno!"

Nakon što su obavijestili sve u selu, Marko i Ana su se ponovno sreli. "Što sada radimo?" upitao je Marko. "Moramo smisliti plan kako da zaštitimo naše selo!" odlučila je Ana. "Mislila sam da bismo mogli pomoći ljudima da naprave vodene barijere! Možda bismo mogli koristiti kante i vodu iz rijeke!"

"To je sjajna ideja!" uzviknuo je Marko. "Hajdemo odmah! Što više ljudi se pridruži, to bolje!"

Zajedno su okupili sve mještane. "Ljudi, trebamo vašu pomoć! Požar dolazi! Moramo raditi zajedno!" rekao je Marko. "Svi ćemo se organizirati i raditi kao tim!" dodala je Ana, a ljudi su se počeli okupljati.

Bilo je puno posla. Svi su trčali, nosili kante i vodu, dok su se smijali i bodrili jedni druge. "Svi zajedno! Idemo, idemo!" vikala je Ana, dok su svi punili kante vodom iz rijeke. Marko je pomagao starijim osobama da donesu vodu.

Nakon nekoliko sati napornog rada, svi su se umorili, ali su bili ponosni. "Pogledajte što smo napravili!" rekao je Marko, pokazujući na dugačku liniju kanti s vodom. "Zajedno možemo učiniti velike stvari!"

Kada je požar konačno stigao, mještani su se okupili uz vodene barijere. Požar je bjesnio, ali su se svi borili zajedno. "Ne damo našem selu!" viknula je Ana dok je prskala vodu na vatru.

Na kraju, hrabrost i timski rad su pobijedili. Požar je bio ugašen, a selo je bilo spašeno. Svi su se okupljali i slavili. "Hvala vam, Marko i Ana! Bez vas ne bismo uspjeli!" govorili su mještani, s osmijehom na licu.

Marko i Ana su se pogledali i nasmijali. "Zajedno smo jači!" rekla je Ana. "Prijateljstvo može prevladati svaku prepreku!" dodao je Marko. Njihova priča postala je legenda u selu, pričajući o prijateljstvu koje je jače od bilo koje oluje i o hrabrosti koja dolazi iz srca. I tako su Marko i Ana nastavili živjeti svoje avanture, uvijek spremni pomoći jedni drugima i svom selu.`
})

// 23. Pisac i princeza (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: 'c9948849-033b-467f-a8ec-a5e03764ac99',
  body: `U dalekom kraljevstvu, među zelenim brežuljcima i mirisnim cvjetovima, živio je mladi pisac po imenu Luka. Luka je bio poznat po tome što je volio pričati priče. Njegove priče bile su tako lijepe da su mogle osvijetliti i najtamnije noći, donoseći radost u najtužnija srca. Imao je svijetlu plavu kosu, velike smešne oči i osmijeh koji je uvijek bio na njegovom licu. Luka je bio jednostavan čovjek, ali imao je poseban dar – imao je sposobnost vidjeti ljepotu u svemu što ga okružuje.

Svakog jutra, Luka bi sjedio pod starim hrastom u vrtu i pisao. "Danas ću napisati o junaku koji putuje u daleke zemlje!" govorio je sam sebi, dok je njegov vjerni pas, Max, ležao pored njega, s povremeno mahnitom repom.

Jednog dana, dok je Luka pisao svoju novu priču, čuo je šapate u dvorcu. "Zašto je princeza tako tužna?" upita Max, podižući svoju glavu. Luka se zamislio. Princeza kraljevstva, lijepa i mila, često je bila viđena s tugom na licu. "Moramo joj pomoći, Max!" odluči Luka. "Napisat ću najljepšu priču koju sam ikad napisao!"

Luka je sjeo i počeo pisati. Priča koju je smislio govorila je o ljubavi, prijateljstvu i čarobnosti života. "U ovoj priči, junak će pronaći čarobni biser koji donosi sreću!" govorio je dok je pisao. Max je veselo lajao, podržavajući svog prijatelja.

Nakon što je završio, Luka je uzeo svoju priču i odlučio otići do dvorca. "Max, idemo! Moramo donijeti ovu priču princezi!" uzviknuo je Luka. Max je sretno poskočio i krenuli su prema dvorcu.

Kada su stigli, Luka je naišao na kraljevskog stražara. "Zašto si ovdje, mladenače?" upita stražar, gledajući ga sumnjičavo. "Želim razgovarati s princezom! Imam nešto važno za nju!" odgovori Luka hrabro. Stražar ga pogleda, a zatim pomisli da možda vrijedi pustiti ga unutra.

U velikoj dvorani, princeza Ana sjedila je sama, s tugom u očima. Kada je Luka ušao, osjetila je da nešto čarobno dolazi. "Tko si ti?" upita ona, podižući pogled. "Ja sam Luka, mladi pisac! Došao sam ti donijeti priču koja će ti donijeti osmijeh!" reče Luka.

"Priču?" upita princeza, znatiželjno. "Da! Priču o ljubavi i čarobnom biseru koji donosi sreću!" odgovori Luka, uzbuđeno se smiješeći. "Hoćeš li je pročitati?" Ana klimne glavom. Luka joj pruži papir, a ona počne čitati.

Kako je čitala, njezino se lice počelo osvjetljavati. "Ova priča je tako lijepa!" uzvikne ona, a srce joj se ispunilo radošću. "Nikada nisam čula tako nešto. Kako si je smislio?"

"Vidim ljepotu u svemu, čak i kada je teško," odgovori Luka. "Želim da svi u kraljevstvu budu sretni."

Kada je završila s čitanjem, princeza se nasmiješila. "Zapravo, osjećam se bolje! Hvala ti, Luka!" reče ona. "Želim te upoznati bolje. Možda bismo zajedno mogli pisati priče!"

Od tog trenutka, Luka i princeza Ana postali su najbolji prijatelji. Svakog dana bi sjedili pod hrastom i zajedno pisali. "Možda bismo mogli napisati priču o putovanjima kroz svijet!" predlaže Ana. "To zvuči sjajno!" odgovara Luka, a Max veselo laje, kao da se i on uključuje.

Njihova ljubav prema pričama brzo se pretvorila u ljubav jedno prema drugome. "Ana, ti si mi poput čarobnog bisera u mom životu!" rekao je Luka jednog dana, dok su gledali zalazak sunca. "I ti si moj junak!" uzvrati Ana, a njihovi osmjesi postali su još širi.

Njihova priča postala je legenda u kraljevstvu. Priča o ljubavi koja se nalazi kroz riječi, o ljubavi koja donosi radost i nadu, i o ljubavi koja traje zauvijek. I tako su Luka i Ana, zajedno s Maxom, nastavili pisati svoje priče, donoseći sreću svima oko sebe. Kraljevstvo nikada nije bilo sretnije, a ljubav je uvijek bila u zraku.`
})

// 24. Priča o dobroj vilici (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: '9c3c8b9a-f746-4df4-bf0a-9ad170af3876',
  body: `U čarobnoj šumi, gdje su drveća bila visoka poput planina, a cvijeće je mirisalo poput najljepših slatkiša, živjela je dobra vilica po imenu Zora. Zora je bila najljepša vilica u cijeloj šumi, s krilima koja su blistala poput zvijezda na noćnom nebu i osmijehom koji je mogao osvijetliti cijeli svijet. Svi su znali da su njezina krila posebna, jer su bila prekrivena sitnim, sjajnim ljuskicama koje su se svjetlucale na suncu.

Svako jutro, Zora bi se budila ranije od svih. Ponašala se kao pravi čarobnjak, jer je svako jutro stvarala šarene duge koje su se protezale kroz nebo. "Pogledajte, prijatelji! Nova duga!" vikala bi veselo dok su se životinje okupljale oko nje. Svi su je voljeli zbog njene dobrote.

Jednog sunčanog dana, Zora je letjela kroz šumu, tražeći one kojima može pomoći. "Trebate li nešto, dragi prijatelji?" pitala je dok je prolazila pored mudre sove koja je sjedila na grani.

"Ah, Zoro," rekla je sova, "moji prijatelji ptice ne mogu pronaći put do svog gnijezda. Mogu li joj pomoći?"

Zora je odmah odgovorila: "Naravno! Pokažimo im pravi put!" Zora je zajedno s mudrom sovom pretražila šumu i naposljetku su pronašli ptice koje su bile izgubljene.

"Tu ste! Pomoći ćemo vam!" uzviknula je Zora, a ptice su veselo pjevajući slijedile Zoru natrag do njihovog gnijezda.

Nakon što je pomogla pticama, Zora je nastavila letjeti, pomažući cvijeću koje je izgledalo tužno. "Zašto ste tužni, dragi cvjetići?" pitala je Zora.

"Mi smo tužni jer je vjetar otpuhao naše latice," odgovorilo je jedno cvijeće.

Zora je osmislila plan: "Pomoći ću vam da ponovo procvjetate!" I tako je počela stvarati vjetar svojim krilima, nježno podižući latice i vraćajući ih na cvijeće. "Pogledajte, sada ste opet prelijepe!" rekla je s osmijehom.

U tom trenutku, Zora je primijetila malu djevojčicu po imenu Sara kako stoji na rubu šume. Izgledala je prestrašeno i izgubljeno. "Oh, tko je to?" pomislila je Zora. Odlučila je poletjeti prema njoj. "Hej, mala! Jesi li u redu?" pitala je Zora.

Sara se okrenula i rekla: "Ne, izgubila sam se! Ne znam kako da se vratim kući!"

"Nemoj brinuti! Ja ću ti pomoći!" rekla je Zora s ljubaznim osmijehom. "Prati me, ja znam sve staze u ovoj šumi!"

Sara je sretno klimnula glavom i krenula za Zorom. "Wow, ti si stvarno lijepa!" rekla je Sara, gledajući Zorina sjajna krila.

"Zahvaljujem ti! Ali ljepota dolazi iznutra," odgovorila je Zora dok su letjele kroz šumu. "Svi trebamo pomoći jedni drugima."

Dok su prolazile kroz šumu, Zora je pokazivala Saru razne životinje. "Pogledaj tu obitelj zečeva! Oni su tako sretni!" rekla je Zora. "I vidi one vjeverice kako se igraju! Ovdje je uvijek zabavno!"

Sara se smijala i uživala u pogledu. "Hvala ti, Zoro! Ova šuma je čarobna!"

"Zato što je ispunjena ljubavlju i prijateljstvom," rekla je Zora. "A sada, evo nas, došli smo do tvog doma!"

Sara je bila oduševljena. "Hvala ti, Zoro! Nikada neću zaboraviti ovu avanturu!"

Od tog dana, Sara i Zora su postale najbolje prijateljice. Sara je često dolazila u šumu, a Zora joj je pričala priče o životinjama i cvijeću. Uvijek su se zajedno smijale i pomagale drugima.

"Zoro, što ćemo raditi sutra?" pitala je Sara jednog dana.

"Možda ćemo organizirati zabavu za sve životinje!" predložila je Zora.

"To bi bilo sjajno!" uzviknula je Sara.

I tako su zajedno sanjale o novim avanturama, a njihova ljubav je postajala sve jača. Naučile su da dobrota i ljubav mogu prevladati bilo kakvu prepreku, i da zajedno možemo stvoriti najljepše trenutke. U čarobnoj šumi, Zora i Sara su ostale prijateljice zauvijek, a njihova priča o ljubavi i prijateljstvu postala je legenda.`
})

// 25. Putovanje u Mjesečevu špilju (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: 'f85179d8-a589-4c87-ac36-f87f0cf8fcf5',
  body: `U dalekom kraljevstvu, među visokim planinama i prostranim livadama, postojala je legenda o Mjesečevoj špilji. To je bilo čarobno mjesto gdje su se, prema pričama starijih, mogli pronaći svi izgubljeni snovi i sve izgubljene ljubavi. Ljudi su dolazili s raznih strana, ali nitko nije uspio pronaći špilju. Legenda je govorila da samo onaj s čistim srcem može pronaći put do nje.

U ovom kraljevstvu živio je mladić po imenu Luka. Luka je bio poznat po svojoj dobroti. Svakog jutra pomagao je starijim susjedima, a kad bi naišao na izgubljenu životinju, uvijek bi je vratio domu. Njegovo srce bilo je ispunjeno ljubavlju i nadom. Čuo je za legendu o Mjesečevoj špilji i odlučio je da će je pronaći.

"Moram ići, tata!" rekao je Luka jednog sunčanog jutra. "Želim pronaći Mjesečevu špilju i donijeti snove svima u našem selu!"

Lukov tata ga je pogledao s osmijehom, ali i s malo brige. "Luka, putovanje može biti opasno. Moraš biti hrabar i pametan. I zapamti, uvijek slušaj svoje srce."

"Znam, tata!" odgovorio je Luka uzbuđeno. "Ja ću se vratiti s pričama o snovima!"

Luka je krenuo na put. Prolazio je kroz guste šume, gdje su se ptice veselile i pjevale. Čuo je kako se vjetar igra s granama drveća. Dok je hodao, razmišljao je o tome što će pronaći.

Nakon nekoliko dana putovanja, Luka je stigao do velike rijeke. Voda je bila brza i hladna. "Kako ću preći?" pomislio je. Tada je ugledao starog ribara koji je pecao na obali.

"Zdravo, mladiću!" rekao je ribar. "Izgledaš kao da imaš problem."

"Zdravo! Da, pokušavam preći rijeku kako bih pronašao Mjesečevu špilju," odgovorio je Luka.

Ribar se nasmijao. "Ah, Mjesečeva špilja! To je daleko. Trebat će ti čamac. Ali prvo, moraš mi pomoći."

"Kako mogu pomoći?" upitao je Luka znatiželjno.

"Imam staru mrežu koja je zapela u drveću. Ako mi pomogneš da je oslobodim, prevest ću te čamcem preko rijeke!" rekao je ribar.

Luka je odmah pristao. Zajedno su otišli do drveća i Luka je pažljivo pomogao ribaru da oslobodi mrežu. "Hvala ti, mladiću! Sada možemo ići!" rekao je ribar s osmijehom.

Prešli su rijeku, a Luka je nastavio putovanje. Nakon nekoliko dana, napokon je stigao do Mjesečeve špilje. Špilja je bila ogromna, a ulaz je bio prekriven zlatnim cvjetovima. Luka je duboko udahnuo i ušao unutra.

U špilji je vidio najljepši prizor koji je ikada vidio - tisuće snova koja su blistala poput zvijezda, i sve izgubljene ljubavi koje su čekale da budu pronađene. Svi su snovi plesali po zidovima špilje i isijavali svjetlost.

"Wow!" rekao je Luka. "Ovo je predivno!"

Tada je čuo nježan glas. "Dobrodošao, Luka. Ti si došao s čistim srcem."

"Ko si ti?" upitao je Luka, iznenađen.

"Ja sam čuvar Mjesečeve špilje. Ovdje su snovi, ali da bi ih pronašao, moraš naučiti nešto važno," rekla je tajanstvena figura.

Luka je slušao pažljivo. "Što trebam naučiti?"

"Snovi nisu nešto što se pronalaze, već nešto što se stvara. Oni se stvaraju kroz ljubav, hrabrost i upornost. Kada vjeruješ u sebe i slijediš svoje srce, tvoji snovi postaju stvarnost," objasnila je figura.

Luka je shvatio. "Znači, moram vjerovati u sebe i nastaviti se boriti za svoje snove!"

"Točno!" rekla je figura s osmijehom. "Sada se vrati kući i prenesi svoje znanje drugima."

Luka je zahvalio čuvaru i krenuo nazad. Njegovo srce bilo je ispunjeno radošću i mudrošću. Kada se vratio u selo, svi su ga dočekali s oduševljenjem.

"Kakvo je bilo putovanje, Luka?" pitali su ga.

"Bio je to najbolji put u mom životu!" odgovorio je Luka. "Naučio sam da snovi nisu samo nešto što tražimo, već nešto što stvaramo vlastitim srcem!"

Tako je Luka postao junak u svom selu, a njegova priča o Mjesečevoj špilji postala je legenda. Ljudi su dolazili da ga slušaju i učili su kako vjerovati u svoje snove. A Luka? On je nastavio pomagati svima oko sebe, znajući da uz ljubav i hrabrost, snovi zaista postaju stvarnost.`
})

// 26. Vesela lutka i tiha šuma (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: '6abebc36-3726-4982-a521-e7169d19a99a',
  body: `U malom, šarenom selu, na rubu zelene šume, živjela je djevojčica po imenu Ana. Ana je bila vesela i znatiželjna, uvijek je nosila širok osmijeh na licu. Imala je najljepšu lutku na svijetu, koja se zvala Vesela. Vesela je bila posebna lutka, s dugim, plavim uvojcima, crvenom haljinom i osmijehom koji bi mogao razvedriti i najtužniju osobu. Svi u selu znali su za njihovu nevjerojatnu prijateljsku vezu.

Jednog sunčanog jutra, Ana je odlučila da bi bilo sjajno provesti dan u šumi. "Vesela, idemo u šumu skupiti najljepše cvijeće!" rekla je Ana s oduševljenjem. "Da, Ana! Jedva čekam vidjeti sve te boje!" odgovorila je Vesela, sretno se smijući.

Kada su ušle u šumu, ptice su pjevale, a sunce je prolazilo kroz lišće stvarajući čarobne sjene. "Pogledaj, Vesela! Ovdje su crvene ruže!" viknula je Ana. "A tamo, plavi zumbuli!" dodala je veselo. Dok su skupljale cvijeće, plesale su i pjevale, uživajući u svakom trenutku.

Nakon nekog vremena, Ana se osvrnula i shvatila da ne prepoznaje put kojim su došle. "Vesela, gdje smo? Izgubile smo se!" rekla je Ana, a glas joj je bio ispunjen strahom. Vesela je, iako je bila lutka, imala hrabro srce. "Ne brini, Ana," rekla je smireno. "Zajedno ćemo pronaći put kući. Samo se sjeti, uvijek trebamo vjerovati jedna drugoj!"

Ana je duboko udahnula i rekla: "U redu, Vesela. Idemo! Možda možemo pronaći neki znak ili stazu." Krenule su dublje u šumu, pokušavajući se sjetiti puta natrag. Našle su staro drvo s velikom rupom. "Pogledaj, Vesela! Možda ćemo pronaći nešto korisno unutra!" rekla je Ana uzbuđeno.

Kada su provirile u rupu, unutra su našle staru mapu. "Ovo izgleda kao mapa našeg sela!" rekla je Ana s nadom u glasu. "Da! Pomoći će nam da se vratimo!" Vesela je bila uzbuđena. "Sada moramo slijediti ovu stazu!" rekla je Ana.

Šuma je bila puna iznenađenja. Dok su se kretale, naišle su na predivnu livadu punu cvijeća. "Pogledaj! Ovdje su suncokreti!" viknula je Ana. "Mogu ih ubrati za mamu!" Vesela je klimnula glavom. "Da, to će joj sigurno biti drago!"

Ana je ubrala nekoliko cvjetova, a zatim su nastavile dalje. Međutim, uskoro su se suočile s velikim kamenjem. "Kako ćemo proći?" upitala je Ana. "Sviđa mi se tvoj duh, Ana," rekla je Vesela. "Sjetimo se, ako se držimo zajedno, možemo sve!" Ana je gurnula prvi kamen, a Vesela ju je bodrila. "Snažno, Ana! Samo još malo!"

Nakon nekoliko pokušaja, uspjele su preći preko kamenja i nastaviti dalje. "Gledaj, Vesela! Tamo je potok!" Ana je pokazala prema svijetloj vodi koja je protjecala. "Možda možemo slijediti potok. On nas može odvesti prema selu!" Vesela je bila oduševljena. "Sjajna ideja, Ana! Idemo!"

Dok su slijedile potok, čule su smijeh i cvrčanje djece iz daljine. "Tko to igra?" upitala je Ana znatiželjno. "Možda su to djeca iz našeg sela!" rekla je Vesela. "Pojurimo!" Ana je potrčala prema zvuku, a Vesela ju je slijedila.

Nakon nekoliko minuta, pronašle su grupu djece kako se igraju na livadi. "Ana! Vesela!" povikao je Marko, njezin najbolji prijatelj. "Gdje ste bile? Mi smo vas tražili!" Ana se nasmiješila i rekla: "Izgubile smo se, ali zajedno smo pronašle put natrag!"

Sva djeca su se okupila oko njih, a Ana je pokazala svoje cvijeće. "Pogledajte što sam skupila!" rekla je ponosno. Svi su se divili cvijeću, a Vesela je ponosno sjedila u Aninom naručju.

Od tog dana, Ana i Vesela su postale još bolje prijateljice, a njihova ljubav je postala jača nego ikad. Ana je naučila da prijateljstvo i hrabrost mogu prevladati bilo kakvu prepreku. Zajedno su stvorile najljepše uspomene, koje će trajati zauvijek.

"Znaš, Vesela," rekla je Ana dok su se vraćale kući, "nikada se više neću bojati, jer imam tebe." Vesela je odgovorila: "I ja tebe, Ana! Zajedno možemo sve!" I tako su se vraćale kući, ispunjene srećom, prijateljstvom i ljubavlju.`
})

// 27. Bratac Jaglenac i sestrica Rutvica (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: '3ae03d13-c0d9-44de-a947-5bdd4ed1ae02',
  body: `U malom, šarenom selu, na rubu guste šume, stajala je mala kućica s crvenim krovom. U toj kućici živjeli su bratac Jaglenac i sestrica Rutvica. Njih dvoje bili su siročad, ali su imali jedno drugo, a to im je bilo dovoljno. Njihova ljubav i zajedništvo činili su ih najsretnijim djecom u cijelom selu.

Jaglenac je bio hrabar i snažan, uvijek spreman zaštititi svoju sestru. Imao je crnu kosu koja je lepršala na vjetru i oči koje su blistale poput zvijezda. "Ne brini, Rutvica, ja ću te zaštititi!" često je govorio, dok je hrabro gledao prema horizontu. Rutvica je bila pametna i brižna, a njezina plava kosa se sjajila na suncu poput cvijeta. Njezin osmijeh mogao je osvijetliti i najtamniju sobu, a uvijek je imala spremnu neku lijepu priču ili pjesmu. "Jaglenac, znaš da si moj heroj!" voljela je reći, dok su zajedno radili i igrali se.

Svaki dan bi zajedno odlazili u šumu da skupljaju drva, bobičasto voće i lijepe cvjetove. Jaglenac je nosio teški koš, dok je Rutvica pjevala veselu pjesmu. "Pogledaj, Jaglenac, ove jagode su savršene!" rekla bi, dok bi se sagnula i ubrala sočne plodove. "Zajedno smo najbolji tim!" odgovarao bi on sa smijehom.

Jednog dana, dok su se igrali u blizini rijeke, u selo je došla zla vještica. Bila je to strašna vještica s dugim nosom, crnim očima koje su sijale mržnjom i glasom koji je zvučao poput vjetra u oluji. "Djeco, dođite k meni!" vikala je vještica, a djeca su se počela bojati. Roditelji su se sakrivali, a vještica je uzimala jedno dijete za drugim, ostavljajući selo u strahu.

Kada je došla po Jaglenca i Rutvicu, dvoje braće i sestara brzo su se sakrili u šumu. "Jaglenac, što ćemo sada?" pitala je Rutvica, drhteći od straha. "Ne brini, Rutvica," rekao je Jaglenac, čvrsto je držeći za ruku. "Zaštitit ću te. Zajedno smo jači od bilo koje vještice."

"Ali ona je strašna! Što ako nas uhvati?" zabrinuto je pitala Rutvica. "U redu je, samo se sjeti naše ljubavi," rekao je Jaglenac, pokušavajući je umiriti. "Naći ćemo način. Zajedno možemo sve."

Dok su se skrivali, sreli su mudrog starog medvjeda koji je živio u špilji punoj meda i ljubavi. Medvjed je bio velik i snažan, ali imao je najmeđe oči koje su blistale od mudrosti. "Djeco, čuo sam vašu zabrinutost," rekao je medvjed dubokim glasom, poput grmljavine. "Samo ljubav između braće i sestara može pobijediti zlo."

"Ali, kako da pobijedimo vješticu?" upitao je Jaglenac, gledajući medvjeda s nadom. Medvjed se nasmijejao i rekao: "Vaša ljubav je vaša najveća snaga. Ujedinite se, vjerujte jedno drugome i zlo će pobjeći."

Jaglenac i Rutvica su shvatili da njihova ljubav i zajedništvo čine jakim. "Zajedno ćemo se suočiti s njom!" odlučio je Jaglenac. "Da, zajedno smo najjači!" rekla je Rutvica, osjećajući novu snagu u svom srcu.

Zajedno su se vratili u selo, držeći se za ruke. Kada su ugledali vješticu, stali su hrabro pred nju. "Odlazi, zla vještice! Ne možeš nas rastaviti!" povikala je Rutvica, dok je Jaglenac stajao uz nju, odlučan i jak. Vještica se nasmijala, ali u tom trenutku, ispred njih je zasjalo svjetlo.

Kada je vještica vidjela koliko su jaki kad su zajedno, koliko se vole i koliko su hrabri, osjetila je strah. "Ne, ne može biti!" viknula je, pokušavajući pobjeći. "Vaša ljubav je jača od mene!" i nestala je u oblaku dima.

Od tog dana, Jaglenac i Rutvica su živjeli sretno, znajući da je njihova ljubav najjača snaga na svijetu. Svaki put kad bi se suočili s nečim teškim, sjetili bi se medvjeda i njegove mudrosti. "Zajedno možemo sve!" često su ponavljali, a njihova priča postala je legenda u selu.

Djeca u selu su pričala o Jaglencu i Rutvici, o njihovoj hrabrosti i ljubavi koja je pobijedila zlo. I tako su, zajedno, sretno živjeli, čuvajući jedno drugo i svoju ljubav, znajući da su uvijek jači zajedno.`
})

// 28. Kako je Potjeh tražio istinu (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: '983137dc-1820-4e52-91cf-c63b3375fd55',
  body: `Bio jednom jedan mladić po imenu Potjeh. Potjeh je bio visoki, plavokosi mladić s velikim, znatiželjnim očima. Imao je samo jedno pitanje u glavi: "Što je istina?" Ovo pitanje ga je mučilo svaki dan, svaku noć, i nije mogao pronaći mir dok ne bi saznao odgovor. Njegovi prijatelji često su ga zadirkivali zbog toga.

"Potjeh, opet razmišljaš?" smijala se njegova najbolja prijateljica Maja. "Zar ti ne možeš jednostavno uživati u životu?"

"Ne mogu, Majo! Moram saznati!" odgovorio je Potjeh s odlučnošću.

Potjeh je putovao daleko i široko. Prešao je visoke planine, duboke doline, preplivao rijeke i more. Na svakom koraku, pitao je mudrace, čitao stare knjige, i tražio odgovor na svoje pitanje. "Što je istina?" ponavljao je neprestano.

U jednom malom selu, susreo je starog mudraca po imenu Ilija. Ilija je imao dugu, bijelu bradu i nosio je široki šešir. "Istina je u znanju," rekao je mudrac s osmijehom. "Što više znaš, to si bliže istini."

Potjeh je bio uzbuđen. "Mogu li ja postati mudar kao ti?" upitao je.

"Naravno," odgovorio je Ilija. "Ali to će ti oduzeti mnogo godina."

Potjeh je proveo godine učenja. Čitao je svaku knjigu koju je mogao pronaći. Učio je o zvijezdama, o pticama, o svemu što ga je zanimalo. No, i dalje nije osjećao da je našao istinu.

Jednog dana, dok je čitao knjigu o ljubavi, sjetio se mudraca kojeg je susreo u drugom selu. On mu je rekao: "Istina je u ljubavi. Ljubav je najveća istina koja postoji." Potjeh je pomislio: "Mogu li pronaći ljubav?"

Putovao je dalje, tražeći ljubav svuda. U prijateljstvima, u obitelji, u prirodi. Jednog dana, u šumi, susreo je malu vjevericu. "Hej, vjeverice! Znaš li gdje mogu pronaći ljubav?" upitao je.

Vjeverica se nasmijala i rekla: "Ljubav je svuda oko nas! Pogledaj kako se sunce smiješi, kako cvijeće cvjeta!"

Potjeh je bio sretan, ali i dalje je osjećao da nešto nedostaje. Nastavio je putovati, sve dok nije susreo trećeg mudraca, staricu po imenu Marija. Ona mu je rekla: "Istina je u prirodi. Priroda je najveći učitelj."

Potjeh je proveo mjesece u šumi, slušajući zvukove prirode. Čuo je pjev ptica, šušanje lišća i žubor rijeke. Ali i dalje nije našao odgovor koji ga je zadovoljavao.

Jednog dana, Potjeh je sjeo pod staro hrastovo stablo, umoran i zbunjen. "Kako može biti toliko različitih istina?" pomislio je. "Kako može svatko imati drugačiji odgovor na isto pitanje?"

Tada je primijetio mrava koji je nosio hranu svojoj obitelji. "Gledaj ga," rekao je sam sebi. "Mali, ali uporan, znajući točno gdje ide." Zatim je pogledao listove drveća koji su se njišali na vjetru. "Svaki list se kreće na svoj način, ali svi zajedno stvaraju prekrasnu harmoniju."

Dok je razmišljao, čuo je pjesmu ptice koja je gradila gnijezdo. "Pjesma je puna ljubavi i nade," rekao je Potjeh. U tom trenutku, shvatio je nešto posebno.

"Možda istina nije jedna stvar koju možemo naći," pomislio je. "Možda je istina u svemu što nas okružuje!"

I tako, Potjeh je shvatio: istina je u ljubavi, u prirodi, u znanju, u svakom trenutku života. "Istina nije odgovor koji možemo pronaći u knjigama ili čuti od mudraca," rekao je naglas. "Istina je putovanje, iskustvo, osjećaj da živimo svaki trenutak potpuno i iskreno."

Od tog dana, Potjeh je prestao tražiti istinu i počeo je živjeti je, svakim danom, svakim trenutkom. Uvijek je nosio sa sobom sjećanje na mrava, pticu i vjetar.

"Svaka suza, svaki osmijeh, svaki trenutak ljubavi i prijateljstva nosi istinu," govorio je.

"Život je prepun istina," rekao je Maji kad se vratio kući. "Sada znam da je istina u životu samom."

I Maja ga je pogledala s osmijehom. "Hvala ti, Potjeh. Zauvijek ću pamtiti tvoju potragu za istinom."

I tako su Potjeh i Maja nastavili svoj život, svaki dan otkrivajući nove istine u svijetu oko sebe, radosni i zahvalni na svemu što su naučili.`
})

// 29. Lažeš, Melita (4 min -> extend to 6-7 min)
storyUpdates.push({
  id: '16cd9e50-d524-4a51-9c33-adeb14597428',
  body: `U malom, slikovitom selu zvanom Cvjetni Brijeg, živjela je djevojčica po imenu Melita. Melita je bila vesela djevojčica s dugom, kovrčavom kosom i sjajnim, plavim očima koje su uvijek blistale od radosti. Najviše na svijetu voljela je pričati priče. Svake večeri, kada sunce zađe, okupljali bi se njezini prijatelji ispod velikog hrasta, a Melita bi im pričala svoje nevjerojatne priče.

"Znaš što se dogodilo danas?" upitala je Melita jednog dana, uzbuđeno mašući rukama. "U šumi sam srela govorećeg zeca koji je nosio šešir! Rekao mi je da danas ne smijem zaboraviti donijeti mrkve za njegov rođendan!"

"Nema šanse da si to vidjela!" nasmijao se Marko, njen najbolji prijatelj. "Zec ne može govoriti, Melita. Ti uvijek preuveličavaš!"

"Da, Melita, prestani lagati!" pridružila se Ana, koja je sjedila pored Marka.

Melita je bila tužna. "Ali ja samo želim da vjerujete u mene. Moje priče su posebne!" rekla je s tugom u glasu.

Nakon nekoliko dana, Melita je odlučila da će učiniti nešto nevjerojatno kako bi dokazala svima da njezine priče nisu laži. Jedne večeri, dok su svi slušali, ispričala je priču o čarobnom vrtu. "U tom vrtu raste cvijeće koje može izliječiti bilo koju bolest! Samo ga treba ubrati i donijeti natrag," rekla je, gledajući u lica svojih prijatelja koja su bila puna sumnje.

"Nema šanse da to postoji!" opet se nasmijala Ana. "To je samo još jedna tvoja izmišljotina."

"Ali ja ću ga pronaći!" odlučila je Melita. "I kada ga donesem, svi ćete vidjeti da sam u pravu!"

S sljedećim zrakama sunca, Melita je krenula na putovanje. Prolazila je kroz šume i livade, a svaki put kad bi srela nekog životinju, pitala bi ih: "Znate li gdje je čarobni vrt?"

Jednog dana, dok je hodala, srela je mudrog starog sova. "Dobar dan, sovo!" pozdravila je Melita. "Možeš li mi pomoći? Tražim čarobni vrt."

Sova je nježno klimnula glavom. "Da, draga djevojčice. Ali put do vrta nije lako pronaći. Moraš proći kroz tamnu šumu i preći rijeku punu čarobnih riba."

"Ne bojim se," rekla je Melita hrabro. "Ja ću to učiniti!"

Nakon dugog putovanja, Melita je napokon stigla do tamne šume. Drveće je bilo visoko i gusto, a u zraku se osjećala magija. "Samo naprijed, samo naprijed," mumljala je Melita dok je hrabro koračala.

U šumi je srela mnoge čarobne životinje. "Hej, tko si ti?" upitao je mali vjeverica dok se penjao po drvetu.

"Ja sam Melita!" odgovorila je, "Tražim čarobni vrt."

"Možda ti mogu pomoći," rekla je vjeverica. "Prati me!"

Nakon što je vjeverica vodila Melitu kroz šumu, napokon su stigli do rijeke punih šarenih riba. "Kako da pređem?" upitala je Melita.

"Zar ne znaš? Trebaš zapjevati pjesmu koju ti ribe vole!" vjeverica se nasmijala.

Melita je duboko udahnula i počela pjevati svoju omiljenu pjesmu o prijateljstvu i hrabrosti. Ribe su se okupile i plesale oko nje, a rijeka se otvorila, dopuštajući joj da pređe.

Konačno, nakon cijelog dana putovanja, Melita je stigla do čarobnog vrta. Vrt je bio nevjerojatno lijep. Cvijeće je cvjetalo u svim bojama duge, a mirisalo je poput slatkih kolača. Melita je s oduševljenjem trčala oko cvijeća, znajući da je pronašla ono što je tražila.

"Bingo!" viknula je Melita, ubirući nekoliko cvjetova. "Sada mogu pomoći svom selu!"

Kada se Melita vratila u selo, svi su je čekali. "Gdje si bila, Melita?" upitala je Ana, sumnjičavo gledajući cvijeće u njezinim rukama.

"Pronašla sam čarobni vrt!" odgovorila je Melita s osmijehom. "Ovo cvijeće može izliječiti bilo koju bolest!"

"Nikad nećemo vjerovati da to postoji!" rekao je Marko, i dalje skeptičan.

Melita je uzela cvijet i otišla do bolesnog dječaka koji je ležao u krevetu. "Pogledajte, donijela sam lijek!" rekla je, stavljajući cvijet uz dječakovu ruku.

Dječak je odmah osjetio promjenu. Cvijet je zasjao, a on se počeo smijati i skakati iz kreveta. "Ja sam zdrav! Kako je to moguće?" čudio se.

Svi su u selu bili šokirani. "Možda Melita nije lagala," šapnula je Ana.

Od tog dana, ljudi su počeli vjerovati Melitinim pričama. Naučili su da ponekad najnevjerojatnije priče mogu biti i najistinitije, i da hrabrost i upornost mogu prevladati svaku sumnju. Melita je postala junakinja sela, a njezine priče više nikad nisu bile podcijenjene. Svi su je s oduševljenjem slušali, jer su znali da svaka njezina priča donosi malo čarolije u njihov svijet.

I tako je Melita nastavila pričati svoje priče, a svaka nova bila je još ljepša i uzbudljivija od prethodne. Svi su znali da, kada Melita govori, ništa nije nemoguće.`
})

// 30. Pirgo (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: '2f239193-00a1-4a68-9314-64f03eb6f34d',
  body: `U malom, slikovitom selu na obroncima planine, živio je dječak po imenu Pirgo. Pirgo nije bio običan dječak; imao je posebnu sposobnost. Mogao je razgovarati sa životinjama i razumjeti jezik prirode. Njegove velike, sjajne oči uvijek su bile radosne, a osmijeh mu je bio širok kao rijeka. Bio je prijatelj svih stvorenja u šumi, a svaka životinja ga je voljela.

Svako jutro, kada bi sunce počelo izlaziti, Pirgo bi se odjenuo u svoju omiljenu zelenkastu košulju i kratke hlače. "Danas ću posjetiti mog prijatelja Medu!" govorio bi sam sebi dok je trčao prema šumi. Medo je bio veliki smešak s crnim krznom i uvijek je volio pričati o svojim avanturama. "Hej, Medo!" povikao je Pirgo dok je ulazio u šumu. "Spreman za igru?"

"Naravno, Pirgo!" odgovorio je Medo, držeći u šapama veliki plod meda. "Ali prvo, moramo otići do rijeke. Čuo sam da su se jato ptica vratile s juga. Želim im pokazati našu šumu!" Pirgo je s veseljem pristao. Zajedno su krenuli prema rijeci, smijale su se i razgovarale o svemu što su vidjeli.

Kada su stigli do rijeke, ptice su već pjevale svoje lijepe melodije. "Pogledaj, Pirgo!" uzviknuo je Medo. "Tamo su! Čini se da su sretniji nego ikad!" Pirgo se nasmijao i pozdravio ptice. "Dobrodošle natrag, prijateljice! Kako ste putovale?" upitao je.

"Putovali smo daleko, ali sada smo sretne što smo opet ovdje!" odgovorila je jedna ptica, a druge su se pridružile. Pirgo i Medo slušali su njihove priče o sunčanim plažama i visokom nebu. "Svaka životinja ima svoju priču," rekao je Pirgo, a Medo se složio.

No, jednog dana, dok su se igrali, iznenada su čuli uznemirujuće zvukove iz sela. "Što se događa?" upitala je jedna od ptica, treseći krilima od straha. "Moramo provjeriti!" odlučio je Pirgo i povukao Medu za šapu. "Idemo!"

Kada su stigli do sela, vidjeli su da su ljudi u panici. Veliki plamenovi su se približavali, a dim je prekrivao nebo. "Oh ne! Požar se približava!" uzviknula je jedna žena. "Što ćemo sada učiniti?"

Pirgo je brzo razmišljao. "Moramo se okupiti! Svi moji prijatelji iz šume mogu pomoći!" povikao je. "Medo, pozovi vukove i ostale životinje!" Medo je odmah otišao, a Pirgo je počeo okupljati ljude. "Svi, slušajte! Moramo se udružiti! Životinje mogu pomoći!"

Ubrzo su se okupili svi stanovnici sela i životinje iz šume. "Što možemo učiniti?" upitala je jedna starija žena. "Pirgo, ti si naš junak! Kako možemo pomoći?" Pirgo se nasmiješio i rekao: "Zajedno možemo stvoriti veliki zid vode! Medo, dovedi vukove! Oni mogu nositi vodu!"

Vukovi su brzo došli, a Pirgo je vodio sve životinje prema rijeci. "Prvo, svi uzmite vodu! Ispunite svoje šape i kljunove!" vikao je. Medo, vukovi, ptice i svi ostali počeli su raditi zajedno, donoseći vodu i stvarajući veliki zid oko sela.

"Idemo, još malo!" hrabrio je Pirgo. "Svi zajedno!" Ljudi su pomagali koliko su mogli, a vjetar je nosio dim daleko. Kada su konačno završili, požar je bio zaustavljen. "Uspjeli smo!" povikao je Pirgo s oduševljenjem.

Selo je bilo spašeno, a svi su slavili. "Hvala ti, Pirgo! Ti si naš heroj!" govorili su mu ljudi dok su ga grlili. Ali Pirgo je skromno uzvratio: "Nismo to učinili sami. Zajedno s ljubavlju i prijateljstvom možemo prevladati svaku opasnost."

I tako je Pirgo naučio da prijateljstvo i ljubav mogu stvoriti čuda, a svi u selu i šumi su ga voljeli još više. Svi su se veselili novim avanturama koje su ih čekale, jer su znali da zajedno mogu postići sve. I svaki put kada bi sunce zalazilo, Pirgo bi se s osmijehom sjećao dana kada su zajedno spasili selo, znajući da će uvijek imati svoje prijatelje uz sebe.`
})

// 31. Ptičji festival (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: 'c1618100-f1ef-408c-bb2b-ff849931b6f5',
  body: `Svake godine, u čarobnoj šumi, održavao se veliki ptičji festival. Bile su to najljepše proslave u cijelom svijetu! Ptice iz svih krajeva dolazile su da pjevaju, plešu i dijele radost. Festival je bio pun ljubavi, prijateljstva i najljepših pjesama koje su se mogle čuti. Svi su jedva čekali da dođe taj poseban dan.

Jednog sunčanog jutra, mala djevojčica po imenu Sara sjedila je na svom dvorištu. Dok je gledala u nebo, primijetila je kako se ptice okupljaju i lete u čudesnim oblicima. "Gdje li one idu?" upitala je sama sebe. U tom trenutku, doletjela je mala plava ptica i sletjela joj na rame.

"Zdravo, mala djevojčice!" rekla je ptica veselim glasom. "Ja sam Pika! Idem na festival ptica u čarobnoj šumi. Hoćeš li i ti doći?"

Sara je zabljesnula od radosti. "Da, želim! Ali ne znam kako doći do te šume. Ona je daleko i svi govore da je opasna."

Pika se smiješila. "Nemaš razloga za brigu! Ako želiš, mogu ti pomoći. Samo trebaš biti hrabra i vjerovati u sebe!"

Sara je duboko udahnula. "U redu! Idemo! Kako ćemo do šume?"

Pika je raširila svoja mala krila i pokazala smjer. "Slijedi me! Prva stvar koju moraš učiniti je preći rijeku. Ne brini, ja ću te voditi!"

Sara je odjurila za Pikom, a srce joj je brže kucalo od uzbuđenja. Kada su stigle do rijeke, Sara je vidjela kako turbulentne vode teku. "Kako ću preći?" pitala je nervozno.

"Pogledaj!" rekla je Pika. "Tamo su veliki kamenčići. Možeš preskočiti s jednog na drugi!"

Sara je pogledala kamenčiće i skupila hrabrost. "Idem! Računam do tri!" rekla je i počela skakati. "Jedan, dva, tri!" Na kraju je uspješno prešla preko rijeke, a Pika je veselo cvrčala od oduševljenja. "Bravo, Sara! Već si hrabra!"

Nakon što su prešle rijeku, Sara i Pika nastavile su dalje kroz gustu šumu. Svuda oko njih, drveće je bilo visoko i zeleno, a ptice su pjevale svoje divne melodije. "Gledaj, Sara! Ovo je moj prijatelj Tiki," rekla je Pika, pokazujući na crvenog papigu koji je sjedio na grani.

"Zdravo, Tiki!" pozdravila je Sara veselo. "Jesi li ti također na festivalu?"

"Naravno!" odgovorio je Tiki s osmijehom. "Svi mi ptice dolazimo na festival kako bismo proslavili prijateljstvo! Želiš li zajedno s nama?"

Sara je bila oduševljena. "Da, želim! Kako izgleda festival?"

Pika je počela opisivati. "Na festivalu ćemo plesati, pjevati i jesti ukusnu hranu. Postoji i natjecanje u letenju! Bit će jako zabavno!"

Nakon dugog putovanja, konačno su stigli do ulaza u čarobnu šumu. Kada je Sara ušla, vidjela je najljepši prizor koji je ikada vidjela - tisuće ptica pjevaju, plešu i dijele radost. Šarena pera blistala su na suncu, a svuda je bilo zvukova smijeha i pjesama.

"Wow! Ovo je prekrasno!" uzviknula je Sara. "Tako sam sretna što sam ovdje!"

"Pjevaj s nama, Sara!" pozvala ju je Pika, a Tiki je zapevao prvu pjesmu. Sara se pridružila i svi su zajedno zaplesali. Osjećala je da je postala dio nečega posebnog.

Tijekom festivala, Sara je upoznala mnoge ptice. Bile su tu šarene trolove, veseli vrapci i čak i elegantne rode. "Kako ste svi prijateljski raspoloženi!" rekla je. "Ima li još nešto što mogu učiniti?"

Tiki se nasmijejao. "Možeš nam pomoći organizirati natjecanje u letenju! Što misliš?"

Sara je bila oduševljena. "Da, mogu pomoći! Kako ćemo to učiniti?"

Svi su ptice zajedno planirali događaj. Sara je bila zadužena za oznake, a Pika je pomagala s glazbom. Kada je natjecanje počelo, ptice su letjele visoko, a Sara je navijala s oduševljenjem.

Nakon natjecanja, svi su se okupili oko velikog drveta kako bi proslavili. "Hvala ti, Sara!" rekli su ptice. "Ovaj festival nikada ne bi bio isti bez tebe!"

Sara je bila presretna. "Hvala vam, prijatelji! Naučila sam da hrabrost i upornost mogu dovesti do najljepših trenutaka. Prijateljstvo može nastati između bilo koga - čak i između djevojčice i ptica."

I tako, od tog dana, Sara je postala najbolja prijateljica svih ptica. Svake godine dolazila je na festival, a svaka nova proslava bila je još ljepša od prethodne. I svi su znali da će njihovo prijateljstvo trajati zauvijek.`
})

// 32. Regoč (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: 'd6e504c2-2542-48ec-a839-958db896bac7',
  body: `U davnim vremenima, postojalo je čarobno mjesto zvano Regoč. Bilo je to mjesto gdje su se sastajale sve priče svijeta, gdje su se snovi pretvarali u stvarnost, i gdje je svaka želja mogla biti ispunjena. Regoč je bio poznat po svojim raskošnim livadama prepunim cvijeća, mirisnim drvećem i rijekama koje su se sjajile poput srebra pod suncem.

Regoč je bio čuvan od strane tri mudra čuvara - Starac Vjetar, Stara Voda, i Stara Zemlja. Starac Vjetar bio je visoki čovjek s dugom bijelom bradom koja se poput oblaka širila po njegovom licu. Nosio je kapu od lišća i uvijek se smijao, a svi su ga zvali "Vjetrovi prijatelj". Stara Voda bila je blaga žena s plavim očima koje su sjajile kao biseri. Njena haljina bila je od tkanine koja je izgledala poput valova na moru. Stara Zemlja bila je snažna i mudra, s rukama prekrivenim zemljom i cvijećem. Imala je osmijeh koji je donosio mir i spokoj.

Jednog dana, mladić po imenu Marko, koji je živio u malom selu, čuo je priču o Regoču od svoje bake. "Regoč je mjesto gdje se ispunjavaju snovi, gdje sreća i ljubav rastu kao cvijeće", rekla mu je ona. Marko je bio fasciniran i odlučio je pronaći to čarobno mjesto. "Bako, moram ići! Želim pronaći sreću i ljubav!" uzviknuo je.

Putovao je kroz planine i doline, preko rijeka i kroz guste šume. Na svom putu sretao je mnoge ljude. Jedan starac s bradom, koji je prodavao jabuke, rekao mu je: "Mladiću, Regoč je daleko. Ali ako želiš, možeš ga pronaći. Samo moraš slušati svoje srce." Marko je klimnuo glavom, odlučan u svom naumu.

Nakon dugog putovanja, konačno je stigao do Regoča. Vidi tri čuvara kako stoje na ulazu, svaki od njih bio je poseban i drugačiji. "Zašto tražiš Regoč?" upitali su ga zajedno. "Što želiš postići?" pitala je Stara Voda, a njezin glas bio je poput nježnog šuma kiše.

Marko je duboko udahnuo i odgovorio: "Želim pronaći sreću i ljubav. Želim živjeti život pun radosti i smisla." Njegove oči sjajile su od uzbuđenja.

Čuvari su se pogledali i nasmijali. "Regoč nije mjesto gdje se pronalazi sreća," rekao je Starac Vjetar, pušući lagani povjetarac. "Regoč je mjesto gdje se uči kako biti sretan. Sreća nije nešto što se pronalazi - sreća je nešto što se stvara."

"Onda, kako mogu stvoriti sreću?" upitao je Marko, znatiželjan. Stara Zemlja mu se približila i rekla: "Sreća dolazi iz malih stvari. Pomozi drugima, voli prirodu, i budi zahvalan na svemu što imaš."

Marko je proveo dane u Regoču, učeći od čuvara o ljubavi, prijateljstvu, i životu. Učio je kako se brinuti za biljke i životinje, kako slušati druge, i kako dijeliti sreću. Svakodnevno je sjedio s čuvarima oko ognjišta, slušajući njihove mudre priče. "Jednom je postojala mala ptica koja je sanjala o letu", pričao je Starac Vjetar. "Nije se bojala pasti, nego je svaki put pokušavala iznova."

Naučio je da sreća leži u malim stvarima - u osmijehu prijatelja, u mirisu cvijeća, u toplini sunca. "Gledaj, Marko," rekla je Stara Voda, pokazujući mu rijeku. "Svaka kap vode ima svoju priču. Svi smo mi povezani, poput rijeke."

Kada je napustio Regoč, Marko se osjećao kao novi čovjek. Nije više tražio sreću - on ju je stvarao. Nije više tražio ljubav - on ju je dijelio. Sjetio se svega što je naučio i odlučio je podijeliti svoju sreću sa svima u svom selu.

Kad se vratio kući, pozvao je sve prijatelje i rekao im: "Želim da zajedno proslavimo! Donio sam sreću iz Regoča!" Svi su se okupili, a Marko je svima pričao o svojim avanturama i svemu što je naučio. Svi su se smijali, plesali i dijelili ljubav jedni s drugima.

I tako je Marko, sa srcem punim sreće, naučio da je prava sreća u davanju i dijeljenju s drugima. U tome je pronašao pravu sreću i pravu ljubav. I od tada, njegov život bio je ispunjen radošću, prijateljstvom i nepresušnom srećom.`
})

// 33. Slikar u šumi (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: '49212a75-328d-429d-a855-1ca489a3a23d',
  body: `U malom, mirnom selu, okruženom zelenim brdima i plavetnilom neba, živio je mladi slikar po imenu Petar. Petar je bio dječak s velikom maštom i ljubavlju prema prirodi. Njegova soba bila je puna slikarskih platna, boja i kistova. Svaki dan, čim bi sunce izašlo, Petar bi uzeo svoje platno i boje te odjurio u šumu kako bi uhvatio ljepotu koja ga okružuje.

"Sve je tako lijepo! Moram naslikati svaki detalj!" govorio je Petar sam sebi, dok je šetao šumskim stazama. Njegove slike bile su nevjerojatne; mogle su osvijetliti i najtamnije sobe. Ljudi iz sela dolazili su gledati njegove slike i divili se njihovoj ljepoti.

Jednog sunčanog jutra, Petar se odlučio malo odvojiti od poznatih staza i istražiti dublje u šumu. Dok je hodao, primijetio je da zvukovi šume postaju tiši, a svjetlost se mijenja. Ispod jednog starog stabla, ugledao je prekrasan cvijet koji nikada prije nije vidio. Njegovi latice blistale su u raznim bojama, a miris bio je čarolija samog proljeća.

"Wow, ti si najljepši cvijet koji sam ikada vidio!" uzviknuo je Petar, a srce mu je brže zakucalo od uzbuđenja. Odmah je uzeo svoje platno i kistove te se pripremio da ga naslika.

Ali, dok je počeo slikati, cvijet je iznenada progovorio. "Tko si ti, mladi slikar?" upitao je cvijet, a njegov glas bio je nježan poput povjetarca.

"Ja sam Petar, slikar iz sela. Oduševljen sam tvojom ljepotom i želim te naslikati!" odgovorio je Petar, zapanjen što cvijet može govoriti.

"Ja sam čarobni cvijet," rekao je cvijet s osmijehom. "Mogu ti pomoći da naslikaš najljepšu sliku koju si ikada naslikao, ali samo ako mi obećaš da ćeš zaštititi šumu i sve što u njoj živi."

Petar je razmišljao. "Obećavam ti! Šuma je moja inspiracija, i volim sve što u njoj živi!" rekao je odlučno.

Cvijet mu je zatim pružio posebne boje koje su blistale poput zvijezda. "Ove boje su čarobne. S njima ćeš naslikati sliku koja će očarati sve," rekao je cvijet.

Petar je bio presretan. Počeo je slikati, a svaka boja koju je koristio donosila je čaroliju u njegovu sliku. Drveće je izgledalo kao da pleše, a ptice su pjevale najljepše melodije. "Pogledaj, cvijete! Što misliš o ovome?" pitao je Petar dok je dodavao posljednje detalje.

"Prekrasno je, Petre! Osjećam se kao da sam dio te slike," odgovorila je čarobna cvijet.

Nakon nekoliko sati, Petar je završio sliku. Bila je to najljepša slika koju je ikada naslikao – šuma puna ljubavi, svjetlosti i života. "Ovo je nevjerojatno! Hvala ti, čarobni cvijete!" rekao je Petar, sretno se smiješeći.

Od tog dana, Petar je postao čuvar šume. Svaki put kad bi slikao, čarobni cvijet bi bio tu, gledajući ga s ponosom. Petar je često dolazio do njega i razgovarao o svojim snovima i željama. "Želim da svi u selu vide ljepotu šume," rekao bi.

"Možda možeš organizirati izložbu!" predložio je cvijet. "Pozovi sve ljude iz sela i pokaži im svoje slike."

Petar je brzo došao do ideje. Ubrzo je organizirao izložbu u selu. Na dan izložbe, cijelo selo došlo je gledati njegove slike. Svi su bili oduševljeni. "Tvoja slika šume je najljepša!" govorili su.

Petar je s ponosom pokazivao svoje radove, a cvijet je blistao od sreće. "Sjećate li se, obećao sam da ću vas zaštititi," rekao je Petar, i svi su se složili da će brinuti o šumi.

Tako je Petar postao poznat kao najbolji slikar, ali i kao čuvar šume. Naučio je da ljepota nije samo u onome što vidimo, već u onome što osjećamo i volimo. I svaki put kad bi naslikao nešto novo, čarobni cvijet bi mu se osmjehivao, znajući da su njihova prijateljstva i ljubav prema prirodi čarobni poput slika koje su zajedno stvorili.`
})

// 34. Sunce djever i Neva Nevičica (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: 'cbc96b88-6bc3-4475-ace9-2dae47b41b0b',
  body: `U čarobnom kraljevstvu gdje su dan i noć živjeli zajedno u harmoniji, postojala je prekrasna priča o Suncu djeveru i Nevi Nevičici. Sunce djever bio je mladić s zlatnim, sjajnim očima koje su sijale poput najsvjetlijih zvijezda. Njegova kosa bila je svijetla poput zraka sunca, a svaki put kada bi se nasmijejao, cijelo kraljevstvo bi blistalo od radosti. "Dobro jutro, draga Nevo!" često bi govorio s veseljem kada bi izlazio na nebo.

Neva Nevičica, s druge strane, bila je djevojka čija je ljepota i dobrota osvjetljavala noć poput mjeseca. Imala je duge, srebrne kose koje su se nježno kretale poput vjetra, a njezin osmijeh bio je poput svjetlosti koja obasjava svijet. "Sunce, jedva čekam da te opet vidim!" odgovarala bi ona, dok bi s nestrpljenjem čekala njegov izlazak.

Njihova ljubav bila je najljepša priča u cijelom kraljevstvu. Kada bi Sunce djever izlazio na nebo, Neva Nevičica je sretno plesala ispod, a zajedno bi stvarali najljepše zalaske i najljepše zore. "Pogledaj, Sunce! Zajedno stvaramo najljepši zalazak!" viknula bi Neva, dok bi se nebo bojevalo u nijanse narančaste i ružičaste.

Jednog dana, dok su se Sunce i Neva radovali dolasku proljeća, zli vjetar je došao u kraljevstvo. Vjetar je bio snažan i ljubomoran na njihovu ljubav. "Zašto Sunce i Neva imaju sve? Vrijeme je da ih razdvojim!" pomislio je vjetar, a zatim je počeo puhnuti snažnim udarima.

Donio je oluje, tamu i hladnoću. "Ne mogu vjerovati! Što se to događa?" uzviknula je Neva, dok su se oblaci skupljali na nebu. "Ne boj se, draga Nevo! Naša ljubav je jača od bilo kakve oluje!" hrabro je odgovorio Sunce djever.

Vjetar je pokušavao sve - slao je snažne udare koji su nosili kišu i grmljavinu. "Mislite li da se možete boriti protiv mene? Ja sam najjači!" zavijao je vjetar. Ali Sunce djever i Neva Nevičica nisu odustajali. "Zajedno možemo sve!" rekli su odlučno i čvrsto se držali za ruke.

Njihova ljubav bila je jača od bilo koje oluje. Sunčeve zrake osnažile su Nevu, a njezina dobrota pružala mu snagu. "Sviđa mi se tvoja hrabrost, Sunce!" rekla je Neva, dok su se zajedno suočavali s vjetrom. "I meni se sviđa tvoja snaga, Nevo!" odgovorio je Sunce djever.

Vjetar je shvatio da ne može pobijediti ljubav koja je tako snažna. "Možda nisam tako jak kao što sam mislio", promrmljao je tužno. "Ali zašto se ne bih pridružio vama? Mogu biti vaš prijatelj umjesto neprijatelj."

Od tog dana, vjetar je odlučio postati prijatelj. "Oprosti što sam bio zlonamjeran! Donijet ću vam svježinu i radost", rekao je vjetar s novim osmijehom. Zajedno su stvarali najljepše dane i najljepše noći. "Hvala ti, dragi vjetre! Radujemo se tvojim povjetarcem!" veselo su odgovorili Sunce i Neva.

Njihova priča postala je legenda, priča o ljubavi koja je jača od bilo koje oluje, o ljubavi koja osvjetljava i najtamnije noći, i o ljubavi koja traje zauvijek. Svako dijete u kraljevstvu slušalo je ovu priču i sanjalo o ljubavi koja može pobijediti sve prepreke. "I mi možemo biti poput njih!" govorili su mališani, dok su gledali u nebo, čekajući zlatne zrake Sunca i blistavu svjetlost Neve Nevičice.

I tako su Sunce djever, Neva Nevičica i njihov novi prijatelj, vjetar, zajedno stvarali čaroliju u kraljevstvu, a njihova ljubav bila je svjetlo koje nikada nije izblijedilo. Kraljevstvo je bilo sretno, a svaki dan bio je nova prilika za igru, smijeh i ljubav.`
})

// 35. Tintilinčić i tajna livada (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: '7a5af2ec-2a70-43d8-bf51-a2f7d6971eb1',
  body: `U čarobnoj livadi, koja je bila puna šarenog cvijeća, cvrčaka i veselog ptičjeg pjeva, živjelo je malo stvorenje po imenu Tintilinčić. Tintilinčić je bio tako mali da je mogao stati na dlan jedne ruke, ali imao je najveće srce u cijelom svijetu. Njegove oči su sjajile poput zvijezda, a svaki put kad se nasmijao, cvijeće oko njega bi počelo plesati.

"Živim ovdje među cvijećem i drvećem," govorio je Tintilinčić, "i svi me zovu prijateljem!" Bio je najbolji prijatelj svih životinja i svake vrste cvijeća, i svi su ga voljeli. Tintilinčić bi svakog jutra pozdravljao svoje prijatelje: "Dobro jutro, dragi cvrčci! Kako ste danas?" Cvrčci su mu veselo odgovarali: "Dobro jutro, Tintilinčiću! Spremni smo za novi dan pun pjevanja!"

Livada je bila puna tajni - bilo je tamo cvijeće koje je moglo govoriti, životinje koje su mogle pjevati, i drveće koje je moglo pričati priče. Tintilinčić je znao sve tajne livade, i svaki dan bi dijelio priče sa svima koji su dolazili. "Sviđa li vam se moja nova priča o zmajiću koji je volio letjeti?" pitao je jednom. "Da, da! Pričaj, pričaj!" uzvikivali su njegovi prijatelji.

Jednog sunčanog dana, dok je Tintilinčić pričao priču o čarobnim pticama, iznenada je čula veseli smijeh. Okrenuo se i ugledao malu djevojčicu po imenu Maja. Maja je imala plavu haljinu i pletenicu koja joj je padala do ramena. Njene oči su sjajile od radosti.

"Hej, tko si ti?" upitala je Maja sa znatiželjom.

"Ja sam Tintilinčić, čarobno stvorenje livade!" odgovorio je s ponosom. "Dođi bliže, pokazat ću ti sve tajne ovog mjesta!"

Maja je prišla i s oduševljenjem upitala: "Možeš li mi reći kako cvijeće priča?"

"Naravno!" rekao je Tintilinčić. "Svako cvijeće ima svoju priču. Na primjer, ova plava zvjezdica zna sve o zvijezdama na nebu! Pripazi, slušaj je!"

Maja je prisluškivala, a plava zvjezdica je počela pričati o tome kako je jednom bila najljepša zvijezda na nebu, ali je odlučila sići na zemlju da bi se družila s Tintilinčićem. Maja je bila oduševljena!

"Tintilinčiću, ovo je nevjerojatno!" rekla je s osmijehom. "Mogu li ostati ovdje s tobom i istraživati?"

"Naravno, Majo! Zajedno ćemo otkriti sve tajne livade!" rekao je Tintilinčić.

I tako su Maja i Tintilinčić postali najbolji prijatelji. Istraživali su livadu danima, otkrivajući različite tajne. Jednog dana, dok su se igrali skrivača s malim zečićima, Maja je pitala: "Kako to da svi ovdje imaju toliko radosti?"

Tintilinčić je s osmijehom odgovorio: "Jer svi volimo jedni druge. Prijateljstvo nam daje snagu i sreću!"

Maja se zamislila i rekla: "Znaš, prijateljstvo je najvažnije na svijetu! Tako se osjećam s tobom."

Livada je postala još ljepša s Majo i Tintilinčićem. Zajedno su organizirali zabave za sve životinje. Pjevajuće ptice su pjevale, zec je skakao, a cvijeće je plesalo. "Hajdemo zajedno plesati!" pozvao je Tintilinčić. Svi su se pridružili, i livada je bila ispunjena smijehom i radošću.

Od tog dana, Maja i Tintilinčić su svaki dan provodili zajedno, učeći jedni od drugih i otkrivajući čarobne tajne svijeta. Maja je naučila da prijateljstvo može nastati između bilo koga, i da zajedno možemo otkriti najljepše tajne svijeta.

I tako su živjeli sretno, dijeleći ljubav i radost u čarobnoj livadi, gdje su svi bili prijatelji.`
})

// 36. Toporko lutalica i devet župančića (4 min -> extend to 6-7 min)
storyUpdates.push({
  id: '5d1f196b-5be2-4e9e-8633-6a3a96e1b1a9',
  body: `Bio jednom jedan mladić po imenu Toporko koji je bio veliki lutalica. Volio je putovati i istraživati svijet, i nikada nije mogao dugo ostati na jednom mjestu. Njegova ljubav prema putovanju vodila ga je kroz mnoge zemlje, kroz zelene šume i visoke planine, ali i kroz čarobne doline pune predivnih stvorenja.

Jednog sunčanog jutra, dok je pješačio kroz cvjetnu livadu, Toporko je ugledao zanimljiv plakat na drvetu. "Kraljevstvo devet župančića u opasnosti! Pomoć je potrebna!" pisalo je na plakatu. "Što li se događa u tom kraljevstvu?", pomislio je Toporko. Odlučio je da krene prema tom misterioznom mjestu.

Kada je stigao u kraljevstvo, Toporko je primijetio devet malih prinčeva kako sjede na zlatnim stolicama ispod velikog stabla. Svaki od njih nosio je prelijepu krunu i imao posebnu moć. Prvi princ, Žutko, mogao je kontrolirati sunce i svjetlost. Drugi princ, Plavko, mogao je upravljati vodama rijeka. Treći princ, Crvenko, imao je moć da stvara vatru, dok je Čarobni princ imao sposobnost čarolije. Ostala dvojica, Zeleni i Ljubičasti, mogli su komunicirati s životinjama i biljkama. A tu su bili i Srebrni i Zlatni, koji su mogli donijeti sreću i bogatstvo.

"Što se događa, dragi prinčevi?", upitao je Toporko, prilazeći im.

"Zli čarobnjak želi preuzeti naše kraljevstvo!", rekao je Žutko, sav uzrujan. "Svojim čarobnim moćima prijeti da nas uništi!"

"Ne znamo kako ga zaustaviti", dodao je Plavko, brisajući suze. "Svi smo pokušali, ali on je prejak!"

Toporko je osjetio njihovu tugu. "Ne brinite, prijatelji. Ja ću vam pomoći! Moramo se udružiti i pronaći način kako da ga zaustavimo", rekao je odlučno.

"Ali kako?", upitao je Crvenko. "On ima moć nad svim čarobnim stvorenjima!"

"Putovat ćemo zajedno!", rekao je Toporko. "Zajedno možemo biti jači! Prvo ćemo istražiti tamnu šumu, možda pronađemo neke savjete ili prijatelje koji će nam pomoći."

Svi prinčevi su se složili i krenuli su na put. Šuma je bila gusta i mračna, a svaki šum ih je plašio. "Pogledajte, dugački drvoredi!", uzviknuo je Zeleni, pokazujući prema visokom drveću iznad njih.

Dok su hodali, čuli su šuštanje lišća. "Tko je tu?", upitala je Ljubičasta, držeći se čvrsto za Toporkovu ruku.

Iz grmlja je iskočila mala vjeverica. "Ja sam Viki, čuvarica ove šume. Što vas dovodi ovdje?", upitala je znatiželjno.

"Tražimo način kako da zaustavimo zlog čarobnjaka!", objasnio je Toporko. "Možda ti možeš pomoći?"

Viki se zamislila. "Zli čarobnjak može se zaustaviti samo ako mu pokažete ljubaznost. On je usamljen i traži prijatelje. Ali trebate biti hrabri i iskreni."

"Kako to možemo učiniti?", upitao je Zeleni.

"Morate ići do njegove kule i reći mu kako se osjećate. Pokažite mu da nije sam. Možda će se promijeniti", odgovorila je Viki.

Toporko i devet princa odlučili su slijediti Vikin savjet. Krenuli su prema čarobnjakovoj kuli koja se nalazila na najvišoj planini. Putovanje je bilo opasno i teško. Morali su proći kroz strme staze, preskočiti rijeke i savladati mnoge prepreke. Ali Toporko i župančići su bili uporni i hrabri.

Kada su konačno stigli do čarobnjakove kule, svjetlost je bila bljeđa nego što su zamislili. Čarobnjak je sjedio na svom prijestolju, izgleda tužno i usamljeno.

"Zli čarobnjače!", pozvao ga je Toporko. "Došli smo te pronaći jer smo čuli da si u problemu!"

Čarobnjak se iznenadio. "Tko ste vi? Zašto me ne napadate?"

"Ja sam Toporko, a ovo su devet župančića. Čuli smo da tražiš moć, ali možda ti zapravo treba prijateljstvo", rekao je Toporko.

"Prijateljstvo?", ponovio je čarobnjak, oči mu se napunile suzama. "Nitko nikada nije došao do mene. Svi su se bojali moje moći."

Toporko mu je pružio ruku. "Svi mi imamo svoje strahove, ali možemo zajedno dijeliti sreću. Dozvoli nam da budemo tvoji prijatelji."

Čarobnjak je dugo razmišljao, a zatim polako klimnuo glavom. "Da, želim prijatelje. Od danas, ja ću koristiti svoju moć za dobro."

Svi su se zagrlili, a Toporko je znao da su pronašli pravi put. Od tog dana, kraljevstvo je bilo sigurno, a Toporko je našao svoj dom među devet župančića. Naučio je da ponekad najveće avanture vode do najljepših prijateljstava, i da hrabrost nije u borbi, već u razumijevanju i ljubavi.

I tako su oni zajedno, Toporko i devet župančića, često posjećivali čarobnjaka, a njihova prijateljstva su jačala svaki dan. Kraljevstvo je procvjetalo, a svi su živjeli sretno do kraja svojih dana.`
})

// 37. Zvijezda iznad Zagreba (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: 'b2ba010b-4995-45d2-ae91-920b63809414',
  body: `U Zagrebu, visoko iznad krovova, živjela je mala zvijezda po imenu Zvjezdica. Bila je posebna jer je svjetlila toplijom svjetlošću od svih drugih zvijezda na nebu. Njezina svjetlost bila je mekana i utješna, poput toplog zagrljaja majke. Zvjezdica je obožavala gledati grad ispod sebe, pun života, smijeha i igre.

Svake večeri, dok je grad tonuo u mrak, Zvjezdica bi pažljivo promatrala djecu kako se pripremaju za spavanje. "Pogledajte ih," šaptala je sama sebi. "Neka su tužna, neka se boje mraka, a neka samo trebaju priču za laku noć."

Jedne noći, dok je svjetlost Zvjezdice obasjavala zagrebačke ulice, primijetila je dječaka imenom Luka. Luka je imao osam godina i uvijek je bio znatiželjan, ali te noći bio je uplašen. "Mama, ja se bojim mraka!" povikao je kroz otvorena vrata svoje sobe. Zvjezdica je osjetila kako joj srce preskoči. "Kako mogu pomoći?" pitala se.

Tada joj je stariji mjesec, koji se zvao Mjesec Mudri, rekao: "Tvoja svjetlost može donijeti utjehu, ali priče mogu donijeti snove. Priče mogu otvoriti vrata u svijet mašte gdje sve je moguće. Pokušaj pričati djeci dok spavaju."

Zvjezdica je odlučila poslušati savjet Mjeseca Mudrog. "Odlučila sam šapnuti priče djeci dok spavaju," rekla je sama sebi. "Možda ću im tako pomoći da se osjećaju bolje."

Te noći, dok su djeca spavala, Zvjezdica je počela šaptati. "Jednom davno," počela je, "živjela je hrabra princeza po imenu Mira. Njezin dvorac bio je okružen tamnom šumom, a svi su se bojali ući u nju. Ali princeza Mira bila je znatiželjna i nije se bojala."

Dok je pričala, Luka je slušao s poluotvorenim očima. "Ona je znala da u šumi žive prijatelji," nastavila je Zvjezdica, "mali zecovi, ptice koje pjevaju i cvijeće koje blista. 'Mrak nije nešto čega se treba bojati,' govorila je princeza, 'već mjesto gdje se mogu naći najljepše tajne.'"

Luka je polako zatvorio oči, a na njegovom licu pojavio se osmijeh. "To je predivno," promrmljao je. Zvjezdica je nastavila pričati o svim čarobnim mjestima koja su postojala u snovima, o zmajevima koji su letjeli iznad planina i vilama koje su plesale na cvjetnim livadama.

U drugoj sobi, Maja, djevojčica koja je imala pet godina, također je slušala. "Ja se bojim mraka!" povikala je. Ali Zvjezdica je znala da će Maja čuti priču o hrabroj princezi. Maja je voljela slušati priče, a ova je bila posebna. "Princ je došao do princeze i rekao joj: 'Ne boj se, jer mrak je pun čarolije!'"

Maja je prestala plakati. "Zar mrak može biti čarolija?" upitala je. "Da, draga Majo," odgovorila je Zvjezdica, "u mraku se skrivaju snovi i avanture. Samo moraš otvoriti srce."

Kad su se djeca probudila sljedećeg jutra, njihovi roditelji su primijetili promjenu. "Luka, ti se više ne bojiš mraka?" upitala je mama. "Ne, mama! Čuo sam priču o princezi Miri!" uzviknuo je Luka s osmijehom. Maja je također bila sretna. "Ja sam sanjala o čarobnim mjestima!" dodala je.

Zvjezdica je sretno svjetlila iznad, gledajući kako se osmijesi pojavljuju na dječjim licima. Shvatila je da njezina svjetlost nije bila samo za osvjetljavanje noći, već i za donosenje snova i utjehe svima.

Svake noći, nastavila je šapnuti priče o hrabrim junacima, prijateljstvu koje traje vječno, i ljubavi koja je jača od svega. "Kad god se osjećate tužno ili uplašeno," govorila je, "sjetite se da u mraku postoji svjetlost, a u svjetlosti – priče."

I tako je Zvjezdica, sa svakom pričom koju je šaptala, donosila sreću i ljubav u Zagreb. Znala je da su sve priče koje donesu osmijeh na dječje lice, svaki san koji rastjera strah i svaka ljubav koja se proširi kroz grad, njezina najveća nagrada. "I tako, mali prijatelji," završila je Zvjezdica, "nikada se ne bojte mraka, jer on krije najljepše tajne."`
})

// 38. Šestinski kišobran (4 min -> extend to 5-6 min)
storyUpdates.push({
  id: '44317b6a-2130-49bc-8135-6ede4b493a4e',
  body: `U Zagrebu, u čarobnom dijelu grada zvanom Šestine, postojala je prekrasna legenda o čarobnom kišobranu. Taj kišobran nije bio običan – mogao je zaštititi ne samo od kiše, već i od svih tuga i problema života. Svi su u Šestinama govorili o njemu, a djeca su maštala o njegovim čarima.

Kišobran je pripadao staroj ženi po imenu Marija. Marija je živjela u maloj kućici na brdu, okruženoj šarenim cvijećem i visokim drvećem. Bila je mudra i dobra, uvijek nasmijana. Ljudi su je zvali "dobra vila Šestina" jer je svima pomagali. Svaki put kad bi netko došao u nevolji, Marija bi mu pružila svoj čarobni kišobran.

Jednog sunčanog jutra, mala djevojčica po imenu Ana stigla je u Šestine s roditeljima. Ana je bila znatiželjna i vesela djevojčica s dugom, plavom kosom i velikim smeškom. Iako je uživala u šetnji, ubrzo se izgubila dok je istraživala šume oko kuće.

"Još malo ću prošetati," rekla je Anina mama. "Samo da vidim koja je to drvena kućica!"

Ana je odlučila slijediti stazu koja je vodila prema šumi. Ali, kada se osvrnula, shvatila je da ne zna kako se vratiti. "Mama! Tata!" vikala je, ali nitko je nije čuo. Osjećala se tužno i prestrašeno.

Marija je u tom trenutku sjedila ispred svoje kuće i uživala u mirisu cvijeća. Primijetila je Anu kako sjedi na tlu, plačući. Prišla je bliže i rekla: "Draga djevojčice, zašto si tako tužna?"

Ana je pogledala Mariju s očima punim suza i rekla: "Izgubila sam se i ne znam kako da se vratim kući!"

Marija se nasmiješila. "Ne brini, imam nešto što će ti pomoći." Uzela je svoj čarobni kišobran, koji je bio ukrašen šarenim uzorcima i sjajio se na suncu. "Uzmi ovaj kišobran," rekla je. "On će te zaštititi i voditi te kući. Samo ga otvori i slijedi njegove upute."

Ana je uzela kišobran, osjećajući se bolje. "Hvala vam, gospođice!" rekla je s osmijehom. Otvorila je kišobran i odjednom se dogodilo nešto čarobno! Kišobran je počeo svijetliti i pokazivati put prema kući.

"Idemo, kišobrane!" uzviknula je Ana i krenula. Kišobran ju je vodio kroz prekrasne ulice Šestina. Prolazili su pored šarenih kuća, igrališta i cvjetnih vrtova.

"Vidiš, Ana," rekao je kišobran, "sve ove lijepe stvari su tu da te podsjete da nije važno gdje si, već kako se osjećaš."

Ana je bila oduševljena. "Ovo je nevjerojatno! Kako ti znaš put?"

"Ja sam čarobni kišobran," odgovorio je kišobran. "Moj zadatak je da pomažem onima koji su izgubljeni i tužni."

Nakon što su prošli kroz šume i livade, Ana je stigla do svoje kuće. "Hvala ti, čarobni kišobrane!" rekla je i zatvorila ga. Osjetila je kako njezino srce ispunjava sreća.

Kada je ušla u kuću, mama i tata su je čekali, zabrinuti. "Anice, gdje si bila?" upitala je mama.

"Zagubila sam se, ali našla sam čarobni kišobran koji me doveo kući!" rekla je Ana s osmijehom.

Tada je odlučila ispričati cijelu priču o Mariji i kišobranu. "I znate što? Kišobran nije samo čarobni, on je simbol ljubavi i dobrote koju svi možemo dijeliti."

Ana je od tog dana čuvala kišobran kao najdragocjeniju stvar. Svima je pričala o svojoj avanturi i o Mariji koja je bila tako dobra prema njoj. Naučila je da su najljepše stvari u životu one koje dijelimo s drugima, i da ljubav i dobrota mogu zaštititi od bilo koje oluje.

I tako je priča o čarobnom kišobranu postala legenda koju su djeca u Šestinama rado pričala, a Marija je postala omiljena figura u njihovim srcima. Svako dijete je maštalo o tome da će jednog dana susresti čarobnu ženu i doživjeti vlastitu avanturu.`
})

// 39. Šuma Striborova (4 min -> extend to 6-7 min)
storyUpdates.push({
  id: '7b0d8d4a-3839-43fe-bdf4-82f854ab25d7',
  body: `U davna vremena, postojala je šuma koju su svi zvali Šuma Striborova. Bila je to čarobna šuma puna visokih stabala, tajanstvenih zvukova i magičnih stvorenja koja su živjela u njenim dubinama. U toj šumi, svako drvo imalo je svoju priču, a svaki kamen nosio je sjećanje iz prošlosti.

U šumi je živio mudri Stribor, čuvar svih šumskih stvorenja. Bio je to starac s dugačkom srebrnom bradom koja se blistala na mjesečini, i očima koje su poznavale sve tajne prirode. Njegova koža bila je naborana poput starih kore drveća, a u njegovom osmijehu uvijek se skrivala neka čarolija. Svaki dan, djeca iz obližnjeg sela dolazila su u šumu da čuju njegove priče o životinjama, drveću i magiji prirode.

Jednog sunčanog jutra, mala djevojčica po imenu Ana odlučila je otići u šumu. Ana je imala tamnu kosu koja se kretala poput valova kad je trčala, a oči su joj sjajile poput zvjezdica. U ruci je nosila svoj omiljeni kompas, dar od njenog djeda, koji je uvijek pokazivao pravi put. "Danas ću naučiti nešto novo!", rekla je sama sebi dok se približavala ulazu u šumu.

Dok je istraživala, iznenada je shvatila da je izgubila svoj kompas. "Ne, ne, ne! Gdje je moj kompas?" uzviknula je, a suze su joj krenule niz obraze. Tražila ga je svuda - pod lišćem, između korijenja, pored potoka - ali nije ga mogla naći. "Kako ću se sada vratiti kući bez njega?" pomislila je tužno.

Tada se pojavio Stribor. Njegova duga brada lepršala je na vjetru, a osmijeh mu je bio topao poput sunčeve svjetlosti. "Ne brini, mala Ana," rekao je Stribor glasom koji je zvučao poput šumskog vjetra. "Tvoja ljubav prema prirodi pomoći će ti da pronađeš ono što tražiš."

"Stribore, ja ne znam kako da pronađem svoj kompas!" očajno je rekla Ana, a srce joj je kucalo brže. "Molim te, pomozi mi!"

Stribor se nasmijejao i pomaknuo dlan prema šumi. "Pogledaj pažljivo. Šuma ima svoje tajne, ali će ti ih otkriti ako joj pokažeš svoje srce." Naučio ju je kako da sluša šumu - kako da čuje ptičje pjesme koje vode put, kako da prati tragove sunca kroz krošnje, i kako da osjeti vjetar koji joj govori smjer.

"Svako drvo ima svoju priču, Ana. Priče koje su stare kao vrijeme. Pokušaj čuti njihove glasove," rekao je Stribor dok su se šumski zvukovi počeli miješati u melodiju. Ana je zatvorila oči i slušala. Osjetila je vjetar kako joj miluje lice, a u daljini je čula pticu kako pjeva.

"Ova ptica pjeva o putu prema dolje, prema potoku!" uzviknula je Ana s uzbuđenjem. "Mogu li ga slijediti?"

"Naravno, ali pazi na svaki korak. Priroda te vodi, samo joj se moraš predati," odgovorio je Stribor s osmijehom.

Ana je krenula prema potoku, prateći melodiju ptice. Stigla je do malog izvora gdje su se kapljice vode srebrile na suncu. "Ovdje je tako lijepo!" rekla je, a srce joj je bilo ispunjeno radošću. Dok se sagnula da napuni ruke vodom, nešto je zasjalo u travi. "To je moj kompas!" povikala je.

Uzeo ga je u ruke i zagledala se u njega. "Kako je predivan!" rekla je s osmijehom, a Stribor je kimnuo glavom. "Sada znaš, Ana, da je ljubav prema prirodi najbolji vodič. Svaka kap vode, svaka ptica, svako drvo - svi su tu da ti pomognu."

Ana je shvatila da šuma nije samo mjesto gdje rastu drveća, već živi organizam pun ljubavi i mudrosti. "Hvala ti, Stribore! Sada ću uvijek slušati šumu i učiti iz nje," rekla je s oduševljenjem.

Od tog dana, Ana je postala čuvarica šume. Svake večeri, dok je šuma tonula u mrak, sjedila bi pod starim hrastom i slušala priče koje je šuma pričala. "Stribore, pričaj mi još jednu priču!" tražila je, a Stribor, naslonjen na stablo, ispričao bi joj o divljim životinjama, o vjetru koji nosi sjeme, i o zvijezdama koje gledaju na šumu.

Ubrzo su i druga djeca iz sela počela dolaziti s njom. "Ana, možeš li nas naučiti kako slušati šumu?" pitali su. "Da, naravno!" rekla je Ana, a njezin osmijeh bio je poput sunčeve svjetlosti koja je obasjavala šumu. Zajedno su učili o ljubavi, prijateljstvu i čarobnosti prirode koja nas okružuje.

Sva su djeca postala čuvari šume, pomažući Striboru da čuva tajne i ljepotu Šume Striborove. I tako su, zajedno, pronalazili čaroliju u svakom kutku šume, stvarajući uspomene koje će trajati vječno. A šuma je, s ljubavlju i mudrošću, uvijek bila tu da ih vodi.`
})

// 40. Ruže i zmajevi (3 min -> extend to 4-5 min)
storyUpdates.push({
  id: '043b7c19-95e6-43b4-8b09-a75549d3d330',
  body: `U davnim vremenima, postojalo je prekrasno kraljevstvo zvanog Ružolandija. U Ružolandiji su ruže rasle svuda, njihov miris bio je čaroban, a boje su se miješale poput duge. Zmajevi su letjeli nebom, njihova krila su šumela poput vjetra, a svi su ih voljeli jer su bili prijateljski raspoloženi. Kraljevstvo je bilo ispunjeno ljubavlju, prijateljstvom i čarobnim trenucima.

Jednog sunčanog jutra, dok su ptice pjevale, Marko, mladić s velikim snom, odlučio je otići u šumu po svježe ruže za svoju najbolju prijateljicu Lanu. "Lana će sigurno biti oduševljena!" pomislio je dok je trčao kroz šumu. Kada je stigao do cvjetne livade, ugledao je Lanu kako sjedi na travi s osmijehom na licu.

"Hej, Marko! Što to nosiš?" upitala je Lana dok je radosno mahala rukama.

"Donosim ti najljepše ruže iz Ružolandije! Pogle, koliko su prekrasne!" uzviknuo je Marko, ponosno držeći buket crvenih i ružičastih ruža.

"Prekrasne su! Hvala ti, Marko!" odgovorila je Lana, a njezin osmijeh bio je svjetliji od sunca.

No, dok su se veselili, iznenada se pojavila tamna sjena na nebu. Bio je to zli čarobnjak, Gromor! Njegova crna plašta vijorila su na vjetru dok je s mrzovoljnim izrazom gledao prema kraljevstvu. "Ova ljepota mora nestati!" povikao je, a njegovi su se zmajevi spuštali prema zemlji.

"Što to radiš, Gromore? Zašto želiš uništiti naše kraljevstvo?" povikala je Lana, držeći se za Marka.

"Zato što mrzim ljubav i sreću! Ruže i zmajevi će nestati, a ja ću zavladati ovim mjestom!" odvratio je Gromor, podižući čarobni štap.

Marko je znao da nešto mora učiniti. "Lano, moramo se boriti za naše kraljevstvo! Ljubav i hrabrost mogu pobijediti zlo!" rekao je odlučno.

"Slažem se, Marko! Kako ćemo to učiniti?" pitala je Lana, osjećajući strah, ali i uzbuđenje.

"Pozvat ćemo zmajeve da nam pomognu! Oni su hrabri i snažni. Zajedno ćemo se suprotstaviti Gromoru!" odgovorio je Marko.

Krenuli su prema planini gdje su zmajevi obično odmarali. Kada su stigli, jedan od zmajeva, Veliki Zmaj, prišao im je. "Što vas dovodi ovdje, djeco?" upitao je svojim dubokim glasom.

"Gromor želi uništiti naše kraljevstvo! Trebamo vašu pomoć da ga zaustavimo!" rekla je Lana.

"Mi smo tu da pomognemo! Ljubav i prijateljstvo su jači od svakog zla!" rekao je Veliki Zmaj, a ostali zmajevi su se pridružili.

Svi su zajedno poletjeli prema Gromoru. "Hej, Gromore!" povikao je Veliki Zmaj. "Ne možeš uništiti našu sreću! Ovo kraljevstvo je ispunjeno ljubavlju i prijateljstvom!"

"Ne, ne, ne! Moram pobijediti!" viknuo je Gromor, bacajući čarolije, ali Marko i Lana su se hrabro suočili s njim.

"Svi zajedno! Ljubav je jača od tvoje mržnje!" povikao je Marko, dok su zmajevi letjeli iznad i ispod Gromora, stvarajući šareni ples.

Na kraju, uz pomoć hrabrosti zmajeva i snage ljubavi koju su Marko i Lana imali, Gromor je bio poražen. Njegove tamne moći su nestale, a nebo se opet razvedrilo.

"Zajedno smo pobijedili!" uzviknula je Lana, a Marko ju je zagrlio.

Svi su se veselili, ruže su ponovo procvjetale, a zmajevi su letjeli visoko, ponosni na svoju hrabrost. Kraljevstvo Ružolandija ponovno je bilo najsretnije mjesto na svijetu.

Marko je naučio da ljubav i hrabrost mogu pobijediti svako zlo, a zajedno s prijateljima može stvoriti najljepše trenutke. I od tada, svake godine, kraljevstvo je slavilo dan kada su svi zajedno pobijedili zlo, a ruže su mirisale jače nego ikada.`
})

// 41. Mali domić u staroj kući (5 min -> extend to 8-9 min)
storyUpdates.push({
  id: '979fcc8f-140d-4688-88d0-2a823cdfd1ba',
  body: `U staroj kući na selu, kući koja je stajala tamo već stotinama godina, živio je mali domaćić - čarobno stvorenje koje pomaže u kući kada nitko ne gleda. Domaćić je bio vrlo stidljiv i nikada se nije pokazivao ljudima, ali svake noći, dok su ljudi spavali, on bi čistio, popravljao, i činio kuću ljepšom.

Domaćić je bio malen, visoka možda koliko dječja ruka, s dugačkom bradom koja mu je izgledala poput bijelog oblaka. Njegove oči blistale su poput zvijezda na tamnom nebu, a nosio je malu kapu koja mu je uvijek padala s glave kada se previše nagne. Njegov osmijeh bio je najtopliji osmijeh koji bi mogao osvijetliti i najtamniju sobu.

Svake noći, dok su ljudi spavali, domaćić bi izlazio iz svog skrovišta iza peći i počinjao raditi. Čistio bi prašinu, popravljao pokvarene stvari, spremao stol za jutro, i ostavljao male darove - cvijeće u vazi, svjež kruh na stolu, ili mali komadić kolača. Bio je vrlo marljiv i nikada nije tražio ništa zauzvrat.

Ljudi u kući su primijetili da se stvari čine same, ali nisu znali tko to radi. Neki su mislili da je to magija, drugi da su to duhovi, ali nitko nije znao istinu. "Kako je ova kuća uvijek tako čista?" pitala je mama. "I tko li je ostavio ovako mirisan kruh na stolu?" dodao je tata, zbunjen.

Jedne noći, mala djevojčica po imenu Marija, koja je imala devet godina, probudila se i vidjela svjetlost koja dolazi iz kuhinje. Bila je znatiželjna i hrabra, pa je tiho sišla niz stepenice da vidi što se događa. U kuhinji je ugledala domaćića kako sprema stol za jutro. Domaćić je pažljivo postavljao tanjure, noževe i vilice, a u pozadini se čuo miris svježeg kruha koji je pekao u pećnici.

Marija je stajala u tišini, gledajući kako domaćić radi s tolikom ljubavlju i pažnjom. "Tko si ti?" upitala je tiho, ne želeći prestrašiti domaćića.

Domaćić se prestrašio i htio pobjeći, ali Marija je rekla: "Ne boj se! Hvala ti što pomažeš našoj obitelji. Ti si naš prijatelj."

Domaćić je bio iznenađen. Nitko mu prije nije zahvalio. Nitko ga prije nije vidio. "Ja sam domaćić," rekao je glasom koji je zvučao poput šaptanja vjetra. "Volim pomagati, ali ljudi me se boje. Zato se nikada ne pokazujem."

"Ja se ne bojim," rekla je Marija, približavajući se i s osmijehom. "Ti si naš prijatelj. Hvala ti za sve što radiš." Marija je tada primijetila kako mu se nosi mala crvena kapa i odlučila mu je dati mali dar. "Evo, ovo je za tebe," rekla je, pružajući mu komadić kolača koji je ostao od večere. "Htjela bih da znaš da cijenim sve tvoje napore."

Domaćić je bio toliko sretan da je njegovo srce zatreperilo od radosti. "Hvala ti, Marija! Ovaj kolač miriše divno!" rekao je, a njegove oči su se zasvijetlile. "Nikada nisam imao prijatelja. Hvala ti što si me vidjela."

Od tog dana, Marija i domaćić su postali najbolji prijatelji. Svake noći, Marija bi ostavljala mali dar za domaćića - komadić kolača, cvijet, ili malu poruku. "Danas sam ti ostavila nekoliko latica cvijeta," rekla bi jednom prilikom, dok je sjedila na stepenicama, gledajući kako domaćić sretno čita njezinu poruku. "Nadam se da će ti uljepšati dan!"

A domaćić bi se uvijek nasmijao i rekao: "Hvala ti, Marija! Tvoja prijateljska gesta čini moju noć ljepšom."

Domaćić je nastavio pomagati, ali sada je znao da ima prijatelja koji ga cijeni i voli. Kuća je postala još ljepša i sretnija, jer ljubav i prijateljstvo čine svaki dom posebnim. Marija je naučila da su najljepše stvari u životu one koje dijelimo s drugima, i da prijateljstvo može nastati između bilo koga - čak i između djevojčice i malog domaćića.

Jedne noći, Marija je odlučila da pozove domaćića da se igraju zajedno. "Dođi, domaćiću! Možemo se igrati skrivača!" rekla je, smiješeći se. Domaćić se malo uplašio, ali je znao da je Marija dobra prijateljica. "Mogu li se skloniti iza peći?" upitao je.

"Naravno!" odgovorila je Marija. "Sviđa mi se tvoja skrivena mjesta!" Kada je počela brojati, domaćić je brzo pobjegao i sakrio se, a Marija se trudila da ga pronađe. "Jedan, dva, tri..." brojila je, a onda se okrenula i krenula u potragu.

Nakon što ga je pronašla, oboje su se smijali i igrali do kasno u noć. "Ovo je najljepša noć ikad!" rekla je Marija, a domaćić joj se pridružio u veselju. "Zahvaljujući tebi, moj život je postao pun radosti."

I tako je Marija naučila da prijateljstvo nije samo o tome što možemo dati jedni drugima, već i o tome kako se osjećamo zajedno. Svake noći, nakon što su završili s igranjem, Marija bi se vratila u svoj krevet, a domaćić bi se vratio u svoje skrovište, s osmijehom na licu, znajući da su postali pravi prijatelji.

I tako su oni zajedno, djevojčica i domaćić, stvarali uspomene koje će trajati zauvijek, jer ljubav i prijateljstvo čine svaki dom posebnim.`
})

// 42. Ribar Palunko i njegova žena (5 min -> extend to 8-9 min)
storyUpdates.push({
  id: '7331eb24-8327-45dc-abbc-8d5ae4f30d84',
  body: `Na obali mora, u maloj ribarskoj kućici, živio je ribar po imenu Palunko sa svojom voljenom ženom Maricom. Bili su siromašni, ali nevjerojatno sretni, jer su imali jedno drugo i more koje im je davalo hranu i radost svaki dan. Njihov dom bio je skromno uređen, s drvenim stolom, nekoliko starih stolica i malim prozorom kroz koji je svijetlilo sunce.

"Palunko, dragi," često je govorila Marica dok je prala suđe, "sjećaš li se onih dana kada smo ulovili toliko ribe da smo je podijelili s našim susjedima? Bilo je to prekrasno!"

"Da, draga moja," odgovarao je Palunko s osmijehom, "sjećam se i kako smo se smijali dok smo prali ribu na obali. Bio je to stvarno dobar dan."

Palunko je bio jednostavan čovjek, uvijek zadovoljan svojim životom. Svako jutro bi izlazio u more sa svojom malom barkom. "Danas ću uloviti najljepšu ribu!" govorio bi sam sebi dok je veslao. Njegova žena bi ga s prozora pozdravila: "Imaš sreće, dragi! Uvijek se vrati s osmijehom!"

Nakon što bi uhvatio ribu, vraćao bi se kući s osmijehom na licu, a Marica bi mu pripremala ukusnu ribu na žaru. Zajedno bi sjedili za stolom, pričali o svojim snovima i planovima za budućnost dok su uživali u hrskavoj ribi i slanom kruhu.

Ali Marica je često sanjala o bogatstvu. Svake večeri, dok su gledali zalazak sunca, govorila bi: "Kad bismo samo imali više novca, Palunko, bili bismo najsretniji ljudi na svijetu. Mogli bismo kupiti veću kuću, ljepše odjeće, i živjeti bez brige."

Palunko je uvijek odgovarao s blagošću: "Ali mi već jesmo sretni, draga. Imamo jedno drugo, imamo more, imamo našu malu kućicu. Što nam još treba?"

Jednog dana, dok je Palunko ribario, ulovio je zlatnu ribu koja je mogla govoriti. Riba je bila prekrasna, blistala je na suncu kao da je od zlata, a glas joj je bio mekan i čaroban. "Pusti me, dobri čovječe," molila je riba, "i ispunit ću ti tri želje. Bilo što što poželiš, bit će tvoje."

Palunko je bio dobar čovjek i odmah je pustio ribu. "Idi u miru, mala ribo," rekao je s osmijehom. "Ne trebam ništa zauzvrat." Riba mu je zahvalila sa sjajem u očima i nestala u dubinama mora.

Kada je Palunko došao kući i ispričao Marici što se dogodilo, ona je bila ljuta. "Trebao si tražiti želje!" vikala je. "Idi natrag i traži da postanemo bogati! Traži palaču! Traži zlato!"

Palunko je bio zbunjen, ali volio je svoju ženu. "Dobro, draga. Ako to želiš, otići ću natrag," rekao je. Vratio se na more i pozvao ribu. "Moja žena želi da postanemo bogati," rekao je.

Riba je ispunila želju, i Palunko i Marica su postali bogati. Imali su veliku palaču, zlato, i sve što su mogli poželjeti. Njihovi dani bili su ispunjeni raskošnim večerama i elegantnim haljinama. Marica se često divila svemu što su imali, ali nešto nije bilo u redu.

"Palunko, ovo je prekrasno," govorila je dok su šetali po palači, "ali ja želim još više! Želim kraljevsku krunu! Želim da budemo najbogatiji u cijelom kraljevstvu!"

Palunko je bio uplašen. "Ali draga, imamo sve što nam treba," odgovarao je. "Zar nisi sretnija?"

"Ne, želim više!" ponavljala je, pa je Palunko ponovno otišao do ribe. "Moja žena želi kraljevsku krunu," rekao je. Riba je ponovo ispunila želju, i Marica je postala kraljica.

Ali i dalje nije bila zadovoljna. "Palunko," govorila je, "sada želim postati vladarica mora! Želim da svi morski stanovnici slušaju moje zapovijedi!"

Palunko je bio u šoku. "Ali draga, to je previše! Što ćeš s tom moći?"

"Ne pitaj, samo idi!" viknula je Marica.

I tako je Palunko ponovno otišao do ribe. "Moja žena želi postati vladarica mora," rekao je. Riba je, nažalost, ispunila tu želju, ali njezin glas bio je tužan. "Ljubavi i zadovoljstvo su pravo bogatstvo," rekla je. "Vi ste zaboravili što je važno u životu. Vratit ću vas tamo gdje ste bili."

U trenutku, Palunko i Marica našli su se natrag u svojoj maloj kućici na obali. "Što se dogodilo?" upitala je Marica zbunjeno. "Gdje je palača?"

"Vratili smo se," odgovorio je Palunko s tugom u očima. "Riba je rekla da smo zaboravili pravu sreću."

Marica je pogledala oko sebe, a onda je shvatila. "Ali, Palunko, mi smo imali sreću i prije. Imali smo ljubav, a to je ono što je najvažnije!"

Od tada su se trudili više cijeniti male stvari. Svakog jutra su sjedili vani, pili čaj i razgovarali o svojim snovima. Palunko bi opet izlazio na more, ali sada bi se vraćao s ribom, a ne s bogatstvom.

"Palunko, dragi," rekla je Marica jednog dana, "sretna sam što imamo jedan drugoga. Nikad neću zaboraviti koliko je ljubav važna."

I tako su Palunko i Marica živjeli sretno, znajući da je pravo bogatstvo u ljubavi, prijateljstvu i jednostavnim radostima života. I svake večeri, kada je sunce zalazilo, oni bi se gledali i smijali, jer su konačno razumjeli da im ništa drugo nije potrebno.`
})

if (storyUpdates.length > 0) {
  console.log(`Applying ${storyUpdates.length} story updates...\n`)
  applyUpdates(storyUpdates)
} else {
  console.log('No story updates to apply.')
  console.log('Add rewritten stories to the storyUpdates array in this file.')
}

db.close()
