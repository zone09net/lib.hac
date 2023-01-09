import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';



let context: Paperless.Context = new Paperless.Context({autosize: true});
context.attach(document.body);

let colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];



// palette
let palette: HaC.Components.Palette = new HaC.Components.Palette(new Paperless.Point(600, 175), (fillcolor: string, strokecolor: string) => {
	console.log('fillcolor', fillcolor, 'strokecolor', strokecolor);
});
context.attach(palette);



// editable
context.attach(new HaC.Components.Editable(new Paperless.Point(0, 100), new Paperless.Size(240, 150), {
	focuscolor: colors[1],
	label: {
		content: '',
		font: '14px CPMono-v07-Light',
		padding: {top: 5, left: 5},
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
		offset: {x: 10, y: 0}
	},
	cursor: {
		fillcolor: colors[1],
		blink: false,
		alpha: 0.5,
		width: 9
	}
}));

context.attach(new HaC.Components.Editable(new Paperless.Point(250, 100), new Paperless.Size(240, 150), {
	focuscolor: colors[1],
	label: {
		content: '',
		font: '14px CPMono-v07-Light',
		padding: {top: 5, left: 5},
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
		offset: {x: 10, y: 0}
	},
	cursor: {
		fillcolor: colors[1],
		blink: false,
		alpha: 0.5,
		width: 9
	}
}));


// selector
let item1: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item2: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item3: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item4: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item5: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());

item1.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {nostroke: true, fillcolor: colors[0]})));
item2.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {nostroke: true, fillcolor: colors[1]})));
item3.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {nostroke: true, fillcolor: colors[2]})));
item4.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {nostroke: true, fillcolor: colors[3]})));
item5.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {nostroke: true, fillcolor: colors[4]})));

let manipulator: HaC.Controls.Selector.Align = new HaC.Controls.Selector.Align({
	restrict: Paperless.Enums.Restrict.horizontal,
	direction: {
		fadeout: Paperless.Enums.Direction.down,
		fadein: Paperless.Enums.Direction.top,
		shift: Paperless.Enums.Direction.right
	}
});
let selector: HaC.Components.Selector = new HaC.Components.Selector(new Paperless.Point(0, 0), new Paperless.Size(500, 300), manipulator, {padding: {top: 10, left: 10}});

selector.attach([
	item1, 
	item2, 
	item3, 
	item4,
	item5,
]);

context.attach(selector);



/*
// popup
let popup: HaC.Components.Popup = context.attach(new HaC.Components.Popup({
	topic: 'paper', 
	subtopic: 'less',
	topicColor: '#bd3a2e',
	subtopicColor: '#555555',
	detail: 'Simply... simple!'
}));

popup.show().then(() => {
	popup.update({
		topic: 'Hook a',
		subtopic: ' Component',
		subtopicColor: '#bd3a2e',
		topicColor: '#555555',
		detail: 'Extend the possibilities'
	});
	popup.show();
});
*/




/*
// label & editor
// ----------

let editable: HaC.Components.Editable = new HaC.Components.Editable(new Paperless.Point(486, 20), new Paperless.Size(window.innerWidth - 500, 600), {
	font: '16px CPMono_v07_Light',
	fontColor: '#999999',
	wrap: true,
	spacing: 5,
	//maxCharacter: 10,
	monofont: true,
	multiline: false,
	filter: {
		0: {
			0: {fillcolor: '#ff0000'},
			2: {fillcolor: '#ffffff', mark: true, markcolor: '#666666'},
			10: {mark: false},
		}
	}
});
context.attach(editable);
editable.childs.label.font = '26px SegoeUI-Bold'


context.attach(new HaC.Components.Editable(new Paperless.Point(486, 50), new Paperless.Size(window.innerWidth - 500, 234), {
	font: '16px CPMono_v07_Light',
	fontColor: '#ff9999',
	wrap: true,
	spacing: 5,
	monofont: true,
	multiline: true,
	filter: {
		0: {
			4: {fillcolor: '#ff0000'},
			5: {fillcolor: '#ffffff', mark: true, markcolor: '#666666'},
			10: {mark: false},
		},
		1: {
			2: {fillcolor: '#a3f543', mark: true, markcolor: '#ff0000'},
		},
		3: {
			2: {mark: false, markcolor: '#ff0000',fillcolor: '#ffffff'},
		},
	}
}));
*/




/*
import {PostIt} from './app.PostIt/Components.js';
let postit: PostIt = new PostIt(new Paperless.Point(486, 16), new Paperless.Size(window.innerWidth - 500, window.innerHeight - 16)); 
context.attach(postit);
*/



