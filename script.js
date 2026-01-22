// 1. Hintergrund-Layer definieren
var mapboxToken = 'pk.eyJ1IjoibWFydGlubGFwb3JuaWsiLCJhIjoiY21rbXU1eTRtMDE0NTNkczh1NGllb285MiJ9.uEm7V17HOj04Qkugl8X2tw';

// Ein moderner, englischer Style (Mapbox Streets)

var mapboxEnglish = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + mapboxToken, {
    attribution: '© Mapbox',
    tileSize: 512,
    zoomOffset: -1,
    noWrap: true, // Verhindert die Wiederholung der Kacheln
    bounds: [[-90, -180], [90, 180]] // Begrenzt die Kacheln auf die echte Welt
});

var mapboxSatellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=' + mapboxToken, {
    attribution: '© Mapbox',
    tileSize: 512,
    zoomOffset: -1,
    noWrap: true, // Verhindert die Wiederholung der Kacheln
    bounds: [[-90, -180], [90, 180]]
});

// 2. Karte initialisieren mit Grenzen
var map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2, // Verhindert, dass man zu weit rauszoomt und nur Grau sieht
    maxBounds: [[-90, -180], [90, 180]], // Setzt die "Leitplanken" für die Kamera
    maxBoundsViscosity: 1.0, // Macht die Grenzen "hart" (man kann sie nicht wegziehen)
    layers: [mapboxEnglish]
});

// 3. Gruppen
var inselLayer = L.layerGroup(); 
var bunteLaenderLayer = L.layerGroup();

// --- HILFSFUNKTIONEN (Farben & Inseln) ---
function getFarbe(d) {
    return d === 1 ? '#8dd3c7' : d === 2 ? '#ffffb3' : d === 3 ? '#bebada' :
           d === 4 ? '#fb8072' : d === 5 ? '#80b1d3' : d === 6 ? '#fdb462' : '#b3de69';
}

// --- DAS VOLLSTÄNDIGE MASTER-LEXIKON (ALLE LÄNDER) ---

        var cityLookup = {
            // EUROPA
            "Germany": "Berlin", "France": "Paris", "Italy": "Rom", "Spain": "Madrid", "Austria": "Wien", "Switzerland": "Bern",
            "United Kingdom": "London", "Netherlands": "Amsterdam", "Belgium": "Brüssel", "Poland": "Warschau", "Greece": "Athen",
            "Portugal": "Lissabon", "Norway": "Oslo", "Sweden": "Stockholm", "Finland": "Helsinki", "Denmark": "Kopenhagen",
            "Ireland": "Dublin", "Czechia": "Prag", "Hungary": "Budapest", "Romania": "Bukarest", "Ukraine": "Kiew",
            "Slovakia": "Bratislava", "Slovenia": "Ljubljana", "Croatia": "Zagreb", "Bosnia and Herz.": "Sarajevo", "Serbia": "Belgrad",
            "Montenegro": "Podgorica", "Albania": "Tirana", "North Macedonia": "Skopje", "Bulgaria": "Sofia", "Estonia": "Tallinn",
            "Latvia": "Riga", "Lithuania": "Vilnius", "Belarus": "Minsk", "Moldova": "Chisinau", "Iceland": "Reykjavík", "Malta": "Valletta",
            "Cyprus": "Nikosia","Andorra": "Andorra la Vella","Monaco": "Monaco", "Liechtenstein": "Vaduz","Czech Republic": "Prague",
            "Luxembourg": "Luxembourg","Kosovo": "Pristina",

            // ASIEN
            "Russia": "Moskau", "People's Republic of China": "Peking", "Japan": "Tokio", "India": "Neu-Delhi", "South Korea": "Seoul", "North Korea": "Pjöngjang",
            "Indonesia": "Jakarta", "Thailand": "Bangkok", "Vietnam": "Hanoi", "Philippines": "Manila", "Kazakhstan": "Astana",
            "Saudi Arabia": "Riad", "Turkey": "Ankara", "Iran": "Teheran", "Iraq": "Bagdad", "Israel": "Jerusalem", "Jordan": "Amman",
            "Lebanon": "Beirut", "Syria": "Damaskus", "United Arab Emirates": "Abu Dhabi", "Oman": "Maskat", "Yemen": "Sanaa",
            "Kuwait": "Kuwait-Stadt", "Qatar": "Doha", "Pakistan": "Islamabad", "Afghanistan": "Kabul", "Bangladesh": "Dhaka",
            "Myanmar": "Naypyidaw", "Cambodia": "Phnom Penh", "Laos": "Vientiane", "Malaysia": "Kuala Lumpur", "Mongolia": "Ulaanbaatar",
            "Uzbekistan": "Taschkent", "Turkmenistan": "Aschgabat", "Tajikistan": "Duschanbe", "Kyrgyzstan": "Bischkek", "Sri Lanka": "Colombo",
            "Georgia": "Tiflis", "Azerbaijan": "Baku", "Armenia": "Jerevan", "Bahrain": "Manama", "Bhutan": "Thimphu", "Singapore": "Singapore",
            "Brunei": "Bandar Seri Begawan", "East Timor": "Dili", "Maledives": "Malé",

            // AMERIKA (NORD, ZENTRAL, SÜD)
            "United States of America": "Washington D.C.", "Canada": "Ottawa", "Mexico": "Mexiko-Stadt", "Brazil": "Brasília",
            "Argentina": "Buenos Aires", "Chile": "Santiago", "Colombia": "Bogotá", "Peru": "Lima", "Cuba": "Havanna",
            "Ecuador": "Quito", "Bolivia": "Sucre", "Paraguay": "Asunción", "Uruguay": "Montevideo", "Venezuela": "Caracas",
            "Guyana": "Georgetown", "Suriname": "Paramaribo", "Panama": "Panama-Stadt", "Costa Rica": "San José", "Nicaragua": "Managua",
            "Honduras": "Tegucigalpa", "El Salvador": "San Salvador", "Guatemala": "Guatemala-Stadt", "Belize": "Belmopan",
            "Haiti": "Port-au-Prince", "Dominican Republic": "Santo Domingo", "Jamaica": "Kingston", "Dominica": "Roseau", "Saint Lucia": "Castries",
            "Saint Vincent and the Grenadines": "Kingstown", "Grenada": "St. George's", "Barbados": "Bridgetown", "Antigua and Barbuda": "Saint John's",
            "Saint Kitts and Nevis": "Basseterre", "Greenland": "Nuuk", "South Georgia and the South Sandwich Islands": "King Edward Point", 
            "Falkland Islands": "Stanley", "Trinidad and Tobago": "Port of Spain", "Puerto Rico": "San Juan",

            // AFRIKA
            "Egypt": "Kairo", "South Africa": "Pretoria", "Nigeria": "Abuja", "Kenya": "Nairobi", "Morocco": "Rabat", "Algeria": "Algier",
            "Tunisia": "Tunis", "Libya": "Tripolis", "Sudan": "Khartum", "South Sudan": "Juba", "Ethiopia": "Addis Abeba", "Somalia": "Mogadischu",
            "Uganda": "Kampala", "Tanzania": "Dodoma", "Zambia": "Lusaka", "Malawi": "Lilongwe", "Mozambique": "Maputo", "Zimbabwe": "Harare",
            "Botswana": "Gaborone", "Namibia": "Windhoek", "Angola": "Luanda", "Gabon": "Libreville", "Republic of the Congo": "Brazzaville",
            "Democratic Republic of the Congo": "Kinshasa", "Cameroon": "Jaunde", "Central African Rep.": "Bangui", "Chad": "N'Djamena", "Niger": "Niamey",
            "Mali": "Bamako", "Mauritania": "Nouakchott", "Senegal": "Dakar", "The Gambia": "Banjul", "Guinea": "Conakry", "Sierra Leone": "Freetown",
            "Liberia": "Monrovia", "Ivory Coast": "Yamoussoukro", "Ghana": "Accra", "Togo": "Lomé", "Benin": "Porto-Novo", "Burkina Faso": "Ouagadougou",
            "Madagascar": "Antananarivo", "Mauritius": "Port Louis", "Seychelles": "Victoria","Eswatini": "Mbabane", "Lesotho": "Maseru",
            "Comoros": "Moroni", "Guinea-Bissau": "Bissau", "Equatorial Guinea": "Ciudad de la Paz", "Cape Verde": "Praia", "São Tomé and Príncipe": "São Tomé",
            "Saint Helena": "Jamestown",

            // OZEANIEN
            "Australia": "Canberra", "New Zealand": "Wellington", "Papua New Guinea": "Port Moresby", "Fiji": "Suva", "Solomon Islands": "Honiara",
            "Vanuatu": "Port Vila", "Samoa": "Apia", "Tonga": "Nukuʻalofa", "Kiribati": "South Tarawa", "Nauru": "Yaren", "Federated States of Micronesia": "Palikir", 
            "Palau": "Ngerulmud", "French Polynesia": "Papeete", "Tuvalu": "Funafuti", "Cook Islands": "Avarua", "Pitcairn Islands": "Adamstown",
        };

// 5. GeoJSON laden
fetch('./data/ne_10m_admin_0_countries.geojson') 
    .then(response => response.json())
    .then(data => {
        
        // --- A) Die "Geister-Karte" (dein Hover-Layer) ---
        var countryLayer = L.geoJson(data, {
            style: { color: 'transparent', weight: 1, fillColor: '#007bff', fillOpacity: 0 },
            onEachFeature: function (feature, layer) {
                var props = feature.properties;
                var name = props.NAME_EN || props.NAME || props.ADMIN;
                var code = (props.ISO_A2 || "").toLowerCase();
                
                // Fixes
                if (name === "Norway") code = "no";
                if (name === "Kosovo") code = "xk";
                if (name === "France") code = "fr";

                var capital = cityLookup[name] || "Bitte ergänzen...";

                layer.bindPopup(`
    <div style="text-align: center;">
        <img src="https://flagcdn.com/w80/${code}.png" 
             onerror="this.src='https://flagcdn.com/w80/un.png'" 
             style="width: 80px;"><br>
        <strong style="font-size: 16px;">${name}</strong><br>
        <span style="color: #666;">Hauptstadt: ${capital}</span>
    </div>
`, {
    className: 'custom-popup', // Falls du spezifischer stylen willst
    fadeAnimation: true        // Aktiviert sanftes Einblenden
});

                layer.on('mouseover', function () { this.setStyle({ fillOpacity: 0.4, color: '#ffffff' }); });
                layer.on('mouseout', function () { this.setStyle({ fillOpacity: 0, color: 'transparent' }); });
            }
        }).addTo(map);

        // --- B) Die bunte Karte (für das Menü) ---
        L.geoJson(data, {
            style: function(f) { return { fillColor: getFarbe(f.properties.MAPCOLOR7 || 1), weight: 1, color: 'white', fillOpacity: 0.6 }; }
        }).addTo(bunteLaenderLayer);


// --- C) DIE SUCHE MIT FLASH-EFFEKT ---
const searchInput = document.getElementById('country-search');
const suggestionsBox = document.getElementById('suggestions');
let currentFocus = -1; // Merkt sich die Position in der Liste

searchInput.addEventListener('input', function() {
    const term = this.value.toLowerCase();
    suggestionsBox.innerHTML = '';
    currentFocus = -1; // Reset bei neuer Eingabe

    if (term.length < 2) return;

    const matches = data.features.filter(f => {
        const nameEn = (f.properties.NAME_EN || "").toLowerCase();
        const name = (f.properties.NAME || "").toLowerCase();
        return nameEn.includes(term) || name.includes(term);
    }).slice(0, 5);

    matches.forEach((match, index) => {
        const name = match.properties.NAME_EN || match.properties.NAME;
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = name;
        
        // Speichere die GeoJSON-Daten direkt am Div für den Zugriff per Enter
        div.dataset.matchData = JSON.stringify(match);

        div.onclick = function() { selectCountry(match); };
        suggestionsBox.appendChild(div);
    });
});
const clearBtn = document.getElementById('clear-search');

// Zeige das X nur, wenn Text im Feld ist
searchInput.addEventListener('input', function() {
    clearBtn.style.display = this.value.length > 0 ? 'block' : 'none';
});

// Was passiert beim Klick auf das X
clearBtn.onclick = function() {
    searchInput.value = '';        // Feld leeren
    suggestionsBox.innerHTML = ''; // Vorschläge löschen
    this.style.display = 'none';   // X wieder verstecken
    searchInput.focus();           // Cursor wieder ins Feld setzen
};
// Tastatursteuerung hinzufügen
searchInput.addEventListener('keydown', function(e) {
    let items = suggestionsBox.getElementsByClassName('suggestion-item');
    if (e.keyCode === 40) { // Pfeil nach UNTEN
        currentFocus++;
        addActive(items);
    } else if (e.keyCode === 38) { // Pfeil nach OBEN
        currentFocus--;
        addActive(items);
    } else if (e.keyCode === 13) { // ENTER
        e.preventDefault();
        if (currentFocus > -1 && items[currentFocus]) {
            items[currentFocus].click(); // Simuliert Klick auf den aktiven Eintrag
        }
    }
});

function addActive(items) {
    if (!items) return false;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (items.length - 1);
    items[currentFocus].classList.add("suggestion-active");
    // Automatisches Scrollen, falls die Liste lang ist
    items[currentFocus].scrollIntoView({ block: "nearest" });
}

function removeActive(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("suggestion-active");
    }
}

// Die eigentliche Zoom-Funktion (ausgelagert für bessere Übersicht)
function selectCountry(match) {
    const name = match.properties.NAME_EN || match.properties.NAME;
    const tempLayer = L.geoJson(match);
    const bounds = tempLayer.getBounds();
    
    const latDiff = Math.abs(bounds.getNorth() - bounds.getSouth());
    if (latDiff < 0.5) {
        map.setView(bounds.getCenter(), 9);
    } else {
        map.fitBounds(bounds, { padding: [50, 50] });
    }

// Der neue, moderne Flash-Effekt in Blau
const flash = L.geoJson(match, {
    style: { 
        color: '#ffffff',       // Weißer Außenrand für Kontrast
        weight: 2, 
        fillColor: '#007bff',   // Kräftiges Blau (passend zum Button-Hover)
        fillOpacity: 0.6, 
        pane: 'overlayPane' 
    }
}).addTo(map);

// Nach 2 Sekunden sanft entfernen
setTimeout(() => {
    map.removeLayer(flash);
}, 2000);

    searchInput.value = name;
    suggestionsBox.innerHTML = '';
}
document.getElementById('home-button').onclick = function() {
    // Wir fliegen zurück zum Startpunkt [Lat, Lng] mit Zoomstufe 2
    map.flyTo([20, 0], 2, {
        duration: 1.5 // Dauer des Fluges in Sekunden
    });
};
document.getElementById('fullscreen-button').onclick = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            this.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
};
        // --- D) LAYER-MENÜ ---
        var baseMaps = { "Mapbox English": mapboxEnglish, "Mapbox Satellit": mapboxSatellite };
        var overlayMaps = { "Inselstaaten": inselLayer, "Bunte Karte": bunteLaenderLayer };
        L.control.layers(baseMaps, overlayMaps).addTo(map);
        inselLayer.addTo(map);

    })
    .catch(err => console.error("Fehler im fetch-Block:", err));
    