let playerPool = {
	players: [],

	createPlayer: function(name) {
		this.players.push(new SwissPlayer(name));
	},

	removePlayer: function(index) {
		this.players.splice(index, 1);
	},

	removeAllPlayers: function() {
		this.players = [];
	},
	
	resetAllPlayers: function() {
		for (let player of this.players)
			player.reset();
	},
	
	tallyScores: function() {
		this.lastState = copyArrayObjects(this.players);

		//tally all scores
		scoreInputs = document.getElementsByClassName("scoreInput");
		for (let x = 0; x < scoreInputs.length; x++) {
			this.players[x].score += Number(scoreInputs[x].value);
		}
	}
}