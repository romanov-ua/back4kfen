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

function Spot(i,j){
	this.i=i;
	this.j=j;

	this.f=0;
	this.g=0;
	this.h=0;
	this.previos = undefined;
	this.neighbors=[];

	this.wall = false;
/*	if (Math.random() < 0.25){
		console.log("ЕСТЬ СТЕНА!!!!!!!!");
		this.wall = true;
	}*/
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

// холст для рисования - игровое поле
let board = document.getElementById('cnv').getContext('2d');
let context = board

const NUM_COLS=20, NUM_ROWS=20;
const GHOST_MOVEMENT_TIME=350;
const NUM_TREES = 10;
const NUM_ZOMBIE = 4;


let grid = new Array(NUM_COLS);


let start = [];
let end;
let w, h;

//let path =[];

// фоновая клетка 32×32 - трава
let bg = document.getElementById('grass');

// персонаж, спрайт 32×32 – привидение из пакмана
let sprites = document.getElementById('sprites');

let hero = document.getElementById('hero');
let zombie = document.getElementById('zombie');

let tree = document.getElementById('tree');

// координаты персонажа, столбец и строка, считая с нуля
//let myCol = Math.round(NUM_COLS/2), myRow = Math.round(NUM_ROWS/2);
let myCol = 10, myRow = 10;

// абзац с сообщением 
let msg = document.getElementById('msg');

// после загрузки картинок рисуем начальное состояние поля
let ghostRow, ghostCol,treeCol = new Array(4),treeRow = new Array(4);

let frmX=0, frmY=0;



let canvaswidth = 352;
let canvasheight = 352;

function init(){

	ghostCol = [14,0,NUM_COLS-1,NUM_COLS-1]
	ghostRow = [14,NUM_ROWS-1,0,NUM_ROWS-1]
	// Сетка 
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
	/*start = grid[0][0];
	end = grid[NUM_COLS-1][NUM_ROWS-1];
	start.wall =false;
	end.wall=false;
	openSet.push(start);
	*/

	

	for (let i=0; i <NUM_TREES; i++){
		do {
			treeCol[i] = Math.floor(Math.random()*NUM_COLS);
			treeRow[i] = Math.floor(Math.random()*NUM_ROWS);
		}while ((treeCol[i]==0 || treeCol[i]==NUM_COLS) && (treeRow[i]==0 || treeRow[i]==NUM_ROWS))
	}
	draw();
	animReq=window.requestAnimationFrame(update);
}

let tLastMove,tLastFrm;

let oldghostCol = [];
let oldghostRow = [];
let ghst_last_mvnt_drct =[];
let dead = false;
function update(t){
	
	if(!tLastMove) tLastMove = t;
	
	if(t - tLastMove>=GHOST_MOVEMENT_TIME){
		for (let k=0;k<1;k++){
			oldghostCol[k] = ghostCol[k];
			oldghostRow[k] = ghostRow[k];
			start[k] = grid[ghostCol[k]][ghostRow[k]]; //как задать точки старта для разных зомби ?
			end = grid[myCol][myRow];
			

			let next_move =[];
			let tempPath = findPath(start[k],end);
			next_move[k] = tempPath;
			console.log("next_move",k,"=",next_move[k]);
			console.log("next_move",k,"=",next_move[k][tempPath.length-2]);
			
			console.log(tempPath.length);


			


			if (ghostCol[k]==myCol && ghostRow[k]==myRow){
				dead = true;
			}

			for (let i=0;i<4;i++){
			if (oldghostCol[i] - ghostCol[i]>=0.9) {ghst_last_mvnt_drct[i]="left"; }
			if (oldghostCol[i] - ghostCol[i]<=-0.9) {ghst_last_mvnt_drct[i]="right"; }
			if (oldghostRow[i] - ghostRow[i]>=0.9) {ghst_last_mvnt_drct[i]="up"; }
			if (oldghostRow[i] - ghostRow[i]<=-0.9) {ghst_last_mvnt_drct[i]="down"; }
			}
		}

		tLastMove = t;
	}
	
	draw();
	msg.value=(t);
	if (!dead) animReq=window.requestAnimationFrame(update)

}
function findPath(start,goal){	
	console.log("!");
	let path=[];
	let openSet =[];
	let closedSet=[];
	openSet.push(start);
	while (openSet.length > 0) {
		if (openSet.length >0){
		//работает дальше 
		let winner = 0; //winner = lowest index
		for (let i = 0; i < openSet.length; i++) {
			if(openSet[i].f<openSet[winner].f){
				winner=i;
			}
		}

		let current = openSet[winner];
		

		if (current === goal) {
			//Находит траекторию
			

			let temp = current;
			path.push(temp);
			while (temp.previos){
				path.push(temp.previos)
				temp = temp.previos;
			}
		}
		removeFromArray(openSet,current)//openSet.remove(current)
		closedSet.push(current);
		let neighbors = current.neighbors;
		for (let i = 0; i < neighbors.length;i++){
			let neighbor = neighbors[i];
			if (!closedSet.includes(neighbor) && !neighbor.wall){
					
				let tempG=current.g+1;
				let newpath = false;

				if(openSet.includes(neighbor)){

					if(tempG < neighbor.g) {
						neighbor.g = tempG;
						newpath = true;
					}
				} else {
					neighbor.g = tempG;
					newpath = true;
					openSet.push(neighbor);
					
				}
				if (newpath){
					neighbor.h = heuristic(neighbor,goal);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previos = current;
				}
			}		
		}

	/*for (let i=0; i<closedSet.length;i++){
		context.drawImage(red,0*32,0*32,32,32,closedSet[i]["i"]*32,closedSet[i]["j"]*32,32,32);
	}

	for (let i=0; i<openSet.length;i++){
		context.drawImage(green,0*32,0*32,32,32,openSet[i]["i"]*32,openSet[i]["j"]*32,32,32);
	}
	
	for (let i=0; i < path.length; i++){
		context.drawImage(blue,0*32,0*32,32,32,path[i]["i"]*32,path[i]["j"]*32,32,32);
	}	
	*/

	} else {
		//нету решения
		console.log("ТУПИК");
		
	}
if (openSet.length == 0){
			console.log("ТУПИК!!!");
			break;
		}



	}
	return path;
}

function clamp(value, min, max){
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}

function draw(){
	


	//start of viewport
	context.setTransform(1,0,0,1,0,0);//reset the transform matrix as it is cumulative
    context.clearRect(0, 0, canvaswidth, canvasheight);//clear the viewport AFTER the matrix is reset

    //Clamp the camera position to the world bounds while centering the camera around the player                                             
    var camX = clamp(-myCol*32 + canvaswidth/2, -1000, 1000 - canvaswidth);
    var camY = clamp(-myRow*32 + canvasheight/2, -1000, 1000 - canvasheight);

    context.translate( camX, camY );
    //end of viewport
    //context.scale(2, 2);

	for (let col = 0; col < NUM_COLS; col++){	
		for (let row = 0; row < NUM_ROWS; row++){
			context.drawImage(bg, col*32, row*32);
		}
	}
	mvnt_drct(lst_mvnt_drct,myCol,myRow);
	
	for (let i=0;i<NUM_TREES; i++)context.drawImage(tree, treeCol[i]*32, treeRow[i]*32);
	for (let i=0;i<4; i++)
	mvnt_drct(ghst_last_mvnt_drct[i],ghostCol[i],ghostRow[i]);	
 /*context.drawImage(tree, 2*32, 2*32);
 context.drawImage(tree, 1*32, 2*32);
 context.drawImage(tree, 2*32, 1*32);

 context.drawImage(tree, 2*32, 0*32);
 context.drawImage(tree, 0*32, 2*32);		*/

}

function mvnt_drct(lst_mvnt_drct,charCol,charRow) {
switch(lst_mvnt_drct){
		case "":
			context.drawImage(hero,0*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
		case "right":
			context.drawImage(hero,0*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
		case "left":
			context.drawImage(hero,1*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
		case "up":
			context.drawImage(hero,3*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
		case "down":
			context.drawImage(hero,2*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
	}	
}

let lst_mvnt_drct ="";
function moveOnceKey(event){
	let oldRow=myRow;
	let oldCol=myCol;

	switch (event.code){
		case 'KeyS':
		case 'ArrowDown':
			++myRow;
			lst_mvnt_drct = "down";
			break;
		case 'KeyW':
		case 'ArrowUp':
			--myRow;
			lst_mvnt_drct = "up";
			break;
		case 'KeyD':
		case 'ArrowRight':
			++myCol;
			lst_mvnt_drct = "right";
			break;
		case 'KeyA':
		case 'ArrowLeft':
			--myCol;
			lst_mvnt_drct = "left";
			break;
	}
	if (myCol<0 || myCol>NUM_COLS-1) myCol=oldCol; 
	if (myRow<0 || myCol>NUM_ROWS-1) myRow=oldRow;
	for (let i=0; i<NUM_TREES;i++){
		if (myCol==treeCol[i] && myRow==treeRow[i]){
			myRow=oldRow
			myCol=oldCol
		}
	}
}








window.onload = init;
window.onkeyup = moveOnceKey;
