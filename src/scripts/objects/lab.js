import RVObject from './RVObject'
import {S} from '../const'

export default class lab extends RVObject {
 constructor(obj){
    super(obj)
    this.graphics = new PIXI.Graphics()
    this.g.addChild(this.graphics)
    this.graphics.position.set(S(10),S(10))
    this.graphics.pivot.set(S(5),S(5))
  }
  update(dobj, room) {
    let obj = super.update(dobj, room)
    let g = this.graphics
    g.lineStyle(0, 0, 0);
    g.beginFill(0xffffff);
    console.log(obj)
    let e = (S(4) - 2) * Math.sqrt(obj.mineralAmount / obj.mineralCapacity);
    if (e > 0) e = Math.max(1, e);
    g.drawCircle(S(5), S(5), e);
    g.endFill();
    g.beginFill(0xffff00)
    let w = S(8) * (obj.energy / obj.energyCapacity)
    g.drawRect(S(5) - (w/2),S(9),w,S(1))
    g.endFill()
  }
}
