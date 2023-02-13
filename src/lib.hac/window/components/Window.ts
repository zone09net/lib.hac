import * as Paperless from '@zone09.net/paperless';
import {IComponentWindowAttributes} from '../interfaces/IWindow.js';
import {Close} from '../controls/Close.js';
import {Header} from '../controls/Header.js';
import {Background} from '../controls/Background.js';
import {Assets} from '../../puzzled/drawables/Assets.js';
import {Puzzled} from '../../puzzled/components/Puzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';



export class Window extends Paperless.Component
{
	private _background: Paperless.Controls.Blank;
	private _header: Paperless.Controls.Blank;
	private _puzzled: Puzzled;
	private _close: Close;
	private _attributes: IComponentWindowAttributes;
	private _entities: Paperless.Group;
	//---

	public constructor(point: Paperless.Point, size: Paperless.Size, attributes: IComponentWindowAttributes = {})
	{
		super(!point ? new Paperless.Point((Math.random() * (window.innerWidth - size.width - 50)) + (size.width / 2) + 25, (Math.random() * (window.innerHeight - size.height - 50)) + (size.height / 2) + 25) : point, size, {...attributes, ...{linewidth: 1, nostroke: false}});

		const {
			padding = 5,
			header = {},
			rectangle = {},
			close = {},
			puzzled = {},
			sticky= true,
		} = attributes;

		this.sticky = sticky;
		this._attributes = {
			padding: padding,
			rectangle: {...{fillcolor: '#151515', strokecolor: '#815556', linewidth: 2}, ...rectangle, ...{sticky: sticky}},
			header: {...{visible: true, padding: {top: 5, left: 5}, fillcolor: '#151515', strokecolor: '#151515'}, ...header, ...{sticky: sticky, nostroke: false}},
			close: {...{visible: true, content: Assets.delete, shadowcolor: '#151515', hoverable: true, offset: {x: 0, y: 1}}, ...close, ...{sticky: sticky, autosize: true}},
			puzzled: {...{}, ...puzzled, ...{sticky: sticky, expandable: false}}
		}
	}
	
	public onAttach(): void
	{
		let drawable: Paperless.Drawable;
		let header: number = 0;

		if(this._attributes.header.visible)
			header = 26;

		this._entities = this.context.attach(new Paperless.Group());
		this._background = this.context.attach(new Background());
		this._puzzled = this.context.attach(new Puzzled(new Paperless.Point(0, 0), this.size, this._attributes.puzzled));
		this._puzzled.point = new Paperless.Point(this.point.x - ((this._puzzled.size.width + this._attributes.puzzled.spacing) / 2), this.point.y - ((this._puzzled.size.height + this._attributes.puzzled.spacing) / 2) + (header / 2));

		drawable = this.context.attach(new Paperless.Drawables.Rectangle(this.point, new Paperless.Size(this._puzzled.size.width + (this._attributes.padding * 2), this._puzzled.size.height + (this._attributes.padding * 2) + header + (header > 0 ? 3 : 0)), this._attributes.rectangle));
		this._background.attach(drawable);
		this._entities.attach(this._background.drawable);

		if(this._attributes.header.visible)
		{
			this._header  = this.context.attach(new Header());

			drawable = this.context.attach(new Paperless.Drawables.Label(this.point, new Paperless.Size(this._puzzled.size.width - 3 + (this._attributes.padding * 2), header), {...this._attributes.header, ...{offset: {x: 0, y: ((-this._puzzled.size.height) / 2)- this._attributes.padding }}}));
			this._header.attach(drawable);
			this._entities.attach(this._header.drawable);

			if(this._attributes.close.visible)
			{
				this._close = this.context.attach(new Close(() => { this.context.detach(this.guid); }));
	
				drawable = this.context.attach(new Paperless.Drawables.Artwork(this.point, new Paperless.Size(0, 0), {...this._attributes.close, ...{offset: {x: (this._background.drawable.size.width / 2) - 13 + this._attributes.close.offset.x, y: (-this._background.drawable.size.height / 2) + 13 + this._attributes.close.offset.y}}}));
				this._close.attach(drawable);
				this._entities.attach(this._close.drawable);
			}
		}
	}
		
	public onDetach(): void
	{
		this.context.detach([
			this._entities.guid,
			this._background.drawable.guid, 
			this._background.guid, 
			this._puzzled.guid
		]);

		if(this._attributes.header.visible)
		{
			this.context.detach([
				this._header.drawable.guid,
				this._header.guid,
			]);

			if(this._attributes.close.visible)
			{
				this.context.detach([
					this._close.drawable.guid,
					this._close.guid,
				]);
			}
		}
	}

	public open(): Promise<void>
	{
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	public close(): void
	{
		this.context.detach(this.guid, Paperless.Enums.Restrict.none);
	}

	public new(entities: Array<{point?: Paperless.Point, size?: Paperless.Size, control: typeof EntityCoreControl, drawable: typeof EntityCoreDrawable, attributes?: any, backdoor?: any, transpose?: boolean}>): Paperless.Control
	{
		let control: Paperless.Control;

		for(let entity of entities)
		{
			const {
				attributes = {},
			} = entity;
			entity.attributes = attributes;

			control = this._puzzled.new([{
				point: entity.point,
				size: entity.size,
				control: entity.control,
				drawable: entity.drawable,
				transpose: entity.transpose,
				attributes: { ...attributes, ...{sticky: this.sticky} },
				backdoor: entity.backdoor
			}]);

			if(control)
				this._entities.attach(control.drawable);
		}

		return control;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}
}
