import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {IDrawableSplitterAttributes} from '../interfaces/IPuzzled.js';



export class Splitter extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//---

	public constructor(attributes: IDrawableSplitterAttributes = {})
	{
		super({
			...attributes,
			...{
				linewidth: 2, 
				size: {width: 5, height: 20},
				fillcolor: attributes.puzzled.color.marked, 
				sticky: attributes.puzzled.sticky,
				generate: false,
				nostroke: true
			}
		});

		this._puzzled = attributes.puzzled;
		
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
}

