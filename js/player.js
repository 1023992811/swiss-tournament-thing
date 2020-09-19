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
		this.roundStatus = SwissPlayer.roundStatuses.BYE;
		this.prevPlayers = [];
		this.playersLostTo = [];
		this.hadBye = false;
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
		for (let player of this.prevPlayers) {
			if (player === opponent) {
				return false;
			}
		}
		return true;
	}
	
	/*
		function to call when this player enters a new round
		roundStatus: the status of the player this round, reference the
		playerRoundStatuses object for possible values
		opponent: Player, the opponent of this player
	*/
	newRound(roundStatus, opponent) {
		if(this.currentOpponent !== null) {
			if (this.isUniqueOpponent(this.currentOpponent)) {
				this.prevPlayers.push(this.currentOpponent);
			}
		}
		this.roundStatus = roundStatus;
		if (!this.isBye()) {
			this.firstCount += roundStatus;
			this.currentOpponent = opponent;
		} else {
			this.hadBye = true;
			this.currentOpponent = null;
			this.firstCount++;
		}
	}
	
	updatePrevPlayerCount(players) {
		this.prevPlayerCount = 0;
		for (let player of players) {
			if (!this.isUniqueOpponent(player)) {
				this.prevPlayerCount++;
			}
		}
	}
	
	updateBuchholzScore() {
		this.bucholzScore = 0;
	}
	
	clone() {
		return { ...this};
	}
}