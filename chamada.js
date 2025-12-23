const audio = document.getElementById("audio");
const tempo = document.getElementById("tempo");
const status = document.getElementById("status");
const tela = document.getElementById("tela");
const vibracaoAudio = document.getElementById("vibracao");

let segundos = 0;
let contador;
let vibLiberado = false;

// ===== LIBERAR SOM NO PRIMEIRO TOQUE =====
document.addEventListener("touchstart", () => {
  if (!vibLiberado) {
    vibracaoAudio.volume = 0.6;
    vibracaoAudio.play().catch(() => {});
    vibLiberado = true;
  }
}, { once: true });

// ===== VIBRAÇÃO REAL DO CELULAR =====
if (navigator.vibrate) {
  vibrar();
}

function vibrar() {
  navigator.vibrate([500, 300]);
  setTimeout(vibrar, 900);
}

// ===== ATENDER CHAMADA =====
function atender() {
  // para vibração do celular
  navigator.vibrate(0);

  // para som da vibração
  vibracaoAudio.pause();
  vibracaoAudio.currentTime = 0;

  // para vibração visual
  tela.classList.remove("vibrating");

  // troca status por tempo
  status.style.display = "none";
  tempo.style.display = "block";

  // toca áudio principal
  audio.play();

  // contador
  contador = setInterval(() => {
    segundos++;
    let min = String(Math.floor(segundos / 60)).padStart(2, "0");
    let sec = String(segundos % 60).padStart(2, "0");
    tempo.innerText = `${min}:${sec}`;
  }, 1000);

  // quando o áudio acabar
  audio.onended = () => {
    clearInterval(contador);
    tempo.innerText = "Encerrado";
  };
}