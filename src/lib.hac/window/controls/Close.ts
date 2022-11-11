import * as Paperless from '@zone09.net/paperless';



export class Close extends Paperless.Controls.Button
{
	public constructor(callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);

		this.movable = false;
		this.focusable = false;
	}

	public onInside(): void
	{
		this.drawable.shadow = 5;
	}

	public onOutside(): void
	{
		this.drawable.shadow = 0;
	}
}
