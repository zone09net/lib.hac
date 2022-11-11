import * as Paperless from '@zone09.net/paperless';



export interface IDrawableCursorAttributes extends Paperless.IDrawableAttributes 
{
	width?: number,
	blink?: boolean
}

export interface IComponentEditableAttributes extends Paperless.IComponentAttributes 
{
	maxchar?: number,
	maxline?: number,
	focus?: string,
	label?: Paperless.IDrawableLabelAttributes,
	cursor?: IDrawableCursorAttributes
}
