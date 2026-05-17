-- Apply Croatian-language fixes for two Grigor Vitez stories.
-- Generated 2026-05-17T23:03:38.922Z.
-- Run on the deploy host:
--   docker exec -i fairytale-app sqlite3 /app/data/stories.db < apply-vitez-fixes.sql
BEGIN;
UPDATE stories SET body = 'U davna vremena, usred jedne sunčane i mirisne šume, nalazila se prostrana livada koju su svi stanovnici zvali Zeleni dvor. Na toj su se livadi životinje često sastajale, ali nitko od njih, ni najstariji medvjed ni najbrža vjeverica, nikada nije vidio predmet koji je jednog jutra tamo ostavio zaboravni putnik. Bilo je to malo, okruglo ogledalo sa srebrnim okvirom, koje je ležalo u travi i blještalo na suncu.

Prvi je do ogledala doskakutao zec. Dugim je ušima micao lijevo-desno, njuškajući nepoznati predmet. Kad se nagnuo nad njega, zec se odjednom skamenio. Iz trave ga je gledao isti takav zec, s istom ružičastom njuškicom i dugim ušima.

„Gle ti to!" uzviknuo je zec uzbuđeno. „Pa to je moja slika iz mladih dana! Kako sam samo bio lijep i naočit — a takav sam i sada!" Počeo se ogledavati, namještati uši i diviti se samome sebi, čvrsto držeći ogledalce šapama.

Uto naiđe vjeverica, noseći lješnjak. „Što to imaš, zecu?" upitala je radoznalo. Zec joj ponosno pokaza predmet: „Vidi, moja slika!" Vjeverica proviri preko njegova ramena, ali umjesto zeca, u staklu ugleda kitnjasti rep i bistre oči.

„Lažeš, zecu!" povikala je vjeverica. „Ovo nije tvoja slika, nego moja! Vidi kako mi je krzno sjajno i kako su mi šiljci na ušima uredni. Daj to ovamo, to pripada meni!"

Nastala je prava prepirka. Zec je tvrdio svoje, vjeverica svoje, a buka je privukla i ostale stanare šume. Došetao je trapavi medvjed, doletjela je svraka, a iz grmlja je provirila i lukava lija. Svaka životinja koja bi pogledala u ogledalce vidjela bi sebe, ali bi bila uvjerena da je to njezina osobna slika koju joj drugi žele oteti.

„To je moj djed!" brundao je medvjed gledajući svoj krupni odraz.

„Nije, nego moja tetka iz drugog sela!" kreštala je svraka.

Šumom se prolomila tolika vika da je stari, mudri ćuk morao sići s grane hrasta. „Mir! Tišina!" povikao je ćuk, a životinje su se odmah smirile jer su ga poštovale. Mudri ćuk uze ogledalce, pogleda u njega i nasmija se.

„Dragi moji prijatelji," reče on polako, „nitko od vas nije u pravu, a opet, svi ste u pravu. Ovo nije slika vaših predaka ni vaših rođaka. Ovo je staklo koje pokazuje onoga tko u njega gleda u ovom trenutku. Zecu, kad ti gledaš, vidiš zeca. Medvjede, kad ti gledaš, vidiš sebe. To se zove ogledalo."

Životinje su se zbunjeno pogledale. Polako su, jedna po jedna, ponovno prilazile ogledalu, ali ovaj put bez ljutnje. Shvatile su da staklo ne laže, nego samo vjerno prenosi ono što je ispred njega. Zec se nasmijao svom odrazu, a medvjed je shvatio da mu je njuška zapravo vrlo dopadljiva. Odlučili su ostaviti ogledalce na panju usred livade, kako bi svatko mogao svratiti, zagladiti krzno ili se jednostavno nasmiješiti samome sebi prije nego što nastavi sa svojim šumskim poslovima.', updatedAt = CURRENT_TIMESTAMP WHERE id = '3db6dc76-b5b3-4a36-bf0c-1920e60ac8bb';
UPDATE stories SET title = 'O zecu koji se volio smijati', body = 'Zvonko je bio zec koji se smijao na sve. Na jutarnju rosu. Na sjenu vlastitih ušiju na putu. Na ptice kad bi zamijenile note u pjesmi.

Ostali stanovnici šume su ga trpjeli s osmijehom. Starije životinje su govorile: „Joj, taj Zvonko." Mlađe su trčale za njim tražeći još jednu šalu.

Nitko ga nije upozorio što se krije s one strane potoka.

Jednog poslijepodneva Zvonko je prešao potok jer je čuo da tamo raste najslađa djetelina. Prošao između dva hrasta, preskočio korijen, okrenuo se za ugao — i skoro sletio nosom u sivo krzno nečega ogromnog.

Vuk Bruno bio je velik koliko tri Zvonka i gledao ga je onim mirnim, strpljivim pogledom koji vukovi imaju kad nisu gladni, ali bi mogli postati.

„Zec," rekao je Bruno staloženo. „Ovuda se ne prolazi."

Svi Zvonkovi instinkti su vikali: bježi. Noge su ga već htjele ponijeti. Uši su mu se uspravile. Srce mu je bubnjalo kao da pokušava iskočiti.

Ali nešto — možda glupost, možda hrabrost, a možda su te dvije stvari ponekad iste — zadržalo ga je na mjestu.

„Gospodine vuku," rekao je Zvonko, glasom koji je drhtao samo malo, „znate li zašto je lisica sat nosila u ruci?"

Tišina. Duboka, šumska, vučja tišina.

Bruno je nakrivio glavu. „Što?"

„Jer je čula da će biti kasno."

Vuk je gledao zeca pet cijelih sekundi. A onda se nešto pokrenulo u kutovima njegova ogromnog, ozbiljnog lica — i ispustio je zvuk koji nije bio urlik ni režanje, nego nešto između: kratko, iznenađeno „hah".

Zvonko nije bježao. Rekao je drugu šalu. Onda treću.

Bruno se spustio na prednje šape. Glava mu je bila niže, oči su mu se mijenjale. Ramena su mu se opustila. Nije više gledao kao životinja na lovu. Gledao je kao netko tko nije dugo čuo nešto što mu je nedostajalo.

„Još jednu," rekao je Bruno — i sam se iznenadio vlastitim riječima.

Sjeli su kraj potoka, vuk i zec, i Zvonko je pričao dok sunce nije palo iza drveća. Bruno je slušao, a smijeh koji je ispuštao bio je hrapav i pomalo zaboravljen, kao vrata koja se odavno nisu otvarala. Svaki put kad bi se nasmijao, izgledao je malo manji. I malo lakši.

Kad je Zvonko krenuo kući, Bruno je gledao za njim.

„Zec," rekao je.

Zvonko se okrenuo.

„Sutra možeš proći."

Zvonko se nasmijao — i ovaj put smijao se i za sebe i za Bruna, koji je to naučio tek danas.

Pouka: Smijeh ne otjera strah nikamo — ali ponekad promijeni srce onoga pred kojim se bojiš, i tvoje vlastito.', updatedAt = CURRENT_TIMESTAMP WHERE id = '7ddd9971-7e41-43cb-8224-154c8985cc75';
COMMIT;
