import * as Paperless from '@zone09.net/paperless';



export class Color extends Paperless.Controls.Button
{
	/*
	public constructor(attributes: Paperless.Interfaces.IControlButtonAttributes = {})
	//public constructor(callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(attributes);
		//super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);
	}
	*/

	public onInside(): void
	{
		this.drawable.strokecolor = '#ffffff';
		this.drawable.shadow = 5;
		this.drawable.linewidth = 1;
		this.drawable.nostroke = false;
	}

	public onOutside(): void
	{
		this.drawable.shadow = 0;
		this.drawable.nostroke = true;
	}
}
