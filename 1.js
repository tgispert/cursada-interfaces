const W_KEY = 119;
const A_KEY = 97;
const S_KEY = 115;
const D_KEY = 100;
const RUNNING = "running";
const PAUSED = "paused";
var pace = 10;
var ratio = 1;
var puntos = 0;
var enemigo = 1000;
var capa1 = document.getElementById("capa1");
var capa2 = document.getElementById("capa2");
var capa3 = document.getElementById("capa3");
var personaje = document.getElementById("personaje");

function estadoPaisaje(e){
  capa1.style.animationPlayState = e;
  capa2.style.animationPlayState = e;
  capa3.style.animationPlayState = e;
  if(e == RUNNING){
    pace = 15*ratio;
  }
  else {
    pace = 10*ratio;
  }
}

function walk(){
  personaje.style.animation = "walk 0.7s steps(9, end) infinite";
}

function jump(){
  personaje.style.animation = "jump 0.7s steps(10, end)";
}

function idle(){
  personaje.style.animation = "idle 3s steps(10, end) infinite";
}

function headbutt(){
  personaje.style.animation = "headbutt 0.7s steps(9, end)";
}

document.onkeypress = function(e){
  e = e || window.event;
  switch(e.keyCode) {
    case W_KEY:
      jump();
      estadoPaisaje(RUNNING);
      window.setTimeout(walk,700);
      break;
    case A_KEY:
      headbutt();
      estadoPaisaje(RUNNING);
      window.setTimeout(walk,700);
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
  }
}

function avanzarEnemigos() {
  var aux = document.getElementsByClassName("enemigo");
  for (var i = 0; i < aux.length; i++) {
     enemigo = enemigo - pace;
     aux[i].style.left = enemigo +"px";
  }
  puntos = setTimeout(avanzarEnemigos, 40);
}

function playGame(){
  avanzarEnemigos();
}

window.onload = playGame;
