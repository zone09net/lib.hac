import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {IDrawableHighlightAttributes} from '../interfaces/IPuzzled.js';



export class Highlight extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//---

	public constructor(attributes: IDrawableHighlightAttributes = {})
	{
		super({
			...attributes,
			...{
				nostroke: true, 
				alpha: attributes.puzzled.alpha, 
				fillcolor: attributes.puzzled.color.highlight,
				sticky: attributes.puzzled.sticky,
				generate: false,
				hoverable: false
			}
		});

		this._puzzled = attributes.puzzled;

		this.generate();
	}

	public generate(): void
	{
		const point: Paperless.Point = new Paperless.Point(0, 0);
		const points: Array<Paperless.Point> = [
			new Paperless.Point(point.x + this._puzzled.spacing, point.y + this._puzzled.spacing),
			new Paperless.Point(point.x + this.size.width - this._puzzled.spacing, point.y + this._puzzled.spacing),
			new Paperless.Point(point.x + this.size.width - this._puzzled.spacing, point.y + this.size.height - this._puzzled.spacing),
			new Paperless.Point(point.x + this._puzzled.spacing, point.y + this.size.height - this._puzzled.spacing)
		];

		this.path = new Path2D();
		this.path.rect(points[0].x, points[0].y, points[2].x, points[2].y);
		this.path.closePath();
	}
}

