import {Icon} from './Icon.js';



export class Splitter extends Icon
{
	public onInside(): void
	{
		this.drawable.toFront();
		this.drawable.fillcolor = this.puzzled.color.splitter;
	}

	public onOutside(): void
	{
		this.drawable.fillcolor = this.puzzled.color.marked;
	}
}

