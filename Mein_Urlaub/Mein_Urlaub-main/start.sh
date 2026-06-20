#!/bin/bash
cd /workspaces/Mein_Urlaub/HotelMS && nohup node app.js > /tmp/hotel.log 2>&1 &
cd /workspaces/Mein_Urlaub/FlightConnectionsMS && nohup node app.js > /tmp/flight.log 2>&1 &
cd /workspaces/Mein_Urlaub/RentalCarMS && nohup node app.js > /tmp/rental.log 2>&1 &
cd /workspaces/Mein_Urlaub/RatingMS && nohup node app.js > /tmp/rating.log 2>&1 &
cd /workspaces/Mein_Urlaub/UserMS && nohup node app.js > /tmp/user.log 2>&1 &
echo "Alle Services gestartet!"