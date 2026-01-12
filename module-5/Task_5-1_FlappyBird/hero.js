"use strict"
import { TSprite } from "libSprite";

export class THero{
    #spriteHero1;

    constructor(aSpcvs, aSPI){
        this.#spriteHero1 = new TSprite(aSpcvs, aSPI.hero1, 100, 100);
    }

    draw(){
        this.#spriteHero1.draw();
    }
}