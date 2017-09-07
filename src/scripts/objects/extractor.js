import GameObject from './gameObject';
import {S} from '../const';

export default class Extractor extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
    this.graphics = new PIXI.Graphics();
    this.g.addChild(this.graphics);

    this.graphics.position.set(S(5), S(5));
    this.graphics.pivot.set(S(5), S(5));
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.graphics;
    
    let ang = (ang) => ang * (Math.PI / 180)
    g.beginFill(0xAAAAAA)
    g.lineStyle(0.5, 0x555555, 1)
    let m = S(5)
    this.drawSlice(g, m, m, ang(0),   ang(60),  S(6.5), S(8));
    this.drawSlice(g, m, m, ang(120), ang(180), S(6.5), S(8));
		this.drawSlice(g, m, m, ang(240), ang(300), S(6.5), S(8));
    g.endFill()
	}

  drawSlice (g, x, y, startAngle, endAngle, innerRadius, outerRadius) {
    let x1 = x + (Math.cos(startAngle) * outerRadius)
    let y1 = y + (Math.sin(startAngle) * outerRadius)
    let x2 = x + (Math.cos(endAngle) * innerRadius)
    let y2 = y + (Math.sin(endAngle) * innerRadius)

    g.moveTo(x1,y1)
    g.arc(x, y, outerRadius, startAngle, endAngle)
    g.lineTo(x2, y2)
    g.arc(x, y, innerRadius, endAngle, startAngle, true)
    g.lineTo(x1, y1)
    g.closePath()
  }

  preRender(ts) {
    super.preRender(ts);
    this.graphics.rotation += 0.03;
  }
}
