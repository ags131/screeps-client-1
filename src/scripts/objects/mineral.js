import GameObject from './gameObject';
import {S} from '../const';

export default class Mineral extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
		this.t = new PIXI.Text();
		this.g.addChild(this.t)
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;
		let t = this.t

		let colors = {
      L: [0x3F6147, 0x89F4A5],
      U: [0x1B617F, 0x88D6F7],
      K: [0x331A80, 0x9370FF],
      Z: [0x594D33, 0xF2D28B],
      X: [0x4F2626, 0xFF7A7A],
      H: [0x4D4D4D, 0xCCCCCC],
      O: [0x4D4D4D, 0xCCCCCC]
    }
    let [primary, secondary] = colors[obj.mineralType]
    g.beginFill(primary);
    g.lineStyle(2, secondary, 1)
		g.drawCircle(S(5), S(5), S(5));
		g.endFill();
		t.style.fill = secondary
		t.style.fontSize = 16
		t.style.fontFamily = 'sans-serif'
		t.text = obj.mineralType
		t.width = S(8)
		t.position.x = S(1)
		t.position.y = S(1)

 		return 
		if (o.type === 'mineral') {
      let [primary, secondary] = colors[o.mineralType].map(c=>hexToRGB(c,0.6))
      ctx.beginPath()
      ctx.arc(rx + (25 * scale), ry + (25 * scale), 10 * scale, 0, Math.PI * 2)
      ctx.fillStyle = primary
      ctx.fill()
      ctx.strokeStyle = secondary
      ctx.lineWidth = 2 * scale
      ctx.stroke()
      ctx.font = `${scale * 16}px Roboto`
      let off = ctx.measureText(o.mineralType)
      ctx.fillStyle = secondary
      ctx.fillText(o.mineralType, rx + (25 * scale) - (off.width / 2), ry + (25 * scale) + (scale * 6))
    }

	}
}
