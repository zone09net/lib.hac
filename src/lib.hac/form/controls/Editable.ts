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

	/*
	public onInside(): void
	{
		if(this.puzzled.getMarker() == this.guid)
			document.body.style.cursor = 'text';
	}

	public onOutside(): void
	{
		document.body.style.cursor = 'auto';
	}
	*/

	public onMarked(): void 
	{
		(<Drawable>this.drawable).childs.editable.update(false);
		(<Drawable>this.drawable).childs.editable.childs.cursor.visible = true;
		(<Drawable>this.drawable).childs.editable.childs.element.focus();

		//document.body.style.cursor = 'text';
	}

	public onUnmarked(): void
	{
		(<Drawable>this.drawable).childs.editable.childs.cursor.visible = false;
		(<Drawable>this.drawable).childs.editable.childs.element.blur();
	}

	public onIconsDefault(self?: EntityCoreControl): void  {}
	public onIconsRefresh(self?: EntityCoreControl): void  {}
}

