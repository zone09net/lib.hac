
import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import * as Foundation from '@zone09.net/foundation';



const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const wss: Foundation.WebSocketSecure = new Foundation.WebSocketSecure({
	link: 'wss://www.zone09.net:2222',
	//parser: { callback: Messaging.parser, smuggler: {context: this._context, brained: this} },
	//closer: { callback: Messaging.closer, smuggler: {context: this._context, brained: this} }
});

wss.send({route: 'datacenter', query: 'get catalog token ? end', placeholders: {token: localStorage.getItem("zone09.net#token")} }).then(
	(response: any) => { 
		let key: string = 'root';
		const catalog: any = response.data;
		const context: Paperless.Context = new Paperless.Context({autosize: true});
		const prompt: HaC.Components.Editable = new HaC.Components.Editable({
			point: {x: 32, y: 32},
			size: {width: window.innerWidth - 64, height: window.innerHeight - 64},
			focuscolor: colors[1],
			maxline: 3, 
			label: {
				content: '> ',
				font: '12px CPMono-v07-Light',
				padding: {top: 5, left: 5, right: 8},
				strokecolor: colors[0],
				wrapping: true,
				multiline: true,
				nostroke: true,
			},
			cursor: {
				fillcolor: '#45ce06',
				blink: true,
				alpha: 0.5,
				width: 9
			},

			onAttach: () =>
			{
				prompt.attachBackground(); 
				prompt.attachCursor();
				prompt.initialize();
			},

			onEscape: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
				event.preventDefault();

				self.clear();
				self.insertStringAt('> ', self.position.global);
				self.moveLast();
				self.update();
			},

			onUp: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
				event.preventDefault();
			},

			onDown: (event: HTMLElementEventMap['keydown'], self: HaC.Components.Editable) => {
				event.preventDefault();
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

				if(self.isInsertable(6))
				{
					self.insertStringAt('\nexec\n', self.position.global);
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

				function help(current: any[], query: string = '')
				{
					let append: string = '\n';
					
					for(let j: number = 0; j < current.length; j++)
					{
						append += current[j].name.padEnd(20, ' ');
						append += current[j].brief.padEnd(50, ' ');
						append += '\n';
					}

					self.insertStringAt(append + '> ' + query, self.position.global);
					self.moveLast();
				}

				self.moveLast();

				if(prompt.childs.label.contentAs.splitted[self.position.cursor.row] == '> ')
					help(catalog['root']);

				else
				{
					const splitted: string[] = prompt.childs.label.contentAs.splitted[self.position.cursor.row].replace(/\s+/gm,' ').split(' ');
					let hop: string = 'root';
					let current: any = undefined;
					let incomplete: boolean = false;
					let input: boolean = false;

					// remove '> ' at the beginning
					splitted.shift();

					// find the last hop
					for(let i: number = 0; i < splitted.length; i++)
					{
						incomplete = true;
						current = catalog[hop];

						if(current)
						{
							console.log(current)

							{
								for(let j: number = 0; j < current.length; j++)
								{
									if(current.length == 1 && current[0].name == '?' && splitted[i] != '')
									{
										input = true;

										// le space la cause erreur
										self.insertStringAt(' ' , self.position.global);
										self.moveLast();

										if(current[0].next)
											hop = current[0].next.replace(/\/([0-9]+)/, (a: any, b: any) => { return '/' + splitted[b]; });
										else
											hop = undefined;

										break;
									}
									if(splitted[i] == current[j].name)
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
					}

					if(!incomplete && !input)
						help(catalog[hop], (prompt.childs.label.contentAs.splitted[self.position.cursor.row] + ' ').replace(/^> /,''));
					else
					{
						current = catalog[hop];

						if(current)
						{
							let list: any = [];

							for(let j: number = 0; j < current.length; j++)
							{
								const regex: RegExp = new RegExp('^' + splitted[splitted.length - 1]);

								if(regex.test(current[j].name))
									list.push(current[j]);
							}
							
							if(list.length == 1)
							{
								if(list[0].name == '?')
									help(list, prompt.childs.label.contentAs.splitted[self.position.cursor.row].replace(/^> /,''));
								else
								{
									const incomplete: string = list[0].name.substring(splitted[splitted.length - 1].length);

									self.insertStringAt(incomplete + ' ' , self.position.global);
									self.moveLast();
								}
							}
							else if(list.length > 1)
								help(list, prompt.childs.label.contentAs.splitted[self.position.cursor.row].replace(/^> /,''));

								console.log(splitted)
						}
					}
				}

				self.update();
			}
		});

		context.attach(document.body);
		context.attach(prompt);
		context.setFocus(prompt.childs.control.guid);

		prompt.childs.control.movable = false;
		prompt.moveLast();
		prompt.update();
	},

	(error: any) => { }
);	





