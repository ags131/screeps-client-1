import GameObject from './gameObject';
import {S} from '../const';

export default class Extension extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;

		g.clear();
		g.lineStyle(1.5, 0x8FBB93, 1);
		g.beginFill(0x555555);
		g.drawCircle(S(5), S(5), S(4));
		g.endFill()

		g.lineStyle(3, 0x181818, 1);
		g.drawCircle(S(5), S(5), S(3));

		g.lineStyle(0, 0, 0);
		g.beginFill(0xffff00);
		let e = (S(4) - 2) * Math.sqrt(obj.energy / obj.energyCapacity);
		if (e > 0) e = Math.max(1, e);
		g.drawCircle(S(5), S(5), e);
		g.endFill();
	}
}
