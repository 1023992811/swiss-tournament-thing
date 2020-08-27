class Player {
	constructor(name) {
		this.name = name;
		this.firstCount = 0;
		this.score = 0;
		this.isFirst = 0;
		this.prevPlayers = [];
		this.bye = false;
	}
	
	/*
		function to call when this player enters a new round
		isFirst: 0 or 1, is this player going first this round 1 for first, 0 for second
		opponent: Player, the opponent of this player
	*/
	newRound(isFirst, opponent) {
		this.isFirst = Number(isFirst);
		if(this.isFirst === 2) {
			this.bye = true;
		} else {
			this.firstCount += this.isFirst;
			this.prevPlayers.push(opponent);
		}
	}
	
	reset() {
		this.firstCount = 0;
		this.score = 0;
		this.isFirst = 0;
		this.prevPlayers = [];
		this.bye = false;
	}
}