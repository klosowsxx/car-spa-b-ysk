/* Rozsyła wspólne kawałki HTML z index.html do pozostałych podstron.
   Strona jest statyczna, bez budowania, więc nagłówek, menu i stopka
   siedzą w każdym pliku osobno. Ten skrypt pilnuje, żeby nie zaczęły
   się różnić: index.html jest źródłem, reszta dostaje kopię.

   Uruchomienie z katalogu projektu:
     node tools/sync-shell.mjs
   Sprawdzenie bez zapisu:
     node tools/sync-shell.mjs --sprawdz
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZRODLO  = 'index.html';
const BLOKI   = ['curtain', 'nav', 'menu', 'foot', 'callbar'];
const STRONY  = [
  'index.html',
  'uslugi.html',
  'cennik.html',
  'galeria.html',
  'o-nas.html',
  'kontakt.html',
  'polityka-prywatnosci.html'
];

const tylkoSprawdz = process.argv.includes('--sprawdz');

function znacznik(nazwa) {
  return new RegExp(`(<!-- shell:${nazwa} -->)([\\s\\S]*?)(<!-- /shell:${nazwa} -->)`);
}

function wytnij(tekst, nazwa, plik) {
  const m = tekst.match(znacznik(nazwa));
  if (!m) throw new Error(`${plik}: brak bloku shell:${nazwa}`);
  // aria-current dopisuje niżej sam skrypt — gdyby zostało we wzorcu,
  // przy kolejnym uruchomieniu trafiłoby na wszystkie podstrony
  return m[2].replace(/\s+aria-current="page"/g, '');
}

const zrodlo = fs.readFileSync(path.join(KATALOG, ZRODLO), 'utf8');
const wzorce = Object.fromEntries(BLOKI.map(n => [n, wytnij(zrodlo, n, ZRODLO)]));

let zmienione = 0;
let rozjechane = 0;

for (const plik of STRONY) {
  const sciezka = path.join(KATALOG, plik);
  if (!fs.existsSync(sciezka)) {
    console.warn(`pomijam ${plik} — nie ma takiego pliku`);
    continue;
  }

  const przed = fs.readFileSync(sciezka, 'utf8');
  let po = przed;

  for (const nazwa of BLOKI) {
    if (!znacznik(nazwa).test(po)) throw new Error(`${plik}: brak bloku shell:${nazwa}`);
    po = po.replace(znacznik(nazwa), (_, otw, __, zam) => otw + wzorce[nazwa] + zam);
  }

  // aktywna pozycja w nawigacji — bez tego trzeba by ją wpisywać ręcznie
  // w każdym pliku, a po każdej synchronizacji i tak by znikała
  const strona = (po.match(/<body[^>]*data-page="([^"]+)"/) || [])[1];
  if (strona) {
    po = po.replace(
      new RegExp(`(<a [^>]*data-nav="${strona}")`, 'g'),
      '$1 aria-current="page"'
    );
  }

  if (po === przed) continue;

  rozjechane++;
  if (tylkoSprawdz) {
    console.log(`RÓŻNI SIĘ  ${plik}`);
  } else {
    fs.writeFileSync(sciezka, po);
    zmienione++;
    console.log(`zapisane   ${plik}`);
  }
}

if (tylkoSprawdz) {
  if (rozjechane) {
    console.error(`\n${rozjechane} plik(i) różnią się od index.html — uruchom bez --sprawdz`);
    process.exit(1);
  }
  console.log('Wszystkie podstrony mają ten sam nagłówek i stopkę co index.html.');
} else {
  console.log(`\nGotowe. Zaktualizowane pliki: ${zmienione}.`);
}
