import * as Paperless from '@zone09.net/paperless';
import * as Foundation from '@zone09.net/foundation';
import {IComponentEditableAttributes} from '../interfaces/IEditable.js';
import {Cursor} from '../drawables/Cursor.js';
import {Background} from '../controls/Background.js';
import {Interaction} from '../controls/Interaction.js';



export class Editable extends Paperless.Component
{
	private _attributes: IComponentEditableAttributes;
	private _element: HTMLInputElement = document.createElement('input');
	private _keyboard: Foundation.Keyboard = new Foundation.Keyboard(this._element, this);
	private _label: Paperless.Drawables.Label;
	private _cursor: Cursor;
	private _Dbackground: Paperless.Drawables.Rectangle;
	private _Cbackground: Background;
	private _interaction: Interaction;
	private _position: {global: number, cursor: {row: number, column: number}} = {global: 0, cursor: {row: 0, column: 0}};
	//---

	public constructor(point: Paperless.Point, size: Paperless.Size, attributes: IComponentEditableAttributes = {})
	{
		super(point, size);

		const {
			maxchar = 0,
			maxline = 0,
			focus = '#ddbb44',
			sticky = false,
			label = {},
			cursor = {}
			/*
			{
				0: { 
					0: {
						font: font,
						fillcolor: fontColor,
					}
				}
			}
			*/
		} = attributes;

		this.sticky = sticky;
		this._attributes = {
			maxchar: maxchar,
			maxline: maxline,
			focus: focus,
			label: {
				...{ multiline: true, fillbackground: '#000000', strokecolor: '#666666' }, 
				...label, 
				...{ autosize: false, corner: true, sticky: sticky} 
			},
			cursor: {
				...{ width: 2, blink: true, fillcolor: '#ddbb44' }, 
				...cursor, 
				...{ sticky: sticky} 
			}
		};

		this._keyboard.setCallbacks(
			new Map([
				['key', [this.onKey]],

				['enter', [this.onEnter]],
				['tab', [this.onTab]],
				['backspace', [this.onBackspace]],
				['delete', [this.onDelete]],

				['right', [this.onRight]], ['ctrl+right', [this.onCtrlRight]], ['shift+right', [this.onShiftRight]],
				['left', [this.onLeft]], ['ctrl+left', [this.onCtrlLeft]], ['shift+left', [this.onShiftLeft]],
				['up', [this.onUp]],
				['down', [this.onDown]],

				['home', [this.onHome]], ['ctrl+home', [this.onCtrlHome]],
				['end', [this.onEnd]], ['ctrl+end', [this.onCtrlEnd]],

				//['ctrl+c', [this.onCopy]],
				['ctrl+v', [this.onPaste]],
			])
		);

		this._element.style.pointerEvents = 'none';
		this._element.style.opacity = '0';
		this._element.style.position = 'fixed';
		this._element.style.top = '-1000px';
		document.body.appendChild(this._element);

		this._keyboard.enable();
		this._label = new Paperless.Drawables.Label(this.point, this.size, this._attributes.label);
	}

	public attachBackground(Dbackground?: Paperless.Drawable): void
	{
		if(Dbackground)
			this._Dbackground = Dbackground;
		else
		{
			this._Cbackground = new Background(this);
			this._Dbackground = this._label;
		}
	}
	
	public attachCursor(): void
	{
		let cursorHeight = this._label.boundingbox('j').height + 2;

		this._cursor = new Cursor(this._label.point, new Paperless.Size(this._attributes.cursor.width, cursorHeight), {
			...this._attributes.cursor,
			...{
				offset: {x: this._label.offset.x + this._label.padding.left + Math.ceil(this._attributes.cursor.width / 2), y: this._label.offset.y + (cursorHeight / 2) + this._label.padding.top - 1},
				sticky: this.sticky
			}
		});
	}

	public attachInteraction(): void
	{
		this._interaction = new Interaction(this);
	}

	public initialize(): void
	{
		this.context.attach(this._label);

		if(this._Cbackground)
		{
			this.context.attach(this._Cbackground)
			this.context.attach(this._Dbackground);
			this._Cbackground.attach(this._Dbackground);
		}
		else if(this._Dbackground)
		{
			if(!this.context.get(this._Dbackground.guid))
				this.context.attach(this._Dbackground)
		}

		if(this._interaction)
			this.context.attach(this._interaction);

		let group: Paperless.Group = new Paperless.Group();
		this.context.attach(group);

		if(this._cursor)
			group.attach(this._cursor);

		group.attach(this._label);
	}

	public onAttach(): void
	{
		this.attachBackground();
		this.attachCursor();
		this.attachInteraction();
		this.initialize();
	}

	public onDetach(): void
	{
		this.context.detach(this._label.group);
		this.context.detach(this._label.guid);
		
		if(this._interaction)
			this.context.detach(this._interaction.guid);

		if(this._cursor)
			this.context.detach(this._cursor.guid);

		if(this._Cbackground)
		{
			this.context.detach(this._Dbackground.guid);
			this.context.detach(this._Cbackground.guid);
		}

		this._keyboard.disable();
		this._element.remove();
	}

	public update(generate: boolean = true): void
	{
		if(generate)
			this._label.generate();

		let length: number = 0;
		let lastLength: number = 0;
		let row: number = 0;

		let mark1: number = 5;
		let mark2: number = 10;

		for(; row <= this._label.contentAs.splitted.length - 1; row++)
		{
			lastLength = length;
			length += this._label.contentAs.splitted[row].length;

			if(this._position.global >= lastLength && this._position.global <= length)
				break;

			if(this._label.getNewlinesIndex().includes(length))
				length++;
		}

		if(/ $/.test(this._label.contentAs.splitted[row]) && this._position.global == length && this._label.contentAs.splitted[row + 1] != undefined && this._label.content[this._position.global] != '\n')
		{
			row++;
			lastLength += this._position.global - lastLength;
		}
		
		if(row > this._label.contentAs.splitted.length - 1)
			row--;

		//console.log(this._label.contentAs.splitted);
		//console.log('length', length, 'global', this._position.global, 'row', row, 'column', this._position.global - lastLength);
		//console.log('---------------------');

		if(this._cursor)
		{
			let boundingbox: {width: number, height: number} = this._label.boundingbox(this._label.contentAs.splitted[row].slice(0, this._position.global - lastLength));

			this._cursor.offset = {
				x: boundingbox.width + this._label.padding.left + this._label.offset.x + Math.ceil(this._attributes.cursor.width / 2),
				y: ((boundingbox.height + this._label.spacing) * row) + (this._cursor.size.height / 2) + this._label.padding.top + this._label.offset.y - 1
			}

		}

		this._position.cursor.row = row;
		this._position.cursor.column = this._position.global - lastLength;

		this.context.refresh();
	}

	/*
	public updateCursorHeight(): void
	{
		this._cursor.size.height = this._label.boundingbox('j').height;
		this._cursor.generate();
		this._cursor.point.x = this._label.point.x + this._label.padding.left;
		this._cursor.point.y = this._label.point.y + (this._cursor.size.height / 2) + this._label.padding.top;
	}
	*/

	public getPosition(): number
	{
		return this._position.global;
	}

	public clear(): void
	{
		this._label.content = '';
		this.update();
	}

	private moveRight(howmany: number): void
	{
		this._position.global += howmany;
		
		if(this._position.global >= this._label.content.length)
			this._position.global = this._label.content.length;
	}

	private moveLeft(howmany: number): void
	{
		if(this._position.global - howmany >= 0)
			this._position.global -= howmany;
	}

	private moveUp(): void
	{
		if(this._label.contentAs.splitted[this._position.cursor.row - 1] != undefined)
		{
			let column: number = this._position.cursor.column.valueOf();

			this.moveFirst();
			this._position.global--;
			
			if(this._label.content[this._position.global] != '\n')
				this._position.global++;
			
			this._position.global -= this._label.contentAs.splitted[this._position.cursor.row - 1].length;

			if(column <= this._label.contentAs.splitted[this._position.cursor.row - 1].length)
				this.moveRight(column);
			else
				this.moveRight(this._label.contentAs.splitted[this._position.cursor.row - 1].length);
		}
	}

	private moveDown(): void
	{
		if(this._label.contentAs.splitted[this._position.cursor.row + 1] != undefined)
		{
			let column: number = this._position.cursor.column.valueOf() + 1;

			this.moveLast();

			if(this._label.contentAs.splitted[this._position.cursor.row + 1].length >= column)
				this.moveRight(column);
			else
				this.moveRight(this._label.contentAs.splitted[this._position.cursor.row + 1].length + 1);
		}
	}

	private moveFirst(): void
	{
		this.moveLeft(this._position.cursor.column);
	}

	private moveLast(): void
	{
		let increment: number = this._label.contentAs.splitted[this._position.cursor.row].length - this._position.cursor.column;

		this.moveRight(increment);

		if(this._position.cursor.row == this._label.contentAs.splitted.length - 1)
			this._position.global = this._label.content.length + 1;
		else
		{
			if(this._label.content[this._position.global] != '\n')
				this.moveLeft(1);
		}
	}

	private isInsertable(length: number): boolean
	{
		return this._attributes.maxchar != 0 ? this._label.content.length + length <= this._attributes.maxchar : true
	}

	private insertStringAt(string: string, index: number): void
	{
		this._label.content = this._label.content.substring(0, index) + string + this._label.content.substr(index);
	}

	private removeStringAt(from: number, end: number)
	{
		this._label.content = this._label.content.slice(0, from) + this._label.content.slice(end);
	}

	private onKey(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		if(self.isInsertable(1))
		{
			self.insertStringAt(event.key, self.getPosition())
			self.moveRight(1);
			self.update();
		}

		event.preventDefault();
	}

	private onEnter(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		if(self.isInsertable(1) && self.childs.label.multiline)
		{
			self.insertStringAt('\n', self.getPosition())
			self.moveRight(1);
			self.update();
		}

		event.preventDefault();
	}

	private onTab(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		if(self.isInsertable(self.childs.label.tabsize))
		{
			self.insertStringAt(' '.repeat(self.childs.label.tabsize), self.getPosition())
			self.moveRight(self.childs.label.tabsize);
			self.update();
		}

		event.preventDefault();
	}

	private onBackspace(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		if(self.getPosition() > 0)
		{
			self.removeStringAt(self.getPosition() - 1, self.getPosition());
			self.moveLeft(1);
			self.update();
		}

		event.preventDefault();
	}

	private onDelete(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self.removeStringAt(self.getPosition(), self.getPosition() + 1);
		self.update();

		event.preventDefault();
	}

	private onRight(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self.moveRight(1);
		self.update(false);

		event.preventDefault();
	}

	private onCtrlRight(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		console.log('onCtrlRight');

		event.preventDefault();
	}

	private onShiftRight(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		console.log('onShiftRight');

		event.preventDefault();
	}

	private onLeft(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self.moveLeft(1);
		self.update(false);

		event.preventDefault();
	}

	private onCtrlLeft(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		console.log('onCtrlLeft');

		event.preventDefault();
	}

	private onShiftLeft(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		console.log('onShiftLeft');

		event.preventDefault();
	}

	private onUp(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self.moveUp();
		self.update(false);

		event.preventDefault();
	}

	private onDown(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self.moveDown();
		self.update(false);

		event.preventDefault();
	}
	
	private onHome(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self.moveFirst();
		self.update(false);

		event.preventDefault();
	}

	private onCtrlHome(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self._position.global = 0;
		self.update(false);

		event.preventDefault();
	}

	private onEnd(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self.moveLast();
		self.update(false);

		event.preventDefault();
	}

	private onCtrlEnd(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self._position.global = self._label.content.length + 1;
		self.update(false);

		event.preventDefault();
	}

	private onCopy(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		console.log('onCopy');

		event.preventDefault();
	}

	private onPaste(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		Foundation.Clipboard.getContent().then(content => {
			content = content.replace(/\t/g, ' '.repeat(self.childs.label.tabsize));
			content = content.replace(/\r/g, '');

			if(self.isInsertable(content.length))
			{
				self.insertStringAt(content, self.getPosition())
				self.moveRight(content.length);
				self.update();
			}
		}); 

		event.preventDefault();
	}

	private onUnselect(event: HTMLElementEventMap['keydown'], input: Editable)
	{
		console.log('onUnselect');

		event.preventDefault();
	}



	// Accessors
	// --------------------------------------------------------------------------

	get childs(): {element: HTMLInputElement, control: Background, label: Paperless.Drawables.Label, cursor: Cursor, background: Paperless.Drawables.Rectangle}
	{
		return {element: this._element, control: this._Cbackground, label: this._label, cursor: this._cursor, background: this._Dbackground};
	}

	get content(): string
	{
		return this._label.content;
	}
	set content(content: string)
	{
		this._label.content = content;
	}

	get global(): number
	{
		return this._position.global;
	}
	set global(global: number)
	{
		this._position.global = global;
	}

	get maxchar(): number
	{
		return this._attributes.maxchar;
	}
	set maxCharacter(maxchar: number)
	{
		this._attributes.maxchar = maxchar;
	}

	get maxline(): number
	{
		return this._attributes.maxline;
	}
	set maxline(maxline: number)
	{
		this._attributes.maxline = maxline;
	}

	get focus(): string
	{
		return this._attributes.focus;
	}
	set focus(focus: string)
	{
		this._attributes.focus = focus;
	}
}
