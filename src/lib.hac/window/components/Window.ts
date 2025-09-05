import * as Paperless from '@zone09.net/paperless';
import {IComponentWindowAttributes} from '../interfaces/IWindow.js';
import {IComponentPuzzledEntity} from '../../puzzled/interfaces/IPuzzled.js';
import {Close} from '../controls/Close.js';
import {Header} from '../controls/Header.js';
import {Assets} from '../drawables/Assets.js';
import {Puzzled} from '../../puzzled/components/Puzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {Form} from '../../form/components/Form.js';



export class Window extends Paperless.Component
{
	private _background: Paperless.Control;
	private _header: Paperless.Control;
	private _puzzled: Puzzled;
	private _close: Close;
	private _attributes: IComponentWindowAttributes;
	private _entities: Paperless.Group;
	private _form: Form;
	//---

	public constructor(attributes: IComponentWindowAttributes = {})
	{
		const context: Paperless.Context = attributes.context;

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
				nostroke: false,
				context: null,
				layer: null,
			}
		});

		const {
			autoopen = false,
			padding = {},
			header = {},
			rectangle = {},
			close = {},
			puzzled = {},
			sticky = true,
			layer = null,

			onOpen = null,
			onClose = null,
			onCancel = null,
			onSubmit = null,
			onNoSubmit = null,
		} = attributes;

		this._attributes = {
			padding: {...{top: 0, bottom: 0, left: 0, right: 0}, ...padding},
			rectangle: {
				...{
					fillcolor: '#151515', 
					strokecolor: '#815556', 
					linewidth: 2
				}, 
				...rectangle, 
				...{
					sticky: sticky
				}
			},
			header: {
				...{
					thickness: 26,
					visible: true, 
					padding: {top: 5, left: 5}, 
					content:'Window', 
					fillcolor: '#151515', 
					strokecolor: '#151515', 
					fillbackground: '#815556'
				}, 
				...header, 
				...{
					linewidth: 1,
					sticky: sticky, 
					nostroke: false
				}
			},
			close: {
				...{
					visible: true, 
					content: Assets.close, 
					shadowcolor: '#151515', 
					shadow: 5, 
					hoverable: true, 
					offset1: {x: 1, y: 1}
				}, 
				...close, 
				...{
					sticky: sticky, 
					autosize: true
				}
			},
			puzzled: {
				...{
					spacing: 0,
					nostroke: true,
				}, 
				...puzzled, 
				...{
					sticky: sticky, 
					expandable: {width: false, height: false}
				}
			}
		}

		this.sticky = sticky;

		this._form = new Form();

		onOpen ? this.onOpen = onOpen : null;
		onClose ? this.onClose = onClose : null;
		onCancel ? this.onCancel = onCancel : null;
		onSubmit ? this._form.onSubmit = onSubmit : null;
		onNoSubmit ? this._form.onNoSubmit = onNoSubmit : null;

		context ? context.attach(this, layer) : null;

		if(autoopen)
			this.open().then(() => { this.onClose(this) });
	}
	
	public onAttach(): void
	{
		const layer: number = Paperless.Layer.decode(this.guid);

		if(!this._attributes.header.visible)
			this._attributes.header.thickness = 0;

		this._entities = new Paperless.Group({
			context: this.context,
			layer: layer
		});

		this._puzzled = new Puzzled({
			...this._attributes.puzzled,
			...{
				point: {
					x: this.x + this._attributes.padding.left, 
					y: this.y + this._attributes.padding.top + this._attributes.header.thickness
				},
				size: {
					width: this.width - this._attributes.padding.left - this._attributes.padding.right, 
					height: this.height - this._attributes.padding.top - this._attributes.padding.bottom - this._attributes.header.thickness
				}
			},
			context: this.context,
			layer: layer,
		});

		this._form.puzzled = this._puzzled;

		this._background = new Paperless.Control({
			context: this.context,
			layer: layer,
			movable: false,
			drawable: new Paperless.Drawables.Rectangle({
				...this._attributes.rectangle,
				...{
					context: this.context,
					layer: layer,
					point: {x: this.x, y: this.y},
					size: {width: this.width, height: this.height},
					offset1: {x: (this.width / 2), y: (this.height / 2)}
				}
			}),
		});

		this._entities.attach(this._background.drawable);

		if(this._attributes.header.visible)
		{
			this._header = new Header({
				context: this.context,
				layer: layer,
				drawable: new Paperless.Drawables.Label({
					...this._attributes.header, 
					...{
						context: this.context,
						layer: layer,
						point: {x: this.x, y: this.y + (this._attributes.header.thickness / 2)},
						size: {width: this.width - 3, height: this._attributes.header.thickness - 3},
						offset1: {x: (this.width / 2), y: 0}
					}
				}),
				onDragBegin: () => { 
					const layer: number = Paperless.Layer.decode(this.guid);

					this.puzzled.removeMarkerAll();

					// ?????
					if(this._attributes.close.visible)
						this._close.drawable.toFront(Paperless.Enums.Restrict.norefresh);

					for(let drawable of this._puzzled.getDrawables())
						drawable.toFront(Paperless.Enums.Restrict.norefresh);

					this.context.getDrawables(layer).sort();
					this.context.getControls(layer).reverse();
					this.context.states.sorted = true
				},
				onDrag: () => {
					this.x = this._background.drawable.x;
					this.y = this._background.drawable.y;
					this._puzzled.x = this._background.drawable.x + this._attributes.padding.left;
					this._puzzled.y = this._background.drawable.y + this._attributes.padding.top + this._attributes.header.thickness;
				},
				onDragEnd: () => {
					this.x = this._background.drawable.x;
					this.y = this._background.drawable.y;
					this._puzzled.x = this._background.drawable.x + this._attributes.padding.left;
					this._puzzled.y = this._background.drawable.y + this._attributes.padding.top + this._attributes.header.thickness;
				}
			});

			this._entities.attach(this._header.drawable);

			if(this._attributes.close.visible)
			{
				this._close = new Close({
					context: this.context,
					layer: layer,
					drawable: new Paperless.Drawables.Artwork({
						...this._attributes.close, 
						...{
							context: this.context,
							layer: layer,
							point: {x: this.x, y: this.y},
							offset1: {
								x: this._header.drawable.width + (this._header.drawable.linewidth * 2) - 
									(this._attributes.header.thickness / 2) + this._attributes.close.offset1.x, 
								y: (this._attributes.header.thickness / 2) - this._header.drawable.linewidth + this._attributes.close.offset1.y
							}
						}
					}),
					callbackLeftClick: () => { 
						this.onCancel(this);
						this.context.detach(this.guid);
					}
				});

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
			this._puzzled.guid,
			this._form.guid
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

	public open(): Promise<unknown>
	{
		const norefresh: boolean = this.context.states.norefresh;
		
		this.context.states.norefresh = true;
		this.onOpen(this);

		if(!norefresh)
			this.context.states.norefresh = false;

		return new Promise((resolve, reject) => {
			const submit: EntityCoreControl = this._form.getSubmit();

			if(submit)
			{
				submit.onLeftClick = () => {
					this._form.onSubmit(this._form).then(
						(success) => { resolve(success); },
						(error) => { this._form.onNoSubmit(error); }
					);
				}
			}
		});
	}

	public onOpen(self?: Window): void {}

	public onClose(self?: Window): void {}

	public onCancel(self?: Window): void {}

	public close(): void
	{
		this.context.detach(this.guid, Paperless.Enums.Restrict.none);
	}

	public new(entities: IComponentPuzzledEntity[]): EntityCoreControl
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
				minimum: entity.minimum,
				control: entity.control,
				drawable: entity.drawable,
				attributes: { ...attributes, ...{sticky: this.sticky} },
				backdoor: attributes.backdoor
			}]);
		}

		return control;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}

	public get form(): Form
	{
		return this._form;
	}

	public get background(): Paperless.Control
	{
		return this._background;
	}
}

