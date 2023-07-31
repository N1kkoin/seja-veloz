let perfectionistMode = false; // Variável para verificar se o modo perfeccionista está ativado

let wordsFilePT = "palavras.json"; // Substitua pelo caminho correto
let wordsFileEN = "words.json"; // Substitua pelo caminho correto
let wordsFile; // Variável para armazenar o caminho do arquivo com as palavras

let leaderboard = []; // Array que armazenará as informações do leaderboard
let startTime; // Variável para armazenar o tempo inicial

let words = []; // Array que armazenará as palavras
let correctWords = []; // Array que armazenará as palavras corretas
let timeLeft; // Reinicia o tempo restante para o valor original

let selectedLanguage = null; // Variável para armazenar a língua selecionada

async function fetchWords() {
  try {
      const response = await fetch(wordsFile);
      const data = await response.json();
      words = data.words;
  } catch (error) {
      console.error("Erro ao buscar as palavras:", error);
  }
}

async function setLanguage(language) {
  if (language === 'pt') {
      wordsFile = "palavras.json"; // Define o caminho para o arquivo de palavras em português
  } else if (language === 'en-us') {
      wordsFile = "words.json"; // Define o caminho para o arquivo de palavras em inglês
  }
  selectedLanguage = language; // Store the selected language in the variable
  await fetchWords(); // Carrega o arquivo de palavras correspondente ao idioma escolhido
  document.getElementById('startButton').disabled = false; // Habilita o botão de iniciar o jogo após a seleção de idioma
}

// Desabilita o botão de iniciar o jogo inicialmente
document.getElementById('startButton').disabled = true;

fetchWords(wordsFilePT);

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
    startTime = Date.now(); // Registra o momento em que o jogo começou
    isPlaying = true;
    score = 0;
    document.getElementById("score").textContent = score;
    document.getElementById("startButton").style.display = "none"; // Esconde o botão "Iniciar Jogo"
    document.getElementById("languageSelection").style.display = "none";
    document.getElementById("showLeaderboardButton").style.display = "none";
    document.getElementById("perfectionistModeButton").style.display = "none";
    document.getElementById("endGameButton").style.display = "inline-block";

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
  document.getElementById("startButton").textContent = "Reiniciar";
  document.getElementById("startButton").style.display = "inline-block"; // Mostra o botão "Iniciar Jogo" novamente
  document.getElementById("languageSelection").style.display = "inline-block";
  document.getElementById("showLeaderboardButton").style.display = "inline-block";
  document.getElementById("endGameButton").style.display = "none";
  document.getElementById("perfectionistModeButton").style.display = "inline-block";
  

  
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

  if (score > 1) {
  // Obtém o nome do jogador
  const playerName = prompt("Digite seu nome para salvar sua pontuação:");
  const playerTimeInSeconds = Math.floor((Date.now() - startTime) / 1000); // Calcula o tempo total que a partida durou em segundos inteiros

  // Extrai as horas, minutos e segundos do tempo total em segundos
  const hours = Math.floor(playerTimeInSeconds / 3600);
  const remainingSeconds = playerTimeInSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  // Formatação com zeros à esquerda para garantir que os valores sejam mostrados com dois dígitos
  const formattedHours = hours > 0 ? String(hours).padStart(2, '0') + 'h' : '';
  const formattedMinutes = minutes > 0 ? String(minutes).padStart(2, '0') + 'm' : '';
  const formattedSeconds = String(seconds).padStart(2, '0') + 's';

  // Concatenação do resultado formatado
  let playerTime = formattedHours + formattedMinutes + formattedSeconds;

  // Remover o "0m" se não houver minutos
  playerTime = playerTime.replace(/^0m/, '');

  // Remover o "0h" se não houver horas
  playerTime = playerTime.replace(/^0h/, '');

  if (playerName) {
    // Salva as informações do jogador no leaderboard
    leaderboard.push({ name: playerName, score: score, time: playerTime, language: selectedLanguage });

    // Classifica o leaderboard em ordem decrescente de pontuação
    leaderboard.sort((a, b) => b.score - a.score);

    // Limita o leaderboard a, por exemplo, 10 melhores pontuações (opcional)
    leaderboard = leaderboard.slice(0, 20);

    // Exibe o leaderboard atualizado
    displayLeaderboard();

  // Update the data in the Firebase database
  const leaderboardRef = firebase.database().ref("leaderboard");
  leaderboardRef.push({ name: playerName, score: score, time: playerTime, language: selectedLanguage });
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

document.getElementById('perfectionistModeButton').addEventListener('click', function() {
  perfectionistMode = !perfectionistMode; // Alternar o modo perfeccionista
  // Atualize o conteúdo do botão com base no status do modo perfeccionista
  this.innerHTML = perfectionistMode ? '<i class="fa fa-circle"></i>' : '<i class="fa fa-circle-o"></i>';
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
        // Se o modo perfeccionista estiver ativado e a palavra estiver errada, terminar o jogo
        if (perfectionistMode) {
          endGame();
        }
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

let config = {
  apiKey: "AIzaSyCbrnx7JGLOo34Auq-r1h9bWmGYv6eZ-5w",
  authDomain: "seja-veloz.firebaseapp.com",
  databaseURL: "https://seja-veloz-default-rtdb.firebaseio.com",
  projectId: "seja-veloz",
  storageBucket: "",
  messagingSenderId: "553532368659"
};
firebase.initializeApp(config);

  // Function to display the leaderboard
  function displayLeaderboard() {
    const leaderboardList = document.getElementById("leaderboardList");
    let leaderboardHTML = "";
  
    // Assuming your Firebase database structure has a "leaderboard" node with the given data
    const leaderboardRef = firebase.database().ref("leaderboard");
  
    // Adicionar cabeçalho da tabela
    leaderboardHTML += `
      <table class="leaderboard-table">
        <thead>
          <tr class="leaderboard-row leaderboard-header">
            <th class="leaderboard-estrela"><i class="fa fa-star"></i></th>
            <th class="leaderboard-nome">Nome</th>
            <th class="leaderboard-linguagem"><i class="fa fa-flag" aria-hidden="true"></i></th>
            <!-- New column for the language -->
            <th class="leaderboard-tempo"><i class="fa fa-clock-o"></i></th>
            <th class="leaderboard-score"><i class="fa fa-check"></i></th>
          </tr>
        </thead>
        <tbody>
    `;
  
    // Fetch the leaderboard data from Firebase and append it to the leaderboardHTML
    leaderboardRef.once("value", (snapshot) => {
      const leaderboard = snapshot.val();
  
      if (leaderboard) {
        // Convert the leaderboard object to an array
        const leaderboardArray = Object.keys(leaderboard).map((key) => leaderboard[key]);
  
        // Sort the leaderboard array by score in descending order
        leaderboardArray.sort((a, b) => b.score - a.score);
  
        // Render the sorted data
        leaderboardArray.forEach((entry, index) => {
          leaderboardHTML += `
            <tr class="leaderboard-row coresdaoras">
              <td class="leaderboard-estrela">${index + 1}</td>
              <td class="leaderboard-nome">${entry.name}</td>
              <td class="leaderboard-linguagem">${entry.language === "pt" ? "PT" : "EN"}</td>
              <td class="leaderboard-tempo">${entry.time}</td>
              <td class="leaderboard-score">${entry.score}</td>
            </tr>
          `;
        });
      }
  
      leaderboardList.innerHTML = leaderboardHTML;
    });
  }
  

// Call the function to display the leaderboard
displayLeaderboard();

// ... (código existente)

// Event listener para reiniciar o jogo ao recarregar a página
window.addEventListener("unload", () => {
  // ... (código existente)

  // Antes de reiniciar o jogo, limpe o event listener do botão "Iniciar Jogo"
  document.getElementById("startButton").removeEventListener("click", startGame);
  resetGame();
});

// Mostrar o leaderboard atualizado ao carregar a página
displayLeaderboard();


// ... (código existente)

function showLeaderboardPopup() {
  const leaderboardPopup = document.getElementById("leaderboardPopup");
  leaderboardPopup.style.display = "block";
}

function hideLeaderboardPopup() {
  const leaderboardPopup = document.getElementById("leaderboardPopup");
  leaderboardPopup.style.display = "none";
}

// Event listener para o botão de exibir leaderboard
document.getElementById("showLeaderboardButton").addEventListener("click", showLeaderboardPopup);

// Event listener para o botão de fechar o popup do leaderboard
document.getElementById("closeLeaderboard").addEventListener("click", hideLeaderboardPopup);

// Aguarde o carregamento completo do DOM antes de atribuir os eventos
document.addEventListener('DOMContentLoaded', function () {
  // Obtenha o botão pelo ID
  const perfectionistModeButton = document.getElementById('perfectionistModeButton');

  // Obtenha todos os elementos com a classe .blocotexto
  const blocotextos = document.getElementsByClassName('blocotexto');

  // Adicione um ouvinte de evento de clique ao botão
  perfectionistModeButton.addEventListener('click', function () {
    // Percorra todos os elementos com a classe .blocotexto e adicione a classe 'active' para mostrar a borda
    for (let i = 0; i < blocotextos.length; i++) {
      blocotextos[i].classList.toggle('active');
    }
  });
});



// Funções para mostrar/ocultar as caixas de conteúdo
function toggleTutorial() {
  var tutorialBox = document.getElementById("tutorialBox");
  var aboutBox = document.getElementById("aboutBox");

  if (tutorialBox.style.display === "block") {
    tutorialBox.style.display = "none";
  } else {
    aboutBox.style.display = "none";
    tutorialBox.style.display = "block";
  }
}

function toggleAbout() {
  var tutorialBox = document.getElementById("tutorialBox");
  var aboutBox = document.getElementById("aboutBox");

  if (aboutBox.style.display === "block") {
    aboutBox.style.display = "none";
  } else {
    tutorialBox.style.display = "none";
    aboutBox.style.display = "block";
  }
}


