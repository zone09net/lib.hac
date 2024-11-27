
import * as Foundation from '@zone09.net/foundation';
import * as Paperless from '@zone09.net/paperless';
import * as HaC from './lib.hac.js';



class Console extends Paperless.Component
{
	private _wss: Foundation.WebSocketSecure;
	private _catalog: any = {};
	private _history: string[] = [];
	//---

	// @ts-ignore
	public constructor(attributes: Paperless.Interfaces.IComponentAttributes = {})
	{
		const context: Paperless.Context = attributes.context;

		super({
			...attributes, 
			...{
				context: null,
				layer: null,
			}
		});

		const {
			layer = null,
		} = attributes;

		context ? context.attach(this, layer) : null;
	}

	public onAttach(): void
	{
		this.editable();

		this._wss = new Foundation.WebSocketSecure({
			link: 'wss://www.zone09.net:3333',
			initier: { callback: this.initier, smuggler: {catalog: this._catalog} },
			parser: { callback: this.parser, smuggler: {} },
			closer: { callback: this.closer, smuggler: {console: this} }
		});

		this._wss.connect();
	}

	private editable(): void
	{
		this.enroll(
			new HaC.Components.Editable({
				context: this.context,
				point: {x: 16, y: 16},
				size: {width: window.innerWidth - 32, height: window.innerHeight - 32},
				maxline: 3, 
				label: {
					content: '> ',
					font: '12px CPMono-v07-Light',
					padding: {top: 5, left: 5, right: 8},
					fillcolor: '#999999',
					wrapping: true,
					multiline: true,
					nostroke: true,
					filter: {
						0: {
							0: {fillcolor: '#666666'},
							1: {fillcolor: '#999999'}
						}
					}
				},
				cursor: {
					fillcolor: '#476E20',
					blink: true,
					alpha: 0.5,
					width: 7
				},
		
				onAttach: (self: HaC.Components.Editable) =>
				{
					self.attachBackground(); 
					self.attachCursor();
					self.initialize();
		
					self.context.setFocus(self.childs.control.guid);
		
					self.childs.control.movable = false;
					self.moveLast();
					self.update();
				},
		
				onEscape: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					event.preventDefault();
		
					self.clear();
					self.insertStringAt('> ', self.position.global);
					self.moveLast();
		
					self.childs.label.filter = {
						0: {
							0: {fillcolor: '#666666'},
							1: {fillcolor: '#999999'}
						}
					};
		
					self.update();
				},
		
				onHome: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					self.moveLeft(self.position.cursor.column - 2);
					self.update(false);

					event.preventDefault();
				},

				onCtrlHome: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					self.moveLeft(self.position.cursor.column - 2);
					self.update(false);

					event.preventDefault();
				},
		
				onUp: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					event.preventDefault();

					if(this._history.length > 0)
					{
						this._history.unshift(this._history.pop());

						self.removeStringAt(self.position.global - self.position.cursor.column + 2, self.position.global);
						self.insertStringAt(this._history[0], self.position.global);
						self.moveLast();
						self.update();
					}
				},

				onDown: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					event.preventDefault();

					if(this._history.length > 0)
					{
						this._history.push(this._history.shift());

						self.removeStringAt(self.position.global - self.position.cursor.column + 2, self.position.global);
						self.insertStringAt(this._history[0], self.position.global);
						self.moveLast();
						self.update();
					}			
				},
		
				onLeft: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					event.preventDefault();
		
					if(self.position.cursor.column > 2)
					{
						self.moveLeft(1);
						self.update(false);
					}
				},
		
				onBackspace: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					event.preventDefault();
		
					if(self.position.cursor.column > 2)
					{
						self.removeStringAt(self.position.global - 1, self.position.global);
						self.moveLeft(1);
						self.update();
					}
				},
		
				onEnter: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					event.preventDefault();
		
					const splitted: string[] = self.childs.label.contentAs.splitted[self.position.cursor.row].substring(2).trim().replace(/\s+/gm,' ').split(' ');
					let hop: string = 'root';
					let current: any = undefined;
					let placeholders: any = {};
					let query: string = '';
					let route: string;

					for(let i: number = 0; i < splitted.length; i++)
					{
						current = this._catalog[hop];
	
						if(current)
						{
							for(let j: number = 0; j < current.length; j++)
							{
								if(current[j].name ==  'end')
									route = current[j].catalog;

								if((splitted[i] == current[j].name) || (current[j].name ==  '?' && splitted[i]))
								{
									if(current[j].name ==  '?')
									{
										placeholders[current[j].brief] = splitted[i];
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

					// not working ???
					//self.childs.keyboard.disable();

					this._history.push(self.childs.label.contentAs.splitted[self.position.cursor.row].substring(2).trim());

					self.childs.label.filter[self.position.cursor.row + 1] = {
						0: {fillcolor: '#666666'},
						1: {fillcolor: '#999999'}
					};

					if(route)
					{
						this._wss.send({route: route, query: query.trim(), placeholders: placeholders}).then(
							(success: any) => {
								console.log(success);
								self.childs.label.filter[self.position.cursor.row] = {
									0: {fillcolor: '#45ce06'},
									1: {fillcolor: '#999999'}		
								};	
			
								self.moveLast();
								self.insertStringAt('\n> ', self.position.global);
								self.moveLast();
								self.update();
							},
							(fail: any) => {
								self.childs.label.filter[self.position.cursor.row + 1] = {
									0: {fillcolor: '#ff0000'},
									1: {fillcolor: '#ff0000cc'},
								};
								self.childs.label.filter[self.position.cursor.row + 2] = {
									0: {fillcolor: '#666666'},
									1: {fillcolor: '#999999'}		
								};
								
								self.moveLast();
								self.insertStringAt('\n> ' + fail.message + '\n> ', self.position.global);
								self.moveLast();
								self.update();
							}
						);	
					}
					else
					{
						self.moveLast();
						self.insertStringAt('\n> ', self.position.global);
						self.moveLast();
						self.update();
					}
				},
		
				onKey: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					event.preventDefault();
		
					if(self.isInsertable(1) && self.restrict.test(event.key))
					{
						self.insertStringAt(event.key, self.position.global)
						self.moveRight(1);
						self.update();
					}
				},
		
				onTab: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
					event.preventDefault();
		
					let min: number;
					let max: number;
		
					function help(current: any[], query: string = '')
					{
						if(!current)
							return;
		
						let append: string = '\n';
						
						for(let j: number = 0; j < current.length; j++)
						{
							append += current[j].name.padEnd(20, ' ');
							append += current[j].brief.padEnd(50, ' ');
							append += '\n';
						}
		
						self.insertStringAt(append + '> ' + query, self.position.global);
						self.moveLast();
		
						min = self.position.cursor.row + 1;
						max = self.position.cursor.row + current.length + 1;
					}
		
					self.moveLast();
		
					if(self.childs.label.contentAs.splitted[self.position.cursor.row] == '> ')
						help(this._catalog['root']);
		
					else
					{
						const splitted: string[] = self.childs.label.contentAs.splitted[self.position.cursor.row].replace(/\s+/gm,' ').split(' ');
						let hop: string = 'root';
						let current: any = undefined;
						let incomplete: boolean = false;
		
						// remove '> ' at the beginning
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
							}
						}
		
						if(!incomplete)
							help(this._catalog[hop], (self.childs.label.contentAs.splitted[self.position.cursor.row] + ' ').replace(/^> /,''));
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
										help(this._catalog[hop], (self.childs.label.contentAs.splitted[self.position.cursor.row] + '').replace(/^> /,''));
									else
									{
										const incomplete: string = list[0].name.substring(splitted[splitted.length - 1].length);
			
										self.insertStringAt(incomplete + ' ' , self.position.global);
										self.moveLast();
									}
								}
								else if(list.length > 1)
									help(list, self.childs.label.contentAs.splitted[self.position.cursor.row].replace(/^> /,''));
							}
						}
					}
		
					if(max)
					{
						for(let i: number = min; i < max; i++)
						{
							self.childs.label.filter[i] = {
								0: {fillcolor: '#c8af55'},
								20: {fillcolor: '#666666'},	
							};
						}
		
						self.childs.label.filter[max] = {
							0: {fillcolor: '#666666'},
							1: {fillcolor: '#999999'}		
						};
					}
		
					self.update();
				}
			})
		);
	}

	private initier(raw: Foundation.IWebSocketSecureRaw, smuggler: any): Foundation.IWebSocketSecureCallback
	{
		const catalog: any = smuggler.catalog;

		if(Foundation.WebSocketSecure.undefined([raw, raw.guid, raw.response, raw.response.message]))
			return {success: false, response: {status: 0, data: null, message: 'Data received from the server seems incorrect.'}};
	
		Object.entries(raw.response.message.catalogs).forEach(([key0, value0]: any) => {
			Object.entries(value0).forEach(([key1, value1]: any) => {
				Object.entries(value1).forEach(([key2, value2]: any) => {
					value2.catalog = key0;
				});
			});
		});

		Object.entries(raw.response.message.catalogs).forEach(([key0, value0]: any) => {
			Object.entries(value0).forEach(([key1, value1]: any) => {
				Object.entries(value1).forEach(([key2, value2]: any) => {
					if(!catalog[key1])
						catalog[key1] = [];
	
					let filter = catalog[key1].filter((entry: any) => entry.name == value2.name);
	
					if(filter.length <= 0)
						catalog[key1].push(value2);
				});
			});
		});

		return {success: true, response: raw.response};
	}

	private parser(raw: Foundation.IWebSocketSecureRaw, smuggler: any): Foundation.IWebSocketSecureCallback
	{
		if(Foundation.WebSocketSecure.undefined([raw, raw.guid, raw.response, raw.response.message]))
			return {success: false, response: {status: 0, data: null, message: 'Data received from the server seems incorrect.'}};
	
		switch(raw.response.status)
		{
			case 'wrong':
				return {success: false, response: raw.response};
				break;
		}
	
		return {success: true, response: raw.response};
	}

	private closer(raw: Foundation.IWebSocketSecureRaw, smuggler: any): Foundation.IWebSocketSecureCallback
	{
		if(Foundation.WebSocketSecure.undefined([raw, raw.response]))
			return {success: false, response: {status: 0, data: null, message: 'Data received from the server seems incorrect.'}};
	
		const editable: HaC.Components.Editable = smuggler.console.getComponents()[0];

		editable.childs.label.filter[editable.position.cursor.row + 1] = {
			0: {fillcolor: '#ff0000'},
			1: {fillcolor: '#ff0000cc'},
		};
		editable.childs.label.filter[editable.position.cursor.row + 2] = {
			0: {fillcolor: '#666666'},
			1: {fillcolor: '#999999'}		
		};
		
		editable.insertStringAt('\n> ' + raw.response + '\n> ', editable.position.global);
		editable.moveLast();
		editable.update();

		return {success: false, response: raw.response};
	}
}


const context: Paperless.Context = new Paperless.Context({autosize: true});

context.attach(document.body);

new Console({
	context: context	
});
