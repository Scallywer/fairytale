import { dbHelpers } from '../lib/db'

// Helper function to generate image URL - replace with actual AI-generated images
const getImageUrl = (title: string) => {
  // Using placeholder service - replace these with actual AI-generated images
  // You can use services like DALL-E, Midjourney, or Stable Diffusion
  const encodedTitle = encodeURIComponent(title)
  return `https://placehold.co/400x400/1e293b/fbbf24?text=${encodedTitle}`
}

const stories = [
  {
    title: 'Šuma Striborova',
    author: 'Ivana Brlić-Mažuranić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Šuma Striborova'),
    body: `U davna vremena, davno prije nego što su naši djedovi i bake bili mali, postojala je prekrasna šuma. Svi su je zvali Šuma Striborova, jer je to bilo posebno mjesto gdje se događale čarobne stvari. Bila je to šuma puna visokih, visokih stabala koja su rastala tako visoko da su doticale nebo. Listovi su šuštali na vjetru i zvučalo je kao da šuma priča tajne priče.

U toj čarobnoj šumi živio je mudri starac po imenu Stribor. Stribor je bio čuvar šume, što znači da je pazilo na sva stvorenja koja su tamo živjela. Bio je jako star, s dugačkom bradom koja je bila srebrna kao mjesec. Kada bi mjesec svijetlio kroz krošnje drveća, njegova brada bi blistala poput zvijezda. Oči su mu bile tople i ljubazne, i znalo se da zna sve tajne prirode.

Svaki dan bi djeca iz obližnjeg sela dolazila u šumu. Bila su radoznala i željela su čuti priče o životinjama koje žive u šumi, o drveću koje raste, i o svim čarobnim stvarima koje se događaju kada nitko ne gleda. Stribor bi im sjedio na obali malog potoka i pričao im priče dok su ptice pjevale u pozadini.

Jednog lijepog jutra, kada je sunce tek počelo svijetliti kroz krošnje, mala djevojčica po imenu Ana ušla je u šumu. Ana je imala samo sedam godina i bila je vrlo hrabra. Ali taj dan, bilo joj je tužno. Nosila je sa sobom mali kompas, poseban dar koji joj je dao njen djed. Bio je to zlatni kompas koji je uvijek pokazivao pravi put, i Ana ga je voljela više od bilo koje igračke.

Ali dok je Ana hodala šumskim stazama i gledala ptice i cvijeće, nešto se dogodilo. Njezin dragocjeni kompas je ispao iz ručice i nestao među lišćem i korijenjem. Ana je počela plakati, jer je znala da joj je djed rekao da pazi na taj kompas.

Tražila ga je svugdje. Gledala je ispod svakog lista, ispod svakog kamena, pored svakog potoka. Ali kompas je nestao kao da ga nikada nije bilo. Suze su joj tekle niz obraze, jer je znala da je to bio poseban dar njenog djeda.

Tada se nešto dogodilo. Vjetar je začuo lagano puhnuti, i između stabala pojavio se Stribor. Bio je visok i veličanstven, s tom srebrnom bradom koja se njišala na vjetru. Pristupio je Ani i sjeo pored nje na mekanu travu.

"Ne brini, mala Ana," rekao je Stribor glasom koji je zvučao poput šaptanja vjetra kroz lišće. "Vidim da si tužna jer si izgubila nešto važno. Ali znaj da tvoja ljubav prema prirodi i prema svemu lijepome u svijetu može ti pomoći da nađeš ono što tražiš."

Ana je gledala Stribora velikim očima punim suza. "Ali kako?" upitala je. "Tražila sam svugdje, i ne mogu ga naći."

Stribor se nasmiješio toplo. "Slušaj, mala Ana," rekao je. "Šuma je kao veliki prijatelj koji te voli. Kada slušaš šumu pažljivo, ona ti može reći gdje su stvari. Pogledaj kako ptice pjevaju - one znaju gdje je tvoj kompas i pjevaju ti da ga nađeš. Pogledaj kako sunce probija kroz krošnje drveća - osvjetljava put koji vodi do tvog kompasa. I osjeti vjetar - on ti šapće smjer u kojem trebaš ići."

Ana je zatvorila oči i počela slušati. Čula je kako ptice pjevaju lijepe pjesme, i činilo joj se da joj pokazuju put. Vidjela je kako sunce osvjetljava jedan dio šume, i shvatila je da tamo treba ići. Osjetila je kako vjetar lagano puše prema jednom malom potoku.

"Svako drvo ovdje ima svoju posebnu priču," nastavio je Stribor. "Svaki kamen koji vidiš nosi sjećanje na sve što se ovdje dogodilo. A svaki potok šapće mudrost koja je stara kao i sama šuma. Kada slušaš šumu, ona ti priča priče. Kada slušaš prirode, ona ti pokazuje put."

Ana je otvorila oči i krenula prema potoku gdje je vjetar puhao. Tamo je, u malom zavičaju među korijenjem starog hrasta, blistao njezin zlatni kompas. Bilo je to najljepše što je Ana ikada vidjela.

Ali još važnije od pronalaska kompasa bilo je ono što je Ana naučila. Shvatila je da šuma nije samo mjesto gdje rastu drveća i gdje žive životinje. Shvatila je da je šuma živo biće koje voli, koje štiti, i koje želi pomoći svima koji je vole. Naučila je da kada voliš prirodu i kada je slušaš, priroda te vodi i štiti.

Od tog dana, Ana je postala čuvarica šume, baš kao što je Stribor bio čuvar. Svaki dan bi dolazila u šumu i dijelila priče sa drugom djecom koja su željela čuti o ljepoti prirode. Učila je djecu kako slušati šumu, kako vidjeti ljepotu oko sebe, i kako voljeti prirodu.

Svake večeri, kada bi sunce zalazilo i šuma bi tonula u mrak, Ana bi sjedila pod starim hrastom gdje je našla svoj kompas. Slušala bi priče koje je šuma pričala - priče o ljubavi između prijatelja, o hrabrosti malih dječaka i djevojčica, i o čarobnosti svih lijepih stvari koje nas okružuju. I znala je da će zauvijek biti prijatelj sa šumom, jer su prijatelji zauvijek.`,
    isApproved: true,
  },
  {
    title: 'Kako je Potjeh tražio istinu',
    author: 'Ivana Brlić-Mažuranić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Kako je Potjeh tražio istinu'),
    body: `Bio jednom jedan mladić po imenu Potjeh koji je imao samo jedno pitanje u glavi: "Što je istina?" Ovo pitanje ga je mučilo svaki dan, svaku noć, i nije mogao pronaći mir dok ne bi saznao odgovor.

Potjeh je putovao daleko i široko, prešao planine i doline, preplivao rijeke i more, pitao mudrace, čitao stare knjige, i tražio odgovor na svoje pitanje. Ali svatko mu je govorio nešto drugačije, i svaki odgovor je samo povećavao njegovu zbunjenost.

Jedan mudrac je rekao: "Istina je u znanju. Što više znaš, to si bliže istini." Potjeh je proveo godine učenja, čitajući sve knjige koje je mogao pronaći, ali i dalje nije osjećao da je našao istinu.

Drugi mudrac je rekao: "Istina je u ljubavi. Ljubav je najveća istina koja postoji." Potjeh je tražio ljubav svuda - u prijateljstvima, u obitelji, u prirodi - ali i dalje je osjećao da nešto nedostaje.

Treći mudrac je rekao: "Istina je u prirodi. Priroda je najveći učitelj." Potjeh je proveo mjesece u šumi, slušajući zvukove prirode, ali i dalje nije našao odgovor koji ga je zadovoljavao.

Potjeh je bio zbunjen. Kako može biti toliko različitih istina? Kako može svatko imati drugačiji odgovor na isto pitanje?

Jednog dana, Potjeh je sjeo pod staro hrastovo stablo i razmišljao. Tada je primijetio mrav koji je nosio hranu svojoj obitelji - mali, ali uporan, znajući točno gdje ide. Primijetio je kako se listovi drveća njišu na vjetru - svaki list se kreće na svoj način, ali svi zajedno stvaraju prekrasnu harmoniju. Čuo je pjesmu ptice koja je gradila gnijezdo - pjesmu punu ljubavi i nade.

U tom trenutku, Potjeh je shvatio: istina nije jedna stvar koju možemo naći. Istina je u svemu što nas okružuje - u ljubavi, u prirodi, u znanju, u svakom trenutku života. Istina nije odgovor koji možemo pronaći u knjigama ili čuti od mudraca - istina je putovanje, iskustvo, osjećaj da živimo svaki trenutak potpuno i iskreno.

Od tog dana, Potjeh je prestao tražiti istinu i počeo je živjeti je, svakim danom, svakim trenutkom. Shvatio je da je istina u svakom osmijehu, u svakoj suzi, u svakom trenutku ljubavi i prijateljstva. Istina je u životu samom.`,
    isApproved: true,
  },
  {
    title: 'Ribar Palunko i njegova žena',
    author: 'Ivana Brlić-Mažuranić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Ribar Palunko i njegova žena'),
    body: `Na obali mora, u maloj ribarskoj kućici, živio je ribar po imenu Palunko sa svojom ženom. Bili su siromašni, ali nevjerojatno sretni, jer su imali jedno drugo i more koje im je davalo hranu i radost svaki dan.

Palunko je bio jednostavan čovjek, zadovoljan svojim životom. Svako jutro bi izašao u more sa svojom malom barkom, hvatao ribu, i vraćao se kući s osmijehom na licu. Njegova žena bi pripremala ribu, i zajedno bi jeli uz priču o danu koji su proveli.

Ali Palunkova žena je često sanjala o bogatstvu. "Kad bismo samo imali više novca," govorila bi svake večeri dok su gledali zalazak sunca, "bili bismo najsretniji ljudi na svijetu. Mogli bismo kupiti veću kuću, ljepše odjeće, i živjeti bez brige."

Palunko je uvijek odgovarao: "Ali mi već jesmo sretni, draga. Imamo jedno drugo, imamo more, imamo našu malu kućicu. Što nam još treba?"

Jednog dana, dok je Palunko ribario, ulovio je zlatnu ribu koja je mogla govoriti. Riba je bila prekrasna, blistala je na suncu, i glas joj je bio mekan i čaroban. "Pusti me, dobri čovječe," molila je riba, "i ispunit ću ti tri želje. Bilo što što poželiš, bit će tvoje."

Palunko je bio dobar čovjek i odmah je pustio ribu. "Idi u miru, mala ribu," rekao je. "Ne trebam ništa zauzvrat." Riba mu je zahvalila i nestala u dubinama mora.

Kada je Palunko došao kući i ispričao ženi što se dogodilo, ona je bila ljuta. "Trebao si tražiti želje!" vikala je. "Idi natrag i traži da postanemo bogati! Traži palaču! Traži zlato!"

Palunko se vratio na more i pozvao ribu. "Moja žena želi da postanemo bogati," rekao je. Riba je ispunila želju, i Palunko i njegova žena su postali bogati. Imali su veliku palaču, zlato, i sve što su mogli poželjeti.

Ali žena nije bila zadovoljna. Tražila je još - veću palaču, kraljevsku krunu, pa čak i da postane vladarica mora. Svaki put, Palunko bi se vratio ribi i tražio još. I svaki put, riba bi ispunila želju, ali bi postajala sve tužnija.

Na kraju, kada je žena tražila da postane vladarica mora, riba je rekla: "Ljubav i zadovoljstvo su pravo bogatstvo. Vi ste zaboravili što je važno u životu. Vratit ću vas tamo gdje ste bili."

I tako su se Palunko i njegova žena vratili u svoju malu kućicu na obali. Ali sada su znali da je najveće bogatstvo ljubav koju dijele, a ne zlato ili palače. Shvatili su da su bili sretni sve vrijeme, samo što to nisu znali. Od tog dana, živjeli su sretno, znajući da je pravo bogatstvo u ljubavi, prijateljstvu i jednostavnim radostima života.`,
    isApproved: true,
  },
  {
    title: 'Bratac Jaglenac i sestrica Rutvica',
    author: 'Ivana Brlić-Mažuranić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Bratac Jaglenac i sestrica Rutvica'),
    body: `U malom selu, u maloj kućici na rubu šume, živjeli su bratac Jaglenac i sestrica Rutvica. Bili su siročad, ali imali su jedno drugo i to im je bilo dovoljno. Njihova ljubav i zajedništvo činili su ih najsretnijim djecom u selu.

Jaglenac je bio hrabar i jak, uvijek spreman zaštititi sestru. Bio je visok za svoje godine, s crnim kosom i očima koje su blistale od hrabrosti. Rutvica je bila pametna i brižna, uvijek spremna pomoći bratu. Imala je plavu kosu koja se blistala na suncu i osmijeh koji je mogao osvijetliti najtamniju sobu.

Svaki dan bi zajedno išli u šumu da skupljaju drva, bobičasto voće i lijepe cvijeće. Jaglenac bi nosio teški koš, a Rutvica bi pjevala pjesme koje su ih veselile. Zajedno su bili nezaustavljivi.

Jednog dana, zla vještica je došla u selo i počela uzimati djecu. Bila je to strašna vještica s dugim nosom, crnim očima i glasom koji je zvučao poput vjetra u oluji. Djeca su se bojala, roditelji su se sakrivali, a vještica je uzimala jedno dijete za drugim.

Kada je došla po Jaglenca i Rutvicu, dvoje braće i sestara se sakrilo u šumi. Bili su prestrašeni, ali nisu htjeli napustiti jedno drugo. "Ne brini, Rutvica," rekao je Jaglenac, držeći je za ruku. "Zaštitit ću te. Zajedno smo jači od bilo koje vještice."

"Ne brini, Jaglenac," rekla je Rutvica, vraćajući mu stisak. "Naći ćemo način. Zajedno možemo sve."

U šumi su sreli mudrog starog medvjeda koji je živio u špilji punoj meda i ljubavi. Medvjed je bio velik i snažan, ali imao je najmeđe oči koje su blistale od mudrosti. "Samo ljubav između braće i sestara može pobijediti zlo," rekao im je medvjed glasom koji je zvučao poput grmljavine. "Vaša ljubav je vaša najveća snaga."

Jaglenac i Rutvica su shvatili da njihova ljubav i zajedništvo čine jakim. Zajedno su se vratili u selo i, držeći se za ruke, suprotstavili su se vještici. Kada je vještica vidjela koliko su jak kad su zajedno, koliko se vole i koliko su hrabri, pobjegla je i više se nikada nije vratila.

Od tog dana, Jaglenac i Rutvica su živjeli sretno, znajući da je njihova ljubav najjača snaga na svijetu. Shvatili su da zajedno mogu prevladati bilo kakvu prepreku, bilo kakvu opasnost, bilo kakvu tugu. Njihova priča je postala legenda u selu, priča o ljubavi koja je jača od bilo koje magije.`,
    isApproved: true,
  },
  {
    title: 'Zvijezda iznad Zagreba',
    author: 'Moderna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Zvijezda iznad Zagreba'),
    body: `U Zagrebu, visoko iznad krovova, živjela je mala zvijezda po imenu Zvjezdica. Bila je posebna jer je svjetlila toplijom svjetlošću od svih drugih zvijezda na nebu. Njezina svjetlost je bila mekana i utješna, poput toplog zagrljaja majke.

Svake večeri, dok je grad tonuo u mrak, Zvjezdica bi gledala dolje na Zagreb i vidjela djecu kako idu na spavanje. Neka djeca su bila tužna, neka su se bojala mraka, a neka su jednostavno trebala priču za laku noć da bi zaspala s osmijehom na licu.

Zvjezdica je željela pomoći, ali nije znala kako. Svjetlost koju je davala nije bila dovoljna da rastjera sve strahove i tuge. Tada joj je stariji mjesec, koji je bio mudar i iskusan, dao savjet: "Tvoja svjetlost može donijeti utjehu, ali priče mogu donijeti snove. Priče mogu otvoriti vrata u svijet mašte gdje sve je moguće."

Zvjezdica je počela šaputati priče djeci dok su spavala. Priče o hrabrim junacima koji su prevladali sve prepreke, o ljubavi koja je jača od bilo čega, o prijateljstvu koje traje zauvijek, i o čarobnim mjestima gdje sve je moguće.

Djeca su počela sanjati lijepe snove, a njihovi roditelji su primijetili kako se budi sretnija i opuštenija. Zvjezdica je vidjela kako se osmijesi pojavljuju na dječjim licima dok spavaju, kako se strahovi rastjeruju, i kako se ljubav širi kroz grad.

Jedne noći, Zvjezdica je vidjela djevojčicu koja je plakala jer se bojala mraka. Djevojčica se zvala Maja i imala je samo pet godina. Zvjezdica je svjetlila što je jače mogla i šapnula joj priču o hrabroj princezi koja nije znala što je strah.

Priča je govorila o princezi koja je živjela u dvorcu okruženom tamnom šumom. Svi su se bojali šume, ali princeza nije. Ona je znala da u šumi žive prijatelji - mali zecovi, ptice koje pjevaju, i cvijeće koje blista. Princeza je naučila da mrak nije nešto čega se treba bojati, već mjesto gdje se mogu naći najljepše tajne.

Maja je prestala plakati, nasmiješila se, i zatvorila oči. Sanjala je o hrabroj princezi i probudila se sretna. Od tog dana, više se nije bojala mraka, jer je znala da u mraku žive priče i snovi.

Zvjezdica je nastavila šaputati priče svake noći, znajući da njezina svrha nije samo svjetliti, već i donositi snove i utjehu svim djeci u Zagrebu. Shvatila je da je svaka priča koja donese osmijeh na dječje lice, svaki san koji rastjera strah, i svaka ljubav koja se proširi kroz grad, njezina najveća nagrada.`,
    isApproved: true,
  },
  {
    title: 'Mali domić u staroj kući',
    author: 'Folklorna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Mali domić u staroj kući'),
    body: `U staroj kući na selu, kući koja je stajala tamo već stotinama godina, živio je mali domaćić - čarobno stvorenje koje pomaže u kući kada nitko ne gleda. Domaćić je bio vrlo stidljiv i nikada se nije pokazivao ljudima, ali svake noći, dok su ljudi spavali, on bi čistio, popravljao, i činio kuću ljepšom.

Bila je to mala stvorenja, visoka možda koliko dječja ruka, s dugačkom bradom i očima koje su blistale poput zvijezda. Domaćić je nosio malu kapu i imao je najtopliji osmijeh koji je mogao osvijetliti najtamniju sobu.

Svake noći, dok su ljudi spavali, domaćić bi izlazio iz svog skrovišta iza peći i počinjao raditi. Čistio bi prašinu, popravljao pokvarene stvari, spremao stol za jutro, i ostavljao male darove - cvijeće u vazi, svjež kruh na stolu, ili mali komadić kolača.

Ljudi u kući su primijetili da se stvari čine same, ali nisu znali tko to radi. Neki su mislili da je to magija, drugi da su to duhovi, ali nitko nije znao istinu.

Jedne noći, mala djevojčica po imenu Marija je probudila se i vidjela svjetlost koja dolazi iz kuhinje. Bila je znatiželjna i hrabra, pa je tiho sišla niz stepenice da vidi što se događa.

U kuhinji je vidjela domaćića kako sprema stol za jutro. Domaćić je stavljao tanjure, noževe i vilice, i pripremao sve za doručak. Marija je stajala u tišini, gledajući kako domaćić radi s tolikom ljubavlju i pažnjom.

"Tko si ti?" upitala je Marija tiho, ne želeći prestrašiti domaćića.

Domaćić se prestrašio i htio pobjeći, ali Marija je rekla: "Ne boj se! Hvala ti što pomažeš našoj obitelji. Ti si naš prijatelj."

Domaćić je bio iznenađen. Nitko mu prije nije zahvalio. Nitko ga prije nije vidio. "Ja sam domaćić," rekao je glasom koji je zvučao poput šaptanja vjetra. "Volim pomagati, ali ljudi me se boje. Zato se nikada ne pokazujem."

"Ja se ne bojim," rekla je Marija, približavajući se. "Ti si naš prijatelj. Hvala ti za sve što radiš."

Od tog dana, Marija i domaćić su postali prijatelji. Marija bi ponekad ostavljala mali dar za domaćića - komadić kolača, cvijet, ili malu poruku. A domaćić je nastavio pomagati, ali sada je znao da ima prijatelja koji ga cijeni i voli.

Kuća je postala još ljepša i sretnija, jer ljubav i prijateljstvo čine svaki dom posebnim. Marija je naučila da su najljepše stvari u životu one koje dijelimo s drugima, i da prijateljstvo može nastati između bilo koga - čak i između djevojčice i malog domaćića.`,
    isApproved: true,
  },
  {
    title: 'Regoč',
    author: 'Ivana Brlić-Mažuranić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Regoč'),
    body: `U davnim vremenima, postojalo je čarobno mjesto zvano Regoč. Bilo je to mjesto gdje su se sastajale sve priče svijeta, gdje su se snovi pretvarali u stvarnost, i gdje je svaka želja mogla biti ispunjena.

Regoč je bio čuvaran od strane tri mudra čuvar - Starac Vjetar, Stara Voda, i Stara Zemlja. Svaki od njih je imao svoju moć i svoju mudrost, i zajedno su čuvali tajnu Regoča.

Jednog dana, mladić po imenu Marko je čuo priču o Regoču i odlučio ga pronaći. Putovao je kroz planine i doline, preko rijeka i kroz šume, tražeći čarobno mjesto. Na svom putu je sreo mnoge ljude koji su mu pričali o Regoču, ali nitko nije znao gdje se točno nalazi.

Kada je konačno stigao do Regoča, Marko je vidio tri čuvara kako stoje na ulazu. "Zašto tražiš Regoč?" upitali su ga. "Što želiš postići?"

Marko je odgovorio: "Želim pronaći sreću i ljubav. Želim živjeti život pun radosti i smisla."

Čuvari su se nasmijali. "Regoč nije mjesto gdje se pronalazi sreća," rekao je Starac Vjetar. "Regoč je mjesto gdje se uči kako biti sretan. Sreća nije nešto što se pronalazi - sreća je nešto što se stvara."

Marko je proveo dane u Regoču, učeći od čuvara o ljubavi, prijateljstvu, i životu. Naučio je da je sreća u malim stvarima - u osmijehu prijatelja, u ljepoti prirode, u toplini sunca. Naučio je da ljubav nije nešto što se traži, već nešto što se daje.

Kada je napustio Regoč, Marko je bio drugačiji čovjek. Nije više tražio sreću - on ju je stvarao. Nije više tražio ljubav - on ju je dijelio. I u tome je pronašao pravu sreću i pravu ljubav.`,
    isApproved: true,
  },
  {
    title: 'Toporko lutalica i devet župančića',
    author: 'Ivana Brlić-Mažuranić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Toporko lutalica i devet župančića'),
    body: `Bio jednom jedan mladić po imenu Toporko koji je bio veliki lutalica. Volio je putovati i istraživati svijet, i nikada nije mogao dugo ostati na jednom mjestu. Njegova ljubav prema putovanju i istraživanju vodila ga je kroz mnoge zemlje i kroz mnoge avanture.

Jednog dana, Toporko je došao u kraljevstvo gdje je živjelo devet župančića - devet malih prinčeva koji su vladali različitim dijelovima kraljevstva. Svaki od njih je imao svoju posebnost i svoju moć, i zajedno su činili najmoćniju vladavinu u cijelom svijetu.

Ali župančići su bili u problemu. Njihovo kraljevstvo je bilo u opasnosti od zlog čarobnjaka koji je htio preuzeti vlast. Čarobnjak je bio moćan i opasan, i nitko nije znao kako ga zaustaviti.

Toporko je čuo o njihovim problemima i odlučio im pomoći. Iako je bio samo običan putnik, imao je hrabrost i mudrost koje su bile potrebne. Zajedno sa devet župančića, Toporko je krenuo u avanturu da spasi kraljevstvo.

Putovanje je bilo opasno i teško. Morali su proći kroz tamne šume, preko opasnih planina, i kroz čarobne doline. Ali Toporko i župančići su bili uporni i hrabri, i zajedno su prevladali sve prepreke.

Kada su konačno stigli do čarobnjakove kule, Toporko je shvatio da je čarobnjak zapravo bio samo usamljen čovjek koji je tražio ljubav i prijateljstvo. Umjesto da se bore, Toporko je ponudio čarobnjaku prijateljstvo, i čarobnjak je prihvatio.

Od tog dana, kraljevstvo je bilo sigurno, a Toporko je našao svoj dom među devet župančića. Naučio je da ponekad najveće avanture vode do najljepših prijateljstava, i da hrabrost nije u borbi, već u razumijevanju i ljubavi.`,
    isApproved: true,
  },
  {
    title: 'Jagor',
    author: 'Ivana Brlić-Mažuranić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Jagor'),
    body: `U davnim vremenima, postojalo je čarobno stvorenje po imenu Jagor. Jagor je bio mali, ali vrlo mudar, i imao je moć da vidi u budućnost i da razumije jezik svih živih bića. Bio je čuvar prirode i prijatelj svih životinja.

Jagor je živio u šumi, u maloj špilji okruženoj cvijećem i drvećem. Svaki dan bi izlazio iz svoje špilje i šetao kroz šumu, slušajući priče koje su pričale životinje, drveće, i cvijeće. Znao je sve tajne šume i sve priče koje su se dogodile u njoj.

Jednog dana, mala djevojčica po imenu Luka je došla u šumu i izgubila se. Bila je prestrašena i nije znala kako da se vrati kući. Plakala je i zvala pomoć, ali nitko nije dolazio.

Jagor je čuo njezine suze i došao joj u pomoć. "Ne brini, mala Luka," rekao je Jagor glasom koji je zvučao poput šaptanja lista. "Ja ću ti pomoći da se vratiš kući."

Jagor je pozvao sve prijatelje iz šume - ptice koje su pjevale, zecove koji su skakali, i drveće koje je šuštalo. Zajedno su pokazali Luki put kući, i Luka je sigurno stigla do svoje obitelji.

Od tog dana, Luka je postala prijateljica Jagora i svih stvorenja u šumi. Naučila je da priroda nije nešto čega se treba bojati, već nešto što nas voli i želi nam pomoći. Naučila je da svako stvorenje ima svoju priču i svoju ljubav, i da zajedno možemo stvoriti najljepše priče.`,
    isApproved: true,
  },
  {
    title: 'Sunce djever i Neva Nevičica',
    author: 'Ivana Brlić-Mažuranić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Sunce djever i Neva Nevičica'),
    body: `U čarobnom kraljevstvu gdje su dan i noć živjeli zajedno u harmoniji, postojala je prekrasna priča o Suncu djeveru i Nevi Nevičici. Sunce djever je bio mladić koji je nosio svjetlost i toplinu svugdje gdje je išao, a Neva Nevičica je bila djevojka čija je ljepota i dobrota osvjetljavala noć poput mjeseca.

Njihova ljubav je bila najljepša priča u cijelom kraljevstvu. Kada bi Sunce djever izlazio na nebo, Neva Nevičica bi ga čekala, i zajedno bi stvarali najljepše zalaske i najljepše zore. Njihova ljubav je bila tako jaka da je mogla osvijetliti i najtamniju noć.

Ali jednog dana, zli vjetar je došao u kraljevstvo i pokušao razdvojiti Sunce djevera i Nevu Nevičicu. Vjetar je bio ljubomoran na njihovu ljubav i htio je uništiti sve što je lijepo u kraljevstvu.

Vjetar je pokušao sve - donio je oluje, tamu, i hladnoću. Ali ljubav između Sunca djevera i Neve Nevičice bila je jača od bilo koje oluje. Zajedno su stajali protiv vjetra, i njihova ljubav je osvijetlila cijelo kraljevstvo.

Vjetar je shvatio da ne može pobijediti ljubav, i odlučio je postati prijatelj umjesto neprijatelja. Od tog dana, vjetar je donosio svježinu i radost, i zajedno sa Sunc djeverom i Nevom Nevičicom, stvarao je najljepše dane i najljepše noći.

Njihova priča je postala legenda, priča o ljubavi koja je jača od bilo koje oluje, o ljubavi koja osvjetljava i najtamnije noći, i o ljubavi koja traje zauvijek.`,
    isApproved: true,
  },
  {
    title: 'Devojka postala iz pomaranče',
    author: 'Folklorna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Devojka postala iz pomaranče'),
    body: `U davnim vremenima, živio je mladi kraljević koji je tražio svoju pravu ljubav. Putovao je kroz mnoge zemlje, sreo mnoge princeze, ali nitko nije bio pravi. Kraljević je bio tužan i nije znao gdje da traži dalje.

Jednog dana, kraljević je došao u čarobni vrt gdje je raslo drvo sa tri zlatne naranče. Drvo je bilo prekrasno, a naranče su blistale poput sunca. Kraljević je bio fasciniran i odlučio uzeti jednu naranču.

Kada je uzeo naranču, naranča se otvorila i iz nje je izašla prekrasna djevojka. Bila je to najljepša djevojka koju je kraljević ikada vidio - imala je zlatnu kosu, plave oči, i osmijeh koji je mogao osvijetliti cijeli svijet.

"Tko si ti?" upitao je kraljević začuđeno.

"Ja sam djevojka iz naranče," odgovorila je djevojka. "Čekala sam te ovdje, znajući da ćeš doći. Ja sam tvoja prava ljubav."

Kraljević i djevojka su se zaljubili na prvi pogled. Njihova ljubav je bila tako jaka da je mogla prevladati bilo kakvu prepreku. Zajedno su se vratili u kraljevićevo kraljevstvo i živjeli sretno zauvijek.

Njihova priča je postala legenda, priča o ljubavi koja se nalazi na najneočekivanijim mjestima, o ljubavi koja je čekala pravi trenutak, i o ljubavi koja traje zauvijek.`,
    isApproved: true,
  },
  {
    title: 'Pirgo',
    author: 'Anđelka Martić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Pirgo'),
    body: `U malom selu na obroncima planine, živio je mali dječak po imenu Pirgo. Pirgo je bio poseban - imao je sposobnost da razgovara sa životinjama i da razumije jezik prirode. Bio je prijatelj svih stvorenja u šumi, i sva stvorenja su ga voljela.

Svaki dan bi Pirgo izlazio u šumu i provodio vrijeme sa svojim prijateljima - medvjedima, vukovima, pticama, i svim drugim životinjama. Zajedno bi se igrali, pričali priče, i dijelili ljubav. Pirgo je naučio da svako stvorenje ima svoju priču i svoju ljubav, i da zajedno možemo stvoriti najljepše trenutke.

Jednog dana, selo je bilo u opasnosti od velikog požara koji se približavao. Ljudi su bili prestrašeni i nisu znali kako da se spase. Ali Pirgo je znao što treba učiniti - pozvao je sve svoje prijatelje iz šume, i zajedno su stvorili veliki zid vode koji je zaustavio požar.

Selo je bilo spašeno, a Pirgo je postao heroj. Ali najvažnije, naučio je da prijateljstvo i ljubav mogu prevladati bilo kakvu opasnost, i da zajedno možemo stvoriti čuda.`,
    isApproved: true,
  },
  {
    title: 'Šestinski kišobran',
    author: 'Nada Iveljić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Šestinski kišobran'),
    body: `U Zagrebu, u čarobnom dijelu grada zvanom Šestine, postojala je legenda o čarobnom kišobranu. Bio je to poseban kišobran koji je mogao zaštititi ne samo od kiše, već i od svih tuga i problema života.

Kišobran je pripadao staroj ženi koja je živjela u maloj kućici na brdu. Žena je bila mudra i dobra, i svakome tko je došao u pomoć, dala bi kišobran da ga zaštiti. Kišobran nije bio običan - bio je čaroban, i mogao je donijeti sreću i radost svakome tko ga je koristio.

Jednog dana, mala djevojčica po imenu Ana je došla u Šestine i izgubila se. Bila je tužna i prestrašena, i nije znala kako da se vrati kući. Stara žena ju je vidjela i dala joj čarobni kišobran.

"Uzmi ovaj kišobran," rekla je žena. "On će te zaštititi i vodi te kući."

Ana je uzela kišobran i odmah se osjećala bolje. Kišobran ju je vodio kroz grad, pokazujući joj put kući. Kada je stigla kući, Ana je shvatila da kišobran nije bio samo čaroban - bio je simbol ljubavi i dobrote koje su ljudi dijelili jedni s drugima.

Od tog dana, Ana je čuvala kišobran i dijelila priču o njemu sa svima. Naučila je da su najljepše stvari u životu one koje dijelimo s drugima, i da ljubav i dobrota mogu zaštititi od bilo koje oluje.`,
    isApproved: true,
  },
  {
    title: 'Koko i duhovi',
    author: 'Ivan Kušan',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Koko i duhovi'),
    body: `U staroj kući na rubu grada, živio je mali mačak po imenu Koko. Koko je bio hrabar i znatiželjan, i volio je istraživati sve kutove kuće. Ali kuća je bila puna duhova - dobrih duhova koji su voljeli Koka i željeli mu pomoći.

Duhovi su bili prijatelji Koka, i zajedno bi se igrali i pričali priče. Koko je naučio da duhovi nisu nešto čega se treba bojati - oni su bili prijatelji koji su voljeli i željeli pomoći. Zajedno su stvarali najljepše trenutke i najljepše priče.

Jednog dana, u kuću je došla nova obitelj koja se bojala duhova. Koko je shvatio da treba pomoći obitelji da razumiju da duhovi nisu opasni, već prijatelji. Zajedno sa duhovima, Koko je pokazao obitelji da su duhovi dobri i da žele pomoći.

Obitelj je naučila da se ne treba bojati duhova, i da su oni prijatelji koji vole i žele pomoći. Od tog dana, kuća je bila puna ljubavi i radosti, a Koko i duhovi su bili najbolji prijatelji.`,
    isApproved: true,
  },
  {
    title: 'Lažeš, Melita',
    author: 'Ivan Kušan',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Lažeš, Melita'),
    body: `U malom selu, živjela je djevojčica po imenu Melita koja je voljela pričati priče. Ali Melita je često preuveličavala svoje priče, i ljudi su joj govorili "Lažeš, Melita!" kada bi pričala nešto što se činilo previše nevjerojatno.

Melita je bila tužna jer nitko nije vjerovao njezinim pričama, čak i kada su bile istinite. Ali Melita nije odustala - nastavila je pričati svoje priče, znajući da su one bile istinite i da su bile važne.

Jednog dana, Melita je pričala priču o čarobnom vrtu gdje je raslo cvijeće koje je moglo izliječiti bilo koju bolest. Nitko joj nije vjerovao, ali Melita je znala da je priča istinita. Odlučila je pronaći vrt i dokazati da je priča istinita.

Melita je putovala daleko i široko, i konačno je pronašla čarobni vrt. Vrt je bio prekrasan, pun cvijeća koje je blistalo poput zvijezda. Melita je uzela cvijeće i vratila se u selo, gdje je izliječila bolesnog dječaka koji je bio na samrti.

Od tog dana, ljudi su počeli vjerovati Melitinim pričama. Naučili su da ponekad najnevjerojatnije priče su one koje su najistinitije, i da hrabrost i upornost mogu prevladati bilo kakvu sumnju.`,
    isApproved: true,
  },
  {
    title: 'Dječak i šuma',
    author: 'Anđelka Martić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Dječak i šuma'),
    body: `U malom selu na rubu velike šume, živio je mali dječak po imenu Marko. Marko je volio šumu više od bilo čega na svijetu - volio je njezine zvukove, njezine boje, i njezine tajne. Svaki dan bi izlazio u šumu i provodio sate istražujući njezine dubine.

Šuma je bila Markov najbolji prijatelj. Znala je sve njegove tajne, sve njegove snove, i sve njegove tuge. Kada bi Marko bio tužan, šuma bi ga tješila svojim zvukovima. Kada bi bio sretan, šuma bi dijelila njegovu radost.

Jednog dana, Marko je čuo da šuma treba pomoć - ljudi su htjeli posjeći drveće i uništiti šumu. Marko je bio prestrašen i nije znao kako da pomogne. Ali šuma mu je rekla: "Ne brini, mali Marko. Zajedno možemo sve. Tvoja ljubav prema meni je dovoljna da me zaštitiš."

Marko je shvatio da treba djelovati. Pozvao je sve ljude iz sela i pričao im o ljepoti i važnosti šume. Ljudi su slušali i shvatili da šuma nije samo drveće - šuma je živ organizam pun ljubavi i života.

Od tog dana, šuma je bila zaštićena, a Marko je postao njezin čuvar. Naučio je da ljubav i hrabrost mogu prevladati bilo kakvu opasnost, i da zajedno možemo zaštititi ono što volimo.`,
    isApproved: true,
  },
  {
    title: 'Pisac i princeza',
    author: 'Sunčana Škrinjarić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Pisac i princeza'),
    body: `U dalekom kraljevstvu, živio je mladi pisac po imenu Luka koji je volio pričati priče. Njegove priče su bile tako lijepe da su mogli osvijetliti i najtamnije noći i donijeti radost u najtužnija srca. Luka je bio jednostavan čovjek, ali imao je dar da vidi ljepotu u svemu što ga okružuje.

Jednog dana, Luka je čuo da je princeza kraljevstva tužna i da nitko ne može donijeti osmijeh na njezino lice. Luka je odlučio pomoći - napisao je najljepšu priču koju je ikada napisao, priču o ljubavi, prijateljstvu, i čarobnosti života.

Kada je princeza pročitala priču, njezino se lice osvijetlilo osmijehom. Priča joj je donijela radost i nadu, i princeza je shvatila da život može biti lijep i čaroban. Odlučila je upoznati pisca koji je napisao tako lijepe riječi.

Kada su se Luka i princeza upoznali, zaljubili su se na prvi pogled. Njihova ljubav je bila tako jaka da je mogla prevladati bilo kakvu prepreku. Zajedno su živjeli sretno, dijeleći priče i ljubav sa svima u kraljevstvu.

Njihova priča je postala legenda, priča o ljubavi koja se nalazi kroz riječi, o ljubavi koja donosi radost i nadu, i o ljubavi koja traje zauvijek.`,
    isApproved: true,
  },
  {
    title: 'Slikar u šumi',
    author: 'Sunčana Škrinjarić',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Slikar u šumi'),
    body: `U malom selu, živio je mladi slikar po imenu Petar koji je volio slikati prirodu. Svaki dan bi izlazio u šumu sa svojim platnom i bojama, i slikao ljepotu koja ga je okruživala. Njegove slike su bile tako lijepe da su mogli osvijetliti i najtamnije sobe.

Jednog dana, Petar je došao u šumu i vidio prekrasan cvijet koji nikada prije nije vidio. Cvijet je bio tako lijep da je Petar odmah poželio naslikati ga. Ali kada je počeo slikati, shvatio je da cvijet nije običan - bio je čaroban, i mogao je govoriti.

"Tko si ti?" upitao je cvijet.

"Ja sam čarobni cvijet," odgovorio je cvijet. "Mogu ti pomoći da naslikaš najljepšu sliku koju si ikada naslikao, ali samo ako mi obećaš da ćeš zaštititi šumu i sve što u njoj živi."

Petar je obećao, i cvijet mu je dao posebne boje koje su blistale poput zvijezda. Petar je naslikao najljepšu sliku koju je ikada naslikao - sliku šume punu ljubavi i života.

Od tog dana, Petar je postao čuvar šume, a njegove slike su postale legende. Naučio je da ljepota nije samo u onome što vidimo, već u onome što osjećamo i volimo.`,
    isApproved: true,
  },
  {
    title: 'Ptičji festival',
    author: 'Zlata Kolarić-Kišur',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Ptičji festival'),
    body: `Svake godine, u čarobnoj šumi, održavao se veliki ptičji festival. Bile su to najljepše proslave u cijelom svijetu - ptice iz svih krajeva bi dolazile da pjevaju, plešu, i dijele radost. Festival je bio pun ljubavi, prijateljstva, i najljepših pjesama koje su se mogli čuti.

Jednog dana, mala djevojčica po imenu Sara je čula o festivalu i željela ga posjetiti. Ali Sara nije znala kako da dođe do šume - bila je daleko i opasna. Ali Sara nije odustala - odlučila je pronaći put do šume i doživjeti čarobni festival.

Sara je putovala daleko i široko, i konačno je stigla do šume. Kada je ušla u šumu, vidjela je najljepši prizor koji je ikada vidjela - tisuće ptica koje su pjevale, plešale, i dijelile radost. Sara je bila oduševljena i odmah se pridružila proslavi.

Od tog dana, Sara je postala prijateljica svih ptica, a festival je postao još ljepši. Naučila je da hrabrost i upornost mogu dovesti do najljepših trenutaka, i da prijateljstvo može nastati između bilo koga - čak i između djevojčice i ptica.`,
    isApproved: true,
  },
  {
    title: 'Mačak Džingiskan i Miki Trasi',
    author: 'Vesna Parun',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Mačak Džingiskan i Miki Trasi'),
    body: `U malom selu, živjeli su dva mačka - Džingiskan i Miki Trasi. Džingiskan je bio hrabar i avanturistički, volio je istraživati i otkrivati nove stvari. Miki Trasi je bio pametan i mudar, volio je čitati i učiti. Bili su najbolji prijatelji, i zajedno su proživjeli mnoge avanture.

Jednog dana, Džingiskan i Miki Trasi su čuli da je u selu nestao mali dječak. Dječak se zvao Marko i bio je najdraži dječak u selu. Svi su bili prestrašeni i nisu znali kako da ga pronađu.

Džingiskan i Miki Trasi su odlučili pomoći. Koristeći Džingiskanovu hrabrost i Miki Trasijevu mudrost, krenuli su u potragu za Markom. Putovanje je bilo opasno i teško, ali Džingiskan i Miki Trasi su bili uporni i hrabri.

Konačno su pronašli Marka - bio je izgubio se u šumi i nije znao kako da se vrati kući. Džingiskan i Miki Trasi su ga vratili sigurno kući, i Marko je bio sretan što je vidio svoje prijatelje.

Od tog dana, Džingiskan i Miki Trasi su postali heroji sela, a njihova prijateljstvo je postalo još jače. Naučili su da zajedno mogu prevladati bilo kakvu prepreku, i da prijateljstvo i hrabrost mogu donijeti najljepše trenutke.`,
    isApproved: true,
  },
  {
    title: 'Ivica i Marica',
    author: 'Hrvatska verzija',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Ivica i Marica'),
    body: `U malom selu, živjela je obitelj koja je bila siromašna ali sretna. Imali su dvoje djece - Ivica i Marica. Bili su najbolji prijatelji i uvijek su bili zajedno. Njihova ljubav i zajedništvo činili su ih najsretnijom djecom u selu.

Jednog dana, njihova obitelj je bila u velikoj nevolji - nisu imali hrane i nisu znali kako da prežive. Roditelji su bili tužni i nisu znali što da rade. Ali Ivica i Marica nisu odustali - odlučili su pomoći svojoj obitelji.

Ivica i Marica su krenuli u šumu da skupljaju hranu. Putovanje je bilo opasno i teško, ali Ivica i Marica su bili uporni i hrabri. Zajedno su prevladali sve prepreke i pronašli dovoljno hrane za svoju obitelj.

Kada su se vratili kući, njihova obitelj je bila sretna i zahvalna. Ivica i Marica su naučili da zajedno mogu prevladati bilo kakvu prepreku, i da ljubav i hrabrost mogu donijeti najljepše trenutke. Od tog dana, obitelj je živjela sretno, znajući da zajedno mogu sve.`,
    isApproved: true,
  },
  {
    title: 'Snjeguljica i sedam patuljaka',
    author: 'Hrvatska verzija',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Snjeguljica i sedam patuljaka'),
    body: `U dalekom kraljevstvu, živjela je prekrasna princeza po imenu Snjeguljica. Bila je to najljepša djevojka u cijelom kraljevstvu, s kožom bijelom poput snijega, kosom crnom poput ebonita, i usnama crvenim poput ruže. Ali Snjeguljica je imala zlu maćehu koja je bila ljubomorna na njezinu ljepotu.

Zla maćeha je pokušala ubiti Snjeguljicu, ali Snjeguljica je pobjegla u šumu. U šumi je srela sedam patuljaka koji su je primili u svoj dom. Patuljci su bili dobri i ljubazni, i brzo su zavoljeli Snjeguljicu.

Snjeguljica je živjela sretno sa patuljcima, ali zla maćeha je saznala gdje je i pokušala je ubiti ponovno. Ali Snjeguljica je bila pametna i hrabra, i uz pomoć patuljaka, prevladala je zlu maćehu.

Na kraju, Snjeguljica je srela svog princa i živjela sretno zauvijek. Naučila je da dobrota i ljubav mogu prevladati bilo kakvo zlo, i da prijateljstvo i zajedništvo mogu donijeti najljepše trenutke.`,
    isApproved: true,
  },
  {
    title: 'Crvenkapica',
    author: 'Hrvatska verzija',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Crvenkapica'),
    body: `U malom selu, živjela je mala djevojčica koja je uvijek nosila crvenu kapu. Zvali su je Crvenkapica, i bila je najdraža djevojčica u selu. Crvenkapica je volila svoju baku više od bilo čega na svijetu, i svaki dan bi joj donosila hranu i cvijeće.

Jednog dana, Crvenkapica je krenula posjetiti svoju baku koja je živjela u šumi. Putovanje je bilo opasno, ali Crvenkapica je bila hrabra i nije se bojala. Ali u šumi je srela vuka koji je bio zao i opasan.

Vuk je pokušao prevariti Crvenkapicu, ali Crvenkapica je bila pametna i nije se dala prevariti. Uz pomoć lovca koji je čuo njezine pozive za pomoć, Crvenkapica je spasila svoju baku i pobijedila vuka.

Od tog dana, Crvenkapica je naučila da hrabrost i pamet mogu prevladati bilo kakvu opasnost, i da ljubav prema obitelji može donijeti najljepše trenutke.`,
    isApproved: true,
  },
  {
    title: 'Pepeljuga',
    author: 'Hrvatska verzija',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Pepeljuga'),
    body: `U malom selu, živjela je djevojka po imenu Pepeljuga koja je imala zlu maćehu i dvije zle polusestre. Pepeljuga je morala raditi sve poslove u kući, a njezine polusestre su bile lijepe i bogate. Ali Pepeljuga nije odustala - nastavila je raditi i vjerovati da će jednog dana biti sretna.

Jednog dana, kralj je organizirao veliki bal, i sve djevojke u kraljevstvu su bile pozvane. Pepeljuga je željela ići, ali njezina maćeha joj nije dopustila. Ali Pepeljuga je imala čarobnu pomoćnicu - njezina dobra vila koja joj je pomogla da ode na bal.

Na balu, Pepeljuga je srela princa i zaljubili su se. Ali Pepeljuga je morala otići prije ponoći, i ostavila je svoju staklenu papučicu. Princ je pronašao papučicu i tražio djevojku kojoj pripada.

Kada je princ pronašao Pepeljugu, zaljubili su se i živjeli sretno zauvijek. Pepeljuga je naučila da dobrota i ljubav mogu prevladati bilo kakvo zlo, i da snovi se mogu ostvariti ako vjerujemo i ne odustajemo.`,
    isApproved: true,
  },
  {
    title: 'Ruže i zmajevi',
    author: 'Folklorna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Ruže i zmajevi'),
    body: `U davnim vremenima, postojalo je kraljevstvo gdje su ruže rasle svugdje, a zmajevi su letjeli nebom. Bilo je to najljepše kraljevstvo u cijelom svijetu, puno ljubavi, prijateljstva, i čarobnosti. Ruže su bile simbol ljubavi, a zmajevi su bili simbol hrabrosti i snage.

Jednog dana, zli čarobnjak je došao u kraljevstvo i pokušao uništiti sve ruže i sve zmajeve. Kraljevstvo je bilo u opasnosti, i nitko nije znao kako da spasi kraljevstvo. Ali mladić po imenu Marko je odlučio pomoći.

Marko je bio hrabar i mudar, i znao je da ljubav i hrabrost mogu prevladati bilo kakvo zlo. Zajedno sa zmajevima i ružama, Marko je krenuo u borbu protiv zlog čarobnjaka. Borba je bila teška i opasna, ali Marko i njegovi prijatelji su bili uporni i hrabri.

Na kraju, Marko je pobijedio zlog čarobnjaka, a kraljevstvo je bilo spašeno. Ruže su nastavile rasti, zmajevi su nastavili letjeti, a kraljevstvo je bilo još ljepše nego prije. Marko je naučio da ljubav i hrabrost mogu prevladati bilo kakvo zlo, i da zajedno možemo stvoriti najljepše trenutke.`,
    isApproved: true,
  },
  {
    title: 'Vesela lutka i tiha šuma',
    author: 'Originalna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Vesela lutka i tiha šuma'),
    body: `U malom selu, živjela je mala djevojčica po imenu Ana koja je imala najljepšu lutku u cijelom svijetu. Lutka se zvala Vesela, i bila je to najsretnija lutka koju je itko ikada vidio. Vesela je uvijek imala osmijeh na licu i uvijek je donosila radost svima oko sebe.

Jednog dana, Ana i Vesela su krenule u šumu da skupljaju cvijeće. Šuma je bila tiha i mirna, puna ljepote i čarobnosti. Ana i Vesela su uživale u šetnji, ali kada su se vratile kući, shvatile su da su se izgubile.

Ana je bila prestrašena, ali Vesela ju je tješila. "Ne brini, Ana," rekla je Vesela. "Zajedno možemo sve. Naći ćemo put kući."

Ana i Vesela su krenule u potragu za putem kući. Putovanje je bilo opasno i teško, ali Ana i Vesela su bile uporne i hrabre. Zajedno su prevladale sve prepreke i pronašle put kući.

Od tog dana, Ana i Vesela su postale još bolje prijateljice, a njihova ljubav je postala još jača. Ana je naučila da prijateljstvo i hrabrost mogu prevladati bilo kakvu prepreku, i da zajedno možemo stvoriti najljepše trenutke.`,
    isApproved: true,
  },
  {
    title: 'Tintilinčić i tajna livada',
    author: 'Folklorna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Tintilinčić i tajna livada'),
    body: `U čarobnoj livadi, živjelo je malo stvorenje po imenu Tintilinčić. Tintilinčić je bio tako mali da je mogao stati na dlan, ali imao je najveće srce u cijelom svijetu. Bio je prijatelj svih životinja i svih cvijeća, i svi su ga voljeli.

Livada je bila puna tajni - bilo je tamo cvijeće koje je moglo govoriti, životinje koje su mogle pjevati, i drveće koje je moglo pričati priče. Tintilinčić je znao sve tajne livade, i svaki dan bi dijelio priče sa svima koji su dolazili.

Jednog dana, mala djevojčica po imenu Maja je došla u livadu i srela Tintilinčića. Maja je bila fascinirana i odmah se sprijateljila s Tintilinčićem. Zajedno su istraživali livadu i otkrivali sve njezine tajne.

Od tog dana, Maja i Tintilinčić su postali najbolji prijatelji, a livada je postala još ljepša. Maja je naučila da prijateljstvo može nastati između bilo koga, i da zajedno možemo otkriti najljepše tajne svijeta.`,
    isApproved: true,
  },
  {
    title: 'Priča o dobroj vilici',
    author: 'Originalna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Priča o dobroj vilici'),
    body: `U čarobnoj šumi, živjela je dobra vilica po imenu Zora. Zora je bila najljepša vilica u cijeloj šumi, s krilima koja su blistala poput zvijezda i osmijehom koji je mogao osvijetliti cijeli svijet. Zora je volila pomagati svima koji su joj trebali pomoć, i svi su je voljeli.

Svaki dan, Zora bi letjela kroz šumu i tražila one koji su trebali pomoć. Pomaže životinjama koje su bile u nevolji, cvijeću koje je bilo tužno, i ljudima koji su bili izgubljeni. Zora je bila simbol dobrote i ljubavi, i njezina ljubav je osvijetljavala cijelu šumu.

Jednog dana, mala djevojčica po imenu Sara je došla u šumu i izgubila se. Sara je bila prestrašena i nije znala kako da se vrati kući. Ali Zora ju je vidjela i odmah joj pomogla. Zora je vodila Saru kroz šumu i pokazala joj put kući.

Od tog dana, Sara je postala prijateljica Zore, a njihova ljubav je postala još jača. Sara je naučila da dobrota i ljubav mogu prevladati bilo kakvu prepreku, i da zajedno možemo stvoriti najljepše trenutke.`,
    isApproved: true,
  },
  {
    title: 'Putovanje u Mjesečevu špilju',
    author: 'Originalna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Putovanje u Mjesečevu špilju'),
    body: `U dalekom kraljevstvu, postojala je legenda o Mjesečevoj špilji - čarobnom mjestu gdje se mogu pronaći svi izgubljeni snovi i sve izgubljene ljubavi. Mnogi su pokušali pronaći špilju, ali nitko nije uspio. Legenda je govorila da samo onaj s čistim srcem može pronaći put do špilje.

Mladić po imenu Luka je čuo legendu i odlučio pronaći Mjesečevu špilju. Luka je bio dobar i čestit čovjek, s čistim srcem punim ljubavi i nade. Putovanje je bilo opasno i teško, ali Luka nije odustao.

Nakon mnogo dana putovanja, Luka je konačno pronašao Mjesečevu špilju. U špilji je vidio najljepši prizor koji je ikada vidio - tisuće snova koja su blistala poput zvijezda, i sve izgubljene ljubavi koje su čekale da budu pronađene.

Luka je shvatio da Mjesečeva špilja nije mjesto gdje se pronalaze snovi - to je mjesto gdje se uči kako stvarati snove. Naučio je da snovi nisu nešto što se pronalazi, već nešto što se stvara kroz ljubav, hrabrost, i upornost.

Od tog dana, Luka je živio sretno, znajući da snovi se mogu ostvariti ako vjerujemo i ne odustajemo. Njegova priča je postala legenda, priča o snovima koji se mogu ostvariti kroz ljubav i hrabrost.`,
    isApproved: true,
  },
  {
    title: 'Moć prijateljstva',
    author: 'Originalna priča',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Moć prijateljstva'),
    body: `U malom selu, živjela su dva najbolja prijatelja - dječak po imenu Marko i djevojčica po imenu Ana. Bili su prijatelji od najranijeg djetinjstva, i njihova prijateljstvo je bilo najjače u cijelom selu. Zajedno su proživjeli mnoge avanture i dijelili mnoge trenutke radosti i tuge.

Jednog dana, selo je bilo u opasnosti od velikog požara koji se približavao. Svi su bili prestrašeni i nisu znali kako da se spase. Ali Marko i Ana nisu odustali - odlučili su pomoći svom selu.

Zajedno su krenuli u avanturu da spase selo. Putovanje je bilo opasno i teško, ali Marko i Ana su bili uporni i hrabri. Koristeći svoju prijateljsku snagu, prevladali su sve prepreke i pronašli način da spase selo.

Kada su se vratili u selo, svi su bili sretni i zahvalni. Marko i Ana su naučili da prijateljstvo može prevladati bilo kakvu prepreku, i da zajedno možemo stvoriti najljepše trenutke. Njihova priča je postala legenda, priča o prijateljstvu koje je jače od bilo koje oluje.`,
    isApproved: true,
  },
  // Disney stories in Croatian
  {
    title: 'Kralj Lavova',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Kralj Lavova'),
    body: `U dalekoj afričkoj savani, gdje sunce svijetli svaki dan i gdje životinje žive u miru, živio je mali lavić po imenu Simba. Simba je bio sin velikog kralja Mufase, najhrabrijeg i najmudrijeg kralja svih životinja u savani. Mufasa je učio Simbu sve što mora znati budući kralj, jer jednog dana Simba će postati kralj cijele savane.

Simba je bio jako znatiželjan mali lavić koji je volio istraživati. Jednog dana, Simba i njegova najbolja prijateljica Nala otišli su u zabranjenu zemlju, gdje su živjeli opasni hijeni. To je bio veliki problem, jer hijeni nisu bili dobri i mogli su povrijediti male laviće.

Simbin stric Scar, koji nije volio Simbu ni Mufasu, planirao je zlu stvar. Želio je postati kralj umjesto Mufase. Jednog dana, kada je Mufasa spašavao Simbu iz opasne situacije, Scar je napravio nešto jako zlo i Mufasa je umro.

Simba je bio jako tužan i mislio je da je kriv za očevu smrt. Scar mu je rekao da bježi i da se nikada ne vraća. Simba je pobjegao daleko, daleko, i na putu je sreo dva prekrasna prijatelja - surkata Timona i vratara Pumbu. Timon i Pumba su bili jako veseli i učili su Simbu da život može biti jednostavan i sretan ako se ne brinete o ničemu.

Prošlo je puno godina i Simba je odrastao u snažnog mladog lava. Ali u njegovom srcu još uvijek je bila tuga i strah od vraćanja kući. Tada je došla Nala, Simbina stara prijateljica. Rekla mu je da se Scar vladaju zlo i da životinje u savani trebaju pomoć.

Nala je pokušala nagovoriti Simbu da se vrati, ali Simba se bojao. Tada se pojavio duh Mufase, Simbin otac, koji mu je rekao: "Simba, ti si moj sin i jedini pravi kralj. Ne možeš bježati od onoga tko si. Moras se vratiti i braniti svoj narod."

Simba je shvatio da mora biti hrabar. Vratio se u savanu sa svojim prijateljima i suprotstavio se zlu Scaru. Bila je to velika borba, ali Simba je bio hrabar i mudar, baš kao njegov otac. Na kraju je pobijedio Scar i postao pravi kralj savane.

Od tog dana, Simba je vladao sa mudrošću i ljubavlju, učio je mlade životinje važnosti hrabrosti, prijateljstva i ljubavi prema domovini. Naučio je da je prava hrabrost u tome da branimo one koje volimo i da nikada ne odustajemo od onoga u što vjerujemo.`,
    isApproved: true,
  },
  {
    title: 'Mala Sirena',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Mala Sirena'),
    body: `Duboko, duboko u moru, u čarobnom podvodnom kraljevstvu koje se zove Atlantika, živjela je mala sirena po imenu Ariel. Ariel je bila najmlađa kći kralja Tritona, kralja svih mora. Bila je to prekrasna sirena s dugom crvenom kosom koja je plivala kao riba u vodi i imala najljepši glas u cijelom oceanu.

Ariel je bila jako znatiželjna o svijetu ljudi koji žive na kopnu. Voljela je skupljati predmete iz brodoloma - vilice, čaše, ogrlice i sve što bi našla na dnu mora. Njezina najbolja prijateljica bila je morska ribica po imenu Flounder, mala žuta ribica koja je uvijek bila tamo za nju.

Ali Arielin otac kralj Triton nije volio da Ariel misli o ljudima. Mislio je da su ljudi opasni i da treba ostati u moru. Ali Ariel nije mogla prestati razmišljati o svijetu iznad vode, o suncu, oblacima i ljudima koji žive na kopnu.

Jednog dana, Ariel je vidjela lijepog princa po imenu Eric na njegovom brodu. Zaljubila se u njega na prvi pogled. Ali tada se dogodila oluja i princ Eric je pao u more. Ariel ga je spasila i odvela ga na obalu. Ali kao sirena, nije mogla ostati s njim na kopnu.

Tada se pojavila zla morska vještica po imenu Ursula. Ursula je bila jako zla i željela je vladati morem. Ponudila je Arieli čaroliju koja će joj omogućiti da postane čovjek, ali uz cijenu - Ariel mora dati Ursuli svoj glas, najljepši glas u oceanu. I mora poljubiti princa Erika za tri dana, inače će postati dio Ursuline zbirke.

Ariel je pristala, jako je željela biti s Ericom. Dobila je noge umjesto repa, ali izgubila je glas. Sada je mogla hodati, ali nije mogla pjevati niti govoriti. Prinč Eric ju je primio u svoj dvorac, ali nije znao da je ona ta koja ga je spasila.

Tri dana su prošla jako brzo. Ursula se pretvorila u lijepu djevojku s Arielinim glasom i pokušala zavesti princa Erika. Ali Ariel je uspjela razotkriti Ursulu i princ Eric je shvatio tko je prava Ariel.

Ali bilo je prekasno - Ariel je postala morska vještica u Ursulinoj zbirci. Ali princ Eric nije odustao. Napao je Ursulu i spasio Ariel. Kralj Triton, koji je vidio koliko Ariel voli Erika, pretvorio je Ariel u čovjeka zauvijek, jer je shvatio da je ljubav najvažnija stvar na svijetu.

Od tog dana, Ariel i Eric živjeli su sretno zajedno, i Ariel je mogla ići u more kad god je htjela, jer je imala i noge za kopno i rep za more. Naučila je da su najvažnije stvari u životu hrabrost, ljubav i nikada ne odustajati od svojih snova.`,
    isApproved: true,
  },
  {
    title: 'Ljepotica i Zvijer',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Ljepotica i Zvijer'),
    body: `U malom francuskom selu, davno prije, živjela je prekrasna djevojka po imenu Belle. Belle je bila posebna jer je voljela čitati knjige više od svega. Dok su druge djevojke razgovarale o ljepoti i odjeći, Belle je čitala priče o čarobnim mjestima i avanturama. Njezin otac Maurice bio je izumitelj koji je pravio čudne strojeve koji nikada nisu radili kako treba, ali Belle ga je voljela jer je bio dobar i brižan.

Jednog dana, Maurice je otišao na sajam s jednim od svojih izuma. Na putu se izgubio i došao do velikog, mračnog dvorca okruženog ogradom. Ušao je unutra tražeći pomoć, ali našao je prijezir i hladnoću. Vlasnik dvorca bio je čudovište - velika zvijer koja je bila jako ljuta i samoživa.

Zvijer je zatvorila Mauricea u tamnicu jer je ušao u dvorac bez dopuštenja. Belle je brzo saznala što se dogodilo i odlučila spasiti svog oca. Otišla je u dvorac i ponudila sebe umjesto oca da ostane u dvorcu kao zarobljenica.

Zvijer je pristala, ali Belle nije bila zarobljenica dugo. Dvorac je bio čaroban - živi namještaj koji je govorio i kretao se, čajnice koje su plesale i šalice koje su pjevale. Ali Zvijer je bila ljuta i samoživa, vikala je i prijetila svima oko sebe.

Ali Belle nije bila prestrašena. Bila je dobra i ljubazna prema svima u dvorcu, čak i prema Zvijeri. Postepeno, Zvijer je počela mijenjati. Vidjela je da Belle nije kao drugi ljudi koji su bili zli i pohlepni. Belle je bila dobra, hrabra i znala je vidjeti ljepotu u svemu, čak i u Zvijeri.

Svaki dan, Belle i Zvijer bi provodili vrijeme zajedno. Čitali bi knjige, jeli zajedno, i razgovarali o svemu. Postepeno, Zvijer se pretvorila iz zlog čudovišta u dobrog prijatelja. Belle je shvatila da Zvijer nije stvarno zla - samo je bila usamljena i tužna i potrebno joj je bilo prijateljstvo.

Kada je Belle vidjela da joj otac treba pomoć, Zvijer ju je pustila da ide. Ali Belle se vratila jer je voljela Zvijer i znala je da joj treba pomoć. Tada su zli ljudi napali dvorac, ali Belle i Zvijer zajedno su ih pobijedili.

Kada je Zvijer bila ranjena, Belle ju je poljubila i rekao joj kako je voli. Tada se dogodila čarolija - Zvijer se pretvorila u lijepog princa! Ispostavilo se da je princ bio proklet jer nije bio dobar, ali sada kada je našao pravu ljubav, čarolija je bila slomljena.

Od tog dana, Belle i princ živjeli su sretno zajedno u dvorcu, a Belle je naučila da prava ljepota nije u tome kako netko izgleda, već u tome kako se ponaša i koliko dobrota i ljubavi ima u srcu. Naučila je da nikada ne treba suditi nekome po izgledu, već po srcu.`,
    isApproved: true,
  },
  {
    title: 'Aladin',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Aladin'),
    body: `U čarobnom gradu Agrabah, u dalekoj arapskoj zemlji, živio je mladi lopov po imenu Aladdin. Aladdin nije imao ništa - nije imao kuću, ni novac, ni hranu. Živio je na ulicama s majmunom po imenu Abu i krao je hranu da bi preživio. Ali unatoč tome, Aladdin je bio dobar čovjek - dijelio je ono što je imao s drugima i pomagao onima kojima je trebalo pomoći.

Jednog dana, Aladdin je vidio lijepu princezu po imenu Jasmine. Jasmine je živjela u palači, ali nije bila sretna jer nije mogla biti slobodna i morala je udati se za nekog koga ne voli. Aladdin i Jasmine zaljubili su se na prvi pogled, ali nisu mogli biti zajedno jer je Aladdin bio siromašan lopov, a Jasmine bila princeza.

Tada se pojavio zli vezir Jafar, koji je želio vladati kraljevstvom. Jafar je saznao da postoji čarobna špilja puna blaga, ali samo osoba s "diamantnim srcem" može ući u nju. Jafar je mislio da je to Aladdin jer je bio dobar čovjek unatoč tome što je bio siromašan.

Jafar je natjerao Aladdina da uđe u špilju i donese mu čarobnu svjetiljku. Ali u špilji, Aladdin je našao čarobnu lampu i kada ju je protrljao, pojavio se Džin - ogromno plavo stvorenje koje može ispuniti tri želje.

Džin je bio jako prijateljski i zabavan, ali bio je zarobljen u lampi tisuću godina. Aladdin je oslobodio Džina i postali su prijatelji. Ali Aladdin je bio zbunjen - trebao je dati lampu Jafaru, ali nije želio jer je znao da je Jafar zao.

Aladdin je koristio svoju prvu želju da postane princ, jer je mislio da tako može biti s Jasmine. Postao je bogat princ i došao u palaču, ali Jasmine je vidjela da to nije pravi Aladdin - bio je lažan princ koji pokušava prevariti.

Na kraju, Aladdin je morao biti iskren. Rekao je Jasmine tko je stvarno - siromašan lopov koji je dobio pomoć od Džina. Ali Jasmine ga je i dalje voljela, jer je znala da je pravi Aladdin dobar čovjek u srcu, bez obzira tko je bio.

Tada se pojavio Jafar i ukrao lampu s Džinom. Postao je moćan čarobnjak i pokušao uzeti prijestolje. Ali Aladdin i njegovi prijatelji - Abu, Džin i čarobni tepih - zajedno su pobijedili Jafara. Na kraju, Aladdin je oslobodio Džina iz lampe koristeći svoju posljednju želju, jer je želio da njegov prijatelj bude slobodan.

Od tog dana, Aladdin i Jasmine živjeli su sretno zajedno, a Aladdin je naučio da pravo bogatstvo nije u zlatu ili draguljima, već u prijateljstvu, ljubavi i u tome da budemo dobri prema drugima. Naučio je da je najvažnije biti iskren i biti ono što jesi, a ne pretvarati se da si nešto što nisi.`,
    isApproved: true,
  },
  {
    title: 'Pronalaženje Nema',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Pronalaženje Nema'),
    body: `Duboko u toplim vodama Velikog koraljnog grebena, živjela je mala ribica po imenu Nemo. Nemo je bio posebna mala ribica jer je imao jednu malu peraju koja je bila drugačija od druge - bio je hrabar i znatiželjan, ali njegov otac Marlin bio je jako zabrinut.

Marlin je bio morski klovn, vrsta ribe koja živi u anemoni. Bio je jako zaštitnički prema Nemu jer je Nema majka umrla kada je Nemo bio jajašce. Marlin je uvijek bio zabrinut i nije dopuštao Nemu da ide daleko ili da se igra s drugim ribama. "Okean je opasan, Nemo," govorio bi mu svaki dan. "Moraš ostati blizu doma."

Ali Nemo je bio znatiželjan i želio je istraživati veliki okean. Jednog dana, kada je Marlin bio jako zabrinut i govorio mu da ne ide daleko, Nemo se ljutio. "Nisam bebica!" rekao je ljutito i otplivao daleko od doma, prema velikom brodu koji je plovio na površini.

Ali to je bila velika greška. Ribolovac - čovjek koji lovi ribu - ulovio je Nema u mrežu i odnio ga na brod. Marlin je vidio sve to i užasnuo se. Znao je da mora spasiti svog sina, bez obzira koliko daleko mora plivati.

Tako je započelo najveće putovanje Marlina - plivao je kroz cijeli okean tražeći svog sina. Na putu je sreo prijateljsku, ali malo zaboravnu ribicu po imenu Dory. Dory je imala problema s pamćenjem - zaboravljala je stvari vrlo brzo, ali imala je veliko srce i uvijek je željela pomoći.

Zajedno, Marlin i Dory plivali su kroz opasne vode, izbjegavali morske pse, susreli morske kornjače koje su ih voze, i konačno stigli do Sydneya u Australiji, gdje je Nemo bio zarobljen u akvariju u zubarskoj ordinaciji.

U međuvremenu, Nemo je ušao u akvarij pun drugih riba koje su također bile ulovljene. Bile su tužne jer su željele vratiti se u okean. Nemo je bio hrabar i pomogao im da osmisle plan kako pobjeći iz akvarija i vratiti se u more.

Kada su Marlin i Dory konačno stigli do zubarske ordinacije, Nemo je već bio u akvariju. Marlin je bio tužan jer nije mogao doći do Nema. Ali Nemo je bio pametan - pomogao je Dory da se zapleše u mrežu i tako privuče pažnju ribolovca, dok su ostale ribe pomogle Nemu da pobegne kroz prozor u more.

Na kraju, Marlin i Nemo su se konačno ponovno sjedinili u velikom okeanu. Marlin je shvatio da je Nemo bio hrabar i pametan sve vrijeme, i naučio je da ponekad treba biti hrabar i dopustiti djeci da budu neovisna, ali da se uvijek možemo vratiti jedno drugome.

Od tog dana, Marlin i Nemo živjeli su sretno zajedno, a Dory je postala dio njihove obitelji. Nemo je naučio da je očev zaštitnički stav dolazio iz ljubavi, a Marlin je naučio da povjerenje i hrabrost mogu biti važnije od straha.`,
    isApproved: true,
  },
  {
    title: 'Moana',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Moana'),
    body: `Na prekrasnom otoku Motunui u Tihom oceanu, živjela je hrabra djevojčica po imenu Moana. Moana je bila kći poglavice otoka, što znači da će jednog dana postati vođa svog naroda. Ali Moana je bila posebna - voljela je more više od svega, jako više nego što bi trebala voljeti vladar otoka.

Njezin otac poglavica Tui uvijek joj je govorio: "Moana, more je opasno. Naš narod živi ovdje na otoku, i tu ćemo ostati zauvijek. Ne treba nam more." Ali Moana je osjećala da more zove njezino ime. Svaki dan bi gledala more i sanjala o putovanjima daleko preko horizonta.

Jednog dana, Moana je saznala pravu priču o svom narodu. Nekada davno, njezini preci bili su veliki moreplovci koji su putovali daleko i istraživali različite otoke. Ali tada se bog Maui, polubog koji je imao čarobnu štapinu, ukrao zeleni dragulj od boginje Te Fiti. Te Fiti je bila boginja koja je stvarala živu i koraljne grebene, i kada joj je dragulj ukraden, sve je počelo propadati.

Maui je pokušao pobjeći s draguljem, ali ga je proganjao ogromni lavlji demon po imenu Te Ka. Maui je izgubio svoju čarobnu štapinu i dragulj, a Te Ka je započeo uništavati sve otoke u oceanu, uključujući i Motunui.

Moana je shvatila da mora vratiti dragulj Te Fiti da spasi svoj otok i sve otoke u oceanu. Njezina baka Tala, koja je poznavala stare priče, dala joj je dragulj i rekla: "More te bira, Moana. To je tvoja sudbina."

Tako je Moana krenula u opasno putovanje preko okeana, sama u malom čamcu. Na putu je srela Mavericka, njezinog velikog psa koji ju je pratio, i konačno našla Mauija na malom otoku gdje je živio sam tisuću godina.

Maui nije bio sretan što ga je Moana našla. Bio je ljut i nije želio vratiti dragulj. Ali Moana nije odustala. Dokazala mu je da je hrabra i da može navigirati morem, i natjerala ga da pristane vratiti dragulj zajedno s njom.

Putovanje je bilo opasno - suočili su se s Te Ka, ogromnim lavljim demonom koji je bio zapravo Te Fiti bez svog srca. Borili su se protiv njega, ali Moana je shvatila pravu tajnu - Te Ka nije bio demon, bio je Te Fiti koji je izgubio svoje srce.

Moana je vratila dragulj Te Fiti, i sve se vratilo u normalu. Otoci su ponovno procvjetali, koraljni grebeni su bili živi, a Maui je dobio svoju štapinu natrag. Moana se vratila na svoj otok kao heroj i vodio je svoj narod u veliko putovanje preko oceana, vraćajući im njihovo pravo naslijeđe kao moreplovaca.

Od tog dana, Moana je naučila da je najvažnije slušati svoje srce i slijediti svoju sudbinu, čak i kada drugi kažu da je to nemoguće. Naučila je da hrabrost, upornost i ljubav prema domovini mogu dovesti do najvećih uspjeha.`,
    isApproved: true,
  },
  {
    title: 'Priča o Igračkama',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Priča o Igračkama'),
    body: `U sobi malog dječaka po imenu Andy živjelo je mnogo igračaka. Igračke nisu bile obične igračke - one su bile žive kada ljudi nisu gledali! Kada bi ljudi otišli iz sobe, igračke bi se probudile i živjele svoje živote puni avantura i zabave.

Andy je imao mnogo igračaka, ali najvažnija igračka bila mu je sheriff Woody - cowboy lutka koja je bila vođa svih igračaka. Woody je bio hrabar, mudar i uvijek je pazilo na sve ostale igračke. Bio je Andyjev najdraža igračka i sve ostale igračke su ga voljele i poštovale.

Ali jednog dana, na Andyjev rođendan, dogodilo se nešto što je promijenilo sve. Andy je dobio novu igračku - Space Ranger Buzz Lightyear, široka akcijska figura koja je mogla letjeti i imala je lasere. Buzz je bio najnovija i najmodernija igračka, i Andy ga je odmah zavolio.

Woody je bio ljubomoran. Mislio je da će Andy zaboraviti na njega i da će Buzz biti njegov najbolji prijatelj umjesto Woodyja. Woody je pokušao pokazati da je još uvijek važan, ali sve je išlo loše i slučajno je gurnuo Buzza kroz prozor.

Tada su se dogodile velike nevolje. Buzz i Woody su završili u kući zlog susjeda Sida, dječaka koji je volio uništavati igračke. U Sidovoj sobi bile su strašne igračke - igračke koje je Sid napravio kombiniranjem različitih dijelova. Bile su opasne i htjele su ubiti Buzz i Woody.

Ali Woody i Buzz su radili zajedno i uspjeli su pobjeći iz Sidove kuće. Na putu natrag u Andyjevu sobu, Woody i Buzz su postali prijatelji. Woody je shvatio da ne mora biti ljubomoran na Buzz, i Buzz je shvatio da je igračka i da je to u redu - ne mora biti pravi Space Ranger da bude poseban.

Kada su se vratili kući, Andy je bio jako sretan što ih je našao. Od tog dana, Woody i Buzz postali su najbolji prijatelji i zajedno su pazili na sve ostale igračke u Andyjevoj sobi.

Woody je naučio da prava ljubav nije u tome da si jedini važan, već u tome da dijeliš ljubav s drugima. Naučio je da prijateljstvo može nastati između bilo koga, čak i između dvije igračke koje su na početku bile neprijatelji. I naučio je da je najvažnije raditi zajedno i pomagati jedno drugome.`,
    isApproved: true,
  },
  {
    title: 'Coco',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Coco'),
    body: `U malom meksičkom selu, živjela je obitelj Rivera koja je vodila obrt za izradu cipela. Ali u toj obitelji bila je velika tajna - nitko nije smio svirati glazbu ili pjevati, jer je glazba bila zabranjena u kući već mnogo godina.

Mladi dječak po imenu Miguel želio je više od svega postati glazbenik, baš kao njegov heroj Ernesto de la Cruz, najslavniji glazbenik u Meksiku. Miguel je volio gitaru i pjevati, ali njegova obitelj mu nije dopuštala. "Glazba je prokletstvo u ovoj obitelji," govorili su mu. "Naš pradjed je bio glazbenik i napustio je obitelj zbog glazbe. Od tada nismo dozvolili glazbu."

Ali Miguel nije mogao prestati voljeti glazbu. Svake večeri bi se skrivao u sobi i slušao glazbu Ernesta de la Cruza, sanjajući da jednog dana postane veliki glazbenik kao on.

Jednog dana, na Dan mrtvih, poseban dan kada Meksikanci slave svoje preminule voljene osobe, Miguel je pokušao uzeti gitaru iz Ernestove grobnice. Ali kada je to učinio, dogodila se čarolija - Miguel je mogao vidjeti i razgovarati s mrtvima!

Saznao je da je u svijetu mrtvih, gdje žive svi preminuli ljudi. Tamo je sreo svoje preminule rođake koji su mu rekli da mora vratiti se u svijet živih prije zore, inače će zauvijek ostati mrtav. Ali da bi se vratio, netko iz obitelji mora mu dati blagoslov.

Miguel je tražio svoju prabaku Coco i ostale rođake u svijetu mrtvih, ali nitko mu nije želio dati blagoslov jer nije htio odustati od glazbe. Tada je sreo Hectora, prijateljskog duha koji je pomogao Miguelu pronaći Ernest de la Cruza, jer je Miguel mislio da je Ernesto njegov pradjed.

Hector i Miguel krenuli su u pustolovinu kroz svijet mrtvih, pronalazeći Ernest. Ali kada su ga konačno našli, Miguel je saznao strašnu istinu - Ernesto je ukrao pjesme od Hectora i ubio ga tako da bi postao slavan. A Hector je zapravo bio Miguelov pravi pradjed, a ne Ernesto!

Na kraju, Miguel i Hector zajedno su razotkrili istinu o Ernestu i spasili obitelj Rivera od zaborava. Miguel se vratio u svijet živih i pjevao je pjesmu svojoj stara baki Coco, što je pomoglo njoj da se sjeti svog oca Hectora.

Od tog dana, obitelj Rivera dozvolila je glazbu u kući, jer su shvatili da je glazba dio njihove obitelji i njihove povijesti. Miguel je mogao svirati gitaru i pjevati koliko god je htjelo, a obitelj je naučila da je važno čuvati sjećanja na one koje volimo, jer dok ih se sjećamo, oni žive u našim srcima zauvijek.`,
    isApproved: true,
  },
  {
    title: 'Čarobna Obitelj Madrigal',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Čarobna Obitelj Madrigal'),
    body: `U magičnom kolumbijskom gradu sakrivenom u planinama, živjela je posebna obitelj po imenu Madrigal. Obitelj Madrigal bila je posebna jer su svi članovi obitelji imali čarobne moći - osim jedne djevojčice po imenu Mirabel.

Mirabelina obitelj živjela je u čarobnoj kući koja je bila živa - kuća je mogla kretati prozore i vrata, stvarati stepenice i pomagati obitelji u svakodnevnom životu. Kuća je bila čarobna jer je prije mnogo godina prabaka Alma dobila magičnu svijeću koja je dala cijeloj obitelji posebne moći.

Svi u obitelji su imali posebne darove. Mirabelina starija sestra Luisa bila je najjača osoba na svijetu - mogla je podići bilo što, čak i cijele kuće. Druga sestra Isabela mogla je stvarati najljepše cvijeće i biljke samo zamislim. Mirabelin brat Camilo mogao se pretvoriti u bilo koga koga je želio. Majka Julieta mogla je liječiti bilo koga hranom koju je skuhala. Stričevi i tete također su imali posebne moći - mogli su kontrolirati vremenske prilike, razgovarati sa životinjama, i puno više.

Ali Mirabel nije imala nikakvu moć. Kada je bila mala i došao je njezin dan da dobije dar, ništa se nije dogodilo. Bila je jedina u obitelji bez magije, i često se osjećala kao da ne pripada.

Ali Mirabel nije odustala. Voljela je svoju obitelj i željela je pomoći, čak i bez magije. Bila je hrabra, pametna i uvijek spremna pomoći drugima.

Jednog dana, Mirabel je primijetila da se čarobna kuća počela raspadati. Stakla su pucala, zidovi su pucali, a sve magične moći u obitelji počele su nestajati. Nitko nije znao zašto se to događa, osim Mirabel.

Mirabel je otkrila da je prabaka Alma, koja je vodila obitelj, bila previše zaštitnička i nije dopuštala obitelji da budu ono što su stvarno bili. Svi su pokušavali biti savršeni i skrivati svoje probleme, što je uzrokovalo da magija nestaje.

Mirabel je pomogla svojoj obitelji da shvati da su svi posebni na svoj način, čak i ona koja nema magiju. Pomogla je svojoj sestri Isabeli da prizna da ne želi biti savršena, već da želi biti ono što jest. Pomogla je bratu Antoniju da shvati da može razgovarati sa životinjama na svoj način.

Na kraju, Mirabel je spasila čarobnu kuću tako što je pobjegla od Abuela Alme i pokazala joj da se trebaju voljeti takvi kakvi jesu, a ne pokušavati biti savršeni. Kuća je ponovno izgrađena, ali ovaj put svi su imali pravu magiju - magiju ljubavi, prihvaćanja i biti ono što jesi.

Od tog dana, Mirabel je shvatila da je njezin dar bio što je bila - hrabra, ljubazna i spremna pomoći drugima bez magije. Naučila je da je prava magija u ljubavi i prihvaćanju, a ne u posebnim moćima. I obitelj je naučila da je najvažnije biti ono što jesi i voljeti jedno drugo bez obzira na sve.`,
    isApproved: true,
  },
  {
    title: 'Bambi',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Bambi'),
    body: `U velikoj, prekrasnoj šumi punoj visokog drveća i zelenog lišća, živjela je mala mlada srna po imenu Bambi. Bambi je bio najljepša mala srna koju je šuma ikada vidjela - imao je velike smeđe oči koje su blistale od znatiželje i mekan smeđi kaput s bijelim pjegama.

Kada se Bambi rodio, cijela šuma je slavila. Sve životinje su dolazile da vide malog princa šume, jer je Bambi bio sin Velikog Princa, najhrabrijeg i najmudrijeg jelena u cijeloj šumi. Bambi je rastao u ljubavi i zaštiti svoje majke, koja ga je učila svemu što treba znati o životu u šumi.

Bambi je ubrzo upoznao svoje prijatelje - malog zečića Thumpera, koji je uvijek lupao nogom kada je bio uzbuđen, i skunka Flowera, koji je bio stidljiv ali jako drag. Zajedno su se igrali kroz šumu, trčali kroz livade, i učili sve o životu u prirodi.

Bambi je uživao u svemu što šuma nudi - gledao je kako ptice pjevaju, kako cvijeće cvjeta, i kako lišće pada u jesen. Učio je kako pronaći hranu, kako piti vodu iz potoka, i kako biti siguran od opasnosti.

Ali život u šumi nije uvijek bio lako. Jednog dana, Bambi je doživio nešto strašno - čuo je glasni zvuk koji je šumio kroz šumu, i vidio je kako životinje bježe. Bila je to opasnost koju je njegova majka uvijek spominjala - čovjek. Bambi i njegova majka bježali su što su brže mogli, ali njegova majka je ostala zaostala i nikada se više nije vratila.

Bambi je bio jako tužan i osjećao se usamljeno. Ali Veliki Princ, njegov otac, došao je i pomogao mu. "Tvoja majka više ne može biti s tobom," rekao mu je nježno. "Ali ja ću biti tu za tebe. Moramo biti hrabri, Bambi, jer to je ono što čini kralja."

Prošle su godine i Bambi je odrastao u lijepog mladog jelena. Naučio je biti hrabar i mudar, baš kao njegov otac. Jednog dana je sreo lijepu mladu srnu po imenu Faline, i zaljubili su se. Zajedno su trčali kroz šumu i uživali u ljepoti prirode.

Ali opasnost se ponovno vratila - veliki požar je zahvatio šumu i sve životinje su morale bježati. Bambi je bio hrabar i pomagao je drugim životinjama da pobježu, uključujući svoje prijatelje Thumpera i Flowera. Na kraju, zajedno su se uspjeli spasiti.

Kada se požar ugasio i životinje su se vratile u šumu, Bambi je vidio da je šuma počela ponovno rasti. Nova drveća su rastla, novi cvijet je procvjetao, i život se vratio. Bambi je shvatio da život nastavlja, čak i nakon teških trenutaka.

Od tog dana, Bambi je postao Veliki Princ šume, naslijedivši titulu od svog oca. Vodio je životinje u šumi s mudrošću i hrabrošću, i naučio je da je najvažnije biti hrabar, voljeti svoje prijatelje, i štititi domovinu koju volimo.`,
    isApproved: true,
  },
  {
    title: 'Dumbo',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Dumbo'),
    body: `U velikom cirkusu koji putuje kroz Ameriku, živjela je mala slonica po imenu Dumbo. Dumbo je bio poseban, ali ne na način na koji bi htio biti - imao je ogromne, ogromne uši koje su bile mnogo veće nego uši bilo koje druge slonice u cirkusu.

Dumbo je bio jako tužan jer su se sve druge životinje u cirkusu rugale njegovim velikim ušima. "Pogledaj Dumboa!" govorili bi smijući se. "Ima najveće uši koje smo ikada vidjeli!" Dumbo je bio stidljiv i osjećao se kao da ne pripada, jer nije bio kao ostali slonovi.

Ali Dumbo je imao najbolju majku na svijetu - mamu slonicu po imenu Mrs. Jumbo. Mrs. Jumbo je voljela svog sina više od svega na svijetu, bez obzira na njegove velike uši. Svaki put kada bi se netko rugao Dumbo, njegova majka bi ga zaštitila i rekla: "Moj Dumbo je najljepši slon na svijetu, i njegove uši su posebne jer čine ga posebnim."

Ali jedan dan, kada su se dječaci u cirkusu počeli rugati Dumbo i njegovoj majci, Mrs. Jumbo je postala jako ljuta i zaštitila je svog sina. Zbog toga su je ljudi u cirkusu zatvorili u kavez i nazvali je "luda slonica", iako nije bila luda - samo je voljela svog sina.

Dumbo je bio jako tužan jer više nije mogao biti s majkom. Ali tada je sreo malog miša po imenu Timothy Q. Mouse, koji je postao njegov najbolji prijatelj. Timothy je vidio koliko je Dumbo poseban i pomogao mu je da shvati da su njegove velike uši zapravo dar, a ne problem.

"Tvoje uši su tvoj dar, Dumbo," rekao mu je Timothy. "One te čine posebnim, a posebno je dobro!"

Jedne noći, dok su Dumbo i Timothy razgovarali, dogodilo se nešto čarobno. Timothy je dao Dumbo čarobno perje, rekavši mu da će mu donijeti sreću. Ali stvarno čarobno bilo je ono što je Dumbo shvatio - mogao je letjeti pomoću svojih velikih ušiju!

Dumbo je bio iznenađen - mogao je letjeti! Njegove velike uši nisu bile problem - bile su njegov najveći dar! Kada bi mahao ušima, mogao je poletjeti u zrak kao ptica, i to je bilo najljepše osjećanje na svijetu.

Dumbo je počeo vježbati letenje svaki dan, i Timothy mu je pomogao. Zajedno su stvorili najljepši cirkuski nastup koji je itko ikada vidio - Dumbo je letio kroz cirkus kao ptice, a svi su bili oduševljeni.

Kada su ljudi u cirkusu vidjeli kako Dumbo leti, sve se promijenilo. Dumbo je postao najpoznatiji i najvoljeniji slon u cijelom cirkusu. Svi su htjeli vidjeti letećeg slona s velikim ušima, i Dumbo je postao velika zvijezda.

Na kraju, Mrs. Jumbo je oslobođena i mogla je biti s Dumbo ponovno. Oboje su bili sretni, a Dumbo je naučio da je njegova posebnost - velike uši koje omogućuju letenje - zapravo najveći dar koji je dobio.

Od tog dana, Dumbo je naučio da ono što ga činilo drugačijim - velike uši - zapravo ga je činilo posebnim i jedinstvenim. Naučio je da treba biti ponosan na ono što jesi, jer svatko ima svoje darove i posebnosti koje ga čine posebnim. I naučio je da prava prijateljstva i ljubav majke mogu pomoći da prevladamo bilo kakve teškoće.`,
    isApproved: true,
  },
  {
    title: 'Pinokio',
    author: 'Disney',
    country: 'Hrvatska',
    imageUrl: getImageUrl('Pinokio'),
    body: `U malom talijanskom selu, živio je stari drvodelja po imenu Geppetto. Geppetto je bio jako usamljen i želio je sina da dijeli svoju ljubav. Svake večeri bi sjedio u svojoj radionici i pravio igračke za djecu, ali u srcu je želio sina.

Jedne večeri, Geppetto je napravio lijepu lutku od drveta koja je izgledala kao mali dječak. Nazvao ju je Pinokio i učinio je s tolikom ljubavlju da je bio najljepša lutka koju je ikada napravio. Te noći, kada je Geppetto gledao kroz prozor prema zvijezdama, molio se da bi Pinokio mogao biti pravi dječak.

Njegova molitva je uslišena! Plava Vila, dobra čarobnica koja živi među zvijezdama, došla je i oživjela Pinokia. "Geppetto je dobar čovjek i zaslužuje sina," rekla je Vila. "Dat ću ti život, Pinokio, ali moraš biti hrabar, iskren i dobrog srca. Ako budeš dobar dječak, jednog dana ćeš postati pravi dječak od krvi i kostiju."

Ali Vila je također dala Pinokiu posebnog prijatelja - malu zrikavca po imenu Jiminy Cricket, koji će biti Pinokiov savjetnik i pomoći mu da bude dobar. "Slušaj svoju savjest, Pinokio," rekla mu je Vila, pokazujući mu na Jiminyja.

Pinokio je bio oduševljen što je živ! Mogao je razgovarati, hodati, i osjećati. Geppetto je bio najsretniji čovjek na svijetu jer je konačno dobio sina. Ali Pinokio je bio mlad i znatiželjan, i ponekad nije slušao savjet svoje savjesti.

Sljedećeg dana, kada je Pinokio krenuo u školu, sreo je dva zla muškarca - Honest John i Gideon - koji su ga prevrli i rekli mu da može postati glumac i biti slavan umjesto da ide u školu. Pinokio je bio iskušen i pratio ih je u kazalište, ali to je bila greška.

Kazalište je bilo zlo mjesto gdje je zli čovjek po imenu Stromboli držao dječake zarobljene i tjeranja ih da rade za njega. Pinokio je bio zarobljen, ali na sreću, Plava Vila ga je spasila. Ali kada je Vila pitala Pinokia zašto nije išao u školu, Pinokio je lagao, i svaki put kada bi lagao, njegov nos bi narastao!

Jiminy Cricket pokušao je reći Pinokiu da prestane lagati, ali Pinokio je lagao još više i njegov nos je postao tako velik da više nije mogao hodati. Vila mu je rekla da će mu nos ostati tako velik dok ne počne biti iskren.

Pinokio je shvatio svoju grešku i počeo govoriti istinu. Njegov nos se vratio na normalnu veličinu, a Vila mu je rekla da mora biti hrabriji i slušati svoju savjest.

Ali tada su se dogodile nove nevolje. Pinokio je sreo zlog čovjeka po imenu Coachman, koji je vozio dječake na čarobni otok gdje su se mogli zabavljati bez odraslih. Ali taj otok bio je zapravo zamka - dječaci koji su tamo otišli pretvarali su se u magarce i prodavali u radnje!

Pinokio i njegov prijatelj Lampwick otišli su na taj otok i počeli se zabavljati. Ali brzo su se počeli pretvarati u magarce - prvo su dobili repove, zatim uši, a zatim su se potpuno pretvorili u magarce. Pinokio je bio užasnut i pokušao pobjeći, ali već je imao rep i uši magarca!

Kada se Pinokio vratio kući, saznao je da je Geppetto otišao u more tražeći ga i da ga je progutao veliki kit po imenu Monstro. Pinokio je bio hrabar i otišao je u more tražeći svog oca. Ušao je u kitovu utrobu i našao Geppetta.

Zajedno su osmisli plan kako pobjeći - zapalili su vatru unutar kita, što ga je navelo da kihe i ispljunuo je ih. Vraćajući se kući, Pinokio je spašavao Geppetta od utapanja, ali sam je pao u vodu i umro.

Ali Plava Vila je vidjela koliko je Pinokio bio hrabar i iskren. Oživjela ga je i pretvorila u pravog dječaka od krvi i kostiju, jer je pokazao da je stvarno hrabar, iskren i dobar.

Od tog dana, Pinokio je bio pravi dječak i živio je sretno s Geppettom. Naučio je da je važno biti iskren, slušati svoju savjest, i biti hrabar kada treba zaštititi one koje volimo. I naučio je da prava ljubav i hrabrost mogu pretvoriti bilo koga u pravu osobu.`,
    isApproved: true,
  },
]

async function main() {
  console.log('Seeding database with Croatian stories...')
  
  // Check existing stories to avoid duplicates
  const existingStories = dbHelpers.getAllStories()
  const existingTitles = new Set(existingStories.map(s => s.title))
  
  let added = 0
  let skipped = 0
  
  for (const story of stories) {
    try {
      // Skip if story with same title already exists
      if (existingTitles.has(story.title)) {
        console.log(`⊘ Skipped (already exists): ${story.title}`)
        skipped++
        continue
      }
      
      dbHelpers.createStory(story)
      console.log(`✓ Added: ${story.title}`)
      added++
    } catch (error) {
      console.log(`✗ Failed to add ${story.title}:`, error)
    }
  }
  
  console.log(`\nSeeded ${added} new stories, skipped ${skipped} duplicates`)
  console.log(`Total stories in database: ${dbHelpers.getAllStories().length}`)
}

main()
