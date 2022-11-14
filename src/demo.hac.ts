import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';



let context: Paperless.Context = new Paperless.Context({stageOffset: 0, autosize: true});
context.attach(document.body);


/*
// palette
let palette: HaC.Components.Palette = new HaC.Components.Palette(new Paperless.Point(window.innerWidth / 2, window.innerHeight / 2), (fillcolor: string, strokecolor: string) => {
	console.log('fillcolor', fillcolor, 'strokecolor', strokecolor);

});
context.attach(palette);
*/


/*
// editable
context.attach(new HaC.Components.Editable(new Paperless.Point(16, 16), new Paperless.Size(500, 500), {
	label: {
		content: '',
		font: '14px CPMono-v07-Light',
		padding: {top: 5, left: 5},
		//fillcolor: '#ff9999',
		fillbackground: '#000000',
		strokecolor: '#666666',
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
		offset: {x: 15, y: 15}
	},
	cursor: {
		blink: false,
		alpha: 0.5,
		width: 9
	}

}));
context.attach(new HaC.Components.Editable(new Paperless.Point(532, 16), new Paperless.Size(500, 500), {
	label: {
		content: '',
		font: '16px CPMono-v07-Light',
		padding: {top: 5, left: 5},
		fillcolor: '#999999',
		fillbackground: '#000000',
		strokecolor: '#666666',
		wrapping: true,
		spacing: 3,
		multiline: true,
		nostroke: false,
		
	},
	//color: { cursor: '#ff0000'},

}));
*/


// selector
let item1: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item2: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item3: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item4: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item5: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item6: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());
let item7: HaC.Controls.Selector.Item = context.attach(new HaC.Controls.Selector.Item());

item1.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#87172f'})));
item2.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#87aa2f'})));
item3.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#b9aab5'})));
item4.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#6bea75'})));
item5.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#87aa2f'})));
item6.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#b9aab5'})));
item7.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#6bea75'})));

let manipulator: HaC.Controls.Selector.Align = new HaC.Controls.Selector.Align({
	//align: Paperless.Enums.Align.Vertical,
	//direction: {
	//	fadeout: Paperless.Enums.Direction.Right,
	//	fadein: Paperless.Enums.Direction.Left,
	//	shift: Paperless.Enums.Direction.Down
	//}
});
let selector: HaC.Components.Selector = new HaC.Components.Selector(new Paperless.Point(0, 0), new Paperless.Size(500, 500), manipulator, {padding: {top: 10, left: 10}});

selector.attach([
	item1, 
	item2, 
	item3, 
	item4,
	item5,
	item6,
	item7
]);

context.attach(selector);

console.log(context.getControls())
console.log(context.getDrawables())

console.log('***');

context.detach(selector.guid)

console.log(context.getControls())
console.log(context.getDrawables())


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



