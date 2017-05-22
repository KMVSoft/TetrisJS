function Cell (master, x, y, color) {//master - фигура "хозяин" клетки
	this.color = color;
	this.master = master;
	//координаты
	this.X = x;
	this.Y = y;
	this.isEmpty = function() {
		return Display.backgroundColor  === this.color;
	}
}

function extend(self, obj) {
	//реализует наследование объектов
	for (prop in obj) 
		self[prop] = obj[prop];
}

function Piece(master, x, y) {
	//master - поле на котором находится фигура
	this.speed = 200; //скорость падения фигуры
	this.master = master;
	this.x = x;
	this.y = y;
	this.turn = function() {
		var minX = this.master.colCount, minY = this.master.rowCount, maxX = 0, maxY = 0;
		for (var i=0; i<this.cells.length; i++) {
			if (this.cells[i].X < minX)
				minX = this.cells[i].X
			else if (this.cells[i].X > maxX)
				maxX = this.cells[i].X;
			if (this.cells[i].Y < minY)
				minY = this.cells[i].Y
			else if (this.cells[i].Y > maxY)
				maxY = this.cells[i].Y;
		}
		for (var i=0; i<this.cells.length; i++) {
			var x1 = (((maxX-minX>maxY-minY) ? 1:2) - (this.cells[i].Y - minY)) + minX;
			var y1 = (this.cells[i].X - minX) + minY;
			if (!(this.master.isCorrectCoord(x1, y1) && 
				(this.master.cells[x1][y1].isEmpty() || 
					this.master.cells[x1][y1].master === this))) {
						return;
			}
		}
		this.clear()
		for (var i=0; i<this.cells.length; i++) {
			var x1 = (((maxX-minX>maxY-minY) ? 1:2) - (this.cells[i].Y - minY)) + minX;
			var y1 = (this.cells[i].X - minX) + minY;
			this.cells[i] = this.master.cells[x1][y1];
			this.cells[i].master = this;
		}
		this.show()

	}
	this.move = function(dir) {//dir is string "left" or "right"
		dir = dir.toLowerCase()
		if (dir!=='left' &&  dir!=='right') { 
			console.error('the function takes string "left" or "right"')
			return
		}
		var vector = ((dir==='right') ? 1 : -1);
		for (var i=0; i<this.cells.length; i++) 
			if ( !(  
				((dir==='left') ? (this.cells[i].X>0) : (this.cells[i].X<this.master.colCount-1)) && 
				(this.master.cells[this.cells[i].X+vector][this.cells[i].Y].isEmpty() ||
				this.master.cells[this.cells[i].X+vector][this.cells[i].Y].master === this)) 
				) {   return;  }
		
		this.clear()
		for (var i=0; i<this.cells.length; i++) {
			this.cells[i] = this.master.cells[this.cells[i].X+vector][this.cells[i].Y];
			this.cells[i].master = this;
		}
		this.show()		
	}
	this.fall = function() {
		for (var i=0; i<this.cells.length; i++) {
			var x = this.cells[i].X, y = this.cells[i].Y;
			if (((y+1) < this.master.rowCount)) {
				var nextCell = this.master.cells[x][y+1];
				var isNextCellEmpty = nextCell.isEmpty();
				var isOwnCell = (nextCell.master === this);
				if (!(isNextCellEmpty || isOwnCell)) {
					this.master.checkLines();
					return;
				}
			} else {
				this.master.checkLines();
				return;
			}

		}
		this.clear();
		for (var i=0; i<this.cells.length; i++) {
			this.cells[i] = this.master.cells[this.cells[i].X][this.cells[i].Y+1];
			this.cells[i].master = this;
		}
		this.show()
		self = this;
		setTimeout(function() {self.fall()}, self.speed);
	}
	this.show = function() {
		for (var i=0; i<this.cells.length; i++) {
			this.cells[i].color = this.color;
			this.master.display.setCell(this.cells[i].X, this.cells[i].Y, this.color);
		}
	}
	this.clear = function() {
		for (var i=0; i<this.cells.length; i++) {
			this.cells[i].color = Display.backgroundColor;
			this.master.display.clearCell(this.cells[i].X, this.cells[i].Y)
		}
	}

}


function PieceL(master, x, y) {
	extend(this, new Piece(master, x, y))
	//индефикатор фигуры
	this.value = 0;
	//цвет фигуры
	this.color = "green"
	//маска фигуры (шаблон)
	this.cells = [this.master.cells[x][y-1], this.master.cells[x][y],
				  this.master.cells[x+1][y], this.master.cells[x+2][y]];
	for (var i=0; i<this.cells.length; i++) {
		this.cells[i].master = this;
		this.cells[i].color = this.color;
	}
}

function PieceJ(master, x, y) {
	extend(this, new Piece(master, x, y))
	this.value = 1;
	this.color = "blue"
	this.cells = [this.master.cells[x][y], this.master.cells[x+1][y], 
				this.master.cells[x+2][y], this.master.cells[x][y+1]];
	for (var i=0; i<this.cells.length; i++) {
		this.cells[i].master = this;
		this.cells[i].color = this.color;
	}
}

function PieceO(master, x, y) {
	extend(this, new Piece(master, x, y))
	this.value = 2;
	this.color = "yellow"
	this.cells = [this.master.cells[x][y], this.master.cells[x+1][y],
				 this.master.cells[x+1][y+1], this.master.cells[x][y+1]];
	for (var i=0; i<this.cells.length; i++) {
		this.cells[i].master = this;
		this.cells[i].color = this.color;
	}
}

function PieceZ(master, x, y) {
	extend(this, new Piece(master, x, y))
	this.value = 3;
	this.color = "deepPink"
	this.cells = [this.master.cells[x+1][y], this.master.cells[x][y],
				 this.master.cells[x][y-1], this.master.cells[x-1][y-1]];
	for (var i=0; i<this.cells.length; i++) {
		this.cells[i].master = this;
		this.cells[i].color = this.color;
	}
}

function PieceS(master, x, y) {
	extend(this, new Piece(master, x, y))
	this.value = 4;
	this.color = "orange"
	this.cells = [this.master.cells[x][y], this.master.cells[x+1][y],
				 this.master.cells[x][y-1], this.master.cells[x+1][y+1]];
	for (var i=0; i<this.cells.length; i++) {
		this.cells[i].master = this;
		this.cells[i].color = this.color;
	};
}

function PieceI(master, x, y) {
	extend(this, new Piece(master, x, y))
	this.value = 5;
	this.color = 'red';
	this.cells = [this.master.cells[x-1][y], this.master.cells[x][y], 
				this.master.cells[x+1][y], this.master.cells[x+2][y]];
	for (var i=0; i<this.cells.length; i++) {
		this.cells[i].master = this;
		this.cells[i].color = this.color;
	}
}
function PieceT(master, x, y) {
	extend(this, new Piece(master, x, y))
	this.value = 6;
	this.color = 'olive';
	this.cells = [this.master.cells[x][y+1], this.master.cells[x][y], 
				this.master.cells[x+1][y], this.master.cells[x-1][y]];
	for (var i=0; i<this.cells.length; i++) {
		this.cells[i].master = this;
		this.cells[i].color = this.color;
	}
}

Pieces = [PieceL, PieceJ, PieceO, PieceZ, PieceI, PieceS, PieceT]