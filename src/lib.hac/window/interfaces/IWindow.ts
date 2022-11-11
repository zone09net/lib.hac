import * as Paperless from '@zone09.net/paperless';
import * as HaC from '../../../lib.hac.js';


export interface IComponentWindowAttributes extends Paperless.IComponentAttributes
{
	padding?: number,
	label?: Paperless.IDrawableLabelAttributes,
	rectangle?: Paperless.IDrawableAttributes,
	artwork?: Paperless.IDrawableArtworkAttributes,
	puzzled?: HaC.Interfaces.Puzzled.IComponentPuzzledAttributes
}