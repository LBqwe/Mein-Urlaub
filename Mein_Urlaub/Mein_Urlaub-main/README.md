# Mein Urlaub

Erstellt im Rahmen der Vorlesung Verteilte Systeme an der DHBW Heilbronn.

**Gruppe:** Lara Buchholz, Anna Harrer, Shania Abdulla


## Projektubersicht

Das System ermoglicht es Nutzern Hotels, Fluge und Mietwagen zu suchen, zu vergleichen, zu bewerten und zu buchen. Ein Adminbereich erlaubt die Verwaltung aller Daten.


## Architektur

Das System besteht aus funf unabhangigen Microservices. Jeder Service hat eine eigene MongoDB-Datenbank und kommuniziert uber eine REST-API. Das Frontend kommuniziert ausschliesslich mit dem UserMS der als zentrales Gateway fungiert.

Frontend
   |
UserMS (Port 3000) --> HotelMS          (Port 3001, hoteldb)
                   --> FlightConnectionsMS (Port 3002, flightdb)
                   --> RentalCarMS      (Port 3003, rentaldb)
                   --> RatingMS         (Port 3004, ratingdb)


## Services

| Service             | Port | Datenbank  | Aufgabe                          |
|---------------------|------|------------|----------------------------------|
| UserMS              | 3000 | userdb     | Gateway, Auth, Buchungen         |
| HotelMS             | 3001 | hoteldb    | Hoteldaten                       |
| FlightConnectionsMS | 3002 | flightdb   | Flugverbindungen                 |
| RentalCarMS         | 3003 | rentaldb   | Mietwagen                        |
| RatingMS            | 3004 | ratingdb   | Bewertungen                      |



## Installation und Start

**Voraussetzungen:** Node.js, npm, MongoDB Atlas Account

1. Repository klonen oder entpacken

2. In jedem Service-Ordner Abhangigkeiten installieren:

cd UserMS && npm install
cd HotelMS && npm install
cd FlightConnectionsMS && npm install
cd RentalCarMS && npm install
cd RatingMS && npm install


3. In jedem Service-Ordner eine `.env` Datei anlegen:

**UserMS/.env**

PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=dein_geheimer_schluessel
HOTEL_SERVICE_URL=http://localhost:3001
FLIGHT_SERVICE_URL=http://localhost:3002
RENTAL_SERVICE_URL=http://localhost:3003
RATING_SERVICE_URL=http://localhost:3004


Die anderen Services benotigen nur `PORT` und `MONGODB_URI`.

4. Alle Services starten (jeweils in einem separaten Terminal):

cd UserMS && node app.js
cd HotelMS && node app.js
cd FlightConnectionsMS && node app.js
cd RentalCarMS && node app.js
cd RatingMS && node app.js



5. Im Browser offnen: `http://localhost:3000`


## Testaccounts

Nach dem Ausfuhren von seed.js stehen folgende Accounts bereit:

| Benutzername | Passwort | Rolle |
|--------------|----------|-------|
| admin        | admin123 | Admin |
| user         | test123  | User  |


## Technologien

- **Backend:** Node.js, Express.js, Mongoose
- **Datenbank:** MongoDB Atlas
- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **Authentifizierung:** JWT (JSON Web Token), bcrypt
- **Externe API:** Unsplash (Bilder fur Karten und Modals)


## Projektstruktur

Mein_Urlaub-main/
├── UserMS/                  Gateway und Authentifizierung
│   ├── models/
│   │   ├── userModel.js
│   │   └── bookingModel.js
│   ├── routes/
│   │   ├── authRouter.js    Login, Registrierung, Profil
│   │   ├── bookingRouter.js Buchungsverwaltung
│   │   ├── hotelProxy.js    Weiterleitung an HotelMS
│   │   ├── flightProxy.js   Weiterleitung an FlightConnectionsMS
│   │   ├── rentalProxy.js   Weiterleitung an RentalCarMS
│   │   └── ratingProxy.js   Weiterleitung an RatingMS
│   └── app.js
├── HotelMS/                 Hotel-Microservice
├── FlightConnectionsMS/     Flug-Microservice
├── RentalCarMS/             Mietwagen-Microservice
├── RatingMS/                Bewertungs-Microservice
├── frontend/
│   ├── admin/               Adminbereich (CRUD)
│   ├── user/
│   │   ├── index.html       Hauptseite fur Nutzer
│   │   ├── booking.js       Frontend-Erweiterungen (Suche, Filter, Bilder)
│   │   └── meine-reisen.html Buchungsubersicht
│   └── styles.css
└── seed.js                  Testdaten fur alle Services
```

## Aufgabenverteilung

**Anna Harrer:** Backend (alle funf Microservices, Datenbankmodelle, Routen, Proxy-Logik, Adminbereich, Testdaten)

**Lara Buchholz:** User-Frontend (Suchformulare, Filter, Buchungsoptionen, Unsplash-Integration, Bewertungsanzeige via booking.js)

**Shania Abdulla:** Dokumentation
