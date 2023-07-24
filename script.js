// Import the Firebase SDK
import firebase from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";

// Your web app's Firebase configuration
const firebaseApp = firebase.initializeApp(firebaseConfig);

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
  timeLeft = 15; // Definir o tempo inicial como 30 segundos
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
  document.getElementById("userInput").disabled = true;
  document.getElementById("startButton").textContent = "Jogar Novamente";
  document.getElementById("startButton").style.display = "inline-block";
  document.getElementById("showWordsButton").style.display = "block";

  const timerDisplay = document.getElementById("timerDisplay");
  const currentTime = parseInt(timerDisplay.textContent);
  const timeLeftWithBonus = currentTime + timeBonus;

  if (timeLeftWithBonus > 0) {
    const username = prompt("Fim de jogo! Digite seu nome para salvar sua pontuação:");

    if (username) {
      addScoreToScoreboard(username, score, currentTime);
    }
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
  const closeButton = document.getElementById("closeButton"); // Adicionamos esta linha

  if (wordPopup.style.display === "block") {
      // Se o pop-up já estiver aberto, fechamos ele
      wordPopup.style.display = "none";
      closeButton.style.display = "none"; // Escondemos o botão de fechar junto com o pop-up
  } else {
      // Se o pop-up estiver fechado, exibimos as palavras corretas
      let formattedList = "";
      for (let i = 0; i < correctWords.length; i++) {
          formattedList += `${i + 1}. ${correctWords[i]}<br>`;
      }

      wordList.innerHTML = formattedList;
      wordPopup.style.display = "block";
      closeButton.style.display = "inline-block"; // Exibimos o botão de fechar quando abrimos o pop-up
  }
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




// Função para adicionar o score ao Scoreboard
function addScoreToScoreboard(username, correctWordsCount, peakSeconds) {
  const newScore = {
    username: username,
    correctWordsCount: correctWordsCount,
    peakSeconds: peakSeconds,
  };

  // Salva o novo score no banco de dados do Firebase
  database.ref("scores").push(newScore);
}

// Função para atualizar a exibição do Scoreboard
function updateScoreboardDisplay(scores) {
  const scoreboardTable = document.getElementById("scoreboard").getElementsByTagName("tbody")[0];
  scoreboardTable.innerHTML = ""; // Limpa o conteúdo da tabela

  scores.forEach((score) => {
    const newRow = scoreboardTable.insertRow();

    const nameCell = newRow.insertCell();
    nameCell.textContent = score.username;

    const wordsCell = newRow.insertCell();
    wordsCell.textContent = score.correctWordsCount;

    const peakSecondsCell = newRow.insertCell();
    peakSecondsCell.textContent = score.peakSeconds;
  });
}

// Event listener para carregar o Scoreboard quando a página é carregada
window.addEventListener("load", () => {
  
  // Defina a variável database dentro do escopo da função
  const database = firebase.database();
  // Carrega os scores do banco de dados do Firebase
  database.ref("scores").once("value", (snapshot) => {
    const scores = snapshot.val();
    if (scores) {
      // Converte o objeto de scores em um array
      const scoresArray = Object.values(scores);

      // Ordena a lista em ordem decrescente com base na quantidade de palavras corretas
      scoresArray.sort((a, b) => b.correctWordsCount - a.correctWordsCount);

      // Limita a lista para conter apenas os 10 melhores scores
      const topScores = scoresArray.slice(0, 10);

      // Atualiza a exibição do scoreboard na página
      updateScoreboardDisplay(topScores);
    }
  });
});


// Seu código JavaScript existente aqui

// Função para mostrar o pop-up do Scoreboard
function showScoreboard() {
  const scoreboardPopup = document.getElementById("scoreboardPopup");
  scoreboardPopup.style.display = "block";
}

// Função para esconder o pop-up do Scoreboard
function hideScoreboard() {
  const scoreboardPopup = document.getElementById("scoreboardPopup");
  scoreboardPopup.style.display = "none";
}

