'use strict';

function generateSpiralMatrix (size, params) {
	params = params || {};
	size = Math.floor(size);

	let position = params.isReverse ? size * size : 1;
	let direction = params.initDirection ? params.initDirection : getSwitchedDirection();

	const matrix = [];
	const initCoordinates = getInitCoordinates(direction, size);
	
	let i = initCoordinates[0];
	let j = initCoordinates[1];

	for(i; i < size; i = getNewIndex(i, direction, true)) {
		matrix[i] = matrix[i] || [];

		if (!isEmpty(matrix[i][j])) {
			//matrix is filled up
			break;
		}

		for(j; isEmpty(matrix[i][j]) && j < size; j = getNewIndex(j, direction, false)) {
			matrix[i][j] = params.generator ? params.generator(position) : position;

			params.isReverse ? position-- : position++;
			direction = getNewDirection(i, j, direction, matrix, size);
		}
	}

	return matrix;
}

function getNewDirection (i, j, currentDirection, matrix, size) {
	let newIndex;
	let doSwitch = false;

	switch (currentDirection) {
		case 'right':
			newIndex = getNewIndex(j, currentDirection, false);
			doSwitch = (newIndex === size || !isEmpty(matrix[i][newIndex]));
			break;
		case 'down':
			newIndex = getNewIndex(i, currentDirection, true);
			doSwitch = (newIndex === size || (matrix[newIndex] && !isEmpty(matrix[newIndex][j])));
			break;
		case 'left':
			newIndex = getNewIndex(j, currentDirection, false);
			doSwitch = (newIndex === -1 || !isEmpty(matrix[i][newIndex]));
			break;
		case 'up':
			newIndex = getNewIndex(i, currentDirection, true);
			doSwitch = (newIndex === -1 || (matrix[newIndex] && !isEmpty(matrix[newIndex][j])));
			break;
	}

	return doSwitch ? getSwitchedDirection(currentDirection) : currentDirection;
}

function getNewIndex(index, direction, isRow) {
	switch (direction) {
		case 'right':
			if (!isRow) {
				index++;
			}
			break;
		case 'down':
			if (isRow) {
				index++;
			}
			break;
		case 'left':
			if (!isRow) {
				index--;
			}
			break;
		case 'up':
			if (isRow) {
				index--;
			}
			break;
	}

	return index;
}

function getSwitchedDirection (currentDirection) {
	const directionsList = [
		'right',
		'down',
		'left',
		'up'
	];

	const currentIndex = directionsList.indexOf(currentDirection);
	const isLastElem = currentIndex === directionsList.length - 1;
	const nextIndex = (currentIndex !== -1 && !isLastElem) ? currentIndex + 1 : 0;

	return directionsList[nextIndex];
}

function getInitCoordinates(direction, size) {
	const min = 0;
	const max = size - 1;

	switch (direction) {
		case 'right':
			return [min, min];
		case 'down':
			return [min, max];
		case 'left':
			return [max, max];
		case 'up':
			return [max, min];
		default:
			throw Error('Invalid direction name: ' + direction);
	}
}

function isEmpty (value) {
	return typeof value === 'undefined';
}

function printMatrix(matrix) {
	const size = matrix.length;

	for(let i = 0; i < size; i++) {
		let row = '';

		for(let j = 0; j < size; j++) {
			row += matrix[i][j] + '\t';
		}

		console.log(row);
		console.log('')
	}
}

function printSpiralMatrix (size, params) {
	const matrix = generateSpiralMatrix(size, params);
	printMatrix(matrix);
}

//---------------

printSpiralMatrix(7);

printSpiralMatrix(5, {
	generator: function (position) {
		return position % 2 ? '+' : '-';
	}
});

printSpiralMatrix(10, {
	generator: function (position) {
		return Math.pow(position, 2);
	},
	isReverse: true,
	initDirection: 'left'
});
