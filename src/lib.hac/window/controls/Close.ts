import * as Paperless from '@zone09.net/paperless';



export class Close extends Paperless.Controls.Button
{
	private _shadow: number;
	//---

	public constructor(attributes: Paperless.Interfaces.IControlButtonAttributes = {})
	{
		super(attributes);

		this.movable = false;
		this.focusable = false;
	}

	public onDrawable(): void
	{
		this._shadow = Number(this.drawable.shadow);
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
