import * as Paperless from '@zone09.net/paperless';
import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {Editable as Drawable} from '../drawables/Editable.js'



export class Editable extends EntityCoreControl
{
	private _cursor: boolean;
	//---

	public constructor(attributes: IEntityCoreControlAttributes)
	{
		const {
			movable = false,
			focusable = false,
			swappable = false,
			splittable = false,
			shrinkable = false,
			expandable = false,
			stackable = false,
		} = attributes;

		super({
			...attributes,
			...{
				movable: movable,
				focusable: focusable,
				swappable: swappable,
				splittable: splittable,
				shrinkable: shrinkable,
				expandable: expandable,
				stackable: stackable,
			}
		});

		this._cursor = false;
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

		if(!this._cursor)
		{
			this.context.attach((<Drawable>this.drawable).childs.editable.childs.cursor, Paperless.Layer.decode(this.guid));
			(<Drawable>this.drawable).childs.editable.childs.cursor.matrix = (<Drawable>this.drawable).matrix;
			this._cursor = true;
		}

		(<Drawable>this.drawable).childs.editable.childs.element.focus();
	}

	public onUnmarked(): void
	{
		if(this._cursor)
		{
			this.context.detach((<Drawable>this.drawable).childs.editable.childs.cursor.guid);
			this._cursor = false;
		}

		(<Drawable>this.drawable).childs.editable.childs.element.blur();
	}

	public onIconsDefault(): void {}
	public onIconsRefresh(): void {}
}

