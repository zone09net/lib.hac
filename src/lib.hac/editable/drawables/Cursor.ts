import * as Paperless from '@zone09.net/paperless';
import {IDrawableCursorAttributes} from '../interfaces/IEditable.js';



export class Cursor extends Paperless.Drawables.Rectangle
{
	private _id: number;
	private _blink: boolean;
	//---

	public constructor(point: Paperless.Point, size: Paperless.Size, attributes: IDrawableCursorAttributes)
	{
		super(point, size, attributes);

		this.nostroke = true;
		this._blink = attributes.blink;
	}

	public onAttach(): void
	{
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

	public onDetach(): void 
	{
		clearInterval(this._id);
		this.visible = true;
	}
}
