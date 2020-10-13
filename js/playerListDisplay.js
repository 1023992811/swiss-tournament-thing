function updateDisplay() {
	let players = playerPool.players;
	document.getElementById("nextRoundButton").disabled = bracketEnded;
	document.getElementById("roundDisplay").innerHTML = "Round " + roundCount;
	if (bracketEnded)
		displayPlacementList(players);
	else
		displayPairsList(players);
	enableDropButton();
}

function displayPairsList(players) {
	let table = document.getElementById("playerList");
	table.innerHTML = pairsListHeader;
	for (let x = 0; x < players.length; x++) {
		let tableRow = getPairsListTableRow(x, players);
		table.appendChild(tableRow);
	}
	
}

function displayPlacementList(players) {
	let htmlString = placementListHeader;
	for (let x = 0; x < players.length; x++) {
		let tableRow = getPlacementListTableRow(x, players);
		htmlString = htmlString.concat(tableRow);
	}
	document.getElementById("playerList").innerHTML = htmlString;
}

const pairsListHeader = 
	"<tr>\n" +
		"<th>table number</th>" +
		"<th>player name</th>\n" +
		"<th>select winners</th>\n" +
		"<th>scores</th>\n" +
		"<th>first or second</th>\n" +
		"<th>first count</th>\n" +
		"<th><button type='button' class='btn btn-danger' onclick=removeAllPlayersConfirmation()>Remove All Players</button></th>\n" +
		"<th>players to drop</th>\n" +
		"<th>had bye</th>\n" +
	"</tr>\n";

function getPairsListTableRow(rowNum, players) {
	let tableNum = Math.floor(rowNum / 2) + 1;
	
	let tableRow = document.createElement("tr");
	
	let tableNumDisplay = document.createElement("td");
	tableNumDisplay.textContent = tableNum;
	tableRow.appendChild(tableNumDisplay);
	
	let playerNameDisplay = document.createElement("td");
	playerNameDisplay.textContent = String(players[rowNum].name);
	tableRow.appendChild(playerNameDisplay);

	let scoreInputDisplay = document.createElement("td");
	let scoreInput = document.createElement("button");
	scoreInput.className = "scoreInput btn";
	scoreInput.name = "table" + tableNum;
	rowNum % 2 === 0
		? switchButtonToWinner(scoreInput)
		: switchButtonToLoser(scoreInput);
	scoreInput.addEventListener("click", (event) => {scoreInputHandler(event, scoreInput)})
	scoreInputDisplay.appendChild(scoreInput);
	tableRow.appendChild(scoreInputDisplay);
		
	let playerScore = document.createElement("td");
	playerScore.textContent = (players[rowNum].getScoreString());
	tableRow.appendChild(playerScore);

	let playerStatus = document.createElement("td");
	playerStatus.textContent = (players[rowNum].isFirst()
		? "first"
		: players[rowNum].isSecond()
		? "second"
		: "bye")
	tableRow.appendChild(playerStatus);

	let firstCount = document.createElement("td");
	firstCount.textContent = String(players[rowNum].firstCount);
	tableRow.appendChild(firstCount);

	let removeButtonDisplay = document.createElement("td");
	let removeButton = document.createElement("button");
	removeButton.textContent = "remove";
	removeButton.className = "btn btn-danger";
	removeButton.onclick = "removeConfirmation(" + rowNum + ")";
	removeButtonDisplay.appendChild(removeButton);
	tableRow.appendChild(removeButtonDisplay);
	
	let dropPlayerDisplay = document.createElement("td");
	let dropPlayerMark = document.createElement("input");
	dropPlayerMark.type = "checkbox";
	dropPlayerMark.className = "dropInput";
	dropPlayerMark.onclick = "enableDropButton()";
	dropPlayerDisplay.appendChild(dropPlayerMark);
	tableRow.appendChild(dropPlayerDisplay);
		
	let hadBye = document.createElement("td");
	hadBye.textContent = players[rowNum].hadBye;
	tableRow.appendChild(hadBye);

	return tableRow;
}

const placementListHeader = 
	"<tr>\n" +
		"<th>placement</th>" +
		"<th>player name</th>\n" +
		"<th>final scores</th>\n" +
		"<th>loser scores</th>\n" +
		"<th>winner scores</th>\n" +
		"<th>dropped</th>\n" +
		"<th><button type='button' class='btn btn-danger' onclick=removeAllPlayersConfirmation()>Remove All Players</button></th>\n" +
	"</tr>\n";

function getPlacementListTableRow(rowNum, players) {
	let tableRow = 
		"<tr>\n" +
		"<td>" + (rowNum+1) + "</td>" +
		"<td>" + (players[rowNum].name) + "</td>\n" +
		"<td>" + (players[rowNum].getScoreString()) + "</td>\n" +
		"<td>" + (players[rowNum].loserScore) + "</td>\n" +
		"<td>" + (players[rowNum].winnerScore) + "</td>\n" +
		"<td>" + (players[rowNum].dropped) + "</td>\n" +
		"<td><button type='button' class='btn btn-danger' onclick=removeConfirmation(" + rowNum + ")>Remove</button></td>\n" +
		"</tr>\n";
	return tableRow;
}

function removeConfirmation(playerCell) {
  if (window.confirm("Do you really want to remove this player?")) {
	playerPool.removePlayer(playerCell);
	updateDisplay();
  }
}

function removeAllPlayersConfirmation() {
  if (
	window.confirm(
	  "You're about to remove all players.  Do you want to proceed?"
	)
  ) {
	playerPool.removeAllPlayers();
	updateDisplay();
  }
}

function enableDropButton() {
	dropInputs = document.getElementsByClassName("dropInput");
	let disabled = true;
	for (let input of dropInputs) {
		if (input.checked) {
			disabled = false;
			break;
		}
	}
	document.getElementById("dropButton").disabled = disabled;
}

function scoreInputHandler(event, scoreInput) {
	let thisTable = document.getElementsByName(scoreInput.name);
	if (scoreInput.classList.contains("btn-success")) {
		switchButtonToLoser(scoreInput);
	} else {
		for (let input of thisTable) {
			switchButtonToLoser(input);
		}
		switchButtonToWinner(scoreInput);
	}
}

function switchButtonToWinner(button) {
	button.classList.remove("btn-danger");
	button.classList.add("btn-success");
	button.textContent = "winner";
}

function switchButtonToLoser(button) {
	button.classList.remove("btn-success");
	button.classList.add("btn-danger");
	button.textContent = "loser";
}
