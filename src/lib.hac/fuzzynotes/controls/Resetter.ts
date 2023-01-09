import * as Paperless from '@zone09.net/paperless';
import {Fuzzynotes} from '../components/Fuzzynotes.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {Restrict} from '../../puzzled/enums/Restrict.js';



export class Resetter extends Paperless.Control
{
	private _fuzzynotes: Fuzzynotes;
	//---

	public constructor(fuzzynotes: Fuzzynotes)
	{
		super();

		this._fuzzynotes = fuzzynotes;
		this.movable = false;
		this.focusable = false;
	}

	public onLeftClick(): void
	{
		for(let guid in this._fuzzynotes.puzzled.getEntities(Restrict.ignoregroup))
		{
			let control: EntityCoreControl = this._fuzzynotes.puzzled.extractGuid(guid);
			let source: Paperless.Point = new Paperless.Point(control.drawable.matrix.e, control.drawable.matrix.f);
			
			control.drawable.y -= this._fuzzynotes.puzzled.point.y - this._fuzzynotes.attributes.padding.top;
			(<EntityCoreControl>control).onMoved(source);
		}

		this.drawable.visible = false;
		this._fuzzynotes.puzzled.point.y = this._fuzzynotes.attributes.padding.top;
	}

	public onInside(): void
	{
		this.drawable.shadow = 5;
		this.drawable.shadowcolor = this.drawable.shadowcolor;
	}

	public onOutside(): void
	{
		this.drawable.shadow = 0;
	}
}
