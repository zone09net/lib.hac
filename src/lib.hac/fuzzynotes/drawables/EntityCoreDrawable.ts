import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../../puzzled/components/Puzzled.js';
import {EntityCoreDrawable as Drawable} from '../../puzzled/drawables/EntityCoreDrawable.js';



export class EntityCoreDrawable extends Drawable
{
	private _fillcolor2: string;
	private _strokecolor2: string;
	//---

	public constructor(puzzled: Puzzled, attributes: Paperless.Interfaces.IDrawableAttributes = {})
	{
		super(puzzled, attributes);
	}




	// Accessors
	// --------------------------------------------------------------------------
}
