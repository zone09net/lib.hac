import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class Splitter extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//---

	public constructor(point: Paperless.Point, angle: number, puzzled: Puzzled)
	{
		super(point, {linewidth: 2, fillcolor: puzzled.color.marked, strokecolor: puzzled.color.faked, angle: angle});

		this.size = new Paperless.Size(5, 20);
		this._puzzled = puzzled;
		this.sticky = puzzled.sticky;
		
		this.generate();
	}

	public generate(): void
	{
		let point: Paperless.Point = new Paperless.Point(-this.size.width / 2, -this.size.height / 2);

		this.clearPath();
		
		if(this.angle == 90)
			this.path.rect(point.x + this._puzzled.spacing, point.y - this._puzzled.spacing, this.size.width, this.size.height);
		else
			this.path.rect(point.x + this._puzzled.spacing, point.y + this._puzzled.spacing, this.size.width, this.size.height);

		this.path.closePath();
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset.x, this.matrix.f + this.offset.y);

		context2D.fillStyle = this.fillcolor;
		context2D.fill(this.path);

		context2D.restore();
	}
}
