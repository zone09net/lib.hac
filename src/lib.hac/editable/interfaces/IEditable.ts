import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';



export interface IDrawableCursorAttributes extends Paperless.Interfaces.IDrawableAttributes 
{
	width?: number,
	blink?: boolean
}

export interface IComponentEditableAttributes extends Paperless.Interfaces.IComponentAttributes 
{
	textarea?: boolean,
	maxchar?: number,
	maxline?: number,
	focuscolor?: string,
	restrict?: RegExp,
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
	cursor?: IDrawableCursorAttributes,

	onEscape?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onKey?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onEnter?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onTab?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onBackspace?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onDelete?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onRight?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onCtrlRight?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onShiftRight?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onLeft?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onCtrlLeft?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onShiftLeft?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onUp?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onDown?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onHome?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onCtrlHome?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onEnd?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onCtrlEnd?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onCopy?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onPaste?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
	onUnselect?: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => void,
}
