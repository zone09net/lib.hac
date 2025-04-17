import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {IDrawableSizerAttributes} from '../interfaces/IPuzzled.js';



export class Sizer extends Paperless.Drawables.Circle
{
	private _puzzled: Puzzled;
	//---

	public constructor(attributes: IDrawableSizerAttributes = {})
	{
		super({
			...attributes,
			...{
				linewidth: 3,
				size: {width: 9, height: 9},
				fillcolor: attributes.puzzled.color.marked, 
				strokecolor: attributes.puzzled.color.faked,
				sticky: attributes.puzzled.sticky,
				nostroke: false,
				generate: false,
			}
		});

		this._puzzled = attributes.puzzled;

		this.generate();
	}

	public generate(): void
	{
		this.path = new Path2D();
		this.path.arc(this._puzzled.spacing, this._puzzled.spacing, 9, (this.angleEnd / 180) * Math.PI, (this.angleStart / 180) * Math.PI, true);
	}
}
