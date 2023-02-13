import * as Paperless from '@zone09.net/paperless';



export class Header extends Paperless.Controls.Button
{
	private _delay: number;
	//---

	public constructor(callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);
	}

	public onInside(): void
	{
		this._delay = this.context.dragging.delay;
		this.context.dragging.delay = 0;
	}

	public onOutside(): void
	{
		this.context.dragging.delay = this._delay;
	}
}
