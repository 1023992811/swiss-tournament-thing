let debugHelper = {
	lastState: [],
	bucketMarkers: [],

	logUniquePairsCount: function (players) {
		let pairsCount = Math.floor(players.length / 2);
		let uniquePairsCount = 0;
		for (let x = 0; x < players.length - 1; x += 2) {
			uniquePairsCount += Number(players[x].isUniqueOpponent(players[x + 1]));
		}
		if (uniquePairsCount === pairsCount) {
			console.info("Round " + String(swissBracket.roundCount) + ": All pairs are unique");
		} else {
			console.warn("Round " + String(swissBracket.roundCount) + ": (" + String(uniquePairsCount) + "/" + String(pairsCount) + ") pairs are unique");
		}
	}
}