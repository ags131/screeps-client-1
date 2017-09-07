import GameObject from './gameObject';
import {S} from '../const';

let minerals = ["H","O","U","L","K","Z","X","G","OH","ZK","UL","UH","UO","KH","KO","LH","LO","ZH","ZO","GH","GO","UH2O","UHO2","KH2O","KHO2","LH2O","LHO2","ZH2O","ZHO2","GH2O","GHO2","XUH2O","XUHO2","XKH2O","XKHO2","XLH2O","XLHO2","XZH2O","XZHO2","XGH2O","XGHO2"]

export default class Storage extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;

		let m = S(5);
		let w = S(5);
		let h = S(12);
		let hy = (S(10)-h)/2;

		let ox = S(6);
		let oy = S(7);

		g.lineStyle(2, 0x666666, 1);
		g.beginFill(0x000000);
		g.moveTo(m-ox, m-oy);
		g.arcTo(m, m-(oy + S(2)), m+ox, m-oy, S(19));
		g.lineTo(m+ox, m-oy);
		g.arcTo(m+(ox+S(2)), m, m+ox, m+oy, S(25));
		g.lineTo(m+ox, m+oy);
		g.arcTo(m, m+(oy + S(2)), m-ox, m+oy, S(19));
		g.lineTo(m-ox, m+oy);
		g.arcTo(m-(ox+S(2)), m, m-ox, m-oy, S(25));
		g.endFill();

		g.lineStyle(1, 0x000000, 1);
		g.beginFill(0x666666);
		g.drawRect(m-w, hy, 2*w, h);
		g.endFill();

		g.lineStyle(0, 0, 0);
                let mt = minerals.reduce((l, v) => l + (obj[v] || 0), 0)
                let ea = obj.energy / obj.energyCapacity
                let ma = mt / obj.energyCapacity
                let pa = (obj.power || 0) / obj.energyCapacity

		g.beginFill(0xff0000);
		let height = S(10) * (pa + ma + ea);
		g.drawRect(m-w+0.5, h+hy - height-1, 2*w-1, height);
		g.endFill();

		g.beginFill(0xffffff);
		height = S(10) * (ma + ea);
		g.drawRect(m-w+0.5, h+hy - height-1, 2*w-1, height);
		g.endFill();

		g.beginFill(0xffff00);
		height = S(10) * ea;
		g.drawRect(m-w+0.5, h+hy - height-1, 2*w-1, height);
		g.endFill();
	}
}
