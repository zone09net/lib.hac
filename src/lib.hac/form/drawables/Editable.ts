import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIEditableAttributes} from '../interfaces/IUI.js';
import {Editable as Child} from '../../editable/components/Editable.js';



export class Editable extends EntityCoreDrawable
{
	private _editable: Child;
	//---

	public constructor(attributes: IDrawableUIEditableAttributes = {})
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
			maxchar = 0,
			maxline = 0,
			restrict = /./,
			label = {},
			cursor = {},
			password = false
		} = attributes;

		this._editable = new Child({
			...{
				point: {x: this.x, y: this.y},
				size: {width: this.width - this.puzzled.spacing, height: this.height - this.puzzled.spacing},
				sticky: this.sticky,
				maxchar: maxchar,
				maxline: maxline,
				restrict: restrict
			},
			label: { 
				...{ 
					wrapping: true, 
					multiline: true 
				},
				...label,
				...{ 
					content: content || label.content,
					matrix: this.matrix,
					offset1: this.puzzled.point,
					offset2: {x: this.puzzled.spacing, y: this.puzzled.spacing},
					strokecolor: this.strokecolor,
				}
			},
			cursor: {
				...cursor,
				...{
					offset1: this.puzzled.point,
					offset2: {x: this.puzzled.spacing, y: this.puzzled.spacing},
					matrix: this.matrix,
					sticky: this.sticky,
				}
			},
			password: password
		});

		this.context.enroll(this._editable);

		this._editable.attachBackground(this);
		this._editable.attachCursor();
		this._editable.initialize();
	}
	
	public update(): void
	{
		this._editable.width = this.width - this.puzzled.spacing;
		this._editable.height = this.height - this.puzzled.spacing;
		this._editable.childs.label.width = this.width - this.puzzled.spacing;
		this._editable.childs.label.height = this.height - this.puzzled.spacing;
		this._editable.update(true);
	}

	public onDetach(): void
	{
		this._editable.onDetach();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		this._editable.childs.label.draw(context2D);

		if(this._editable.childs.cursor.visible)
			this._editable.childs.cursor.draw(context2D);
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get childs(): {editable: Child}
	{
		return {editable: this._editable};
	}
}

