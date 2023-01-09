import * as Paperless from '@zone09.net/paperless';



export interface IDrawableCursorAttributes extends Paperless.Interfaces.IDrawableAttributes 
{
	width?: number,
	blink?: boolean
}

export interface IComponentEditableAttributes extends Paperless.Interfaces.IComponentAttributes 
{
	maxchar?: number,
	maxline?: number,
	focuscolor?: string,
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
	cursor?: IDrawableCursorAttributes
}
