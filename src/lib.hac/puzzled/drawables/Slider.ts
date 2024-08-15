import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {IDrawableSliderAttributes} from '../interfaces/IPuzzled.js';



export class Slider extends Paperless.Drawable
{
	public constructor(attributes: IDrawableSliderAttributes = {})
	{
		super({
			...attributes,
			...{
				linewidth: attributes.puzzled.linewidth, 
				strokecolor: attributes.puzzled.color.sizer,
				sticky: attributes.puzzled.sticky,
				nofill: true,
				generate: false,
				hoverable: false,
			}
		});

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
}

