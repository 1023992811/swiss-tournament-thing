function updateDisplay() {
	let players = playerPool.players;
	document.getElementById("nextRoundButton").disabled = bracketEnded;
	document.getElementById("roundDisplay").innerHTML = "Round " + roundCount;
	if (bracketEnded)
		displayPlacementList(players);
	else
		displayPairsList(players);
}

function displayPairsList(players) {
	let htmlString = pairsListHeader;
	for (let x = 0; x < players.length; x++) {
		let tableRow = getPairsListTableRow(x, players);
		htmlString = htmlString.concat(tableRow);
	}
	document.getElementById("playerList").innerHTML = htmlString;
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
		"<th>had bye</th>\n" +
	"</tr>\n";

function getPairsListTableRow(rowNum, players) {
	let tableNum = Math.floor(rowNum / 2) + 1;
	let tableRow =
		"<tr>\n" +
		"<td>" + 
			tableNum +
		"</td>\n" +
		"<td>" +
			String(players[rowNum].name) +
		"</td>\n" +
		"<td>" +
			"<input type=radio class=scoreInput name=table" + 
				tableNum + 
				" id=row" + 
				rowNum +
				(rowNum % 2 === 0 ? " checked" : "") +
				">" +
			"<label for=row" + rowNum + ">win</lable>" +
		"</td>\n" +
		"<td>" +
			(players[rowNum].getScoreString()) +
		"</td>\n" +
		"<td>" +
			(players[rowNum].isFirst()
				? "first"
				: players[rowNum].isSecond()
				? "second"
				: "bye") +
		"</td>\n" +
		"<td>" +
			String(players[rowNum].firstCount) +
		"</td>\n" +
		"<td>" +
			"<button type='button' class='btn btn-danger' onclick=removeConfirmation(" +
			rowNum +
			")>Remove</button></td>\n" +
		"<td>" +
			players[rowNum].hadBye +
		"</td>\n" +
		"</tr>\n";
	return tableRow;
}

const placementListHeader = 
	"<tr>\n" +
		"<th>placement</th>" +
		"<th>player name</th>\n" +
		"<th>final scores</th>\n" +
		"<th>buchholz score</th>\n" +
		"<th><button type='button' class='btn btn-danger' onclick=removeAllPlayersConfirmation()>Remove All Players</button></th>\n" +
	"</tr>\n";

function getPlacementListTableRow(rowNum, players) {
	let tableRow = 
		"<tr>\n" +
		"<td>" + (rowNum+1) + "</td>" +
		"<td>" + (players[rowNum].name) + "</td>\n" +
		"<td>" + (players[rowNum].getScoreString()) + "</td>\n" +
		"<td>" + (players[rowNum].buchholzScore) + "</td>\n" +
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