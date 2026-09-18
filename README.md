# Car-Spa Błysk — strona

Strona myjni i studia detailingu **Car-Spa Błysk** z Milicza, zbudowana na podstawie
ich profilu na Facebooku (`facebook.com/profile.php?id=61567613301037`).

Podgląd: `serve.ps1` na porcie **5930** (wpis `car-spa-blysk` w `D:\claude\.claude\launch.json`).

Wersja wielostronicowa. Układ podstron wzięty z `deltadetailing.pl` (strona główna,
usługi, cennik, galeria, o nas, kontakt, polityka prywatności), z tą różnicą, że
usługi są jedną podstroną zamiast jedenastu osobnych.

## Podstrony

| Plik | Co jest na stronie |
|---|---|
| `index.html` | hero z preloaderem, czternaście kafli usług z cenami, „Jak pracuję" (cztery atuty), pas z adresem, pozioma galeria realizacji, „Jak umówić auto", skrót kontaktu bez formularza |
| `uslugi.html` | czternaście usług w czterech grupach (nadwozie i lakier 6, powłoki ceramiczne 4, wnętrze 2, lampy i dach 2), każda z ceną wyjściową, opisem, listą „co wchodzi w zakres" i zdjęciem; kotwice `#mycie`, `#dekontaminacja`, `#polerowanie-1`, `#polerowanie-2`, `#odswiezenie`, `#wosk`, `#lampy`, `#cabrio`, `#ceramika-roczna`, `#ceramika-3lata`, `#ceramika-szyby`, `#ceramika-felgi`, `#wnetrze`, `#wnetrze-fotele` |
| `cennik.html` | czternaście pozycji w czterech grupach, jeden do jednego z podstroną usług; boczna kolumna „co wpływa na cenę" i „jak dostać wycenę" |
| `galeria.html` | dwadzieścia siedem kadrów bez podpisów, z filtrami (nadwozie, wnętrze, felgi, lampy) i podglądem zdjęcia |
| `o-nas.html` | Michał w pierwszej osobie, zakres pracy, sposób umawiania, pas z adresem, pas CTA |
| `kontakt.html` | dane kontaktowe, godziny, **jedyny formularz na stronie**, mapa dojazdu |
| `polityka-prywatnosci.html` | pełna klauzula z danymi firmy; została do wpisania nazwa hostingu, do tego czasu `noindex` |

Nawigacja jest w każdym pliku osobno, bo strona jest statyczna i nie ma etapu budowania.
Pilnuje tego skrypt — patrz „Wspólny nagłówek i stopka" niżej.

### Zasada: strona główna nie powtarza podstron

Do 17 września 2026 blok „Jak umówić auto" i cały formularz kontaktowy stały bajt w bajt
w dwóch miejscach — to była pozostałość po wersji jednostronicowej. Teraz każda sekcja
strony głównej albo jest tam wyłącznie, albo jest skrótem z linkiem dalej:

| Sekcja strony głównej | Relacja do podstron |
|---|---|
| Usługi (14 kafli) | te same nazwy i ceny co `uslugi.html`, ale bez opisów zakresu, list „co wchodzi" i zdjęć; link dalej |
| Jak pracuję (4 atuty) | tylko tutaj |
| Realizacje (pozioma galeria) | ten sam materiał co `galeria.html`, ale inna forma, link dalej |
| Jak umówić auto (3 kroki) | tylko tutaj, usunięte z `o-nas.html` |
| Kontakt | sam numer i dane; formularz jest wyłącznie na `kontakt.html` |

Przy dokładaniu czegokolwiek na stronę główną warto sprawdzić, czy to samo nie stoi już
na podstronie.

## Ton tekstów

**Cała strona mówi w pierwszej osobie liczby pojedynczej.** Firmę prowadzi jedna osoba,
więc „oddzwonimy", „podajemy cenę", „umawiamy się" kłóciło się ze zdaniem, że auto
przechodzi przez jedne ręce. 17 września 2026 przerobione na „oddzwonię", „podaję",
„umawiam się" — łącznie jedenaście miejsc w treści usługowej i jedenaście w polityce
prywatności (tam administratorem jest jednoosobowa działalność, więc „zbieram dane"
jest poprawne). Formy typu „Termin ustalasz telefonicznie" zostają, bo mówią o kliencie,
nie o firmie. **Przy dopisywaniu nowego tekstu trzymaj się liczby pojedynczej.**

Poza tym: żadnych antytez, aforyzmów, potrójnych wyliczeń ani poetyckich nagłówków.
Opis „O nas" przysłany przez klienta był czystym AI slopem („pasja, którą rozwijam
każdego dnia") i został przepisany na konkrety. Przy porównaniach uważaj, żeby nie
nazwać typu auta, którym ktoś jeździ — z akapitu o wycenie wypadło „kombi",
bo zdanie brzmiało jak ocena cudzego samochodu.

## Dane firmy

Michał przysłał je 17 września 2026 (Messenger). Zrzut rozmowy jest w historii sesji.

| Co | Wartość |
|---|---|
| Nazwa | CAR-SPA BŁYSK |
| NIP | 9161407852 |
| Adres | ul. Krotoszyńska 6, 56-300 Milicz |
| Godziny | Poniedziałek – piątek 9:00 – 17:00, weekend nieczynne |
| Telefon | 511 127 795 |
| E-mail, także odbiorca formularza | carspablysk@gmail.com |
| Kto prowadzi | Michał, jednoosobowo; w branży pięć lat, zawodowo ponad dwa |
| Facebook | facebook.com/profile.php?id=61567613301037 |

NIP ma poprawną sumę kontrolną, ale nie ma go na białej liście VAT — firma najpewniej
korzysta ze zwolnienia podmiotowego. Dlatego w danych strukturalnych jest `taxID`,
a nie `vatID`.

Nazwa i NIP idą do stopki na każdej stronie (wymóg art. 5 ustawy o świadczeniu usług
drogą elektroniczną) oraz do klauzuli administratora w polityce prywatności.

### Ceny

Podane jako widełki „od", bez podziału na rozmiary aut:

| Usługa | Cena |
|---|---|
| Mycie zewnętrzne | od 150 zł |
| Mycie zewnętrzne z dekontaminacją | od 250 zł |
| Polerowanie jednoetapowe | od 800 zł |
| Polerowanie dwuetapowe | od 1500 zł |
| Twardy wosk | od 200 zł |
| Renowacja lamp | od 300 zł |
| Powłoka ceramiczna roczna | od 500 zł |
| Powłoka ceramiczna trzyletnia | od 900 zł |
| Powłoka ceramiczna na szyby | od 200 zł |
| Powłoka ceramiczna na fronty felg | od 100 zł |
| Odświeżenie lakieru | od 500 zł |
| Czyszczenie wnętrza | od 400 zł |
| Czyszczenie wnętrza z demontażem foteli i praniem wykładziny | od 600 zł |
| Impregnacja dachu cabrio | od 300 zł |

**Strona pokazuje wyłącznie te czternaście pozycji.** Marcel zdecydował 17 września 2026,
że co nie ma ceny od Michała, tego na stronie nie ma. Tego samego dnia Michał dosłał plik
`car spa blysk.txt` z opisami zakresu i dwiema pozycjami, których wcześniej nie było:
**odświeżeniem lakieru za 500 zł** i **impregnacją dachu cabrio za 300 zł**.

Z pliku wynika też, że **czyszczenie wnętrza za 400 zł obejmuje fotele** („czyszczenie foteli
skórzanych / pranie foteli"). Wcześniejsza wątpliwość, czy pranie dotyczy tylko wykładziny,
jest tym samym zamknięta: wykładzina wchodzi dopiero w wariant za 600 zł, razem z demontażem
foteli i czyszczeniem podsufitki.

### Czego nie ma, a jest na Facebooku

Pierwsza lista dziesięciu usług powstała ze złożenia dwóch źródeł na profilu: sekcji
„Prezentacja" (siedem pozycji) i grafiki w tle profilu (sześć pozycji, częściowo te same).
Po cenniku od Michała na stronie zostały dwie różnice:

- **czyszczenie i impregnacja skór** — jest na grafice w tle profilu, nie ma ceny,
- **pranie kanap i dywanów** — jest na grafice w tle profilu, nie ma ceny.

**Profil na Facebooku obiecuje więc nadal trochę więcej niż strona.** Albo dojdą te dwie
ceny, albo trzeba poprawić grafikę na profilu.

Zmieniły się też nazwy tych samych usług: „Kompleksowe mycie detailingowe" → „Mycie
zewnętrzne" (tak jest zresztą na grafice w tle), „Korekta lakieru" → „Polerowanie
jedno- i dwuetapowe", „Kompleksowy detailing wnętrza" → „Czyszczenie wnętrza",
„Regeneracja lamp" → „Renowacja lamp". Nazwy trzeba trzymać zgodne w czterech miejscach:
`uslugi.html`, `cennik.html`, czternaście kafli na `index.html` oraz lista zakresu
w formularzu na `kontakt.html`. Osobno chodzą **skrócone** nazwy w rozwijanej liście
w nagłówku, jedynym miejscu nawigacyjnym z kompletem usług: „Mycie z dekontaminacją"
zamiast „Mycie zewnętrzne z dekontaminacją", „Powłoka na szyby" zamiast „Powłoka
ceramiczna na szyby", „Wnętrze z demontażem foteli" zamiast „Czyszczenie wnętrza
z demontażem foteli". Kolejność w tej liście jest przeplatana pod układ dwukolumnowy,
więc nie idzie po numerach usług.

**18 września 2026 wyleciała wstęga spod hero i kolumna „Usługi" ze stopki.** Te same
czternaście nazw stało wcześniej na jednym ekranie trzy razy (rozwijana lista, wstęga,
kafle), a na galerii i polityce prywatności — dwa razy, mimo że nie ma tam żadnej usługi.
Rozwijana lista została, bo pozwala skoczyć do konkretnej usługi z dowolnej podstrony;
stopka ma teraz trzy kolumny zamiast czterech i przestała być krzywa.
Podpisów przy zdjęciach już nie ma — zdjęcia
w galerii, w sliderze na stronie głównej i w podglądzie idą bez etykiet, zostały
same `alt`, których klient nie widzi.

## Do uzupełnienia przed publikacją

1. **Nazwa firmy hostingowej** — dwa miejsca `<i class="fill">` w `polityka-prywatnosci.html`.
   To jedyna luka blokująca, bo strona ma do tego czasu `noindex`. Decyzja po stronie
   wykonawcy, nie klienta.
2. ~~Zdjęcia z hali~~ — **zamknięte**. Michał przekazał 17 września 2026 folder
   `C:\Users\marcel\Desktop\car spa błysk` z 57 plikami (54 unikalne po odrzuceniu
   duplikatów). Wszystkie zdjęcia na stronie pochodzą teraz stamtąd, żadne nie jest ze stocku.
3. ~~Logo~~ — **zamknięte**. W tym samym folderze był `LOGO FB.jpg` 1200×1197, dużo lepszy
   od odzyskanego z Facebooka. Nadal nie jest to wektor, ale w tej rozdzielczości wystarcza.
   Zdjęcia dachu cabrio w komplecie nie ma — kafel tej usługi ma neutralny kadr nadwozia,
   warto dosłać właściwe.
4. **Ceny trzech usług z Facebooka** — cabrio, skóry, pranie kanap i dywanów. Do czasu
   ich otrzymania usługi nie istnieją na stronie, mimo że profil je reklamuje.
5. ~~Godziny weekendowe~~ — **zamknięte**. Michał potwierdził 17 września 2026:
   poniedziałek – piątek 9:00 – 17:00, w weekend nieczynne. Godziny stoją w `kontakt.html`,
   w skrócie kontaktu i stopce na `index.html`, w pasie z adresem na `o-nas.html`
   oraz w `openingHoursSpecification` w danych strukturalnych.
6. **Adres rejestrowy** — przyjęty taki sam jak adres hali. Warto sprawdzić z wpisem
   w CEIDG, bo tam nazwa firmy zwykle zawiera też imię i nazwisko właściciela.
7. **Data w polityce prywatności** — ustawiona na 17 września 2026, do podmiany
   na faktyczną datę uruchomienia.
8. **Formularz** — nie wysyła wiadomości. Odbiorcą ma być `carspablysk@gmail.com`;
   adres jest zapisany w komentarzu przy formularzu w `kontakt.html` (to jedyne
   miejsce, gdzie formularz stoi).
   **18 września 2026 zniknął komunikat ze stopki**, który uprzedzał o tym na każdej
   podstronie — Marcel kazał go usunąć. Ostrzeżenie zostało już tylko w jednym miejscu:
   po wysłaniu formularza (`Formularz nie jest jeszcze podpięty pod skrzynkę`,
   funkcja `formularz()` w `js/app.js`). Do tego czasu `kontakt.html` i `o-nas.html`
   nadal obiecują „oddzwonię z terminem", więc **do publikacji trzeba albo podpiąć
   formularz, albo poprawić te zdania** — inaczej klient wypełnia pięć pól i dopiero
   po kliknięciu dowiaduje się, że nic nie poszło.
9. **Wizytówka Google** — sprawdzone 17 września 2026, firma jej nie ma. Trzema
   zapytaniami w Mapach (nazwa, „detailing myjnia Milicz", adres) nie da się jej znaleźć;
   pod Krotoszyńską 6 Google zna tylko biuro geodezyjne. Bez wizytówki nie ma z czego
   zrobić sekcji z opiniami. Przy Krotoszyńskiej 41 jest wizytówka „Błysk – Twój sklep
   z chemią domową" (tel. 696 683 948) — inna branża i inny numer, warto zapytać Michała,
   czy to jego druga działalność.
10. **Opisy usług** — jednozdaniowe opisy i listy „w zakresie" w `uslugi.html` napisałem
    ogólnie. Michał powinien je przejrzeć, zwłaszcza etapy przy polerowaniu i powłokach.

## Skąd wzięte są treści

| Dane | Źródło |
|---|---|
| Nazwa, logo | zdjęcie profilowe z FB (pobrane w 1083 px, tło zdjęte do przezroczystego PNG) |
| Adres `ul. Krotoszyńska 6` | zdjęcie w tle profilu |
| Telefon `511 127 795` | logo + sekcja „Informacje" |
| E-mail `carspablysk@gmail.com` | sekcja „Informacje" |
| Lista 10 usług | sekcja „Prezentacja" + zdjęcie w tle |
| Wszystkie zdjęcia na stronie | folder od Michała z 17 września 2026, 54 unikalne pliki |
| Opisy zakresu usług | plik `car spa blysk.txt` z tego samego folderu |
| Kod pocztowy `56-300` | z Milicza, nie z profilu |

**Żadne zdjęcie na stronie nie jest ze stocku.** Wszystkie pochodzą z folderu od Michała
i pokazują auta, które przeszły przez halę: BMW X5, Audi A4, A5, Q3, RS, Mercedesy GLC,
GLE i A45, Alfę Giulia, Porsche Macan, Cuprę, Golfa GTI, Range Rovera.

### Jak powstały pliki w `img/`

Zdjęcia z telefonu są w HEIC i wszystkie pionowe 3:4 (4284×5712 albo 3024×4032), więc
szerokie kadry — hero, nagłówki podstron, pas z adresem — to poziome pasy wycięte z pionu.

**sharp w tej instalacji czyta metadane HEIC, ale nie rozpakuje pikseli** („Decoder plugin
generated an error"), bo w gotowej paczce nie ma dekodera HEVC. Dekodowanie robi
`heic-convert` (czysty JS, około 3 s na plik), a sharp dopiero skaluje. Skrypty są
w katalogu tymczasowym sesji: `dekoduj.mjs`, `generuj.mjs`, `finisz.mjs`.

| Grupa plików | Rozmiar | Co to |
|---|---|---|
| `hero.webp`, `hero-mobile.webp` | 1800×1500, 900×1100 | BMW X5 w hali |
| `head-*.webp` | 1536×614 | pasy nad podstronami |
| `band.webp` | 1600×900 | pas z adresem, jedyne poziome zdjęcie w komplecie |
| `studio.webp` | 1400×1000 | kokpit Mercedesa GLE, sekcja dwukolumnowa na stronie głównej |
| `regal-felgi.webp` | 1100×1467 | cztery komplety felg przed regałem z chemią (`IMG_4140`), sekcja dwukolumnowa na `o-nas.html`. Jedyne zdjęcie pokazywane w pełnym kadrze 3:4 — patrz reguła `body[data-page="o-nas"] .split__img` w `pages.css` |
| `u01`–`u14` | 1280×800 | kafle usług, numeracja zgodna z kolejnością na podstronie |
| `g01`–`g27` | 900×1200 | galeria; `g01`–`g11` nadwozie, `g12`–`g19` wnętrze, `g21`–`g25` felgi, `g20` i `g26`–`g27` lampy. Numeracja plików nie idzie po kolei z kategoriami, bo `g20` (reflektor na stole) dostał kategorię „lampy" już po ponumerowaniu reszty — w HTML-u jego kafel stoi za felgami. |
| `logo.png`, `mark.png`, `favicon.png` | 920×370, 920×240, 256×256 | wycięte z `LOGO FB.jpg`, tło zdjęte przez policzenie alfy z odległości od koloru tła (patrz niżej) |

Cały katalog waży 6 MB. PNG-i logo są zapisane z paletą (64 kolory), bo znak ma w praktyce
dwie barwy — truecolor ważył trzy razy tyle.

**18 września 2026 podmienione zdjęcia na `o-nas.html`.** W dużym slocie stoi teraz
`IMG_4140` (cztery komplety felg przed regałem z chemią), bo poprzednie `hala.webp`
było poziome 1400×1000 i w wysokiej kolumnie tekstu `object-fit:cover` ścinał mu
większość kadru. Nagłówek podstrony był wycinkiem z tego samego `IMG_4140`, więc
poszedł na `IMG_5209` (białe Audi Q3 w hali). `IMG_4779` odpadło, bo `head-kontakt.webp`
to ten sam biały Mercedes w tej samej hali — byłyby dwa bliźniacze pasy na dwóch
podstronach. Pas z `IMG_5209` jest cięty od 1679 px z 5712, czyli nad tablicą —
niżej tablica `DW 5XA57` jest czytelna i wymagałaby rozmycia.

### Tablice rejestracyjne

Michał na większości zdjęć zasłania tablicę plakietką z logo Car-Spa Błysk, więc materiał
był prawie czysty. Do zestawu wybrane zostały kadry bez widocznej tablicy; jedyny wyjątek
to `head-kontakt.webp`, gdzie tablica wchodziła w dolną krawędź kadru — jest rozmyta.

W folderze źródłowym jest jeszcze kilkanaście zdjęć z czytelnymi tablicami
(między innymi Porsche, Mercedes A45, Audi Q3, Range Rover). **Przy dokładaniu nowego
kadru trzeba sprawdzić, czy tablica jest w kadrze, i rozmyć ją przed publikacją.**
Skrypt, który to robił, jest w historii sesji: `sharp` wycina region, skaluje w dół
do kilkunastu pikseli i z powrotem w górę z `kernel: 'nearest'`. **Uwaga:** `sharp`
stosuje tylko ostatnie `resize()` w potoku, więc pomniejszenie i powiększenie muszą być
dwoma osobnymi potokami — inaczej kod wygląda poprawnie i nic nie robi.

Zdjęcie `fb08.webp` (konsola środkowa) świadomie nie jest użyte: na ekranie
multimediów widać imię z listy kontaktów.

## Wspólny nagłówek i stopka

Nagłówek, menu mobilne, stopka, zasłona przejścia i pasek telefonu siedzą w każdym pliku
osobno, między znacznikami `<!-- shell:nazwa -->` i `<!-- /shell:nazwa -->`.
Źródłem jest `index.html`, reszta dostaje kopię:

```
node tools/sync-shell.mjs             # rozsyła i zapisuje
node tools/sync-shell.mjs --sprawdz   # tylko sprawdza, kończy błędem przy rozjeździe
```

Skrypt sam dopisuje `aria-current="page"` do pozycji odpowiadającej atrybutowi
`data-page` na `<body>` (dopasowanie po `data-nav` na linku). **Po każdej zmianie
w nagłówku albo stopce trzeba go uruchomić**, inaczej podstrony zostaną ze starą wersją.

## Kolory

Wyciągnięte z logo (histogram pliku `img/logo.jpg`): czerń zajmuje 89,7 % powierzchni,
złoto 2,2 %.

| Token | Wartość | Skąd |
|---|---|---|
| `--surface` | `#171518` | tło logo, co do piksela |
| `--gold` | `#F5B647` | sylwetka auta i napis „CAR-SPA" |
| `--white` | `#F6F4F2` | napis „BŁYSK" |
| `--bg` | `#0B0A0C` | ciemniejsze tło strony, żeby czerń logo się od niego odcinała |

Kontrasty: złoto na tle 10,8:1, tekst pomocniczy `#A8A2AE` 7,8:1, przypis w stopce
`#8A8490` 5,4:1 — wszystko powyżej AA.

## Typografia

- **Montserrat** 800/900 (wersaliki, nagłówki) — logo jest złożone krojem z tej rodziny,
  więc nagłówek hero odtwarza logotyp: złote kursywne „Car-Spa" + białe „Błysk".
- **Barlow** 400/500/600 (tekst, etykiety, przyciski).

## Pliki

```
index.html  uslugi.html  cennik.html  galeria.html
o-nas.html  kontakt.html  polityka-prywatnosci.html
css/style.css     — warstwa z wersji jednostronicowej
css/pages.css     — komponenty wielostronicowe, wczytywana po style.css
js/app.js         — jeden skrypt dla wszystkich stron, każdy blok sprawdza swoje elementy
js/light-rays.js  — WebGL, dociągany tylko tam, gdzie jest sekcja kontaktu
tools/sync-shell.mjs
img/
serve.ps1
```

Spis plików w `img/` jest wyżej, w tabeli „Jak powstały pliki w `img/`". Po wymianie
materiału 17 września 2026 nie ma tam już ani plików `fb*`, ani kadrów ze stocku.

### Zdejmowanie tła z logo

`LOGO FB.jpg` to znak na jednolitym ciemnym tle `#171518`, bez kanału alfa. Piksel jest
złożeniem `C = a·F + (1−a)·B`, a najjaśniejszy kanał samego logo dochodzi do 255, więc
alfę liczy się wprost: `a = max((C−B)/(255−B))` po kanałach. Potem dwie rzeczy:

- **krzywa na alfie** — poniżej 0,05 na zero, powyżej 0,88 na jeden. Bez tego całe
  tło zostaje z alfą rzędu 20/255 i na stronie widać jasną poświatę w kształcie kwadratu.
  Tak właśnie wyglądała pierwsza wersja tych plików.
- **odjęcie tła spod krawędzi** — `F = (C − (1−a)·B) / a`, inaczej wygładzone brzegi
  liter zostają przyciemnione i na jasnym tle robi się obwódka.

Skrypt jest w katalogu tymczasowym sesji jako `logo.mjs`. Białe „BŁYSK" w logotypie
znika na jasnym tle — to cecha samego znaku, nie wycinania; strona jest ciemna,
więc nie ma z tym problemu. `favicon.png` celowo **zachowuje** ciemne tło, bo złoty
znak bez niego gubi się na jasnym pasku kart.

## Animacje

GSAP 3.13 (ScrollTrigger, na galerii też Flip) + Lenis z CDN, plus
`js/light-rays.js` skopiowany lokalnie. Efekty wzięte z biblioteki
`C:\Users\marcel\Desktop\awwwards`:

| Efekt | Skąd |
|---|---|
| **złote promienie w tle kontaktu** (WebGL, bez zależności) | `Background Animations/1` — Light Rays, skopiowane do `js/light-rays.js` |
| **pas z adresem otwiera się z wąskiej szczeliny** (clip-path + kontr-skala) | `Scroll Animation/41` — ScrollTrigger Clip-mask |
| **kafle usług zlatują się do siatki z rozrzuconych pozycji** | `Scroll Animation/39` — Spotlight Features (sama technika, bez pinowania) |
| **galeria przekłada kadry przy zmianie filtra** (GSAP Flip) | `Grid Animations/1` — Grid Layout Transition |
| pozioma galeria z paralaksą w kadrach | `Sliders/6` — Slide Track Slider (przerobione na pin + scrub) |
| magnetyczne przyciski | `Physics Effects/3`, przepisane na `gsap.quickTo` |
| zasłona przejścia między stronami (pięć pasów) | własne |
| kafle usług: złota poświata za kursorem + przechył 3D | własne |
| kroki: numery zapalają się po kolei przy scrollu | własne |
| licznik procent w preloaderze | własne |
| błysk przelatujący po dużym numerze telefonu (`background-clip: text`) | własne |
| maski nagłówków, reveal kart | własne, na ScrollTriggerze |

Sygnaturowy efekt to **błysk** — złoty rozbłysk przelatujący po zdjęciu w hero,
nad nagłówkami podstron i po przyciskach na hover. Nazwa firmy znaczy dokładnie to.

### Przejście między stronami

`<div class="curtain">` to pięć pasów w kolorze `--surface`. Przy kliknięciu w link
wewnętrzny wjeżdżają od dołu, potem leci `location.href`. Przy wejściu na stronę
zjeżdżają w dół. Szczegóły, o które łatwo się potknąć:

- `html.anim .curtain i` startuje z `scaleY(1)`, więc strona jest zasłonięta od pierwszego
  wyrysowania i nie widać przeskoku. Bez JS-u klasy `.anim` nie ma i pasy są zwinięte.
- `z-index: 99` — nad paskiem nawigacji (90) i menu (80), ale **pod preloaderem** (100),
  żeby na stronie głównej nie zasłaniał licznika, i pod podglądem zdjęcia (120).
- Handler nie przechwytuje: kotwic `#`, `tel:`, `mailto:`, linków z `target="_blank"`,
  `download`, innych domen, kliknięć z Ctrl/Cmd/Shift/Alt i środkowym przyciskiem.
- `pageshow` z `persisted` odsuwa zasłonę jeszcze raz — bez tego powrót przyciskiem
  „wstecz" wyjmuje z pamięci przeglądarki stronę z zasuniętą zasłoną.
- Jest też bezpiecznik: jeśli po 2,6 s nawigacja nie ruszy, zasłona się odsuwa.

### Zabezpieczenia

- `<html class="anim">` ustawia stany startowe animacji. Klasę dodaje skrypt
  w `<head>`, więc bez JS-u nie pojawia się w ogóle.
- Watchdog zdejmuje `.anim` po 2,5 s, jeśli GSAP nie dojdzie z CDN.
- `js/light-rays.js` dociąga się dopiero z `app.js` i tylko od 768 px wzwyż.
- `prefers-reduced-motion: reduce` → skrypt kończy się wcześnie, zostaje menu,
  walidacja formularza, filtry galerii i podgląd zdjęcia; zasłona ma `display:none`,
  a pozioma galeria przewija się natywnie zamiast być pinowana.
- Pasek „Zadzwoń" na telefonie: na stronie głównej wjeżdża dopiero, gdy hero wyjedzie
  z ekranu (w hero jest już duży przycisk z tym samym numerem). Na podstronach hero nie ma,
  więc pasek stoi od razu.
- **`ScrollTrigger.sort()` przed `refresh()` jest obowiązkowy** na stronie głównej.
  Pin galerii powstaje w kodzie później niż wyzwalacze sekcji leżących pod nią, więc bez
  posortowania liczą one pozycje bez rozpiętości pinu i odpalają się o dwa ekrany
  za wcześnie. Objaw: schodzisz do „Jak umówić auto", a wszystko jest już odsłonięte.
- Uwaga przy modyfikacjach: `html.anim .hero__title .line > span` ma w CSS-ie
  `translateY(105%)`. GSAP odczytuje to jako `y` w pikselach, więc pierwszy
  `gsap.set` musi podawać `{ y: 0, yPercent: 105 }` — inaczej `yPercent: 0`
  nie wyzeruje transformu i tytuł zostaje niewidoczny.
- Filtry galerii nie blokują kliknięć na czas animacji: nowe kliknięcie dobija poprzednią
  animację Flip (`progress(1).kill()`) i liczy stan od nowa. Wariant z flagą „trwa"
  potrafi się zablokować, jeśli `onComplete` nie dojdzie. `progress(1)` nie odpala
  `onComplete`, więc sprzątanie po przerwanej animacji (`clearProps`) musi stać
  przy samym przerwaniu, nie tylko w callbacku.
- **Filtr galerii nie może zwijać siatki w trakcie animacji.** `Flip.from(..., { absolute: true })`
  wyjmuje z układu wszystkie kafle naraz, więc `ul.gal` na te 0,6 s ma wysokość zero:
  dokument skraca się o kilka ekranów, stopka wjeżdża na animowane kafle i po animacji
  wraca na miejsce. Stąd dwie rzeczy w `galeriaFiltry()`:
  `absoluteOnLeave: true` zamiast `absolute: true` (z układu wychodzą tylko znikające kafle)
  oraz zamrożenie `min-height` siatki **przed** ustawieniem `hidden`. Kolejność jest
  istotna — dokument skraca się przy pierwszym układzie po zmianie, a wtedy przeglądarka
  zdążyła już przyciąć pozycję przewijania i widok skacze. Po animacji `min-height`
  wraca do zera i widok jest cofany tak, żeby pasek filtrów został tam, gdzie był
  w chwili kliknięcia. `.gal` ma `position:relative`, żeby znikające kafle liczyły
  się względem siatki.

## Układ na telefonie — trzy pułapki, które już wyszły

Wszystkie zgłosił Marcel 17 września 2026 i wszystkie widać dopiero na wąskim albo niskim ekranie.

- **`aspect-ratio` razem z `min-height` potrafi rozepchnąć element w bok.** Ramka mapy
  na `kontakt.html` miała `aspect-ratio:16/9; min-height:280px` i bez `width`. Przy szerokości
  375 px wysokość wymuszona przez `min-height` stała się definitywna, a przeglądarka policzyła
  z niej szerokość: 280 × 16/9 ≈ 498 px. Dokument urósł do 518 px, dało się go przewijać w bok,
  a razem z nim odjechał **pasek nawigacji** — jest na `position:fixed`, więc burger wylądował
  poza ekranem i wyglądało to, jakby menu znikało akurat na podstronie kontaktu.
  Lekarstwo to jedno `width:100%` na kontenerze. **Przy każdym `aspect-ratio` z `min-height`
  albo `min-width` trzeba domknąć drugi wymiar.**
- **Wyśrodkowany flex ucina górę, kiedy treść nie mieści się w oknie.** Menu mobilne miało
  `justify-content:center` i przy niskim oknie (np. 620 px) lista przerastała ekran o kilkadziesiąt
  pikseli. Wyśrodkowanie rozkłada nadmiar na obie strony, więc logo wyjeżdżało nad krawędź okna
  (`top: −25px`) i **nie dało się do niego doscrollować**. Teraz wyśrodkowanie robią
  `margin-top:auto` na pierwszym dziecku i `margin-bottom:auto` na ostatnim — przy nadmiarze
  marginesy schodzą do zera, a `overflow-y:auto` pozwala przewinąć resztę. Pasek nawigacji
  przy otwartym menu dostaje tło przez `.nav:has(.burger[aria-expanded="true"])`, bo przewijana
  lista wjeżdża pod niego.

- **`flex-basis` po zmianie kierunku liczy się na drugiej osi.** Wiersz cennika ma w układzie
  poziomym `.ptable__name{ flex:1 1 16rem }`, żeby nazwa usługi rozpychała się do ceny.
  W `@media (max-width:699px)` wiersz przechodzi na `flex-direction:column` — i te same 16 rem
  zaczęły działać jako **wysokość**, przez co między opisem a kwotą stała pustka na 256 px.
  Przy każdej zmianie `flex-direction` w media query trzeba przejrzeć `flex`/`flex-basis`
  dzieci; tutaj wystarczyło `.ptable__name{ flex:0 1 auto }`.

Szybki test na wszystkie siedem podstron: wczytać każdą w `iframe` 375 × 812 i porównać
`documentElement.scrollWidth` z `clientWidth`. Po poprawkach wszędzie wychodzi 375 = 375.

## Zgody i ciasteczka

Strona **nie zapisuje żadnych własnych ciasteczek** ani danych w pamięci przeglądarki —
sprawdzone: puste `document.cookie`, `localStorage` i `sessionStorage`, zero analityki
i pikseli. Nie ma więc banera ze zgodą.

Jedyny element, który coś zapisuje na urządzeniu, to **ramka Map Google** na `kontakt.html`.
Ładuje się od razu przy wejściu na podstronę, więc formalnie zapis następuje bez zgody,
której wymaga art. 173 Prawa komunikacji elektronicznej. **To świadoma decyzja Marcela
z 17 września 2026.** Wersja z mapą włączaną na kliknięcie była zrobiona i przetestowana,
po czym została cofnięta — ryzyko dla jednoosobowej myjni uznane za nieistotne
(kontrole w tej sprawie są wyłącznie na skargę, a nie z urzędu), a mapa widoczna od razu
uznana za ważniejszą. **Nie przywracaj tego bez pytania.** Gdyby wracało: zasłona
`.mapbox__zgoda` plus funkcja tworząca `<iframe>` z `data-mapa` po kliknięciu, bez
zapamiętywania wyboru.

Jeśli kiedyś dojdzie Google Analytics albo Pixel Facebooka, baner będzie konieczny
niezależnie od mapy — wtedy mapa wejdzie pod to samo okienko.

Formularz ma pod przyciskiem `.form__rodo` — jedno zdanie o tym, jakie dane zbiera,
z linkiem do polityki. Art. 13 RODO każe informować w miejscu zbierania danych, nie tylko
w osobnej zakładce. **Checkboxa „wyrażam zgodę" świadomie nie ma**: podstawą jest art. 6
ust. 1 lit. b RODO (działania przed zawarciem umowy na żądanie), a UODO odradza pytanie
o zgodę, gdy ma się inną podstawę.

Co zostaje do zrobienia po stronie prawnej: nazwa hostingu w polityce (dwa miejsca)
oraz dopisanie obsługi formularza do odbiorców danych, kiedy formularz zacznie wysyłać.

## SEO

Przegląd z 18 września 2026. Co jest na stronie:

| Element | Stan |
|---|---|
| `<title>` i opis | osobne na każdej podstronie, tytuły 29–45 znaków, opisy 127–157 (powyżej ~160 Google ucina) |
| Open Graph | `og:title`, `og:description`, `og:image`, `og:locale`, `og:site_name` plus `twitter:card` na sześciu podstronach; polityka prywatności ich nie ma, bo ma `noindex` |
| Dane strukturalne | `AutoWash` na stronie głównej z adresem, godzinami, NIP-em jako `taxID`, obszarem działania i `hasOfferCatalog` z czternastoma usługami (ceny jako `minPrice`, bo to widełki „od"); `BreadcrumbList` na pięciu podstronach z okruszkami |
| Nagłówki | jeden `h1` na podstronę, bez dziur w kolejności (do 18 września 2026 `cennik`, `o-nas` i `polityka-prywatnosci` skakały z `h1` prosto na `h3`) |
| Obrazki | wszystkie z `alt`, z `width`/`height` (zero przeskoków układu), WebP, `loading="lazy"` poza pierwszym ekranem |
| Wydajność | `preconnect` do Google Fonts, `preload` obu wersji hero (osobno desktop i telefon), `fetchpriority="high"` na zdjęciu nagłówka |
| `robots.txt` | jest, przepuszcza wszystko; polityki celowo nie blokuje, żeby robot mógł odczytać jej `noindex` |

**Czego nie da się zrobić bez domeny** — wszystko to jedna paczka do zrobienia po wyborze
hostingu, razem z nazwą firmy hostingowej w polityce prywatności:

1. `<link rel="canonical">` na każdej podstronie.
2. `og:url` — bez niego udostępnienie w mediach społecznościowych nie ma kanonicznego adresu.
3. **`og:image` musi być pełnym adresem.** Teraz jest względny (`img/hero.webp`), a Facebook
   i LinkedIn takich nie rozwijają, więc przy udostępnieniu nie pojawi się miniatura.
   To samo dotyczy `image` w danych strukturalnych. Facebook jest głównym kanałem tej firmy,
   więc to najważniejsza pozycja z tej listy.
4. `sitemap.xml` z siedmioma adresami i wpis `Sitemap:` w `robots.txt`.
5. Adresy w `BreadcrumbList` są względne — do podmiany na pełne.
6. `url` i `@id` w danych strukturalnych firmy.

**Czego świadomie nie ma:** współrzędnych `geo` (nikt ich nie zmierzył, a zmyślone wskażą
zły punkt na mapie), `paymentAccepted` i `currenciesAccepted` (Michał nie podał, czym można
płacić), opinii i `aggregateRating` (firma nie ma wizytówki Google, więc nie ma z czego ich wziąć).
**Nie dopisuj tych pól „dla SEO" — to dane, które klient zweryfikuje przy pierwszej rozmowie.**

Nagłówek `h1` na stronie głównej to sama nazwa firmy. Można by wcisnąć w niego frazę
„detailing Milicz", ale wymagałoby to albo przebudowy hero, albo ukrytego tekstu —
a fraza i tak siedzi w `<title>`, w opisie, w danych strukturalnych i w treści pod hero.

## Dostępność

Skip link, widoczne focus ringi w złocie, opisowe `alt`, `aria-label` na przyciskach
ikonowych, `aria-current="page"` w nawigacji, etykiety przy każdym polu formularza,
błędy przy polach (ikona + tekst, nie sam kolor), cele dotykowe ≥ 44 px,
Escape zamyka menu mobilne i podgląd zdjęcia, w podglądzie strzałki przewijają kadry,
a Tab krąży między trzema przyciskami. Rozwijana lista usług otwiera się na hover
i na `:focus-within`, więc da się do niej dojść Tabem. Licznik widocznych kadrów
w galerii ma `aria-live`, więc zmiana filtra jest słyszalna w czytniku ekranu.

## Co wysłać klientowi

Potrzebne pliki: siedem plików `.html`, `css/style.css`, `css/pages.css`, `js/app.js`,
`js/light-rays.js` i katalog `img/` bez plików `*.jpg` innych niż `head-*.jpg`.

**Niepotrzebne do wysyłki:** `img/fb*.jpg` i `img/logo.jpg` (oryginały z FB, zapas
na inne kadry), nieużywane `fb*.webp`, `.impeccable/` (konfiguracja narzędzia do
przeglądu designu), `tools/`, `serve.ps1` i ten README.
