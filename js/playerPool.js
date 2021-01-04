let playerPool = {
	players: [],
	droppedPlayers: [],

	addPlayer: function(player) {
		this.players.push(player);
	},

	removePlayer: function(index) {
		this.players.splice(index, 1);
	},
	
	removeAllPlayers: function() {
		this.players = [];
		this.droppedPlayers = [];
	},
	
	dropPlayer: function(index) {
		let playerToDrop = this.players.splice(index, 1)[0];
		playerToDrop.dropped = true;
		this.droppedPlayers.push(playerToDrop);
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
	
	shuffle: function() {
		shuffle(this.players);
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
		winsToGive += Number((this.droppedPlayers.length % 2 === 1) && (this.players % 2 === 0));
		for (let x = 0; x < winsToGive; x++) {
			shuffle(this.droppedPlayers);
			this.droppedPlayers[x].TieBreakerScoreAdjustment++;
		}
	},
	
	updateTieBreakerScores: function() {
		for (let player of this.players) {
			player.updateTieBreakerScores();
		}
		for (let player of this.droppedPlayers) {
			player.updateTieBreakerScores();
		}
	}
}