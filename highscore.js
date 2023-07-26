document.addEventListener("DOMContentLoaded", function() {
    const leaderboardTable = document.getElementById("leaderboard-table");
    const showLeaderboardBtn = document.getElementById("showLeaderboardBtn");
    const popup = document.getElementById("popup");
  
    function updateLeaderboard() {
      // Recupera os dados salvos no localStorage
      const playersData = JSON.parse(localStorage.getItem("playersData") || "[]");
  
      // Ordena os jogadores em ordem decrescente de pontuação
      playersData.sort((a, b) => b.score - a.score);
  
      // Limpa a tabela
      leaderboardTable.innerHTML = `
        <tr>
          <th>Posição</th>
          <th>Nome do Jogador</th>
          <th>Pontuação</th>
        </tr>
      `;
  
      // Atualiza a tabela com os dados ordenados
      playersData.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${player.name}</td>
          <td>${player.score}</td>
        `;
        leaderboardTable.appendChild(row);
      });
    }

    // Evento de clique do botão
    showLeaderboardBtn.addEventListener("click", function() {
        // Atualiza a tabela do leaderboard antes de mostrar o popup
        updateLeaderboard();
  
        // Exibe o popup
        popup.style.display = "block";
      });

      // Evento de clique fora do popup para fechá-lo
    document.addEventListener("click", function(event) {
        if (!popup.contains(event.target) && event.target !== showLeaderboardBtn) {
          popup.style.display = "none";
          leaderboardTable.innerHTML = ""; // Limpa a tabela ao fechar o popup
        }
      });
  
    function savePlayerData(name, score) {
      // Recupera os dados salvos no localStorage
      const playersData = JSON.parse(localStorage.getItem("playersData") || "[]");
  
      // Adiciona o novo jogador aos dados
      playersData.push({ name, score });
  
      // Salva os dados atualizados no localStorage
      localStorage.setItem("playersData", JSON.stringify(playersData));
    }
  
    // Exemplo de uso: chame a função savePlayerData(name, score) quando o jogo terminar
    // savePlayerData("Nome do Jogador", 100);
  
    // Atualiza a tabela do leaderboard quando a página é carregada
    updateLeaderboard();
  });