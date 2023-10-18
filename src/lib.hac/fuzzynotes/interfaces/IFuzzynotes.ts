import * as Paperless from '@zone09.net/paperless';
import {IComponentPuzzledAttributes} from '../../puzzled/interfaces/IPuzzled.js';



interface IDrawableShadeAttributes extends Paperless.Interfaces.IDrawableAttributes
{
	top?: number,
	bottom?: number,
	overflow?: number
}

export interface IComponentFuzzynotesAttributes extends Paperless.Interfaces.IComponentAttributes 
{
	x?: number,
	width?: number,
	puzzled?: IComponentPuzzledAttributes,
	background?: Paperless.Interfaces.IDrawableAttributes,
	borders?: Paperless.Interfaces.IDrawableAttributes,
	resetter?: Paperless.Interfaces.IDrawableAttributes,
	shade?: IDrawableShadeAttributes,
	padding?: Paperless.Interfaces.IPadding,
}
