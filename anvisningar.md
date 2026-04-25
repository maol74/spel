# Tekniska Specifikationer för Spel-Grabbarna (Uppdaterad)

Detta dokument beskriver webbspelet "Spel-Grabbarna" i detalj för att möjliggöra en exakt rekonstruktion med hjälp av AI.

## 1. Övergripande Arkitektur
*   **Teknikstack**: Ren HTML5, CSS3 och Vanilla JavaScript.
*   **Struktur**: Single Page Application (SPA).
*   **Navigation**: URL Hash-stöd (`#screen-id`). Tillåter deep-linking och fungerar med webbläsarens bakåt/framåt-knappar samt vid siduppdatering (Refresh).
*   **Persistence**: `localStorage` sparar användarprofil, avatar, svårighetsgrad och poäng.

## 2. Designsystem (UI/UX)
*   **Estetik**: Glassmorphism (`backdrop-filter: blur(10px)`), runda hörn (30-40px), stora ikoner.
*   **HUD (Header)**: 
    *   **Vänster**: Hus-ikon (🏠) – döljs automatiskt på huvudmenyn. Länkar för "Ändra Nivå" och "Byt Spelare".
    *   **Mitten**: Barnets avatar (storlek: 3rem) med en snygg glöd/drop-shadow, namn och aktuell nivå.
    *   **Höger**: Poäng (guldstjärna) och framstegsmätare.
*   **Toast-dialog**: Ersätter `alert()`. Visas i 500ms generellt, men **1500ms** i "Stava Ordet" för att barnet ska hinna läsa uppmuntran.

## 3. Spellägen
### Spel 1: Stava Ordet
*   **Logik**: Barnet måste klicka på bokstäverna i exakt sekventiell ordning.
*   **Svårighetsgrad**: Ordlängden styrs av `Vald Nivå + 2`.
    *   Nivå 1: 3 bokstäver.
    *   Nivå 2: 4 bokstäver.
    *   Nivå 3: 5 bokstäver.
    *   Nivå 4: 6 bokstäver.
    *   Nivå 5: 7+ bokstäver.
*   **Innehåll**: Varje ord har en matchande emoji som visas stort överst.

### Spel 2: Hitta Bokstaven
*   **Mål**: Hitta ett specifikt antal av en mål-bokstav bland 40+ röriga bokstäver.
*   **Detaljer**: Blandar stora och små bokstäver (Versaler och Gemener). Rätt klick animerar bort bokstaven, fel klick tonar ner den.

### Spel 3: Hjälte-Hoppet (Äventyrsspel)
*   **Kontroller**: Pil Upp för att hoppa, Space för att skjuta. Inga knappar på skärmen.
*   **Mål**: Nå **150 poäng** för att vinna.
*   **Hinder & Fiender**:
    *   **Markdjur & Lådor**: Djur kan skjutas, lådor måste hoppas över.
    *   **Gropar (🕳️)**: Om man missar hoppet ramlar figuren fysiskt ner genom hålet innan spelet startar om.
    *   **Fåglar (👾/🛸)**: Flygande fiender som kan skjutas eller hoppas över.
*   **Poäng**: 5 poäng för att passera ett hinder/grop, 10 poäng för att skjuta ner en fiende.
*   **Svårighet**: Farten och spawn-frekvensen ökar med vald nivå + en tidsbaserad acceleration ju längre man överlever (upp till maxfart 20).

### Spel 4: Matte-Äventyret (Pingvinhopp)
*   **Mål**: Hjälp en pingvin (🐧) att nå en fisk (🐟) genom att hoppa på isberg med siffror i rätt ordning (1, 2, 3...).
*   **Logik**: Siffrorna genereras slumpmässigt på isområdet. Spelaren måste hitta och klicka på dem sekventiellt.
*   **Svårighetsgrad**: Max-siffran styrs av nivån (Nivå 1: till 10, Nivå 2: till 15, etc).

### Spel 5: Läs en Saga
*   **Layout**: Bilden (320px) är inbäddad i texten (`float: left`) så att texten flödar runt den för att spara utrymme.
*   **Innehåll**: Barnets namn injiceras dynamiskt. Tre långa, äventyrliga sagor med matchande AI-bilder.

## 4. Uppmuntran
*   **Toast-meddelanden**: Slumpmässiga hejarop från "Mamma Emilie" och "Pappa Mattias" (t.ex. "Snyggt jobbat Liam, vilken stjärna!").
