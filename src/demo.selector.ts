
import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';



const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const context: Paperless.Context = new Paperless.Context({autosize: true});

const manipulator: HaC.Controls.Selector.Align = new HaC.Controls.Selector.Align({
	restrict: Paperless.Enums.Restrict.horizontal,
	direction: {
		fadeout: Paperless.Enums.Direction.down,
		fadein: Paperless.Enums.Direction.top,
		shift: Paperless.Enums.Direction.right
	}
});

const selector: HaC.Components.Selector = new HaC.Components.Selector(manipulator, {
	point: {x: 0, y: 0}, 
	size: {width: 500, height: 100}, 
	padding: {top: 10, left: 10}
});

let items: HaC.Controls.Selector.Item[] = [];
for(let i = 0; i < 5; i++)
{
	items[i] = context.attach(new HaC.Controls.Selector.Item());
	items[i].attach(context.attach(new Paperless.Drawables.Circle({
		outerRadius: 15, 
		nostroke: true, 
		fillcolor: colors[i]
	})));
}

selector.attach([ items[0], items[1], items[2], items[3], items[4] ]);

context.attach(document.body);
context.attach(selector);

