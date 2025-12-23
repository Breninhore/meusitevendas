const audio = document.getElementById("audio");
const tempo = document.getElementById("tempo");
const status = document.getElementById("status");
const tela = document.getElementById("tela");
const slider = document.getElementById("slider");
const indicacao = document.querySelector(".indicacao");
const vibracaoAudio = document.getElementById("vibracao");

let audioLiberado = false;

document.addEventListener("touchstart", () => {
  if (!audioLiberado) {
    vibracaoAudio.currentTime = 0;
    vibracaoAudio.play().then(() => {
      vibracaoAudio.pause();
      vibracaoAudio.currentTime = 0;
      audioLiberado = true;
    }).catch(() => {});
  }
}, { once: true });

vibracaoAudio.volume = 0.6; // ajuste fino depois

let segundos = 0;
let contador = null;
let inicioY = null;
let vibrando = false;
let atendida = false;
let somLiberado = false;

/* ===== INICIAR VIBRAÇÃO APÓS LOAD ===== */
window.addEventListener("load", () => {
  vibrando = true;
  tela.classList.add("vibrating");
  vibrar();
});

function vibrar() {
  if (!vibrando) return;
  navigator.vibrate([500, 300]);
  setTimeout(vibrar, 900);
}

/* ===== SLIDE PARA ATENDER ===== */
slider.addEventListener("touchstart", (e) => {
  if (atendida) return;

  inicioY = e.touches[0].clientY;

  // 🔊 COMEÇA O SOM DA VIBRAÇÃO AQUI
  vibracaoAudio.currentTime = 0;
  vibracaoAudio.play().catch(() => {});
});

slider.addEventListener("touchmove", (e) => {
  if (!inicioY || atendida) return;

  const atualY = e.touches[0].clientY;
  const diferenca = inicioY - atualY;

  if (diferenca > 20) {
    slider.classList.add("arrastando");
    indicacao.style.opacity = "0";
  }
});

slider.addEventListener("touchend", () => {
  if (slider.classList.contains("arrastando") && !atendida) {
    atender();
  } else {
    // se não atendeu, volta a indicação
    indicacao.style.opacity = "1";
  }

  slider.classList.remove("arrastando");
  inicioY = null;
});

/* ===== ATENDER CHAMADA ===== */
function atender() {
  if (atendida) return; // 🔒 trava total
  atendida = true;
  vibrando = false;

  vibracaoAudio.pause();
vibracaoAudio.currentTime = 0;

  navigator.vibrate(0);
  tela.classList.remove("vibrating");

  indicacao.style.display = "none";
  status.style.display = "none";
  tempo.style.display = "block";

  audio.currentTime = 0;
  audio.play();

  if (contador) clearInterval(contador); // 🔒 segurança extra

  contador = setInterval(() => {
    segundos++;
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    tempo.innerText = `${min}:${sec}`;
  }, 1000);

  audio.onended = () => {
    clearInterval(contador);
    tempo.innerText = "Encerrado";
  };
}
