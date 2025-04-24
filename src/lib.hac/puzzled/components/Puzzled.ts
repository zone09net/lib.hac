import * as Paperless from '@zone09.net/paperless';
import * as Foundation from '@zone09.net/foundation';
import {IComponentPuzzledAttributes} from '../interfaces/IPuzzled.js';
import {IComponentPuzzledEntity} from '../interfaces/IPuzzled.js';
import {Icon} from '../controls/Icon.js';
import {Sizer} from '../controls/Sizer.js';
import {Splitter} from '../controls/Splitter.js';
import {EntityCoreControl} from '../controls/EntityCoreControl.js';
import {EntityCoreDrawable} from '../drawables/EntityCoreDrawable.js';
import {Restrict} from '../enums/Restrict.js';



export class Puzzled extends Paperless.Component
{
	[key: string]: any;
	
	private _entities: {[index: string] : EntityCoreControl} = {};
	private _attributes: IComponentPuzzledAttributes;
	private _marker: string = null;
	private _icons: Array<Icon | Sizer | Splitter> = [];
	//---

	constructor(attributes: IComponentPuzzledAttributes = {})
	{
		super({
			...{
				size: {width: 512, height: 512},
				point: {x: 0, y: 0}
			},
			...attributes, 
			...{
				context: null,
				layer: null
			}
		});

		const {
			hop = 64,
			expandable = false,
			nofill = false,
			nostroke = false,
			linewidth = 2,
			spacing = 5,
			shadow = 2,
			alpha = 0.5,
			control = EntityCoreControl,
			drawable = EntityCoreDrawable,
			color = {},
			sticky = false,

			onEntityLoading = null,
			onEntityLoaded = null
		} = attributes;

		this.width = Math.floor((this.size.width) / hop) * hop;
		this.height = Math.floor((this.size.height) / hop) * hop;
		this.x = Math.floor(this.point.x);
		this.y = Math.floor(this.point.y);
		this.sticky = sticky;

		this._attributes = {
			hop: hop,
			expandable: expandable,
			nofill: nofill,
			nostroke: nostroke,
			linewidth: linewidth,
			spacing: spacing,
			shadow: shadow,
			alpha: alpha,
			control: control,
			drawable: drawable,
			color: {
				...{
					fill: '#000000', 
					stroke: '#815556', 
					marked: '#815556', 
					iconshadow: '#815556',
					move: '#476e20',
					nomove: '#6e2020', 
					sizer: '#436665', 
					splitter: '#436665', 
					highlight: '#ffffff', 
					faked: '#151515'
				},
				...color
			}
		};

		attributes.context ? attributes.context.attach(this, attributes.layer) : null;

		onEntityLoading ? this.onEntityLoading = onEntityLoading : null;
		onEntityLoaded ? this.onEntityLoaded = onEntityLoaded : null;
	}

	public onAttach(): void
	{
		if(this._attributes.expandable)
			this.resize();
	}

	public onDetach(): void
	{
		this.removeMarker();

		for(let control of this.getControls())
		{
			delete this._entities[control.guid];
			this.context.detach(control.drawable.guid);
			this.context.detach(control.guid);
		}
	}

	public attach(object: Icon | Sizer | Splitter): void
	{
		if(object instanceof Icon || object instanceof Sizer /*|| object instanceof Splitter*/)
			this._icons.push(object);
	}

	public detach(object: Icon | Sizer | Splitter | EntityCoreControl | Array<Icon | Sizer | Splitter | EntityCoreControl>)
	{
		let controls: Paperless.Control[];

		if(object instanceof Array)
			controls = object;
		else
			controls = new Array(object);

		for(let control of controls)
		{
			if(control instanceof Icon || control instanceof Sizer || control instanceof Splitter)
			{
				this._icons = this._icons.filter(icon => icon.guid != control.guid);

				this.context.detach([
					control.drawable.guid,
					control.guid
				]);
			}

			else if(control instanceof EntityCoreControl)
			{
				delete this._entities[control.guid];

				this.context.detach([
					control.drawable.guid,
					control.guid
				]);
			}
		}
	}

	public getIcons(restrict: Restrict = Restrict.none): Array<Icon | Sizer | Splitter>
	{
		let icons: (Icon | Sizer | Splitter)[] = [];

		if(this.group != undefined && restrict == Restrict.none)
		{
			const group: Paperless.Group = this.context.get(this.group);

			group.grouped.forEach((entry: Puzzled) => {
				if(entry.constructor.name == 'Puzzled')
					icons = [...icons, ...entry._icons];
			});
		}
		else
			icons = this._icons;

		return icons;
	}

	public getEntities(restrict: Restrict = Restrict.none): {[index: string] : EntityCoreControl}
	{
		let entities: {[index:string] : EntityCoreControl} = {};

		if(this.group != undefined && restrict == Restrict.none)
		{
			const group: Paperless.Group = this.context.get(this.group);

			group.grouped.forEach((entry: Puzzled) => {
				if(entry.constructor.name == 'Puzzled')
					entities = {...entities, ...entry._entities};
			});
		}
		else
			entities = this._entities;

		return entities;
	}

	public getControls(restrict: Restrict = Restrict.none): Array<EntityCoreControl>
	{
		const controls: EntityCoreControl[] = [];

		if(this.group != undefined && restrict == Restrict.none)
		{
			const group: Paperless.Group = this.context.get(this.group);

			group.grouped.forEach((entry: Puzzled) => {
				if(entry.constructor.name == 'Puzzled')
				{
					for(let guid in entry._entities)
						controls.push(entry._entities[guid]);
				}
			});
		}
		else
		{
			for(let guid in this._entities)
				controls.push(this._entities[guid]);
		}

		return controls;
	}

	public getDrawables(restrict: Restrict = Restrict.none): Array<EntityCoreDrawable>
	{
		const drawables: EntityCoreDrawable[] = [];

		if(this.group != undefined && restrict == Restrict.none)
		{
			const group: Paperless.Group = this.context.get(this.group);

			group.grouped.forEach((entry: Puzzled) => {
				if(entry.constructor.name == 'Puzzled')
				{
					for(let guid in entry._entities)
						drawables.push(<EntityCoreDrawable>entry._entities[guid].drawable);
				}
			});
		}
		else
		{
			for(let guid in this._entities)
				drawables.push(<EntityCoreDrawable>this._entities[guid].drawable);
		}

		return drawables;
	}

	public getGuid(point: Paperless.Point, excluded: string[] = []): string
	{
		for(let guid in this._entities)
		{
			if(point.x >= this._entities[guid].drawable.x &&
				point.x < this._entities[guid].drawable.x + this._entities[guid].drawable.width &&
				point.y >= this._entities[guid].drawable.y &&
				point.y < this._entities[guid].drawable.y + this._entities[guid].drawable.height &&
				!excluded.includes(guid))
				return guid;
		}
	}

	public removeGuid(guid: string): void
	{
		if(this._entities[guid])
		{
			if(this._entities[guid].removable)
			{
				const promise = this._entities[guid].onRemoving(this._entities[guid]);

				promise.then(
					success => {
						if(this._marker == guid)
							this._marker = null;
			
						this.context.detach(this._entities[guid].drawable.guid);
						this._entities[guid].onRemoved(this._entities[guid]);
						this.context.detach(this._entities[guid].guid);
						delete this._entities[guid];

						if(this._attributes.expandable)
							this.resize();
						else
							this.context.refresh();
					},
					error => {}
				);
			}
		}
	}

	public extractGuid(guid: string): EntityCoreControl
	{
		if(this._entities[guid])
			return this._entities[guid];
		else
			return null;
	}

	public setMarker(point: Paperless.Point): void
	{
		const guid: string = this.getGuid(point);
		const control: EntityCoreControl = this.extractGuid(guid);

		this._marker = guid;
		(<EntityCoreDrawable>control.drawable).generate(control.expandable);
		control.onMarked(control);
	}

	public getMarker(): string
	{
		return this._marker;
	}

	public removeMarker(restrict: Restrict = Restrict.none): void
	{
		if(this.group != undefined && restrict == Restrict.none)
		{
			const group: Paperless.Group = this.context.get(this.group);

			group.grouped.forEach((entry: Puzzled) => {
				if(entry.constructor.name == 'Puzzled')
				{
					const control: EntityCoreControl = entry.extractGuid(entry._marker);

					entry._marker = null;

					if(control)
					{
						this.detach(this.getIcons());
						control.drawable.generate();
						control.onUnmarked(control);
					}
				}
			});
		}
		else
		{
			const control: EntityCoreControl = this.extractGuid(this._marker);

			this._marker = null;

			if(control)
			{
				this.detach(this.getIcons());
				control.drawable.generate();
				control.onUnmarked(control);
			}
		}
	}

	public removeMarkerAll(): void
	{
		const components: Foundation.ExtendedMap = this.context.getAllComponents();
		const filter: Paperless.Component[] = components.filter((component: Paperless.Component) => component instanceof Puzzled)

		filter.forEach((puzzled: Puzzled) => {
			puzzled.removeMarker();
		});

		this.context.refresh();
	}

	public nextFreePosition(size: Paperless.Size): {point: Paperless.Point, size: Paperless.Size}
	{
		let x: number;
		let y: number;

		for(y = 0; y < this.height - 1; y += this._attributes.hop)
		{
			for(x = 0; x < this.width - 1; x += this._attributes.hop)
			{
				if(!this.getGuid(new Paperless.Point(x, y)))
				{
					let bBreak: boolean = false;
					const destination: {point: Paperless.Point, size: Paperless.Size} = {
						point: new Paperless.Point(x, y),
						size: new Paperless.Size(size.width, size.height)
					};

					if(destination.point.x + destination.size.width -1 >= this.width || destination.point.x < 0)
					{
						bBreak = true;
						break;
					}

					for(let y0: number = destination.point.y; y0 < destination.point.y + destination.size.height - 1; y0 += this._attributes.hop)
					{
						for(let x0: number = destination.point.x; x0 < destination.point.x + destination.size.width - 1; x0 += this._attributes.hop)
						{
							if(this.getGuid(new Paperless.Point(x0, y0)))
							{
								bBreak = true;
								break;
							}
						}

						if(bBreak)
							break;
					}

					if(!bBreak)
						return destination;
					else
						continue;
				}
			}
		}

		if(this._attributes.expandable && size.width <= this.width)
		{
			return {
				point: new Paperless.Point(0, y),
				size: new Paperless.Size(size.width, size.height)
			};
		}

		return null;
	}

	public resize(): void
	{
		let height: number = 0;

		for(let guid in this._entities)
		{
			const current: number = this._entities[guid].drawable.y + this._entities[guid].drawable.height;

			if(current > height)
				height = current;
		}

		//let stageHeight = Math.floor((this.height - offset) / this._attributes.hop) * this._attributes.hop;

		//this.size = new Paperless.Size(this.width, height + this._attributes.hop > stageHeight - offset ? height + this._attributes.hop : stageHeight + this._attributes.hop - offset);
		if(this._attributes.expandable)
			this.height = height + this._attributes.hop + (this.y < 0 ? -this.y : this.y)
		else
			this.height = height + this._attributes.hop;

		this.context.refresh();
	}

	public new(entities: IComponentPuzzledEntity[]): EntityCoreControl
	{
		const layer: number = Paperless.Layer.decode(this.guid);
		const norefresh: boolean = this.context.states.norefresh;
		let returned: EntityCoreControl = undefined;

		this.context.states.norefresh = true;

		for(let entity of entities)
		{
			if(!entity.point || !entity.size)
			{
				let free: {point: Paperless.Point, size: Paperless.Size}

				if(entity.size)
					free = this.nextFreePosition(new Paperless.Size(entity.size.width, entity.size.height));
				else
					free = this.nextFreePosition(new Paperless.Size(this._attributes.hop, this._attributes.hop));

				if(!free)
				{
					console.log('Puzzled entity out of boundaries')
					this.context.states.norefresh = false;
					return null;
				}

				entity.point = free.point;
				entity.size = free.size;
			}

			if(!entity.attributes)
				entity.attributes = {};

			if(!entity.drawable)
				entity.drawable = this._attributes.drawable

			const control: EntityCoreControl = new entity.control({
				puzzled: this,
				layer: layer,
				context: this.context,
				minimum: entity.minimum ? entity.minimum : undefined,
				drawable: new entity.drawable({
					...entity.attributes, 
					...{
						context: this.context,
						puzzled: this,
						layer: layer,
						point: { x: entity.point.x, y: entity.point.y }, 
						size: { width: entity.size.width, height: entity.size.height },
						offset1: this.point,
						sticky: this.sticky,
					}
				}),

			});

			if(entity.backdoor)
			{
				Object.keys(entity.backdoor).forEach((key, index) => {
					const properties = key.split('.');
					let target: any = control;

					try
					{
						while(properties.length > 1)
							target = target[properties.shift()];

							target[properties[0]] = entity.backdoor[key];
					}
					catch(error)
					{
						console.log(error);
					}
				});
			}

			control.onLoading(control).then(
				success => {
					control.onLoaded(control);
				},
				error => {}
			);

			this.onEntityLoading(control).then(
				success => {
					this.onEntityLoaded(control);
				},
				error => {}
			);

			this._entities[control.guid] = control;
			returned = control;

			/*
			if(this._attributes.expandable)
				this.resize();
			else
				this.context.refresh();
			*/
		}

		if(!norefresh)
			this.context.states.norefresh = false;

		return returned;
	}

	public isMovable(source: string, point: Paperless.Point): boolean
	{
		const control: Paperless.Control = this.extractGuid(source);

		const destination: {point: Paperless.Point, size: Paperless.Size} = {
			point: point,
			size: new Paperless.Size(this._attributes.hop, this._attributes.hop)
		};

		if(destination.point.x + control.drawable.width - 1 >= this.width || destination.point.x < 0)
			return false;

		if(!this._attributes.expandable && (destination.point.y + control.drawable.height > this.height))
			return false;

		if(destination.point.y < 0 || destination.point.x < 0)
			return false;

		for(let y: number = destination.point.y; y < destination.point.y + control.drawable.height - 1; y += this._attributes.hop)
		{

			for(let x: number = destination.point.x; x < destination.point.x + control.drawable.width - 1; x += this._attributes.hop)
			{
				const guid: string = this.getGuid(new Paperless.Point(x, y), new Array(control.guid));

				if(guid == source)
					continue;
				else if(guid)
					return false;
			}
		}
		return true;
	}

	public isSwappable(source: string, destination: string): boolean
	{
		if(source == destination || !source || !destination)
			return false;

		const sourceControl: EntityCoreControl = this.extractGuid(source);
		const destinationControl: EntityCoreControl = this.extractGuid(destination);

		if(sourceControl.drawable.width == destinationControl.drawable.width && 
			sourceControl.drawable.height == destinationControl.drawable.height &&
			sourceControl.swappable && destinationControl.swappable)
			return true;
		else
			return false;
	}

	public onEntityLoading(entity: EntityCoreControl): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(entity);
		})
	}

	public onEntityLoaded(entity: EntityCoreControl): void {}

	// split
	// ------------------------------

	public splitFromLeft(guid: string): void
	{
		if(!this._entities[guid])
			return null;

		const data = {
			point: new Paperless.Point(this._entities[guid].drawable.x, this._entities[guid].drawable.y),
			size: new Paperless.Size(this._attributes.hop, this._entities[guid].drawable.height),
			control: this._attributes.control,
		};

		this._entities[guid].drawable.x += this._attributes.hop;
		this._entities[guid].drawable.width -= this._attributes.hop;
		this._entities[guid].drawable.generate();
		this._entities[guid].onSplitted(this._entities[guid]);

		this.new([data]);
	}

	public splitFromRight(guid: string): void
	{
		if(!this._entities[guid])
			return null;

		const data = {
			point: new Paperless.Point(this._entities[guid].drawable.x + this._entities[guid].drawable.width - this._attributes.hop, this._entities[guid].drawable.y),
			size: new Paperless.Size(this._attributes.hop, this._entities[guid].drawable.height),
			control: this._attributes.control,
		};

		this._entities[guid].drawable.width -= this._attributes.hop;
		this._entities[guid].drawable.generate();
		this._entities[guid].onSplitted(this._entities[guid]);

		this.new([data]);
	}

	public splitFromTop(guid: string): void
	{
		if(!this._entities[guid])
			return null;

		const data = {
			point: new Paperless.Point(this._entities[guid].drawable.x, this._entities[guid].drawable.y),
			size: new Paperless.Size(this._entities[guid].drawable.width, this._attributes.hop),
			control: this._attributes.control,
		};

		this._entities[guid].drawable.y += this._attributes.hop;
		this._entities[guid].drawable.height -= this._attributes.hop;
		this._entities[guid].drawable.generate();
		this._entities[guid].onSplitted(this._entities[guid]);

		this.new([data]);
	}

	public splitFromBottom(guid: string): void
	{
		if(!this._entities[guid])
			return null;

		const data = {
			point: new Paperless.Point(this._entities[guid].drawable.x, this._entities[guid].drawable.y + this._entities[guid].drawable.height - this._attributes.hop),
			size: new Paperless.Size(this._entities[guid].drawable.width, this._attributes.hop),
			control: this._attributes.control,
		};

		this._entities[guid].drawable.height -= this._attributes.hop;
		this._entities[guid].drawable.generate();
		this._entities[guid].onSplitted(this._entities[guid]);

		this.new([data]);
	}

	// expand
	// ------------------------------

	public isExpandableToLeft(guid: string): boolean
	{
		if(!this._entities[guid] || !this._entities[guid].expandable || 
			this._entities[guid].drawable.x - this._attributes.hop + this.x < this.x)
			return false;

		for(let y: number = this._entities[guid].drawable.y; y < this._entities[guid].drawable.y + this._entities[guid].drawable.height - 1; y += this._attributes.hop)
		{
			if(this.getGuid(new Paperless.Point(this._entities[guid].drawable.x - this._attributes.hop, y)))
				return false;
		}

		return true;
	}

	public isExpandableToRight(guid: string): boolean
	{
		if(!this._entities[guid] || !this._entities[guid].expandable || 
			this._entities[guid].drawable.x + this._entities[guid].drawable.width + this._attributes.hop + this.x > this.x + this.width)
			return false;

		for(let y: number = this._entities[guid].drawable.y; y < this._entities[guid].drawable.y + this._entities[guid].drawable.height - 1; y += this._attributes.hop)
		{
			if(this.getGuid(new Paperless.Point(this._entities[guid].drawable.x + this._entities[guid].drawable.width, y)))
				return false;
		}

		return true;
	}

	public isExpandableToTop(guid: string): boolean
	{
		if(!this._entities[guid] || !this._entities[guid].expandable || 
			this._entities[guid].drawable.y - this._attributes.hop + this.y < this.y)
			return false;

		for(let x: number = this._entities[guid].drawable.x; x < this._entities[guid].drawable.x + this._entities[guid].drawable.width - 1; x += this._attributes.hop)
		{
			if(this.getGuid(new Paperless.Point(x, this._entities[guid].drawable.y - this._attributes.hop)))
				return false;
		}

		return true;
	}

	public isExpandableToBottom(guid: string): boolean
	{
		if(!this._entities[guid] || !this._entities[guid].expandable || 
			(this._entities[guid].drawable.y + this._entities[guid].drawable.height + this._attributes.hop + this.y > this.y + this.height && !this._attributes.expandable))
			return false;

		for(let x: number = this._entities[guid].drawable.x; x < this._entities[guid].drawable.x + this._entities[guid].drawable.width - 1; x += this._attributes.hop)
		{
			if(this.getGuid(new Paperless.Point(x, this._entities[guid].drawable.y + this._entities[guid].drawable.height)))
				return false;
		}

		return true;
	}

	public isExpandable(guid: string): {left: boolean, right: boolean, top: boolean, bottom: boolean}
	{
		return {left: this.isExpandableToLeft(guid), right: this.isExpandableToRight(guid), top: this.isExpandableToTop(guid), bottom: this.isExpandableToBottom(guid)};
	}

	public expandFromLeft(guid: string): void
	{
		if(this.isExpandableToLeft(guid))
		{
			this._entities[guid].drawable.x -= this._attributes.hop;
			this._entities[guid].drawable.width += this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded(this._entities[guid]);
		}
	}

	public expandFromLeftMax(guid: string): void
	{
		const expanded: boolean = this.isExpandableToLeft(guid);

		while(this.isExpandableToLeft(guid))
		{
			this._entities[guid].drawable.x -= this._attributes.hop;
			this._entities[guid].drawable.width += this._attributes.hop;
		}

		if(expanded)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded(this._entities[guid]);
		}
	}

	public expandFromRight(guid: string): void
	{
		if(this.isExpandableToRight(guid))
		{
			this._entities[guid].drawable.width += this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded(this._entities[guid]);
		}
	}

	public expandFromRightMax(guid: string): void
	{
		const expanded: boolean = this.isExpandableToRight(guid);

		while(this.isExpandableToRight(guid))
			this._entities[guid].drawable.width += this._attributes.hop;

		if(expanded)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded(this._entities[guid]);
		}
	}

	public expandFromTop(guid: string): void
	{
		if(this.isExpandableToTop(guid))
		{
			this._entities[guid].drawable.y -= this._attributes.hop;
			this._entities[guid].drawable.height += this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded(this._entities[guid]);
		}
	}

	public expandFromTopMax(guid: string): void
	{
		const expanded: boolean = this.isExpandableToTop(guid);

		while(this.isExpandableToTop(guid))
		{
			this._entities[guid].drawable.y -= this._attributes.hop;
			this._entities[guid].drawable.height += this._attributes.hop;
		}

		if(expanded)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded(this._entities[guid]);
		}
	}

	public expandFromBottom(guid: string): void
	{
		if(this.isExpandableToBottom(guid))
		{
			this._entities[guid].drawable.height += this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded(this._entities[guid]);

			if(this._attributes.expandable)
				this.resize();
			else
				this.context.refresh();
		}
	}

	public expandFromBottomMax(guid: string): void
	{
		if(!this._attributes.expandable)
		{
			const expanded: boolean = this.isExpandableToBottom(guid);

			while(this.isExpandableToBottom(guid))
				this._entities[guid].drawable.height += this._attributes.hop;

			if(expanded)
			{
				this._entities[guid].drawable.generate();
				this._entities[guid].onExpanded(this._entities[guid]);
			}
		}
		else
		{
			const stage: Paperless.Size = new Paperless.Size(this.context.canvas.width, this.context.canvas.height);

			while(this.isExpandableToBottom(guid) && (this._entities[guid].drawable.y + this._entities[guid].drawable.height < stage.height - this._attributes.hop))
				this._entities[guid].drawable.height += this._attributes.hop;

			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded(this._entities[guid]);

			this.resize();
		}
	}

	// shrink
	// ------------------------------

	public isShrinkableWidth(guid: string): boolean
	{
		if(!this._entities[guid] || 
			this._entities[guid].drawable.width < this._attributes.hop * 2 || 
			this._entities[guid].drawable.width - this._attributes.hop <  this._entities[guid].minimum.width)
			return false;

		return true;
	}

	public isShrinkableHeight(guid: string): boolean
	{
		if(!this._entities[guid] || 
			this._entities[guid].drawable.height < this._attributes.hop * 2 ||
			this._entities[guid].drawable.height - this._attributes.hop <  this._entities[guid].minimum.height)
			return false;

		return true;
	}

	public isShrinkable(guid: string): {width: boolean, height: boolean}
	{
		return {width: this.isShrinkableWidth(guid), height: this.isShrinkableHeight(guid)};
	}

	public shrinkFromLeft(guid: string): void
	{
		if(this.isShrinkableWidth(guid))
		{
			this._entities[guid].drawable.x += this._attributes.hop;
			this._entities[guid].drawable.width -= this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked(this._entities[guid]);
		}
	}

	public shrinkFromLeftMin(guid: string): void
	{
		const shrinked: boolean = this.isShrinkableWidth(guid);

		while(this.isShrinkableWidth(guid))
		{
			this._entities[guid].drawable.x += this._attributes.hop;
			this._entities[guid].drawable.width -= this._attributes.hop;
		}

		if(shrinked)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked(this._entities[guid]);
		}
	}

	public shrinkFromRight(guid: string): void
	{
		if(this.isShrinkableWidth(guid))
		{
			this._entities[guid].drawable.width -= this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked(this._entities[guid]);
		}
	}

	public shrinkFromRightMin(guid: string): void
	{
		const shrinked: boolean = this.isShrinkableWidth(guid);

		while(this.isShrinkableWidth(guid))
			this._entities[guid].drawable.width -= this._attributes.hop;

		if(shrinked)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked(this._entities[guid]);
		}
	}

	public shrinkFromTop(guid: string): void
	{
		if(this.isShrinkableHeight(guid))
		{
			this._entities[guid].drawable.y += this._attributes.hop;
			this._entities[guid].drawable.height -= this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked(this._entities[guid]);
		}
	}

	public shrinkFromTopMin(guid: string): void
	{
		const shrinked: boolean = this.isShrinkableHeight(guid);

		while(this.isShrinkableHeight(guid))
		{
			this._entities[guid].drawable.y += this._attributes.hop;
			this._entities[guid].drawable.height -= this._attributes.hop;
		}

		if(shrinked)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked(this._entities[guid]);
		}
	}

	public shrinkFromBottom(guid: string): void
	{
		if(this.isShrinkableHeight(guid))
		{
			this._entities[guid].drawable.height -= this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked(this._entities[guid]);

			if(this._attributes.expandable)
				this.resize();
			else
				this.context.refresh();
		}
	}

	public shrinkFromBottomMin(guid: string): void
	{
		const shrinked: boolean = this.isShrinkableHeight(guid);

		while(this.isShrinkableHeight(guid))
			this._entities[guid].drawable.height -= this._attributes.hop;

		if(shrinked)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked(this._entities[guid]);

			if(this._attributes.expandable)
				this.resize();
			else
				this.context.refresh();
		}
	}
		
	// move
	// ------------------------------

	public quickMoveFromLeft(guid: string): void
	{
		if(this.isExpandableToLeft(guid))
		{
			this._entities[guid].drawable.x -= this._attributes.hop;
			this._entities[guid].drawable.generate();
		}

	}

	public quickMoveFromRight(guid: string)
	{
		if(this.isExpandableToRight(guid))
		{
			this._entities[guid].drawable.x += this._attributes.hop;
			this._entities[guid].drawable.generate();
		}
	}

	public quickMoveFromTop(guid: string): void
	{
		if(this.isExpandableToTop(guid))
		{
			this._entities[guid].drawable.y -= this._attributes.hop;
			this._entities[guid].drawable.generate();

			if(this._attributes.expandable)
				this.resize();
		}
	}

	public quickMoveFromBottom(guid: string): void
	{
		if(this.isExpandableToBottom(guid))
		{
			this._entities[guid].drawable.y += this._attributes.hop;
			this._entities[guid].drawable.generate();

			if(this._attributes.expandable)
				this.resize();
			else
				this.context.refresh();
		}
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get hop(): number
	{
		return this._attributes.hop;
	}
	public set hop(hop: number)
	{
		this._attributes.hop = hop;
	}

	public get expandable(): boolean
	{
		return this._attributes.expandable;
	}
	public set expandable(expandable: boolean)
	{
		this._attributes.expandable = expandable;
	}

	public get nofill(): boolean
	{
		return this._attributes.nofill;
	}
	public set nofill(nofill: boolean)
	{
		this._attributes.nofill = nofill;
	}

	public get nostroke(): boolean
	{
		return this._attributes.nostroke;
	}
	public set nostroke(nostroke: boolean)
	{
		this._attributes.nostroke = nostroke;
	}

	public get linewidth(): number
	{
		return this._attributes.linewidth;
	}
	public set linewidth(linewidth: number)
	{
		this._attributes.linewidth = linewidth;
	}

	public get spacing(): number
	{
		return this._attributes.spacing;
	}
	public set spacing(spacing: number)
	{
		this._attributes.spacing = spacing;
	}

	public get shadow(): number
	{
		return this._attributes.shadow;
	}
	public set shadow(shadow: number)
	{
		this._attributes.shadow = shadow;
	}

	public get alpha(): number
	{
		return this._attributes.alpha;
	}
	public set alpha(alpha: number)
	{
		this._attributes.alpha = alpha;
	}

	public get color(): { fill?: string, stroke?: string, marked?: string, iconshadow?: string, move?: string, nomove?: string, sizer?: string, splitter?: string, highlight?: string, faked?: string }
	{
		return this._attributes.color;
	}
	public set color(color: { fill?: string, stroke?: string, marked?: string, iconshadow?: string, move?: string, nomove?: string, sizer?: string, splitter?: string, highlight?: string, faked?: string })
	{
		this._attributes.color = color;
	}

	public get control(): typeof EntityCoreControl
	{
		return this._attributes.control;
	}
	public set control(control: typeof EntityCoreControl)
	{
		this._attributes.control = control;
	}

	public get drawable(): typeof EntityCoreDrawable
	{
		return this._attributes.drawable;
	}
	public set drawable(drawable: typeof EntityCoreDrawable)
	{
		this._attributes.drawable = drawable;
	}
}

