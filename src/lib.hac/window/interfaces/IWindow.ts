import * as Paperless from '@zone09.net/paperless';
import {IComponentPuzzledAttributes} from '../../puzzled/interfaces/IPuzzled';
import {IComponentPuzzledEntity} from '../../puzzled/interfaces/IPuzzled.js';
import {Window} from '../components/Window.js';
import {Form} from '../../form/components/Form.js';



export interface IComponentWindowAttributes extends Paperless.Interfaces.IComponentAttributes
{
	autoopen?: boolean,
	padding?: Paperless.Interfaces.IPadding,
	header?: IDrawableHeaderAttributes,
	rectangle?: Paperless.Interfaces.IDrawableRectangleAttributes,
	close?: Paperless.Interfaces.IDrawableArtworkAttributes,
	puzzled?: IComponentPuzzledAttributes,
	
	onOpen?: (self?: Window) => void,
	onClose?: (self?: Window) => void,
	onCancel?: (self?: Window) => void,
	onSubmit?: (self?: Form) => Promise<void>,
	onNoSubmit?: (self?: Form) => void,
}

export interface IDrawableHeaderAttributes extends Paperless.Interfaces.IDrawableLabelAttributes
{
	thickness?: number 
}

