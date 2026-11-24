/* ==================================================================
   PixelCat Games · cataleg.js (index.html)
   Part A: el catàleg es genera amb el DOM a partir de l'array jocs.
   Part B: cerca per títol i filtre per plataforma en directe.
   ================================================================== */

// IVA que s'aplica a tots els preus (en %)
const TIPUS_IVA = 21;

// Per sota d'aquesta quantitat, l'estoc es considera baix
const LIMIT_ESTOC_BAIX = 5;

// Dades dels jocs (de cataleg.xml). El preu és SENSE IVA.
// genere i plataforma són arrays perquè un joc en pot tenir més d'un.
const jocs = [
  {
    codi: "JOC-001",
    titol: "ComandamentsConquesta",
    genere: ["Estratègia", "Acció", "Tàctica"],
    plataforma: ["PC", "Xbox Series"],
    preu: 39.99,
    valoracio: 8.7,
    estoc: 12,
    imatge: "img/joc-001-comandaments-conquesta.png",
    alt: "Dos castells, un amb bandera blava i l'altre amb bandera vermella, amb els seus exèrcits encarats en un camí de terra",
    descripcio: "Un joc d'estratègia en temps real on hauràs de construir la teva base i dirigir els teus exèrcits.",
    destacat: false
  },
  {
    codi: "JOC-002",
    titol: "Neon Runner",
    genere: ["Acció", "Plataformes", "Cyberpunk"],
    plataforma: ["PC", "PS5", "Switch"],
    preu: 24.99,
    valoracio: 9.1,
    estoc: 3,
    imatge: "img/joc-002-neon-runner.png",
    alt: "Silueta d'un corredor de color cian que travessa una ciutat de nit plena de llums de neó",
    descripcio: "Corre per una ciutat futurista plena d'obstacles, enemics i secrets amagats.",
    destacat: false
  },
  {
    codi: "JOC-003",
    titol: "Kingdoms of Eldoria",
    genere: ["Aventura", "Món obert", "RPG"],
    plataforma: ["PC", "PS5"],
    preu: 49.99,
    valoracio: 9.4,
    estoc: 15,
    imatge: "img/joc-003-kingdoms-of-eldoria.png",
    alt: "Castell de torres vermelles sobre un turó verd, amb muntanyes i una posta de sol al fons",
    descripcio: "Explora un immens regne fantàstic, completa missions i descobreix una història plena de misteris.",
    destacat: true
  },
  {
    codi: "JOC-004",
    titol: "Pixel Kart Turbo",
    genere: ["Esports", "Curses", "Arcade"],
    plataforma: ["Switch", "PS5"],
    preu: 29.99,
    valoracio: 8.2,
    estoc: 20,
    imatge: "img/joc-004-pixel-kart-turbo.png",
    alt: "Kart vermell corrent per un circuit amb graderies plenes de públic i la línia de meta a quadres",
    descripcio: "Participa en curses frenètiques amb pilots extravagants i circuits plens de sorpreses.",
    destacat: false
  },
  {
    codi: "JOC-005",
    titol: "Haunted Mansion",
    genere: ["Terror", "Supervivència", "Misteri"],
    plataforma: ["PC", "Xbox Series"],
    preu: 34.99,
    valoracio: 8.9,
    estoc: 0,
    imatge: "img/joc-005-haunted-mansion.png",
    alt: "Mansió fosca amb finestres il·luminades sota una gran lluna plena, amb ratpenats i làpides",
    descripcio: "Investiga una mansió abandonada i resol els seus enigmes mentre descobreixes el seu fosc passat.",
    destacat: false
  },
  {
    codi: "JOC-006",
    titol: "Galaxy Explorer",
    genere: ["Simulació", "Exploració espacial", "Ciència-ficció"],
    plataforma: ["PC", "Xbox Series"],
    preu: 44.99,
    valoracio: 8.5,
    estoc: 7,
    imatge: "img/joc-006-galaxy-explorer.png",
    alt: "Nau espacial blanca volant cap a un planeta taronja amb anells, envoltada d'estrelles i d'una nebulosa",
    descripcio: "Viatja per l'espai, descobreix nous planetes i gestiona els recursos de la teva nau.",
    destacat: false
  },
  {
    codi: "JOC-007",
    titol: "Mind Puzzle",
    genere: ["Estratègia", "Puzles", "Lògica"],
    plataforma: ["PC", "Mòbil"],
    preu: 14.99,
    valoracio: 8.0,
    estoc: 25,
    imatge: "img/joc-007-mind-puzzle.png",
    alt: "Peces de colors apilades en una quadrícula, una peça que cau i un signe d'interrogació groc",
    descripcio: "Supera centenars de reptes mentals que augmenten progressivament de dificultat.",
    destacat: false
  },
  {
    codi: "JOC-008",
    titol: "Samurai Shadows",
    genere: ["RPG", "Acció", "Històrica"],
    plataforma: ["PS5", "PC"],
    preu: 54.99,
    valoracio: 9.0,
    estoc: 4,
    imatge: "img/joc-008-samurai-shadows.png",
    alt: "Silueta d'un samurai amb katana davant d'un sol vermell, una muntanya nevada i una pagoda",
    descripcio: "Converteix-te en un samurai i recorre un Japó feudal ple d'enemics i aventures.",
    destacat: false
  }
];

// Elements de la pàgina que farem servir
const contenidorJocs = document.querySelector("#llista-jocs");
const campCerca = document.querySelector("#cerca-titol");
const selectPlataforma = document.querySelector("#filtre-plataforma");
const textComptador = document.querySelector("#comptador-jocs");


/* ---------- Part A: catàleg dinàmic ---------- */

// Retorna el preu amb l'IVA de TIPUS_IVA afegit
function calculaPreuAmbIva(preu) {
  return preu * (1 + TIPUS_IVA / 100);
}

// Escriu un número amb dos decimals i coma, com a preu en euros: "48,39 €"
function formataEuros(valor) {
  return valor.toFixed(2).replace(".", ",") + " €";
}

// Crea un element amb una classe i un text (tots dos opcionals)
function creaElement(etiqueta, classe = "", text = "") {
  const element = document.createElement(etiqueta);
  if (classe !== "") {
    element.classList.add(classe);
  }
  if (text !== "") {
    element.textContent = text;
  }
  return element;
}

// Afegeix a una llista <dl> una parella títol (dt) + valor (dd)
function afegeixDada(llista, titol, valor, classeValor) {
  llista.appendChild(creaElement("dt", "", titol));
  llista.appendChild(creaElement("dd", classeValor, valor));
}

// Construeix l'<article> d'un joc amb la mateixa estructura que a RA2
function creaTargeta(joc) {
  const targeta = creaElement("article", "targeta-joc");
  targeta.id = joc.codi.toLowerCase();  // "joc-003": els enllaços #joc-003 continuen funcionant
  targeta.dataset.codi = joc.codi;

  // Imatge de portada
  const imatge = creaElement("img", "targeta-joc__imatge");
  imatge.src = joc.imatge;
  imatge.alt = joc.alt;
  imatge.width = 800;
  imatge.height = 500;
  imatge.loading = "lazy";
  targeta.appendChild(imatge);

  // Distintiu del joc destacat
  if (joc.destacat === true) {
    targeta.classList.add("targeta-joc--destacada");
    targeta.appendChild(creaElement("p", "targeta-joc__distintiu", "Joc del mes"));
  }

  targeta.appendChild(creaElement("h3", "targeta-joc__titol", joc.titol));

  // Text de l'estoc: let perquè el valor canvia segons la quantitat
  let textEstoc = joc.estoc + " unitats";
  if (joc.estoc === 0) {
    textEstoc = "Esgotat";
    targeta.classList.add("esgotat");
  } else if (joc.estoc < LIMIT_ESTOC_BAIX) {
    textEstoc = "Només en queden " + joc.estoc;
  }
  if (joc.estoc < LIMIT_ESTOC_BAIX) {
    targeta.classList.add("estoc-baix");
  }

  // Gènere, plataforma i estoc en una llista de definicions
  const dades = creaElement("dl", "targeta-joc__dades");
  afegeixDada(dades, "Gènere", joc.genere.join(", "), "targeta-joc__generes");
  afegeixDada(dades, "Plataforma", joc.plataforma.join(", "), "targeta-joc__plataformes");
  afegeixDada(dades, "Estoc", textEstoc, "targeta-joc__estoc");
  targeta.appendChild(dades);

  targeta.appendChild(creaElement("p", "targeta-joc__descripcio", joc.descripcio));

  // Enllaç a la fitxa (només el joc destacat en té)
  if (joc.destacat === true) {
    const enllac = creaElement("a", "targeta-joc__enllac", "Veure la fitxa completa");
    enllac.href = "fitxa.html";
    targeta.appendChild(enllac);
  }

  // Peu: preu amb IVA i valoració
  const peu = creaElement("footer", "targeta-joc__peu");

  const preuAmbIva = calculaPreuAmbIva(joc.preu);
  const preu = creaElement("p", "preu");
  const dadaPreu = creaElement("data", "", formataEuros(preuAmbIva));
  dadaPreu.value = preuAmbIva.toFixed(2);
  preu.appendChild(dadaPreu);
  preu.appendChild(creaElement("span", "preu__iva", "IVA inclòs"));
  peu.appendChild(preu);

  const valoracio = creaElement("p", "valoracio");
  const estrella = creaElement("span", "valoracio__estrella", "★");
  estrella.setAttribute("aria-hidden", "true");
  valoracio.appendChild(estrella);
  valoracio.appendChild(creaElement("span", "visualment-amagat", "Valoració:"));
  valoracio.appendChild(document.createTextNode(" " + joc.valoracio.toFixed(1).replace(".", ",")));
  valoracio.appendChild(creaElement("span", "valoracio__maxim", "/10"));
  peu.appendChild(valoracio);

  targeta.appendChild(peu);
  return targeta;
}

// Buida el catàleg i hi pinta una targeta per a cada joc de la llista
function pintaCataleg(llista) {
  contenidorJocs.replaceChildren();  // treu totes les targetes anteriors

  if (llista.length === 0) {
    contenidorJocs.appendChild(creaElement("p", "cataleg__buit", "No s'ha trobat cap joc"));
    return;
  }

  llista.forEach((joc) => {
    contenidorJocs.appendChild(creaTargeta(joc));
  });
}


/* ---------- Part B: cerca i filtre en directe ---------- */

// Actualitza el text «Mostrant X de Y jocs» de sobre del catàleg
function actualitzaComptadorJocs(mostrats, total) {
  textComptador.textContent = "Mostrant " + mostrats + " de " + total + " jocs";
}

// Filtra per títol i plataforma alhora i torna a pintar el catàleg
function aplicaFiltres() {
  const textCercat = campCerca.value.trim().toLowerCase();
  const plataformaTriada = selectPlataforma.value;

  const jocsFiltrats = jocs.filter((joc) => {
    const coincideixTitol = joc.titol.toLowerCase().includes(textCercat);
    const coincideixPlataforma = plataformaTriada === "totes" || joc.plataforma.includes(plataformaTriada);
    return coincideixTitol && coincideixPlataforma;
  });

  pintaCataleg(jocsFiltrats);
  actualitzaComptadorJocs(jocsFiltrats.length, jocs.length);
}

// Cada lletra escrita o cada canvi de plataforma torna a filtrar
campCerca.addEventListener("input", aplicaFiltres);
selectPlataforma.addEventListener("change", aplicaFiltres);

// Primera pintada en carregar la pàgina (amb tots els jocs)
aplicaFiltres();
