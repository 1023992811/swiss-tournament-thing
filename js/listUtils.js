function comparePlayersByScore(a, b) {
	return b.score - a.score;
}

function comparePlayersByFirstCount(a, b) {
	return b.firstCount - a.firstCount;
}

function comparePlayersByPrevPlayerCount(a,b) {
	return b.prevPlayerCount - a.prevPlayerCount;
}

function comparePlayersByLoserScore(a, b) {
	return b.loserScore - a.loserScore;
}

function comparePlayersByWinnerScore(a, b) {
	return b.winnerScore - a.winnerScore;
}

function comparePlayersByTier2LoserScore(a, b) {
	return b.tier2loserScore - a.tier2loserScore;
}

function comparePlayersByTier2WinnerScore(a, b) {
	return b.tier2winnerScore - a.tier2winnerScore;
}

function comparePlayersByHeadToHead(a, b) {
	let result = Number(a.isPlayerLostTo(b));
	result -= Number(b.isPlayerLostTo(a));
	return result;
}

function comparePlayersByPriorityAndFirstCount(a, b) {
	let result = comparePlayersByPrevPlayerCount(a, b);
	if (result === 0)
		result = comparePlayersByFirstCount(b, a);
	return result;
}

function swapListItems(list, index1, index2) {
	let temp = list[index1];
	list[index1] = list[index2];
	list[index2] = temp;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
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

function writeToList(items, targetList, startIndex) {
	for (let index = 0;index < items.length;index++) {
		if (startIndex + index < targetList.length) {
			targetList[startIndex+index] = items[index];
		} else {
			targetList.push(items[index]);
		}
	}
}