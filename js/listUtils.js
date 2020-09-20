function comparePlayersByScore(a, b) {
	return b.score - a.score;
}

function comparePlayersByFirstCount(a, b) {
	return b.firstCount - a.firstCount;
}

function comparePlayersByScoreAndBucholz(a, b) {
	let result = b.score - a.score;
	if (result === 0)
		result = b.bucholzScore - a.bucholzScore;
	return result;
}

function comparePlayersByPriorityAndFirstCount(a, b) {
	let result = b.prevPlayerCount - a.prevPlayerCount;
	if (result === 0)
		result = a.firstCount - b.firstCount;
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

function writeToList(items, targetList, startIndex) {
	for (let index = 0;index < items.length;index++) {
		if (startIndex + index < targetList.length) {
			targetList[startIndex+index] = items[index];
		} else {
			targetList.push(items[index]);
		}
	}
}