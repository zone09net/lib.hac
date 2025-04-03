import * as Paperless from '@zone09.net/paperless';
import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {Editable} from './Editable.js';
import {Field as Drawable} from '../drawables/Field.js';



export class Field extends Editable
{
	public onLoaded(): void 
	{
		this.minimum.width = (<Drawable>this.drawable).leftwidth + (<Drawable>this.drawable).rightwidth + this.puzzled.hop;
	}
}

