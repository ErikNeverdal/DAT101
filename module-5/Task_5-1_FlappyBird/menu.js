"use strict";
import { TSprite, TSpriteButton, TSpriteNumber} from "libSprite";
import { startGame, EGameStatus, hero, obstacles, baits } from "./FlappyBird.mjs";
import { TSoundFile } from "libSound";

const fnCountDown = "./Media/countDown.mp3";
const fnRunning = "./Media/running.mp3";

export class TMenu {
  #spGameOver;
  #spMedal;
  #spFinalScore;
  #spHighScore;
  #highScores;
  #spTitle;
  #spPlayBtn;
  #spCountDown;
  #sfCountDown;
  #sfRunning;
  #spGameScore;
  #spInfoText;
  #spInfoTextOver;
  constructor(aSpcvs, aSPI){
    this.#spTitle = new TSprite(aSpcvs, aSPI.flappyBird, 200, 100);
    this.#spPlayBtn = new TSpriteButton(aSpcvs, aSPI.buttonPlay, 240, 180);
    this.#spPlayBtn.addEventListener("click", this.spPlayBtnClick.bind(this));
    this.#spCountDown = new TSpriteNumber(aSpcvs, aSPI.numberBig, 280, 190);
    this.#spCountDown.visible = false;
    this.#sfCountDown = null;
    this.#sfRunning = null;
    this.#spGameScore = new TSpriteNumber(aSpcvs, aSPI.numberSmall, 10, 10);
    this.#spGameScore.alpha = 0.5;
    this.#spInfoText = new TSprite(aSpcvs, aSPI.infoText, 190, 120);
    this.#spInfoText.index = 0; // Get Ready
    this.#spInfoText.hidden = true;
    this.#spGameOver = new TSprite(aSpcvs, aSPI.gameOver, 175, 90);    
    this.#spGameOver.hidden = true;

    this.#spMedal = new TSprite(aSpcvs, aSPI.medal, 200, 133);
    this.#spMedal.hidden = true;

    this.#spFinalScore = new TSpriteNumber(aSpcvs, aSPI.numberSmall, 355, 123);
    this.#spFinalScore.visible = false;
    this.#spHighScore  = new TSpriteNumber(aSpcvs, aSPI.numberSmall, 355, 166);
    this.#spHighScore.visible = false;

    this.#highScores = [0];
  }

  incGameScore(aScore){
    this.#spGameScore.value += aScore;
  }

  stopSound(){
    this.#sfRunning.stop();
  }

 draw(){
  this.#spTitle.draw();
  this.#spInfoText.draw();
  this.#spCountDown.draw();
  this.#spGameScore.draw();

  this.#spGameOver.draw();
  this.#spMedal.draw();
  this.#spFinalScore.draw();
  this.#spHighScore.draw();

  this.#spPlayBtn.draw();
}

  countDown(){
  this.#spCountDown.value--;

  if(this.#spCountDown.value > 0){
    setTimeout(this.countDown.bind(this), 1000);  
  }else{
    this.#spCountDown.visible = false;
    this.#spInfoText.hidden = true;

    this.#sfRunning = new TSoundFile(fnRunning);
    this.#sfRunning.play();

    startGame();
  }
  }

  spPlayBtnClick() {

  // Hvis vi er game over -> tilbake til startmeny
  if (EGameStatus.state === EGameStatus.gameOver) {

    hero.restart();

    obstacles.length = 0;
    baits.length = 0;

    this.#spGameOver.hidden = true;
    this.#spMedal.hidden = true;
    this.#spFinalScore.visible = false;
    this.#spHighScore.visible = false;
    this.#spInfoText.hidden = true;

    this.#spTitle.hidden = false;
    this.#spPlayBtn.hidden = false;

    this.#spGameScore.value = 0;
    this.#spGameScore.hidden = true;

    EGameStatus.state = EGameStatus.idle;

    return;
  }

  hero.restart();

  obstacles.length = 0;
  baits.length = 0;

  this.#spGameScore.value = 0;
  this.#spGameScore.hidden = false;

  this.#spTitle.hidden = true;
  this.#spPlayBtn.hidden = true;

  this.#spInfoText.hidden = false;

  this.#spCountDown.visible = true;
  this.#spCountDown.value = 3;

  EGameStatus.state = EGameStatus.countDown;

  this.#sfCountDown = new TSoundFile(fnCountDown);
  this.#sfCountDown.play();

  setTimeout(this.countDown.bind(this), 1000);
}
  

  setSoundMute(aIsMuted) {

  if (aIsMuted) {
    console.log("Is muted:", aIsMuted);
      console.log("pause");
      this.#sfRunning.pause();
  } else {
    if (this.#sfRunning && EGameStatus.state === EGameStatus.gaming) { 
      console.log("play");
      this.#sfRunning.play();
    }
  }
  }

  showGameOver(){

  EGameStatus.state = EGameStatus.gameOver;

  if(this.#sfRunning){
    this.#sfRunning.stop();
  }

  this.#spInfoText.hidden = true;
  this.#spGameScore.hidden = true;

  this.#spGameOver.hidden = false;
  this.#spPlayBtn.hidden = false;

  const score = this.#spGameScore.value;
  this.#spFinalScore.value = score;
  this.#spFinalScore.visible = true;

  if(score > this.#highScores[0]){
    this.#highScores[0] = score;
  }

  this.#spHighScore.value = this.#highScores[0];
  this.#spHighScore.visible = true;

if(score >= 7){
    this.#spMedal.index = 2; // gull
    this.#spMedal.hidden = false;
}
else if(score >= 4){
    this.#spMedal.index = 1; // sølv
    this.#spMedal.hidden = false;
}
else if(score >= 2){
    this.#spMedal.index = 3; // bronse
    this.#spMedal.hidden = false;
}
else if(score >= 0){
    this.#spMedal.index = 0; // hvit 
    this.#spMedal.hidden = false;
}
}
}