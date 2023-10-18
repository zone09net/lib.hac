import * as Paperless from '@zone09.net/paperless';



export class Header extends Paperless.Controls.Button
{
	private _delay: number;
	//---

	public constructor(attributes: Paperless.Interfaces.IControlButtonAttributes = {})
	{
		super(attributes);
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
