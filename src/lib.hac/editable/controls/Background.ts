import * as Paperless from '@zone09.net/paperless';
import {Editable} from '../components/Editable.js';



export class Background extends Paperless.Controls.Blank
{
	private _editable: Editable;
	private _colorsave: string;
	//---

	public constructor(editable: Editable)
	{
		super();

		//this.movable = false;
		this._editable = editable;
	}

	public onInside(): void
	{
		document.body.style.cursor = 'text';
	}

	public onOutside(): void
	{
		document.body.style.cursor = 'auto';
	}

	public onFocus()
	{
		this._colorsave = this.drawable.strokecolor;
		//this.drawable.strokecolor = this._editable.focuscolor;

		if(this._editable.childs.cursor)
		{
			this.context.attach(this._editable.childs.cursor);
			this._editable.childs.group.attach(this._editable.childs.cursor);
		}

		this._editable.childs.element.focus();
	};

	public onLostFocus()
	{
		this.drawable.strokecolor = this._colorsave;

		if(this._editable.childs.cursor)
		{
			this.context.detach(this._editable.childs.cursor.guid);
			this._editable.childs.group.detach(this._editable.childs.cursor);
		}

		this._editable.childs.element.blur();
	};
/*
	public onDragEnd()
	{
		if(this.context.states.focussed == this.guid)
		{
			if(!this._editable.childs.cursor)
				this.context.detach(this._editable.childs.cursor.guid);
			else
				this._editable.childs.cursor.toFront();
		}
	}
	*/
}
