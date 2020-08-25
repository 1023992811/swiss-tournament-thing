class Player {
	constructor(name) {
		this.name = name;
		this.firstCount = 0;
		this.score = 0;
		this.isFirst = 0;
		this.prevPlayers = [];
		this.bye = false;
	}
	
	/*
		function to call when this player enters a new round
		isFirst: 0 or 1, is this player going first this round 1 for first, 0 for second
		opponent: Player, the opponent of this player
	*/
	newRound(isFirst, opponent) {
		this.isFirst = Number(isFirst);
		if(this.isFirst === 2) {
			this.bye = true;
		} else {
			this.firstCount += this.isFirst;
			this.prevPlayers.push(opponent);
		}
	}
	
	reset() {
		this.firstCount = 0;
		this.score = 0;
		this.isFirst = 0;
		this.prevPlayers = [];
		this.bye = false;
	}
}


let players = [];
let roundCount = 0;

function createPlayer(name) {
	players.push(new Player(name));
	updateDisplay();
}

function removePlayer(x) {
	players.splice(x, 1);
	updateDisplay();
}

function createBracket() {
	//insert seeding stuff here
	
	for (let player of players)
		player.reset();
	for (let x = 0; x < players.length - 1; x += 2) {
		players[x].newRound(1, players[x+1]);
		players[x+1].newRound(0, players[x]);
	}
	if (players.length % 2 === 1)
		players[players.length-1].newRound(2);
	
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
	players.sort(comparePlayers);
	for (let x = 0; x < players.length - 1; x += 2) {
		players[x].newRound(1, players[x+1]);
		players[x+1].newRound(0, players[x]);
	}
	if (players.length % 2 === 1)
		players[players.length-1].newRound(2);
	
	updateDisplay();
}

function comparePlayers(a, b) {
	result = b.score - a.score;
	if (result === 0) {
		result = a.firstCount - b.firstCount;
	}
	console.log(result);
	return result;
}

function updateDisplay() {
	document.getElementById("roundDisplay").innerHTML = "round " + roundCount;
	let htmlString = "<tr>\n" +
			"<th>player name</th>\n" +
			"<th>score</th>\n" +
			"<th>Total scores</th>\n" +
			"<th>first or second</th>\n" +
			"<th>first count</th>\n" +
			"<th>remove player?</th>\n" +
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