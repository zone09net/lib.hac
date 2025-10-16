import * as Paperless from '@zone09.net/paperless';
import * as Foundation from '@zone09.net/foundation';
import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {Editable as Drawable} from '../drawables/Editable.js';
import {Puzzled} from '../../puzzled/components/Puzzled.js';




export class Editable extends EntityCoreControl
{
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

	public onInside(): void
	{
		if(this.context)
			this.context.canvas.style.cursor = 'text';
	}

	public onOutside(): void
	{
		if(this.context)
			this.context.canvas.style.cursor = 'auto';
	}

	public onResize(): void
	{
		const marked: string = this.puzzled.getMarker();

		if(this.guid == marked)
		{
			// can't get the cursor to get new position
			this.puzzled.removeMarker();
		}
	}

	public onMarked(): void 
	{
		const components: Foundation.ExtendedMap = this.context.getAllComponents();
		const filter: Paperless.Component[] = components.filter((component: Paperless.Component) => component instanceof Puzzled)

		filter.forEach((puzzled: Puzzled) => {
			if(puzzled != this.puzzled)
				puzzled.removeMarker();
		});

		this.context.refresh();

		(<Drawable>this.drawable).childs.editable.update(false);
		(<Drawable>this.drawable).childs.editable.childs.cursor.reset();
		(<Drawable>this.drawable).childs.editable.childs.cursor.toFront();
		(<Drawable>this.drawable).childs.editable.childs.cursor.visible = true;
		(<Drawable>this.drawable).childs.editable.childs.element.focus();
	}

	public onUnmarked(): void
	{
		(<Drawable>this.drawable).childs.editable.childs.cursor.visible = false;
		(<Drawable>this.drawable).childs.editable.childs.element.blur();
	}

	public onIconsDefault(self?: EntityCoreControl): void  {}
	public onIconsRefresh(self?: EntityCoreControl): void  {}
}

