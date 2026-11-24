/* ==================================================================
   PixelCat Games · contacte.js (contacte.html)
   Part C: validació del formulari, missatges d'error dins la pàgina,
   comptador de caràcters i resum de confirmació sense recarregar.
   ================================================================== */

// Límits de les regles de validació
const MIN_NOM = 3;
const MIN_MISSATGE = 20;
const MAX_MISSATGE = 300;
// Unitats: mínim 1 (reservar 0 jocs no té sentit) i màxim 5, que és el
// límit per reserva que ja s'indica al text d'ajuda del formulari.
const MIN_UNITATS = 1;
const MAX_UNITATS = 5;

// Elements del formulari
const formulari = document.querySelector("#formulari-contacte");
const campNom = document.querySelector("#nom");
const campCorreu = document.querySelector("#correu");
const campTelefon = document.querySelector("#telefon");
const campMotiu = document.querySelector("#motiu");
const campJoc = document.querySelector("#joc");
const grupPlataforma = document.querySelector("#grup-plataforma");
const campUnitats = document.querySelector("#unitats");
const campData = document.querySelector("#data-recollida");
const campMissatge = document.querySelector("#missatge");
const campButlleti = document.querySelector("#butlleti");
const campPrivacitat = document.querySelector("#privacitat");
const comptadorCaracters = document.querySelector("#comptador-missatge");


/* ---------- Regles de cada camp ----------
   Cada funció retorna el text de l'error, o "" si el camp és correcte. */

// Nom: obligatori i com a mínim 3 caràcters sense els espais dels extrems
function validaNom() {
  const nom = campNom.value.trim();
  if (nom === "") {
    return "Escriu el teu nom.";
  }
  if (nom.length < MIN_NOM) {
    return "El nom ha de tenir com a mínim " + MIN_NOM + " caràcters.";
  }
  return "";
}

// Correu: obligatori i amb format text@text.text
function validaCorreu() {
  const correu = campCorreu.value.trim();
  // Sense espais ni @ + una @ + text + un punt + text (ex.: nom@exemple.cat)
  const formatCorreu = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correu === "") {
    return "Escriu el teu correu electrònic.";
  }
  if (!formatCorreu.test(correu)) {
    return "El correu no té un format vàlid (ex.: nom@exemple.cat).";
  }
  return "";
}

// Telèfon: opcional, però si s'escriu ha de tenir de 9 a 13 xifres (pot portar + i espais)
function validaTelefon() {
  const telefon = campTelefon.value.trim().replaceAll(" ", "");
  if (telefon === "") {
    return "";
  }
  if (!/^\+?[0-9]{9,13}$/.test(telefon)) {
    return "El telèfon ha de tenir entre 9 i 13 xifres (pots posar + i espais).";
  }
  return "";
}

// Motiu: s'ha de triar una opció que no sigui «Tria una opció»
function validaMotiu() {
  if (campMotiu.value === "") {
    return "Tria el motiu de la consulta.";
  }
  return "";
}

// Joc: opcional, però si el motiu és reservar, cal dir quin joc
function validaJoc() {
  if (campMotiu.value === "reserva" && campJoc.value === "") {
    return "Per fer una reserva, tria quin joc vols.";
  }
  return "";
}

// Plataforma: hi ha d'haver un botó d'opció marcat
function validaPlataforma() {
  const marcada = grupPlataforma.querySelector("input[name='plataforma']:checked");
  if (marcada === null) {
    return "Tria una plataforma.";
  }
  return "";
}

// Unitats: número enter entre MIN_UNITATS i MAX_UNITATS
function validaUnitats() {
  const valor = campUnitats.value.trim();
  const unitats = Number(valor);
  if (valor === "" || isNaN(unitats)) {
    return "Escriu quantes unitats vols, amb un número.";
  }
  if (!Number.isInteger(unitats)) {
    return "Les unitats han de ser un número sense decimals.";
  }
  if (unitats < MIN_UNITATS || unitats > MAX_UNITATS) {
    return "Pots reservar entre " + MIN_UNITATS + " i " + MAX_UNITATS + " unitats.";
  }
  return "";
}

// Data de recollida: opcional, però no pot ser passada ni un diumenge (botiga tancada)
function validaData() {
  if (campData.value === "") {
    return "";
  }
  const dataTriada = new Date(campData.value + "T00:00:00");
  const avui = new Date();
  avui.setHours(0, 0, 0, 0);
  if (dataTriada < avui) {
    return "La data de recollida no pot ser anterior a avui.";
  }
  if (dataTriada.getDay() === 0) {
    return "Els diumenges la botiga és tancada: tria un altre dia.";
  }
  return "";
}

// Missatge: entre 20 i 300 caràcters
function validaMissatge() {
  const longitud = campMissatge.value.trim().length;
  if (longitud < MIN_MISSATGE) {
    return "El missatge ha de tenir com a mínim " + MIN_MISSATGE + " caràcters (ara en té " + longitud + ").";
  }
  if (campMissatge.value.length > MAX_MISSATGE) {
    return "El missatge no pot passar de " + MAX_MISSATGE + " caràcters.";
  }
  return "";
}

// Privacitat: la casella ha d'estar marcada
function validaPrivacitat() {
  if (!campPrivacitat.checked) {
    return "Has d'acceptar la política de privacitat per enviar la consulta.";
  }
  return "";
}

// Cada camp amb la seva funció de validació
const validacions = [
  { camp: campNom, valida: validaNom },
  { camp: campCorreu, valida: validaCorreu },
  { camp: campTelefon, valida: validaTelefon },
  { camp: campMotiu, valida: validaMotiu },
  { camp: campJoc, valida: validaJoc },
  { camp: grupPlataforma, valida: validaPlataforma },
  { camp: campUnitats, valida: validaUnitats },
  { camp: campData, valida: validaData },
  { camp: campMissatge, valida: validaMissatge },
  { camp: campPrivacitat, valida: validaPrivacitat }
];


/* ---------- Missatges d'error ---------- */

// Retorna on s'ha de posar el missatge: el <div class="camp"> o, si no n'hi ha, el mateix element
function obteContenidor(camp) {
  const contenidor = camp.closest(".camp");
  if (contenidor === null) {
    return camp;
  }
  return contenidor;
}

// Esborra el missatge d'error d'un camp i li treu la classe error
function treuError(camp) {
  const missatge = document.querySelector("#error-" + camp.id);
  if (missatge !== null) {
    missatge.remove();
  }
  camp.classList.remove("error");
  camp.removeAttribute("aria-invalid");
}

// Marca el camp amb la classe error i hi posa el missatge a sota (només un)
function mostraError(camp, text) {
  treuError(camp);  // així el missatge no es repeteix
  const missatge = document.createElement("p");
  missatge.classList.add("missatge-error");
  missatge.id = "error-" + camp.id;
  missatge.textContent = text;
  obteContenidor(camp).appendChild(missatge);
  camp.classList.add("error");
  camp.setAttribute("aria-invalid", "true");
}

// Comprova un camp, mostra o treu l'error i retorna true si és correcte
function validaCamp(validacio) {
  const error = validacio.valida();
  if (error !== "") {
    mostraError(validacio.camp, error);
    return false;
  }
  treuError(validacio.camp);
  return true;
}

// Mentre l'usuari corregeix, torna a comprovar només els camps que tenen error
function revalidaCampsAmbError() {
  validacions.forEach((validacio) => {
    if (validacio.camp.classList.contains("error")) {
      validaCamp(validacio);
    }
  });
}

// Posa el focus al camp (si és el grup de plataformes, al primer botó d'opció)
function enfocaCamp(camp) {
  if (camp === grupPlataforma) {
    camp.querySelector("input").focus();
  } else {
    camp.focus();
  }
}


/* ---------- Comptador de caràcters ---------- */

// Mostra «X / 300 caràcters» sota el textarea i l'avisa si passa del màxim
function actualitzaComptadorCaracters() {
  const longitud = campMissatge.value.length;
  comptadorCaracters.textContent = longitud + " / " + MAX_MISSATGE + " caràcters";
  if (longitud > MAX_MISSATGE) {
    comptadorCaracters.classList.add("comptador--excedit");
  } else {
    comptadorCaracters.classList.remove("comptador--excedit");
  }
}


/* ---------- Resum de confirmació ---------- */

// Retorna el text visible de l'opció triada en un <select>
function textOpcio(select) {
  return select.options[select.selectedIndex].textContent;
}

// Converteix "2026-11-05" en "05/11/2026"
function formataData(valor) {
  return valor.split("-").reverse().join("/");
}

// Crea la targeta de resum amb les dades i l'agraïment, i substitueix l'anterior
function mostraResum() {
  const resumAnterior = document.querySelector("#resum-consulta");
  if (resumAnterior !== null) {
    resumAnterior.remove();
  }

  const nom = campNom.value.trim();
  const plataforma = grupPlataforma.querySelector("input[name='plataforma']:checked");

  // Parelles [títol, valor] que es mostraran al resum
  const dades = [
    ["Nom", nom],
    ["Correu", campCorreu.value.trim()],
    ["Telèfon", campTelefon.value.trim() !== "" ? campTelefon.value.trim() : "No indicat"],
    ["Motiu", textOpcio(campMotiu)],
    ["Joc", textOpcio(campJoc)],
    ["Plataforma", plataforma.parentElement.textContent.trim()],
    ["Unitats", campUnitats.value.trim()],
    ["Data de recollida", campData.value !== "" ? formataData(campData.value) : "No indicada"],
    ["Butlletí", campButlleti.checked ? "Sí" : "No"],
    ["Missatge", campMissatge.value.trim()]
  ];

  const targeta = document.createElement("article");
  targeta.id = "resum-consulta";
  targeta.classList.add("resum-consulta");
  targeta.setAttribute("tabindex", "-1");  // perquè hi puguem posar el focus

  const titol = document.createElement("h3");
  titol.textContent = "Gràcies, " + nom + "!";
  targeta.appendChild(titol);

  const agraiment = document.createElement("p");
  agraiment.textContent = "Hem rebut la teva consulta i et respondrem a " + campCorreu.value.trim() + ". Aquestes són les dades que ens has enviat:";
  targeta.appendChild(agraiment);

  const llista = document.createElement("dl");
  llista.classList.add("resum-consulta__dades");
  dades.forEach((dada) => {
    const titolDada = document.createElement("dt");
    titolDada.textContent = dada[0];
    const valorDada = document.createElement("dd");
    valorDada.textContent = dada[1];
    llista.appendChild(titolDada);
    llista.appendChild(valorDada);
  });
  targeta.appendChild(llista);

  formulari.before(targeta);
  targeta.focus();
}


/* ---------- Enviament ---------- */

// En enviar: valida tots els camps; si tot és correcte, mostra el resum i buida el formulari
function gestionaEnviament(event) {
  event.preventDefault();  // el formulari no s'envia ni es recarrega la pàgina

  // filter crida validaCamp per a tots els camps i es queda amb els incorrectes
  const campsIncorrectes = validacions.filter((validacio) => validaCamp(validacio) === false);

  if (campsIncorrectes.length > 0) {
    enfocaCamp(campsIncorrectes[0].camp);
    return;
  }

  mostraResum();
  formulari.reset();
}

// En esborrar el formulari, també s'esborren els errors i es reinicia el comptador
function netejaFormulari() {
  validacions.forEach((validacio) => {
    treuError(validacio.camp);
  });
  comptadorCaracters.textContent = "0 / " + MAX_MISSATGE + " caràcters";
  comptadorCaracters.classList.remove("comptador--excedit");
}

formulari.addEventListener("submit", gestionaEnviament);
formulari.addEventListener("reset", netejaFormulari);
formulari.addEventListener("input", revalidaCampsAmbError);
campMissatge.addEventListener("input", actualitzaComptadorCaracters);

actualitzaComptadorCaracters();
