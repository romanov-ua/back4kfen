function removeFromArray(arr,elt) {
	for (let i=arr.length-1; i>=0;i--){
		if (arr[i] == elt) {
			arr.splice(i,1);
		}
	}
}


// холст для рисования - игровое поле
let board = document.getElementById('cnv').getContext('2d');
let context = board

const NUM_COLS=100, NUM_ROWS=90;
//Зомби
const GHOST_MOVEMENT_TIME=1000;
const NUM_TREES = 10;
const NUM_ZOMBIE = 4;
let zombie_stats = [];
let ghostRow, ghostCol = new Array (NUM_ZOMBIE);


// Спрайты
let bg = document.getElementById('grass');
let loc1 = document.getElementById('loc1');

let fuse = document.getElementById('fuse');
let keys = document.getElementById('keys');

let hero = document.getElementById('hero');
let heroWithGun = document.getElementById('heroWithGun');
let heroWithCrowbar = document.getElementById('heroWithCrowbar');

let zombie = document.getElementById('zombie');
let zombie_corpse = document.getElementById('zombie_corpse');
let tree = document.getElementById('tree');

let handgun = document.getElementById('handgun');
let handgun_mag = document.getElementById('handgun_mag');
let crowbar = document.getElementById('crowbar');

// Переменные персонажа
let myCol = 14, myRow = 66;
let lst_mvnt_drct;
let hero_sprites = [];
hero_sprites[0]=hero;
hero_sprites[1]=heroWithGun;
hero_sprites[2]=zombie;
hero_sprites[3]=heroWithCrowbar;

//Оружие
let handgun_picked = false;
let weapon = "";
let ammo = 2;
let handgunCol=3;
let handgunRow=3;
//Патроны 
let handgun_mag_picked= false;
let handgun_magCol= 0;
let handgun_magRow= 9;

//Игровые вещи и скрипт локации
let fuse1_picked = false;
let fuse2_picked = false;
let fuse1Col = 4;
let fuse1Row= 0;
let fuse2Col = 7;
let fuse2Row= 0;

let crowbar_picked = false;
let crowbarCol = 8;
let crowbarRow = 8;

let switchboard =false;
let switchboardCol =9;
let switchboardRow =0;

let keys_picked = false;
let keysCol = 7;
let keysRow = 7;

let elevatorCol = 13;
let elevatorRow = 13;
//doors 
let door_canteenCol =13;
let door_canteenRow =12;

let door_switchCol =0;
let door_switchRow =13;
// абзац с сообщением 
let msg = document.getElementById('msg');


let treeRow = new Array(NUM_TREES);
let treeCol = new Array(NUM_TREES);


//Cетка и канвас
let grid = new Array(NUM_COLS);
let canvaswidth = 352;
let canvasheight = 352;
let frmX=0, frmY=0;

function Spot(i,j){
	//Свойства клеток
	this.col = i;
	this.row = j;
	this.wall = false;
	this.item = "";
}

function zombie_condition(i){
	this.state = "wandering";
	this.live = true;
}

function init(){
	//Позиции зомби
	ghostCol = [0,0,NUM_COLS-1,NUM_COLS-1]
	ghostRow = [0,NUM_ROWS-1,0,NUM_ROWS-1]
	// Сетка 
	for (let i =0;i<NUM_COLS;i++){
		grid[i]=new Array(NUM_ROWS);
	}
	

	for (let i =0;i<NUM_COLS;i++){
		for (let j =0;j<NUM_ROWS;j++){
			grid[i][j]= new Spot(i,j);
		}
	}

	for (let i =0;i<NUM_ZOMBIE;i++){
		zombie_stats[i]= new zombie_condition(i);
	}
	

	for (let i=0; i <NUM_TREES; i++){
		do {
			treeCol[i] = Math.floor(Math.random()*NUM_COLS);
			treeRow[i] = Math.floor(Math.random()*NUM_ROWS);
			grid[treeCol[i]][treeRow[i]].wall=true;
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
	console.log(NUM_ZOMBIE);
	for (let k=0;k<NUM_ZOMBIE;k++){ 
		if (zombie_stats[k].live=false) {

			NUM_ZOMBIE.splice(k, 1);
			ghostCol.splice(k, 1);
			removeFromArray(ghostRow,k);
			removeFromArray(oldghostCol,k);
			removeFromArray(oldghostRow,k);
			console.log(NUM_ZOMBIE);
			console.log(z);
		}
	}


	if(!tLastMove) tLastMove = t;
	
	if(t - tLastMove>=GHOST_MOVEMENT_TIME){

		for (let i=0;i<NUM_ZOMBIE;i++){
			oldghostCol[i] = ghostCol[i];
			oldghostRow[i] = ghostRow[i];
			if (zombie_stats[i].state == "hunting") {
				let dCol = myCol-ghostCol[i];
				let dRow = myRow-ghostRow[i];

				

				if (Math.abs(dCol)>Math.abs(dRow)){
					if (dCol!=0) ghostCol[i] +=dCol/Math.abs(dCol);
				} else {
					if (dRow!=0) ghostRow[i] +=dRow/Math.abs(dRow);
				}
				if (checkWall(ghostCol[i],ghostRow[i],oldghostCol[i],oldghostRow[i])==true) {
					ghostCol[i]=oldghostCol[i];
					ghostRow[i]=oldghostRow[i];
				}
				if (ghostCol[i]==myCol && ghostRow[i]==myRow){
					dead = true;
				}

				for (let i=0;i<NUM_ZOMBIE;i++){
					if (oldghostCol[i] - ghostCol[i]>=0.9) {ghst_last_mvnt_drct[i]="left"; }
					if (oldghostCol[i] - ghostCol[i]<=-0.9) {ghst_last_mvnt_drct[i]="right"; }
					if (oldghostRow[i] - ghostRow[i]>=0.9) {ghst_last_mvnt_drct[i]="up"; }
					if (oldghostRow[i] - ghostRow[i]<=-0.9) {ghst_last_mvnt_drct[i]="down"; }
				}
			}
			if (zombie_stats[i].state == "wandering") {
				let random_number = Math.random();
				if (random_number<0.1) {ghostRow[i]++;ghst_last_mvnt_drct[i]="down";}
				if (random_number>0.1 && random_number<0.2) {ghostRow[i]--;ghst_last_mvnt_drct[i]="up";}
				if (random_number>0.3 && random_number<0.4) {ghostCol[i]++;ghst_last_mvnt_drct[i]="right";}
				if (random_number>0.4 && random_number<0.5) {ghostCol[i]--;ghst_last_mvnt_drct[i]="left";}
				if (checkWall(ghostCol[i],ghostRow[i],oldghostCol[i],oldghostRow[i])==true) {
					ghostCol[i]=oldghostCol[i];
					ghostRow[i]=oldghostRow[i];
				}
				if (ghostCol[i]==myCol && ghostRow[i]==myRow){
					dead = true;
				}

			}
			if (zombie_stats[i].state == "dead") {
				context.drawImage(tree, ghostCol[i]*32, ghostRow[i]*32);
			}
			if (oldghostCol[i]==ghostCol[i] && oldghostRow[i]==ghostRow[i] && zombie_stats[i].state != "dead"){
				zombie_stats[i].state = "wandering"
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
    var camX = clamp(-myCol*32 + canvaswidth/2, -10000, 10000 - canvaswidth);
    var camY = clamp(-myRow*32 + canvasheight/2, -10000, 10000 - canvasheight);

    context.translate( camX, camY );
    //end of viewport
    //context.scale(2, 2);

	for (let col = 0; col < NUM_COLS; col++){	
		for (let row = 0; row < NUM_ROWS; row++){
			context.drawImage(bg, col*32, row*32);
		}
	}
	context.drawImage(loc1, 0, 0);
	
	for (let i=0;i<NUM_TREES; i++)context.drawImage(tree, treeCol[i]*32, treeRow[i]*32);
	for (let i=0;i<NUM_ZOMBIE; i++) {
		if (zombie_stats[i].state!="dead"){

			mvnt_drct(ghst_last_mvnt_drct[i],ghostCol[i],ghostRow[i],2);
		}
		if (zombie_stats[i].state=="dead"){

			context.drawImage(zombie_corpse, ghostCol[i]*32, ghostRow[i]*32);
		}

	}
	
	if ( fuse1_picked == false) {
		context.drawImage(fuse, fuse1Col*32, fuse1Row*32);	
	}
	if ( fuse2_picked == false) {
		context.drawImage(fuse, fuse2Col*32, fuse2Row*32);	
	}
	if ( crowbar_picked == false) {
		context.drawImage(crowbar, crowbarCol*32, crowbarRow*32);	
	}
	if ( handgun_mag_picked == false) {
		context.drawImage(handgun_mag, handgun_magCol*32, handgun_magRow*32);	
	}

	if ( keys_picked == false) {
		context.drawImage(keys, keysCol*32, keysRow*32);	
	}

	if ( handgun_picked == false) {
		context.drawImage(handgun, handgunCol*32, handgunRow*32);
		mvnt_drct(lst_mvnt_drct,myCol,myRow,0);
	}
	if ( crowbar_picked == true) {
		mvnt_drct(lst_mvnt_drct,myCol,myRow,1);	
	}
	if ( handgun_picked == true)
		mvnt_drct(lst_mvnt_drct,myCol,myRow,1);	

	if ( crowbar_picked == true)
		mvnt_drct(lst_mvnt_drct,myCol,myRow,3);	


 /*context.drawImage(tree, 2*32, 2*32);
 context.drawImage(tree, 1*32, 2*32);
 context.drawImage(tree, 2*32, 1*32);

 context.drawImage(tree, 2*32, 0*32);
 context.drawImage(tree, 0*32, 2*32);		*/

}

function mvnt_drct(lst_mvnt_drct,charCol,charRow,k) {
switch(lst_mvnt_drct){
		case "":
		case undefined:
		case "right":
			context.drawImage(hero_sprites[k],0*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
		case "left":
			context.drawImage(hero_sprites[k],1*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
		case "up":
			context.drawImage(hero_sprites[k],3*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
		case "down":
			context.drawImage(hero_sprites[k],2*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
			break;
	}	
}


function moveOnceKey(event){
	let oldRow=myRow;
	let oldCol=myCol;

	switch (event.code){
		case 'KeyS':		
			++myRow;
			lst_mvnt_drct = "down";
			break;
		case 'KeyW':		
			--myRow;
			lst_mvnt_drct = "up";
			break;
		case 'KeyD':		
			++myCol;
			lst_mvnt_drct = "right";
			break;
		case 'KeyA':	
			--myCol;
			lst_mvnt_drct = "left";
			break;
		case 'ArrowDown':
			fire("down");
			lst_mvnt_drct = "down";
			break;
		case 'ArrowUp':
			fire("up");
			lst_mvnt_drct = "up";
			break;
		case 'ArrowRight':
			fire("right");
			lst_mvnt_drct = "right";
			break;
		case 'ArrowLeft':
			fire("left");
			lst_mvnt_drct = "left";
			break;
		case 'KeyF':
			console.log("col=",myCol,"row=",myRow);
			break;
		case 'KeyE':
			if (myCol==door_canteenCol && myRow==door_canteenRow){
				grid[myCol][myRow-1].wall = false;
			}		
			if (keys_picked == true && myCol==door_switchCol && myRow==door_switchRow){
				grid[myCol][myRow-1].wall = false;
			}
			if (switchboard == true && myCol==elevatorCol && myRow==elevatorRow){
				dead = true;
				alert("THE END!")
			}
			if (crowbar_picked == true && myCol==elevatorCol && myRow==elevatorRow){
				dead = true;
				alert("THE END!")
			}	
			break;
	}
	if (myCol<0 || myCol>NUM_COLS-1) myCol=oldCol; 
	if (myRow<0 || myRow>NUM_ROWS-1) myRow=oldRow;
	if (myCol==18 && myRow==56) {
		myCol = 18;
		myRow = 52;
	}
	if (checkWall(myCol,myRow,oldCol,oldRow)==true) {
		myCol=oldCol;
		myRow=oldRow;
	}
	if (myRow==handgunRow && myCol==handgunCol){
		weapon = "handgun";
		handgun_picked = true;
		if (weapon == "crowbar") {
			crowbar_picked = false;
			crowbarCol = myCol;
			crowbarRow = myRow;
		}
	}
	if (myRow==fuse1Row && myCol==fuse1Col){
		fuse1_picked = true;
	}
	if (myRow==fuse2Row && myCol==fuse2Col){
		fuse2_picked = true;
	}

	if (myRow==keysRow && myCol==keysCol){
		keys_picked = true;	
	}
	if (myRow==crowbarRow && myCol==crowbarCol){
		crowbar_picked = true;
		weapon = "crowbar";
		if (weapon == "handgun") {
			handgun_picked = false;
			handgunCol = myCol;
			handgunRow = myRow;
		}
	}

	if (myRow==handgun_magRow && myCol==handgun_magCol){
		handgun_mag_picked = true;
		ammo +=8;
	}

	if (fuse1_picked == true && fuse2_picked == true && myCol == switchboardCol && myRow == switchboardRow) {
		switchboard = true;	
	}
	
}
function checkWall(newCol,newRow,previosCol,previosRow){
	if (newCol<0 || newCol>NUM_COLS-1) return true;
	if (newRow<0 || newRow>NUM_ROWS-1) return true;
		if (grid[newCol][newRow].wall){
			return true;
		}
	return false;
}

function fire(direction){
	if (weapon=="handgun" && ammo > 0) {
		switch(direction){
			case 'down':
			for (let i =myRow;i<NUM_ROWS;i++){
				if (grid[myCol][i].wall) {
					break;
				}
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostRow[j]==i && ghostCol[j]==myCol){
						zombie_stats[j].state="dead";								
					}
				}
			}
			ammo--;
			break;
			case 'up':
			for (let i = myRow;i>=0;i--){
				if (grid[myCol][i].wall) {

					break;
				}
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostRow[j]==i && ghostCol[j]==myCol){

						zombie_stats[j].state="dead";								
					}
				}
			}
			ammo--;
			break;
			case 'right':
			for (let i = myCol;i < NUM_COLS;i++){
				if (grid[i][myRow].wall) {

					break;
				}
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostCol[j]==i && ghostRow[j]==myRow){

						zombie_stats[j].state="dead";								
					}
				}
			}
			ammo--;
			break;
			case 'left':
			for (let i = myCol;i >= 0;i--){
				if (grid[i][myRow].wall) {

					break;
				}
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostCol[j]==i && ghostRow[j]==myRow){

						zombie_stats[j].state="dead";								
					}
				}
			}
			ammo--;
			break;
		}
	}
	if (weapon=="crowbar") {
		switch(direction){
			case 'down':
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostRow[j]==myRow+1 && ghostCol[j]==myCol){
						zombie_stats[j].state="dead";								
					}
				}
			
			break;
			case 'up':
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostRow[j]==myRow-1 && ghostCol[j]==myCol){
						zombie_stats[j].state="dead";								
					}
				}
			
			break;
			case 'right':

				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostCol[j]==myCol+1 && ghostRow[j]==myRow){
						zombie_stats[j].state="dead";								
					}
				}
			
			break;
			case 'left':

				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostCol[j]==myCol-1 && ghostRow[j]==myRow){

						zombie_stats[j].state="dead";								
					}
				}

			break;
		}
	}
}








window.onload = init;
window.onkeyup = moveOnceKey;
document.onmouseup = fire;