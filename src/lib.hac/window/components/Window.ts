import * as Paperless from '@zone09.net/paperless';
import {IComponentWindowAttributes} from '../interfaces/IWindow.js';
import {Close} from '../controls/Close.js';
import {Header} from '../controls/Header.js';
import {Background} from '../controls/Background.js';
import {Assets} from '../../puzzled/drawables/Assets.js';



export class Window extends Paperless.Component
{
	private _background: Paperless.Controls.Blank;
	private _header: Paperless.Controls.Blank;
	private _caption: Paperless.Drawables.Label;
	private _close: Close;
	private _attributes: IComponentWindowAttributes;
	//---

	public constructor(point: Paperless.Point, size: Paperless.Size, attributes: IComponentWindowAttributes = {})
	{
		super(point, size, attributes);

		const {
			padding = 10,
			label = {},
			rectangle = {},
			artwork = {},
			puzzled = {},
			sticky= true,
		} = attributes;

		this.sticky = sticky;
		this._attributes = {
			rectangle: {...{fillcolor: '#151515', strokecolor: '#815556', linewidth: 7}, ...rectangle, ...{sticky: sticky}},
			label: {...{padding: {top: 6, left: 5}, fillcolor: '#151515', font: '16px SegoeUI-Bold'}, ...label, ...{sticky: sticky}},
			artwork: {...{content: Assets.delete, shadowcolor: '#151515'}, ...artwork, ...{sticky: sticky}},
			puzzled: {...{}, ...puzzled}
		}
	}
	
	public onAttach(): void
	{
		let group: Paperless.Group = this.context.attach(new Paperless.Group());
		let drawable: Paperless.Drawable;

		this._background = this.context.attach(new Background());
		this._header  = this.context.attach(new Header());
		this._close = this.context.attach(new Close(() => { this.context.detach(this.guid); }));

		drawable = this.context.attach(new Paperless.Drawables.Rectangle(this.point, this.size, this._attributes.rectangle));
		this._background.attach(drawable);
		drawable = this.context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(this.point.x, this.point.y - (this.size.height / 2) + 16), new Paperless.Size(this.size.width - 2, 30), {fillcolor: this._attributes.rectangle.strokecolor, nostroke: true, sticky: this.sticky}));
		this._header.attach(drawable);
		drawable = this.context.attach(new Paperless.Drawables.Artwork(new Paperless.Point(this.point.x + (this.size.width / 2) - 11, this.point.y - (this.size.height / 2) + 15), new Paperless.Size(22, 22), this._attributes.artwork));
		this._close.attach(drawable);

		this._caption = this.context.attach(new Paperless.Drawables.Label(new Paperless.Point(this.point.x, this.point.y - (this.size.height / 2) + 16), new Paperless.Size(this.size.width, 32), this._attributes.label));

		group.attach([
			this._background.drawable, 
			this._header.drawable, 
			this._caption, 
			this._close.drawable
		]);
	}
		
	public onDetach(): void
	{
		this.context.detach([
			this._background.drawable.guid, 
			this._background.guid, 
			this._caption.guid,
			this._header.drawable.guid,
			this._close.drawable.guid,
			this._header.guid,
			this._close.guid
		]);
	}


	// Accessors
	// --------------------------------------------------------------------------
	

}
