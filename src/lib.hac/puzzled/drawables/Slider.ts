import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class Slider extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//---
	
	public constructor(puzzled: Puzzled, attributes: Paperless.Interfaces.IDrawableAttributes = {})
	{
		super({
			...attributes,
			...{
				linewidth: puzzled.linewidth, 
				strokecolor: puzzled.color.sizer
			}
		});

		this.hoverable = false;
		this._puzzled = puzzled;

		this.generate();
	}

	public generate(): void
	{
		let point: Paperless.Point = new Paperless.Point(0, 0);

		this.path = new Path2D();

		if(this.angle == 90)
		{
			this.path.moveTo(point.x - (this.height / 2), point.y);
			this.path.lineTo(point.x + (this.height / 2), point.y);
			this.path.moveTo(point.x - (this.height / 2), point.y - 5);
			this.path.lineTo(point.x - (this.height / 2), point.y + 5);
			this.path.moveTo(point.x + (this.height / 2), point.y - 5);
			this.path.lineTo(point.x + (this.height / 2), point.y + 5);
		}
		else
		{
			this.path.moveTo(point.x - (this.width / 2), point.y);
			this.path.lineTo(point.x + (this.width / 2), point.y);
			this.path.moveTo(point.x - (this.width / 2), point.y - 5);
			this.path.lineTo(point.x - (this.width / 2), point.y + 5);
			this.path.moveTo(point.x + (this.width / 2), point.y - 5);
			this.path.lineTo(point.x + (this.width / 2), point.y + 5);
		}
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset1.x, this.matrix.f + this.offset1.y);

		context2D.strokeStyle = this.strokecolor;
		context2D.lineWidth = this.linewidth;
		context2D.stroke(this.path);

		context2D.restore();
	}
}
