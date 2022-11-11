import * as Paperless from '@zone09.net/paperless';
import {Item} from '../controls/Item.js'
import {Manipulator} from '../controls/Manipulator.js';
import {IComponentSelectorAttributes} from '../interfaces/ISelector.js';



export class Selector extends Paperless.Component
{
	private _items: Array<Item> = [];
	private _manipulator: Manipulator;
	private _attributes: IComponentSelectorAttributes;
	//---

	public constructor(point: Paperless.Point, size: Paperless.Size, manipulator: Manipulator, attributes: IComponentSelectorAttributes = {})
	{
		super(point, size);

		const {
			padding = {},
			spacing = 10,
		} = attributes;

		this._attributes = {
			padding: {...{top: 0, bottom: 0, left: 0, right: 0}, ...padding},
			spacing: spacing,
		};

		this._manipulator = manipulator;
		this._manipulator.selector = this;
	}

	public onAttach(): void
	{
		this._manipulator.onInitializing();
	}

	public onDetach(): void
	{
		for(let item of this._items)
		{
			this.context.detach(item.drawable.guid);
			this.context.detach(item.guid);
		}
	}

	public clear(): void
	{
		this._items = [];
	}

	public attach(items: Item | Array<Item>): void
	{
		if(items instanceof Array)
		{
			for(let item of items)
				item.selector = this;

			this._items = [...this._items, ...items];
		}
		else
		{
			items.selector = this;
			this._items.push(items);
		}
	}

	public getDrawables(): Array<Paperless.Drawable>
	{
		let drawables: Array<Paperless.Drawable> = [];

		for(let item of this._items)
			drawables.push(item.drawable);

		return drawables;
	}



	// Accessors
	// --------------------------------------------------------------------------

	get items(): Array<Item>
	{
		return this._items;
	}

	get manipulator(): Manipulator
	{
		return this._manipulator;
	}

	get padding(): {top?: number, bottom?: number, left?: number, right?: number}
	{
		return this._attributes.padding;
	}
	set padding(padding: {top?: number, bottom?: number, left?: number, right?: number})
	{
		this._attributes.padding = padding;
	}

	get spacing(): number
	{
		return this._attributes.spacing;
	}
	set spacing(spacing: number)
	{
		this._attributes.spacing = spacing;
	}
}
