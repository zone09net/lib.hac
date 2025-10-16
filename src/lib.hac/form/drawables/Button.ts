import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIButtonAttributes} from '../interfaces/IUI.js';



export class Button extends EntityCoreDrawable
{
	private _label: Paperless.Drawables.Label;
	private _rectangle: Paperless.Drawables.Rectangle;
	//---

	public constructor(attributes: IDrawableUIButtonAttributes = {})
	{
		super({
			...{
				nostroke: false, 
				nofill: false,
				shadowcolor: attributes.fillcolor,
			},
			...attributes, 
		});

		const {
			content = '',
			rectangle = {},
			label = {},
		} = attributes;

		let color: string = this.strokecolor;
		this.strokecolor = this.fillcolor;
		this.fillcolor = color;

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

		this._rectangle = new Paperless.Drawables.Rectangle({
			...{
				fillcolor: this.strokecolor, 
				nostroke: true, 
				nofill: false,
			},
			...rectangle,
			...{ 
				point: {x: this.x, y: this.y},
				size: {width: this.width - this.puzzled.spacing - 2, height: this.height - this.puzzled.spacing - 2},
				sticky: this.sticky, 
				hoverable: false, 
				offset1: this.puzzled.point,
				offset2: {
					x: ((this.width - this.puzzled.spacing) / 2) + this.puzzled.spacing,
					y: ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing
				},
				matrix: this.matrix,
				linewidth: 1
			}
		});

		this.context.enroll(this._label);
		this.context.enroll(this._rectangle);
	}

	public update(): void
	{
		this._rectangle.width = this.width - this.puzzled.spacing - 2;
		this._rectangle.height = this.height - this.puzzled.spacing - 2;
		this._rectangle.offset2 = {
			x: ((this.width - this.puzzled.spacing) / 2) + this.puzzled.spacing,
			y: ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing
		}
		this._rectangle.generate();

		this._label.offset2 = {
			x: ((this.width - this.puzzled.spacing) / 2) + this.puzzled.spacing,
			y: ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing
		};
		this._label.generate();	
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		this._rectangle.draw(context2D);
		this._label.draw(context2D);
	}
}
