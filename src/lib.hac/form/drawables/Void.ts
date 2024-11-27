import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IEntityCoreDrawableAttributes} from '../../puzzled/interfaces/IPuzzled.js';



export class Void extends EntityCoreDrawable
{
	public constructor(attributes: IEntityCoreDrawableAttributes = {})
	{
		super(attributes);

		this.nofill = true;
		this.nostroke = true;
		this.hoverable = false;
	}
}

