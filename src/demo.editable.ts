
import * as Paperless from '@zone09.net/paperless';
import * as HaC from './lib.hac.js';



const context: Paperless.Context = new Paperless.Context({autosize: true});
const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
let label: Paperless.Drawables.Label;

const editable1: HaC.Components.Editable = new HaC.Components.Editable({
	point: {x: 100, y: 100},
	size: {width: 256, height: 512},
	focuscolor: colors[1],
	label: {
		content: '',
		font: '12px CPMono-v07-Light',
		padding: {top: 5, left: 5, right: 0, bottom: 0},
		fillbackground: '#000000',
		strokecolor: colors[0],
		wrapping: true,
		spacing: 3,
		multiline: true,
		nostroke: false,
		filter: {
			0: {
				0: {fillcolor: '#ffffff'},
			},
			1: {
				0: {fillcolor: '#999999'},
			},
		},
	//	offset1: {x: 0, y: 0}
	},
	cursor: {
		fillcolor: colors[1],
		blink: true,
		alpha: 0.5,
		width: 9
	}
});


const editable2: HaC.Components.Editable = new HaC.Components.Editable({
	point: {x: 456, y: 100},
	size: {width: 262, height: 126},
	focuscolor: colors[1],
	maxline: 3,
	label: {
		content: 'Hello Word!!',
		font: '12px CPMono-v07-Light',
		padding: {top: 5, left: 5, right: 8},
		fillbackground: '#000000',
		strokecolor: colors[0],
		wrapping: true,
		//spacing: 3,
		multiline: true,
		nostroke: false,
		//offset1: {x: 0, y: 0}
	},
	cursor: {
		fillcolor: colors[1],
		blink: false,
		alpha: 0.5,
		width: 9
	},
	customlabel: label
});


context.attach(document.body);
context.attach(editable1);
context.attach(editable2);
