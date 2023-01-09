import * as Paperless from '@zone09.net/paperless';



export class Close extends Paperless.Controls.Button
{
	private _shadow: number = 0;
	//---

	public constructor(callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);

		this.movable = false;
		this.focusable = false;
	}

	public onDrawable(): void
	{
		this._shadow = this.drawable.shadow;
		this.drawable.shadow = 0;
	}

	public onInside(): void
	{
		this.drawable.shadow = this._shadow;
	}

	public onOutside(): void
	{
		this.drawable.shadow = 0;
	}
}
