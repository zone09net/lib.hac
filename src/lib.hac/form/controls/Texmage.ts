import * as Paperless from '@zone09.net/paperless';
import * as Foundation from '@zone09.net/foundation';
import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {Texmage as Drawable} from '../drawables/Texmage.js';
import {Assets} from '../../puzzled/drawables/Assets.js';



export class Texmage extends EntityCoreControl
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

	public onIconsRefresh(): void
	{
		const pointBottomLeft: Paperless.Point = new Paperless.Point(this.drawable.x + this.puzzled.spacing + 9, this.drawable.y + this.drawable.height);

		this.attachIcon(pointBottomLeft, new Paperless.Size(22, 22), Assets.paste, () => {
			Foundation.Clipboard.getContent().then((content) => {
				if(/^data:image/.test(content) && (<Drawable>this.drawable).childs.artwork)
				{
					(<Drawable>this.drawable).type = 'artwork';
					(<Drawable>this.drawable).childs.artwork.base64 = content;
				}
				else if ((<Drawable>this.drawable).childs.label)
				{
				
					(<Drawable>this.drawable).type = 'label';
					(<Drawable>this.drawable).childs.label.content = content;
					(<Drawable>this.drawable).childs.label.generate();
					this.context.refresh();
				}

				(<Drawable>this.drawable).update();
			}); 
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

