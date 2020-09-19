var done = false;
let roundCount = 0;

//display section
function updateDisplay() {
	let players = playerPool.players;
	document.getElementById("nextRoundButton").disabled = done;
	document.getElementById("roundDisplay").innerHTML = "Round " + roundCount;
	if (done)
		displayPlacementList(players);
	else 
		displayPairsList(players);
	
}

function displayPairsList(players) {
	let htmlString = pairsListHeader;
	for (let x = 0; x < players.length; x++) {
		let tableRow = getPairsListTableRow(x, players);
		htmlString = htmlString.concat(tableRow);
	}
	document.getElementById("playerList").innerHTML = htmlString;
}

function displayPlacementList(players) {
	let htmlString = placementListHeader;
	for (let x = 0; x < players.length; x++) {
		let tableRow = getPlacementListTableRow(x, players);
		htmlString = htmlString.concat(tableRow);
	}
	document.getElementById("playerList").innerHTML = htmlString;
}

const pairsListHeader = 
	"<tr>\n" +
		"<th>table number</th>" +
		"<th>player name</th>\n" +
		"<th>score</th>\n" +
		"<th>Total scores</th>\n" +
		"<th>first or second</th>\n" +
		"<th>first count</th>\n" +
		"<th><button type='button' class='btn btn-danger' onclick=removeAllPlayersConfirmation()>Remove All Players</button></th>\n" +
		"<th>had bye</th>\n" +
	"</tr>\n";

function getPairsListTableRow(rowNum, players) {
	let tableRow =
		"<tr>\n" +
		"<td>" +
		(Math.floor(rowNum / 2) + 1) +
		"</td>\n" +
		"<td>" +
		String(players[rowNum].name) +
		"</td>\n" +
		"<td>" +
		"<input type=number class=scoreInput value=0>" +
		"</td>\n" +
		"<td>" +
		String(players[rowNum].score) +
		"</td>\n" +
		"<td>" +
		(players[rowNum].isFirst()
			? "first"
			: players[rowNum].isSecond()
			? "second"
			: "bye") +
		"</td>\n" +
		"<td>" +
		String(players[rowNum].firstCount) +
		"</td>\n" +
		"<td>" +
		"<button type='button' class='btn btn-danger' onclick=removeConfirmation(" +
		rowNum +
		")>Remove</button></td>\n" +
		"<td>" +
		players[rowNum].hadBye +
		"</td>\n" +
		"</tr>\n";
	return tableRow;
}

const placementListHeader = 
	"<tr>\n" +
		"<th>placement</th>" +
		"<th>player name</th>\n" +
		"<th>Total scores</th>\n" +
		"<th><button type='button' class='btn btn-danger' onclick=removeAllPlayersConfirmation()>Remove All Players</button></th>\n" +
	"</tr>\n";

function getPlacementListTableRow(rowNum, players) {
	let tableRow = 
		"<tr>\n" +
		"<td>" + (rowNum+1) + "</td>" +
		"<td>" + String(players[rowNum].name) + "</td>\n" +
		"<td>" + String(players[rowNum].score) + "</td>\n" +
		"<td><button type='button' class='btn btn-danger' onclick=removeConfirmation(" + rowNum + ")>Remove</button></td>\n" +
		"</tr>\n";
	return tableRow;
}

function removeConfirmation(playerCell) {
  if (window.confirm("Do you really want to remove this player?")) {
	playerPool.removePlayer(playerCell);
	updateDisplay();
  }
}

function removeAllPlayersConfirmation() {
  if (
	window.confirm(
	  "You're about to remove all players.  Do you want to proceed?"
	)
  ) {
	playerPool.removeAllPlayers();
	updateDisplay();
  }
}

//backend section

function swissCreatePlayer(name) {
	playerPool.createPlayer(name);
	updateDisplay();
}

function swissInitBracket() {
	let players = playerPool.players;
	//swissSeedPlayers();
	
	done = false;
	roundCount = 1;
	playerPool.resetAllPlayers();
	for (let x = 0; x < players.length - 1; x += 2) {
		players[x].newRound(SwissPlayer.roundStatuses.FIRST, players[x+1]);
		players[x+1].newRound(SwissPlayer.roundStatuses.SECOND, players[x]);
	}
	if (players.length % 2 === 1)
		players[players.length-1].newRound(SwissPlayer.roundStatuses.BYE);
	
	updateDisplay();
}

function swissNextRound() {
	debugHelper.updateLastState(playerPool.players);
	roundCount++;
	playerPool.tallyScores();
	playerPool.players = matchPlayersByScoreBuckets(playerPool.players);
	debugHelper.logUniquePairsCount(playerPool.players);
	updateDisplay();
}

function swissEndBracket() {
	done = true;
	let players = playerPool.players;
	playerPool.players = players.sort(comparePlayersByScore);
	updateDisplay();
}

function matchPlayersByScoreBuckets() {
	let players = playerPool.players;
	let matchedPlayers = duplicateList(players);
	
	matchedPlayers.sort(comparePlayersByScore);
	let bucketStart = 0;
	let bucketEnd = findScoreBucketEnd(matchedPlayers, bucketStart);
	while ((bucketEnd - bucketStart) > 1 || bucketEnd < players.length) {
		let bucket = matchedPlayers.slice(bucketStart, bucketEnd);
		bucket = matchPlayersInScoreBucket(bucket);
		for (let x = bucketStart; x < bucketEnd; x++) {
			matchedPlayers[x] = bucket[x-bucketStart];
		}
		bucketStart += bucket.length - bucket.length % 2;
		bucketEnd = findScoreBucketEnd(matchedPlayers, bucketEnd);
		if ((bucketEnd - bucketStart) === 1) {
			matchedPlayers[matchedPlayers.length-1].newRound(SwissPlayer.roundStatuses.BYE);
		}
	}
	return matchedPlayers;
}

function matchPlayersInScoreBucket(scoreBucket) {
	let matchedBucket = []
	updateAllPrevPlayerCount(scoreBucket);
	scoreBucket.sort(comparePlayersByPriorityAndFirstCount);
	
	for (let priority = scoreBucket.length - 2; priority > 0; priority--) {
		matchedBucket = matchedBucket.concat(matchPlayersWithPriority(priority, scoreBucket));
	}
	matchedBucket = matchedBucket.concat(matchRemainingPlayers(scoreBucket));
	return matchedBucket;
}

function matchPlayersWithPriority(priority, scoreBucket) {
	matchedPlayers = []
	
	for (let x = scoreBucket.length - 1; x >= 0; x--) {
		if (scoreBucket[x].prevPlayerCount === priority) {
			opponentIndex = findUniqueOpponentIndex(x, scoreBucket);
			if (opponentIndex === -1)
				continue;
			let firstPlayer = opponentIndex > x ? opponentIndex : x;
			let secondPlayer = opponentIndex < x ? opponentIndex : x;
			scoreBucket[firstPlayer].newRound(SwissPlayer.roundStatuses.FIRST, scoreBucket[secondPlayer]);
			scoreBucket[secondPlayer].newRound(SwissPlayer.roundStatuses.SECOND, scoreBucket[firstPlayer]);
			matchedPlayers = matchedPlayers.concat(scoreBucket.splice(firstPlayer, 1));
			matchedPlayers = matchedPlayers.concat(scoreBucket.splice(secondPlayer, 1));
			x-=2;
		}
	}
	
	return matchedPlayers;
}

function matchRemainingPlayers(scoreBucket) {
	let matchedPlayers = [];
	
	let byePlayer = removeRandomByePlayer(scoreBucket);
	
	let midPoint = Math.floor(scoreBucket.length / 2);
	for (let x = 0; x < midPoint; x++) {
		let firstPlayer = scoreBucket[scoreBucket.length - 1 - x];
		let secondPlayer = scoreBucket[x];
		firstPlayer.newRound(SwissPlayer.roundStatuses.FIRST, secondPlayer);
		secondPlayer.newRound(SwissPlayer.roundStatuses.SECOND, firstPlayer);
		matchedPlayers.push(firstPlayer);
		matchedPlayers.push(secondPlayer);
	}
	if (byePlayer !== null)
		matchedPlayers.push(byePlayer);
	return matchedPlayers;
}

function removeRandomByePlayer(scoreBucket) {
	let byePlayer = null;
	if (scoreBucket.length % 2 === 1) {
		randomIndex = Math.floor(Math.random() * scoreBucket.length);
		byePlayer = scoreBucket[randomIndex];
		scoreBucket.splice(randomIndex, 1);
	}
	return byePlayer;
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

function comparePlayersByScore(a, b) {
	return b.score - a.score;
}

function comparePlayersByFirstCount(a, b) {
	return b.firstCount - a.firstCount;
}

function comparePlayersByPriorityAndFirstCount(a, b) {
	let result = a.prevPlayerCount - b.prevPlayerCount;
	if (result === 0)
		result = b.firstCount - a.firstCount;
	return result;
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