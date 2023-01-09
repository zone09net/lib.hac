import * as Paperless from '@zone09.net/paperless';



export interface IComponentPopopAttributes extends Paperless.Interfaces.IComponentAttributes
{
	title?: Paperless.Interfaces.IDrawableLabelAttributes,
	detail?: Paperless.Interfaces.IDrawableLabelAttributes,
	dark?: Paperless.Interfaces.IDrawableAttributes,
	width?: number,
	noclick?: boolean,
}
