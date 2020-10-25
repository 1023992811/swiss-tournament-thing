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
		this.players[index].dropped = true;
		this.droppedPlayers = this.droppedPlayers.concat(this.players.splice(index, 1));
	},

	removeAllPlayers: function() {
		this.players = [];
		this.droppedPlayers = [];
	},
	
	undropAllPlayers: function() {
		this.players = this.players.concat(this.droppedPlayers);
		this.droppedPlayers = [];
	},
	
	resetAllPlayers: function() {
		for (let player of this.players)
			player.reset();
	},
	
	populate: function(num) {
		for(let x = 0;x < num;x++) {
			this.createPlayer(String(x));
		}
	},
	
	tallyScores: function() {
		scoreInputs = document.getElementsByClassName("scoreInput");
		for (let x = 0; x < scoreInputs.length; x++) {
			this.players[x].tallyScore(scoreInputs[x].classList.contains("btn-success"));
		}
		this.updateTieBreakerScoresAdjustment();
	},
	
	updateTieBreakerScoresAdjustment: function() {
		let winsToGive = Math.floor(this.droppedPlayers.length / 2);
		for (let winsGiven = 0; winsGiven < winsToGive; winsGiven++) {
			shuffle(droppedPlayers);
			this.droppedPlayers[winsGiven].winnerScoreAdjustment++;
		}
		for (let x = winsToGive; x < this.droppedPlayers.length;x++) {
			this.droppedPlayers[x].loserScoreAdjustment++;
		}
	},
	
	updateTieBreakerScores: function() {
		for (let player of this.players) {
			player.updateTieBreakerScores();
		}
	}
}