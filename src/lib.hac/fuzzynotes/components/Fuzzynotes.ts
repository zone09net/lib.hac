import * as Paperless from '@zone09.net/paperless';
import {Form} from '../../form/components/Form.js';
import {Puzzled} from '../../puzzled/components/Puzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IComponentFuzzynotesAttributes} from '../interfaces/IFuzzynotes.js';
import {Resetter} from '../controls/Resetter.js'
import {Restrict} from '../../puzzled/enums/Restrict.js';



export class Fuzzynotes extends Paperless.Component
{
	private _attributes: IComponentFuzzynotesAttributes;
	private _puzzled: Puzzled;
	private _header: Puzzled;
	private _resetter: Resetter;
	private _topshade: Paperless.Control;
	private _bottomshade: Paperless.Control;
	private _guids: Array<string> = [];
	private _drawables: Array<string> = [];
	private _eventWheel: any = null;
	private _formMain: Form;
	private _formHeader: Form;
	//---

	public constructor(attributes: IComponentFuzzynotesAttributes = {})
	{
		super();

		const {
			x = 0,
			width = window.innerWidth,
			puzzled = {},
			background = {},
			borders = {},
			resetter = {},
			shade = {},
			padding = {},
			sticky = false
		} = attributes;

		this._attributes = {
			puzzled: {...{hop: 19, strokecolor: '#666666', fillcolor: '#000000'}, ...puzzled, ...{sticky: sticky, expandable: {width: false, height: true}}},
			background: {...{fillcolor: '#151515', visible: false}, ...background, ...{sticky: sticky, nostroke: true}},
			borders: {...{strokecolor: '#ffffff', linewidth: 2, visible: false}, ...borders, ...{sticky: sticky}},
			resetter: {...{fillcolor: '#ffffff', shadowcolor: '#ffffff', visible: false, hoverable: true}, ...resetter, ...{sticky: true, nostroke: true, scale: {x: 0.07, y: 1}}},
			shade: {...{fillcolor: '#151515', alpha: 0.85, top: 200, bottom: 30, overflow: 0, visible: false, hoverable: false}, ...shade, ...{sticky: true, nostroke: true}},
			padding: {...{top: 0, bottom: 0, left: 0, right: 0}, ...padding},
		};

		this.x = 0;
		this.y = this._attributes.padding.top;
		this.width = width;
		this.height = window.innerHeight;
		this.sticky = sticky;

		this._formMain = new Form();
		this._formHeader = new Form();
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

		this._puzzled = new Puzzled({
			...this._attributes.puzzled,
			...{
				point: {
					x: this.x + this.attributes.padding.left - (this._attributes.puzzled.spacing / 2),
					y: this.attributes.padding.top
				},
				size: {
					width: this.width - (this.attributes.padding.left + this.attributes.padding.right),
					height: this.height - (this.attributes.padding.top + this.attributes.padding.bottom)
				}
			}
		});
		this._header = new Puzzled({
			...this._attributes.puzzled,
			...{
				point: {
					x: this.x + this.attributes.padding.left - (this._attributes.puzzled.spacing / 2),
					y: this.attributes.padding.top
				},
				size: {
					width: this.width - (this.attributes.padding.left + this.attributes.padding.right),
					height: this.height - (this.attributes.padding.top + this.attributes.padding.bottom)
				},
				sticky: true
			}
		});

		this.context.attach(this._puzzled);
		this.context.attach(this._header);
		this.context.attach(group);

		this._guids.push(this._puzzled.guid);
		this._guids.push(this._header.guid);
		this._guids.push(group.guid);
		
		group.attach([this._puzzled, this._header]);

		this._formMain.puzzled = this._puzzled;
		this._formHeader.puzzled = this._header;

		this._eventWheel = this.handleWheel.bind(null, this._puzzled, this);
		this.context.canvas.addEventListener("wheel", this._eventWheel, {passive: true});
	}

	private attachBackground(): void
	{
		let drawable: Paperless.Drawable;

		drawable = this.context.attach(new Paperless.Drawables.Rectangle({
			...this._attributes.background,
			...{
				point: {
					x: this.x + (this.width / 2),
					y: window.innerHeight / 2
				},
				size: {
					width: this.width,
					height: window.innerHeight
				}
			}
		}));
		this._drawables.push(drawable.guid);
	}

	private attachBorders(): void
	{
		let drawable: Paperless.Drawable;

		drawable = this.context.attach(new Paperless.Drawables.Line({...this._attributes.borders, ...{point1: {x: this.x, y: 0}, point2: {x: this.x, y: window.innerHeight}}}));
		this._drawables.push(drawable.guid);

		drawable = this.context.attach(new Paperless.Drawables.Line({...this._attributes.borders, ...{point1: {x: this.x + this.width, y: 0}, point2: {x: this.x + this.width, y: window.innerHeight}}}));
		this._drawables.push(drawable.guid);
	}

	private attachResetter(): void
	{
		let drawable: Paperless.Drawable;

		drawable = this.context.attach(new Paperless.Drawables.Triangle({
			...this._attributes.resetter, 
			...{
				point: {
					x: this.x + (this.width / 2),
					y: window.innerHeight - 5 - this._attributes.padding.bottom
				},
				radius: 100,
				visible: false,
				angle: -90
			}
		}));
		//drawable.angle = -90;
		
		this._resetter = this.context.attach(new Resetter(this));
		this._resetter.attach(drawable);

		this._drawables.push(drawable.guid);
		this._guids.push(this._resetter.guid);
	}

	private attachShade(): void
	{
		let drawable: Paperless.Drawable;
		
		if(this._attributes.shade.top > 0)
		{
			drawable = this.context.attach(new Paperless.Drawables.Rectangle({
				...this._attributes.shade,
				...{
					point: {
						x: this.x + (this.width / 2),
						y: this._attributes.shade.top / 2
					},
					size: {
						width: this._puzzled.width + (this._attributes.shade.overflow * 2) - this._puzzled.spacing - this._attributes.borders.linewidth,
						height: this._attributes.shade.top
					}
				}
			}));

			this._topshade = this.context.attach(new Paperless.Controls.Blank({enabled: false}));
			this._topshade.attach(drawable);

			this._drawables.push(drawable.guid);
			this._guids.push(this._topshade.guid);
		}
		
		if(this._attributes.shade.bottom > 0)
		{
			drawable = this.context.attach(new Paperless.Drawables.Rectangle({
				...this._attributes.shade,
				...{
					point: {
						x: this.x + (this.width / 2),
						y: window.innerHeight - (this._attributes.shade.bottom / 2)
					},
					size: {
						width: this._puzzled.width + (this._attributes.shade.overflow * 2) - this._puzzled.spacing - this._attributes.borders.linewidth,
						height: this._attributes.shade.bottom
					}
				}
			}));

			this._bottomshade = this.context.attach(new Paperless.Controls.Blank({enabled: false}));
			this._bottomshade.attach(drawable);

			this._drawables.push(drawable.guid);
			this._guids.push(this._bottomshade.guid);
		}
	}
	
	public top(): void
	{
		this._resetter.onLeftClick();
	}

	public new(entities: Array<{point?: Paperless.Point, size?: Paperless.Size, minimum?: {width?: number, height?: number}, control: typeof EntityCoreControl, drawable: typeof EntityCoreDrawable, header?: boolean, attributes?: any, backdoor?: any, transpose?: boolean}>): EntityCoreControl
	{
		let control: EntityCoreControl;

		for(let entity of entities)
		{
			const {
				attributes = {},
			} = entity;
			entity.attributes = attributes;

			if(entity.header === true)
			{
				control = this._header.new([{
					point: entity.point,
					size: entity.size,
					minimum: entity.minimum,
					control: entity.control,
					drawable: entity.drawable,
					attributes: { ...attributes, ...{sticky: true} },
					backdoor: entity.backdoor
				}]);
			}
			else
			{
				control = this._puzzled.new([{
					point: entity.point,
					size: entity.size,
					minimum: entity.minimum,
					control: entity.control,
					drawable: entity.drawable,
					attributes: { ...attributes, ...{sticky: this.sticky} },
					backdoor: entity.backdoor
				}]);
			}
		}

		return control;
	}

	public onAttach(): void
	{
		this.initialize();
	}

	public onDetach(): void
	{
		this.context.canvas.removeEventListener("wheel", this._eventWheel, {});
		this.context.detach(this._drawables);
		this.context.detach(this._guids);
		this.context.detach(this._formMain.guid);
		this.context.detach(this._formHeader.guid)
		this._guids = [];
		this._drawables = [];
	}

	public getDrawables(): Array<Paperless.Drawable>
	{
		let drawables: Array<Paperless.Drawable> = [...[], ...this._puzzled.getDrawables()];

		for(let guid of this._drawables)
			drawables.push(this.context.get(guid))
		
		return drawables;
	}


	/*
	onResize()
	{
		let x: number = this._childs.controls.puzzled.x;

		this.point = new Paperless.Point((window.innerWidth - 800) / 2, 16);
		this.size = new Paperless.Size(800, window.innerHeight);

		this._childs.drawables.leftline1.point1 = new Paperless.Point(this.x, 0);
		this._childs.drawables.leftline1.point2 = new Paperless.Point(this.x, window.outerHeight);
		this._childs.drawables.leftline1.point = Paperless.middle(this._childs.drawables.leftline1.point1, this._childs.drawables.leftline1.point2)
		this._childs.drawables.leftline1.generate();

		this._childs.drawables.leftline2.point1 = new Paperless.Point(this.x + 2, 0);
		this._childs.drawables.leftline2.point2 = new Paperless.Point(this.x + 2, window.outerHeight)
		this._childs.drawables.leftline2.point = Paperless.Point.middle(this._childs.drawables.leftline2.point1, this._childs.drawables.leftline2.point2)
		this._childs.drawables.leftline2.generate();

		this._childs.drawables.rightline1.point1 = new Paperless.Point(this.x + this.width, 0);
		this._childs.drawables.rightline1.point2 = new Paperless.Point(this.x + this.width, window.outerHeight);
		this._childs.drawables.rightline1.point = Paperless.Point.middle(this._childs.drawables.rightline1.point1, this._childs.drawables.rightline1.point2)
		this._childs.drawables.rightline1.generate();

		this._childs.drawables.rightline2.point1 = new Paperless.Point(this.x + this.width - 2, 0);
		this._childs.drawables.rightline2.point2 = new Paperless.Point(this.x + this.width - 2, window.outerHeight);
		this._childs.drawables.rightline2.point = Paperless.Point.middle(this._childs.drawables.rightline2.point1, this._childs.drawables.rightline2.point2)
		this._childs.drawables.rightline2.generate();

		this._childs.controls.puzzled.x = this.x + 16;
		this._childs.controls.puzzled.removeMarker();
		this._childs.controls.puzzled.detach(this._childs.controls.puzzled.getIcons());

		for(let guid in this._childs.controls.puzzled.getEntities())
			this._childs.controls.puzzled.extractGuid(guid).drawable.x -= x - this._childs.controls.puzzled.x;

		this._childs.controls.lock.drawable.x -= x - this._childs.controls.puzzled.x;
		this._childs.controls.cross.drawable.x -= x - this._childs.controls.puzzled.x;
		this._childs.controls.arrow.drawable.x -= x - this._childs.controls.puzzled.x;
		this._childs.controls.arrow.drawable.y = window.innerHeight - 26;

		this.context.refresh();
	}
	*/

	handleWheel(puzzled: Puzzled, fuzzynotes: Fuzzynotes, event: HTMLElementEventMap['wheel']): void
	{
		if(puzzled.context.states.pointer.current.x >= puzzled.x * (window.devicePixelRatio * puzzled.context.scale) &&
			puzzled.context.states.pointer.current.x <= (puzzled.x + puzzled.width) * (window.devicePixelRatio * puzzled.context.scale) &&
			puzzled.context.states.pointer.current.y >= puzzled.y * (window.devicePixelRatio * puzzled.context.scale)
			/*puzzled.context.getStates().pointCurrent.y <= puzzled.y + puzzled.height*/)
		{
			let delta: number = 0;

			if(event.deltaY > 0)
			{
				puzzled.y -= (puzzled.hop * 2);
				delta = (-puzzled.hop * 2);

				if(fuzzynotes._resetter)
					fuzzynotes._resetter.drawable.visible = true;
			}
			else
			{
				puzzled.y += (puzzled.hop * 2);
				
				if(puzzled.y > fuzzynotes.attributes.padding.top)
					puzzled.y = fuzzynotes.attributes.padding.top;
				else
					delta = (puzzled.hop * 2);
			}

			if(puzzled.y == fuzzynotes.attributes.padding.top && fuzzynotes._resetter)
				fuzzynotes._resetter.drawable.visible = false;

			for(let control of puzzled.getControls(Restrict.ignoregroup))
			{
				let source: Paperless.Point = new Paperless.Point(control.drawable.matrix.e, control.drawable.matrix.f);

				control.drawable.matrix.f += delta;
				(<EntityCoreControl>control).onMoved(source);
			}

			if(puzzled.getMarker())
				puzzled.removeMarker();

			puzzled.context.refresh();
		}
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}

	public get header(): Puzzled
	{
		return this._header;
	}

	public get resetter(): Resetter
	{
		return this._resetter;
	}

	public get bottomshade(): Paperless.Control
	{
		return this._bottomshade;
	}

	public get topshade(): Paperless.Control
	{
		return this._topshade;
	}

	public get attributes(): IComponentFuzzynotesAttributes
	{
		return this._attributes;
	}

	public get form(): {main: Form, header: Form}
	{
		return {main: this._formMain, header: this._formHeader};
	}
}

