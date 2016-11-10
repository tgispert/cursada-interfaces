const W_KEY = 119;
const A_KEY = 97;
const S_KEY = 115;
const D_KEY = 100;
const RUNNING = "running";
const PAUSED = "paused";
var pace;
var ratio;
var puntos;
var puntaje;
var enemigo;
var capa1;
var capa2;
var capa3;
var personaje;
var pj;

function inicializarVariables(){
  pace = 10;
  ratio = 0;
  puntos = 0;
  puntaje = document.getElementById("puntaje");
  puntaje.innerHTML = puntos;
  enemigo = 1000;
  capa1 = document.getElementById("capa1");
  capa2 = document.getElementById("capa2");
  capa3 = document.getElementById("capa3");
  personaje = document.getElementById("personaje");
  pj = new Character(100,570);
  playGame();
}

function Character(posX,posY){
  this.posX = posX;
  this.posY = posY;
  this.enAccion = false;
}

function estadoPaisaje(e){
  capa1.style.animationPlayState = e;
  capa2.style.animationPlayState = e;
  capa3.style.animationPlayState = e;
}

function personajeOcioso(){
  pj.enAccion = false;
  walk();
}

function walk(){
  personaje.style.animation = "walk 0.7s steps(9, end) infinite";
}

function jump(){
  pj.enAccion = true;
  personaje.style.animation = "jump 0.7s steps(10, end)";
}

function idle(){
  personaje.style.animation = "idle 3s steps(10, end) infinite";
}

function headbutt(){
  pj.enAccion = true;
  personaje.style.animation = "headbutt 0.7s steps(9, end)";
}

document.onkeypress = function(e){
  e = e || window.event;
  if(pj.enAccion == false){
  switch(e.keyCode) {
    case W_KEY:
      jump();
      estadoPaisaje(RUNNING);
      window.setTimeout(personajeOcioso,700);
      break;
    case A_KEY:
      headbutt();
      estadoPaisaje(RUNNING);
      window.setTimeout(personajeOcioso,700);
      break;
    case S_KEY:
      idle();
      estadoPaisaje(PAUSED);
      break;
    case D_KEY:
      walk();
      estadoPaisaje(RUNNING);
      break;
    default:
      idle();
  }}
}

function avanzarEnemigos() {
  if((puntos%300)==0){
    ratio=ratio+1;
  }
  var aux = document.getElementsByClassName("enemigo");
  for (var i = 0; i < aux.length; i++) {
     enemigo = enemigo - (pace*ratio);
     aux[i].style.left = enemigo +"px";
  }
  puntos = setTimeout(avanzarEnemigos, 40);
  puntaje.innerHTML = puntos;
}

function playGame(){
  avanzarEnemigos();
}

window.onload = inicializarVariables;
