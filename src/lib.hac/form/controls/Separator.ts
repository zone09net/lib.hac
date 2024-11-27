import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {Separator as Drawable} from '../drawables/Separator.js';



export class Separator extends EntityCoreControl
{
	public constructor(attributes: IEntityCoreControlAttributes)
	{
		const {
			movable = true,
			focusable = false,
			swappable = true,
			splittable = true,
			shrinkable = true,
			expandable = true,
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
}

