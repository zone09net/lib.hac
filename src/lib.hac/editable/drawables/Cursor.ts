import * as Paperless from '@zone09.net/paperless';
import {IDrawableCursorAttributes} from '../interfaces/IEditable.js';



export class Cursor extends Paperless.Drawables.Rectangle
{
	private _id: number;
	//---

	public constructor(attributes: IDrawableCursorAttributes)
	{
		super(attributes);

		this.visible = false;
		this.nostroke = true;

		let alpha: number = this.alpha;

		if(attributes.blink)
		{
			this._id = setInterval(() => { 
				if(this.visible)
					(this.alpha == 0 ? this.alpha = alpha : this.alpha = 0);
				else
					this.alpha = 0;

				this.context.refresh();
			}, 350);
		}
	}

	public onDetach(): void 
	{
		clearInterval(this._id);
	}
}
