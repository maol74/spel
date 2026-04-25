const CONFIG = {
    avatars: [
        { id: 'superhero', name: 'Superhjälten', icon: '🦸' },
        { id: 'dragon', name: 'Draken', icon: '🐲' },
        { id: 'wizard', name: 'Trollkarlen', icon: '🧙' },
        { id: 'astronaut', name: 'Astronauten', icon: '👨‍🚀' },
        { id: 'ninja', name: 'Ninjan', icon: '🥷' },
        { id: 'robot', name: 'Robot-Robban', icon: '🤖' }
    ],
    difficultyWords: {
        1: ['SOL', 'BIL', 'BUS', 'TÅG', 'KEX', 'IS'],
        2: ['KATT', 'HUND', 'FISK', 'HÄST', 'BANA', 'BÅT'],
        3: ['ZEBRA', 'KANIN', 'NALLA', 'ÄPPLE', 'SKRATT'],
        4: ['GIRAFF', 'TIGER', 'BANAN', 'CITRON', 'FLASKA'],
        5: ['ELEFANT', 'PANNKAKA', 'RYMDSTATION', 'DINOSAURIE']
    },
    wordEmojis: {
        'SOL': '☀️', 'BIL': '🚗', 'BUS': '🚌', 'TÅG': '🚂', 'KEX': '🍪', 'IS': '🧊',
        'KATT': '🐱', 'HUND': '🐶', 'FISK': '🐟', 'HÄST': '🐴', 'BANA': '🍌', 'BÅT': '⛵',
        'ZEBRA': '🦓', 'KANIN': '🐰', 'NALLA': '🧸', 'ÄPPLE': '🍎', 'SKRATT': '😄',
        'GIRAFF': '🦒', 'TIGER': '🐯', 'BANAN': '🍌', 'CITRON': '🍋', 'FLASKA': '🍼',
        'ELEFANT': '🐘', 'PANNKAKA': '🥞', 'RYMDSTATION': '🚀', 'DINOSAURIE': 'REX'
    },
    difficulties: [
        { id: 1, name: 'Jättelätt', icon: '🌱', color: '#27AE60' },
        { id: 2, name: 'Lätt', icon: '☀️', color: '#4A90E2' },
        { id: 3, name: 'Lagom', icon: '⭐', color: '#F1C40F' },
        { id: 4, name: 'Svårt', icon: '🔥', color: '#E67E22' },
        { id: 5, name: 'Expert!', icon: '🏆', color: '#E74C3C' }
    ],
    stories: [
        {
            icon: '🐲',
            title: 'och den magiska drakön',
            img: 'resources/images/dragon_island_story_1777103636685.png',
            text: 'satt i sin lummiga trädgård och tittade upp på de gnistrande stjärnorna som blinkade som små diamanter på den mörkblå himlen. Plötsligt hördes ett svagt svischande ljud och en liten, rund raket landade med en mjuk duns precis framför fötterna på vår hjälte. Ut klev en silverfärgad robot med stora, lysande ögon som hette Pip. Pip förklarade med sin pipiga röst att hans hemplanet, Pannkaka, var i stor fara och att de behövde en modig person för att rädda den magiska drakön. Utan att tveka hoppade vi in i raketen. Inuti var det fullt av spakar och blinkande knappar som såg ut som färgglada godisbitar. Vi susade iväg genom rymden snabbare än vinden, förbi planeter gjorda av glass och asteroider som såg ut som stora kakor. När vi landade på den magiska drakön möttes vi av en varm bris som doftade nystekta pannkakor. Marken var mjuk som deg och träden var fulla av mogna blåbärssyltsburkar som hängde från grenarna. Plötsligt hördes ett djupt muller och ur en grotta kom en enorm men snäll drake fram. Draken var ledsen för att hans favorit-leksak, en gyllene boll, hade fastnat i ett moln av klibbigt socker. Tillsammans använde vi robotens utfällbara stege och drakens vingar för att nå molnet. Efter ett spännande samarbete fick vi loss bollen och draken blev så glad att han sprutade ut glittrande konfetti istället för eld. Som tack fick vi var sin guldmedalj gjord av den finaste choklad man kan tänka sig. Det var den absolut bästa och mest spännande natten i hela livet, och när vi kom hem igen kände vi oss som riktiga hjältar.'
        },
        {
            icon: '🤖',
            title: 'och rymdbrobotens fest',
            img: 'resources/images/robot_party_story_1777103649643.png',
            text: 'Det var dags för den årliga stora festen på rymdstationen Stjärnan, och alla robotar i hela galaxen var inbjudna. Det fanns robotar som kunde baka kakor, robotar som kunde dansa disco och till och med robotar som kunde jonglera med små planeter. Musiken dunkade och alla åt digitala bullar som smakade som hallon. Men precis när festen var som roligast hände något oväntat – alla lampor slocknade med en hög smäll och musiken tystnade tvärt. Ett oroligt mummel spred sig bland gästerna. "Vem kan hjälpa oss nu?" ropade Pip med darrig röst. Vår hjälte klev fram i mörkret, tog fram sin super-ficklampa och sa med stadig röst: "Jag kan!". Tillsammans med Pip gav vi oss ut på en spännande vandring genom rymdstationens långa, mörka korridorer. Vi var tvungna att klättra över högar av reservdelar och undvika att trampa på sovande städrobotar. Till slut nådde vi det allra heligaste: det stora maskinrummet där den gigantiska huvudgeneratorn stod. Med hjälp av ficklampans starka sken såg vi att en liten, nyfiken rymdråtta hade råkat dra ut en viktig sladd för att den ville leka med den. Försiktigt lockade vi bort råttan med en bit metallgodis och satte tillbaka sladden på sin plats. Plötsligt började maskinerna surra igen, lamporna tändes med ett strålande sken och musiken drog igång med full kraft. Alla robotar jublade och lyfte upp oss på sina axlar. Vi dansade hela natten lång och lärde oss till och med en ny rymd-dans som hette "Galax-Hoppet". Det blev en kväll som ingen på rymdstationen någonsin skulle glömma, och vi fick en speciell hedersplats vid nästa års fest.'
        },
        {
            icon: '🦸',
            title: 'och den borttappade superkraften',
            img: 'resources/images/superhero_search_story_1777103664916.png',
            text: 'En solig morgon vaknade vår hjälte och kände sig lite annorlunda. Vanligtvis brukade han kunna hoppa direkt från sängen hela vägen ut i köket, men idag kändes benen tunga som bly. När han försökte flyga ut genom fönstret för att hälsa på fåglarna märkte han till sin stora förskräckelse att han inte ens lämnade marken. Superkraften var borta! Paniken började sprida sig, för vad är en superhjälte utan sina krafter? Han började genast leta systematiskt i hela huset. Han tittade under sängen där dammråttorna bodde, han dök ner i frukostskålen bland alla flingor och han letade till och med bakom de tjocka gardinerna i vardagsrummet. Men superkraften fanns ingenstans. Då kom han på en sak – han hade ju lekt med sin gamla nallebjörn kvällen innan. Han sprang upp på vinden och hittade nallen som satt och vilade i ett hörn. När han lyfte på nallens mjuka öra såg han ett litet, glittrande ljus. "Där är du ju!" utbrast han och skrattade av lättnad. Det visade sig att superkraften bara hade tagit en liten tupplur i nallens öra för att den var så trött efter alla äventyr. Så fort han rörde vid ljuset kände han hur en varm energi strömmade genom hela kroppen. Plötsligt kunde han hoppa högre än någonsin tidigare och hans ögon lyste av glädje. Han tog på sig sin glänsande mantel, knöt skorna och flög ut genom fönstret med ett högt jubel. Han spenderade resten av dagen med att hjälpa katter ner från träd, laga trasiga cyklar och sprida glädje i hela staden. Denna dag lärde han sig att även en superhjältes krafter behöver vila ibland, men att modet och viljan att hjälpa andra alltid finns kvar i hjärtat oavsett vad.'
        },
        {
            icon: '🍦',
            title: 'och den förtrollade glasskogen',
            img: 'resources/images/ice_cream_forest_story_image_1777122050676.png',
            text: 'En dag hittade vår hjälte en hemlig stig bakom det gamla äppelträdet. Stigen var täckt av strössel och ledde ända fram till en magisk skog där alla träd var gjorda av stora glassvåfflor! Kronorna på träden var enorma kulor av jordgubbs- och vaniljglass som aldrig smälte, trots att solen lyste varmt. Mitt i skogen rann en flod av krämig chokladsås, och på de små öarna av maräng satt glada godisbjörnar och fiskade efter geléhallon. Plötsligt hördes ett sorgset snyftande. Det var skogens vaktmästare, en liten ekorre med en hatt gjord av en sockerbit. Han berättade att den stora glassmaskinen i mitten av skogen hade slutat snurra för att ett körsbär hade fastnat i kugghjulen. Utan att tveka kavlade vår hjälte upp ärmarna. Med ett modigt hopp över chokladfloden och lite list lyckades vi pilla loss körsbäret. Plötsligt började maskinen surra av glädje och skogen fylldes av en doft av nystekta rån. Som tack fick vi en magisk glassbägare som aldrig tog slut. Det var det godaste äventyret någonsin, och vi lovade att komma tillbaka nästa gång vi blev sugna på något riktigt gott!'
        },
        {
            icon: '🚀',
            title: 'och rymdskeppets mysterium',
            img: 'resources/images/space_mystery_story_image_1777122071117.png',
            text: 'Ute i den djupa rymden, ombord på det glänsande rymdskeppet Galaxen, hände något mycket märkligt. Mitt i kontrollrummet svävade en mystisk, blå kristall som lyste med ett mjukt och pulserande sken. Ingen visste varifrån den kommit eller vad den gjorde där. Kaptenen, en klok gammal rymdfarare, såg bekymrad ut. "Om vi inte löser kristallens gåta kommer vi aldrig kunna starta våra motorer igen", sa han. Vår hjälte klev fram och tittade nära på kristallen. Med hjälp av vår lilla robotkompis Pip upptäckte vi att kristallen faktiskt var en gammal rymd-karta som behövde lite energi för att aktiveras. Genom att lösa tre kluriga stjärn-pussel lyckades vi skicka precis rätt mängd kraft till kristallen. Plötsligt fylldes hela rummet av en fantastisk karta över outforskade galaxer och planeter gjorda av rent guld! Motorerna spann igång med ett tryggt brummande och hela besättningen jublade av lycka. Vi hade inte bara räddat rymdskeppet, utan också hittat vägen till nya, spännande äventyr bland stjärnorna. Som tack fick vi styra skeppet en liten stund, och det kändes som om hela universum låg öppet framför oss.'
        }
    ]
};
