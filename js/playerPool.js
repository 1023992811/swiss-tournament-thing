let playerPool = {
	players: [],
	droppedPlayers: [],

	createPlayer: function(name) {
		this.players.push(new SwissPlayer(name));
	},

	removePlayer: function(index) {
		this.players.splice(index, 1);
	},
	
	dropPlayer: function(index) {
		this.droppedPlayers = this.droppedPlayers.concat(this.players.splice(index, 1));
	},

	removeAllPlayers: function() {
		this.players = [];
		this.droppedPlayers = [];
	},
	
	undropAllPlayers: function() {
		this.players = this.player.concat(this.droppedPlayers);
		this.droppedPlayers = [];
	},
	
	resetAllPlayers: function() {
		for (let player of this.players)
			player.reset();
	},
	
	tallyScores: function() {
		scoreInputs = document.getElementsByClassName("scoreInput");
		for (let x = 0; x < scoreInputs.length; x++) {
			this.players[x].tallyScore(Number(scoreInputs[x].value));
		}
		for (let player of this.droppedPlayers) {
			player.bucholzAdjustment++;
		}
	}
}