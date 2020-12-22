//komment poluchaetsya da 


// холст для рисования - игровое поле

let context= document.getElementById('cnv').getContext('2d');

const NUM_COLS=20, NUM_ROWS=20;
const GHOST_MOVEMENT_TIME=200;
const NUM_TREES = 10;


// фоновая клетка 32×32 - трава
let bg = document.getElementById('grass');

// персонаж, спрайт 32×32 – привидение из пакмана
let sprites = document.getElementById('sprites');

// координаты персонажа, столбец и строка, считая с нуля
let myCol = Math.round(NUM_COLS/2), myRow = Math.round(NUM_ROWS/2);

// абзац с сообщением 
let msg = document.getElementById('msg');

// после загрузки картинок рисуем начальное состояние поля
let ghostRow, ghostCol;
let treeCol = new Array(4);
let treeRow = new Array(4);
let frmX=0, frmY=0;


function init(){
	ghostCol = [0,0,NUM_COLS-1,NUM_COLS-1]
	ghostCol = [0,NUM_ROWS-1,0,NUM_ROWS-1]
	for (let i=0; i <NUM_TREES; i++){
		treeCol
		do {
			treeCol[i] = Math.floor(Math.random()*NUM_COLS);
			treeRow[i] = Math.floor(Math.random()*NUM_ROWS);
		}while ((treeCol[i]==0 || treeCol[i]==NUM_COLS) && (treeRow[i]==0 || treeRow[i]==NUM_COLS))


	}
	draw();
	animReq=window.requestAnimationFrame(update);	

}


let tLastMove,tlastFrm;

let audioObj = new Audio('./G.mp3')

function update(t){
	let dead = false;
	if(!tLastMove) tLastMove = t;
	if(!tLastFrm) tLastMove = t;
	if(t - tLastMove>=GHOST_MOVEMENT_TIME){
		for (let i=0;i<4;i++){
		let dCol = myCol-ghostCol[i];
		let dRow = myRow-ghostRow[i];
		if (Math.abs(dCol)>Math.abs(dRow)){
			if (dCol!=0)
				ghostCol[0] +=dCol/Math.abs(dCol);
		
		} else {
			if (dRow!=0)
				ghostRow[0] +=dRow/Math.abs(dRow);
		}
		if (ghostCol[i]==myCol && ghostRow[i]==myRow){
			audioObj.play();
			dead = true;
		}
		
	}

		tLastMove = t;
	}
	if (t-tlastFrm>=100){
	frmX=(frmX+1)%2;
	frmX=(frmX+1)%4;
	tlastFrm = t;

	}
	draw();
	msg.value=(t);
	if (!dead) AnimReq=window.requestAnimationFrame(update)

}



function draw(){
for (let col = 0; col < NUM_COLS; col ++) {	
		for (let row = 0; row < NUM_ROWS; row++){
			context.drawImage(bg, col*32, row*32);
		}

	}
	context.drawImage(sprites,10*32,0*32,32,32, 0*32, 0*32,32,32);
	for (let i=0;i<NUM_TREES; i++)
	context.drawImage(tree, treeCol*32, treeRow*32);

	for (let i=0;i<4; i++)
		context.drawImage(sprites,i*2*32,0*32,32,32, ghostCol[i]*32, 0*32,32,32);

}




function moveOnceKey(event){
	let oldRow=myRow; 
	let oldCol=myCol;

	switch (event.code){
		case 'KeyS':
		case 'ArrowDown':
			++myRow;
			break;
		case 'KeyW':
		case 'ArrowUp':
			--myRow;
			break;
		case 'KeyD':
		case 'ArrowRight':
			++myCol;
			break;
		case 'KeyA':
		case 'ArrowLeft':
			--myCol;
			break;
	}
	if (myCol<0 || myCol>NUM_COLS-1) myCol=oldCol; 
	if (myRow<0 || myCol>NUM_ROWS-1) myRow=oldRow;
	for (let i=0; i<NUM_TREES;i++){
		if (myCol==treeCol[i] && myRow==treeRow[i]){
			myRow=oldRow;
			myCol=oldCol;
		}

	}
}
		

window.onload = init;
document.onkeyup = moveOnceKey;

