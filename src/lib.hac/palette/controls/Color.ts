import * as Paperless from '@zone09.net/paperless';



export class Color extends Paperless.Control
{
	public onInside(): void
	{
		this.drawable.strokecolor = '#000000';
		this.drawable.shadowcolor = '#000000';
		this.drawable.linewidth = 4;
		this.drawable.nostroke = false;
		this.drawable.shadow = 10;
		this.drawable.toFront();

	}

	public onOutside(): void
	{
		this.drawable.shadow = 0;
		this.drawable.nostroke = true;
	}
}
