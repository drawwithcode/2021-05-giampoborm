let clientSocket = io();

clientSocket.on("connect", newConnection)
clientSocket.on("mouseBroadcast", newBroadcast);

function newConnection(){
  console.log(clientSocket.id);
}

const urlString = window.location.href;
let url = new URL(urlString);
console.log(urlString);

let myButton;
let myButton1;

let lines = [];

let penColor;
let penThickness;

let myImage;
let sfondo;

function preload() {
  myImage = loadImage("./assets/chad.png");
  sfondo = loadImage("./assets/sfondo.jpg")
}


//running newConnection function when a new connection is made
clientSocket.on("connect", newConnection);

//defining the newConnection function
function newConnection() {
  //printing the connections' ids
 console.log(clientSocket.id);
}

//running newBroadcast function when receiving "mouse" message
clientSocket.on("mouseBroadcast", newBroadcast);

//defining newBroadcast function
function newBroadcast(data) {
  console.log(data);
  drawLine(
    data.px * width,
    data.py * height,
    data.x * width,
    data.y * height,
    data.color,
    data.thickness
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(sfondo);

  let container =  createDiv().style("position: absolute").position(width-100, height-100);
  myButton1 = createElement("button", "previous").parent(container);
  myButton1.mouseClicked(function () {
    window.open("https://collab-meme-generator.herokuapp.com/second-page.html", "_self");
  });
  myButton = createElement("button", "next meme").parent(container);
  myButton.mouseClicked(function () {
    window.open("https://collab-meme-generator.herokuapp.com/fourth.html", "_self");
  });
  
  imageMode(CENTER)
  image(myImage, width/2, height/2, myImage.width/2, myImage.height/2);

  let options = createDiv().style("position: absolute").position(10, height-100).style("z-index:1");
  penColor = createColorPicker("#000000").parent(options);
  penThickness = createSelect(false)
    .parent(options)
  penThickness.option("1");
  penThickness.option("3");
  penThickness.option("5");
  penThickness.option("7");
  penThickness.selected("1");
}

function draw() {}

//sending to the server every mouse position
function mouseDragged() {
  //type of message to send
  let message = {
    x: mouseX / width,
    y: mouseY / height,
    px: pmouseX / width,
    py: pmouseY / height,
    color: penColor.value(),
    thickness: penThickness.value(),
  };

  //sending the message, from client to server
  clientSocket.emit("mouse", message);
  drawLine(
    pmouseX,
    pmouseY,
    mouseX,
    mouseY,
    penColor.value(),
    penThickness.value()
  );
}

function drawLine(px, py, x, y, color, thickness) {
  stroke(color);
  strokeWeight(thickness);
  line(px, py, x, y);
}