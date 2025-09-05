import * as Paperless from '@zone09.net/paperless';
import {IComponentPopupAttributes} from '../interfaces/IPopup.js';



export class Popup extends Paperless.Component
{
	private _attributes: IComponentPopupAttributes;
	private _dark: Paperless.Drawables.Rectangle;
	private _title: Paperless.Drawables.Label;
	private _detail: Paperless.Drawables.Label;
	private _control: Paperless.Controls.Button;
	//---

	// @ts-ignore
	public constructor(attributes: IComponentPopupAttributes = {})
	{
		const context: Paperless.Context = attributes.context;

		super({
			...attributes,
			...{
				context: null,
			}
		});

		const {
			title = {},
			detail = {},
			dark = {},
			width = 300,
			autoopen = false,
			noclick = false,
			passthrough = false,
			layer = null,

			onOpen = null,
			onClose = null,
		} = attributes;

		this._attributes = {
			title: {
				...title, 
				...{ autosize: true, corner: true, multiline: false, sticky: true, generate: false, hoverable: false} 
			},
			detail: {
				...detail, 
				...{ autosize: true, multiline: true, wrapping: true, corner: true, sticky: true, generate: false, hoverable: false} 
			},
			dark: {
				...{ fillcolor: '#000000',  alpha: 0.95 },
				...dark,
				...{ nostroke: true, sticky: true}
			},
			width: width,
			noclick: noclick,
			passthrough: passthrough
		};

		context ? context.attach(this, layer) : null;

		onOpen ? this.onOpen = onOpen : null;
		onClose ? this.onClose = onClose : null;

		if(autoopen)
			this.open();
	}

	public onAttach(): void
	{
		this.x = this.context.canvas.width / 2;
		this.y = this.context.canvas.height / 2;

		this._dark = new Paperless.Drawables.Rectangle({...this._attributes.dark, ...{point: {x: this.x, y: this.y}, size: {width: this.context.canvas.width, height: this.context.canvas.height}}});
		this._title = new Paperless.Drawables.Label({...this._attributes.title, ...{point: {x: this.x, y: this.y}}});
		this._detail = new Paperless.Drawables.Label({...this._attributes.detail, ...{point: {x: this.x, y: this.y}}});	

		this._control = new Paperless.Controls.Button({
			movable: false,
			callbackLeftClick: (resolve) => {
				this.onClose(this);

				this.context.detach([
					this._title.guid,
					this._detail.guid,
					this._dark.guid,
					this._control.guid
				]);

				resolve(null);
			},
		});
	}

	public onResize(): void
	{
		const width: number = Math.max(this._title.width, this._attributes.width);
		let height: number = 0;

		this.x = this.context.canvas.width / 2;
		this.y = this.context.canvas.height / 2;

		this._title.x = this.x - (width / 2);
		this._title.y = this.y - (this._title.height / 2);

		this._detail.x = this.x - (width / 2);
		this._detail.y = this.y - (this._detail.height / 2);

		const top = this._title.height + 20;

		if(this._title.content && this._detail.content)
		{
			height = top + this._detail.height;
			this._detail.y = this.y + ((height / 2) - this._detail.height);
			this._title.y = this.y - (height / 2);
		}

		this._dark.x = this.x;
		this._dark.y = this.y;
		this._dark.width = this.context.canvas.width;
		this._dark.height = this.context.canvas.height;
		this._dark.generate();
	}

	private generate(): number
	{
		this._title.generate();

		const width: number = Math.max(this._title.width, this._attributes.width);
		let height: number = 0;

		this._title.x = this.x - (width / 2);
		this._title.y = this.y - (this._title.height / 2);

		this._detail.x = this.x - (width / 2);
		this._detail.width = width;
		this._detail.generate();
		this._detail.y = this.y - (this._detail.height / 2);

		const top = this._title.height + 20;

		if(this._title.content && this._detail.content)
		{
			height = top + this._detail.height;
			this._detail.alpha = 0;
			this._detail.y = this.y + ((height / 2) - this._detail.height);
		}
		else
			height = top;

		return height;
	}

	public open(): Promise<void>
	{
		const layer: number = Paperless.Layer.decode(this.guid);

		this.context.attach(this._dark, layer);
		if(this._title.content)
			this.context.attach(this._title, layer);
		if(this._detail.content)
			this.context.attach(this._detail, layer);
		this.context.attach(this._control, layer);
		this._control.attach(this._dark);
		this._control.enabled = !this._attributes.noclick;

		const height = this.generate();

		this.onOpen(this);

		return new Promise((resolve, reject) => {
			if(this._attributes.passthrough)
				resolve();
			else
			{
				this._control.smugglerLeftClick = resolve;
				
				if(this._title.content && this._detail.content)
				{
					this.fx.add({
						duration: 400,
						drawable: this._title,
						effect: this.fx.translate,
						smuggler: { ease: Paperless.Fx.easeInOutExpo, angle: 270, distance: this._title.y - (this.y - (height / 2)) },
						complete: () => {
							this.fx.add({
								duration: 400,
								drawable: this._detail,
								effect: this.fx.fadeIn,
								smuggler: { ease: Paperless.Fx.easeInOutExpo },
								complete: () => {
									if(!this._attributes.noclick)
									{
										this._control.enabled = true;
										this.context.refresh();
									}
								}
							});
						}
					});
				}
				else
				{
					if(!this._attributes.noclick)
						this._control.enabled = true;
				}
			}
		});
	}

	public close()
	{
		this._control.callbackLeftClick(this._control.smugglerLeftClick);
		this.context.refresh();
	}

	public onOpen(self?: Popup): void {}

	public onClose(self?: Popup): void {}

	public onDetach(): void
	{
		this.context.detach([
			this._title.guid,
			this._detail.guid,
			this._dark.guid,
			this._control.guid,
			//this.guid
		]);
	}



	// Accessors
	// --------------------------------------------------------------------------

	get childs(): {title: Paperless.Drawables.Label, detail: Paperless.Drawables.Label, dark: Paperless.Drawables.Rectangle}
	{
		return {title: this._title, detail: this._detail, dark: this._dark};
	}

	public get width(): number
	{
		return this._attributes.width;
	}
	public set width(width: number)
	{
		this._attributes.width = width;
	}

	public get noclick(): boolean
	{
		return this._attributes.noclick;
	}
	public set noclick(noclick: boolean)
	{
		this._attributes.noclick = noclick;
		this._control.enabled = !noclick;
	}

	public get passthrough(): boolean
	{
		return this._attributes.passthrough;
	}
	public set passthrough(passthrough: boolean)
	{
		this._attributes.passthrough = passthrough;
	}
}
