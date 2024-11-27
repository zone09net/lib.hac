
import * as Paperless from '@zone09.net/paperless';
import * as HaC from './lib.hac.js';



const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const context: Paperless.Context = new Paperless.Context({autosize: true});

const palette: HaC.Components.Palette = new HaC.Components.Palette(
	{
		point: {x: window.innerWidth / 2, y: window.innerHeight / 2},
		callback: (fillcolor: string, strokecolor: string) => {
			console.log('fillcolor', fillcolor, 'strokecolor', strokecolor);
		}
	}
);

context.attach(document.body);
context.attach(palette);


