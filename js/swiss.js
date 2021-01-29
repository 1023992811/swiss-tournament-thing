let swissBracket = {
	started: false,
	round_count: 0,
	current_standings: [],

	reset: function () {
		//seed players maybe?

		this.started = true;
		this.round_count = 1;
		this.current_standings = [];
		playerPool.undropAllPlayers();
		playerPool.resetAllPlayers();

		playerPool.shuffle();
		let players = playerPool.players;
		for (let x = 0; x < players.length - 1; x += 2) {
			players[x].newRound(SwissPlayer.roundStatuses.FIRST, players[x + 1]);
			players[x + 1].newRound(SwissPlayer.roundStatuses.SECOND, players[x]);
		}

		if (players.length % 2 === 1) {
			players[players.length - 1].newRound(SwissPlayer.roundStatuses.BYE);
		}
	},

	pairPlayers: function () {
		playerPool.players = this.matchPlayersByScoreBuckets(playerPool);
	},

	nextRound: function () {
		this.round_count++;
		this.pairPlayers();
	},

	update_standings: function () {
		playerPool.updateTieBreakerScores();
		let players_in_play = duplicateList(playerPool.players);
		this.standings = players_in_play.sort(this.comparePlayersByTiebreak);
		this.standings = this.standings.concat(playerPool.droppedPlayers.sort(this.comparePlayersByTiebreak));
	},

	matchPlayersByScoreBuckets: function (playerPool) {
		let players = playerPool.players;
		let matchedPlayers = duplicateList(players);

		matchedPlayers.sort(comparePlayersByScore);
		let bucketStart = 0;
		let bucketEnd = this.findScoreBucketEnd(matchedPlayers, bucketStart);
		while ((bucketEnd - bucketStart) > 1 || bucketEnd < players.length) {
			let bucket = matchedPlayers.slice(bucketStart, bucketEnd);
			bucket = this.matchPlayersInScoreBucket(bucket);
			writeToList(bucket, matchedPlayers, bucketStart);
			bucketStart += bucket.length - bucket.length % 2;
			bucketEnd = this.findScoreBucketEnd(matchedPlayers, bucketEnd);
			let nextBucketEnd = this.findScoreBucketEnd(matchedPlayers, bucketEnd);
			if (nextBucketEnd - bucketEnd === 1) {
				bucketEnd = nextBucketEnd;
			}
		}
		if (matchedPlayers.length % 2 === 1) {
			matchedPlayers[matchedPlayers.length - 1].newRound(SwissPlayer.roundStatuses.BYE);
		}
		return matchedPlayers;
	},

	matchPlayersInScoreBucket: function (scoreBucket) {
		let matchedBucket = [];
		this.updateAllPrevPlayerCount(scoreBucket);
		scoreBucket.sort(comparePlayersByPriorityAndFirstCount);

		for (let priority = scoreBucket.length - 2; priority > 0; priority--) {
			matchedBucket = matchedBucket.concat(this.matchPlayersWithPriority(priority, scoreBucket));
		}
		matchedBucket = matchedBucket.concat(this.matchRemainingPlayers(scoreBucket));
		return matchedBucket;
	},

	matchPlayersWithPriority: function (priority, scoreBucket) {
		matchedPlayers = [];

		for (let x = scoreBucket.length - 1; x >= 0; x--) {
			if (scoreBucket[x].prevPlayerCount === priority) {
				opponentIndex = this.findUniqueOpponentIndex(x, scoreBucket);
				if (opponentIndex === -1)
					continue;

				let firstPlayer = scoreBucket[x];
				let secondPlayer = scoreBucket[opponentIndex];
				if (firstPlayer.firstCount > secondPlayer.firstCount) {
					let temp = firstPlayer;
					firstPlayer = secondPlayer;
					secondPlayer = temp;
				}
				firstPlayer.newRound(SwissPlayer.roundStatuses.FIRST, secondPlayer);
				secondPlayer.newRound(SwissPlayer.roundStatuses.SECOND, firstPlayer);
				matchedPlayers.push(firstPlayer);
				matchedPlayers.push(secondPlayer);

				let higherIndex = opponentIndex > x ? opponentIndex : x;
				let lowerIndex = opponentIndex < x ? opponentIndex : x;
				scoreBucket.splice(higherIndex, 1);
				scoreBucket.splice(lowerIndex, 1);
				x -= 2;
			}
		}

		return matchedPlayers;
	},

	matchRemainingPlayers: function (scoreBucket) {
		let matchedPlayers = [];
		scoreBucket.sort(comparePlayersByFirstCount);

		let midPoint = Math.floor(scoreBucket.length / 2);
		for (let x = 0; x < midPoint; x++) {
			let firstPlayer = scoreBucket[scoreBucket.length - 1 - x];
			let secondPlayer = scoreBucket[x];
			firstPlayer.newRound(SwissPlayer.roundStatuses.FIRST, secondPlayer);
			secondPlayer.newRound(SwissPlayer.roundStatuses.SECOND, firstPlayer);
			matchedPlayers.push(firstPlayer);
			matchedPlayers.push(secondPlayer);
		}
		if (scoreBucket.length % 2 === 1)
			matchedPlayers.push(scoreBucket[midPoint]);
		return matchedPlayers;
	},

	findScoreBucketEnd: function (players, bucketStart) {
		if (players[bucketStart] !== undefined) {
			let currentScoreBucket = players[bucketStart].score;
			for (let x = bucketStart; x < players.length; x++) {
				if (currentScoreBucket !== players[x].score) {
					return x;
				}
			}
		}
		return players.length;
	},

	updateAllPrevPlayerCount: function (players) {
		for (let player of players)
			player.updatePrevPlayerCount(players);
	},

	findUniqueOpponentIndex: function (currentPlayerIndex, players) {
		for (x = 0; x < players.length; x++) {
			if (x === currentPlayerIndex)
				continue;
			else {
				if (players[currentPlayerIndex].isUniqueOpponent(players[x]))
					return x;
			}
		}
		return -1;
	},

	comparePlayersByTiebreak: function (a, b) {
		let result = comparePlayersByScore(a, b);
		if (result === 0) {
			result = comparePlayersByLoserScore(a, b);
		}
		if (result === 0) {
			result = comparePlayersByWinnerScore(a, b);
		}
		if (result === 0) {
			result = comparePlayersByTier2LoserScore(a, b);
		}
		if (result === 0) {
			result = comparePlayersByTier2WinnerScore(a, b);
		}
		if (result === 0) {
			result = comparePlayersByHeadToHead(a, b);
		}
		return result;
	},
}