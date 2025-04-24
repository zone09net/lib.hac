import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIFieldAttributes} from '../interfaces/IUI.js';
import {Editable} from '../../editable/components/Editable.js';



export class Field extends EntityCoreDrawable
{
	private _label: Paperless.Drawables.Label;
	private _right: Paperless.Drawables.Rectangle;
	private _editable: Editable;
	private _leftwidth: number;
	private _rightwidth: number;
	//---

	public constructor(attributes: IDrawableUIFieldAttributes = {})
	{
		super({
			...attributes, 
			...{
				nostroke: false, 
				nofill: false,
			}
		});

		const {
			content = '',
			leftwidth = 0,
			rightwidth = 0,
			editable = {},
			label = {},
			right = {}
		} = attributes;

		this._leftwidth = leftwidth;
		this._rightwidth = rightwidth;

		this._editable = new Editable({
			...editable,
			...{
				point: {x: this.x, y: this.y},
				size: {
					width: this.width - this._leftwidth - this._rightwidth - this.puzzled.spacing, 
					height: this.height - this.puzzled.spacing
				},
				sticky: this.sticky
			},
			label: { 
				...{ 
					wrapping: true, 
					multiline: true 
				},
				...editable.label,
				...{ 
					content: editable.label.content,
					matrix: this.matrix,
					offset1: this.puzzled.point,
					offset2: {x: this.puzzled.spacing + this._leftwidth, y: this.puzzled.spacing}
				}
			},
			cursor: {
				...attributes.editable.cursor,
				...{
					offset1: this.puzzled.point,
					offset2: {x: this.puzzled.spacing + this._leftwidth, y: this.puzzled.spacing},
					matrix: this.matrix
				}
			}
		});

		if(leftwidth > 0)
		{
			this._label = new Paperless.Drawables.Label({
				...{ 
					multiline: false, 
					wrapping: false, 
					fillbackground: this.strokecolor, 
					content: '', 
					padding: this._editable.childs.label.padding, 
					font: this._editable.childs.label.font 
				},
				...label,
				...{ 
					point: {x: this.x, y: this.y},
					size: {width: leftwidth, height: this.height - this.puzzled.spacing - 2},
					corner: true, 
					hoverable: false,
					sticky: this.sticky,
					offset1: this.puzzled.point,
					offset2: {x: this.puzzled.spacing + 1, y: this.puzzled.spacing + 1}, 
					generate: true,
					matrix: this.matrix
				}
			});
		}

		if(rightwidth > 0)
		{
			this._right = new Paperless.Drawables.Rectangle({
				...{ fillcolor: this.strokecolor },
				...right,
				...{ 
					size: {width: rightwidth - 2, height: this.height - this.puzzled.spacing - 2},
					nostroke: true, 
					hoverable: false,
					sticky: this.sticky,
					offset1: this.puzzled.point,
					offset2: {x: this.width - (rightwidth / 2), y: ((this.height + this.puzzled.spacing) / 2)},
					matrix: this.matrix
				}
			});
		}

		this.context.enroll(this._editable);
		
		if(this._leftwidth > 0)
			this.context.enroll(this._label);

		if(this._rightwidth > 0)
			this.context.enroll(this._right);

		this._editable.attachBackground(this);
		this._editable.attachCursor();
		this._editable.initialize();
	}

	
	public update(): void
	{
		if(this._leftwidth > 0)
		{
			this._label.width = this._leftwidth;
			this._label.height = this.height - this.puzzled.spacing - 2;
			this._label.generate();
		}

		if(this._rightwidth > 0)
		{
			this._right.width = this._rightwidth;
			this._right.height = this.height - this.puzzled.spacing - 2;
			this._right.offset2 = {x: this.width - (this._rightwidth / 2) - 1, y: ((this.height + this.puzzled.spacing) / 2)};
			this._right.generate();
		}

		this._editable.width = this.width - this._rightwidth - this._leftwidth - this.puzzled.spacing;
		this._editable.height = this.height - this.puzzled.spacing;
		this._editable.childs.label.width = this.width - this.puzzled.spacing - this._leftwidth - this._rightwidth;// - this._editable.childs.cursor.width - this._editable.childs.label.padding.right - this._editable.childs.label.padding.left;
		this._editable.childs.label.height = this.height - this.puzzled.spacing;
		this._editable.update(true);
	}
	
	public onDetach(): void
	{
		this._editable.onDetach();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{	
		if(this._leftwidth > 0)
			this._label.draw(context2D);

		if(this._rightwidth > 0)
			this._right.draw(context2D);

		this._editable.childs.label.draw(context2D);
		
		if(this._editable.childs.cursor.visible)
			this._editable.childs.cursor.draw(context2D);
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get childs(): {editable: Editable, label: Paperless.Drawables.Label, right: Paperless.Drawables.Rectangle}
	{
		return {editable: this._editable, label: this._label, right: this._right};
	}

	public get leftwidth(): number
	{
		return this._leftwidth;
	}

	public get rightwidth(): number
	{
		return this._rightwidth;
	}
}
