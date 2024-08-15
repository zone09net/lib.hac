import * as Paperless from '@zone09.net/paperless';
import {Item} from '../controls/Item.js'
import {Manipulator} from '../controls/Manipulator.js';
import {IComponentSelectorAttributes} from '../interfaces/ISelector.js';



export class Selector extends Paperless.Component
{
	private _items: Item[] = [];
	private _manipulator: Manipulator;
	private _attributes: IComponentSelectorAttributes;
	//---

	public constructor(attributes: IComponentSelectorAttributes = {})
	{
		const context: Paperless.Context = attributes.context;

		super({
			...attributes,
			...{
				context: null,
				layer: null,
			}
		});

		const {
			padding = {},
			spacing = 10,
			manipulator = new Manipulator(),
			items = [],
			layer = null,
		} = attributes;

		this._attributes = {
			padding: {...{top: 0, bottom: 0, left: 0, right: 0}, ...padding},
			spacing: spacing,
			items: items
		};

		this._manipulator = manipulator;
		this._manipulator.selector = this;

		context ? context.attach(this, layer) : null;
	}

	public onAttach(): void
	{
		if(this._attributes.items.length > 0)
			this.attach(this._attributes.items);
		/*
		const length: number = this._attributes.drawables.length;
		const layer: number = Paperless.Layer.decode(this.guid);

		if(length > 0)
		{
			let items: Item[] = [];

			for(let i = 0; i < length; i++)
			{
				const drawable: Paperless.Drawable = this.context.attach(this._attributes.drawables[i], layer);

				const control: Item = new this._attributes.control({
					context: this.context,
					layer: layer,
					drawable: this._attributes.drawables[i]
				});

				console.log(this._attributes.control);
				items.push(control);
			}

			this.attach(items);
		}
		*/
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

	public attach(items: Item | Item[]): void
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

		this._manipulator.onInitializing();
	}

	public getDrawables(): Array<Paperless.Drawable>
	{
		const drawables: Paperless.Drawable[] = [];

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

	get padding(): Paperless.Interfaces.IPadding
	{
		return this._attributes.padding;
	}
	set padding(padding: Paperless.Interfaces.IPadding)
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

