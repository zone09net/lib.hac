import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {IControlIconAttributes} from '../interfaces/IPuzzled.js';



export class Icon extends Paperless.Controls.Button
{
	private _puzzled: Puzzled;
	//---

	public constructor(attributes: IControlIconAttributes = {})
	{
		super(attributes);

		this.movable = false;
		this.focusable = false;

		this._puzzled = attributes.puzzled;

		if(this.drawable)
			this.drawable.shadowcolor = this._puzzled.color.iconshadow;
	}

	public onInside(): void
	{
		this.drawable.shadow = this._puzzled.shadow;
	}

	public onOutside(): void
	{
		this.drawable.shadow = 0;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}
}
