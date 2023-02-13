import * as Paperless from '@zone09.net/paperless';
import {IComponentPopopAttributes} from '../interfaces/IPopup.js';



export class Popup extends Paperless.Component
{
	private _attributes: IComponentPopopAttributes;
	private _dark: Paperless.Drawables.Rectangle;
	private _title: Paperless.Drawables.Label;
	private _detail: Paperless.Drawables.Label;
	private _control: Paperless.Controls.Button;
	//---

	public constructor(attributes: IComponentPopopAttributes = {})
	{
		super(new Paperless.Point(0, 0), new Paperless.Size(0, 0), attributes);

		const {
			title = {},
			detail = {},
			dark = {},
			width = 300,
			noclick = false,
			passthrough = false,
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
				...{ fillcolor: '#000000',  alpha: 0.90 },
				...dark,
				...{ nostroke: true, sticky: true}
			},
			width: width,
			noclick: noclick,
			passthrough: passthrough
		};
	}

	public onAttach(): void
	{
		this.size = this.context.size;
		this.point = new Paperless.Point(this.size.width / 2, this.size.height / 2);

		this._dark = new Paperless.Drawables.Rectangle(this.point, this.context.size, this._attributes.dark);
		this._title = new Paperless.Drawables.Label(new Paperless.Point(this.point.x, this.point.y), new Paperless.Size(1, 1), this._attributes.title);
		this._detail = new Paperless.Drawables.Label(new Paperless.Point(this.point.x, this.point.y), new Paperless.Size(1, 1), this._attributes.detail);	

		this._control = new Paperless.Controls.Button((resolve) => {
			this.context.detach([
				this._title.guid,
				this._detail.guid,
				this._dark.guid,
				this._control.guid
			]);

			resolve(null);
		}, null, null, null, {movable: false});
	}

	private generate(): number
	{
		this._title.generate();

		let width: number = this._title.size.width;
		let height: number = 0;

		if(!this._title.content)
			width = this._attributes.width;

		this._title.x = this.point.x - (width / 2);
		this._title.y = this.point.y - (this._title.size.height / 2);

		this._detail.x = this.point.x - (width / 2);
		this._detail.size.width = width;
		this._detail.generate();
		this._detail.y = this.point.y - (this._detail.size.height / 2);

		let top = this._title.size.height + 20;

		if(this._title.content && this._detail.content)
		{
			height = top + this._detail.size.height;
			this._detail.alpha = 0;
			this._detail.y = this.point.y + ((height / 2) - this._detail.size.height);
		}
		else
			height = top;

		return height;
	}

	public open(): Promise<unknown>
	{
		this.context.attach(this._dark);
		if(this._title.content)
			this.context.attach(this._title);
		if(this._detail.content)
			this.context.attach(this._detail);
		this.context.attach(this._control);
		this._control.attach(this._dark);
		this._control.enabled = !this._attributes.noclick;

		let height = this.generate();

		return new Promise((resolve, reject) => {
			if(this._attributes.passthrough)
				resolve(true);
			else
			{
				this._control.smugglerLeftClick = resolve;
				
				if(this._title.content && this._detail.content)
				{
					this.fx.add({
						duration: 400,
						drawable: this._title,
						effect: this.fx.translate,
						smuggler: { ease: Paperless.Fx.easeInOutExpo, angle: 270, distance: this._title.y - (this.point.y - (height / 2)) },
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
	}
}