import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';



export class Static extends EntityCoreControl
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

	public onIconsDefault(): void {}
	public onIconsRefresh(): void {}
	public onLeftClick(): void{}
}

