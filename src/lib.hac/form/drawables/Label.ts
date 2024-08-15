import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUILabelAttributes} from '../interfaces/IUI.js';



export class Label extends EntityCoreDrawable
{
	private _align: Paperless.Enums.Align;
	private _label: Paperless.Drawables.Label;
	//---

	public constructor(attributes: IDrawableUILabelAttributes = {})
	{
		super({
			...{
				nofill: true,
				nostroke: true
			},
			...attributes
		});

		const {
			content = '',
			align = Paperless.Enums.Align.center,
			label = {},
		} = attributes;

		this._align = align;
		this._label = new Paperless.Drawables.Label({
			...{ 
				multiline: true, 
				wrapping: true 
			},
			...label,
			...{ 
				content: content || label.content,
				size: {width: this.width - this.puzzled.spacing, height: this.height - this.puzzled.spacing},
				hoverable: false, 
				corner: true, 
				sticky: this.sticky, 
				offset1: this.puzzled.point, 
				generate: false,
				matrix: this.matrix
			}
		});

		this.context.enroll(this._label);
		this.update();
	}

	public update(): void
	{
		this._label.width = this.width - this.puzzled.spacing;
		this._label.height = this.height - this.puzzled.spacing;
		this._label.generate();

		if(this._align == Paperless.Enums.Align.center)
		{
			this._label.offset2.x = this.puzzled.spacing + ((this.width - this._label.width - this.puzzled.spacing) / 2);
			this._label.offset2.y = this.puzzled.spacing + ((this.height - this._label.height - this.puzzled.spacing) / 2);
		}
		else if(this._align == Paperless.Enums.Align.top)
			this._label.offset2.y = this.puzzled.spacing;
		else if(this._align == Paperless.Enums.Align.bottom)
			this._label.offset2.y = this.puzzled.spacing + (this.height - this._label.height - this.puzzled.spacing);

		this.context.refresh();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		this._label.draw(context2D);
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get childs(): {label: Paperless.Drawables.Label}
	{
		return {label: this._label};
	}

	public get align(): Paperless.Enums.Align
	{
		return this._align;
	}
	public set align(align: Paperless.Enums.Align)
	{
		this._align = align;
	}
}
