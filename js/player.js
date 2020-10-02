class SwissPlayer {
	static roundStatuses = {
		FIRST: 1,
		SECOND: 0,
		BYE: 2
	}
	
	constructor(name) {
		this.name = name;
		this.reset();
	}
	
	reset() {
		this.firstCount = 0;
		this.score = 0;
		this.prevPlayerCount = 0;
		this.loserScoreAdjustment = 0;
		this.roundStatus = SwissPlayer.roundStatuses.SECOND;
		this.playersWonTo = [];
		this.playersLostTo = [];
		this.hadBye = false;
		this.dropped = false;
		this.currentOpponent = null;
	}
	
	isFirst() {
		return this.roundStatus === SwissPlayer.roundStatuses.FIRST;
	}
	
	isSecond() {
		return this.roundStatus === SwissPlayer.roundStatuses.SECOND;
	}
	
	isBye() {
		return this.roundStatus === SwissPlayer.roundStatuses.BYE;
	}
	
	isUniqueOpponent(opponent) {
		return !(this.isPlayerLostTo(opponent) || this.isPlayerWonTo(opponent))
	}
	
	isPlayerLostTo(opponent) {
		for (let player of this.playersLostTo) {
			if (player === opponent) {
				return true;
			}
		}
		return false;
	}
	
	isPlayerWonTo(opponent) {
		for (let player of this.playersWonTo) {
			if (player === opponent) {
				return true;
			}
		}
		return false;
	}
	
	getScoreString() {
		return (this.score) + "-" + (this.playersLostTo.length);
	}
	
	/*
		function to call when this player enters a new round
		roundStatus: the status of the player this round, reference the
		playerRoundStatuses object for possible values
		opponent: Player, the opponent of this player
	*/
	newRound(roundStatus, opponent) {
		this.roundStatus = roundStatus;
		if (!this.isBye()) {
			this.currentOpponent = opponent;
		} else {
			this.currentOpponent = null;
		}
	}
	
	tallyScore(won) {
		if(won) {
			this.score++;
			if (this.isBye()) this.hadBye = true;
			else if (this.isUniqueOpponent(this.currentOpponent)) this.playersWonTo.push(this.currentOpponent);
		} else {
			if (this.isUniqueOpponent(this.currentOpponent)) this.playersLostTo.push(this.currentOpponent);
		}
		if (this.isFirst()) this.firstCount++;
	}
	
	updatePrevPlayerCount(players) {
		this.prevPlayerCount = 0;
		for (let player of players) {
			if (!this.isUniqueOpponent(player)) {
				this.prevPlayerCount++;
			}
		}
	}
	
	updateTieBreakerScores() {
		this.loserScore = 0;
		for (let player of this.playersLostTo) {
			this.loserScore += player.score;
			this.loserScore += player.loserScoreAdjustment / 2;
		}
		this.winnerScore = 0;
		for (let player of this.playersWonTo) {
			if (player.score >= this.score) {
				this.winnerScore += player.score;
			}
		}
	}
	
	clone() {
		return { ...this};
	}
}