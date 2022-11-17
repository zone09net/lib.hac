import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class Slider extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//---
	
	public constructor(point: Paperless.Point, size: Paperless.Size, puzzled: Puzzled)
	{
		super(point, {linewidth: puzzled.linewidth, strokecolor: puzzled.color.sizer});

		this.size = size;
		this._puzzled = puzzled;

		this.generate();
	}

	public generate(): void
	{
		let point: Paperless.Point = new Paperless.Point(0, 0);

		this.clearPath();

		if(this.rotation == 90)
		{
			this.path.moveTo(point.x - (this.size.height / 2), point.y);
			this.path.lineTo(point.x + (this.size.height / 2), point.y);
			this.path.moveTo(point.x - (this.size.height / 2), point.y - 5);
			this.path.lineTo(point.x - (this.size.height / 2), point.y + 5);
			this.path.moveTo(point.x + (this.size.height / 2), point.y - 5);
			this.path.lineTo(point.x + (this.size.height / 2), point.y + 5);
		}
		else
		{
			this.path.moveTo(point.x - (this.size.width / 2), point.y);
			this.path.lineTo(point.x + (this.size.width / 2), point.y);
			this.path.moveTo(point.x - (this.size.width / 2), point.y - 5);
			this.path.lineTo(point.x - (this.size.width / 2), point.y + 5);
			this.path.moveTo(point.x + (this.size.width / 2), point.y - 5);
			this.path.lineTo(point.x + (this.size.width / 2), point.y + 5);
		}
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.translate(this.point.x, this.point.y);
		context2D.rotate((Math.PI / 180) * this.rotation);
		context2D.scale(this.scale.x, this.scale.y);

		context2D.strokeStyle = this.strokecolor;
		context2D.lineWidth = this.linewidth;
		context2D.stroke(this.path);

		context2D.restore();
	}
}
