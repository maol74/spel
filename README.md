# Spel-Grabbarna 🎮👦👦

Ett interaktivt, roligt och pedagogiskt webbaserat äventyr skapat för barn (specifikt William och Liam) för att öva på bokstäver, läsning, siffror och logik! Projektet är byggt i modern Vanilla JavaScript, HTML5 och CSS3 och körs helt i webbläsaren.

---

## 🌟 Komplett översikt över Spel & Funktioner

Här är en lista över allt som finns i Spel-Grabbarna:

### 🔤 Språk- & Bokstavsspel
Dessa spel fokuserar på bokstäver, fonetik, ord och läsning.
*   **🗣️ Bokstav-Rabbla (`GameRabbla`)**: Rabbla bokstäver i ett visst tempo. Innehåller anpassningsbara "fokuslistor" (som sparas lokalt) så man kan mata specifika bokstäver man behöver öva extra på.
*   **🎣 Bokstavs-Fisket (`GameFishing`)**: Fiska upp rätt bokstäver i vattnet. Fiskarna simmar i alla riktningar och fel bokstav förvandlas till en bitande piraya.
*   **🚂 Bokstavs-Tåget (`GameTrain`)**: Fyll i den bokstav som saknas i ordningsföljden på tågvagnarna.
*   **✍️ Bokstavs-Spåraren (`GameTracing`)**: Öva på att skriva bokstäver genom att följa och klicka på ett numrerat spår i rätt ordning.
*   **🌀 Bokstavs-Labyrinten (`GameMaze`)**: Navigera genom en labyrint genom att endast kliva på brickor med den sökta bokstaven. Samla bonusstjärnor på vägen.
*   **🔠 Hitta Bokstaven (`HittaBokstaven`)**: Klassisk övning i att urskilja en specifik bokstav i ett rutnät av andra, liknande bokstäver.
*   **📝 Bokstavs-Stavaren (`StavaOrd`)**: Dra och släpp rätt bokstäver på rätt plats för att stava korta ord kopplade till bilder.
*   **🅰️ Första Bokstaven (`GameFirstLetter`)**: Känn igen vilken bokstav ett visst ord (eller bild) börjar på.
*   **🅰️/🅱️ Vokal-Fångaren (`GameVokal`)**: Träna på att urskilja vad som är vokaler och vad som är konsonanter.
*   **🎵 Ljuda Ord (`GameLjuda`)**: Öva på ljudning och hur bokstavsljud sätts ihop till korta ord.
*   **🧩 Bygg Meningar (`GameMening`)**: Sätt ihop enklare meningar i rätt ordning.
*   **🎶 Rimmaren (`GameRim`)**: Para ihop de ord och bilder som rimmar på varandra.

### 🔢 Matte- & Logikspel
Spel som tränar siffror, problemlösning och logiskt tänkande.
*   **🐧 Pingvin-Matte (`MathGames`)**: Hjälp pingvinen genom att räkna plus och minus på isflaken.
*   **🦁 Mata Djuren (`MathGames`)**: Träna på siffror genom att ge rätt antal matbitar till djuren.
*   **🔢 Prick till Prick (`MathGames`)**: Dra streck mellan siffror i rätt ordning för att måla fram en bild.
*   **⌚ Klockan (`GameKlocka`)**: Lär dig hur analog och digital tid fungerar.
*   **🛣️ Väg-Byggaren (`GameVag`)**: Logikpussel där man ska rotera och lägga vägbitar rätt för att bilen/tåget ska kunna komma i mål.
*   **🧠 Memory (`GameMemory`)**: Klassiskt minnesspel med både bokstäver och bilder.
*   **🫣 Gömma-Spelet (`GameGomma`)**: Hitta dolda föremål (spatial förmåga och uppmärksamhet).

### ⚡ Action- & Arkadspel
Spel med högre tempo där snabbhet och reflexer tränas tillsammans med kunskap.
*   **🏎️ Bokstavs-Racet (`GameRace`)**: Tävla med en bil. Ju snabbare och mer rätt du svarar på frågor, desto fortare kör bilen.
*   **🎈 Ballong-Popparen (`GamePop`)**: Poppa ballongerna som flyger uppåt innan de försvinner, men bara de med rätt svar!
*   **🧺 Fånga-Spelet (`GameCatch`)**: Styr en korg i botten av skärmen och fånga de fallande bokstäverna/siffrorna.
*   **🔨 Mullvads-Spelet (`GameWhack`)**: Banka mullvaden ("Whack-a-mole") som håller upp rätt svar.
*   **🚀 Rymd-Äventyret (`GameSpace`)**: Åk rymdskepp, undvik asteroider och samla/skjut på rätt kunskapsmål.
*   **🫧 Bubbel-Spelet (`GameBubble`)**: Skjut bubblor för att para ihop rätt färger, siffror eller bokstäver.
*   **👾 Mata Monstret (`GameMonster`)**: Sortera fram rätt mat (eller ord/bokstäver) till det krävande monstret.

### 🎨 Kreativitet & Äventyr
Fokus på fantasi, lek och belöningar.
*   **🗺️ Äventyrs-Laget (`Adventure`)**: Ett interaktivt brädspel där man rullar en tärning, rör sig på en karta och utför små utmaningar på vägen mot skatten.
*   **🎨 Målarboken (`GameMala`)**: En kreativ hörna för fri målning.
*   **📖 Sagor & Berättelser (`Stories`)**: Läs och lyssna på korta, anpassade sagor (med text-tracking).
*   **🏗️ Kreatören (`Creator`)**: En yta där barnen kan bygga och designa egna små scener.

### ⚙️ System & Underliggande Funktioner
Smarta funktioner som driver spelet bakom kulisserna.
*   **🏆 Belöningssystem & Valuta**: Barnen tjänar XP (erfarenhet) och mynt för allt de gör.
*   **🛍️ Affären (`Shop`)**: Här kan intjänade mynt spenderas på att låsa upp nya avatarer, teman eller klistermärken.
*   **🎡 Lyckohjulet (`Wheel`)**: Ett dagligt snurr där man drar i en spak och snurrar hjulet för att vinna bonusmynt. Helt slumpmässigt och drivet av fysik-animationer.
*   **👤 Profiler & Avatarer (`Profile`)**: Egen inloggning och avatar per barn, vilket gör att William och Liam får sin egen progress och sina egna XP-mätare.
*   **🏅 Dagliga Uppdrag (Daily Quests)**: Tre slumpmässiga uppdrag per dag (t.ex. "Spela 3 omgångar memory") som ger bonus när de slutförs.
*   **💾 Local Storage**: Spelet kräver inget nätverk/databas för sparfiler. Alla framsteg, upplåsningar, insamlade mynt och inställningar sparas tryggt direkt i enhetens webbläsare.
*   **🔒 Admin-panel (`Admin`)**: En skyddad föräldravy där du kan styra tempot, nollställa sparfiler, och finjustera vilka bokstäver/mattenivåer spelen ska fokusera på.

---

## 🛠️ Teknik & Arkitektur

*   **Inga ramverk:** Byggt helt utan tunga ramverk (React/Vue/Angular) för maximal prestanda och enkelhet.
*   **Komponentbaserat:** JS-koden är uppdelad i moduler/komponenter (t.ex. `GameRabbla.js`, `GameFishing.js`) som utökar den centrala `App`-klassen via `Object.assign(App.prototype, {...})`.

## 🚀 Kom igång

Eftersom projektet består av statiska filer behöver du ingen bygg-process (build step).
1. Klona repot.
2. Öppna `index.html` direkt i din webbläsare, eller kör en enkel lokal webbserver (t.ex. `npx serve` eller Live Server i VS Code).
3. Börja spela!

