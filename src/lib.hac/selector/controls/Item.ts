import * as Paperless from '@zone09.net/paperless';
import {Selector} from '../components/Selector.js';
import {IControlItemAttributes} from '../interfaces/ISelector.js';



export class Item extends Paperless.Control
{
	private _selector: Selector;
	//---

	public constructor(attributes: IControlItemAttributes = {})
	{
		const context: Paperless.Context = attributes.context;
		const drawable: Paperless.Drawable = attributes.drawable;

		super({
			...attributes,
			  ...{
			  	  movable: false,
			  	  focusable: false,
			  	  context: null,
			  	  drawable: null,
			  }
		});

		const {
			onBeforeSelection = null,
			onSelection = null,
			onAfterSelection = null,
			layer = null
		} = attributes;

		onBeforeSelection ? this.onBeforeSelection = onBeforeSelection : null;
		onSelection  ? this.onSelection  = onSelection  : null;
		onAfterSelection ? this.onAfterSelection = onAfterSelection : null;

		context ? context.attach(this, layer) : null;
		drawable ? this.attach(drawable) : null;
	}

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
