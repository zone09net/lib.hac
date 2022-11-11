import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class Splitter extends Paperless.Controls.Button
{
	private _puzzled: Puzzled;
	//---

	public constructor(puzzled: Puzzled, callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);

		this.movable = false;
		this.focusable = false;

		this._puzzled = puzzled;
	}

	public onInside(): void
	{
		this.drawable.toFront();
		this.drawable.fillcolor = this._puzzled.color.splitter;
	}

	public onOutside(): void
	{
		this.drawable.fillcolor = this._puzzled.color.marked;
	}
}
