import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class Splitter extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//---

	public constructor(puzzled: Puzzled, attributes: Paperless.Interfaces.IDrawableAttributes = {})
	{
		super({
			...attributes,
			...{
				linewidth: 2, 
				fillcolor: puzzled.color.marked, 
				strokecolor: puzzled.color.faked, 
			}
		});

		this.width = 5;
		this.height = 20;
		this._puzzled = puzzled;
		this.sticky = puzzled.sticky;
		
		this.generate();
	}

	public generate(): void
	{
		let point: Paperless.Point = new Paperless.Point(-this.width / 2, -this.height / 2);

		this.path = new Path2D();
		
		if(this.angle == 90)
			this.path.rect(point.x + this._puzzled.spacing, point.y - this._puzzled.spacing, this.width, this.height);
		else
			this.path.rect(point.x + this._puzzled.spacing, point.y + this._puzzled.spacing, this.width, this.height);

		this.path.closePath();
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset1.x, this.matrix.f + this.offset1.y);

		context2D.fillStyle = this.fillcolor;
		context2D.fill(this.path);

		context2D.restore();
	}
}
