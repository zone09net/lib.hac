import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';



const context: Paperless.Context = new Paperless.Context({autosize: true});
const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];

const window1: HaC.Components.Window = new HaC.Components.Window({
	header: {
		font: '13px CPMono-v07-Bold',
		content: 'Window 1'
	}
});

const window2: HaC.Components.Window = new HaC.Components.Window({
	point: {x: 200, y: 200},
	size: {width: 256, height: 256},
	header: {
		font: '13px CPMono-v07-Bold',
		content: 'Window 2'
	}
});

context.attach(document.body);
context.attach(window1);
context.attach(window2);

window1.open().then(() => {
});

window2.open().then(() => {
});
