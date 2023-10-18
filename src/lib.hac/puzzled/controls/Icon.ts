import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class Icon extends Paperless.Controls.Button
{
	private _puzzled: Puzzled;
	//---

	public constructor(puzzled: Puzzled, attributes: Paperless.Interfaces.IControlButtonAttributes = {})
	//public constructor(puzzled: Puzzled, callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(attributes);
		//super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);

		this.movable = false;
		this.focusable = false;

		this._puzzled = puzzled;
	}

	public onInside(): void
	{
		this.drawable.shadow = this._puzzled.shadow;
		this.drawable.shadowcolor = this._puzzled.color.iconshadow;
	}

	public onOutside(): void
	{
		this.drawable.shadow = 0;
	}
}
