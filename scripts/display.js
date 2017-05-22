function Display(canvas) {
	this.canvas = canvas;//поле на котором происходит рисование
	this.colCount = 0;//количество горизонтальных клеток игры
	this.rowCount = 0;//количество вертикальных клеток игры
	this.cellSize = 40;//размер одной клетки тетриса в пикселях
	this.cnt = this.canvas.getContext('2d');
	this.img = new  Image();
	this.setCountCells = function(colCount, rowCount) {
		this.colCount = colCount;
		this.rowCount = rowCount;
		this.canvas.width = colCount*this.cellSize;
		this.canvas.height = rowCount*this.cellSize;
	}
	this.setCellSize = function(size) {
		this.cellSize = size;
	}
	this.setCell = function(x, y, color) {
		if (color !== Display.backgroundColor) {			
			this.img.src = 'img/square_'+color+'.png'
			this.cnt.drawImage(this.img, x*this.cellSize, y*this.cellSize,
			 				this.cellSize, this.cellSize);
		}
	}
	this.clearCell = function(x, y) {
		this.cnt.fillStyle = this.backgroundColor;
		this.cnt.fillRect(x*this.cellSize, y*this.cellSize,
						this.cellSize, this.cellSize)
	}
	this.clear = function() {
		this.cnt.fillStyle = this.backgroundColor;
		this.cnt.fillRect(0, 0, this.cellSize*this.colCount-1,
		 this.cellSize*this.rowCount-1)
	}

	this.clear()
}

Display.backgroundColor = 'black';//цвет фона игрового поля