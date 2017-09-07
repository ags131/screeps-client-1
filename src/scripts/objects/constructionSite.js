import GameObject from './gameObject';
import {S} from '../const';

export default class Extractor extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;
    
    let ang = (ang) => ang * (Math.PI / 180)
    g.lineStyle(2, 0x8FBB93, 1)
    let m = S(5)
    g.drawCircle(S(5), S(5), S(3));
    g.beginFill(0x8FBB93)
    g.drawCircle(S(5), S(5), S(3) * (obj.progress / obj.progressTotal))
    g.endFill()
	}

  preRender(ts) {
    super.preRender(ts);
    this.g.alpha = (((Math.sin(ts / 500) / 2) + 0.5) * 0.5) + 0.5;
  }
}
