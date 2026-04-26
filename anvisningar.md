# Tekniska Specifikationer för Spel-Grabbarna (Uppdaterad)

Detta dokument beskriver webbspelet "Spel-Grabbarna" i detalj för att möjliggöra en exakt rekonstruktion med hjälp av AI.

## 1. Övergripande Arkitektur
*   **Teknikstack**: Ren HTML5, CSS3 och Vanilla JavaScript.
*   **Struktur**: Single Page Application (SPA) med hash-baserad routing (`#screen-id`).
*   **Persistence**: `localStorage` sparar poäng, nivåer, köpta föremål och inställningar.
*   **Centraliserad Logik**: All poängutdelning sker via `addScore(points)` metoden som synkroniserar HUD och sparar tillståndet direkt.

## 2. Designsystem (UI/UX)
*   **Estetik**: Glassmorphism, runda hörn, Fredoka-typsnitt för lekfull känsla.
*   **HUD (Header)**: 
    *   **Vänster**: Hem-knapp (🏠) och Bakåt-knapp (⬅️).
    *   **Mitten**: Barnets valda avatar, namn och vald svårighetsgrad (med ikon och färg).
    *   **Höger**: Guldstjärnor (Poäng) och **Hjälte-Nivå** med XP-mätare (progression).
*   **Svårighetsgrad**: Valet visas som en numrerad vertikal lista (1-5) för tydlig progression.
*   **Interaktivitet**: "Poppande" animationer vid poängutdelning och menyval. Hover-effekter på alla klickbara kort.

## 3. Belöningssystem & Progression
*   **Stjärn-butik (Shop)**:
    *   Här kan barnet köpa nya avatars och låsa upp nya minispel.
    *   Föremål som köps utrustas/låses upp direkt.
*   **Poängregler**:
    *   **Lärande Spel**: 1 poäng per rätt svar/steg, 5 poäng för avklarad bana/runda.
    *   **Matte-Multiplikator**: Minus (-) ger 2x poäng, Gånger (x) ger 3x poäng för både steg och vinst.
    *   **Roliga Minispel**: Fast belöning på 2 poäng vid vinst.
    *   **Hjälte-Nivå**: Varje 20:e avklarat spel ökar "Hjälte-Nivån" permanent.

## 4. Spellägen
### Lärande (Matte, Ord & Bokstäver)
*   **Stava Ordet**: Sekventiell stavning med emojis. 1pt/bokstav, 5pt/ord.
*   **Hitta Bokstaven**: Sök efter bokstäver i en rörig miljö. Nu med rörelse/rotation som kan slås av/på.
*   **Pingvinhopp (Matte)**: Räkna ut tal och hoppa på isberg. 10 rundor per spelomgång. Isbergen har anti-kollisionslogik.
*   **Mata Djuren**: Räkna och mata djur med rätt antal frukter.
*   **Prick till Prick**: Koppla ihop siffror för att rita figurer. 10 figurer per omgång.
*   **Ljuda Ord & Rabbla Bokstäver**: Automatiserat stöd för att lära sig bokstavsljud och alfabetet.
*   **Memory**: Matcha par av bokstäver/bilder.

### Roliga Minispel & Liv-system
I nästan alla arkadspel finns nu ett liv-system (max 5 ❤️). Man kan fånga hjärtan för att få extraliv. Om man redan har fullt liv ger hjärtan en **Superbonus**.
*   **Hjälte-Hoppet**: Sidescroller äventyr. Fånga hjärtan i luften.
*   **Racer-Robban**: Undvik bilar. Hjärtan dyker upp på vägen.
*   **Frukt-Frossa**: Fånga fallande frukt. Hjärtan faller sällsynt.
*   **Hammar-Hjälten**: Whack-a-mole. Poffa hjärtan för liv!
*   **Rymd-Räddaren**: Skjut asteroider. Rädda hjärtan i rymden.
*   **Bubbel-Bus**: Poppa bubblor innan de når toppen.
*   **Ballongjakten**: Klassisk poppa-ballonger. Ballongerna studsar mot kanterna.

### Berättelser (Stories)
*   **Dynamisk Injektion**: Barnets namn blir huvudpersonen i sagorna.
*   **Ord-fokus**: När man hovrar över ett ord förstoras det 30% med vit bakgrund för att inte dölja annan text.
*   **Tangentbordsstöd**: Bläddra framåt/bakåt mellan orden med piltangenterna.

## 5. Admin-meny (⚙️)
*   **Spel-lås**: Möjlighet att manuellt låsa eller låsa upp alla spel (fusk/test).
*   **Inställningar**: Justera svårighet, fart, spawn-rates och meddelandetider.
*   **Nollställning**: "Farlig zon" för att radera all data (poäng, köp, nivåer) och börja om från noll.

## 6. Uppmuntran
*   **Toast-meddelanden**: Slumpmässiga hejarop (t.ex. "Snyggt jobbat Liam, vilken stjärna!").
*   **Ljud**: (Planerat/Implementerat) Stöd för röstuppläsning av ord.
