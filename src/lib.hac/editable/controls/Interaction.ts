import * as Paperless from '@zone09.net/paperless';
import {Editable} from '../components/Editable.js';



export class Interaction extends Paperless.MouseAction
{
	private _editable: Editable;
	//---

	public constructor(editable: Editable)
	{
		super();

		this._editable = editable;
	}

	private getNewlinesIndex(): number[]
	{
		let newlines: number[] = [];
		let index: number = this._editable.childs.label.content.indexOf('\n');

		while(index != -1) 
		{
			newlines.push(index);
			index = this._editable.childs.label.content.indexOf('\n', index + 1);
		}

		return newlines;
	}

	public onMouseUp(): void 
	{
		if(this._editable.childs.control.guid == this.context.states.pointer.control && !this.context.states.drag)
			this.context.setFocus(this._editable.childs.control.guid);
	}

	public onMouseDown(): void
	{
		if(this._editable.childs.control.guid == this.context.states.pointer.control && this.context.states.focussed == this._editable.childs.control.guid)
		{
			let x: number = this.context.states.pointer.clicked.x - this._editable.childs.label.x - this._editable.childs.label.padding.left - this._editable.childs.label.offset.x;
			let y: number = this.context.states.pointer.clicked.y - this._editable.childs.label.y - this._editable.childs.label.padding.top - this._editable.childs.label.offset.y;
			let boundingbox: {width: number, height: number} = this._editable.childs.label.boundingbox('[j');
			let row: number = Math.floor(y / (boundingbox.height + this._editable.childs.label.spacing));

			if(row < 0)
				row = 0;

			this._editable.position.global = 0;

			if(row >= this._editable.childs.label.contentAs.splitted.length)
				this._editable.position.global = this._editable.childs.label.content.length;
			else
			{
				for(let i: number = 0; i < row; i++)
				{
					this._editable.position.global += this._editable.childs.label.contentAs.splitted[i].length;

					if(this.getNewlinesIndex().includes(this._editable.position.global))
						this._editable.position.global++;
				}
				
				let position: number;
				let width: number = 0;

				for(position = 0; position < this._editable.childs.label.contentAs.splitted[row].length; position++)
				{
					width +=	this._editable.childs.label.boundingbox(this._editable.childs.label.contentAs.splitted[row].charAt(position)).width;
					if(width >= x)
						break;
				}

				this._editable.position.global += (position >= this._editable.childs.label.contentAs.splitted[row].length ? this._editable.childs.label.contentAs.splitted[row].length : position);
			}

			this._editable.update(false);
		}		
	}
}
