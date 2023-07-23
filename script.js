const wordsFile = "words.json"; // Substitua pelo caminho correto
let words = []; // Array que armazenará as palavras
let correctWords = []; // Array que armazenará as palavras corretas

let timeLeft = 30; // Tempo total de jogo em segundos
let timeBonus = 2; // Tempo em segundos ganho por palavra correta


// Função para fazer a requisição HTTP e obter os dados do arquivo JSON
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

    timeLeft = 30; // Reinicia o tempo restante para o valor original
    timer = setInterval(updateTimer, 1000);
    setTimeout(endGame, timeLeft * 1000); // Usamos a variável timeLeft para o tempo de término
  }
}

function updateTimer() {
  const timerDisplay = document.getElementById("timerDisplay");
  if (timeLeft > 0) {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
  } else {
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
  document.getElementById("wordDisplay").textContent = "Será que você estudou as palavras da língua portuguesa?";
  displayWord(); // Adiciona esta linha para mostrar a primeira palavra quando o jogo é reiniciado.

  hidePopup();
}

function showCorrectWords() {
  const wordPopup = document.getElementById("wordPopup");
  const wordList = document.getElementById("wordList");
  wordList.innerHTML = "Palavras corretas:<br>" + correctWords.join("<br>");
  wordPopup.style.display = "block";
}

function hidePopup() {
  const wordPopup = document.getElementById("wordPopup");
  wordPopup.style.display = "none";
}

// Event listener para reiniciar o jogo ao recarregar a página
window.addEventListener("afterunload", () => {
    resetGame();
  });

function checkWord() {
  if (isPlaying) {
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
        let timeLeft = parseInt(timerDisplay.textContent);
        timeLeft += timeBonus;
        timerDisplay.textContent = timeLeft;

        // Exibe o "+2" na tela por um breve período de tempo
        const bonusDisplay = document.createElement("div");
        bonusDisplay.textContent = "+2";
        bonusDisplay.className = "bonus";
        document.body.appendChild(bonusDisplay);
        setTimeout(() => {
          document.body.removeChild(bonusDisplay);
        }, 1000); // Remove o elemento "+2" após 1 segundo
      }
    }
  }
}

document.getElementById("userInput").addEventListener("input", checkWord);

