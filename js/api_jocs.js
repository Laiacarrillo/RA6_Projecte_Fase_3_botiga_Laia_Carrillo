const API = "https://lluisbelmonte-rgb.github.io/botiga-api/api";

const contenidor = document.querySelector("#jocs");
const textComptador = document.querySelector("#comptador-jocs");
const campCodi = document.querySelector("#cerca-codi");
const botoCercar = document.querySelector("#boto-cercar");
const botoTots = document.querySelector("#boto-tots");

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

function afegeixDada(llista, titol, valor, classeValor = "") {
  llista.appendChild(creaElement("dt", "", titol));
  llista.appendChild(creaElement("dd", classeValor, valor));
}

function calculaNotaMitjana(opinions) {
  if (!opinions || opinions.length === 0) {
    return "0.0";
  }
  const suma = opinions.reduce((total, opinio) => total + opinio.nota, 0);
  return (suma / opinions.length).toFixed(1);
}

function creaTargetaJoc(joc) {
  const targeta = creaElement("article", "targeta-joc");
  targeta.dataset.codi = joc.codi;

  targeta.appendChild(creaElement("h3", "targeta-joc__titol", joc.titol));

  const dades = creaElement("dl", "targeta-joc__dades");
  afegeixDada(dades, "Codi", joc.codi);
  afegeixDada(
    dades,
    "Desenvolupador",
    joc.desenvolupador.nom + " (" + joc.desenvolupador.pais + ")"
  );
  afegeixDada(dades, "Any", String(joc.any));
  afegeixDada(dades, "Gèneres", joc.generes.join(", "), "targeta-joc__generes");

  if (joc.disponible === false) {
    targeta.classList.add("esgotat");
    afegeixDada(dades, "Estat", "Esgotat", "targeta-joc__estoc");
  }

  targeta.appendChild(dades);

  const peu = creaElement("footer", "targeta-joc__peu");

  const preu = creaElement("p", "preu");
  const dadaPreu = creaElement("data", "", joc.preu.toFixed(2) + " €");
  dadaPreu.value = joc.preu.toFixed(2);
  preu.appendChild(dadaPreu);
  peu.appendChild(preu);

  const mitjana = calculaNotaMitjana(joc.opinions);
  const valoracio = creaElement("p", "valoracio");
  const estrella = creaElement("span", "valoracio__estrella", "★");
  estrella.setAttribute("aria-hidden", "true");
  valoracio.appendChild(estrella);
  valoracio.appendChild(document.createTextNode(" " + mitjana));
  valoracio.appendChild(creaElement("span", "valoracio__maxim", "/10"));
  peu.appendChild(valoracio);

  targeta.appendChild(peu);
  return targeta;
}

function mostraMissatge(text) {
  contenidor.replaceChildren(creaElement("p", "cataleg__buit", text));
}

async function carregaJocs() {
  contenidor.replaceChildren();
  textComptador.textContent = "";

  try {
    const resposta = await fetch(API + "/jocs.json");
    if (!resposta.ok) {
      throw new Error("Error " + resposta.status);
    }
    const dades = await resposta.json();
    textComptador.textContent = "Mostrant " + dades.total + " jocs";

    dades.jocs.forEach((joc) => {
      contenidor.appendChild(creaTargetaJoc(joc));
    });
  } catch (error) {
    mostraMissatge("No s'ha pogut carregar l'API: " + error.message);
  }
}

async function cercaJocPerCodi() {
  const codi = campCodi.value.trim().toUpperCase();
  if (codi === "") {
    return;
  }

  contenidor.replaceChildren();
  textComptador.textContent = "";

  try {
    const resposta = await fetch(API + "/jocs/" + encodeURIComponent(codi) + ".json");
    if (!resposta.ok) {
      mostraMissatge("Aquest joc no existeix");
      return;
    }
    const joc = await resposta.json();
    textComptador.textContent = "Mostrant 1 joc";
    contenidor.appendChild(creaTargetaJoc(joc));
  } catch (error) {
    if (!navigator.onLine) {
      mostraMissatge("Error en connectar amb l'API: " + error.message);
    } else {
      mostraMissatge("Aquest joc no existeix");
    }
  }
}

botoCercar.addEventListener("click", cercaJocPerCodi);
botoTots.addEventListener("click", carregaJocs);

carregaJocs();