import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUITexmageAttributes} from '../interfaces/IUI.js';



export class Texmage extends EntityCoreDrawable
{
	private _label: Paperless.Drawables.Label;
	private _artwork: Paperless.Drawables.Artwork;
	private _type: string;
	//---

	public constructor(attributes: IDrawableUITexmageAttributes = {})
	{
		super(attributes);

		const {
			type = 'label',
			content = undefined,
			label = {},
			artwork = {}
		} = attributes;

		attributes.label = {
			...{
				padding: { left: 0, top: 0 }, 
				...label
			}
		};

		this._label = new Paperless.Drawables.Label({			
			...{ 
				multiline: true, 
				wrapping: true,
				corner: true, 
			},
			...label,
			...{ 
				size: {
					width: this.width - this.puzzled.spacing - attributes.label.padding.left, 
					height: this.height - this.puzzled.spacing - attributes.label.padding.top
				},
				content: content || label.content,
				hoverable: false, 
				sticky: this.sticky, 
				offset1: this.puzzled.point, 
				offset2: {x: this.puzzled.spacing, y: this.puzzled.spacing},
				generate: false,
				matrix: this.matrix
			}
		});

		this._artwork = new Paperless.Drawables.Artwork({
			...artwork,
			...{ 
				size: {
					width: this.width - this.puzzled.spacing - (artwork.padding ? artwork.padding : 0), 
					height: this.height - this.puzzled.spacing - (artwork.padding ? artwork.padding : 0)
				},
				content: (type == 'artwork' ? (content || artwork.content) : ''),
				hoverable: false, 
				autosize: false, 
				sticky: this.sticky, 
				offset1: this.puzzled.point 
			}
		});

		this._type = type;

		this.context.enroll(this._artwork);
		this.context.enroll(this._label);
		this.update();
	}

	public update(): void
	{
		if(this._type == 'label')
		{
			this._label.width = this.width - this.puzzled.spacing;
			this._label.height = this.height - this.puzzled.spacing;
			this._label.generate();

			this.context.refresh();
		}
		else if(this._type == 'artwork')
		{
			this._artwork.width = this.width - this.puzzled.spacing - (this._artwork.padding * 2);
			this._artwork.height = this.height - this.puzzled.spacing - (this._artwork.padding * 2);
			this._artwork.offset2.x = this.puzzled.spacing + this._artwork.padding;
			this._artwork.offset2.y = this.puzzled.spacing + this._artwork.padding;
		}
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		if(this._type == 'label')
			this._label.draw(context2D);
		else if(this._type == 'artwork')
		{
			context2D.drawImage(
				this._artwork.image, 0, 0, this._artwork.width, this._artwork.height, 
				this.x + this.offset1.x + this._artwork.offset2.x, 
				this.y + this.offset1.y + this._artwork.offset2.y, 
				this._artwork.width, this._artwork.height);
		}
	}


	
	// Accessors
	// --------------------------------------------------------------------------

	public get childs(): {label: Paperless.Drawables.Label, artwork: Paperless.Drawables.Artwork}
	{
		return {label: this._label, artwork: this._artwork};
	}

	public get type(): string
	{
		return this._type;
	}
	public set type(type: string)
	{
		this._type = type;
	}
}

