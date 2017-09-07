import GameObject from './gameObject';
import {S} from '../const';
import RoomVisual from './RoomVisual.js'

export default class RVObject extends GameObject {
  constructor(obj) {
    super(obj);
    this.g = new PIXI.Sprite();
  }

  update(dobj, room) {
    let obj = super.update(dobj, room);

    let g = this.g;

    let canvas = this.getCanvas()
    let ctx = canvas.getContext('2d')
    let rv = new RoomVisual(canvas)
    rv.structure(1,1,obj.type,obj)
    let texture = new PIXI.Texture.fromCanvas(canvas)
    g.texture = texture
    return obj
  }

  getCanvas(){
    let canvas = document.createElement('canvas')
    canvas.width = S(20)
    canvas.height = S(20)
    return canvas
  }
}
