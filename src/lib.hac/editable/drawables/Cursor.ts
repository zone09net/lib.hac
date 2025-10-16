import * as Paperless from '@zone09.net/paperless';
import {IDrawableCursorAttributes} from '../interfaces/IEditable.js';



export class Cursor extends Paperless.Drawables.Rectangle
{
	private _id: number;
	private __alpha: number;
	private _blink: boolean;
	//---

	public constructor(attributes: IDrawableCursorAttributes)
	{
		super(attributes);

		this.visible = false;
		this.nostroke = true;

		this.__alpha = this.alpha;
		this._blink = attributes.blink;

		this.reset();
	}

	public reset(): void
	{
		clearInterval(this._id);
		
		this.alpha = this.__alpha;
		
		if(this._blink)
		{
			this._id = setInterval(() => { 
				if(this.visible)
				{
					(this.alpha == 0 ? this.alpha = this.__alpha : this.alpha = 0);
					
				}
				else
					this.alpha = 0;

				this.context.refresh();
			}, 350);
		}
	}

	public stop(): void
	{
		clearInterval(this._id);

		this.alpha = this.__alpha;
		this.visible = false;
	}

	public onDetach(): void 
	{
		clearInterval(this._id);
	}
}
