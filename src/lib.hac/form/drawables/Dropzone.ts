import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIDropzoneAttributes} from '../interfaces/IUI.js';



export class Dropzone extends EntityCoreDrawable
{
	private _label: Paperless.Drawables.Label;
	//---

	public constructor(attributes: IDrawableUIDropzoneAttributes = {})
	{
		super({
			...attributes, 
			...{
				nostroke: false, 
				nofill: false,
			}
		});

		const {
			content = 'Drop',
			label = {},
		} = attributes;

		attributes.label = {
			...{
				padding: {top: 0, bottom: 0, left: 0, right: 0}
			},
			...attributes.label,
		}

		this.shadowcolor = this.strokecolor;

		this._label = new Paperless.Drawables.Label({			
			...label,
			...{ 
				content: content, 
				hoverable: false, 
				autosize: true, 
				multiline: false, 
				wrapping: false, 
				corner: false, 
				sticky: this.sticky,
				offset1: this.puzzled.point,
				offset2: {
					x: ((this.width - this.puzzled.spacing) / 2) + this.puzzled.spacing,
					y: ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing
				}, 
				generate: true,
				matrix: this.matrix
			}
		});

		this.context.enroll(this._label);
	}

	public update(): void
	{
		this._label.offset2 = {
			x: ((this.width - this.puzzled.spacing) / 2) + this.puzzled.spacing,
			y: ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing
		};
		this._label.generate();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		this._label.draw(context2D);
	}
}

