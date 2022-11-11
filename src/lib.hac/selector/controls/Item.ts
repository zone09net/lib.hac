import * as Paperless from '@zone09.net/paperless';
import {Selector} from '../components/Selector.js';



export class Item extends Paperless.Control
{
	private _selector: Selector;
	//---

	public constructor()
	{
		super();

		this.movable = false;
		this.focusable = false;
	}

	public onLoading(): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onLoaded(): void {}

	public onLeftClick(): void 
	{
		this.selector.manipulator.onPopping(this);
		this.onSelection();
	}

	public onBeforeSelection(): void {}
	public onSelection(): void {}
	public onAfterSelection(): void {}



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
