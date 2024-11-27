import * as Paperless from '@zone09.net/paperless';
import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {Editable} from './Editable.js';
import {Field as Drawable} from '../drawables/Field.js';



export class Field extends Editable
{
	private _clear: Paperless.Control;
	//---

	public constructor(attributes: IEntityCoreControlAttributes)
	{
		super(attributes);
	}

	public onCancel(): void 
	{
		(<Drawable>this.drawable).update();
	}

	public onSwapped(): void 
	{
		(<Drawable>this.drawable).update();
	}

	public onSplitted(): void 
	{
		(<Drawable>this.drawable).update();
	}

	public onExpanded(): void 
	{
		(<Drawable>this.drawable).update();
	}

	public onShrinked(): void 
	{
		(<Drawable>this.drawable).update();
	}

	public onMarked(): void 
	{
		(<Drawable>this.drawable).childs.editable.update(false);

		if((<Drawable>this.drawable).childs.editable.childs.cursor)
		{
			this.context.attach((<Drawable>this.drawable).childs.editable.childs.cursor);
			(<Drawable>this.drawable).childs.editable.childs.cursor.matrix = (<Drawable>this.drawable).matrix;
		}

		(<Drawable>this.drawable).childs.editable.childs.element.focus();
	}

	public onUnmarked(): void
	{
		if((<Drawable>this.drawable).childs.editable.childs.cursor)
			this.context.detach((<Drawable>this.drawable).childs.editable.childs.cursor.guid);

		(<Drawable>this.drawable).childs.editable.childs.element.blur();
	}

	public onDrawable(): void 
	{
	//	this.minimum.width = (<Drawable>this.drawable).leftwidth + (<Drawable>this.drawable).rightwidth + this.puzzled.hop;
	}

	public onIconsDefault(): void {}
	public onIconsRefresh(): void {}
}

