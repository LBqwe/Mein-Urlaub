// updateFlights.js
// Ausführen: node updateFlights.js
// Ablegen in: Mein_Urlaub-main\FlightConnectionsMS\

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://anna:CIpwqOE33YQ1WUaR@cluster0.gu4mcij.mongodb.net/flightdb?appName=Cluster0';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Verbunden mit Atlas');

  const db = mongoose.connection.db;
  const flights = await db.collection('flights').find().toArray();
  console.log(`${flights.length} Flüge gefunden`);

  for (const f of flights) {
    const abflug  = new Date(f.abflugzeit);
    const ankunft = new Date(f.ankunftzeit);
    const diff    = ankunft - abflug;

    abflug.setFullYear(2026);
    abflug.setMonth(6); // Juli

    const neueAnkunft = new Date(abflug.getTime() + diff);

    await db.collection('flights').updateOne(
      { _id: f._id },
      { $set: { abflugzeit: abflug, ankunftzeit: neueAnkunft } }
    );
    console.log(`✓ ${f.flugnummer} → ${abflug.toLocaleDateString('de-DE')}`);
  }

  console.log('\nFertig! Alle Flüge auf Juli 2026.');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });