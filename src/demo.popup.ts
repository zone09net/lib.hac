
import * as Paperless from '@zone09.net/paperless';
import * as HaC from './lib.hac.js';



const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const context: Paperless.Context = new Paperless.Context({autosize: true});

const popup: HaC.Components.Popup = new HaC.Components.Popup({
	context: context,
	dark: {
		fillcolor: '#0b0b0b',
	},
	title: { 
		content: 'paperless',
		fillcolor: colors[0],
		font: '20px CPMono-v07-Bold',
		filter: {
			0: {
				5: {fillcolor: '#666666'}
			}
		}
	},
	detail: {
		content: 'Simply... simple!',
		fillcolor: '#666666'
	},
	onOpen: (self: HaC.Components.Popup) => {
		/*
		console.log('opened');

					//popup.open().then(() => {
					//	popup.childs.detail.content = '';
					//	popup.childs.title.content = '';
					//	popup.noclick = true;
					//	popup.open();

						const window: HaC.Components.Window = new HaC.Components.Window({
							context: context,
								onCancel: (selfa: HaC.Components.Window) => {
									console.log('ksdh');
									self.close();
								},
							});

						window.open().then(() => { 
							console.log('**',self);
							self.close();
							window.close();
						});
					//});
		*/
	},
	onClose: (self: HaC.Components.Popup) => {
		//console.log('closed');
	},
	noclick: false,
	autoopen: true,
	width: 100
});

context.attach(document.body);
//context.attach(popup);

/*
popup.open().then(() => {
	popup.close();
});
*/


