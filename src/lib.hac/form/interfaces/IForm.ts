import * as Paperless from '@zone09.net/paperless';
import {IComponentPuzzledAttributes} from '../../puzzled/interfaces/IPuzzled';
import {IComponentPuzzledEntity} from '../../puzzled/interfaces/IPuzzled.js';
import {IFormUITemplate} from './IUI.js';
import {Puzzled} from '../../puzzled/components/Puzzled.js';
import {Form} from '../components/Form.js';



export interface IComponentFormAttributes extends Paperless.Interfaces.IComponentAttributes
{
	puzzled?: Puzzled,
	template?: IFormUITemplate

	onSubmit?: (self?: Form) => Promise<void>,
	onNoSubmit?: (self?: Form) => void,
}

export interface IComponentFormEntity extends IComponentPuzzledEntity
{
	name?: string,
}


