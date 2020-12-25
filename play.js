//komment poluchaetsya da 


// холст для рисования - игровое поле
let board = document.getElementById('cnv').getContext('2d');
let context = board

const NUM_COLS=20, NUM_ROWS=20;
const GHOST_MOVEMENT_TIME=350;
const NUM_TREES = 10;
const NUM_ZOMBIE = 4;


// фоновая клетка 32×32 - трава
let bg = document.getElementById('grass');

// персонаж, спрайт 32×32 – привидение из пакмана
let sprites = document.getElementById('sprites');

let hero = document.getElementById('hero');
let zombie = document.getElementById('zombie');

let tree = document.getElementById('tree');

// координаты персонажа, столбец и строка, считая с нуля
let myCol = Math.round(NUM_COLS/2), myRow = Math.round(NUM_ROWS/2);

// абзац с сообщением 
let msg = document.getElementById('msg');

// после загрузки картинок рисуем начальное состояние поля
let ghostRow, ghostCol,treeCol = new Array(4),treeRow = new Array(4);

let frmX=0, frmY=0;

let grid = new Array(NUM_COLS);

let canvaswidth = 352;
let canvasheight = 352;

function init(){

	ghostCol = [0,0,NUM_COLS-1,NUM_COLS-1]
	ghostRow = [0,NUM_ROWS-1,0,NUM_ROWS-1]
	// Сетка 
	for (var i = 0; i<NUM_COLS; i++){
		grid[i] = new Array(NUM_ROWS);
	}

	for (var i = 0; i<NUM_COLS; i++){
		for (var j = 0; j<NUM_ROWS; j++){
			grid[i][j]
		}
	}

	

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
		for (let i=0;i<NUM_ZOMBIE;i++){
			let dCol = myCol-ghostCol[i];
			let dRow = myRow-ghostRow[i];

			oldghostCol[i] = ghostCol[i];
			oldghostRow[i] = ghostRow[i];

			if (Math.abs(dCol)>Math.abs(dRow)){
				if (dCol!=0) ghostCol[i] +=dCol/Math.abs(dCol);
			} else {
				if (dRow!=0) ghostRow[i] +=dRow/Math.abs(dRow);
			}

			if (ghostCol[i]==myCol && ghostRow[i]==myRow){
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
