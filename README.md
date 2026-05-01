# Spel-Grabbarna 🎮👦👦

Ett interaktivt, roligt och pedagogiskt webbaserat äventyr skapat för barn (specifikt William och Liam) för att öva på bokstäver, läsning, siffror och logik! Projektet är byggt i modern Vanilla JavaScript, HTML5 och CSS3 och körs helt i webbläsaren.

## 🌟 Funktioner & Minispel

Plattformen innehåller en mängd olika minispel som gör inlärning till en lek. Några av de senaste tilläggen inkluderar:

*   **🗣️ Bokstav-Rabbla:** Öva på bokstäver genom att säga dem högt i ett bestämt tempo. Innehåller anpassningsbara **fokuslistor** (som sparas i Local Storage) så att man kan träna extra på bokstäver som är svåra (t.ex. *b, d, p*).
*   **🎣 Bokstavs-Fisket:** Fiska upp rätt bokstäver som simmar runt på skärmen! Men se upp – klickar du på fel bokstav förvandlas den till en hungrig piraya!
*   **🚂 Bokstavs-Tåget:** Hjälp tåget att åka vidare genom att fylla i den bokstav som saknas i vagnarnas ordningsföljd.
*   **✍️ Bokstavs-Spåraren:** Lär dig skriva bokstäver genom att följa ett numrerat spår med musen eller fingret.
*   **🌀 Bokstavs-Labyrinten:** Navigera genom en labyrint genom att endast gå på den rätta bokstaven för att hitta i mål.
*   **🎡 Lyckohjulet & Belöningar:** Tjäna mynt i spelen och snurra hjulet för spännande överraskningar!

## 🛠️ Teknik & Arkitektur

*   **Inga ramverk:** Byggt helt utan tunga ramverk (React/Vue/Angular) för maximal prestanda och enkelhet.
*   **Komponentbaserat:** JS-koden är uppdelad i moduler/komponenter (t.ex. `GameRabbla.js`, `GameFishing.js`) som utökar den centrala `App`-klassen via `Object.assign(App.prototype, {...})`.
*   **Local Storage:** Spelarens framsteg, upplåsta belöningar och inställningar (som fokuslistor i Rabbla) sparas lokalt i webbläsaren.

## 🚀 Kom igång

Eftersom projektet består av statiska filer behöver du ingen bygg-process (build step).
1. Klona repot.
2. Öppna `index.html` direkt i din webbläsare, eller kör en enkel lokal webbserver (t.ex. `npx serve` eller Live Server i VS Code).
3. Börja spela!

## 👨‍💻 Skapat för

Projektet utvecklas löpande med fokus på att skapa en WOW-känsla och lekfull interaktion, med anpassade utmaningar som växer i takt med barnens kunskapsnivå.
