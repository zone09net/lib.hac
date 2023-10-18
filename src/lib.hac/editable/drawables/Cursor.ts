import * as Paperless from '@zone09.net/paperless';
import {IDrawableCursorAttributes} from '../interfaces/IEditable.js';



export class Cursor extends Paperless.Drawables.Rectangle
{
	private _id: number;
	private _blink: boolean;
	//---

	public constructor(attributes: IDrawableCursorAttributes)
	{
		super(attributes);

		this.visible = false;
		this.nostroke = true;
		this._blink = attributes.blink;
	}

	public onAttach(): void
	{
	}

	public on(): void
	{
		this.visible = true;
		
		if(this._blink)
		{
			this._id = setInterval(() => { 
				if(this.visible)
					this.visible = false;
				else
					this.visible = true;

				this.context.refresh();
			}, 350);
		}
	}

	public off(): void
	{
		this.visible = false;
		clearInterval(this._id);
	}

	public onDetach(): void 
	{
		clearInterval(this._id);
	}
}
