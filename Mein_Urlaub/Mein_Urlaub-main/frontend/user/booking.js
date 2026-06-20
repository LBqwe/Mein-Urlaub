// booking.js
// Erweitert die Seite um Bilder, Suchformulare, Filter und Buchungsoptionen.
// Genutzte APIs: Unsplash (Bilder), eigene Backend-Daten (Hotels, Fluge, Autos)

const UNSPLASH_KEY = 'asJNAaC1tODpdICivHw3Tezx8hazxCGLzqUi-9ZrSzY';
let aktuellerKalTyp = null;

// Bilder im localStorage cachen, damit das stundliche API-Limit (50/h) nicht unnötig verbraucht wird
const bildCache = JSON.parse(localStorage.getItem('bildCache') || '{}');

function bildCacheSpeichern() {
  try { localStorage.setItem('bildCache', JSON.stringify(bildCache)); } catch(e) {}
}

function sterne(n) {
  return '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
}

function heutePlus(tage = 0) {
  return new Date(Date.now() + tage * 86400000).toISOString().split('T')[0];
}

function aktuelleStunde() {
  const h = new Date().getHours();
  return String(h).padStart(2, '0') + ':00';
}

function flugDisplayDate(dt) {
  if (!dt) return new Date();
  const d = new Date(dt);
  if (d >= new Date()) return d;
  const now = new Date();
  d.setFullYear(now.getFullYear());
  d.setMonth(now.getMonth());
  d.setDate(now.getDate());
  if (d < now) d.setDate(d.getDate() + 1);
  return d;
}

function sortFlightsByDisplayInPlace(arr) {
  arr.sort((a, b) => {
    const da = flugDisplayDate(a.abflugzeit).getTime();
    const db = flugDisplayDate(b.abflugzeit).getTime();
    if (da !== db) return da - db;
    const ta = new Date(a.abflugzeit);
    const tb = new Date(b.abflugzeit);
    return (ta.getHours() * 60 + ta.getMinutes()) - (tb.getHours() * 60 + tb.getMinutes());
  });
}

function flugDatum(dt) {
  if (!dt) return '';
  return flugDisplayDate(dt).toLocaleDateString('de-DE');
}

function flugZeit(dt) {
  if (!dt) return '';
  return flugDisplayDate(dt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

async function bildLaden(query) {
  if (bildCache[query]) return bildCache[query];
  try {
    const res  = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`);
    const data = await res.json();
    const url  = data?.results?.[0]?.urls?.regular || null;
    bildCache[query] = url;
    bildCacheSpeichern();
    return url;
  } catch {
    return null;
  }
}

function bildEinsetzen(el, url, fallback) {
  if (!el || !url) return;
  el.classList.remove('d-flex', 'align-items-center', 'justify-content-center');
  el.style.overflow = 'hidden';
  el.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;"
    onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;\\'>${fallback}</div>'" />`;
}

// Buchungsoptionen speichern bevor der Buchen-Button sein Modal schliesst.
// capture=true = dieser Handler lauft zuerst.
document.addEventListener('click', function(ev) {
  const btn = ev.target;
  if (!btn || btn.id !== 'calConfirmBtn') return;
  const id  = cal?.serviceId;
  const typ = cal?.serviceTyp;
  if (!id || !typ) return;
  let opts = {};
  if (typ === 'hotel' || typ === 'paket') {
    const el_e = document.getElementById('kErwachsene');
    const el_k = document.getElementById('kKinder');
    const el_z = document.getElementById('kZimmer');
    opts = {
      erwachsene: el_e ? (+el_e.value || 2) : 2,
      kinder:     el_k ? (+el_k.value || 0) : 0,
      zimmer:     el_z ? (+el_z.value || 1) : 1
    };
  } else if (typ === 'flug') {
    const el_p  = document.getElementById('kPersonen');
    const el_kl = document.getElementById('kKlasse');
    opts = { personen: el_p ? (+el_p.value || 2) : 2, klasse: el_kl ? el_kl.value : 'economy' };
  } else if (typ === 'mietwagen') {
    opts = {};
  }
  try {
    const alle = JSON.parse(localStorage.getItem('buchungsOptionen') || '{}');
    alle[id] = opts;
    localStorage.setItem('buchungsOptionen', JSON.stringify(alle));
    console.log('Buchungsoptionen gespeichert:', id, opts);
  } catch(e) {}
}, true);

// Styles für Suchformulare und Filter
const style = document.createElement('style');
style.textContent = `
  .such-box {
    background: var(--cream);
    border: 1px solid var(--sand);
    padding: 1.5rem 1.75rem;
    margin-bottom: 2rem;
  }
  .such-box h4 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 1.3rem;
    color: var(--dark);
    margin: 0 0 1rem;
  }
  .such-zeile { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; }
  .such-feld  { display: flex; flex-direction: column; flex: 1; min-width: 140px; }
  .such-feld label {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--taupe);
    margin-bottom: 0.35rem;
  }
  .such-feld input, .such-feld select {
    border: 1px solid var(--sand);
    background: var(--warm-white);
    font-family: 'Jost', sans-serif;
    font-size: 0.85rem;
    color: var(--dark);
    padding: 0.55rem 0.9rem;
    outline: none;
    width: 100%;
  }
  .such-feld input:focus, .such-feld select:focus { border-color: var(--brown); }
  .such-btn {
    font-family: 'Jost', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.6rem 1.75rem;
    background: var(--dark);
    color: var(--warm-white);
    border: none;
    cursor: pointer;
    align-self: flex-end;
  }
  .such-btn:hover { opacity: 0.85; }
  .check-zeile {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
    font-size: 0.82rem;
    color: var(--text-muted);
  }
  .check-zeile label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; }
  .filter-leiste {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 0.75rem 1rem;
    background: var(--cream);
    border: 1px solid var(--sand);
  }
  .filter-leiste label {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .filter-leiste select, .filter-leiste input[type=range] {
    border: 1px solid var(--sand);
    background: var(--warm-white);
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    color: var(--dark);
    padding: 0.3rem 0.6rem;
    outline: none;
  }
  .filter-preis { font-size: 0.78rem; color: var(--brown); min-width: 50px; }
  .filter-reset {
    margin-left: auto;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: none;
    border: 1px solid var(--sand);
    color: var(--text-muted);
    padding: 0.3rem 0.9rem;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
  }
  .filter-reset:hover { border-color: var(--taupe); color: var(--dark); }
  .kal-extras {
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--sand);
    background: var(--cream);
  }
`;
document.head.appendChild(style);


// HOTELS

function hotelUIEinfuegen() {
  const grid = document.getElementById('hotelGrid');
  if (!grid || document.getElementById('hotel-suchbox')) return;

  const suchbox = document.createElement('div');
  suchbox.id = 'hotel-suchbox';
  suchbox.className = 'such-box';
  suchbox.innerHTML = `
    <h4>Hotel suchen</h4>
    <div class="such-zeile">
      <div class="such-feld" style="flex:2;min-width:200px;">
        <label>Reiseziel oder Hotelname</label>
        <input id="hSuche" placeholder="Paris, Barcelona, Bayerischer Hof ..." onkeydown="if(event.key==='Enter') hotelSuchen()" />
      </div>
      <div class="such-feld">
        <label>Check-in</label>
        <input type="date" id="hCheckin" value="${heutePlus(1)}" min="${heutePlus(1)}" />
      </div>
      <div class="such-feld">
        <label>Check-out</label>
        <input type="date" id="hCheckout" value="${heutePlus(8)}" min="${heutePlus(2)}" />
      </div>
      <div class="such-feld" style="max-width:90px;">
        <label>Erwachsene</label>
        <select id="hErwachsene">
          <option>1</option><option selected>2</option><option>3</option><option>4</option>
        </select>
      </div>
      <div class="such-feld" style="max-width:80px;">
        <label>Zimmer</label>
        <select id="hZimmer">
          <option selected>1</option><option>2</option><option>3</option>
        </select>
      </div>
      <button class="such-btn" onclick="hotelSuchen()">Suchen</button>
    </div>
    <p id="hStatus" style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem;min-height:1.2em;"></p>`;
  grid.parentElement.insertBefore(suchbox, grid);

  const filter = document.createElement('div');
  filter.className = 'filter-leiste';
  filter.innerHTML = `
    <label>Sterne</label>
    <select id="hFSterne" onchange="hotelFilterAnwenden()">
      <option value="">Alle</option>
      <option value="5">5 Sterne</option>
      <option value="4">4+ Sterne</option>
      <option value="3">3+ Sterne</option>
    </select>
    <label style="margin-left:.5rem;">Max. Preis pro Nacht</label>
    <input type="range" id="hFPreis" min="0" max="1000" value="1000" step="10"
      oninput="document.getElementById('hFPreisWert').textContent='€'+this.value; hotelFilterAnwenden()" />
    <span class="filter-preis" id="hFPreisWert">€1000</span>
    <label style="margin-left:.5rem;">Sortierung</label>
    <select id="hFSort" onchange="hotelFilterAnwenden()">
      <option value="">Standard</option>
      <option value="preis_auf">Preis aufsteigend</option>
      <option value="preis_ab">Preis absteigend</option>
      <option value="sterne_ab">Sterne absteigend</option>
      <option value="bew_ab">Beste Bewertung</option>
    </select>
    <button class="filter-reset" onclick="hotelFilterZurueck()">Zurücksetzen</button>`;
  grid.parentElement.insertBefore(filter, grid);
}

window.hotelSuchen = async function() {
  const eingabe  = document.getElementById('hSuche')?.value?.trim().toLowerCase();
  const checkin  = document.getElementById('hCheckin')?.value;
  const checkout = document.getElementById('hCheckout')?.value;
  const status   = document.getElementById('hStatus');
  status.textContent = '';

  let liste = eingabe
    ? (loadedData.hotels || []).filter(h =>
        (h.name||'').toLowerCase().includes(eingabe) ||
        (h.ort||'').toLowerCase().includes(eingabe) ||
        (h.land||'').toLowerCase().includes(eingabe))
    : (loadedData.hotels || []);

  if (checkin || checkout) {
    const von = checkin  ? new Date(checkin)  : new Date(checkout);
    const bis = checkout ? new Date(checkout) : new Date(checkin);
    von.setHours(0,0,0,0);
    bis.setHours(23,59,59,999);
    status.textContent = '⏳ Verfügbarkeit wird geprüft …';
    const pruefungen = await Promise.all(liste.map(async h => {
      try {
        const res = await fetch(`${API}/bookings/availability/hotel/${h._id}`);
        if (!res.ok) return true;
        const buchungen = await res.json();
        return !buchungen.some(b => {
          const bVon = new Date(b.von); bVon.setHours(0,0,0,0);
          const bBis = new Date(b.bis); bBis.setHours(23,59,59,999);
          return bVon <= bis && bBis >= von;
        });
      } catch { return true; }
    }));
    liste = liste.filter((_, i) => pruefungen[i]);
  }

  status.textContent = `${liste.length} Hotel(s) gefunden`;
  hotelKartenRendern(liste);
};

function hotelKartenRendern(liste) {
  const grid = document.getElementById('hotelGrid');
  let row = grid.querySelector('.row.g-4');
  if (!row) { row = document.createElement('div'); row.className = 'row g-4'; grid.appendChild(row); }

  if (!liste.length) {
    row.innerHTML = '<div class="col"><p style="color:var(--text-muted);font-size:.9rem;">Keine Hotels gefunden.</p></div>';
    return;
  }

  row.innerHTML = liste.map(h => {
    const anzBew = (rawRatings||[]).filter(r => r.serviceId === h._id && r.serviceTyp === 'hotel').length;
    return `<div class="col-sm-6 col-lg-4">
      <div class="card h-100" onclick="showDetail('hotel','${h._id}')" style="cursor:pointer;">
        <div class="card-img-top d-flex align-items-center justify-content-center" id="hbild-${h._id}" style="height:200px;background:var(--sand);overflow:hidden;">
          <span style="font-size:3rem;">🏨</span>
        </div>
        <div class="card-body">
          <p class="card-tag">${h.land}</p>
          <h5 class="card-title">${h.name}</h5>
          <p class="card-text card-info">${h.ort} · ${h.sterne ? '★'.repeat(h.sterne) : ''}${anzBew ? ' · ' + anzBew + ' Bew.' : ''}<br/>${h.beschreibung||''}</p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <div class="card-price">€${h.preisProNacht} <span>/ Nacht</span></div>
          <button class="btn-outline" onclick="event.stopPropagation();openCalendar('hotel','${h._id}')">Termin finden</button>
        </div>
      </div>
    </div>`;
  }).join('');

  liste.forEach(h => bildLaden(`${h.name} hotel`).then(url => bildEinsetzen(document.getElementById('hbild-' + h._id), url, '🏨')));
}

window.hotelFilterAnwenden = function() {
  if (!loadedData.hotels) return;
  let liste = [...loadedData.hotels];
  const minSterne = +document.getElementById('hFSterne')?.value || 0;
  const maxPreis  = +document.getElementById('hFPreis')?.value || 1000;
  const sort      = document.getElementById('hFSort')?.value;

  if (minSterne) liste = liste.filter(h => (h.sterne || 0) >= minSterne);
  liste = liste.filter(h => h.preisProNacht <= maxPreis);

  if (sort === 'preis_auf') liste.sort((a, b) => a.preisProNacht - b.preisProNacht);
  if (sort === 'preis_ab')  liste.sort((a, b) => b.preisProNacht - a.preisProNacht);
  if (sort === 'sterne_ab') liste.sort((a, b) => (b.sterne||0) - (a.sterne||0));
  if (sort === 'bew_ab') {
    const schnitt = id => {
      const rs = (rawRatings||[]).filter(r => r.serviceId === id && r.serviceTyp === 'hotel');
      return rs.length ? rs.reduce((s, r) => s + r.bewertung, 0) / rs.length : 0;
    };
    liste.sort((a, b) => schnitt(b._id) - schnitt(a._id));
  }
  hotelKartenRendern(liste);
};

window.hotelFilterZurueck = function() {
  document.getElementById('hFSterne').value = '';
  document.getElementById('hFPreis').value  = 1000;
  document.getElementById('hFPreisWert').textContent = '€1000';
  document.getElementById('hFSort').value   = '';
  hotelKartenRendern(loadedData.hotels || []);
};


// FLUGE

function flugUIEinfuegen() {
  const grid = document.getElementById('flightGrid');
  if (!grid || document.getElementById('flug-suchbox')) return;

  const suchbox = document.createElement('div');
  suchbox.id = 'flug-suchbox';
  suchbox.className = 'such-box';
  suchbox.innerHTML = `
    <h4>Flug suchen</h4>
    <div class="such-zeile">
      <div class="such-feld" style="flex:2;">
        <label>Von</label>
        <input id="fVon" placeholder="Abflugort z.B. Frankfurt" oninput="flugFilterAnwenden()" />
      </div>
      <div class="such-feld" style="flex:2;">
        <label>Nach</label>
        <input id="fNach" placeholder="Zielort z.B. Barcelona" oninput="flugFilterAnwenden()" />
      </div>
      <div class="such-feld">
        <label>Datum</label>
        <input type="date" id="fDatum" min="${heutePlus(0)}" oninput="flugFilterAnwenden()" />
      </div>
      <div class="such-feld" style="max-width:100px;">
        <label>Personen</label>
        <select id="fPersonen">
          <option>1</option><option selected>2</option><option>3</option><option>4</option>
        </select>
      </div>
    </div>
`;
  grid.parentElement.insertBefore(suchbox, grid);

  const filter = document.createElement('div');
  filter.className = 'filter-leiste';
  filter.innerHTML = `
    <label>Airline</label>
    <select id="fFAirline" onchange="flugFilterAnwenden()"><option value="">Alle Airlines</option></select>
    <label style="margin-left:.5rem;">Max. Preis pro Person</label>
    <input type="range" id="fFPreis" min="0" max="3000" value="3000" step="10"
      oninput="document.getElementById('fFPreisWert').textContent='€'+this.value; flugFilterAnwenden()" />
    <span class="filter-preis" id="fFPreisWert">€3000</span>
    <label style="margin-left:.5rem;">Sortierung</label>
    <select id="fFSort" onchange="flugFilterAnwenden()">
      <option value="">Standard</option>
      <option value="preis_auf">Preis aufsteigend</option>
      <option value="preis_ab">Preis absteigend</option>
      <option value="datum_auf">Datum aufsteigend</option>
    </select>
    <button class="filter-reset" onclick="flugFilterZurueck()">Zurücksetzen</button>`;
  grid.parentElement.insertBefore(filter, grid);
}

window.flugFilterAnwenden = function() {
  if (!loadedData.flights) return;
  let liste = [...loadedData.flights];
  const von      = (document.getElementById('fVon')?.value || '').toLowerCase().trim();
  const nach     = (document.getElementById('fNach')?.value || '').toLowerCase().trim();
  const airline  = document.getElementById('fFAirline')?.value;
  const maxPreis = +document.getElementById('fFPreis')?.value || 3000;
  const sort     = document.getElementById('fFSort')?.value;

  if (von)     liste = liste.filter(f => (f.abflugort||'').toLowerCase().includes(von));
  if (nach)    liste = liste.filter(f => (f.zielort||'').toLowerCase().includes(nach));
  if (airline) liste = liste.filter(f => f.airline === airline);
  liste = liste.filter(f => (f.preis||0) <= maxPreis);

  if (sort === 'preis_auf')      liste.sort((a, b) => a.preis - b.preis);
  else if (sort === 'preis_ab')  liste.sort((a, b) => b.preis - a.preis);
  else                           sortFlightsByDisplayInPlace(liste);

  flugKartenRendern(liste);
};

window.flugFilterZurueck = function() {
  ['fVon', 'fNach', 'fDatum'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('fFAirline').value = '';
  document.getElementById('fFPreis').value   = 3000;
  document.getElementById('fFPreisWert').textContent = '€3000';
  document.getElementById('fFSort').value    = '';
  const reset = [...(loadedData.flights || [])];
  sortFlightsByDisplayInPlace(reset);
  flugKartenRendern(reset);
};

function flugKartenRendern(liste) {
  const grid = document.getElementById('flightGrid');
  grid.querySelectorAll('.row, p').forEach(el => el.remove());

  if (!liste.length) {
    grid.insertAdjacentHTML('beforeend', '<p style="color:var(--text-muted);font-size:.9rem;">Keine Flüge gefunden.</p>');
    return;
  }

  const row = document.createElement('div');
  row.className = 'row g-4';
  grid.appendChild(row);

  row.innerHTML = liste.map(f => `
    <div class="col-sm-6 col-lg-4">
      <div class="card h-100" onclick="showDetail('flug','${f._id}')" style="cursor:pointer;">
        <div class="card-img-top d-flex align-items-center justify-content-center" id="fbild-${f._id}" style="height:200px;background:var(--sand);overflow:hidden;">
          <span style="font-size:3rem;">✈️</span>
        </div>
        <div class="card-body">
          <p class="card-tag">${f.airline}</p>
          <h5 class="card-title">${f.abflugort} → ${f.zielort}</h5>
          <p class="card-text card-info">Flug ${f.flugnummer}<br/>
            ✈ ${flugZeit(f.abflugzeit)} → ${flugZeit(f.ankunftzeit)} Uhr<br/>
            <span style="font-size:.78rem;opacity:.75">${flugDatum(f.abflugzeit)}</span></p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <div class="card-price">€${f.preis} <span>/ Person</span></div>
          <button class="btn-outline" onclick="event.stopPropagation();openCalendar('flug','${f._id}')">Termin finden</button>
        </div>
      </div>
    </div>`).join('');

  liste.forEach(f => bildLaden(`${f.zielort} city travel`).then(url => bildEinsetzen(document.getElementById('fbild-' + f._id), url, '✈️')));
}


// MIETWAGEN

function autoUIEinfuegen() {
  const grid = document.getElementById('rentalGrid');
  if (!grid || document.getElementById('auto-suchbox')) return;

  const suchbox = document.createElement('div');
  suchbox.id = 'auto-suchbox';
  suchbox.className = 'such-box';
  suchbox.innerHTML = `
    <h4>Mietwagen suchen</h4>
    <div class="such-zeile">
      <div class="such-feld" style="flex:2;">
        <label>Abholort</label>
        <input id="aOrt" placeholder="Stadt, Flughafen oder Bahnhof" oninput="autoFilterAnwenden()" />
      </div>
      <div class="such-feld">
        <label>Abholdatum</label>
        <input type="date" id="aD1" value="${heutePlus(0)}" min="${heutePlus(0)}" oninput="autoFilterAnwenden()" />
      </div>
      <div class="such-feld">
        <label>Rückgabedatum</label>
        <input type="date" id="aD2" value="${heutePlus(8)}" min="${heutePlus(2)}" oninput="autoFilterAnwenden()" />
      </div>
    </div>
    <div class="check-zeile">
      <label><input type="checkbox" id="aAndere" onchange="andereStationToggle()" /> Fahrzeug an anderer Station zurückgeben</label>
    </div>
    <div id="aRueckgabeWrap" style="display:none;margin-top:0.6rem;">
      <div class="such-feld" style="max-width:320px;">
        <label>Rückgabeort</label>
        <input id="aRueckgabeOrt" placeholder="Stadt, Flughafen oder Bahnhof" style="border:1px solid var(--sand);background:var(--warm-white);font-family:'Jost',sans-serif;font-size:0.85rem;color:var(--dark);padding:0.55rem 0.9rem;outline:none;width:100%;" />
      </div>
    </div>`;
  grid.parentElement.insertBefore(suchbox, grid);

  const filter = document.createElement('div');
  filter.className = 'filter-leiste';
  filter.innerHTML = `
    <label>Kategorie</label>
    <select id="aFKat" onchange="autoFilterAnwenden()">
      <option value="">Alle</option>
      <option>Kleinwagen</option><option>Kompakt</option>
      <option>Mittel</option><option>SUV</option>
      <option>Limousine</option><option>Van</option>
    </select>
    <label style="margin-left:.5rem;">Max. Preis pro Tag</label>
    <input type="range" id="aFPreis" min="0" max="500" value="500" step="5"
      oninput="document.getElementById('aFPreisWert').textContent='€'+this.value; autoFilterAnwenden()" />
    <span class="filter-preis" id="aFPreisWert">€500</span>
    <label class="check-zeile" style="margin-left:.5rem;">
      <input type="checkbox" id="aFVerfuegbar" onchange="autoFilterAnwenden()" /> Nur verfügbare
    </label>
    <button class="filter-reset" onclick="autoFilterZurueck()">Zurücksetzen</button>`;
  grid.parentElement.insertBefore(filter, grid);
}

window.andereStationToggle = function() {
  const wrap = document.getElementById('aRueckgabeWrap');
  if (wrap) wrap.style.display = document.getElementById('aAndere')?.checked ? '' : 'none';
};

window.autoFilterAnwenden = function() {
  if (!loadedData.rentals) return;
  let liste = [...loadedData.rentals];
  const ort      = (document.getElementById('aOrt')?.value || '').toLowerCase().trim();
  const kat      = (document.getElementById('aFKat')?.value || '').toLowerCase();
  const maxPreis = +document.getElementById('aFPreis')?.value || 500;
  const nurVerf  = document.getElementById('aFVerfuegbar')?.checked;

  if (ort) liste = liste.filter(c => (c.ort||'').toLowerCase().includes(ort));
  if (kat) liste = liste.filter(c => (c.kategorie||'').toLowerCase().includes(kat));
  liste = liste.filter(c => (c.preisProTag||0) <= maxPreis);
  if (nurVerf) liste = liste.filter(c => c.verfuegbar);

  autoKartenRendern(liste);
};

window.autoFilterZurueck = function() {
  document.getElementById('aOrt').value       = '';
  document.getElementById('aFKat').value      = '';
  document.getElementById('aFPreis').value    = 500;
  document.getElementById('aFPreisWert').textContent = '€500';
  document.getElementById('aFVerfuegbar').checked = false;
  autoKartenRendern(loadedData.rentals || []);
};

function autoKartenRendern(liste) {
  const grid = document.getElementById('rentalGrid');
  grid.querySelectorAll('.row, p').forEach(el => el.remove());

  if (!liste.length) {
    grid.insertAdjacentHTML('beforeend', '<p style="color:var(--text-muted);font-size:.9rem;">Keine Mietwagen gefunden.</p>');
    return;
  }

  const row = document.createElement('div');
  row.className = 'row g-4';
  grid.appendChild(row);

  row.innerHTML = liste.map(c => `
    <div class="col-sm-6 col-lg-4">
      <div class="card h-100" onclick="showDetail('mietwagen','${c._id}')" style="cursor:pointer;">
        <div class="card-img-top d-flex align-items-center justify-content-center" id="abild-${c._id}" style="height:200px;background:var(--sand);overflow:hidden;">
          <span style="font-size:3rem;">🚗</span>
        </div>
        <div class="card-body">
          <p class="card-tag">${c.kategorie||'Mietwagen'}</p>
          <h5 class="card-title">${c.marke} ${c.modell}</h5>
          <p class="card-text card-info">${c.ort}<br/>
            <span class="badge" style="background:${c.verfuegbar?'var(--taupe)':'var(--text-muted)'};color:#fff;">${c.verfuegbar?'Verfügbar':'Nicht verfügbar'}</span></p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <div class="card-price">€${c.preisProTag} <span>/ Tag</span></div>
          <button class="btn-outline" onclick="event.stopPropagation();openCalendar('mietwagen','${c._id}')">Termin finden</button>
        </div>
      </div>
    </div>`).join('');

  liste.forEach(c => bildLaden(`${c.marke||''} ${c.modell||''} car exterior`).then(url => bildEinsetzen(document.getElementById('abild-' + c._id), url, '🚗')));
}


// DETAIL-MODAL
// showDetail ist in index.html definiert und wird hier erweitert.
// Statt index.html zu ändern wird die Funktion überschrieben (Patching),
// damit das Original sauber bleibt.

const origShowDetail = showDetail;
window.showDetail = function(typ, id) {
  origShowDetail(typ, id);

  // Hero zurücksetzen damit kein altes Bild bleibt
  const hero = document.getElementById('detailHero');
  if (hero) {
    hero.style.backgroundImage = 'none';
    hero.style.background = 'var(--sand)';
    const icon = document.getElementById('detailIcon');
    if (icon) icon.style.display = '';
  }

  const d = serviceCache[id];
  if (!d) return;

  // Passendes Bild laden
  const bildQuery = {
    hotel:     `${d.name} hotel`,
    flug:      `${d.zielort||d.abflugort} city travel`,
    mietwagen: `${d.marke||'car'} ${d.modell||''} exterior`
  }[typ];

  if (bildQuery) {
    bildLaden(bildQuery).then(url => {
      if (!url) return;
      const h = document.getElementById('detailHero');
      if (!h) return;
      h.style.backgroundImage    = `url(${url})`;
      h.style.backgroundSize     = 'cover';
      h.style.backgroundPosition = 'center';
      const ic = document.getElementById('detailIcon');
      if (ic) ic.style.display = 'none';
    });
  }

  const el = document.getElementById('detailRows');
  if (!el) return;

  // Bewertungen laden
  setTimeout(() => {
    const lokal = (rawRatings||[]).filter(r => r.serviceTyp === typ && r.serviceId === id);
    fetch(window.location.origin + '/ratings/' + typ + '/' + id)
      .then(r => r.ok ? r.json() : lokal)
      .catch(() => lokal)
      .then(bewertungen => {
        const abschnitt = document.createElement('div');
        abschnitt.style.cssText = 'margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--sand);';
        abschnitt.innerHTML = '<p style="font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--taupe);margin-bottom:0.75rem;">Bewertungen</p>';

        if (!bewertungen.length) {
          abschnitt.innerHTML += '<p style="font-size:.85rem;color:var(--text-muted);">Noch keine Bewertungen vorhanden.</p>';
        } else {
          const schnitt = bewertungen.reduce((s, r) => s + r.bewertung, 0) / bewertungen.length;
          abschnitt.innerHTML += `
            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding:.75rem 1rem;background:var(--cream);border:1px solid var(--sand);">
              <span style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:var(--dark);">${schnitt.toFixed(1)}</span>
              <div>
                <div style="color:var(--brown);font-size:1.1rem;">${sterne(schnitt)}</div>
                <div style="font-size:.75rem;color:var(--text-muted);margin-top:.15rem;">${bewertungen.length} Bewertung${bewertungen.length !== 1 ? 'en' : ''}</div>
              </div>
            </div>
            ${bewertungen.map(r => `
              <div style="padding:.9rem 0;border-bottom:1px solid var(--sand);">
                <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:.4rem;margin-bottom:.35rem;">
                  <span style="font-size:.82rem;color:var(--dark);font-weight:500;">${r.autor||'Anonym'}</span>
                  <span style="font-size:.75rem;color:var(--text-muted);">${r.createdAt ? new Date(r.createdAt).toLocaleDateString('de-DE') : ''}</span>
                </div>
                <span style="color:var(--brown);font-size:1rem;">${sterne(r.bewertung)}</span>
                ${r.kommentar ? `<p style="margin:.4rem 0 0;font-size:.85rem;color:var(--text-muted);line-height:1.55;">"${r.kommentar}"</p>` : ''}
              </div>`).join('')}`;
        }
        el.appendChild(abschnitt);
      });
  }, 50);
};

// Paket-Detail: Stadtbild und Bewertungen
const origShowPkg = window.showPackageDetail;
if (origShowPkg) {
  window.showPackageDetail = function(idx) {
    origShowPkg(idx);
    const pkg = packageList?.[idx];
    if (!pkg) return;

    const hero = document.getElementById('detailHero');
    if (hero) {
      hero.style.backgroundImage = 'none';
      hero.style.background = 'var(--sand)';
      const ic = document.getElementById('detailIcon');
      if (ic) ic.style.display = '';
    }

    const city = pkg.destination || pkg.hotel?.ort || pkg.flight?.zielort;
    if (city) {
      bildLaden(`${city} city travel`).then(url => {
        if (!url) return;
        const h = document.getElementById('detailHero');
        if (!h) return;
        h.style.backgroundImage    = `url(${url})`;
        h.style.backgroundSize     = 'cover';
        h.style.backgroundPosition = 'center';
        const ic = document.getElementById('detailIcon');
        if (ic) ic.style.display = 'none';
      });
    }

    const el = document.getElementById('detailRows');
    if (!el) return;

    const alle = [
      pkg.hotel  ? { typ: 'hotel',     id: pkg.hotel._id }  : null,
      pkg.flight ? { typ: 'flug',      id: pkg.flight._id } : null,
      pkg.rental ? { typ: 'mietwagen', id: pkg.rental._id } : null,
      // Direkte Paket-Bewertungen (serviceId = flight._id)
      pkg.flight ? { typ: 'paket',     id: pkg.flight._id } : null,
    ].filter(Boolean).flatMap(({ typ, id }) =>
      (rawRatings||[]).filter(r => r.serviceTyp === typ && r.serviceId === id)
    );

    const abschnitt = document.createElement('div');
    abschnitt.style.cssText = 'margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--sand);';
    abschnitt.innerHTML = '<p style="font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--taupe);margin-bottom:0.75rem;">Bewertungen</p>';

    if (!alle.length) {
      abschnitt.innerHTML += '<p style="font-size:.85rem;color:var(--text-muted);">Noch keine Bewertungen vorhanden.</p>';
    } else {
      const schnitt = alle.reduce((s, r) => s + r.bewertung, 0) / alle.length;
      abschnitt.innerHTML += `
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding:.75rem 1rem;background:var(--cream);border:1px solid var(--sand);">
          <span style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:var(--dark);">${schnitt.toFixed(1)}</span>
          <div>
            <div style="color:var(--brown);font-size:1.1rem;">${sterne(schnitt)}</div>
            <div style="font-size:.75rem;color:var(--text-muted);margin-top:.15rem;">${alle.length} Bewertung${alle.length !== 1 ? 'en' : ''}</div>
          </div>
        </div>
        ${alle.map(r => `
          <div style="padding:.9rem 0;border-bottom:1px solid var(--sand);">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:.4rem;margin-bottom:.35rem;">
              <span style="font-size:.82rem;color:var(--dark);font-weight:500;">${r.autor||'Anonym'}</span>
              <span style="font-size:.75rem;color:var(--text-muted);">${r.createdAt ? new Date(r.createdAt).toLocaleDateString('de-DE') : ''}</span>
            </div>
            <span style="color:var(--brown);font-size:1rem;">${sterne(r.bewertung)}</span>
            ${r.kommentar ? `<p style="margin:.4rem 0 0;font-size:.85rem;color:var(--text-muted);line-height:1.55;">"${r.kommentar}"</p>` : ''}
          </div>`).join('')}`;
    }
    el.appendChild(abschnitt);
  };
}


// BEWERTUNGSBILDER

function bewertungsbilderLaden() {
  const cards = document.querySelectorAll('#ratingGrid .card');
  const emojis = { hotel: '🏨', flug: '✈️', mietwagen: '🚗', paket: '🌍' };
  (rawRatings||[]).forEach((r, i) => {
    if (!cards[i] || cards[i].querySelector('.card-img-top')) return;
    const d = serviceCache[r.serviceId];
    if (!d) return;
    const query = r.serviceTyp === 'hotel'     ? `${d.name} hotel` :
                  r.serviceTyp === 'flug'      ? `${d.zielort} city travel` :
                  r.serviceTyp === 'mietwagen' ? `${d.marke} ${d.modell} car exterior` :
                  r.serviceTyp === 'paket'     ? `${d.zielort || d.name} city travel` : null;
    if (!query) return;

    const div = document.createElement('div');
    div.className = 'card-img-top d-flex align-items-center justify-content-center';
    div.style.cssText = 'height:140px;background:var(--sand);overflow:hidden;';
    div.innerHTML = `<span style="font-size:2.5rem;">${emojis[r.serviceTyp]||'⭐'}</span>`;
    cards[i].prepend(div);
    bildLaden(query).then(url => bildEinsetzen(div, url, emojis[r.serviceTyp]||'⭐'));
  });
}

function paketeBilderLaden() {
  const divs = document.querySelectorAll('#paketGrid .card-img-top');
  divs.forEach((el, i) => {
    if (el.querySelector('img')) return;
    const pkg  = packageList?.[i];
    if (!pkg) return;
    const city = pkg.destination || pkg.hotel?.ort || pkg.flight?.zielort || 'travel';
    bildLaden(`${city} city travel`).then(url => bildEinsetzen(el, url, '🌍'));
  });
}


// KALENDER-OPTIONEN

function kalenderExtrasEinfuegen(typ) {
  document.getElementById('kal-extras')?.remove();
  const footer = document.querySelector('.cal-footer');
  if (!footer) return;

  const wrap = document.createElement('div');
  wrap.id = 'kal-extras';
  wrap.className = 'kal-extras';

  const auswahlFeld = (id, label, optionen) => `
    <div class="such-feld">
      <label>${label}</label>
      <select id="${id}" onchange="kalenderHinweisAktualisieren()" style="border:1px solid var(--sand);background:var(--warm-white);font-family:'Jost',sans-serif;font-size:.82rem;color:var(--dark);padding:.4rem .6rem;outline:none;">
        ${optionen.map(o => `<option value="${o.v}">${o.l}</option>`).join('')}
      </select>
    </div>`;

  if (typ === 'hotel' || typ === 'paket') {
    wrap.innerHTML = `<div class="such-zeile" style="gap:0.6rem;">
      ${auswahlFeld('kErwachsene', 'Erwachsene', [1,2,3,4,5,6].map(n => ({v:n, l:n + ' Erwachsene'})))}
      ${auswahlFeld('kKinder', 'Kinder', [0,1,2,3,4].map(n => ({v:n, l:n===0 ? 'Keine Kinder' : n + ' Kind' + (n>1 ? 'er' : '')})))}
      ${auswahlFeld('kZimmer', 'Zimmer', [1,2,3,4,5].map(n => ({v:n, l:n + ' Zimmer'})))}
    </div>`;
    setTimeout(() => { const el = document.getElementById('kErwachsene'); if (el) el.value = 2; }, 0);
  }

  if (typ === 'flug') {
    wrap.innerHTML = `<div class="such-zeile" style="gap:0.6rem;">
      ${auswahlFeld('kPersonen', 'Passagiere', [1,2,3,4,5,6,7,8,9].map(n => ({v:n, l:n + ' Person' + (n>1 ? 'en' : '')})))}

    </div>`;
    setTimeout(() => { const el = document.getElementById('kPersonen'); if (el) el.value = 2; }, 0);
  }

  if (typ === 'mietwagen') {
    wrap.innerHTML = '';
  }

  footer.parentElement.insertBefore(wrap, footer);
  kalenderHinweisAktualisieren();
}

window.kalenderHinweisAktualisieren = function() {
  const hint = document.getElementById('calHint');
  if (!hint) return;
  const basis = (hint.dataset.basis || hint.textContent.split('|')[0].trim());
  hint.dataset.basis = basis;

  const g = id => { const el = document.getElementById(id); return el?.value || null; };
  const typ = aktuellerKalTyp;
  let zusatz = '';

  if (typ === 'hotel' || typ === 'paket') {
    const e = g('kErwachsene') || 2;
    const k = +g('kKinder') || 0;
    const z = g('kZimmer') || 1;
    zusatz = `${e} Erw. | ${k > 0 ? k + ' Kind' + (k > 1 ? 'er' : '') + ' | ' : ''}${z} Zimmer`;
  }
  if (typ === 'flug') {
    const p  = g('kPersonen') || 2;
    const kl = {economy:'Economy', premium:'Premium Economy', business:'Business Class', first:'First Class'}[g('kKlasse')] || 'Economy';
    zusatz = `${p} Person${+p > 1 ? 'en' : ''} | ${kl}`;
  }
  if (typ === 'mietwagen') {
    if (document.getElementById('aAndere')?.checked) {
      const ort = document.getElementById('aRueckgabeOrt')?.value?.trim();
      if (ort) zusatz = `Rückgabe: ${ort}`;
    }
  }

  if (zusatz) hint.textContent = (basis ? basis + '  |  ' : '') + zusatz;
};

const origOpenCal = window.openCalendar;
window.openCalendar = async function(typ, id) {
  aktuellerKalTyp = typ;
  await origOpenCal(typ, id);
  kalenderExtrasEinfuegen(typ);
};

const origOpenPkgCal = window.openPackageCalendar;
window.openPackageCalendar = function(idx) {
  aktuellerKalTyp = 'paket';
  origOpenPkgCal(idx);
  kalenderExtrasEinfuegen('paket');
};

const origConfirmPkg = window.confirmPackage;
window.confirmPackage = async function() {
  const pkg = cal?.packageData;
  if (pkg) {
    const opts = buchungsOptsLesen('paket');
    if (pkg.hotel)  pkg.hotel._buchung  = opts;
    if (pkg.flight) pkg.flight._buchung = opts;
    if (pkg.rental) pkg.rental._buchung = opts;
  }
  await origConfirmPkg();
};

// Liest die aktuell eingestellten Buchungsoptionen aus dem Kalender-Modal.
// Gibt je nach Typ unterschiedliche Felder zurück (Zimmer, Personen, Alter).
function buchungsOptsLesen(typ) {
  const g = id => { const el = document.getElementById(id); return el ? +el.value || el.value : null; };
  if (typ === 'hotel' || typ === 'paket') return { erwachsene: g('kErwachsene')||2, kinder: g('kKinder')||0, zimmer: g('kZimmer')||1 };
  if (typ === 'flug')      return { personen: g('kPersonen')||2, klasse: document.getElementById('kKlasse')?.value||'economy' };
  if (typ === 'mietwagen') {
    const anderer = document.getElementById('aAndere')?.checked;
    return { rueckgabeOrt: anderer ? (document.getElementById('aRueckgabeOrt')?.value?.trim()||null) : null };
  }
  return {};
}

const origConfirmCal = window.confirmCalendar;
window.confirmCalendar = async function() {
  const id   = cal?.serviceId;
  const typ  = cal?.serviceTyp;
  const opts = buchungsOptsLesen(typ);

  if (id && serviceCache[id]) serviceCache[id]._buchung = opts;
  window.letzteOptionen = { typ, opts };

  // Personenzahl im localStorage speichern damit Meine Reisen sie anzeigen kann
  if (id) {
    try {
      const alle = JSON.parse(localStorage.getItem('buchungsOptionen') || '{}');
      alle[id]   = opts;
      localStorage.setItem('buchungsOptionen', JSON.stringify(alle));
    } catch(e) {}
  }

  await origConfirmCal();
};

// Buchungsoptionen in der Erfolgsmeldung anzeigen
const origShowNotif = window.showNotif;
window.showNotif = function(typ2, msg) {
  if (typ2 === 'success' && window.letzteOptionen) {
    const { typ, opts } = window.letzteOptionen;
    let info = '';
    if ((typ === 'hotel' || typ === 'paket') && opts.erwachsene) {
      info = `\n${opts.erwachsene} Erwachsene | ${opts.kinder||0} Kinder | ${opts.zimmer||1} Zimmer`;
    }
    if (typ === 'flug' && opts.personen) {
      const kl = {economy:'Economy', premium:'Premium Economy', business:'Business', first:'First Class'}[opts.klasse] || 'Economy';
      info = `\n${opts.personen} Personen | ${kl}`;
    }
    if (typ === 'mietwagen' && opts.rueckgabeOrt) {
      info = `\nRückgabe: ${opts.rueckgabeOrt}`;
    }
    window.letzteOptionen = null;
    origShowNotif(typ2, msg + info);
    return;
  }
  window.letzteOptionen = null;
  origShowNotif(typ2, msg);
};


// Karten werden asynchron geladen, daher MutationObserver statt DOMContentLoaded.
// Sobald Karten im DOM sind, kommen Bilder und Suchformulare dazu.

(function() {
  const hGrid = document.getElementById('hotelGrid');
  if (hGrid) {
    new MutationObserver((_, obs) => {
      if (!loadedData.hotels?.length) return;
      obs.disconnect();
      hotelUIEinfuegen();
      hotelKartenRendern(loadedData.hotels);
    }).observe(hGrid, { childList: true });
  }

  const fGrid = document.getElementById('flightGrid');
  if (fGrid) {
    new MutationObserver((_, obs) => {
      if (!loadedData.flights?.length) return;
      obs.disconnect();
      flugUIEinfuegen();
      const sorted = [...loadedData.flights];
      sortFlightsByDisplayInPlace(sorted);
      flugKartenRendern(sorted);
      setTimeout(() => {
        const sel = document.getElementById('fFAirline');
        if (sel && sel.options.length <= 1) {
          [...new Set(loadedData.flights.map(f => f.airline).filter(Boolean))].forEach(a => {
            const o = document.createElement('option');
            o.value = a; o.textContent = a;
            sel.appendChild(o);
          });
        }
      }, 100);
    }).observe(fGrid, { childList: true });
  }

  const aGrid = document.getElementById('rentalGrid');
  if (aGrid) {
    new MutationObserver((_, obs) => {
      if (!loadedData.rentals?.length) return;
      obs.disconnect();
      autoUIEinfuegen();
      autoKartenRendern(loadedData.rentals);
    }).observe(aGrid, { childList: true });
  }

  const bGrid = document.getElementById('ratingGrid');
  if (bGrid) {
    new MutationObserver((_, obs) => {
      if (!rawRatings?.length) return;
      obs.disconnect();
      bewertungsbilderLaden();
      if (loadedData.hotels?.length) hotelKartenRendern(loadedData.hotels);
    }).observe(bGrid, { childList: true });
  }

  const pGrid = document.getElementById('paketGrid');
  if (pGrid) {
    new MutationObserver(() => paketeBilderLaden()).observe(pGrid, { childList: true });
  }
})();


// BEWERTUNGS-MODAL: ID-Textfeld durch Dropdown ersetzen
// So muss der Nutzer keine MongoDB-ID eintippen sondern wahlt direkt das Hotel/Flug/Auto

function bewertungsDropdownBefuellen() {
  const typ = document.getElementById('ratingServiceTyp')?.value;
  const sel = document.getElementById('ratingServiceId');
  if (!sel || !typ) return;

  // Bestehende Optionen löschen
  sel.innerHTML = '<option value="">Bitte wählen ...</option>';

  if (typ === 'hotel' || typ === 'flug' || typ === 'mietwagen') {
    let items = [];
    if (typ === 'hotel')     items = loadedData.hotels  || [];
    if (typ === 'flug')      items = loadedData.flights  || [];
    if (typ === 'mietwagen') items = loadedData.rentals  || [];

    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item._id;
      if (typ === 'hotel')     opt.textContent = item.name + ' - ' + item.ort;
      if (typ === 'flug')      opt.textContent = item.abflugort + ' nach ' + item.zielort + ' (' + item.airline + ') - ' + flugDatum(item.abflugzeit);
      if (typ === 'mietwagen') opt.textContent = item.marke + ' ' + item.modell + ' - ' + item.ort;
      sel.appendChild(opt);
    });
  }

  if (typ === 'paket') {
    // Pakete haben keine eigene ID - wir nutzen die Flug-ID als Kennung
    (packageList || []).forEach((pkg, i) => {
      const opt = document.createElement('option');
      opt.value = pkg.flight?._id || i;
      opt.textContent = 'Paket ' + (pkg.destination || pkg.flight?.zielort || i+1) +
        (pkg.hotel ? ' - ' + pkg.hotel.name : '') +
        (pkg.flight ? ' - ' + pkg.flight.abflugort + ' nach ' + pkg.flight.zielort : '');
      sel.appendChild(opt);
    });
  }
}

function bewertungsTypDropdownErweitern() {
  const typSel = document.getElementById('ratingServiceTyp');
  if (!typSel) return;
  // Paket hinzufügen falls noch nicht vorhanden
  if (![...typSel.options].find(o => o.value === 'paket')) {
    const opt = document.createElement('option');
    opt.value = 'paket';
    opt.textContent = 'Paket';
    typSel.appendChild(opt);
  }
}

function bewertungsModalUpgrade() {
  const input = document.getElementById('ratingServiceId');
  if (!input || input.tagName === 'SELECT') return;

  // Textfeld durch Select ersetzen
  const sel = document.createElement('select');
  sel.id = 'ratingServiceId';
  sel.required = true;
  sel.style.cssText = input.style.cssText || 'width:100%;';
  // Gleiche CSS-Klassen übernehmen
  sel.className = input.className;
  input.replaceWith(sel);

  // Beim Wechsel des Typs Dropdown neu befuellen
  const typSel = document.getElementById('ratingServiceTyp');
  if (typSel) typSel.addEventListener('change', bewertungsDropdownBefuellen);

  bewertungsDropdownBefuellen();
}

// openRatingModal patchen
const origOpenRatingModal = window.openRatingModal;
if (origOpenRatingModal) {
  window.openRatingModal = function() {
    origOpenRatingModal();
    setTimeout(() => { bewertungsTypDropdownErweitern(); bewertungsModalUpgrade(); }, 50);
  };
} else {
  // Falls openRatingModal nicht direkt verfügbar, Modal-Öffner-Button beobachten
  document.addEventListener('click', function(ev) {
    if (ev.target?.textContent?.includes('BEWERTUNG SCHREIBEN') ||
        ev.target?.closest('button')?.textContent?.includes('BEWERTUNG SCHREIBEN')) {
      setTimeout(bewertungsModalUpgrade, 100);
    }
  });
}