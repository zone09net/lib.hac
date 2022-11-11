import * as Paperless from '@zone09.net/paperless';
import {IComponentPuzzledAttributes} from '../../puzzled/interfaces/IPuzzled.js';



interface IDrawableShadeAttributes extends Paperless.IDrawableAttributes
{
	top?: number,
	bottom?: number,
	overflow?: number
}

export interface IComponentFuzzynotesAttributes extends Paperless.IComponentAttributes 
{
	puzzled?: IComponentPuzzledAttributes,
	background?: Paperless.IDrawableAttributes,
	borders?: Paperless.IDrawableAttributes,
	resetter?: Paperless.IDrawableAttributes,
	shade?: IDrawableShadeAttributes,
	padding?: {top?: number, bottom?: number, left?: number, right?: number},
}
