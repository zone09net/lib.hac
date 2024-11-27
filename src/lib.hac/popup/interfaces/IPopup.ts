import * as Paperless from '@zone09.net/paperless';
import {Popup} from '../components/Popup.js';



export interface IComponentPopupAttributes extends Paperless.Interfaces.IComponentAttributes
{
	title?: Paperless.Interfaces.IDrawableLabelAttributes,
	detail?: Paperless.Interfaces.IDrawableLabelAttributes,
	dark?: Paperless.Interfaces.IDrawableAttributes,
	width?: number,
	noclick?: boolean,
	passthrough?: boolean,
	autoopen?: boolean,

	onOpen?: (self?: Popup) => void,
	onClose?: (self?: Popup) => void,
}
