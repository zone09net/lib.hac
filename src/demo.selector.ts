import * as Paperless from '@zone09.net/paperless';
import * as HaC from './lib.hac.js';



const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const context: Paperless.Context = new Paperless.Context({autosize: true});

const selector: HaC.Components.Selector = new HaC.Components.Selector({
	context: context,
	point: {x: 0, y: 0}, 
	size: {width: 500, height: 100}, 
	padding: {top: 10, left: 10},
	manipulator: new HaC.Controls.Selector.Align({
		restrict: Paperless.Enums.Restrict.horizontal,
		direction: {
			fadeout: Paperless.Enums.Direction.down,
			fadein: Paperless.Enums.Direction.top,
			shift: Paperless.Enums.Direction.right
		}
	}),
	items:[
		new HaC.Controls.Selector.Item({
			context: context,
			drawable: new Paperless.Drawables.Circle({context: context, outerRadius: 15, nostroke: true, fillcolor: colors[0]})
		}),
		new HaC.Controls.Selector.Item({
			context: context,
			drawable: new Paperless.Drawables.Circle({context: context, outerRadius: 15, nostroke: true, fillcolor: colors[1]})
		}),
		new HaC.Controls.Selector.Item({
			context: context,
			drawable: new Paperless.Drawables.Circle({context: context, outerRadius: 15, nostroke: true, fillcolor: colors[2]})
		}),
		new HaC.Controls.Selector.Item({
			context: context,
			drawable: new Paperless.Drawables.Circle({context: context, outerRadius: 15, nostroke: true, fillcolor: colors[3]})
		}),
		new HaC.Controls.Selector.Item({
			context: context,
			drawable: new Paperless.Drawables.Circle({context: context, outerRadius: 15, nostroke: true, fillcolor: colors[4]})
		}),

	],
});

context.attach(document.body);


