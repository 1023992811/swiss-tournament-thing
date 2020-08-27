function swissInitBracket(players) {
	//insert seeding stuff here
	
	for (let player of players)
		player.reset();
	for (let x = 0; x < players.length - 1; x += 2) {
		players[x].newRound(1, players[x+1]);
		players[x+1].newRound(0, players[x]);
	}
	if (players.length % 2 === 1)
		players[players.length-1].newRound(2);
}

function swissNextRound(players) {
	players.sort(comparePlayers);
	for (let x = 0; x < players.length - 1; x += 2) {
		players[x].newRound(1, players[x+1]);
		players[x+1].newRound(0, players[x]);
	}
	if (players.length % 2 === 1)
		players[players.length-1].newRound(2);
}

function comparePlayers(a, b) {
	result = b.score - a.score;
	if (result === 0) {
		result = a.firstCount - b.firstCount;
	}
	console.log(result);
	return result;
}

