import * as Paperless from '@zone09.net/paperless';
import {Editable} from '../components/Editable.js';



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
	customlabel?: Paperless.Drawables.Label,
	customgenerate?: boolean,
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
	cursor?: IDrawableCursorAttributes,

	onEscape?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onKey?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onEnter?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onTab?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onBackspace?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onDelete?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onRight?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onCtrlRight?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onShiftRight?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onLeft?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onCtrlLeft?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onShiftLeft?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onUp?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onDown?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onHome?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onCtrlHome?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onEnd?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onCtrlEnd?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onCopy?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onPaste?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
	onUnselect?: (event: HTMLElementEventMap['keydown'], self: Editable) => void,
}
