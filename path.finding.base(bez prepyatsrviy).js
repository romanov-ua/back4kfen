function removeFromArray(arr,elt) {
	for (let i=arr.length-1; i>=0;i--){
		if (arr[i] == elt) {
			arr.splice(i,1);
		}
	}
}

function heuristic(pos0, pos1) {
    
    var d1 = Math.abs (pos1.i - pos0.i);
    var d2 = Math.abs (pos1.j - pos0.j);
    return d1 + d2;
  }

let board = document.getElementById('cnv').getContext('2d');
let context = board;
let hero = document.getElementById('hero');
let red = document.getElementById('red');
let green = document.getElementById('green');
let blue = document.getElementById('blue');


let NUM_COLS=11;
let NUM_ROWS=11;
let grid = new Array(NUM_COLS);

let openSet =[];
let closedSet=[];
let start;
let end;
let w, h;

let path =[];
function Spot(i,j){
	this.i=i;
	this.j=j;

	this.f=0;
	this.g=0;
	this.h=0;
	this.previos = undefined;
	this.neighbors=[];
	this.addNeighbors = function(grid){
		let i = this.i;
		let j = this.j;
		if (i<NUM_COLS - 1){
			this.neighbors.push(grid[i+1][j])
		}
		if (i>0){
			this.neighbors.push(grid[i-1][j])
		}
		if (j<NUM_ROWS - 1){
			this.neighbors.push(grid[i][j+1])
		}
		if (j>0){
			this.neighbors.push(grid[i][j-1])
		}
		
		
		
	}

}



function setup(){


	for (let i =0;i<NUM_COLS;i++){
		grid[i]=new Array(NUM_ROWS);
	}
	

	for (let i =0;i<NUM_COLS;i++){
		for (let j =0;j<NUM_ROWS;j++){
			grid[i][j]= new Spot(i,j);
		}
	}

	for (let i =0;i<NUM_COLS;i++){
		for (let j =0;j<NUM_ROWS;j++){
			grid[i][j].addNeighbors(grid);
		}
	}

	start = grid[0][0];
	end = grid[NUM_COLS-1][NUM_ROWS-1];
	console.log("Стартовая позиция = ",start);
	openSet.push(start);
	console.log("В начале openSet.length =",openSet.length,"И состоит из ",openSet);
	draw();
	


}

function draw(){
		console.log("Функция [DRAW] началась")
	while (openSet.length > 0) {
		if (openSet.length == 0) break;
		if (openSet.length >0){

		console.log("В НАЧАЛЕ цикла openSet.length =",openSet.length);
		console.log("В начале цикла closedSet.length =",closedSet.length);
		//работает дальше 
		let winner = 0; //winner = lowest index
		for (let i = 0; i < openSet.length; i++) {
			if(openSet[i].f<openSet[winner].f){
				winner=i;
			}
		}

		let current = openSet[winner];
		console.log("current=", current);

		if (current === end) {
			console.log("ЗАШЛО В КОНЕЦ");
			//Находит траекторию
			path =[];

			let temp = current;
			path.push(temp);
			console.log("Запушили в path, и path =",path);
			while (temp.previos){
				path.push(temp.previos)
				temp = temp.previos;
			}
			console.log("КОНЕЦ!");
		}
		console.log("Мимо цикла конца");
		removeFromArray(openSet,current)//openSet.remove(current)
		console.log("После удаления current из openSet openSet=",openSet);
		closedSet.push(current);
		console.log("После пуша closedSet.push(current)=",closedSet);

		let neighbors = current.neighbors;
		console.log("neighbors=",neighbors);

		for (let i = 0; i < neighbors.length;i++){
			let neighbor = neighbors[i];
			console.log("neighbors",[i],"=",neighbors[i]);
			if (!closedSet.includes(neighbor)){
				console.log("Прошло if (!closedSet.includes(neighbor))")	
				let tempG=current.g+1;
				console.log('tempG=',tempG);

				if(openSet.includes(neighbor)){

					if(tempG < neighbor.g) {

						neighbor.g = tempG;
					}
				} else {
					neighbor.g = tempG;
					console.log('Дошло до openSet.push(neighbor);');
					openSet.push(neighbor);
					console.log("После openSet.push(neighbor) open.set=",openSet);
				}
				console.log("Посчитали neighbor.g=",neighbor.g);
				neighbor.h = heuristic(neighbor,end);
				console.log("Посчитали neighbor.h=",neighbor.h);
				
				neighbor.f = neighbor.g + neighbor.h;
				console.log("Посчитали neighbor.f=",neighbor.f);
				neighbor.previos = current;
			}

			
		}


	
	for (let i=0; i<closedSet.length;i++){
		context.drawImage(red,0*32,0*32,32,32,closedSet[i]["i"]*32,closedSet[i]["j"]*32,32,32);
	}

	for (let i=0; i<openSet.length;i++){
		context.drawImage(green,0*32,0*32,32,32,openSet[i]["i"]*32,openSet[i]["j"]*32,32,32);
	}
	
	for (let i=0; i < path.length; i++){
		context.drawImage(blue,0*32,0*32,32,32,path[i]["i"]*32,path[i]["j"]*32,32,32);
	}
	console.log("В КОНЦЕ цикла openSet.length =",openSet.length);

	} else {
		//нету решения
		console.log("что то не так ");
	}


	/*for (let col = 0; col < NUM_COLS; col++){	
		for (let row = 0; row < NUM_ROWS; row++){
			context.drawImage(hero,0*32,0*32,32,32, start["i"]*32, start["j"]*32,32,32);
		}
	}
*/

	}
}



setup();

console.log("Путь состоит из",path);
console.log("В конце openSet.length =",openSet.length);
console.log("В конце closedSet.length =",closedSet.length);

