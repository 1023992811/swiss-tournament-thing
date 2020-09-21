let bracketEnded = false;
let roundCount = 0;

//button functions

function swissCreatePlayer(name) {
	playerPool.createPlayer(name);
	updateDisplay();
}

function swissInitBracket() {
	let players = playerPool.players;
	//swissSeedPlayers();
	
	bracketEnded = false;
	roundCount = 1;
	playerPool.resetAllPlayers();
	
	for (let x = 0; x < players.length - 1; x += 2) {
		players[x].newRound(SwissPlayer.roundStatuses.FIRST, players[x+1]);
		players[x+1].newRound(SwissPlayer.roundStatuses.SECOND, players[x]);
	}
	
	if (players.length % 2 === 1)
		players[players.length-1].newRound(SwissPlayer.roundStatuses.BYE);
	
	debugHelper.logUniquePairsCount(players);
	updateDisplay();
}

function swissNextRound() {
	debugHelper.lastState = playerPool.players;
	roundCount++;
	playerPool.tallyScores();
	playerPool.players = matchPlayersByScoreBuckets(playerPool.players);
	debugHelper.logUniquePairsCount(playerPool.players);
	updateDisplay();
}

function swissEndBracket() {
	bracketEnded = true;
	let players = playerPool.players;
	playerPool.undropAllPlayers();
	playerPool.updateBuchholzScores();
	playerPool.players = players.sort(comparePlayersByTiebreaking);
	updateDisplay();
}

//backend stuff

function matchPlayersByScoreBuckets() {
	let players = playerPool.players;
	let matchedPlayers = duplicateList(players);
	
	matchedPlayers.sort(comparePlayersByScore);
	let bucketStart = 0;
	let bucketEnd = findScoreBucketEnd(matchedPlayers, bucketStart);
	while ((bucketEnd - bucketStart) > 0 || bucketEnd < players.length) {
		let bucket = matchedPlayers.slice(bucketStart, bucketEnd);
		bucket = matchPlayersInScoreBucket(bucket);
		writeToList(bucket, matchedPlayers, bucketStart);
		bucketStart += bucket.length - bucket.length % 2;
		bucketEnd = findScoreBucketEnd(matchedPlayers, bucketEnd);
		if ((bucketEnd - bucketStart) === 1) {
			matchedPlayers[matchedPlayers.length-1].newRound(SwissPlayer.roundStatuses.BYE);
			bucketStart++;
		}
	}
	return matchedPlayers;
}

function matchPlayersInScoreBucket(scoreBucket) {
	let matchedBucket = [];
	updateAllPrevPlayerCount(scoreBucket);
	scoreBucket.sort(comparePlayersByPriorityAndFirstCount);
	
	for (let priority = scoreBucket.length - 2; priority > 0; priority--) {
		matchedBucket = matchedBucket.concat(matchPlayersWithPriority(priority, scoreBucket));
	}
	matchedBucket = matchedBucket.concat(matchRemainingPlayers(scoreBucket));
	return matchedBucket;
}

function matchPlayersWithPriority(priority, scoreBucket) {
	matchedPlayers = [];
	
	for (let x = scoreBucket.length - 1; x >= 0; x--) {
		if (scoreBucket[x].prevPlayerCount === priority) {
			opponentIndex = findUniqueOpponentIndex(x, scoreBucket);
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
			x-=2;
		}
	}
	
	return matchedPlayers;
}

function matchRemainingPlayers(scoreBucket) {
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
}

function updateAllPrevPlayerCount(players) {
	for (let player of players)
		player.updatePrevPlayerCount(players);
}

function findUniqueOpponentIndex(currentPlayerIndex, players) {
	for (x = 0; x < players.length; x++) {
		if (x === currentPlayerIndex)
			continue;
		else {
			if (players[currentPlayerIndex].isUniqueOpponent(players[x]))
				return x;
		}
	}
	return -1;
}

function findScoreBucketEnd(players, bucketStart) {
	if (players[bucketStart] != undefined) {
		let currentScoreBucket = players[bucketStart].score;
		for (let x = bucketStart; x < players.length; x++) {
			if (currentScoreBucket !== players[x].score) {
				return x;
			}
		}
	}
	return players.length;
}

/* garbage disposal
function findValidByePlayerIndex(players, startPoint) {
	let radius = 0;
	let rightFlag = false;
	let leftFlag = false;
	for (;!rightFlag || !leftFlag;radius++) {
		if (!rightFlag) {
			rightIndex = startPoint + radius;
			if (rightIndex >= players.length)
				rightFlag = true;
			else if (!players[rightIndex].hadBye)
				return rightIndex;
		}
		if (!leftFlag) {
			leftIndex = startPoint - radius;
			if (leftIndex < 0)
				leftFlag = true;
			else if (!players[startPoint-radius].hadBye)
				return startPoint - radius;
		}
	}
	throw "no valid bye player"
}*/

/*
function matchPlayersInScoreBucket(scoreBucket) {
	let matchedBucket = []
	
	scoreBucket.sort(comparePlayersByFirstCount);
	let midPoint = Math.floor((scoreBucket.length) / 2)
	for (let x = 0; x < midPoint; x ++) {
		let player1 = scoreBucket[x];
		let player2Index = findValidOpponentIndex(x, scoreBucket;
		let player2 = scoreBucket[player2Index];
		scoreBucket.splice(player2Index, 1);
		scoreBucket.splice(scoreBucket.length - x, 0, player2);
		matchedBucket.push(player2);
		matchedBucket.push(player1);
		player2.newRound(SwissPlayer.roundStatuses.FIRST, player1);
		player1.newRound(SwissPlayer.roundStatuses.SECOND, player2);
	}
	if (scoreBucket.length % 2 === 1)
		matchedBucket.push(scoreBucket[midPoint]);
	return matchedBucket;
}*/

/*
function createPriorityBuckets(players) {
	let buckets = [duplicateList(players),[]];
	
	for (let x = 0; x<buckets[0].length;x++) {
		prevOpponentIndex = findPrevOpponentIndex(buckets[0][x], buckets[0]);
		if (prevOpponentIndex !== -1) {
			buckets[1].concat(buckets[0].splice(prevOpponentIndex,1));
			buckets[1].concat(buckets[0].splice(x,1));
			x--;
		}
	}
	return buckets;
}*/

/*
function removeRandomByePlayer(scoreBucket) {
	let byePlayer = null;
	if (scoreBucket.length % 2 === 1) {
		randomIndex = Math.floor(Math.random() * scoreBucket.length);
		byePlayer = scoreBucket[randomIndex];
		scoreBucket.splice(randomIndex, 1);
	}
	return byePlayer;
}*/