import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class Highlight extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//---

	public constructor(point: Paperless.Point, size: Paperless.Size, puzzled: Puzzled)
	{
		super(point, {nostroke: true, alpha: puzzled.alpha, fillcolor: puzzled.color.highlight});

		this.size = size;
		this.hoverable = false;
		this._puzzled = puzzled;

		this.generate();
	}

	public generate(): void
	{
		let point: Paperless.Point = new Paperless.Point(0, 0);
		let points: Array<Paperless.Point> = [
			new Paperless.Point(point.x + this._puzzled.spacing, point.y + this._puzzled.spacing),
			new Paperless.Point(point.x + this.size.width - this._puzzled.spacing, point.y + this._puzzled.spacing),
			new Paperless.Point(point.x + this.size.width - this._puzzled.spacing, point.y + this.size.height - this._puzzled.spacing),
			new Paperless.Point(point.x + this._puzzled.spacing, point.y + this.size.height - this._puzzled.spacing)
		];

		this.clearPath();
		this.path.rect(points[0].x, points[0].y, points[2].x, points[2].y);
		this.path.closePath();
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset.x, this.matrix.f + this.offset.y);

		context2D.fillStyle = this.fillcolor;
		context2D.globalAlpha = this.alpha;
		context2D.fill(this.path);

		context2D.restore();
	}
}
