// reisen.js – Buchungsoptionen in Meine Reisen anzeigen
// Liest aus localStorage (dort gespeichert beim Buchen)

window.addEventListener('load', () => {
  const origBuild = window.buildDetailHtml;
  if (!origBuild) return;

  window.buildDetailHtml = function(b) {
    const base = origBuild(b);

    // Buchungsoptionen aus localStorage lesen
    let buch = null;
    try {
      const alle = JSON.parse(localStorage.getItem('buchungsOptionen') || '{}');
      buch = alle[b.serviceId] || b.details?._buchung || null;
    } catch(e) {}

    if (!buch) return base;

    const zeile = (k, v) =>
      `<div class="bd-row"><span class="bd-key">${k}</span><span class="bd-val">${v}</span></div>`;

    let extra = '';
    const isPaket = !!b.details?.paketRabatt;

    if (b.serviceTyp === 'hotel' || isPaket) {
      if (buch.erwachsene) extra += zeile('Erwachsene', buch.erwachsene);
      if (buch.kinder)     extra += zeile('Kinder',     buch.kinder);
      if (buch.zimmer)     extra += zeile('Zimmer',     buch.zimmer);
    }
    if (b.serviceTyp === 'flug' && !isPaket) {
      if (buch.personen) extra += zeile('Passagiere', buch.personen);
      if (buch.klasse)   extra += zeile('Kabinenklasse', ({
        economy:  'Economy',
        premium:  'Premium Economy',
        business: 'Business Class',
        first:    'First Class'
      })[buch.klasse] || buch.klasse);
    }
    if (b.serviceTyp === 'mietwagen') {
      if (buch.rueckgabeOrt) extra += zeile('Rückgabeort', buch.rueckgabeOrt);
    }

    if (!extra) return base;

    return base
      + '<div class="bd-divider"></div>'
      + '<p class="bd-label">Buchungsoptionen</p>'
      + extra;
  };
});