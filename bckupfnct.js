function removeFromArray(arr,elt) {
	for (let i=arr.length-1; i>=0;i--){
		if (arr[i] == elt) {
			arr.splice(i,1);
		}
	}
}




//
function Spot(i,j){
	//Свойства клеток
	this.col = i;
	this.row = j;
	this.wall = false;
	this.item = "";
}




//
function zombie_condition(i){
	this.state = "hunting";
	this.live = true;
}

function init(){
	//Позиции зомби
	ghostCol = [0,12,13,14,23,25,25,28,30,30,]
	ghostRow = [0,86,86,86,85,84,86,85,83,81]
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





//
function clamp(value, min, max){
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}





//
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
	if ( handgun_picked == false) {
		context.drawImage(handgun, handgunCol*32, handgunRow*32);	
	}
	if ( handgun_mag_picked == false) {
		context.drawImage(handgun_mag, handgun_magCol*32, handgun_magRow*32);	
	}

	if ( keys_picked == false) {
		context.drawImage(keys, keysCol*32, keysRow*32);	
	}

	if ( handgun_picked == false && crowbar_picked == false) {
		
		mvnt_drct(lst_mvnt_drct,myCol,myRow,0);
	}

	if ( weapon == "handgun")
		mvnt_drct(lst_mvnt_drct,myCol,myRow,1);	

	if ( weapon == "crowbar")
		mvnt_drct(lst_mvnt_drct,myCol,myRow,3);	


 /*context.drawImage(tree, 2*32, 2*32);
 context.drawImage(tree, 1*32, 2*32);
 context.drawImage(tree, 2*32, 1*32);

 context.drawImage(tree, 2*32, 0*32);
 context.drawImage(tree, 0*32, 2*32);		*/

}



//
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
    


    //
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
                if ((myCol==door_canteenCol || myCol==door_canteenCol1) && myRow==door_canteenRow &&  door_canteen_opened==false){
                    grid[door_canteenCol][45].wall = false;
                    grid[door_canteenCol1][45].wall = false;
                    console.log("door_opened !");
                    door_canteen_opened = true;
                }
                if (keys_picked == true && myCol==door_switchCol && myRow==door_switchRow){
                    grid[myCol][myRow-1].wall = false;
                }
                if (switchboard == true && myCol==elevatorCol && myRow==elevatorRow){
                    myCol=56; myRow=23;
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
            handgun_picked = true;
        
        }
        if (myRow==crowbarRow && myCol==crowbarCol && crowbar_picked==false){
            crowbar_picked = true;
            weapon = "crowbar";
        
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
    
    
        if (myRow==handgun_magRow && myCol==handgun_magCol && andgun_mag_picked==false){
            handgun_mag_picked = true;
            ammo +=8;
        }
    
        if (fuse1_picked == true && fuse2_picked == true && myCol == switchboardCol && myRow == switchboardRow) {
            switchboard = true;	
        }
        
    }




    //
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
    
    