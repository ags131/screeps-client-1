import RVObject from './RVObject'
import {S} from '../const'

let minerals = ["H","O","U","L","K","Z","X","G","OH","ZK","UL","UH","UO","KH","KO","LH","LO","ZH","ZO","GH","GO","UH2O","UHO2","KH2O","KHO2","LH2O","LHO2","ZH2O","ZHO2","GH2O","GHO2","XUH2O","XUHO2","XKH2O","XKHO2","XLH2O","XLHO2","XZH2O","XZHO2","XGH2O","XGHO2"]


export default class terminal extends RVObject {
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
    let w = S(9)
    let ta = Math.pow(w,2)
    let mt = minerals.reduce((l, v) => l + (obj[v] || 0), 0)
    let ea = obj.energy / obj.energyCapacity
    let ma = mt / obj.energyCapacity
    let pa = (obj.power || 0) / obj.energyCapacity
    console.log(ea,ma,pa,obj)
    if(pa > 0) {
      let a = Math.sqrt(ta * (pa + ma + ea))
      g.beginFill(0xff0000)
      g.drawRect(S(5) - (a / 2),S(5) - (a / 2), a,a)
      g.endFill()
    }
    if(ma > 0) {
      let a = Math.sqrt(ta * (ma + ea))
      g.beginFill(0xffffff)
      g.drawRect(S(5) - (a / 2),S(5) - (a / 2), a,a)
      g.endFill()
    }
    if(ea > 0) {
      let a = Math.sqrt(ta * ea)
      g.beginFill(0xffff00)
      g.drawRect(S(5) - (a / 2),S(5) - (a / 2), a,a)
      g.endFill()
    }
  }
}
