const playerRoundStatuses = {
		FIRST: 1,
		SECOND: 0,
		BYE: 2
};

class SwissPlayer {
	constructor(name) {
		this.name = name;
		this.reset();
	}
	
	reset() {
		this.firstCount = 0;
		this.score = 0;
		this.roundStatus = playerRoundStatuses.BYE;
		this.prevPlayers = [];
		this.hadBye = false;
	}
	
	isFirst() {
		return this.roundStatus === playerRoundStatuses.FIRST;
	}
	
	isSecond() {
		return this.roundStatus === playerRoundStatuses.SECOND;
	}
	
	isBye() {
		return this.roundStatus === playerRoundStatuses.BYE;
	}
	
	isValidOpponent(opponent) {
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
		this.roundStatus = roundStatus;
		if (!this.isBye()) {
			this.firstCount += roundStatus;
			this.prevPlayers.push(opponent);
		} else {
			this.hadBye = true;
			this.firstCount++;
		}
	}
}