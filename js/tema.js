/* ==================================================================
   PixelCat Games · tema.js (les tres pàgines)
   Part D: botó per alternar entre mode clar i mode fosc.
   ================================================================== */

// Nom amb què es desa el mode triat al navegador
const CLAU_TEMA = "pixelcat-tema";

const botoTema = document.querySelector("#boto-tema");

// Canvia el text del botó segons el mode que hi ha ara
function actualitzaBotoTema() {
  if (document.body.classList.contains("mode-fosc")) {
    botoTema.textContent = "Mode clar";
  } else {
    botoTema.textContent = "Mode fosc";
  }
}

// Desa el mode perquè es mantingui en canviar de pàgina
function desaTema(esFosc) {
  try {
    localStorage.setItem(CLAU_TEMA, esFosc ? "fosc" : "clar");
  } catch (error) {
    // Si el navegador no deixa desar res, el mode només dura en aquesta pàgina
  }
}

// En obrir la pàgina, recupera el mode desat i l'aplica
function carregaTema() {
  try {
    if (localStorage.getItem(CLAU_TEMA) === "fosc") {
      document.body.classList.add("mode-fosc");
    }
  } catch (error) {
    // Si no es pot llegir, la pàgina comença en mode clar
  }
  actualitzaBotoTema();
}

// Afegeix o treu la classe mode-fosc de <body> i desa l'elecció
function canviaTema() {
  const esFosc = document.body.classList.toggle("mode-fosc");
  desaTema(esFosc);
  actualitzaBotoTema();
}

botoTema.addEventListener("click", canviaTema);
carregaTema();
