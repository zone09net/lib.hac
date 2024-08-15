import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {Button as Drawable} from '../drawables/Button.js';



export class Button extends EntityCoreControl
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

	public onIconsDefault(): void {}
	public onIconsRefresh(): void {}
	public onLeftClick(): void {}

	public onInside(): void
	{
		this.drawable.shadow = this.puzzled.shadow;
	}

	public onOutside(): void
	{
		this.drawable.shadow = 0;
	}
}

