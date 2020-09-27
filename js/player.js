function SwissPlayer(name) {
	this.name = name;
	this.reset();
}

SwissPlayer.prototype = {
	roundStatuses: {
		FIRST: 1,
		SECOND: 0,
		BYE: 2
	},

	reset: function() {
		this.firstCount = 0;
		this.score = 0;
		this.prevPlayerCount = 0;
		this.loserScore = 0;
		this.loserScoreAdjustment = 0;
		this.roundStatus = SwissPlayer.prototype.roundStatuses.SECOND;
		this.prevPlayers = [];
		this.playersLostTo = [];
		this.hadBye = false;
		this.dropped = false;
		this.currentOpponent = null;
	},

	isFirst: function() {
		return this.roundStatus === SwissPlayer.prototype.roundStatuses.FIRST;
	},

	isSecond: function() {
		return this.roundStatus === SwissPlayer.prototype.roundStatuses.SECOND;
	},

	isBye: function() {
		return this.roundStatus === SwissPlayer.prototype.roundStatuses.BYE;
	},

	isUniqueOpponent: function(opponent) {
		for (let player of this.prevPlayers) {
			if (player === opponent) {
				return false;
			}
		}
		return true;
	},

	isPlayerLostTo: function(opponent) {
		for (let player of this.playersLostTo) {
			if (player === opponent) {
				return true;
			}
		}
		return false;
	},

	getScoreString: function() {
		return (this.score) + "-" + (this.playersLostTo.length);
	},

	/*
		function to call when this player enters a new round
		roundStatus: the status of the player this round, reference the
		playerRoundStatuses object for possible values
		opponent: Player, the opponent of this player
	*/
	newRound: function(roundStatus, opponent) {
		this.roundStatus = roundStatus;
		if (!this.isBye()) {
			this.firstCount += roundStatus;
			this.currentOpponent = opponent;
		} else {
			this.currentOpponent = null;
			this.firstCount++;
		}
	},

	tallyScore: function(won) {
		if(won) {
			this.score++;
			if (this.isBye()) this.hadBye = true;
			else this.prevPlayers.push(this.currentOpponent);
		} else {
			this.playersLostTo.push(this.currentOpponent);
			this.prevPlayers.push(this.currentOpponent);
		}
	},

	updatePrevPlayerCount: function(players) {
		this.prevPlayerCount = 0;
		for (let player of players) {
			if (!this.isUniqueOpponent(player)) {
				this.prevPlayerCount++;
			}
		}
	},

	updateLoserScore: function() {
		this.loserScore = 0;
		for (let player of this.playersLostTo) {
			this.loserScore += player.score;
			this.loserScore += player.loserScoreAdjustment;
		}
	},

	clone: function() {
		return { ...this};
	},
}