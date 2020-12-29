function removeFromArray(arr,elt) {
	for (let i=arr.length-1; i>=0;i--){
		if (arr[i] == elt) {
			arr.splice(i,1);
		}
	}
}


// холст для рисования - игровое поле
let board = document.getElementById('cnv').getContext('2d');

let context = board;



const NUM_COLS=100, NUM_ROWS=90;
//Зомби

let lines = [];


// Спрайты
let loc1 = document.getElementById('loc1');
let gameover = document.getElementById('gameover');
let win = document.getElementById('win');

let fuse = document.getElementById('fuse');
let keys = document.getElementById('keys');
let door = document.getElementById('door');

let hero = document.getElementById('hero');
let heroWithGun = document.getElementById('heroWithGun');
let heroWithCrowbar = document.getElementById('heroWithCrowbar');
let heroFiring = document.getElementById('heroFiring');
let hero_corpse = document.getElementById('hero_corpse');

let boss = document.getElementById('boss');
let boss_corpse = document.getElementById('boss_corpse');

let runner = document.getElementById('runner');
let zombie = document.getElementById('zombie');
let zombie_corpse = document.getElementById('zombie_corpse');
let tree = document.getElementById('tree');

let handgun = document.getElementById('handgun');
let handgun_mag = document.getElementById('handgun_mag');
let crowbar = document.getElementById('crowbar');

// Переменные персонажа
let myCol = 20, myRow = 83;
//let myCol = 11, myRow = 48;
//let myCol = 61, myRow = 21;
//let myCol = 56, myRow = 76;
let lst_mvnt_drct;
let hero_sprites = [];
hero_sprites[0]=hero;
hero_sprites[1]=heroWithGun;
hero_sprites[2]=zombie;
hero_sprites[3]=heroWithCrowbar;
hero_sprites[4]=heroFiring;

//Оружие
let handgun_picked = false;
let weapon = "";
let ammo = 20;
let handgunCol=20;
let handgunRow=57;

let firing_dir = "";
//Патроны 
let handgun_mag_picked= false;
let handgun_magCol= 6;
let handgun_magRow= 71;

let handgun_mag_picked2= false;
let handgun_magCol2= 76;
let handgun_magRow2= 11;


//Игровые вещи и скрипт локации
let fuse1_picked = false;
let fuse2_picked = false;
let fuse1Col = 36;
let fuse1Row= 52;
let fuse2Col = 39;
let fuse2Row= 38;

let crowbar_picked = false;
let crowbarCol = 14;
let crowbarRow = 43;

let switchboard =false;
let switchboardCol =13;
let switchboardCol1 =12;
let switchboardRow =41;

let keys_picked = false;
let keysCol = 11;
let keysRow = 59;

let elevatorCol = 17;
let elevatorRow = 52;
let elevatorRow1 = 53;
let elevatorRow2 = 55;
let elevatorRow3 = 56;
//doors 
let door_canteen_opened = false;
let door_canteenCol =27;
let door_canteenCol1 =28;
let door_canteenRow =45;

let door_beginCol =23;
let door_beginRow =72; 

let door_5floor_opened = false;
let door_5floorCol =72;
let door_5floorCol1 =73;
let door_5floorRow =15;

let door_switchCol =0;
let door_switchRow =13;

let fuse_door_opened = false;
let fuse_doorCol1=36;
let fuse_doorCol2=37;
let fuse_doorRow=46;

let fifth_door_opened=false;
let fifth_doorCol = 72;
let fifth_doorRow = 15;
// абзац с сообщением 
let msg = document.getElementById('msg');



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
	this.state = "hunting";
	this.live = true;
}


function initWalls(){
	//do vhoda
	for (let i =14;i<29;i++){
		grid[i][72].wall=true;
	}
	for (let i =73;i<81;i++){
		grid[29][i].wall=true;
	}
	for (let i =73;i<81;i++){
		grid[13][i].wall=true;
	}
	//1 floor
	for (let i =8;i<69;i++){
		grid[i][68].wall=true;
	}
	for (let i =6;i>0;i--){
		grid[i][68].wall=true;
	}

	for (let i =67;i>57;i--){
		grid[1][i].wall=true;
	}
	for (let i =1;i<11;i++){
		grid[i][59].wall=true;
	}

	grid[10][60].wall=true;
	
	for (let i =10;i<17;i++){
		grid[i][58].wall=true;
	}
	for (let i =51;i<63;i++){
		grid[16][i].wall=true;
	}
	for (let i =10;i<16;i++){
		grid[i][62].wall=true;
	}
	for (let i =8;i<16;i++){
		grid[i][51].wall=true;
	}
	for (let i =50;i>45;i--){
		grid[8][i].wall=true;
	}
	for (let i =9;i<48;i++){
		grid[i][45].wall=true;
	}
	grid[12][45].wall=false;
	//щитовая
	for (let i =44;i>39;i--){
		grid[10][i].wall=true;
	}
	for (let i =11;i<17;i++){
		grid[i][40].wall=true;
	}
	for (let i =41;i<45;i++){
		grid[16][i].wall=true;
	}
	//та прямая у лестницы и лестница 
	for (let i =52;i<68;i++){
		grid[26][i].wall=true;
	}
	grid[27][52].wall=true;
	grid[28][52].wall=true;
	grid[29][52].wall=true;
	grid[30][53].wall=true;
	grid[30][54].wall=true;
	grid[30][55].wall=true;
	grid[30][56].wall=true;

	//баррикады
	for (let i =31;i<39;i++){
		grid[i][57].wall=true;
	}
	grid[37][56].wall=true;
	grid[38][56].wall=true;

	grid[39][55].wall=true;
	grid[39][54].wall=true;
	grid[39][53].wall=true;

	grid[40][53].wall=true;
	grid[41][53].wall=true;

	grid[39][54].wall=true;
	grid[39][53].wall=true;
	for (let i =42;i<48;i++){
		grid[i][52].wall=true;
	}
	for (let i =46;i<52;i++){
		grid[47][i].wall=true;
	}
	//canteen and fuse_room 
	for (let i =33;i<45;i++){
		grid[21][i].wall=true;
	}
	for (let i =22;i<49;i++){
		grid[i][34].wall=true;
	}
	for (let i =34;i<45;i++){
		grid[34][i].wall=true;
	}

	//5 floor 
	for (let i =21;i<29;i++){
		grid[55][i].wall=true;
	}
	for (let i =55;i<65;i++){
		grid[i][27].wall=true;
	}
	for (let i =21;i<28;i++){
		grid[65][i].wall=true;
	}
	for (let i =66;i<86;i++){
		grid[i][21].wall=true;
	}
	for (let i =17;i<21;i++){
		grid[84][i].wall=true;
	}
	for (let i =14;i<87;i++){
		grid[i][15].wall=true;
	}
	grid[17][15].wall=false;
	for (let i =16;i<22;i++){
		grid[14][i].wall=true;
	}
	for (let i =14;i<55;i++){
		grid[i][21].wall=true;
	}
	grid[84][16].wall=true;
	//комната 5 этажа
	for (let i =5;i<15;i++){
		grid[70][i].wall=true;
	}
	for (let i =70;i<84;i++){
		grid[i][5].wall=true;
	}
	for (let i =5;i<15;i++){
		grid[84][i].wall=true;
	}
	//комнатка с лестницей
	for (let i =11;i<15;i++){
		grid[14][i].wall=true;
	}
	for (let i =15;i<22;i++){
		grid[i][10].wall=true;
	}
	for (let i =10;i<15;i++){
		grid[21][i].wall=true;
	}
	//roof
	for (let i =53;i<95;i++){
		grid[i][61].wall=true;
	}
	for (let i =61;i<81;i++){
		grid[94][i].wall=true;
	}
	for (let i =52;i<95;i++){
		grid[i][80].wall=true;
	}
	for (let i =61;i<81;i++){
		grid[53][i].wall=true;
	}
	//комнатка с магазином
	grid[3][69].wall=true;
	grid[3][70].wall=true;
	grid[3][71].wall=true;
	grid[3][72].wall=true;
	grid[3][73].wall=true;

	grid[4][73].wall=true;
	grid[5][73].wall=true;
	grid[6][73].wall=true;
	grid[7][73].wall=true;
	grid[8][73].wall=true;

	grid[8][69].wall=true;
	grid[8][70].wall=true;
	grid[8][71].wall=true;
	grid[8][72].wall=true;
	grid[8][73].wall=true;
	//отс.стена в фуз руме
	for (let i =35;i<45;i++){
		grid[48][i].wall=true;
	}
	grid[58][68].wall=false;
	for (let i =61;i<69;i++){
		grid[i][68].wall=false;
	}

}
const GHOST_MOVEMENT_TIME=400;
const RUNNER_MOVEMENT_TIME=200;

const NUM_ZOMBIE = 23;
let zombie_stats = [];
let ghostRow, ghostCol = new Array (NUM_ZOMBIE);
let bossHP = 3;

let handgun_pick_up =new Audio('HANDGUN_PICK_UP.mp3');
let item_pick_up =new Audio('ITEM_PICK_UP.mp3');
let handgun_fire =new Audio('HANDGUN_FIRE.mp3');
let ambience =new Audio('ambience.mp3');
let zombie_death =new Audio('zombie_death.mp3');
let death_sound =new Audio('death_sound.mp3');
let door_sound = new Audio ('door_sound.mp3');
let a_play=0;

let game_state = false;
function init(){

	//Позиции зомби
	ghostCol = [89,24,33,44,47,9,83,12,13,12,24,28,31,27,30,32,24,28,32,45,42,34,18]
	ghostRow = [70,18,54,50,40,48,18,85,83,81,38,37,39,87,83,81,36,36,38,36,18,18,18]
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
	

	
	initWalls();
	draw();
	animReq=window.requestAnimationFrame(update);

}

let tLastMove,tLastFrm;

let oldghostCol = [];
let oldghostRow = [];
let ghst_last_mvnt_drct =[];
let dead = false;
function update(t){
	if (a_play == 1) {
		ambience.play();

	}
	for (let k=0;k<NUM_ZOMBIE;k++){ 
		if (zombie_stats[k].live=false) {

			NUM_ZOMBIE.splice(k, 1);
			ghostCol.splice(k, 1);
			removeFromArray(ghostRow,k);
			removeFromArray(oldghostCol,k);
			removeFromArray(oldghostRow,k);
	
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
				grid[oldghostCol[i]][oldghostRow[i]].wall=false;
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
			if (zombie_stats[i].state == "standing"){
				
			}
			if  (zombie_stats[i].state != "dead")
			{
				zombie_stats[i].state =  drawLine(ghostCol[i],ghostRow[i],myCol,myRow);
				console.log(zombie_stats[i].state);
			}
			lines = [];
			firing_dir="";
		}

		tLastMove = t;
	}
	
	draw();
	msg.value=(t);

	

	if (!dead || game_state==true) animReq=window.requestAnimationFrame(update)


}
let plot = function(x,y) {
	if(isFinite(x) && isFinite(y)){
		lines.push(x,y);	
    }
}
function drawLine(x1, y1, x2, y2){
	let deltaX = Math.abs(x2 - x1);
	let deltaY = Math.abs(y2 - y1);
	let signX = x1 < x2 ? 1 : -1;
	let signY = y1 < y2 ? 1 : -1;
	
	let error = deltaX - deltaY;
	
	while(x1 != x2 || y1 != y2) {
		if(grid[x1][y1].wall == false){
			plot(x1,y1);
		}else{
			plot(x1,y1);
			return "wandering";
		}	
		let error2 = error * 2;
		
		if(error2 > -deltaY) 
		{
			error -= deltaY;
			x1 += signX;
		}
		if(error2 < deltaX) 
		{
			error += deltaX;
			y1 += signY;
		}
	}
	return "hunting";
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


	context.drawImage(loc1, 0, 0);
	if ( dead){
		context.drawImage(hero_corpse, myCol*32, myRow*32);
		death_sound.play();
	}
	
	for (let i=0;i<NUM_ZOMBIE; i++) {
		if (zombie_stats[i].state!="dead"){
			if (i==0) {
				boss_mvnt_drct(ghst_last_mvnt_drct[i],ghostCol[i],ghostRow[i]);
				continue;
			}
			if (i==1){
				runner_mvnt_drct(ghst_last_mvnt_drct[i],ghostCol[i],ghostRow[i]);
				continue;
			}
			mvnt_drct(ghst_last_mvnt_drct[i],ghostCol[i],ghostRow[i],2);
		}
		if (zombie_stats[i].state=="dead"){
			if (i==0) {
				context.drawImage(boss_corpse, ghostCol[i]*32, ghostRow[i]*32);
				continue;
			}
			if (i==1){
				context.drawImage(zombie_corpse,ghostCol[i]*32, ghostRow[i]*32);
				continue;
			}
			context.drawImage(zombie_corpse, ghostCol[i]*32, ghostRow[i]*32);
		}

	}
	context.drawImage(door, (door_beginCol-6)*32, door_beginRow*32);
	context.drawImage(door, (door_beginCol-3)*32, door_beginRow*32);
	context.drawImage(door, door_beginCol*32, door_beginRow*32);
	if ( door_5floor_opened == false){
		context.drawImage(door, door_5floorCol*32, door_5floorRow*32);
	}
	if ( fuse_door_opened == false){
		context.drawImage(door, 36*32, (fuse_doorRow-1)*32);
	}
	if ( door_canteen_opened == false){
		context.drawImage(door, door_canteenCol*32,door_canteenRow*32);
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
	if ( handgun_picked == false) {
		context.drawImage(handgun, handgunCol*32, handgunRow*32);	
	}
	if ( handgun_mag_picked == false) {
		context.drawImage(handgun_mag, handgun_magCol*32, handgun_magRow*32);	
	}
	if ( handgun_mag_picked2 == false) {
		context.drawImage(handgun_mag, handgun_magCol2*32, handgun_magRow2*32);	
	}

	if ( keys_picked == false) {
		context.drawImage(keys, keysCol*32, keysRow*32);	
	}

	if ( handgun_picked == false && crowbar_picked == false && !dead) {
		
		mvnt_drct(lst_mvnt_drct,myCol,myRow,0);
	}

	if ( weapon == "handgun" && !dead)
		mvnt_drct(lst_mvnt_drct,myCol,myRow,1);	

	if ( weapon == "crowbar" && !dead)
		mvnt_drct(lst_mvnt_drct,myCol,myRow,3);	
	if (firing_dir == "down" ){
		context.drawImage(heroFiring,0*32,0*32,32,64, myCol*32, myRow*32-32,32,64);
	
	}
	if (firing_dir == "right" ){
		context.drawImage(heroFiring,107,0*32,40,64, myCol*32, myRow*32-32,32,64);
	
	}
	if (firing_dir == "left" ){
		context.drawImage(heroFiring,60,0*32,40,64, myCol*32-8, myRow*32-32,32,64);
	
	}
	if(door_canteen_opened==false ){
		context.drawImage(door, 27*32, 45*32);
	}


	if (dead && myCol !=6){
		console.log('Dead');
		myCol = 6;
		myRow = 8;
		return draw(),context.drawImage(gameover, 4*4, 1*4);
	}	

	if (zombie_stats[0].state == "dead" && game_state==false){
		
		
		context.drawImage(win, 0, 0);
		alert('КОНЕЦ!!');
		game_state = true;
		return draw(),context.drawImage(win, 4*4, 1*4);

	}


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

function runner_mvnt_drct(lst_mvnt_drct,charCol,charRow,k) {
	switch(lst_mvnt_drct){
			case "":
			case undefined:
			case "right":
				context.drawImage(runner,0*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
				break;
			case "left":
				context.drawImage(runner,1*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
				break;
			case "up":
				context.drawImage(runner,3*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
				break;
			case "down":
				context.drawImage(runner,2*32,0*32,32,64, charCol*32, charRow*32-32,32,64);
				break;
	}	
}

function boss_mvnt_drct(lst_mvnt_drct,charCol,charRow,k) {
switch(lst_mvnt_drct){
		case "":
		case undefined:
		case "right":
			context.drawImage(boss,0*64,0*32,64,96, charCol*32, charRow*32-32,64,96);
			break;
		case "left":
			context.drawImage(boss,1*64,0*32,64,96, charCol*32, charRow*32-32,64,96);
			break;
		case "up":
			context.drawImage(boss,3*64,0*32,64,96, charCol*32, charRow*32-32,64,96);
			break;
		case "down":
			context.drawImage(boss,2*64,0*32,64,96, charCol*32, charRow*32-32,64,96);
			break;
	}	
}

function fire_mvnt_drct(lst_mvnt_drct,charCol,charRow,k) {
switch(lst_mvnt_drct){
		case "":
		case undefined:
		case "right":
			context.drawImage(hero_sprites[k],0*32,0*32,32,64, charCol*32, charRow*32+32,32,64);
			break;
		case "left":
			context.drawImage(hero_sprites[k],1*32,0*32,32,64, charCol*32, charRow*32+32,32,64);
			break;
		case "up":
			context.drawImage(hero_sprites[k],3*32,0*32,32,64, charCol*32, charRow*32+32,32,64);
			break;
		case "down":
			context.drawImage(hero_sprites[k],2*32,0*32,32,64, charCol*32, charRow*32+32,32,64);
			break;
	}	
}


function moveOnceKey(event){
	let oldRow=myRow;
	let oldCol=myCol;

	switch (event.code){
		case 'KeyQ':

		    if (weapon=="handgun" && crowbar_picked==true){
		    	console.log("смена на лом")
		    	weapon ="crowbar";
		    	console.log(weapon);
		    	break;
		    }
		    if (weapon=="crowbar" && handgun_picked==true){
		    	console.log("смена на пистолет")
		    	weapon ="handgun";
		    	console.log(weapon);
		    	break;
		    }
		    break;
		case 'KeyS':		
			++myRow;
			lst_mvnt_drct = "down";
			break;
		case 'KeyW':	
		   a_play++;	
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
			if ((myCol==36 || myCol==37) && myRow==fuse_doorRow && keys_picked==true && fuse_door_opened==false){
				grid[36][45].wall = false;
				grid[37][45].wall = false;
				console.log("door_opened !");

				fuse_door_opened = true;
			}
			if ((myCol==door_canteenCol || myCol==door_canteenCol1) && myRow==door_canteenRow+1 &&  door_canteen_opened==false){
				grid[door_canteenCol][45].wall = false;
				grid[door_canteenCol1][45].wall = false;
				console.log("door_opened !");
				door_sound.play();
				door_canteen_opened = true;
			}
			if ((myCol==door_5floorCol || myCol==door_5floorCol1) && myRow==door_5floorRow+1 &&  door_5floor_opened==false){
				grid[door_5floorCol][15].wall = false;
				grid[door_5floorCol1][15].wall = false;
				console.log("door_opened !");
				door_sound.play();
				door_5floor_opened = true;
			}
			if (keys_picked == true && myCol==door_switchCol && myRow==door_switchRow){
				grid[myCol][myRow-1].wall = false;
				door_sound.play();
			}
			if (switchboard == true && myCol==elevatorCol && myRow==elevatorRow){
				myCol=56; myRow=23;
				door_sound.play();
			}
	

			break;
	}
	if (myCol<0 || myCol>NUM_COLS-1) myCol=oldCol; 
	if (myRow<0 || myRow>NUM_ROWS-1) myRow=oldRow;
	//Тп на внутрь кфена
	if ((myCol==24 && myRow==74) || (myCol==23 && myRow==73) || (myCol==24 && myRow==73) || (myCol==23 && myRow==74)) {
		myCol = 24;
		myRow = 67;
	}
	//Тп на крышу
	if (myCol==18 && myRow==13) {
		myCol = 56;
		myRow = 64;
	}

	if (checkWall(myCol,myRow,oldCol,oldRow)==true) {
		myCol=oldCol;
		myRow=oldRow;
	}
	if (myRow==handgunRow && myCol==handgunCol && handgun_picked==false){
		weapon = "handgun";
		handgun_pick_up.play();
		handgun_picked = true;
		alert ("В магазине пистолета осталось "+ ammo+ " патрона");
	
	}
	if (myRow==crowbarRow && myCol==crowbarCol && crowbar_picked==false){
		crowbar_picked = true;
		item_pick_up.play();
		weapon = "crowbar";
	
	}
	if (myRow==fuse1Row && myCol==fuse1Col){
		fuse1_picked = true;
		item_pick_up.play();
	}
	if (myRow==fuse2Row && myCol==fuse2Col){
		fuse2_picked = true;
		item_pick_up.play();
	}

	if (myRow==keysRow && myCol==keysCol){
		keys_picked = true;	
		item_pick_up.play();
	}


	if (myRow==handgun_magRow && myCol==handgun_magCol && handgun_mag_picked==false){
		handgun_mag_picked = true;
		item_pick_up.play();
		ammo +=20;
	}

		if (myRow==handgun_magRow2 && myCol==handgun_magCol2 && handgun_mag_picked==false){
		handgun_mag_picked2 = true;
		item_pick_up.play();
		ammo +=20;
	}

	if (fuse1_picked == true && fuse2_picked == true && (myCol == switchboardCol) && myRow == switchboardRow) {
		switchboard = true;	
		item_pick_up.play();
		alert ("Лифт теперь работает !");
	}

if (switchboard == true && myCol==elevatorCol && myRow==elevatorRow){
        alert('Нажмите Е чтобы использовать лифт');
    
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
		handgun_fire.play();
		switch(direction){
			case 'down':
			for (let i =myRow;i<NUM_ROWS;i++){
				if (grid[myCol][i].wall) {
					break;
				}
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostRow[j]==i && ghostCol[j]==myCol){
						console.log("Попадание");
						if (j==0){
							bossHP--;
							if(bossHP==0) zombie_stats[0].state="dead";
							ammo--;	
							break;		
						} 
						zombie_death.play();
						zombie_stats[j].state="dead";
						firing_dir = "down";
						ammo--;	
						break;								
					}
				}
			}
			firing_dir = "down";
			ammo--;
			break;
			case 'up':
			for (let i = myRow;i>=0;i--){
				if (grid[myCol][i].wall) {

					break;
				}
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostRow[j]==i && ghostCol[j]==myCol){
						console.log("Попадание");
						if (j==0){
							bossHP--;
							if(bossHP==0) zombie_stats[0].state="dead";
							ammo--;	
							break;		
						} 
						zombie_death.play();
						zombie_stats[j].state="dead";
						ammo--;	
						break;								
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
						console.log("Попадание");
						if (j==0){
							bossHP--;
							if(bossHP==0) zombie_stats[0].state="dead";
							ammo--;	
							break;		
						}
						zombie_death.play();
						zombie_stats[j].state="dead";
						firing_dir = "right";
						ammo--;
						break;								
					}
				}
			}
			firing_dir = "right";
			ammo--;
			break;
			case 'left':
			for (let i = myCol;i >= 0;i--){
				if (grid[i][myRow].wall) {

					break;
				}
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostCol[j]==i && ghostRow[j]==myRow){
						console.log("Попадание");
						if (j==0){
							bossHP--;
							if(bossHP==0) zombie_stats[0].state="dead";
							ammo--;	
							break;		
						}
						zombie_death.play();
						zombie_stats[j].state="dead";	
						firing_dir = "left";
						ammo--;
						break;	

					}
				}
			}
			firing_dir = "left";
			ammo--;
			break;
		}
	}
	if (weapon=="crowbar") {
		switch(direction){
			case 'down':
				for (let j = 0;j<NUM_ZOMBIE;j++){
					if (ghostRow[j]==myRow+1 && ghostCol[j]==myCol){
						zombie_stats[j].state="dead";	
						break;							
					}
				}
			
			break;
			case 'up':
				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostRow[j]==myRow-1 && ghostCol[j]==myCol){
						zombie_stats[j].state="dead";	
						break;							
					}
				}
			
			break;
			case 'right':

				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostCol[j]==myCol+1 && ghostRow[j]==myRow){
						zombie_stats[j].state="dead";	
						break;							
					}
				}
			
			break;
			case 'left':

				for (let j =0;j<NUM_ZOMBIE;j++){
					if (ghostCol[j]==myCol-1 && ghostRow[j]==myRow){

						zombie_stats[j].state="dead";	
						break;							
					}
				}

			break;
		}
	}
}








window.onload = init;
window.onkeyup = moveOnceKey;
document.onmouseup = fire;