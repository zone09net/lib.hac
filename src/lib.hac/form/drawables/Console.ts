import * as Foundation from '@zone09.net/foundation';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {Editable} from '../../editable/components/Editable.js';
import {IDrawableUIConsoleAttributes} from '../interfaces/IUI.js';



export class Console extends EntityCoreDrawable
{
	private _wss: Foundation.WebSocketSecure;;
	private _catalog: any = {};
	private _history: string[] = [];
	private _editable: Editable;
	private _palette: {
		grey1?: string,
		grey2?: string,
		grey3?: string,
		red?: string,
		green?: string,
		yellow?: string
	};
	//---

	
	public constructor(attributes: IDrawableUIConsoleAttributes = {})
	{
		super(attributes);

		attributes.catalog ? this._catalog = attributes.catalog : null;

		this._wss = attributes.wss;
		this._palette = {
			...{
				grey1: '#333333',
				grey2: '#666666',
				grey3: '#999999',
				red: '#8d2a2a',
				green: '#476e20',
				yellow: '#c8af55'
			},
			...attributes.palette,
		}

		this.editable();
	}

	private editable(): void
	{
		let instring: number = 0;
		let filters: any = {
			prompt: {
				0: {fillcolor: this._palette.grey3},
				//1: {fillcolor: '#999999'},
			},
			white: {
				0: {fillcolor: this._palette.grey1},
				1: {fillcolor: this._palette.grey3},
			},
			success: {
				0: {fillcolor: this._palette.green},
				1: {fillcolor: this._palette.grey3},
			},		
			error: {
				0: {fillcolor: this._palette.red},
				//5000: {fillcolor: '#999999'},
			},	
			help: {
				0: {fillcolor: this._palette.yellow},
				20: {fillcolor: this._palette.grey2},
				100: {fillcolor: this._palette.grey3},
			},
		}

		let computePrompt = (editable: Editable, depth: number = 0) => {
			let index: number;
			let count: number = 0;

			for(let i: number = editable.childs.label.maxline - 1; i >= 0; i--)
			{
				if(!editable.childs.label.contentAs.splitted[i] || editable.childs.label.contentAs.splitted[i].substring(0, 2) != '⯈ ')
					editable.childs.label.filter[i] = undefined;
				else
				{
					if(i == editable.childs.label.maxline - 1)
						while(editable.childs.label.contentAs.splitted[--i].substring(0, 2) != '⯈ ') {}

					index = i;

					if(depth == count)
						break;

					count++;
				}
			}

			return index;
		}

		let adjustFilters = (editable: Editable, color: string = this._palette.grey3) => {
			for(let i: number = 0; i <= editable.childs.label.maxline - 1; i++)
			{
				if(editable.childs.label.filter[i] == undefined)
				{
					editable.childs.label.filter[i] = {
						0: {fillcolor: color},
					}
				}
			}
		}

		let insertPrompt = (editable: Editable, filter: any) => {
			editable.moveEnd();
			editable.update(false);

			if(editable.position.cursor.row < editable.childs.label.maxline - 1)
			{
				editable.childs.label.filter[computePrompt(editable)] = filter;

				if(filter != filters.error)
					adjustFilters(editable);

				editable.insertStringAt('\n⯈ ', editable.position.global);
				editable.moveEnd();
				editable.update();

				if(filter == filters.error)
				{
					editable.childs.label.filter[computePrompt(editable)] = filters.prompt;	
					adjustFilters(editable, '#ff0000');
				}

				editable.update();
			}
			else
			{
				if(filter == filters.error)
					editable.childs.label.filter[computePrompt(editable, 1)] = filters.white;

				editable.insertStringAt('\n⯈ ', editable.position.global);
				editable.moveEnd();
				editable.update();

				editable.childs.label.filter[computePrompt(editable)] = filter;
				
				if(filter != filters.error)
					adjustFilters(editable);
				else 
				{
					adjustFilters(editable, '#ff0000');
					editable.childs.label.filter[editable.childs.label.maxline - 1] = filters.prompt;
				}

				editable.update();
			}
		}
		
		this._editable = new Editable({
			point: {x: this.x, y: this.y},
			size: {width: this.width - this.puzzled.spacing, height: this.height - this.puzzled.spacing},
			sticky: this.sticky,
			label: {
				matrix: this.matrix,
				offset1: this.puzzled.point,
				offset2: {x: this.puzzled.spacing, y: this.puzzled.spacing},
				content: '⯈ ',
				font: '13px CPMono-v07-Light',
				padding: {top: 5, left: 5, right: 8},
				fillcolor: this._palette.grey3,
				wrapping: true,
				multiline: true,
				nostroke: true,
				infinite: true,
				filter: {
					0: {
						0: {fillcolor: this._palette.grey3},
					}
				}
			},
			cursor: {
				fillcolor: this._palette.grey2,
				blink: true,
				alpha: 0.5,
				width: 7,
				offset1: this.puzzled.point,
				offset2: {x: this.puzzled.spacing, y: this.puzzled.spacing},
				matrix: this.matrix
			},
	
			onKey: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				event.preventDefault();
	
				if(self.isInsertable(1) && self.restrict.test(event.key))
				{
					if(event.key == '"' || event.key == "'")
						instring ^= 1;

					/*
					if(instring == 1)
						self.childs.label.filter[self.position.cursor.row][self.position.cursor.column] = {fillcolor: '#666666'};
					else
						self.childs.label.filter[self.position.cursor.row][self.position.cursor.column + 1] = {fillcolor: '#999999'};
					*/

					self.insertStringAt(event.key, self.position.global)
					self.moveRight(1);
					self.update();
				}
			},

			onEscape: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				event.preventDefault();
	
				self.clear();
				self.insertStringAt('⯈ ', self.position.global);
				self.moveEnd();

				self.childs.label.filter[0] = {
					0: {fillcolor: this._palette.grey3},
				};

				self.update();
			},
	
			onPaste: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				Foundation.Clipboard.getContent().then(content => {
					content = content.replace(/\t/g, ' '.repeat(self.childs.label.tabsize));
					content = content.replace(/\n/g, ' ');
		
					if(self.isInsertable(content.length) && self.restrict.test(content))
					{
						self.insertStringAt(content, self.position.global);
						self.moveEnd();
						self.update();
					}
				}); 
		
				event.preventDefault();
			},

			onHome: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				let index: number = computePrompt(self);

				for(let i: number = self.position.cursor.row - 1; i >= index; i--)
				{
					console.log('up');
					self.moveUp();
				}

				self.update(false);
				self.moveFirst();
				self.moveRight(2);
				self.update(false);

				event.preventDefault();
			},

			onEnd: (event: HTMLElementEventMap['keydown'], self: Editable) =>
			{
				self.moveEnd();
				self.update(false);
		
				event.preventDefault();
			},

			onUp: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				event.preventDefault();

				if(this._history.length > 0)
				{
					this._history.unshift(this._history.pop());

					self.removeStringAt(self.childs.label.content.lastIndexOf('\n⯈') + 3, self.childs.label.content.length);
					self.moveEnd();
					self.update();
					self.insertStringAt(this._history[0], self.position.global);
					self.moveEnd();
					self.update();
				}
			},

			onDown: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				event.preventDefault();

				if(this._history.length > 0)
				{
					this._history.push(this._history.shift());

					self.removeStringAt(self.childs.label.content.lastIndexOf('\n⯈') + 3, self.childs.label.content.length);
					self.moveEnd();
					self.update();
					self.insertStringAt(this._history[0], self.position.global);
					self.moveEnd();
					self.update();
				}			
			},
	
			onLeft: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				event.preventDefault();
	
				if(self.position.global > (self.childs.label.content.lastIndexOf('\n⯈') + 3))
				{
					self.moveLeft(1);
					self.update(false);
				}
			},
	
			onBackspace: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				event.preventDefault();
	
				if(self.position.global > (self.childs.label.content.lastIndexOf('\n⯈') + 3))
				{
					if(self.content[self.position.global - 1] == '"' || self.content[self.position.global - 1] == "'")
						instring ^= 1;

					self.removeStringAt(self.position.global - 1, self.position.global);
					self.moveLeft(1);
					self.update();
				}
			},
	
			onEnter: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				event.preventDefault();
	
				if(instring == 1)
					return;
					
				let splitted: string[] = self.childs.label.content.substring(self.childs.label.content.lastIndexOf('\n') + 3).trim().replace(/\s+/gm,' ').split(/ |(".*?")|('.*?')/);; //.split(/ |("[^"]+")|('[^']+')/);
				let hop: string = 'root';
				let current: any = undefined;
				let placeholders: any = {};
				let query: string = '';
				let route: string;	

				splitted = splitted.filter((word) => {
					return word !== undefined && word !== '';
				});

				for(let i: number = 0; i < splitted.length; i++)
				{
					current = this._catalog[hop];

					if(current)
					{
						for(let j: number = 0; j < current.length; j++)
						{
							if(current[j].name ==  'end' && current[j].name == splitted[i])
								route = current[j].catalog;

							if((splitted[i] == current[j].name) || (current[j].name == '?' && splitted[i]))
							{
								if(current[j].name ==  '?')
								{
									placeholders[current[j].brief] = splitted[i].replace(/^["']|["']$/g, '');
									splitted[i] = '?';
								}

								if(current[j].next)
									hop = current[j].next.replace(/\/([0-9]+)/, (a: any, b: any) => { return '/' + splitted[b]; });
								else
									hop = undefined;

								break;
							}	 
						}
					}

					query += splitted[i] + ' ';
				}

				let history: string = self.childs.label.content.substring(self.childs.label.content.lastIndexOf('\n') + 3)

				if(history.length > 0)
					this._history.push(history);

				if(this._history.length > 10)
					this._history.shift();
				
				self.childs.keyboard.disable();

				if(route)
				{
					this._wss.send({route: route, query: query.trim(), placeholders: placeholders}).then(
						(success: any) => {
							insertPrompt(self, filters.success);
							self.childs.keyboard.enable();
						},

						(fail: any) => {
							self.moveEnd();
							self.childs.label.filter[computePrompt(self)] = filters.white;
							self.update();

							self.insertStringAt('\n⯈ ' + fail.message, self.position.global);
							self.moveEnd();
							self.update();

							insertPrompt(self, filters.error);
							self.childs.keyboard.enable();
						}
					);	
				}
				else
				{
					insertPrompt(self, filters.white);
					self.childs.keyboard.enable();
				}
			},
	
			onTab: (event: HTMLElementEventMap['keydown'], self: Editable) => {
				event.preventDefault();

				if(instring == 1)
					return;

				function help(current: any[], query: string = '')
				{
					if(!current)
						return;
	
					if(current.length == 1 && current[0].name != '?')
					{
						self.insertStringAt(((self.childs.label.contentAs.splitted[self.position.cursor.row]).slice(-1) == ' ' ? '' : ' ') + current[0].name + ' ', self.position.global);
						self.moveEnd();
						self.update();
					}
					else
					{
						self.moveEnd();
						self.insertStringAt('\n', self.position.global);
						self.moveEnd();
						self.update();

						let length: number = current.length;
						let append: string = '';

						current.sort((a, b) => {	return a.name.localeCompare(b.name); });
						
						for(let i: number = 0; i < length; i++)
							append += current[i].name.padEnd(20, ' ') + current[i].brief.padEnd(50, ' ') + '\n';
							
						self.insertStringAt(append, self.position.global);
						self.moveEnd();
						self.update();

						self.childs.label.filter[computePrompt(self)] = filters.white;
						adjustFilters(self);

						self.insertStringAt('⯈ ' + query, self.position.global);
						self.moveEnd();
						self.update();

						for(let i: number = self.position.cursor.row - 1; i > self.position.cursor.row - length - 1; i--)
							self.childs.label.filter[i] = filters.help;

						self.moveEnd();
						self.update();		
					}
				}
	
				if(self.childs.label.contentAs.splitted[self.position.cursor.row] == '⯈ ')
					help(this._catalog['root']);
				else
				{
					let splitted: string[] = self.childs.label.content.substring(self.childs.label.content.lastIndexOf('⯈ ')).replace(/\s+/gm,' ').split(/ |(".*?")|('.*?')/);
					let hop: string = 'root';
					let current: any = undefined;
					let incomplete: boolean = false;
	
					splitted = splitted.filter((word) => {
						return word !== undefined && word !== '';
					});

					// remove '⯈ ' at the beginning
					splitted.shift();

					// find the last hop
					for(let i: number = 0; i < splitted.length; i++)
					{	
						incomplete = true;
						current = this._catalog[hop];

						if(current)
						{
							for(let j: number = 0; j < current.length; j++)
							{
								if((splitted[i] == current[j].name) || (current[j].name ==  '?' && splitted[i]))
								{
									incomplete = false;

									if(current[j].next)
										hop = current[j].next.replace(/\/([0-9]+)/, (a: any, b: any) => { return '/' + splitted[b]; });
									else
										hop = undefined;

									break;
								}
							}

							// avoid wrong word at the beginning but working anyways
							if(i >= 1 && hop == 'root')
								hop = undefined;
						}
					}
	
					if(!incomplete)
						help(this._catalog[hop], (self.childs.label.contentAs.splitted[self.position.cursor.row] + ' ').replace(/^⯈ /,'').replace(/\s+$/, ' '));
					else
					{
						current = this._catalog[hop];

						if(current)
						{
							let list: any = [];

							for(let j: number = 0; j < current.length; j++)
							{
								const regex: RegExp = new RegExp('^' + splitted[splitted.length - 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	
								if(regex.test(current[j].name))
									list.push(current[j]);
							}

							if(list.length == 1)
							{
								if(list[0].name == '?')
									help(this._catalog[hop], (self.childs.label.contentAs.splitted[self.position.cursor.row] + '').replace(/^⯈ /,''));
								else if(self.childs.label.contentAs.splitted[self.position.cursor.row].slice(-1) != ' ')
								{
									const incomplete: string = list[0].name.substring(splitted[splitted.length - 1].length);

									self.insertStringAt(incomplete + ' ', self.position.global);
									self.moveEnd();
									self.update();
								}
							}
							else if(list.length > 1)
								help(list, (self.childs.label.contentAs.splitted[self.position.cursor.row] + '').replace(/^⯈ /,''));
						}
					}
				}
			}
		});

		this.context.enroll(this._editable);

		this._editable.attachBackground(this);
		this._editable.attachCursor();
		this._editable.initialize();

		this._editable.moveLast();
		this._editable.update();
	}

	public update(): void
	{
		this._editable.width = this.width - this.puzzled.spacing;
		this._editable.height = this.height - this.puzzled.spacing;
		this._editable.childs.label.width = this.width - this.puzzled.spacing;
		this._editable.childs.label.height = this.height - this.puzzled.spacing;
		this._editable.update(true);
	}

	public onDetach(): void
	{
		this._editable.onDetach();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		this._editable.childs.label.draw(context2D);
	}

	

	// Accessors
	// --------------------------------------------------------------------------

	public get catalog(): any
	{
		return this._catalog;
	}
	public set catalog(catalog: any)
	{
		this._catalog = catalog;
	}

	public get childs(): {editable: Editable}
	{
		return {editable: this._editable};
	}
}
