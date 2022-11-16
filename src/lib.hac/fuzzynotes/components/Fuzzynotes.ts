import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../../puzzled/components/Puzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IComponentFuzzynotesAttributes} from '../interfaces/IFuzzynotes.js';
import {Resetter} from '../controls/Resetter.js'



export class Fuzzynotes extends Paperless.Component
{
	private _attributes: IComponentFuzzynotesAttributes;
	private _puzzled: Puzzled;
	private _header: Puzzled;
	private _resetter: Resetter;
	private _guids: Array<string> = [];
	private _eventWheel: any = null;
	//---

	public constructor(x: number, width: number, attributes: IComponentFuzzynotesAttributes = {})
	{
		super(new Paperless.Point(x, 0), new Paperless.Size(width, window.innerHeight));

		const {
			puzzled = {},
			background = {},
			borders = {},
			resetter = {},
			shade = {},
			padding = {},
			sticky = false
		} = attributes;

		this._attributes = {
			puzzled: {...{hop: 64, strokecolor: '#666666', fillcolor: '#000000'}, ...puzzled, ...{sticky: sticky, expandable: true}},
			background: {...{fillcolor: '#151515', visible: false}, ...background, ...{sticky: sticky, nostroke: true}},
			borders: {...{strokecolor: '#ffffff', linewidth: 2, visible: false}, ...borders, ...{sticky: sticky}},
			resetter: {...{fillcolor: '#ffffff', shadowcolor: '#ffffff', visible: false, hoverable: true}, ...resetter, ...{sticky: true, nostroke: true, scale: {x: 0.07, y: 1}}},
			shade: {...{fillcolor: '#151515', alpha: 0.85, top: 200, bottom: 30, overflow: 0, visible: false, hoverable: false}, ...shade, ...{sticky: true, nostroke: true}},
			padding: {...{top: 0, bottom: 0, left: 0, right: 0}, ...padding},
		};

		this.point.y = this._attributes.padding.top
		this.sticky = sticky;
	}

	public initialize(): void
	{
		this.attachPuzzled();
		this._attributes.borders.visible ? this.attachBorders(): null;
		this._attributes.background.visible ? this.attachBackground(): null;
		this._attributes.shade.visible ? this.attachShade(): null;
		this._attributes.resetter.visible ? this.attachResetter(): null;
	}

	private attachPuzzled(): void
	{
		let group: Paperless.Group = new Paperless.Group();

		this._puzzled = new Puzzled(new Paperless.Point(this.point.x + this.attributes.padding.left - (this._attributes.puzzled.spacing / 2), this.attributes.padding.top), new Paperless.Size(this.size.width - (this.attributes.padding.left + this.attributes.padding.right), this.size.height - (this.attributes.padding.top + this.attributes.padding.bottom)), this._attributes.puzzled);
		this._header = new Puzzled(new Paperless.Point(this.point.x + this.attributes.padding.left - (this._attributes.puzzled.spacing / 2), this.attributes.padding.top), new Paperless.Size(this.size.width - (this.attributes.padding.left + this.attributes.padding.right), this.size.height - (this.attributes.padding.top + this.attributes.padding.bottom)), {...this._attributes.puzzled, ...{sticky: true}});

		this.context.attach(this._puzzled);
		this.context.attach(this._header);
		this.context.attach(group);

		this._guids.push(this._puzzled.guid);
		this._guids.push(this._header.guid);
		this._guids.push(group.guid);
		
		group.attach([this._puzzled, this._header]);

		this._eventWheel = this.handleWheel.bind(null, this._puzzled, this);
		this.context.canvas.addEventListener("wheel", this._eventWheel, {passive: true});
	}

	private attachBackground(): void
	{
		let drawable: Paperless.Drawable;

		drawable = this.context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(this.point.x + (this.size.width / 2), window.innerHeight /2), new Paperless.Size(this.size.width, window.innerHeight), this._attributes.background));
		this._guids.push(drawable.guid);
	}

	private attachBorders(): void
	{
		let drawable: Paperless.Drawable;

		drawable = this.context.attach(new Paperless.Drawables.Line(new Paperless.Point(this.point.x, 0), new Paperless.Point(this.point.x, window.innerHeight), this._attributes.borders));
		this._guids.push(drawable.guid);

		drawable = this.context.attach(new Paperless.Drawables.Line(new Paperless.Point(this.point.x + this.size.width, 0), new Paperless.Point(this.point.x + this.size.width, window.innerHeight), this._attributes.borders));
		this._guids.push(drawable.guid);
	}

	private attachResetter(): void
	{
		let drawable: Paperless.Drawable;

		drawable = this.context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(this.point.x + (this.size.width / 2), window.innerHeight - 5 - this._attributes.padding.bottom), 100, {...this._attributes.resetter, ...{visible: false}}));
		drawable.rotation = -90;
		
		this._resetter = this.context.attach(new Resetter(this));
		this._resetter.attach(drawable);

		this._guids.push(drawable.guid);
		this._guids.push(this._resetter.guid);
	}

	private attachShade(): void
	{
		let drawable: Paperless.Drawable;
		let control: Paperless.Control;
		
		if(this._attributes.shade.top > 0)
		{
			drawable = this.context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(this.point.x + (this.size.width / 2), this._attributes.shade.top / 2), new Paperless.Size(this._puzzled.size.width + (this._attributes.shade.overflow * 2) - this._puzzled.spacing - this._attributes.borders.linewidth, this._attributes.shade.top), this._attributes.shade));
			control = this.context.attach(new Paperless.Controls.Blank({enabled: false}));
			control.attach(drawable);

			this._guids.push(drawable.guid);
			this._guids.push(control.guid);
		}
		
		if(this._attributes.shade.bottom > 0)
		{
			drawable = this.context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(this.point.x + (this.size.width / 2), window.innerHeight - (this._attributes.shade.bottom / 2)), new Paperless.Size(this._puzzled.size.width + (this._attributes.shade.overflow * 2) - this._puzzled.spacing - this._attributes.borders.linewidth, this._attributes.shade.bottom), this._attributes.shade));
			control = this.context.attach(new Paperless.Controls.Blank({enabled: false}));
			control.attach(drawable);

			this._guids.push(drawable.guid);
			this._guids.push(control.guid);
		}
	}
	
	public toTop(): void
	{
		this._resetter.onLeftClick();
	}

	public new(entities: Array<{point?: Paperless.Point, size?: Paperless.Size, control: typeof EntityCoreControl, drawable: typeof EntityCoreDrawable, header?: boolean, attributes?: any, backdoor?: any, transpose?: boolean}>): void
	{
		for(let entity of entities)
		{
			const {
				attributes = {},
			} = entity;
			entity.attributes = attributes;

			if(entity.header === true)
			{
				this._header.new([{
					point: entity.point,
					size: entity.size,
					control: entity.control,
					drawable: entity.drawable,
					transpose: entity.transpose,
					attributes: { ...attributes, ...{sticky: true} },
					backdoor: entity.backdoor
				}]);
			}
			else
			{
				this._puzzled.new([{
					point: entity.point,
					size: entity.size,
					control: entity.control,
					drawable: entity.drawable,
					transpose: entity.transpose,
					attributes: { ...attributes, ...{sticky: this.sticky} },
					backdoor: entity.backdoor
				}]);
			}
		}
	}

	public onAttach(): void
	{
		this.initialize();
	}

	public onDetach(): void
	{
		this.context.canvas.removeEventListener("wheel", this._eventWheel, {});
		this.context.detach(this._guids);
		this._guids = [];
	}

	public onResize(): void
	{
		console.log('onResize')
	}

	public getDrawables(): Array<Paperless.Drawable>
	{
		let drawables: Array<Paperless.Drawable> = [...[], ...(this._puzzled ? this._puzzled.getDrawables() : []), ...this._header ? this._header.getDrawables() : []];

		for(let guid of this._guids)
		{
			let version = guid.charAt(14);
			let variant = guid.charAt(19);

			if(version == '1' && variant == 'a')
				drawables.push(this.context.get(guid))
		}
		
		return drawables;
	}

	/*
	onResize()
	{
		let x: number = this._childs.controls.puzzled.point.x;

		this.point = new Paperless.Point((window.innerWidth - 800) / 2, 16);
		this.size = new Paperless.Size(800, window.innerHeight);

		this._childs.drawables.leftline1.point1 = new Paperless.Point(this.point.x, 0);
		this._childs.drawables.leftline1.point2 = new Paperless.Point(this.point.x, window.outerHeight);
		this._childs.drawables.leftline1.point = Paperless.Point.middle(this._childs.drawables.leftline1.point1, this._childs.drawables.leftline1.point2)
		this._childs.drawables.leftline1.generate();

		this._childs.drawables.leftline2.point1 = new Paperless.Point(this.point.x + 2, 0);
		this._childs.drawables.leftline2.point2 = new Paperless.Point(this.point.x + 2, window.outerHeight)
		this._childs.drawables.leftline2.point = Paperless.Point.middle(this._childs.drawables.leftline2.point1, this._childs.drawables.leftline2.point2)
		this._childs.drawables.leftline2.generate();

		this._childs.drawables.rightline1.point1 = new Paperless.Point(this.point.x + this.size.width, 0);
		this._childs.drawables.rightline1.point2 = new Paperless.Point(this.point.x + this.size.width, window.outerHeight);
		this._childs.drawables.rightline1.point = Paperless.Point.middle(this._childs.drawables.rightline1.point1, this._childs.drawables.rightline1.point2)
		this._childs.drawables.rightline1.generate();

		this._childs.drawables.rightline2.point1 = new Paperless.Point(this.point.x + this.size.width - 2, 0);
		this._childs.drawables.rightline2.point2 = new Paperless.Point(this.point.x + this.size.width - 2, window.outerHeight);
		this._childs.drawables.rightline2.point = Paperless.Point.middle(this._childs.drawables.rightline2.point1, this._childs.drawables.rightline2.point2)
		this._childs.drawables.rightline2.generate();

		this._childs.controls.puzzled.point.x = this.point.x + 16;
		this._childs.controls.puzzled.removeMarker();
		this._childs.controls.puzzled.detach(this._childs.controls.puzzled.getIcons());

		for(let guid in this._childs.controls.puzzled.getEntities())
			this._childs.controls.puzzled.extractGuid(guid).drawable.point.x -= x - this._childs.controls.puzzled.point.x;

		this._childs.controls.lock.drawable.point.x -= x - this._childs.controls.puzzled.point.x;
		this._childs.controls.cross.drawable.point.x -= x - this._childs.controls.puzzled.point.x;
		this._childs.controls.arrow.drawable.point.x -= x - this._childs.controls.puzzled.point.x;
		this._childs.controls.arrow.drawable.point.y = window.innerHeight - 26;

		this.context.refresh();
	}
	*/

	handleWheel(puzzled: Puzzled, fuzzynotes: Fuzzynotes, event: HTMLElementEventMap['wheel']): void
	{
		if(puzzled.context.getStates().pointCurrent.x >= puzzled.point.x &&
			puzzled.context.getStates().pointCurrent.x <= puzzled.point.x + puzzled.size.width &&
			puzzled.context.getStates().pointCurrent.y >= puzzled.point.y 
			/*puzzled.context.getStates().pointCurrent.y <= puzzled.point.y + puzzled.size.height*/)
		{
			let delta: number = 0;

			if(event.deltaY > 0)
			{
				puzzled.point.y -= puzzled.hop;
				delta = -puzzled.hop;

				if(fuzzynotes._resetter)
					fuzzynotes._resetter.drawable.visible = true;
			}
			else
			{
				puzzled.point.y += puzzled.hop;
				
				if(puzzled.point.y > fuzzynotes.attributes.padding.top)
					puzzled.point.y = fuzzynotes.attributes.padding.top;
				else
					delta = puzzled.hop;
			}

			if(puzzled.point.y == fuzzynotes.attributes.padding.top && fuzzynotes._resetter)
				fuzzynotes._resetter.drawable.visible = false;

			for(let control of puzzled.getControls(true))
			{
				let source: Paperless.Point = new Paperless.Point(control.drawable.point.x, control.drawable.point.y);

				control.drawable.point.y += delta;
				(<EntityCoreControl>control).onMoved(source);
			}

			if(puzzled.getMarker())
			{
				puzzled.removeMarker();
				puzzled.detach(puzzled.getIcons());
			}

			puzzled.context.refresh();
		}
	}

	/*
	handleResize(puzzled: Puzzled, fuzzynotes: Fuzzynotes, event: HTMLElementEventMap['resize']) 
	{
		clearTimeout(fuzzynotes._timeResizing);
		fuzzynotes._timeResizing = setTimeout(() => {
			fuzzynotes.onResize();
		}, 250);
	}
	*/



	// Accessors
	// --------------------------------------------------------------------------

	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}

	public get attributes(): IComponentFuzzynotesAttributes
	{
		return this._attributes;
	}
}
