const FPS = 30;
const LEVEL1TIME = 17000;
const LEVEL2TIME = 25000;
const LEVEL3TIME = 30000;
const TITLETIME = 4000;

var canv = null;
var context = null;

var background = new Image();
var target = new Image();
var targetTorn = new Image();
var corn = new Image();

var backAudio = null;
var sfx_gun = null;
var sfx_ting = null;
var sfx_success = null;

var width = 1024;
var height = 683;

var crow = new bird();
var albo = new albanese();

var shot = "bird";
var alpha = 0;

window.onload = setUp;

function setUp() {
	canv = document.getElementById("game");
	context = canv.getContext("2d");
	canv.addEventListener("click", handleMouseDown, false);


	//Changes size of canvas
	if (window.innerWidth < width) {
		width = window.innerWidth - 40;
	}

	if (window.innerHeight < height) {
		height = window.innerHeight - 40;
	}
	context.canvas.width = width;

	context.canvas.height = height;

	//Get Audio bits
	backAudio = document.getElementById("backAudio");
	sfx_gun = document.getElementById("sfx_gun");
	sfx_ting = document.getElementById("sfx_ting");
	sfx_success = document.getElementById("sfx_success");

	//Load Pictures
	background.src = "./Assets/Corn_field_ohio.jpg";
	target.src = "./Assets/target_small.png";
	targetTorn.src = "./Assets/target_torn_small.png";
	corn.src = "./Assets/corn_small.png";

	titles("Farmer: Protect Your Corn", "(Click to shoot)");

	var time = TITLETIME;

	setTimeout(level1, time);

	time += LEVEL1TIME + 34; // 34 accounts for one extra screen refresh at 30fps

	setTimeout(function () {titles("level 2", "");}, time);

	time += TITLETIME;

	setTimeout(level2, time);
	
	time += LEVEL2TIME + 34;

	setTimeout(function () {titles("the end", "");}, time);

	time += TITLETIME;

	setTimeout(level3, time);

	time += LEVEL3TIME + 34;

	setTimeout(setUpEnd, time);
}

function titles(big, small) {
	sfx_gun.src = null;
	context.fillStyle = "#000000";
	context.fillRect(0, 0, width, height);
	
	context.fillStyle = "#FFFFFF";
	context.font = "50px Courier New";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(big, width/2, height/2);
	context.font = "30px Courier New";
	context.textAlign = "center";
	context.fillText(small, width/2 + 30, height/2 + 30);
}

function level1() {
	//Play soundtrack
	backAudio.src = "./Assets/level1.mp3";
	backAudio.play();
	sfx_gun.src = "./Assets/shotgun.mp3";

	//Generate crow to draw to screen
	crow.generate();
	
	var intervalID = setInterval(function() {level1Draw(crow);}, 1000 / FPS);
	setTimeout(function() {clearInterval(intervalID);}, LEVEL1TIME);
}

function level1Draw(bird) {
	//Draw background
	context.clearRect(0, 0, width, height);
	context.save();
	context.scale(width/background.width, height/background.height);
	context.drawImage(background, 0, 0);
	context.restore();

	bird.update();
	context.drawImage

	// Draw if bird is on screen
	if (bird.xpos >= 0 || bird.xpos < width) {
		context.drawImage(bird.sprite, bird.xpos, bird.ypos);
	}	
}

function level2() {
	//Get rid of bird from last level
	crow.xpos = -100;

	//Play soundtrack
	backAudio.src = "./Assets/level2.mp3";
	backAudio.play();
	sfx_gun.src = "./Assets/shotgun.mp3";
	
	var intervalID = setInterval(function() {level2and3Draw();}, 1000 / FPS);
	setTimeout(function() {clearInterval(intervalID);}, LEVEL2TIME);
}

function level3() {
	//Play soundtrack
	backAudio.src = "./Assets/level3.mp3";
	backAudio.play();
	sfx_gun.src = "./Assets/shotgun.mp3";
	
	// albo.xMultiple = 2.9756;
	// albo.yMultiple = 1.937956;
	albo.xMultiple = 3.178;
	albo.yMultiple = 1.929;

	// console.log(albo.xpos + " / " + albo.ypos);
	// albo.xpos += 150;
	// albo.ypos -=50;
	// console.log(albo.xpos + " / " + albo.ypos);
	albo.rate = 1.0030;
	albo.currentscale *= 1.2;

	chance = 0;
	var intervalID = setInterval(function() {level2and3Draw();}, 1000 / FPS);
	setTimeout(function() {clearInterval(intervalID);}, LEVEL3TIME);
}

function level2and3Draw() {

	//Draw background
	context.clearRect(0, 0, width, height);
	context.save();
	context.scale(width/background.width, height/background.height);
	context.drawImage(background, 0, 0);
	context.restore();
	context.save();

	albo.grow();
	context.translate(albo.xpos, albo.ypos);
	context.scale(albo.currentscale, albo.currentscale);
	context.drawImage(albo.sprite, 0, 0);
	context.restore();
}

function setUpEnd() {
	shot = "target";
	context.drawImage(target, (width-200)/2, (height-200)/2);
	sfx_success.play();
}

function end() {
	var intervalID = setInterval(fadeCorn, 1000 / FPS);
	setTimeout(function() {clearInterval(intervalID);}, 2000);
	backAudio.src = "./Assets/wantyouback_short.mp3";
	backAudio.play();
	setTimeout(function() {titles("Treasure the ones you love", "Also, Satyros meeting Monday 7pm HAG040");}, 8500);
	setTimeout(function() {titles("","");}, 15500)

}

function fadeCorn() {
	alpha += 0.01665;
	context.globalAlpha = alpha;
	context.drawImage(corn, (width-100)/2, (height-100)/2);
}

function bird() {
	this.xpos = null;
	this.ypos = null;
	this.direction = null;
	this.speed = null;
	this.sprite = new Image();

	this.generate = generate;
	this.update = update;

	function generate() {
		// Direction is either 1 (left to right) or -1 (right to left)
		//Set xpos with about 1 second off screen
		this.direction = Math.random();
		if (this.direction < 0.5) {
			this.direction = -1;
			this.xpos = width + (Math.random() * 30);
			this.sprite.src = "./Assets/crow_right.png"
		} else {
			this.direction = 1;
			this.xpos = 0 - (Math.random() * 30);
			this.sprite.src = "./Assets/crow_left.png"
		}

		//Sky in picture about top 47% 
		this.ypos = Math.random() * (0.47 * height);

		// Speed is int between 15 and 30
		this.speed = 15 + (Math.random() * 15);
	}

	function update() {
		this.xpos = this.xpos + (this.direction * this.speed);

		//Check if bird has finished flight
		if (this.xpos < 0 && this.direction == -1) {
			this.generate();
		} else if (this.xpos > width && this.direction == 1) {
			this.generate();
		} 
	}
}

function albanese() {
	this.sprite = new Image();
	this.sprite.src = "./Assets/albanese_small.png";
	this.w = 1220;
	this.h = 1593;

	// The number to divide by when working out the pos
	this.xMultiple = 2;
	this.yMultiple = 2;

	this.currentscale = 0.04;
	this.currentW = this.currentscale * this.w;
	this.currentH = this.currentscale * this.h;
	this.xpos = (width - this.currentW) / this.xMultiple;
	this.ypos = (height - this.currentH) / this.yMultiple;
	this.rate = 1.00275;

	this.grow = grow;

	function grow() {
		this.currentscale *= this.rate;
		this.currentW = this.currentscale * this.w;
		this.currentH = this.currentscale * this.h;
		this.xpos = (width - this.currentW) / this.xMultiple;
		this.ypos = (height - this.currentH) / this.yMultiple;
	}
}

function handleMouseDown(event) {
	event = event || window.event; // IE-ism
	
	// Get pos of cursor relative to convas
	var x;
	var y;
	if (event.pageX || event.pageY) {
		x = event.pageX;
		y = event.pageY;
	} else {
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	x -= canv.offsetLeft;
	y -= canv.offsetTop;
	
	//Check to see if we're endgame or not
	if (shot == "target") {
		sfx_gun.play();

		if (Math.abs(event.clientX - (width / 2) < 100)) {
			if (Math.abs(event.clientY - (height / 2) < 100)) {
				context.drawImage(targetTorn, (width-200)/2, (height-200)/2);
				setTimeout(end, 750);
			}
		}
	} else {
		// If we're close to the bird it's dead
		if (Math.abs(event.clientX - crow.xpos) < 45) {
			if (Math.abs(event.clientY - crow.ypos) < 45) {
				console.log(event.clientX - crow.xpos)
				sfx_ting.play();
				crow.generate();
				// TODO: Add score?
			}
		} else {
			sfx_gun.play();
		}	
	}

}

