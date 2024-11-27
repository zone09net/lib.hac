import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIArtworkAttributes} from '../interfaces/IUI.js';



export class Artwork extends EntityCoreDrawable
{
	private _artwork: Paperless.Drawables.Artwork;
	//---

	public constructor(attributes: IDrawableUIArtworkAttributes = {})
	{
		super(attributes);

		this._artwork = new Paperless.Drawables.Artwork({
			...attributes.artwork,
			...{ 
				point: {x: this.x, y: this.y},
				size: {width: this.width, height: this.height},
				hoverable: false, 
				autosize: false, 
				sticky: this.sticky, 
				offset1: this.puzzled.point,
			}
		});

		this.context.enroll(this._artwork);
		this.update();
	}

	public update(): void
	{
		this._artwork.width = this.width - this.puzzled.spacing - (this._artwork.padding * 2);
		this._artwork.height = this.height - this.puzzled.spacing - (this._artwork.padding * 2);
		this._artwork.offset2.x = this.puzzled.spacing + this._artwork.padding;
		this._artwork.offset2.y = this.puzzled.spacing + this._artwork.padding;
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.drawImage(
			this._artwork.image, 0, 0, this._artwork.width, this._artwork.height, 
			this.x + this.offset1.x + this._artwork.offset2.x, 
			this.y + this.offset1.y + this._artwork.offset2.y, 
			this._artwork.width, this._artwork.height
		);
	}

	
	
	// Accessors
	// --------------------------------------------------------------------------

	public get childs(): {artwork: Paperless.Drawables.Artwork}
	{
		return {artwork: this._artwork};
	}
}
