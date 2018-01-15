document.onkeydown = function(e) {
	var code = e.which || e.keyCode;
	if (code >= 37 && code <= 40) {
		return false;
	}
}
		
var shared = {
	keyState: {},
	touchState: {},
	documentHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
	speed: this.documentHeight/5000, //relative to 100
	speedRelative: this.speed*50, //since relative to 100, if speed is 50, speedRelative would be speed/2 
	allow: true,
	left: 0,
	step: true,
	legRotation: 0,
	legRotationSpeed: 3,
	lastTime: Date.now(),
	fps: 1000/ 60,
	runOnce: false,
	//dom
	audioIcon: document.getElementById('audio'),
	foregroundMost: document.getElementsByClassName('foreground-most'),
	foreground: document.getElementsByClassName('foreground'),
	midgroundCloser: document.getElementsByClassName('midground-closer'),
	midgroundFurther: document.getElementsByClassName('midground-further'),
	background: document.getElementsByClassName('background'),
	pinned: document.getElementsByClassName('pinned'),
	kidOne: document.getElementById('kid'),
	kidTwo: document.getElementById('boy'),
	kidRightLeg: document.getElementById('kidRightleg'),
	boyRightLeg: document.getElementById('boyRightleg'),
	boyLeftLeg: document.getElementById('boyLeftleg'),
	kidLeftLeg: document.getElementById('kidLeftleg'),
	rock: document.getElementById('rock'),
	rockOutline: document.getElementById('rockoutline'),
	graveOutline: document.getElementById('graveoutline'),
	textGrave: document.getElementById('textGrave'),
	favTree: document.getElementById('favtree'),
	favTreeActive: document.getElementById('favtreeActive'),
	text: document.getElementsByTagName('h1'),
	intro: document.getElementById('intro'),
	exit: document.getElementById('exit'),
	textSeven: document.getElementById('textSeven').getElementsByTagName('span')
}

function size(){
	var mainWidth = document.getElementById('mainWidth'),
		width = mainWidth.offsetHeight * 3.35;
	mainWidth.style.width = width + 'px';

	var kidOneHeight = shared.kidOne.offsetHeight/2.75;
	var kidTwoHeight = shared.kidTwo.offsetHeight/2.9;
	shared.kidOne.style.width = kidOneHeight + 'px'; 
	shared.kidTwo.style.width = kidTwoHeight + 'px'; 
	var grave = document.getElementById('grave').offsetWidth,
		graveOutline = document.getElementById('graveoutline');
	graveOutline.style.width = grave + 'px';
}
size();
//2000
//600
	
window.onresize = function() {
	shared.documentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	shared.speed = shared.documentHeight/5000,
	shared.speedRelative = shared.speed*50;
	size();
}

var actions = Object.assign(Object.create(shared), {
	movingElement: function movingElement(element, elementSpeed){
		for (var i=0; i<element.length; i++) {
			element[i].style.transform = 'translateX(' + elementSpeed + 'px)';
			element[i].style.webkitTransform = 'translateX(' + elementSpeed + 'px)';
		}
	},	
	walking: function walk(){
		if (this.step) {
			this.legRotation+= this.legRotationSpeed;
		}
		else {
			this.legRotation-= this.legRotationSpeed;
		}
					
		if (this.legRotation >= 50) {
			this.step = false;
		}
		if (this.legRotation <= 0) {
			this.step = true;
		}
				
		this.kidRightLeg.style.transform = 'rotate(' + this.legRotation + 'deg)';
		this.boyRightLeg.style.transform = 'rotate(' + this.legRotation + 'deg)';
		this.boyLeftLeg.style.transform = 'rotate(' + -this.legRotation + 'deg)';
		this.kidLeftLeg.style.transform = 'rotate(' + -this.legRotation + 'deg)';
		//webkit
		this.kidRightLeg.style.webkitTransform = 'rotate(' + this.legRotation + 'deg)';
		this.boyRightLeg.style.webkitTransform = 'rotate(' + this.legRotation + 'deg)';
		this.boyLeftLeg.style.webkitTransform = 'rotate(' + -this.legRotation + 'deg)';
		this.kidLeftLeg.style.webkitTransform = 'rotate(' + -this.legRotation + 'deg)';	
	},
	text: function text(){			
		function moveText(text, showPoint, endPoint){
			this.text = document.getElementById(text);
			this.distance = (endPoint - showPoint)*-1;
			this.duration = - this.left - (showPoint*-1);
			this.opacity = this.duration/this.distance;
			this.fade = function(){
				if (this.left <= showPoint && this.left >= endPoint) {
					this.text.style.opacity = this.opacity;
				}
			}
			this.translate = function(translateSpeed){
				if (this.left <= showPoint && this.left >= endPoint) {
					this.text.style.marginLeft = -this.opacity*translateSpeed + 'px';
				}
			}
		}
		
		moveText.prototype = Object.create(shared);
		var textOne = new moveText('textOne', -this.speedRelative*2, -this.speedRelative*17);
		textOne.fade();
		var textTwo = new moveText('textTwo', -this.speedRelative*25, -this.speedRelative*50);
		textTwo.fade();
		textTwo.translate(this.speedRelative*6);
		var textThree = new moveText('textThree', -this.speedRelative*80, -this.speedRelative*100);
		textThree.fade();
		var textFour = new moveText('textFour', -this.speedRelative*200, -this.speedRelative*400);
		textFour.translate(this.speedRelative*45);
		var textSix = new moveText('textSix', -this.speedRelative*640, -this.speedRelative*740);
		textSix.fade();
		
		for (var i=0;i<this.textSeven.length;i++){
			var mark;
			if (i==0) {mark = 740};
			if (i==1) {mark = 780};
			if (i==2) {mark = 820};
			if (i==3) {mark = 860};
			if (this.left < -this.speedRelative*mark) {
				this.textSeven[i].style.opacity = '1';
			}
			else {
				this.textSeven[i].style.opacity = '0';
			}
		}
	},
	update: function(){
		this.movingElement(this.foregroundMost, this.left*1.4);
		this.movingElement(this.foreground, this.left);
		this.movingElement(this.midgroundCloser, this.left/2.5);
		this.movingElement(this.midgroundFurther, this.left/3);
		this.movingElement(this.background, this.left/9);
		this.walking();
		this.text();
	},
	lookRight: function(){
		this.kidOne.style.transform = 'scaleX(1)';
		this.kidTwo.style.transform = 'scaleX(1)';
		this.kidOne.style.webkitTransform = 'scaleX(1)';
		this.kidTwo.style.webkitTransform = 'scaleX(1)';	
	},
	lookLeft: function(){
		this.kidOne.style.transform = 'scaleX(-1)';
		this.kidTwo.style.transform = 'scaleX(-1)';
		this.kidOne.style.webkitTransform = 'scaleX(-1)';
		this.kidTwo.style.webkitTransform = 'scaleX(-1)';
	},
	run: function(){
		shared.speed = this.documentHeight/1500,
		shared.speedRelative = this.speed*15;
		shared.legRotationSpeed = 6;
	},
	stopRunning: function(){
		shared.speed = this.documentHeight/5000,
		shared.speedRelative = this.speed*50;
		shared.legRotationSpeed = 3;
	}
});

var interactivity = Object.assign(Object.create(shared),{
	music: function(){
		var music = new Audio('music.mp3');
		music.play();
		this.audioIcon.style.opacity = 0.8;
		
		this.audioIcon.onclick = function(){
			if(this.style.opacity == 0.8) {
				music.pause();
				this.style.opacity = 0.5;
			}
			else {
				music.play();
				this.style.opacity = 0.8;
			}
		}
	},
	grave: function(){
		this.graveOutline.onmouseover = function(){
			shared.textGrave.style.opacity = '1';
		}
	
		this.graveOutline.onmouseout = function(){
			shared.textGrave.style.opacity = '0';
		}
	},
	zoomText: function(){
		document.addEventListener('keydown', function(e){
			e.preventDefault;
			var code = e.which || e.keyCode;
			if (code == 32) {
				for(var i=0; i<shared.text.length; i++){
					shared.text[i].classList.add('pushToFront');

				}
			}	
		});
		document.addEventListener('keyup', function(e){
			e.preventDefault;
			var code = e.which || e.keyCode;
			if (code == 32) {
				for(var i=0; i<shared.text.length; i++){
					shared.text[i].classList.remove('pushToFront');
				}
			}	
		});
	},
	favTree: function(){	
		this.favTreeActive.onmouseover = function(){
			shared.favTree.style.opacity = 1;
		}

		this.favTreeActive.onmouseout = function(){
			shared.favTree.style.opacity = 0;
		}	
	},
	credits: function(){
		this.rockOutline.onclick = function(){
			shared.intro.style.display = 'block';
			shared.kidOne.style.left = 24 + '%';
			shared.kidRightLeg.style.transform = 'rotate(-40deg)';
			shared.kidLeftLeg.style.transform = 'rotate(-40deg)';
			shared.kidRightLeg.style.webkitTransform = 'rotate(-40deg)';
			shared.kidLeftLeg.style.webkitTransform = 'rotate(-40deg)';
			shared.kidTwo.style.left = 22 + '%';
			shared.kidTwo.style.bottom = 16 + '%';
			shared.boyRightLeg.style.transform = 'rotate(-40deg)';
			shared.boyLeftLeg.style.transform = 'rotate(-40deg)';
			shared.boyRightLeg.style.webkitTransform = 'rotate(-40deg)';
			shared.boyLeftLeg.style.webkitTransform = 'rotate(-40deg)';

			for(var i=0; i<shared.textSeven.length; i++){
				shared.textSeven[i].style.opacity = 0;
			}

			shared.allow = false;
		}

		this.exit.onclick = function(){
			intro.style.display = 'none';
			shared.kidOne.style.left = 10 + '%';
			shared.kidRightLeg.style.transform = 'rotate(0deg)';
			shared.kidLeftLeg.style.transform = 'rotate(0deg)';
			shared.kidRightLeg.style.webkitTransform = 'rotate(0deg)';
			shared.kidLeftLeg.style.webkitTransform = 'rotate(0deg)';
			shared.kidTwo.style.left = 7 + '%';
			shared.kidTwo.style.bottom = 13 + '%';
			shared.boyRightLeg.style.transform = 'rotate(0deg)';
			shared.boyLeftLeg.style.transform = 'rotate(0deg)';
			shared.boyRightLeg.style.webkitTransform = 'rotate(0deg)';
			shared.boyLeftLeg.style.webkitTransform = 'rotate(0deg)';

			for(var i=0; i<shared.textSeven.length; i++){
				shared.textSeven[i].style.opacity = 1;
			}

			shared.allow = true;
		}
	}
	
});
interactivity.music();
interactivity.grave();
interactivity.zoomText();
interactivity.favTree();
interactivity.credits();

window.addEventListener('keydown',function(e){
	shared.keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
	shared.keyState[e.keyCode || e.which] = false;
},true);

function touchScreen(){
	document.addEventListener('touchstart', handleTouchStart, false); 
	document.addEventListener('touchmove', handleTouchMove, false);
	document.addEventListener('touchend', handleTouchEnd, false);
	var xDown = null;                                     
	var yDown = null;                                               
	function handleTouchStart(evt) {                     
		xDown = evt.touches[0].clientX;                             
		yDown = evt.touches[0].clientY;              
	};                                                
	function handleTouchMove(evt) {
		if ( ! xDown || ! yDown ) {
			return;
		}
			
		var xUp = evt.touches[0].clientX;                                    
		var yUp = evt.touches[0].clientY;
		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;
			
		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
			if ( xDiff > 0 ) {
				shared.touchState['swipingRight'] = true;
			} else {		
				shared.touchState['swipingLeft'] = true;
			}                       
		}
		/* reset values */
		xDown = null;
		yDown = null;                                             
	};
	function handleTouchEnd(evt){
		shared.touchState['swipingRight'] = false;
		shared.touchState['swipingLeft'] = false;
	}
}
touchScreen();
	
function gameLoop() {
	if(shared.allow){
		var currentTime = Date.now();
		var delta = currentTime - shared.lastTime;
		shared.lastTime = currentTime;
		
		//shift
		if (shared.keyState[16]){
			actions.run();
		}
		if (!shared.keyState[16]){
			actions.stopRunning();
		}
		//right arrow && right touch
		if ((shared.keyState[39] || shared.touchState.swipingRight) && shared.left > -shared.speedRelative*900) {	
			shared.left -= shared.speed * delta;
			actions.update();
			actions.lookRight();
		}
		//left arrow && left touch
		if ((shared.keyState[37] || shared.touchState.swipingLeft) && shared.left < 0){
			shared.left += shared.speed * delta;
			actions.update();
			actions.lookLeft();
		}
	}

	setTimeout(gameLoop, shared.fps);
}						  
gameLoop();
