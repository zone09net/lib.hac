import * as Paperless from '@zone09.net/paperless';



export class Background extends Paperless.Controls.Button
{
	public constructor(attributes: Paperless.Interfaces.IControlButtonAttributes = {})
	{
		super(attributes);

		this.movable = false;
	}
}
