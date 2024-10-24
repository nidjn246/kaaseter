let startgame = false;
let bground;
let nameanimal;
let textcolor = 0;
let size = 15;

let hunger = 100;
let energy = 100;
let health = 100;
let happiness = 100;
let larryState;
let stats = 0;

let resetbar = 0;
let resetTimer = 0;
let buttonTimer = 0;

let fur = 0;
let menuOpen = false;
let isSleeping = false;
let daytimer = 0;
let night = false;

let ballX;
let ballY;
let startX = 250;
let startY = 160;

// all of the states larry can output
let states = {
  idle: 0,
  low_health: 1,
  lower_health: 2,
  death: 3,
  littlecry: 4,
  hardcry: 5,
  littletired: 6,
  tired: 7,
  hungry: 8,
  starving: 9,
  sleeping: 10
}


function setup() {
  createCanvas(700, 450);
  //create all the buttons 
  createButtons()
  //load all the data from the local storage to the game
  loadData()
}

//load the day/night background image
function preload() {
  bgroundnight = loadImage("/../Images/backgroundnight.jpg")
  bgroundday = loadImage("/../Images/background.jpg")
}

function draw() {

  //if the time of the day is higher then 60 make it night
  if (daytimer > 0 && daytimer < 60) {
    background(bgroundday)
    textcolor = 0
    night = false
  }

  else {
    background(bgroundnight)
    night = true
    textcolor = 255
  }

  //when the time = 100 set it back to 0
  if (daytimer > 100) {
    daytimer = 0
  }

  //save the game every frame
  saveData()

  //make the reset button work
  reset()

  //set a 'border' between 0 and 100 so that the meters cant go over it
  happiness = constrain(happiness, 0, 100)

  hunger = constrain(hunger, 0, 100)

  health = constrain(health, 0, 100)

  energy = constrain(energy, 0, 100)

  //draw all the bars
  drawBars()

  //make the name larry show up and the reset text
  textSize(30)
  fill(textcolor)
  textFont("comic sans ms")
  text("Larry", 310, 140)

  textSize(15)
  text("Hold Esc to reset Larry", 10, 30)

  //check what state larry is in
  checkState()

  //draw larry every frame
  drawAnimal()

  //make the menu background when you click the menu button
  if (menuOpen == true) {
    fill(255)
    rect(301, 10, 350, 80)

    blackColor.show()
    greenColor.show()
    redColor.show()
  }

  //else hide the menu options
  else {
    blackColor.hide()
    greenColor.hide()
    redColor.hide()
  }

  //make the time of the day go up
  daytimer = daytimer + deltaTime / 1000

  //when larry isnt sleeping give him hunger
  if (hunger > 0 && isSleeping == false) {
    hunger = hunger - deltaTime / 3000
  }

  //when larry isnt sleeping make him tired
  if (energy > 0 && night == false && isSleeping == false) {
    energy = energy - deltaTime / 3100
  }

  //when larry isnt sleeping and it is night make him tired faster
  else if (night == true && isSleeping == false) {
    energy = energy - deltaTime / 1500
  }

  //when larry his hunger is 0 make him sick
  if (hunger < 1 && isSleeping == false) {
    health = health - deltaTime / 4000
  }

  //make larry less happy over time
  if (happiness > 0 && isSleeping == false) {
    happiness = happiness - deltaTime / 5000
  }

  //when larry is sleeping give him hunger. and more energy and health
  if (isSleeping == true) {
    hunger = hunger - deltaTime / 900
    energy = energy + deltaTime / 500
    health = health + deltaTime / 1000
  }
}

//reset all the buttons when they were hidden
function resetButtons() {
  foodButton.position(100, 370)

  HealthButton.position(550, 370)

  foodButton.show()
  playButton.show()
  sleepButton.show()
  HealthButton.show()

  startX = 250
  startY = 160

  size = 15

  sleepButton.position(400, 380)
  sleepButton.size(80, 50)
  stopsleep.hide()
  isSleeping = false

  stopPlay.hide()
  ballButton.hide()

}

//when the function is called save all the stats of the game
function saveData() {
  stats = []
  stats.push(

    hunger,
    energy,
    health,
    happiness,
    fur,
    daytimer

  )
  storeItem('hungerstat', stats[0])

  storeItem('energystat', stats[1])

  storeItem('healthstat', stats[2])

  storeItem('happinessstat', stats[3])

  storeItem('colorfur', stats[4])

  storeItem("time", stats[5])
}

//when the game starts load the data that was stored
function loadData() {
  hunger = getItem("hungerstat") || 100

  energy = getItem("energystat") || 100

  health = getItem("healthstat") || 100

  happiness = getItem("happinessstat") || 100

  fur = getItem("colorfur") || 0

  daytimer = getItem("time") || 0
}

//create all the buttons needed to play the game
function createButtons() {
  foodButton = createImg("/../Images/burger.png")
  foodButton.size(70, 70)
  foodButton.position(100, 370)
  foodButton.mouseClicked(giveFood)

  playButton = createImg("/../Images/play.png")
  playButton.position(250, 370)
  playButton.size(80, 70)
  playButton.mouseClicked(play)

  sleepButton = createImg("/../Images/bed.png")
  sleepButton.position(400, 380)
  sleepButton.size(80, 50)
  sleepButton.mouseClicked(sleep)

  HealthButton = createImg("/../Images/soap.png")
  HealthButton.size(80, 80)
  HealthButton.position(550, 370)
  HealthButton.mouseClicked(heal)

  menu = createImg("/../Images/hamburgermenu.png")
  menu.position(650, 10)
  menu.size(40, 40)
  menu.mouseClicked(menuBar)

  blackColor = createImg("/../Images/black.jpeg")
  blackColor.size(70, 70)
  blackColor.position(320, 15)
  blackColor.mouseClicked(giveBlackFur)

  greenColor = createImg("/../Images/green.png")
  greenColor.size(70, 70)
  greenColor.position(440, 15)
  greenColor.mouseClicked(giveGreenFur)

  redColor = createImg("/../Images/red.jpg")
  redColor.size(70, 70)
  redColor.position(560, 15)
  redColor.mouseClicked(giveRedFur)

  stopsleep = createImg("/../Images/nobed.png")
  stopsleep.position(600, 350)
  stopsleep.size(80, 80)
  stopsleep.mouseClicked(resetButtons)
  stopsleep.hide()

  stopPlay = createImg("/../Images/noplay.png")
  stopPlay.position(600, 350)
  stopPlay.size(80, 80)
  stopPlay.mouseClicked(resetButtons)
  stopPlay.hide()

  ballButton = createImg("/../Images/bal.png")
  ballButton.size(40, 40)
  ballButton.position(ballX, ballY)
  ballButton.mouseClicked(clickedBall)
  ballButton.hide()

}

//when you click on the ball in the minigame give it a random location
function clickedBall() {
  ballX = round(random(0, 660))

  ballY = round(random(0, 410))

  ballButton.position(ballX, ballY)

  energy -= 10
  happiness += 20
}

//give larry black fur
function giveBlackFur() {
  fur = [0]
}

//give larry green fur
function giveGreenFur() {
  fur = [4, 130, 4]
}

//give larry red fur
function giveRedFur() {
  fur = "red"
}

//when the menu button is clicked set menuOpen to true
function menuBar() {
  menuOpen = !menuOpen
}

//when the foodbutton is clicked give him food and place the icon by his mouth
function giveFood() {
  hunger += 30;
  if (hunger > 100) {
    health -= 10
  }

  energy += 10;
  happiness += 5;

  foodButton.position(310, 240)

  playButton.hide()
  sleepButton.hide()
  HealthButton.hide()

  //over 1 second reset the buttons
  setTimeout(resetButtons, 1000)
}

//when you click the sleep button set issleeping to true and give energy
function sleep() {

  isSleeping = true

  size = 5

  startX = 300
  startY = 270

  foodButton.hide()
  playButton.hide()
  HealthButton.hide()
  stopsleep.show()

  sleepButton.size(150, 100)
  sleepButton.position(270, 300)
}

//when you click play start the minigame and give the ball a random loction
function play() {

  ballX = round(random(0, 700))
  ballY = round(random(0, 450))
  ballButton.position(ballX, ballY)

  foodButton.hide()
  ballButton.show()
  playButton.hide()
  sleepButton.hide()
  HealthButton.hide()
  stopPlay.show()
}

//when you clean larry give him health
function heal() {
  health += 20;

  foodButton.hide()
  playButton.hide()
  sleepButton.hide()
  HealthButton.position(325, 260)
  setTimeout(resetButtons, 1000)
}

//check every frame if larry needs to show emotions
function checkState() {

  if (isSleeping == true) {
    larryState = states.sleeping
  }

  else if (health < 50 && health > 25) {
    larryState = states.low_health
  }

  else if (health < 25 && health > 1) {
    larryState = states.lower_health
  }

  else if (health < 1) {
    larryState = states.death
  }

  else if (hunger > 25 && hunger < 50) {
    larryState = states.hungry
  }

  else if (hunger < 25) {
    larryState = states.starving
  }

  else if (happiness < 50 && happiness > 25) {
    larryState = states.littlecry
  }

  else if (happiness < 25) {
    larryState = states.hardcry
  }

  else if (energy < 50 && energy > 25) {
    larryState = states.littletired
  }

  else if (energy < 25) {
    larryState = states.tired
  }

  else {
    larryState = states.idle
  }
}

//draw the 4 bars and the reset bar
function drawBars() {
  textSize(13)
  //hunger
  strokeWeight(1)
  fill("green")
  rect(450, 100, 10, 100)
  fill(255)
  rect(450, 100, 10, 100 - hunger)
  fill(textcolor)
  text("Food", 440, 210)

  //energy
  strokeWeight(1)
  fill("yellow")
  rect(510, 100, 10, 100)
  fill(255)
  rect(510, 100, 10, 100 - energy)
  fill(textcolor)
  text("Energy", 495, 210)

  //Health
  strokeWeight(1)
  fill("red")
  rect(570, 100, 10, 100)
  fill(255)
  rect(570, 100, 10, 100 - health)
  fill(textcolor)
  text("Health", 555, 210)

  //Happiness
  strokeWeight(1)
  fill("orange")
  rect(630, 100, 10, 100)
  fill(255)
  rect(630, 100, 10, 100 - happiness)
  fill(textcolor)
  text("happiness", 610, 210)

  //resetbar
  if (keyIsDown(ESCAPE)) {
    fill(255)
    rect(10, 40, 160, 15)
    fill("red")
    rect(10, 40, resetbar, 15)
  }
}

//draw larry
function drawAnimal() {

  //the array where larry his frames are stored
  let animal =
    [
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 3, 3, 3, 1, 1, 2, 0],
        [0, 0, 0, 2, 1, 1, 3, 1, 1, 2, 0, 0],
        [0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 2, 0],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],
      ],
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 3, 3, 3, 1, 1, 2, 0],
        [0, 0, 0, 2, 1, 6, 3, 6, 1, 2, 0, 0],
        [0, 0, 2, 2, 1, 6, 1, 1, 1, 2, 2, 0],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],
      ],
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 4, 1, 2, 1, 4, 1, 2, 0],
        [0, 0, 2, 1, 4, 3, 3, 3, 4, 1, 2, 0],
        [0, 0, 0, 2, 1, 1, 3, 1, 1, 2, 0, 0],
        [0, 0, 2, 2, 4, 1, 1, 1, 4, 2, 2, 0],
        [0, 2, 2, 2, 1, 4, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 2, 1, 1, 1, 1, 4, 2, 2, 2],
        [0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],
      ],
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 4, 2, 2, 2, 2, 2, 4, 0, 0],
        [0, 0, 4, 2, 3, 2, 2, 2, 3, 2, 4, 0],
        [0, 4, 4, 3, 3, 3, 2, 3, 3, 3, 4, 0],
      ],
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 5, 1, 2, 1, 5, 1, 2, 0],
        [0, 0, 2, 1, 1, 3, 3, 3, 1, 1, 2, 0],
        [0, 0, 0, 2, 1, 1, 3, 1, 1, 2, 0, 0],
        [0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 2, 0],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],
      ],
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 5, 1, 2, 1, 5, 1, 2, 0],
        [0, 0, 2, 1, 5, 3, 3, 3, 5, 1, 2, 0],
        [0, 0, 0, 2, 5, 1, 3, 1, 5, 2, 0, 0],
        [0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 2, 0],
        [0, 2, 2, 2, 5, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 2, 1, 1, 1, 1, 5, 2, 2, 2],
        [0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [0, 0, 0, 3, 5, 3, 0, 3, 5, 3, 0, 0],
      ],
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 3, 3, 3, 1, 1, 2, 0],
        [0, 0, 0, 2, 1, 1, 3, 1, 1, 2, 0, 0],
        [0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 2, 0],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],
      ],
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 7, 7, 1, 2, 1, 7, 7, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 3, 3, 3, 1, 1, 2, 0],
        [0, 0, 0, 2, 1, 1, 3, 1, 1, 2, 0, 0],
        [0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 2, 0],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],
      ],
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 3, 3, 3, 1, 1, 2, 0],
        [0, 0, 0, 2, 2, 1, 3, 1, 2, 2, 0, 0],
        [0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 1, 2, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],
        [0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],
      ],
      [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 7, 1, 2, 1, 7, 1, 2, 0],
        [0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
        [0, 0, 2, 1, 1, 3, 3, 3, 1, 1, 2, 0],
        [0, 0, 0, 2, 2, 1, 3, 1, 2, 2, 0, 0],
        [0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
        [0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],
      ],
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0],
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 3],
        [2, 1, 7, 7, 1, 1, 1, 1, 1, 1, 1, 3],
        [2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3],
        [2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 0],
        [2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3],
        [2, 1, 7, 7, 1, 1, 1, 1, 1, 1, 1, 3],
        [2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 3],
        [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]
    ]

  //the colorpallet that larry uses
  let colorpallet = [
    color(0, 0, 0, 0),
    color(255),
    color(fur),
    color(250, 128, 11),
    color(255, 0, 0),
    color(0, 100, 255),
    color(0, 180, 0),
    color(0)
  ];

  //call drawimage
  drawImage(startX, startY, animal[larryState], colorpallet);
}

//draw larry with the parameters given
function drawImage(startX, startY, image, palette) {
  strokeWeight(0)
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      fill(palette[image[y][x]])
      square(startX + (x * size), startY + (y * size), size)
    }
  }
}

//when you hold escaoe start the reset timer
function reset() {

  if (keyIsDown(ESCAPE)) {
    resetTimer = resetTimer + deltaTime / 1000

    resetbar++
  }

  else {
    resetTimer = 0
    resetbar = 0
  }

  //if the bar is at the end reset everything about larry
  if (resetbar == 160) {
    resetbar = 0
    hunger = 100
    energy = 100
    health = 100
    happiness = 100
    fur = 0
    daytimer = 0
  }
}




