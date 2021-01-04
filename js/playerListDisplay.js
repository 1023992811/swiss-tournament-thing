let playerDisplay = {

	playerInfoCards: [],

	createPlayerInfoCard: function(player) {
		let tableRow = document.createElement("tr");
		
		let tableNumDisplay = document.createElement("td");
		tableRow.appendChild(tableNumDisplay);
		
		let playerNameDisplay = document.createElement("td");
		playerNameDisplay.textContent = String(player.name);
		tableRow.appendChild(playerNameDisplay);

		let scoreInputDisplay = document.createElement("td");
		let scoreInput = document.createElement("button");
		scoreInput.className = "scoreInput btn";
		switchButtonToLoser(scoreInput);
		scoreInput.addEventListener("click", (event) => { scoreInputHandler(event, scoreInput) });
		scoreInputDisplay.appendChild(scoreInput);
		scoreInputDisplay.className = "printHidden";
		tableRow.appendChild(scoreInputDisplay);

		let playerScore = document.createElement("td");
		tableRow.appendChild(playerScore);

		let playerStatus = document.createElement("td");
		tableRow.appendChild(playerStatus);

		let firstCount = document.createElement("td");
		firstCount.className = "printHidden";
		tableRow.appendChild(firstCount);

		let dropPlayerDisplay = document.createElement("td");
		let dropPlayerMark = document.createElement("input");
		dropPlayerMark.type = "checkbox";
		dropPlayerMark.className = "dropInput";
		dropPlayerMark.addEventListener("click", enableDropButton);
		dropPlayerDisplay.appendChild(dropPlayerMark);
		dropPlayerDisplay.className = "printHidden";
		tableRow.appendChild(dropPlayerDisplay);

		let hadBye = document.createElement("td");
		hadBye.className = "printHidden";
		tableRow.appendChild(hadBye);
		
		let t1Loser = document.createElement("td");
		t1Loser.className = "printHidden hidden";
		tableRow.appendChild(t1Loser);
		
		let t1Winner = document.createElement("td");
		t1Winner.className = "printHidden hidden";
		tableRow.appendChild(t1Winner);
		
		let t2Loser = document.createElement("td");
		t2Loser.className = "printHidden hidden";
		tableRow.appendChild(t2Loser);
		
		let t2Winner = document.createElement("td");
		t2Winner.className = "printHidden hidden";
		tableRow.appendChild(t2Winner);

		let dropped = document.createElement("td");
		dropped.className = "printHidden hidden";
		tableRow.appendChild(dropped);

		this.playerInfoCards.push({
			player: player,
			tableRow: tableRow,
			cells: {
				tableNumDisplay: tableNumDisplay,
				scoreInputDisplay: scoreInputDisplay,
				playerScore: playerScore,
				playerStatus: playerStatus,
				firstCount: firstCount,
				dropPlayerDisplay: dropPlayerDisplay,
				hadBye: hadBye,
				t1Loser: t1Loser,
				t1Winner: t1Winner,
				t2Loser: t2Loser,
				t2Winner: t2Winner,
				dropped: dropped,
			},
		});
	},

	toggleHiddens: function() {
		for (let card of this.playerInfoCards) {
			for (let cell in card.cells) {
				cell.classList.toggle("hidden");
			}
		}
	},
	
	updateCardForPairsList: function() {
		this.matchPlayerPoolOrder();
		
		for (let rowNum = 0;rowNum < this.playerInfoCards.length;rowNum++) {
			let card = playerInfoCards[rowNum];
			let tableNum = Math.floor(rowNum / 2) + 1;
			
			if (tableNum % 2) card.tableRow.classList.add("oddTable");

			let scoreInput = card.cells.scoreInputDisplay.childNodes[0];
			
			card.cells.tableNumDisplay.textContent = tableNum;
			
			scoreInput.name = "table" + tableNum;
			if (rowNum % 2 === 0) switchButtonToWinner(scoreInput);
			
			card.cells.playerScore.textContent = card.player.getScoreString();
			
			card.cells.playerStatus.textContent = (card.player.isFirst()
				? "first"
				: card.player.isSecond()
					? "second"
					: "bye");
					
			card.cells.firstCount.textContent = card.player.firstCount;
			
			card.cells.hadBye.textContent = card.player.hadBye;
		}
		
	}
	
	updateCardForStandingsList: function() {
		//do placement sort here
		
		let placement = 1;
		for (let card of this.playerInfoCards) {
			card.tableRow.classList.remove("oddTable");
			card.cells.tableNumDisplay = placement;
			card.cells.t1Loser.textContent = card.player.loserScore;
			card.cells.t1Winner.textContent = card.player.winnerScore;
			card.cells.t2Loser.textContent = card.player.tier2loserScore;
			card.cells.t2Winner.textContent = card.player.tier2winnerScore;
			card.cells.dropped.textContent = card.player.dropped;
		}
	}
	
	matchPlayerPoolOrder: function() {
		let current = 0
		for (player of playerPool.players) {
			for (let x = current;x < this.playerInfoCards.length;x++) {
				if (player = this.playerInfoCards[x].player) {
					swapListItems(this.playerInfoCards(current, x);
					break;
				}
			}
			current++;
		}
	}
}

function updateDisplay() {
	let players = playerPool.players;
	document.getElementById("nextRoundButton").disabled = swissBracket.ended;
	document.getElementById("roundDisplay").innerHTML = "Round " + swissBracket.roundCount;
	if (swissBracket.ended)
		displayPlacementList(players);
	else
		displayPairsList(players);
	enableDropButton();
	enableNextRoundButton();
	enableEndBracketButton();
}

function displayPairsList(players) {
	let tableHeader = document.getElementById("vangSwissRow");
	tableHeader.innerHTML = pairsListHeader;

	let playersList = document.getElementById("players");
	removeAllChildNode(playersList);
	for (let x = 0; x < players.length; x++) {
		let tableRow = getPairsListTableRow(x, players);
		playersList.appendChild(tableRow);
	}

}

function displayPlacementList(players) {
	let tableHeader = document.getElementById("vangSwissRow");
	tableHeader.innerHTML = placementListHeader;
	let playersList = document.getElementById("players");
	let htmlString = "";
	for (let x = 0; x < players.length; x++) {
		let tableRow = getPlacementListTableRow(x, players);
		htmlString = htmlString.concat(tableRow);
	}
	playersList.innerHTML = htmlString;
}

const pairsListHeader =
	"<tr>\n" +
	"<th>table number</th>" +
	"<th>player name</th>\n" +
	"<th class='printHidden'>select winners</th>\n" +
	"<th>scores</th>\n" +
	"<th>first or second</th>\n" +
	"<th class='printHidden'>first count</th>\n" +
	"<th class='printHidden'>players to drop</th>\n" +
	"<th class='printHidden'>had bye</th>\n" +
	"</tr>\n";

function getPairsListTableRow(rowNum, players) {
	let tableNum = Math.floor(rowNum / 2) + 1;

	let tableRow = document.createElement("tr");
	tableRow.className = (tableNum % 2 ? "oddTable" : "");

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
	scoreInput.addEventListener("click", (event) => { scoreInputHandler(event, scoreInput) })
	scoreInputDisplay.appendChild(scoreInput);
	scoreInputDisplay.className = "printHidden";
	tableRow.appendChild(scoreInputDisplay);

	let playerScore = document.createElement("td");
	playerScore.textContent = (players[rowNum].getScoreString());
	tableRow.appendChild(playerScore);

	let playerStatus = document.createElement("td");
	playerStatus.textContent = (players[rowNum].isFirst()
		? "first"
		: players[rowNum].isSecond()
			? "second"
			: "bye");
	tableRow.appendChild(playerStatus);

	let firstCount = document.createElement("td");
	firstCount.className = "printHidden";
	firstCount.textContent = String(players[rowNum].firstCount);
	tableRow.appendChild(firstCount);

	let removeButtonDisplay = document.createElement("td");
	let removeButton = document.createElement("button");
	removeButton.textContent = "remove";
	removeButton.className = "btn btn-danger";
	removeButton.addEventListener("click", (event) => { removeConfirmation(rowNum) });
	removeButtonDisplay.appendChild(removeButton);
	removeButtonDisplay.className = "printHidden";
	tableRow.appendChild(removeButtonDisplay);

	let dropPlayerDisplay = document.createElement("td");
	let dropPlayerMark = document.createElement("input");
	dropPlayerMark.type = "checkbox";
	dropPlayerMark.className = "dropInput";
	dropPlayerMark.addEventListener("click", enableDropButton);
	dropPlayerDisplay.appendChild(dropPlayerMark);
	dropPlayerDisplay.className = "printHidden";
	tableRow.appendChild(dropPlayerDisplay);

	let hadBye = document.createElement("td");
	hadBye.className = "printHidden";
	hadBye.textContent = players[rowNum].hadBye;
	tableRow.appendChild(hadBye);

	return tableRow;
}

const placementListHeader =
	"<tr>\n" +
	"<th>placement</th>" +
	"<th>player name</th>\n" +
	"<th>final scores</th>\n" +
	"<th class='printHidden'>loser scores</th>\n" +
	"<th class='printHidden'>winner scores</th>\n" +
	"<th class='printHidden'>tier2 loser scores</th>\n" +
	"<th class='printHidden'>tier2 winner scores</th>\n" +
	"<th>dropped</th>\n" +
	"</tr>\n";

function getPlacementListTableRow(rowNum, players) {
	let tableRow =
		"<tr>\n" +
		"<td>" + (rowNum + 1) + "</td>" +
		"<td>" + (players[rowNum].name) + "</td>\n" +
		"<td>" + (players[rowNum].getScoreString()) + "</td>\n" +
		"<td class='printHidden'>" + (players[rowNum].loserScore) + "</td>\n" +
		"<td class='printHidden'>" + (players[rowNum].winnerScore) + "</td>\n" +
		"<td class='printHidden'>" + (players[rowNum].tier2loserScore) + "</td>\n" +
		"<td class='printHidden'>" + (players[rowNum].tier2winnerScore) + "</td>\n" +
		"<td>" + (players[rowNum].dropped) + "</td>\n" +
		"</tr>\n";
	return tableRow;
}

//input scripts

function addPlayer() {
	let playerNames = document.getElementById("newPlayerNames").value.split("\n");
	for (let playerName of playerNames) {
		if (playerName.trim() !== "") {
			let newPlayer = new SwissPlayer(playerName);
			playerPool.addPlayer(newPlayer);
			playerDisplay.createPlayerInfoCard(newPlayer);
		}
	}
	updateDisplay();
}

function startBracket() {
	if (!swissBracket.started || window.confirm("Current tournament progress will be lost, proceed?")) {
		swissBracket.reset();
		updateDisplay();
		debugHelper.logUniquePairsCount(playerPool.players);
	}
}

function dropAndPair() {
	dropMarkedPlayers();
	swissBracket.pairPlayers();
	updateDisplay();
}

function dropAndNextRound() {
	debugHelper.lastState = playerPool.players;
	playerPool.tallyScores();
	dropMarkedPlayers();
	swissBracket.nextRound();
	debugHelper.logUniquePairsCount(playerPool.players);
	updateDisplay();
}

function endBracket() {
	swissBracket.endBracket();
	updateDisplay();
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

function enableNextRoundButton() {
	document.getElementById("nextRoundButton").disabled = !swissBracket.started;
}

function enableEndBracketButton() {
	document.getElementById("endBracketButton").disabled = swissBracket.ended;
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

function dropMarkedPlayers() {
	let dropInputs = document.getElementsByClassName("dropInput");
	for (let x = dropInputs.length - 1; x >= 0; x--) {
		if (dropInputs[x].checked) {
			playerPool.dropPlayer(x);
		}
	}
}


function removeAllChildNode(parent) {
	while (parent.firstChild !== null) {
		parent.removeChild(parent.firstChild);
	}
}