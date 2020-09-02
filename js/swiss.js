var done = false;

function swissInitBracket(players) {
	//swissSeedPlayers();
	
	done = false;
	resetAllPlayers(players);
	for (let x = 0; x < players.length - 1; x += 2) {
		players[x].newRound(playerRoundStatuses.FIRST, players[x+1]);
		players[x+1].newRound(playerRoundStatuses.SECOND, players[x]);
	}
	if (players.length % 2 === 1)
		players[players.length-1].newRound(playerRoundStatuses.BYE);
}

function swissNextRound(players) {
	return matchPlayersByScoreBuckets(players);
}

function matchPlayersByScoreBuckets(players) {
	try {
		let matchedPlayers = duplicateList(players);
		
		matchedPlayers.sort(comparePlayersByScoreAndFirstCount);
		let bucketStart = 0;
		let bucketEnd = findBucketEnd(matchedPlayers, bucketStart);
		while ((bucketEnd - bucketStart) > 1 || bucketEnd < players.length) {
			let bucket = matchedPlayers.slice(bucketStart, bucketEnd);
			bucket = matchPlayersInScoreBucket(bucket);
			for (let x = bucketStart; x < bucketEnd; x++) {
				matchedPlayers[x] = bucket[x-bucketStart];
			}
			bucketStart += bucket.length - bucket.length % 2;
			bucketEnd = findBucketEnd(matchedPlayers, bucketEnd);
			if ((bucketEnd - bucketStart) === 1) {
				matchedPlayers[matchedPlayers.length-1].newRound(playerRoundStatuses.BYE);
			}
		}
		return matchedPlayers;
	} catch(error) {
		alert("no more rounds possible");
		done = true;
		
		return duplicateList(players).sort(comparePlayersByScoreAndFirstCount);
	}
}

function matchPlayersInScoreBucket(scoreBucket) {
	let matchedBucket = []
	
	scoreBucket.sort(comparePlayersByFirstCount);
	let midPoint = Math.floor((scoreBucket.length) / 2)
	for (let x = 0; x < midPoint; x ++) {
		let player1 = scoreBucket[x];
		let player2Index = findValidOpponentIndex(scoreBucket, x);
		let player2 = scoreBucket[player2Index];
		scoreBucket.splice(player2Index, 1);
		scoreBucket.splice(scoreBucket.length - x, 0, player2);
		matchedBucket.push(player2);
		matchedBucket.push(player1);
		player2.newRound(playerRoundStatuses.FIRST, player1);
		player1.newRound(playerRoundStatuses.SECOND, player2);
	}
	if (scoreBucket.length % 2 === 1)
		matchedBucket.push(scoreBucket[midPoint]);
	return matchedBucket;
}

function findBucketEnd(players, bucketStart) {
	try {
		let currentScoreBucket = players[bucketStart].score;
		for (let x = bucketStart; x < players.length; x++) {
			if (currentScoreBucket !== players[x].score) {
				return x;
			}
		}
	} catch {}
	return players.length;
}

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
}

function findValidOpponentIndex(players, currentPlayerIndex) {
	let opponentIndex = players.length - 1 - currentPlayerIndex;
	do {
		if (players[currentPlayerIndex].isValidOpponent(players[opponentIndex])) {
			return opponentIndex;
		}
		opponentIndex--;
	} while (opponentIndex > currentPlayerIndex);
	throw "no valid opponent"
}

function resetAllPlayers(players) {
	for (let player of players) {
		player.reset();
	}
}

function comparePlayersByScoreAndFirstCount(a, b) {
	result = b.score - a.score;
	if (result === 0) {
		result = a.firstCount - b.firstCount;
	}
	return result;
}

function comparePlayersByFirstCount(a, b) {
	return b.firstCount - a.firstCount;
}

function swapListItems(list, index1, index2) {
	let temp = list[index1];
	list[index1] = list[index2];
	list[index2] = temp;
}

function moveItemToIndex(list, itemIndex, targetIndex) {
	temp = list[itemIndex];
	list.splice(itemIndex, 1);
	list.splice(targetIndex, 0, temp);
}

function duplicateList(list) {
	let result = []
	for (let item of list)
		result.push(item);
	return result;
}

function copyArrayObjects(array) {
	let result = [];
	for (let item of array)
		result.push(item.clone());
	return result;
}