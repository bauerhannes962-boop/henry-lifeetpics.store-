# HENRYHUB – Website für henry-lifeetpics.store

Neuer Entwurf (Orange/Schwarz, inspiriert von bekannten Video-Portalen, aber mit eigenem HenryHub-Branding). Eine komplett statische Website: `index.html`, `styles.css`, `script.js`. Keine Datenbank nötig.

## Starten
1. ZIP entpacken.
2. `index.html` im Browser öffnen.
3. Für deine Domain **den gesamten Ordner-Inhalt** in den öffentlichen Webspace (oft `public_html/` oder `www/`) hochladen. `index.html` gehört direkt ins Web-Root.
4. Die Bilder `fuss1.png` bis `fuss8.png` in `assets/images/` legen. Bis dahin sieht man absichtlich gestaltete Placeholder. Optimal sind Querformatbilder 16:9 mit mindestens 1280×720 Pixeln.

## Anpassungen
* **Discord-Name**: ganz oben in `script.js` `const DISCORD_USERNAME = 'antcn'` ändern, falls nötig.
* **Produkte/Preise**: in `script.js` den Block `const PRODUCTS = [...]` bearbeiten. Die derzeitigen Produkte und Preise sind frei erfundene **Beispiele**, keine echten Angebote.
* **Logo/Domain**: in `index.html` und auf den rechtlichen Seiten. Favicon in `assets/favicon.svg`.
* **Audio-Easter-Egg**: 5-mal schnell auf das HenryHub-Logo klicken. Die Audiodatei liegt in `assets/audio/henry-secret.mp3` (aus deiner Uploaddatei übernommen).
* **Weiteres Easter Egg**: ↑ ↑ ↓ ↓ ← → ← → B A öffnet einen versteckten Comedy-Bildschirm. `/` fokussiert die Suche.

## Funktionen
* Schnellsuche, Kategorien und Preis-/Alphabet-/Popularitäts-Sortierung.
* Produktdetail-Ansicht, Favoriten und Merkliste (via Browser Local Storage, ohne Backend).
* Discord-Anfrage: gewählte Produkte und Beispielpreise werden automatisch in einen kopierbaren Nachrichtentext eingefügt. Danach Discord selbst öffnen und `@antcn` anschreiben.
* Responsive für Desktop, Tablet und Handy; Tastaturbedienung inklusive ESC zum Schließen.
* Keine echte Alterskontrolle, keine Bild-/Video-Streams, kein Bezahlungs- oder Liefermechanismus.

## Vor öffentlichem Verkauf
* Impressum und Datenschutz: Platzhalter **vor der Veröffentlichung** durch echte Angaben ersetzen.
* Rechtliche Verkaufsinformationen, konkrete Nutzungsrechte für Digitalfotos, Zahlungsabwicklung, Verbraucherinformationen und Alters-/Jugendschutz selbst prüfen, falls benötigt.
* Die Website enthält externe Google Fonts als optionale optische Verbesserung. Für vollständigen Offline-Betrieb `@import` in CSS entfernen.

Es handelt sich um ein eigenes Comedy-Design; keine Logos/Bilder/Quellcodes der referenzierten Plattform werden verwendet.
