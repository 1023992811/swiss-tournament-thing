let players = [];
let roundCount = 0;

function createPlayer(name) {
	players.push(new Player(name));
	updateDisplay();
}

function removePlayer(start, end=1) {
	players.splice(start, end);
	updateDisplay();
}

function removeAllPlayers() {
	removePlayer(0, players.length);
}

function initBracket() {
	swissInitBracket(players);
	roundCount = 1;
	updateDisplay();
}

function nextRound() {
	//tally all scores
	scoreInputs = document.getElementsByClassName("scoreInput");
	for (let x = 0; x < scoreInputs.length; x++) {
		players[x].score += Number(scoreInputs[x].value === "" ? 0 : scoreInputs[x].value);
	}
	roundCount ++;
	swissNextRound(players);
	updateDisplay();
}

function updateDisplay() {
	document.getElementById("roundDisplay").innerHTML = "round " + roundCount;
	let htmlString = "<tr>\n" +
			"<th>player name</th>\n" +
			"<th>score</th>\n" +
			"<th>Total scores</th>\n" +
			"<th>first or second</th>\n" +
			"<th>first count</th>\n" +
			"<th><button onclick=removeAllPlayers()>remove all players</button></th>\n" +
		"</tr>\n";
	for (let x = 0; x < players.length; x++) {
		let tempString = "<tr>\n" +
				"<td>" + String(players[x].name) + "</td>\n" +
				"<td>" + "<input type=number class=scoreInput>" + "</td>\n" +
				"<td>" + String(players[x].score) + "</td>\n" +
				"<td>" + (players[x].isFirst === 0 ? "second" : (players[x].isFirst === 2 ? "bye" : "first")) + "</td>\n" +
				"<td>" + String(players[x].firstCount) + "</td>\n" +
				"<td>" + "<button onclick=removePlayer(" + x + ")>remove</button></td>\n" +
			"</tr>\n";
		htmlString = htmlString.concat(tempString);
	}
	document.getElementById("playerList").innerHTML = htmlString;
}