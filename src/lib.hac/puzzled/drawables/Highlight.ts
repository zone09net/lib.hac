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
		this._puzzled = puzzled;

		this.generate();
	}

	public generate(): void
	{
		let points: Array<Paperless.Point> = [];
		let point: Paperless.Point = new Paperless.Point(0, 0);

		points[0] = new Paperless.Point(point.x + this._puzzled.spacing, point.y + this._puzzled.spacing);
		points[1] = new Paperless.Point(point.x + this.size.width - this._puzzled.spacing, point.y + this._puzzled.spacing);
		points[2] = new Paperless.Point(point.x + this.size.width - this._puzzled.spacing, point.y + this.size.height - this._puzzled.spacing);
		points[3] = new Paperless.Point(point.x + this._puzzled.spacing, point.y + this.size.height - this._puzzled.spacing);

		this.clearPath();
		this.path.rect(points[0].x, points[0].y, points[2].x, points[2].y);
	}

	public draw(context2D: CanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.translate(this.point.x, this.point.y);
		context2D.rotate((Math.PI / 180) * this.rotation);
		context2D.scale(this.scale.x, this.scale.y);

		context2D.strokeStyle = this.strokecolor;
		context2D.fillStyle = this.fillcolor;
		context2D.globalAlpha = this.alpha;
		context2D.fill(this.path);

		context2D.restore();
	}
}
