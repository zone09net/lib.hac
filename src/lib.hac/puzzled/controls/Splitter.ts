import {Icon} from './Icon.js';



export class Splitter extends Icon
{
	public onInside(): void
	{
		this.drawable.toFront();
		this.drawable.fillcolor = this.puzzled.color.splitter;
		this.drawable.shadowcolor = '#000000';
		this.drawable.shadow = this.puzzled.shadow;
	}

	public onOutside(): void
	{
		this.drawable.fillcolor = this.puzzled.color.marked;
		this.drawable.shadow = 0;
	}
}

