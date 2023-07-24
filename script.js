const wordsFile = "palavras.json"; // Substitua pelo caminho correto
let words = []; // Array que armazenará as palavras
let correctWords = []; // Array que armazenará as palavras corretas

let timeLeft; // Reinicia o tempo restante para o valor original

async function fetchWords() {
  try {
    const response = await fetch(wordsFile);
    const data = await response.json();
    words = data.words;
  } catch (error) {
    console.error("Erro ao buscar as palavras:", error);
  }
}

fetchWords();

const timeBonus = 3; // Tempo em segundos ganho por palavra correta
const animationDuration = 500; // Tempo de duração da animação em milissegundos (0,5 segundos)

let timeout; // Variable to store the setTimeout ID
let timer; // Variável para controlar o temporizador
let isPlaying = false; // Variável para verificar se o jogo está em andamento
let score = 0; // Pontuação do jogador

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex].toLowerCase(); // Converte a palavra para letra minúscula
}

function displayWord() {
  const wordDisplay = document.getElementById("wordDisplay");
  wordDisplay.textContent = getRandomWord();
}

function initializeGame() {
  timeLeft = 30; // Definir o tempo inicial como 30 segundos
}

function startGame() {
  resetGame();
  if (!isPlaying) {
    isPlaying = true;
    score = 0;
    document.getElementById("score").textContent = score;
    document.getElementById("startButton").style.display = "none"; // Esconde o botão "Iniciar Jogo"

    // Limpar o conteúdo da caixa de texto de entrada
    document.getElementById("userInput").value = "";

    // Exibe a primeira palavra na caixa de texto
    displayWord();

    document.getElementById("userInput").disabled = false; // Habilita o campo de entrada
    initializeGame();
    timer = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  const timerDisplay = document.getElementById("timerDisplay");
  if (timeLeft > 0) {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
  } else {
    clearInterval(timer); // Stop the timer when timeLeft reaches 0
    endGame();
  }
}

function endGame() {
  clearInterval(timer);
  isPlaying = false;
  document.getElementById("userInput").disabled = true; // Desabilita o campo de entrada
  document.getElementById("startButton").textContent = "Jogar Novamente";
  document.getElementById("startButton").style.display = "inline-block"; // Mostra o botão "Iniciar Jogo" novamente

  // Exibe o botão "Mostrar Palavras Corretas"
  document.getElementById("showWordsButton").style.display = "block";

  // Verifica se o jogador ainda tem tempo restante com os bônus
  const timerDisplay = document.getElementById("timerDisplay");
  const currentTime = parseInt(timerDisplay.textContent);
  const timeLeftWithBonus = currentTime + timeBonus;

  if (timeLeftWithBonus <= 0) {
    // O tempo acabou, encerra o jogo
    return;
  }
}

function resetGame() {
  clearInterval(timer);
  isPlaying = false;
  score = 0;
  correctWords = [];
  document.getElementById("score").textContent = score;
  document.getElementById("userInput").disabled = true;
  document.getElementById("startButton").textContent = "Iniciar Jogo";
  document.getElementById("showWordsButton").style.display = "none";
  document.getElementById("wordDisplay").textContent = "";
  displayWord(); // Adiciona esta linha para mostrar a primeira palavra quando o jogo é reiniciado.

  hidePopup();
}

function showCorrectWords() {
  const wordPopup = document.getElementById("wordPopup");
  const wordList = document.getElementById("wordList");

  let formattedList = "";
  for (let i = 0; i < correctWords.length; i++) {
    formattedList += `${i + 1}. ${correctWords[i]}<br>`;
  }

  wordList.innerHTML = formattedList;
  wordPopup.style.display = "block";
}

function hidePopup() {
  const wordPopup = document.getElementById("wordPopup");
  wordPopup.style.display = "none";
}

// Event listener para reiniciar o jogo ao recarregar a página
window.addEventListener("unload", () => {
  // Antes de reiniciar o jogo, limpe o event listener do botão "Iniciar Jogo"
  document.getElementById("startButton").removeEventListener("click", startGame);
  resetGame();
});

let isCheckingWord = false; // Variável para evitar chamadas repetidas da função checkWord()

function checkWord() {
  if (isPlaying && !isCheckingWord) {
    isCheckingWord = true;
    const userInput = document.getElementById("userInput");
    const currentWord = document.getElementById("wordDisplay").textContent.trim().toLowerCase();
    const typedWord = userInput.value.trim().toLowerCase();

    const wordDisplay = document.getElementById("wordDisplay");
    wordDisplay.innerHTML = ""; // Limpa a exibição atual

    for (let i = 0; i < currentWord.length; i++) {
      const currentLetter = currentWord[i];
      const typedLetter = typedWord[i];

      const letterSpan = document.createElement("span");
      letterSpan.textContent = currentLetter;

      if (typedLetter === undefined) {
        // O jogador ainda não digitou esta letra, mantenha a cor original
        letterSpan.style.color = "#333";
      } else if (currentLetter === typedLetter) {
        // Letra correta, defina a cor para verde
        letterSpan.style.color = "green";
      } else {
        // Letra errada, defina a cor para vermelho
        letterSpan.style.color = "red";
      }

      wordDisplay.appendChild(letterSpan); // Adiciona a letra colorida à exibição
    }

    if (currentWord === typedWord) {
      score++;
      document.getElementById("score").textContent = score;
      userInput.value = ""; // Limpar o campo de entrada
      correctWords.push(currentWord); // Adiciona a palavra correta ao array
      displayWord(); // Mostrar a próxima palavra

      if (isPlaying) {
        const timerDisplay = document.getElementById("timerDisplay");
        const currentTime = parseInt(timerDisplay.textContent);
        const newTime = currentTime + timeBonus;
        timeLeft = newTime <= 0 ? 0 : newTime; // Ensure the timeLeft doesn't go below zero
        timerDisplay.textContent = timeLeft;

        // Exibe o "+3" na tela por um breve período de tempo
        const bonusDisplay = document.createElement("div");
        bonusDisplay.textContent = "+3";
        bonusDisplay.className = "bonus";
        document.body.appendChild(bonusDisplay);
        setTimeout(() => {
          document.body.removeChild(bonusDisplay);
        }, animationDuration);
      }
    }
    // Marca a verificação como concluída para permitir futuras chamadas da função
    isCheckingWord = false;
  }
}

document.getElementById("userInput").addEventListener("input", checkWord);

// Adicione um event listener ao campo de entrada (input) para o evento de "paste" (colar)
document.getElementById("userInput").addEventListener("paste", (event) => {
  // Cancela a ação de colar
  event.preventDefault();

  // Exibe a mensagem "Não roube" em vermelho
  const userInput = document.getElementById("userInput");
  userInput.value = "Não roube";
  userInput.style.color = "red";

  // Remove a mensagem após 2 segundos (2000 milissegundos)
  setTimeout(() => {
    userInput.value = "";
    userInput.style.color = "#333"; // Retorna à cor original do texto
  }, 500);
});
