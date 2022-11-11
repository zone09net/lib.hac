import * as Paperless from '@zone09.net/paperless';



export class Background extends Paperless.Controls.Button
{
	public constructor(callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);

		this.movable = false;
	}

	public onFocus(): void
	{
		this.drawable.toFront();
	}
}
