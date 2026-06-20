// Seed-Skript: Füllt alle Datenbanken mit Beispieldaten
// Ausführen mit: node seed.js (aus dem Root-Verzeichnis)

const mongoose = require('./HotelMS/node_modules/mongoose');
const bcrypt   = require('./UserMS/node_modules/bcrypt');

const HOTEL_URI  = 'mongodb+srv://anna:CIpwqOE33YQ1WUaR@cluster0.gu4mcij.mongodb.net/hoteldb?appName=Cluster0';
const FLIGHT_URI = 'mongodb+srv://anna:CIpwqOE33YQ1WUaR@cluster0.gu4mcij.mongodb.net/flightdb?appName=Cluster0';
const RENTAL_URI = 'mongodb+srv://anna:CIpwqOE33YQ1WUaR@cluster0.gu4mcij.mongodb.net/rentaldb?appName=Cluster0';
const RATING_URI = 'mongodb+srv://anna:CIpwqOE33YQ1WUaR@cluster0.gu4mcij.mongodb.net/ratingdb?appName=Cluster0';
const USER_URI   = 'mongodb+srv://anna:CIpwqOE33YQ1WUaR@cluster0.gu4mcij.mongodb.net/userdb?appName=Cluster0';

// ── Schemas ──────────────────────────────────────────────────────────────────

const hotelSchema = new mongoose.Schema({
  name: String, ort: String, land: String,
  sterne: Number, preisProNacht: Number, beschreibung: String
}, { timestamps: true });

const flightSchema = new mongoose.Schema({
  flugnummer: String, abflugort: String, zielort: String,
  abflugzeit: Date, ankunftzeit: Date, airline: String, preis: Number
}, { timestamps: true });

const rentalSchema = new mongoose.Schema({
  marke: String, modell: String, ort: String,
  preisProTag: Number, verfuegbar: Boolean, kategorie: String
}, { timestamps: true });

const ratingSchema = new mongoose.Schema({
  serviceTyp: String, serviceId: String,
  bewertung: Number, kommentar: String, autor: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: String, password: String, role: String,
  email: String, wohnort: String, telefon: String, adresse: String
}, { timestamps: true });

// ── Beispieldaten ─────────────────────────────────────────────────────────────

const hotels = [
  { name: 'Hotel Adlon Kempinski', ort: 'Berlin', land: 'Deutschland', sterne: 5, preisProNacht: 350, beschreibung: 'Legendäres Luxushotel direkt am Brandenburger Tor.' },
  { name: 'Bayerischer Hof', ort: 'München', land: 'Deutschland', sterne: 5, preisProNacht: 290, beschreibung: 'Traditionsreiches Grandhotel im Herzen Münchens.' },
  { name: 'Motel One Hamburg', ort: 'Hamburg', land: 'Deutschland', sterne: 3, preisProNacht: 79, beschreibung: 'Modernes Design-Budget-Hotel in zentraler Lage.' },
  { name: 'Ibis Frankfurt City', ort: 'Frankfurt', land: 'Deutschland', sterne: 3, preisProNacht: 89, beschreibung: 'Praktisches Stadthotel nahe Messe und Bahnhof.' },
  { name: 'Hotel Arts Barcelona', ort: 'Barcelona', land: 'Spanien', sterne: 5, preisProNacht: 420, beschreibung: 'Ikonisches Hochhaus direkt am Strand von Barcelona.' },
  { name: 'NH Collection Madrid', ort: 'Madrid', land: 'Spanien', sterne: 4, preisProNacht: 145, beschreibung: 'Elegantes Hotel im Zentrum Madrids, nahe dem Prado.' },
  { name: 'Hotel Danieli', ort: 'Venedig', land: 'Italien', sterne: 5, preisProNacht: 510, beschreibung: 'Palazzo-Hotel aus dem 14. Jahrhundert am Canal Grande.' },
  { name: 'Boscolo Lyon', ort: 'Lyon', land: 'Frankreich', sterne: 4, preisProNacht: 175, beschreibung: 'Belle-Époque-Hotel im gastronomischen Herzen Frankreichs.' },
  { name: 'The Student Hotel Vienna', ort: 'Wien', land: 'Österreich', sterne: 3, preisProNacht: 95, beschreibung: 'Trendiges Hybrid-Hotel für junge Reisende.' },
  { name: 'Falkensteiner Schlosshotel', ort: 'Velden', land: 'Österreich', sterne: 5, preisProNacht: 380, beschreibung: 'Romantisches Schlosshotel direkt am Wörthersee.' },
];

const now = new Date('2025-06-15T08:00:00Z');
const flights = [
  { flugnummer: 'LH100', abflugort: 'Frankfurt', zielort: 'Berlin', airline: 'Lufthansa', abflugzeit: new Date('2025-06-15T06:00:00Z'), ankunftzeit: new Date('2025-06-15T07:05:00Z'), preis: 89 },
  { flugnummer: 'LH204', abflugort: 'München', zielort: 'Barcelona', airline: 'Lufthansa', abflugzeit: new Date('2025-06-15T09:30:00Z'), ankunftzeit: new Date('2025-06-15T11:45:00Z'), preis: 149 },
  { flugnummer: 'FR812', abflugort: 'Frankfurt', zielort: 'Mallorca', airline: 'Ryanair', abflugzeit: new Date('2025-06-16T06:15:00Z'), ankunftzeit: new Date('2025-06-16T08:30:00Z'), preis: 49 },
  { flugnummer: 'EW455', abflugort: 'Düsseldorf', zielort: 'Wien', airline: 'Eurowings', abflugzeit: new Date('2025-06-16T14:00:00Z'), ankunftzeit: new Date('2025-06-16T15:35:00Z'), preis: 79 },
  { flugnummer: 'BA726', abflugort: 'Berlin', zielort: 'London', airline: 'British Airways', abflugzeit: new Date('2025-06-17T07:20:00Z'), ankunftzeit: new Date('2025-06-17T08:45:00Z'), preis: 199 },
  { flugnummer: 'IB301', abflugort: 'Frankfurt', zielort: 'Madrid', airline: 'Iberia', abflugzeit: new Date('2025-06-17T11:10:00Z'), ankunftzeit: new Date('2025-06-17T13:25:00Z'), preis: 159 },
  { flugnummer: 'LH938', abflugort: 'München', zielort: 'Venedig', airline: 'Lufthansa', abflugzeit: new Date('2025-06-18T08:45:00Z'), ankunftzeit: new Date('2025-06-18T09:55:00Z'), preis: 129 },
  { flugnummer: 'U21774', abflugort: 'Berlin', zielort: 'Lyon', airline: 'EasyJet', abflugzeit: new Date('2025-06-18T16:30:00Z'), ankunftzeit: new Date('2025-06-18T18:50:00Z'), preis: 69 },
  { flugnummer: 'OS101', abflugort: 'Hamburg', zielort: 'Wien', airline: 'Austrian Airlines', abflugzeit: new Date('2025-06-19T13:00:00Z'), ankunftzeit: new Date('2025-06-19T14:40:00Z'), preis: 119 },
  { flugnummer: 'FR2201', abflugort: 'Köln', zielort: 'Barcelona', airline: 'Ryanair', abflugzeit: new Date('2025-06-20T07:05:00Z'), ankunftzeit: new Date('2025-06-20T09:20:00Z'), preis: 55 },
];

const rentals = [
  { marke: 'Volkswagen', modell: 'Golf', ort: 'Frankfurt', preisProTag: 45, verfuegbar: true, kategorie: 'Klein' },
  { marke: 'BMW', modell: '3er', ort: 'München', preisProTag: 75, verfuegbar: true, kategorie: 'Mittel' },
  { marke: 'Mercedes-Benz', modell: 'C-Klasse', ort: 'Berlin', preisProTag: 85, verfuegbar: true, kategorie: 'Mittel' },
  { marke: 'Audi', modell: 'Q5', ort: 'Hamburg', preisProTag: 110, verfuegbar: true, kategorie: 'SUV' },
  { marke: 'Porsche', modell: 'Cayenne', ort: 'München', preisProTag: 250, verfuegbar: true, kategorie: 'Luxus' },
  { marke: 'Renault', modell: 'Clio', ort: 'Frankfurt', preisProTag: 38, verfuegbar: true, kategorie: 'Klein' },
  { marke: 'Ford', modell: 'Kuga', ort: 'Berlin', preisProTag: 95, verfuegbar: false, kategorie: 'SUV' },
  { marke: 'Opel', modell: 'Astra', ort: 'Köln', preisProTag: 55, verfuegbar: true, kategorie: 'Mittel' },
  { marke: 'Toyota', modell: 'RAV4', ort: 'Hamburg', preisProTag: 99, verfuegbar: true, kategorie: 'SUV' },
  { marke: 'Tesla', modell: 'Model 3', ort: 'Berlin', preisProTag: 120, verfuegbar: true, kategorie: 'Mittel' },
];

// ── Seed-Logik ────────────────────────────────────────────────────────────────

// Löscht und ersetzt eine Collection vollständig (für Hotel, Flug, Mietwagen, Bewertungen)
async function seedCollection(uri, modelName, schema, data, label) {
  const conn = await mongoose.createConnection(uri).asPromise();
  const Model = conn.model(modelName, schema);
  await Model.deleteMany({});
  const inserted = await Model.insertMany(data);
  console.log(`✓ ${label}: ${inserted.length} Einträge eingefügt`);
  await conn.close();
  return inserted;
}

// Legt User nur an wenn noch nicht vorhanden — bestehende IDs bleiben erhalten
// so gehen Buchungen beim erneuten Seed nicht verloren
async function seedUsers(uri, schema, users, label) {
  const conn  = await mongoose.createConnection(uri).asPromise();
  const Model = conn.model('User', schema);
  let created = 0, skipped = 0;
  for (const u of users) {
    const exists = await Model.findOne({ username: u.username });
    if (exists) {
      skipped++;
    } else {
      await Model.create(u);
      created++;
    }
  }
  console.log(`✓ ${label}: ${created} neu angelegt, ${skipped} bereits vorhanden (ID erhalten)`);
  await conn.close();
}

async function main() {
  console.log('\nStarte Seed-Prozess...\n');

  const insertedHotels  = await seedCollection(HOTEL_URI,  'Hotel',     hotelSchema,  hotels,  'Hotels');
  const insertedFlights = await seedCollection(FLIGHT_URI, 'Flight',    flightSchema, flights, 'Flüge');
  const insertedRentals = await seedCollection(RENTAL_URI, 'RentalCar', rentalSchema, rentals, 'Mietwagen');

  // Bewertungen mit echten IDs aus den eingefügten Datensätzen
  const ratings = [
    { serviceTyp: 'hotel',     serviceId: insertedHotels[0]._id.toString(),  bewertung: 5, kommentar: 'Traumhaft! Service und Lage sind unschlagbar.', autor: 'Maria S.' },
    { serviceTyp: 'hotel',     serviceId: insertedHotels[1]._id.toString(),  bewertung: 4, kommentar: 'Sehr elegantes Hotel, Frühstück war outstanding.', autor: 'Thomas K.' },
    { serviceTyp: 'hotel',     serviceId: insertedHotels[4]._id.toString(),  bewertung: 5, kommentar: 'Direkt am Strand, modernes Design – absolut empfehlenswert!', autor: 'Julia W.' },
    { serviceTyp: 'hotel',     serviceId: insertedHotels[6]._id.toString(),  bewertung: 5, kommentar: 'Venedig ist sowieso magisch, das Hotel macht es noch besser.', autor: 'Andreas M.' },
    { serviceTyp: 'hotel',     serviceId: insertedHotels[2]._id.toString(),  bewertung: 3, kommentar: 'Gutes Preis-Leistungs-Verhältnis, aber etwas laut.', autor: 'Sandra L.' },
    { serviceTyp: 'flug',      serviceId: insertedFlights[0]._id.toString(), bewertung: 4, kommentar: 'Pünktlich, sauberes Flugzeug, freundliches Personal.', autor: 'Peter H.' },
    { serviceTyp: 'flug',      serviceId: insertedFlights[1]._id.toString(), bewertung: 5, kommentar: 'Hervorragender Flug, mehr Beinfreiheit als erwartet.', autor: 'Lisa B.' },
    { serviceTyp: 'flug',      serviceId: insertedFlights[2]._id.toString(), bewertung: 2, kommentar: 'Verzögerung von 45 Minuten, kein kostenloses Gepäck.', autor: 'Klaus F.' },
    { serviceTyp: 'mietwagen', serviceId: insertedRentals[1]._id.toString(), bewertung: 5, kommentar: 'BMW wie immer top! Fahrspaß pur durch Bayern.', autor: 'Markus T.' },
    { serviceTyp: 'mietwagen', serviceId: insertedRentals[9]._id.toString(), bewertung: 4, kommentar: 'Tesla ist eine andere Welt – leise und sehr komfortabel.', autor: 'Nina R.' },
  ];

  await seedCollection(RATING_URI, 'Rating', ratingSchema, ratings, 'Bewertungen');

  // User-Accounts: upsert-Logik — bestehende User bleiben mit ihrer ID erhalten
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash  = await bcrypt.hash('user123', 10);
  const users = [
    { username: 'admin', password: adminHash, role: 'admin', email: 'admin@meinurlaub.de', wohnort: 'Heilbronn', telefon: '+49 7131 000000', adresse: 'DHBW Straße 1' },
    { username: 'user',  password: userHash,  role: 'user',  email: 'user@meinurlaub.de',  wohnort: 'Heilbronn', telefon: '+49 7131 111111', adresse: 'Musterstraße 1' },
  ];
  await seedUsers(USER_URI, userSchema, users, 'User-Accounts');

  console.log('\nZugangsdaten:');
  console.log('  Admin →  Benutzername: admin   | Passwort: admin123');
  console.log('  User  →  Benutzername: user    | Passwort: user123');
  console.log('\nSeed abgeschlossen!\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Seed-Fehler:', err.message);
  process.exit(1);
});
