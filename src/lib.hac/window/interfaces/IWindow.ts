import * as Paperless from '@zone09.net/paperless';
import * as HaC from '../../../lib.hac.js';


export interface IComponentWindowAttributes extends Paperless.Interfaces.IComponentAttributes
{
	padding?: number,
	header?: Paperless.Interfaces.IDrawableLabelAttributes,
	rectangle?: Paperless.Interfaces.IDrawableAttributes,
	close?: Paperless.Interfaces.IDrawableArtworkAttributes,
	puzzled?: HaC.Interfaces.Puzzled.IComponentPuzzledAttributes
}