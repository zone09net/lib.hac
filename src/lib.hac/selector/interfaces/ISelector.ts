import * as Paperless from '@zone09.net/paperless';
import {Manipulator} from '../controls/Manipulator.js';
import {Item} from '../controls/Item.js';


export interface IComponentSelectorAttributes extends Paperless.Interfaces.IComponentAttributes
{
	padding?: Paperless.Interfaces.IPadding,
	spacing?: number,
	manipulator?: Manipulator,
	items?: Item[],
}

export interface IComponentSelectorAlignAttributes
{
	restrict?: Paperless.Enums.Restrict.horizontal | Paperless.Enums.Restrict.vertical,
	isolated?: number,
	bypass?: boolean,
	disableisolated?: boolean,
	duration?: { 
		fade?: number,
		shift?: number,
	},
	direction?: {
		fadeout?: Paperless.Enums.Direction,
		fadein?: Paperless.Enums.Direction,
		shift?: Paperless.Enums.Direction,
	},
}

export interface IControlItemAttributes extends Paperless.Interfaces.IControlAttributes
{
	onBeforeSelection?: (self?: Item) => void,
	onSelection?: (self?: Item) => void,
	onAfterSelection?: (self?: Item) => void,
}

