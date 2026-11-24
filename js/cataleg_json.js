/* ==================================================================
   PixelCat Games · cataleg_json.js (cataleg_json.html)
   Part E: es llegeix un fitxer .json triat per la persona usuària i
   se'n mostra el catàleg amb targetes creades amb el DOM.
   ================================================================== */

// IVA que s'aplica a tots els preus (en %), com a la Fase 2
const TIPUS_IVA = 21;

// Per sota d'aquesta quantitat total, l'estoc es considera baix
const LIMIT_ESTOC_BAIX = 5;

// Elements de la pàgina que farem servir
const entrada = document.querySelector("#fitxer");
const contenidor = document.querySelector("#cataleg");
const titolBotiga = document.querySelector("#titol-botiga");
const textComptador = document.querySelector("#comptador-jocs");


/* ---------- Funcions auxiliars ---------- */

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

// Si el valor és una llista, la recorre i la separa per comes;
// si no ho és, el mostra tal com ve (join només existeix als arrays)
function textDeLlista(valor) {
  if (Array.isArray(valor)) {
    return valor.join(", ");
  }
  return String(valor);
}

// Suma les quantitats de l'estoc de totes les plataformes
function estocTotal(joc) {
  let total = 0;
  joc.estoc.forEach((entradaEstoc) => {
    total += entradaEstoc.quantitat;
  });
  return total;
}


/* ---------- Targetes ---------- */

// Construeix l'<article> d'un joc amb l'estructura i les classes de la Fase 2
function creaTargeta(joc) {
  const targeta = creaElement("article", "targeta-joc");
  targeta.id = joc.codi.toLowerCase();  // "joc-003"
  targeta.dataset.codi = joc.codi;

  targeta.appendChild(creaElement("h3", "targeta-joc__titol", joc.titol));

  // Estoc: let perquè el text canvia segons la disponibilitat i la quantitat
  const total = estocTotal(joc);
  let textEstoc = total + " unitats";
  if (joc.disponible === false) {
    textEstoc = "Esgotat";
    targeta.classList.add("esgotat");
  } else if (total < LIMIT_ESTOC_BAIX) {
    textEstoc = "Només en queden " + total;
  }
  if (total < LIMIT_ESTOC_BAIX) {
    targeta.classList.add("estoc-baix");
  }

  // Codi, gèneres, plataformes i estoc en una llista de definicions
  const dades = creaElement("dl", "targeta-joc__dades");
  afegeixDada(dades, "Codi", joc.codi, "targeta-joc__codi");
  afegeixDada(dades, "Gènere", textDeLlista(joc.generes), "targeta-joc__generes");
  afegeixDada(dades, "Plataforma", textDeLlista(joc.plataformes), "targeta-joc__plataformes");
  afegeixDada(dades, "Estoc", textEstoc, "targeta-joc__estoc");
  targeta.appendChild(dades);

  targeta.appendChild(creaElement("p", "targeta-joc__descripcio", joc.descripcio));

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


/* ---------- Missatges i catàleg ---------- */

// Mostra un missatge dins del contenidor (text d'ajuda o d'error)
function mostraMissatge(text, esError) {
  const missatge = creaElement("p", "cataleg__buit", text);
  if (esError === true) {
    missatge.classList.add("missatge-error");
    missatge.setAttribute("role", "alert");
  }
  contenidor.replaceChildren(missatge);
  titolBotiga.hidden = true;
  textComptador.textContent = "";
}

// Comprova que l'objecte llegit té la llista jocs; si no, llança un error
function comprovaEstructura(dades) {
  if (dades === null || typeof dades !== "object" || !Array.isArray(dades.jocs)) {
    throw new Error("falta la llista «jocs»");
  }
}

// Pinta el títol, el recompte i una targeta per a cada joc de la llista
function pintaCataleg(dades) {
  comprovaEstructura(dades);

  // Les targetes es construeixen a part: si alguna falla, no queda res a mitges
  const targetes = document.createDocumentFragment();
  dades.jocs.forEach((joc) => {
    targetes.appendChild(creaTargeta(joc));
  });

  // Títol: nom de la botiga i, si el JSON la té, la ciutat
  let titol = dades.botiga.nom;
  if (dades.botiga.ciutat !== undefined) {
    titol = titol + " · " + dades.botiga.ciutat;
  }

  titolBotiga.textContent = titol;
  titolBotiga.hidden = false;
  contenidor.replaceChildren(targetes);  // substitueix el catàleg anterior
  textComptador.textContent = "Mostrant " + contenidor.children.length + " de " + dades.jocs.length + " jocs";
}

// Llegeix el contingut del fitxer: primer el converteix i després el mostra
function processaText(text) {
  let dades = null;

  // 1) El text no és JSON vàlid: JSON.parse llança un SyntaxError
  try {
    dades = JSON.parse(text);
  } catch (error) {
    mostraMissatge("El fitxer no és un JSON vàlid (" + error.message + ").", true);
    return;
  }

  // 2) El JSON és vàlid però no té les claus esperades
  try {
    pintaCataleg(dades);
  } catch (error) {
    mostraMissatge("El fitxer és un JSON vàlid, però no té l'estructura esperada: " + error.message + ".", true);
  }
}

// Quan es tria un fitxer, el llegeix amb FileReader
entrada.addEventListener("change", () => {
  const fitxer = entrada.files[0];
  if (fitxer === undefined) {
    return;
  }

  const lector = new FileReader();
  lector.addEventListener("load", () => {
    processaText(lector.result);
  });
  lector.addEventListener("error", () => {
    mostraMissatge("No s'ha pogut llegir el fitxer.", true);
  });
  lector.readAsText(fitxer);
});

// Mentre no hi ha cap fitxer carregat, la pàgina diu què cal fer
mostraMissatge("Tria un fitxer .json amb el camp de sobre per veure el catàleg.", false);
