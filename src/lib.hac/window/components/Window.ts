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

	public constructor(attributes: IComponentWindowAttributes = {})
	{
		super({
			...{
				size: {width: 512, height: 256},
				point: {
					x: (Math.random() * (window.innerWidth - 512 - 50)) + (512 / 2) + 25, 
					y: (Math.random() * (window.innerHeight - 256 - 50)) + (256 / 2) + 25
				},		
			},
			...attributes, 
			...{
				linewidth: 1, 
				nostroke: false 
			}
		});

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
			header: {...{visible: true, padding: {top: 5, left: 5}, content:'Window', fillcolor: '#151515', strokecolor: '#151515', fillbackground: '#815556'}, ...header, ...{sticky: sticky, nostroke: false}},
			close: {...{visible: true, content: Assets.delete, shadowcolor: '#151515', showdow: 5, hoverable: true, offset: {x: -2, y: 1}}, ...close, ...{sticky: sticky, autosize: true}},
			puzzled: {...{spacing: 5}, ...puzzled, ...{sticky: sticky, expandable: false}}
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

		this._puzzled = this.context.attach(new Puzzled({
			...this._attributes.puzzled,
			...{
				size: {width: this.width, height: this.height}
			}
		}));
		this._puzzled.x = this.x - ((this._puzzled.width + this._attributes.puzzled.spacing) / 2);
		this._puzzled.y = this.y - ((this._puzzled.height + this._attributes.puzzled.spacing) / 2) + (header / 2);

		drawable = this.context.attach(new Paperless.Drawables.Rectangle({
			...this._attributes.rectangle,
			...{
				point: {x: this.x, y: this.y},
				size: {
					width: this._puzzled.width + (this._attributes.padding * 2),
					height: this._puzzled.height + (this._attributes.padding * 2) + header + (header > 0 ? 3 : 0)
				}
			}
		}));

		this._background.attach(drawable);
		this._entities.attach(this._background.drawable);

		if(this._attributes.header.visible)
		{
			this._header = this.context.attach(new Header());

			drawable = this.context.attach(new Paperless.Drawables.Label({
				...this._attributes.header, 
				...{
					point: {x: this.x, y: this.y},
					size: {width: this._puzzled.width - 3 + (this._attributes.padding * 2), height: header},
					offset: {x: 0, y: ((-this._puzzled.height) / 2) - this._attributes.padding}
				}
			}));
			this._header.attach(drawable);
			this._entities.attach(this._header.drawable);

			if(this._attributes.close.visible)
			{
				this._close = this.context.attach(new Close({
					callbackLeftClick: () => { this.context.detach(this.guid); }
				}));
	
				drawable = this.context.attach(new Paperless.Drawables.Artwork({
					...this._attributes.close, 
					...{
						point: {x: this.x, y: this.y},
						offset: {x: (this._background.drawable.width / 2) - 13 + this._attributes.close.offset.x, y: (-this._background.drawable.height / 2) + 13 + this._attributes.close.offset.y}
					}
				}));
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

	public open(): Promise<any>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		});
	}

	public close(): void
	{
		this.context.detach(this.guid, Paperless.Enums.Restrict.none);
	}

	public new(entities: Array<{point?: Paperless.Point, size?: Paperless.Size, control: typeof EntityCoreControl, drawable: typeof EntityCoreDrawable, attributes?: any, backdoor?: any, transpose?: boolean}>): EntityCoreControl
	{
		let control: EntityCoreControl;

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
