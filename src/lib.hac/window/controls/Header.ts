import * as Paperless from '@zone09.net/paperless';



export class Header extends Paperless.Controls.Button
{
	public constructor(callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);
	}

	public onFocus(): void
	{
		this.drawable.toFront();
	}
}
