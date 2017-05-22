function randomInt(min, max) {
  return Math.round(min + Math.random() * (max - min))
}


//класс Tetris отвечает за общую логику игры
function Tetris(colCount, rowCount) {
	this.activePiece = null;
	this.value = -1;
	this.master = null;
	this.display = null;
	this.colCount = colCount;
	this.rowCount = rowCount;
	this.cells = [];
	this.init = function() {
		//заполняем поле клетками
		for( var i = 0; i < colCount; i++) {
			this.cells[i] = []
			for ( var j = 0; j < rowCount; j++) 
				this.cells[i][j] = new Cell(this, i, j,  Display.backgroundColor);
		}	
	}
	this.setDisplay = function(display) {
		this.display = display;
		this.display.setCountCells(this.colCount, this.rowCount);
		this.display.clear();
	}
	this.newPiece = function() {
		this.activePiece = new Pieces[randomInt(0, Pieces.length - 1)](
			this,   (this.colCount / 2 | 0)-2,  1  )
		this.activePiece.show()
		this.activePiece.fall()
	}
	this.isCorrectCoord = function(x, y) {
		if (x>=0 && y>=0 && x<this.colCount && y<this.rowCount)
			return true
		else 
			return false;
	}
	this.checkLines = function() {
		for( var y = 0; y < rowCount; y++) {
			var isLine  = true;
			for ( var x = 0; x < colCount; x++) {
				if (this.cells[x][y].isEmpty()) {
					isLine = false;
				}
			}
			if (isLine) {
				this.shiftLine(y);
				this.increaseScore(2)
			}
		}	
		this.newPiece();
	}
	this.deleteLine = function(lineIndex) {
		for ( var x = 0; x < colCount; x++) {
			this.display.clearCell(x, lineIndex)
			this.cells[x][lineIndex].color = Display.backgroundColor;
			this.cells[x][lineIndex].master = this;
		}
	}
	this.shiftLine = function(lineIndex) {
		for (var y = lineIndex; y > 0; y--) {
			this.deleteLine(y);
			for ( var x = 0; x < colCount; x++) {
				this.cells[x][y].color = this.cells[x][y - 1].color
				this.cells[x][y].master = this.cells[x][y - 1].master
				this.display.setCell(x, y, this.cells[x][y].color);
			}
		}
		this.deleteLine(0);
	}
	this.increaseScore = function(inc) {
		var score = +document.getElementById("score").innerHTML;
		score += inc;
		document.getElementById("score").innerHTML = score;
	}


}


field = new Tetris(17, 25);
field.setDisplay(new Display(document.getElementById("tetrisDisplay")));
field.init();
field.newPiece();


//отвечает за управление
window.onkeypress = keyControl
function keyControl(e) {
	console.log(e.keyCode)
	switch (e.keyCode) {
		case 54: field.activePiece.move('right'); break;//to move right, press "6"
		case 53: field.activePiece.turn(); break;//to turn, press "5"
		case 52: field.activePiece.move('left'); break;//to move left, press "4"
	}
}