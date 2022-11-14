import {Selector} from '../components/Selector.js';
import {Item} from './Item.js';



export class Manipulator
{
	private _selector: Selector;
	//---

	public constructor() {}

	public onInitializing(): void {}

	public onPopping(item: Item): void {}

	public maxItemWidth(): number
	{
		let width: number = 0;

		for(let selector of this.selector.items)
		{
			if(selector.drawable)
			{
				if(selector.drawable.size.width > width)
					width = selector.drawable.size.width;
			}
		}

		return width;
	}

	public maxItemHeight(): number
	{
		let height: number = 0;

		for(let selector of this.selector.items)
		{
			if(selector.drawable)
			{
				if(selector.drawable.size.height > height)
					height = selector.drawable.size.height;
			}
		}

		return height;
	}

	public disableItems(): void
	{
		for(let item of this.selector.items)
		{
			item.enabled = false;
			item.drawable.hoverable = false;
		}
	}

	public enableItems(): void
	{
		for(let item of this.selector.items)
		{
			item.enabled = true;
			item.drawable.hoverable = true;
		}
	}



	// Accessors
	// --------------------------------------------------------------------------

	get selector(): Selector
	{
		return this._selector;
	}
	set selector(selector: Selector)
	{
		this._selector = selector;
	}
}
