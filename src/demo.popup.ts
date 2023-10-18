
import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';



const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const context: Paperless.Context = new Paperless.Context({autosize: true});

const popup: HaC.Components.Popup = new HaC.Components.Popup({
	dark: {
		fillcolor: '#111111',
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
});

context.attach(document.body);
context.attach(popup);

popup.open().then(() => {
	popup.childs.title.font = '40px CPMono-v07-Bold';
	popup.open();
});



