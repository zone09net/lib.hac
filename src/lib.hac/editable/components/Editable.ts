import * as Paperless from '@zone09.net/paperless';
import * as Foundation from '@zone09.net/foundation';
import {IComponentEditableAttributes} from '../interfaces/IEditable.js';
import {Cursor} from '../drawables/Cursor.js';
import {Background} from '../controls/Background.js';
import {Interaction} from '../controls/Interaction.js';



export class Editable extends Paperless.Component
{
	private _attributes: IComponentEditableAttributes;
	//private _element: HTMLInputElement = document.createElement('input');
	private _element: HTMLTextAreaElement = document.createElement('textarea');
	private _keyboard: Foundation.Keyboard = new Foundation.Keyboard(this._element, this);
	private _label: Paperless.Drawables.Label;
	private _cursor: Cursor;
	private _grouped: Paperless.Group = new Paperless.Group();
	private _Dbackground: Paperless.Drawable;
	private _Cbackground: Background;
	private _interaction: Interaction;
	private _position: {global: number, cursor: {row: number, column: number}} = {global: 0, cursor: {row: 0, column: 0}};
	private _content: string = '';
	//---

	// @ts-ignore
	public constructor(attributes: IComponentEditableAttributes = {})
	{
		const context: Paperless.Context = attributes.context;

		super({
			...{
				size: {width: 512, height: 256},
				point: {
					x: window.innerWidth / 2, 
					y: window.innerHeight / 2
				},		
			},
			...attributes, 
			...{
				context: null,
				layer: null,
			}
		});

		const {
			layer = null,
			textarea = false,
			maxchar = 0,
			maxline = 0,
			focuscolor = '#ddbb44',
			restrict = /./,
			sticky = false,
			customlabel = null,
			customgenerate = true,
			label = {},
			cursor = {},
			password = false,
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

			onEscape = null,
			onKey = null,
			onEnter = null,
			onTab = null,
			onBackspace = null,
			onDelete = null,
			onRight = null,
			onCtrlRight = null,
			onShiftRight = null,
			onLeft = null,
			onCtrlLeft = null,
			onShiftLeft = null,
			onUp = null,
			onDown = null,
			onHome = null,
			onCtrlHome = null,
			onEnd = null,
			onCtrlEnd = null,
			onCopy = null,
			onPaste = null,
			onUnselect = null,
		} = attributes;

		this.sticky = sticky;
		this._attributes = {
			textarea: textarea, 
			maxchar: maxchar,
			maxline: maxline,
			focuscolor: focuscolor,
			restrict: restrict,
			label: {
				...{ multiline: true, strokecolor: '#666666' }, 
				...label, 
				...{ autosize: false, corner: true, sticky: sticky } 
			},
			cursor: {
				...{ width: 2, blink: true, fillcolor: '#ddbb44' }, 
				...cursor, 
				...{ sticky: sticky} 
			},
			password: password
		};

		this._keyboard.setKeydownCallbacks(
			new Map([
				['key', [onKey || this.onKey]],

				['escape', [onEscape || this.onEscape]],
				['enter', [onEnter || this.onEnter]],
				['tab', [onTab || this.onTab]],
				['backspace', [onBackspace || this.onBackspace]],
				['delete', [onDelete || this.onDelete]],

				['right', [onRight || this.onRight]], ['ctrl+right', [onCtrlRight || this.onCtrlRight]], ['shift+right', [onShiftRight || this.onShiftRight]],
				['left', [onLeft || this.onLeft]], ['ctrl+left', [onCtrlLeft || this.onCtrlLeft]], ['shift+left', [onShiftLeft || this.onShiftLeft]],
				['up', [onUp || this.onUp]],
				['down', [onDown || this.onDown]],

				['home', [onHome || this.onHome]], ['ctrl+home', [onCtrlHome || this.onCtrlHome]],
				['end', [onEnd || this.onEnd]], ['ctrl+end', [onCtrlEnd || this.onCtrlEnd]],

				['ctrl+c', [onCopy || this.onCopy]],
				['ctrl+v', [onPaste || this.onPaste]],
			])
		);

		this._element.style.pointerEvents = 'none';
		this._element.style.opacity = '0';
		this._element.style.position = 'fixed';
		this._element.style.top = '-1000px';
		this._element.spellcheck = false;
		
		if(this._attributes.maxchar != 0)
			this._element.maxLength = this._attributes.maxchar;

		document.body.appendChild(this._element);

		if(!textarea)
			this._keyboard.enable();
		else
		{
			//this._element.addEventListener("keydown", this.handleKeydown.bind(null, this), false);
			//this._element.addEventListener("keyup", this.handleKeyup.bind(null, this), false);
		}

		if(customlabel)
			this._label = customlabel;

		if(!customlabel || (customlabel && customgenerate))
		{
			this._label = new Paperless.Drawables.Label({
				...this._attributes.label,
				...{
					point: {x: this.x, y: this.y},
					size: {width: this.width, height: this.height}
				}
			});
		}

		context ? context.attach(this, layer) : null;
	}

	//private handleKeydown(self: Editable, event: HTMLElementEventMap['keydown']): void
	//{

	//}

	//private handleKeyup(self: Editable, event: HTMLElementEventMap['keyup']): void
	//{
	//	if(self._attributes.restrict.test(event.key))
	//	{
	//		let lines = self._element.value.substr(0, self._element.selectionStart).split('\n');
	//		let row = lines.length;
	//		let column = lines[lines.length - 1].length;

	//		self._position = {
	//			global: self._element.selectionStart,
	//			cursor: {row: row, column: column}
	//		}

	//		if(self._cursor)
	//		{
	//			self.context.context2D.save();
	//			self.context.context2D.font = self._label.font;
	//			self.context.context2D.textAlign = 'left';
	//			self.context.context2D.textBaseline = 'top';
	//
	//			let width = self.context.context2D.measureText('X').width;
	//			let height = self.context.context2D.measureText('[j').actualBoundingBoxDescent + self.context.context2D.measureText('[j').actualBoundingBoxAscent;
	//
	//			self._cursor.offset1 = {
	//				x: (width * self._position.cursor.column) + /*self._label.padding.left*/ 5 + self._label.offset1.x + Math.ceil(self._cursor.size.width / 2),
	//				y: ((/*self._cursor.size.height*/ height - 2 + self._label.spacing) * self._position.cursor.row) + ((self._cursor.size.height + 2) / 2) + /*self._label.padding.top*/ 5 + self._label.offset1.y - 1
	//			}
	//			
	//			self.context.context2D.restore();
	//			self.context.refresh();
	//		}


	//	}
	//	else
	//		event.preventDefault();
	//}

	/*
	public attachLabel(label: any)
	{
		this._label = label;
		this._label.x = this.x;
		this._label.y = this.y;
		this._label.width = this.width;
		this._label.height = this.height;
		this._label.generate();
	}
	*/

	public attachBackground(drawable?: Paperless.Drawable): void
	{
		if(drawable)
			this._Dbackground = drawable;
		else
		{
			this._Cbackground = new Background(this);
			this._Dbackground = this._label;
		}
	}
	
	public attachCursor(drawable?: Cursor): void
	{
		if(drawable)
			this._cursor = drawable;
		else
		{
			const cursorHeight = this._label.boundingbox('[j').height + 2;

			this._cursor = new Cursor({
				...this._attributes.cursor,
				...{
					point: {x: this._label.x, y: this._label.y},
					size: {width: this._attributes.cursor.width, height: cursorHeight},
					offset1: {
						x: this._label.offset1.x + this._label.padding.left + Math.ceil(this._attributes.cursor.width / 2), 
						y: this._label.offset1.y + (cursorHeight / 2) + this._label.padding.top - 1
					},
					sticky: this.sticky,
					//context: this.context
				}
			});
		}
	}

	public attachInteraction(): void
	{
		this._interaction = new Interaction(this);
	}

	public initialize(): void
	{
		if(!this._attributes.textarea)
		{
			this.context.enroll(this._label);
			//this.context.attach(this._label);

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

			this.context.attach(this._grouped);

			if(this._cursor)
				this._grouped.attach(this._cursor);

			this._grouped.attach(this._label);
		}
		else
		{
			/*
			this._element.style.pointerEvents = 'auto';
			this._element.style.opacity = '1';
			this._element.style.position = 'fixed';
			this._element.style.left = this.point.x + this._attributes.label.padding.left + 'px';
			this._element.style.top = this.point.y + this._attributes.label.padding.top + 'px';
			this._element.style.width = this.size.width - this._attributes.label.padding.left - this._attributes.label.padding.right + 'px';
			this._element.style.height = this.size.height - this._attributes.label.padding.top - this._attributes.label.padding.bottom + 'px';
			*/

			if(!this.context.get(this._Dbackground.guid))
				this.context.attach(this._Dbackground);

			if(this._cursor)
				this.context.attach(this._cursor);
		}
	}

	public onAttach(): void
	{
		this.attachBackground(); 
		this.attachCursor();

		if(!this._attributes.textarea)
		{
			
			this.attachInteraction();
		}

		this.initialize();
	}

	public onDetach(): void
	{
		this.context.detach(this._label.group); 
		//this.context.detach(this._label.guid);
		
		if(this._interaction)
			this.context.detach(this._interaction.guid);

		if(this._cursor.guid)
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
		let newlines: Array<number> = [];
		let index: number = this._label.content.indexOf('\n');
	
		while(index != -1) 
		{
			newlines.push(index);
			index = this._label.content.indexOf('\n', index + 1);
		}

		for(; row <= this._label.contentAs.splitted.length - 1; row++)
		{
			lastLength = length;
			length += this._label.contentAs.splitted[row].length;

			if(this._position.global >= lastLength && this._position.global <= length)
				break;

			if(newlines.includes(length))
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
			this._label.context.context2D.save();
			this._label.context.context2D.font = this._label.font;
			this._label.context.context2D.textAlign = 'left';
			this._label.context.context2D.textBaseline = 'top';

			let metrics = this._label.context.context2D.measureText(this._label.contentAs.splitted[row].slice(0, this._position.global - lastLength));

			this._cursor.offset1 = {
				x: metrics.width + this._label.padding.left + this._label.offset1.x + Math.ceil(this._cursor.size.width / 2),
				y: ((this._cursor.size.height - 2 + this._label.spacing) * row) +
					((this._cursor.size.height + 2) / 2) +
					this._label.padding.top + this._label.offset1.y - 1
			}
			
			this._label.context.context2D.restore();
		}

		this._position.cursor.row = row;
		this._position.cursor.column = this._position.global - lastLength;

		this.context.refresh();
	}

	/*
	public getPosition(): number
	{
		return this._position.global;
	}
	*/

	public clear(): void
	{
		this._content = '';
		this._label.content = '';
		this._position.global = 0;
		this.update();
	}

	public moveRight(howmany: number): void 
	{
		this._position.global += howmany;

		if(this._position.global >= this._label.content.length)
			this._position.global = this._label.content.length;
	}

	public moveLeft(howmany: number): void
	{
		if(this._position.global - howmany >= 0)
			this._position.global -= howmany;
	}

	public moveUp(): void
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

	public moveDown(): void
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

	public moveFirst(): void
	{
		this.moveLeft(this._position.cursor.column);
	}

	public moveLast(): void
	{
		let increment: number = this._label.contentAs.splitted[this._position.cursor.row].length - this._position.cursor.column;

		this.moveRight(increment);

		if(this._position.cursor.row == this._label.contentAs.splitted.length - 1)
			this._position.global = this._label.content.length /*+ 1*/;
		else
		{
			if(this._label.content[this._position.global] != '\n')
				this.moveLeft(1);
		}
	}

	public moveHome(): void
	{
		this._position.global = 0;
	}

	public moveEnd(): void
	{
		this._position.global = this._label.content.length;
	}

	public isInsertable(length: number): boolean
	{
		return this._attributes.maxchar != 0 ? this._label.content.length + length <= this._attributes.maxchar : true;
	}

	public insertStringAt(string: string, index: number): void
	{
		if(this._attributes.password)
		{
			this._content = this._content.substring(0, index) + string + this._content.substr(index);
			string = '●'.repeat(string.length);
		}
		
		this._label.content = this._label.content.substring(0, index) + string + this._label.content.substr(index);
	}

	public removeStringAt(from: number, end: number)
	{
		if(this._attributes.password)
			this._content = this._content.slice(0, from) + this._content.slice(end);

		this._label.content = this._label.content.slice(0, from) + this._label.content.slice(end);
	}

	private onKey(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		if(self.isInsertable(1) && self._attributes.restrict.test(event.key))
		{
			self.insertStringAt(event.key, self._position.global)
			self.moveRight(1);
			self.update();
		}

		event.preventDefault();
	}

	private onEscape(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		event.preventDefault();
	}

	private onEnter(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		if(self.isInsertable(1) && self.childs.label.multiline)
		{
			self.insertStringAt('\n', self._position.global)
			self.moveRight(1);
			self.update();
		}

		event.preventDefault();
	}

	private onTab(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		if(self.isInsertable(self.childs.label.tabsize))
		{
			self.insertStringAt(' '.repeat(self.childs.label.tabsize), self._position.global)
			self.moveRight(self.childs.label.tabsize);
			self.update();
		}

		event.preventDefault();
	}

	private onBackspace(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		if(self._position.global > 0)
		{
			self.removeStringAt(self._position.global - 1, self._position.global);
			self.moveLeft(1);
			self.update();
		}

		event.preventDefault();
	}

	private onDelete(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		self.removeStringAt(self._position.global, self._position.global + 1);
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
		self.moveHome();
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
		self.moveEnd();
		self.update(false);

		event.preventDefault();
	}

	private onCopy(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		Foundation.Clipboard.setContent(self.childs.label.content).then(() => {

		}); 

		event.preventDefault();
	}

	private onPaste(event: HTMLElementEventMap['keydown'], self: Editable)
	{
		Foundation.Clipboard.getContent().then(content => {
			content = content.replace(/\t/g, ' '.repeat(self.childs.label.tabsize));
			content = content.replace(/\r/g, '');

			if(self.isInsertable(content.length) && self._attributes.restrict.test(content))
			{
				self.insertStringAt(content, self._position.global)
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

	get childs(): {element: HTMLTextAreaElement, control: Background, label: Paperless.Drawables.Label, cursor: Cursor, background: Paperless.Drawable, keyboard: Foundation.Keyboard, group: Paperless.Group}
	//get childs(): {element: HTMLInputElement, control: Background, label: Paperless.Drawables.Label, cursor: Cursor, background: Paperless.Drawables.Rectangle}
	{
		return {element: this._element, control: this._Cbackground, label: this._label, cursor: this._cursor, background: this._Dbackground, keyboard: this._keyboard, group: this._grouped};
	}

	get content(): string
	{
		if(this._attributes.password)
			return this._content;
		else
			return this._label.content;
	}
	set content(content: string)
	{
		if(this._attributes.password)
		{
			this._content = content;
			this._label.content = content;
		}
		else
			this._label.content = content;
	}

	get position(): {global: number, cursor: {row: number, column: number}}
	{
		return this._position;
	}
	set position(position: {global: number, cursor: {row: number, column: number}})
	{
		this._position = position;
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

	get restrict(): RegExp
	{
		return this._attributes.restrict;
	}
	set restrict(restrict: RegExp)
	{
		this._attributes.restrict = restrict;
	}

/*
	get focuscolor(): string
	{
		return this._attributes.focuscolor;
	}
	set focuscolor(focuscolor: string)
	{
		this._attributes.focuscolor = focuscolor;
	}
	*/
}
