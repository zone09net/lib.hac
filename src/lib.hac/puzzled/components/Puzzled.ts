import * as Paperless from '@zone09.net/paperless';
import {IComponentPuzzledAttributes, IComponentPuzzledEntity} from '../interfaces/IPuzzled.js';
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
				context: null
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
					stroke: '#666666',
					marked: '#c8af55',
					iconshadow: '#ffffff',
					move: '#ffffff',
					nomove: '#c22a1f',
					sizer: '#666666',
					splitter: '#666666',
					highlight: '#ffffff',
					faked: '#000000',
				},
				...color
			}
		};

		attributes.context ? attributes.context.attach(this) : null;

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
		this.detach(this.getIcons());
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
		if(object instanceof Icon || object instanceof Sizer || object instanceof Splitter)
			this._icons.push(object);
	}

	public detach(object: Icon | Sizer | Splitter | EntityCoreControl | Array<Icon | Sizer | Splitter | EntityCoreControl>)
	{
		if(object instanceof Icon || object instanceof Sizer || object instanceof Splitter)
		{
			this.context.detach(object.drawable.guid);
			this.context.detach(object.guid);

			this._icons = this._icons.filter(icon => icon != object)
		}

		else if(object instanceof EntityCoreControl)
		{
			delete this._entities[object.guid];
			this.context.detach(object.drawable.guid);
			this.context.detach(object.guid);
		}

		else if(object instanceof Array)
		{
			let controls: Array<string> = [];
			let drawables: Array<string> = [];

			for(let control of object)
			{
				controls.push(control.guid);
				drawables.push(control.drawable.guid);

				if(control instanceof EntityCoreControl)
					delete this._entities[control.guid];
			}

			this._icons = this._icons.filter(icon => !object.includes(icon));
			this.context.detach([...drawables, ...controls]);
		}
	}

	public getIcons(restrict: Restrict = Restrict.none): Array<Icon | Sizer | Splitter>
	{
		let icons: (Icon | Sizer | Splitter)[] = [];

		if(this.group != undefined && restrict == Restrict.none)
		{
			let group: Paperless.Group = this.context.get(this.group);

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
			let group: Paperless.Group = this.context.get(this.group);

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
		let controls: Array<EntityCoreControl> = [];

		if(this.group != undefined && restrict == Restrict.none)
		{
			let group: Paperless.Group = this.context.get(this.group);

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
		let drawables: Array<EntityCoreDrawable> = [];

		if(this.group != undefined && restrict == Restrict.none)
		{
			let group: Paperless.Group = this.context.get(this.group);

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

	public getGuid(point: Paperless.Point, excluded: Array<string> = []): string
	{
		for(let guid in this._entities)
		{
			if(point.x >= this._entities[guid].drawable.matrix.e &&
				point.x < this._entities[guid].drawable.matrix.e + this._entities[guid].drawable.width &&
				point.y >= this._entities[guid].drawable.matrix.f &&
				point.y < this._entities[guid].drawable.matrix.f + this._entities[guid].drawable.height &&
				!excluded.includes(guid))
				return guid;
			/*
			if(point.x >= this._entities[guid].drawable.offset.x &&
				point.x < this._entities[guid].drawable.width + this._entities[guid].drawable.offset.x&&
				point.y >= this._entities[guid].drawable.offset.y &&
				point.y < this._entities[guid].drawable.height + this._entities[guid].drawable.offset.y &&
				!excluded.includes(guid))
				return guid;
			*/
		}
	}

	public removeGuid(guid: string): void
	{
		if(this._entities[guid])
		{
			if(this._entities[guid].removable)
			{
				let promise = this._entities[guid].onRemoving();

				promise.then(
					success => {
						if(this._marker == guid)
							this._marker = null;
			
						this.context.detach(this._entities[guid].drawable.guid);
						this._entities[guid].onRemoved();
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
		let guid: string = this.getGuid(point);
		let control: EntityCoreControl = this.extractGuid(guid);

		this._marker = guid;
		(<EntityCoreDrawable>control.drawable).generate(control.expandable);
		control.onMarked();
	}

	public getMarker(): string
	{
		return this._marker;
	}

	public removeMarker(restrict: Restrict = Restrict.none): void
	{
		if(this.group != undefined && restrict == Restrict.none)
		{
			let group: Paperless.Group = this.context.get(this.group);

			group.grouped.forEach((entry: Puzzled) => {
				if(entry.constructor.name == 'Puzzled')
				{
					let control: EntityCoreControl = entry.extractGuid(entry._marker);

					entry._marker = null;

					if(control)
					{
						if(this.context.states.focussed == control.guid)
							this.context.removeFocus();

						control.drawable.generate();
						control.onUnmarked();
					}
				}
			});
		}
		else
		{
			let control: EntityCoreControl = this.extractGuid(this._marker);

			this._marker = null;

			if(control)
			{
				if(this.context.states.focussed == control.guid)
					this.context.removeFocus();

				control.drawable.generate();
				control.onUnmarked();
			}
		}
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
					let destination: {point: Paperless.Point, size: Paperless.Size} = {
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
			let current: number = this._entities[guid].drawable.matrix.f + this._entities[guid].drawable.height;

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
		let returned: EntityCoreControl = undefined;

		for(let entity of entities)
		{
			/*
			const {
				transpose = true,
			} = entity;
			entity.transpose = transpose;
			*/
		  
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
					return null;
				}

				entity.point = free.point;
				entity.size = free.size;
			}
			/*
			else
			{
				if(entity.transpose)
				{
					entity.point.x += this.x;
					entity.point.y += this.y;
				}
			}
			*/
			if(!entity.attributes)
				entity.attributes = {};

			let drawable: EntityCoreDrawable;
			if(!entity.drawable)
				drawable = new this._attributes.drawable(this, {
					...entity.attributes, 
					...{
						point: { x: entity.point.x, y: entity.point.y }, 
						size: { width: entity.size.width, height: entity.size.height },
						offset1: this.point
					}
				});
			else
				drawable = new entity.drawable(this, {
					...entity.attributes, 
					...{
						point: { x: entity.point.x, y: entity.point.y }, 
						size: { width: entity.size.width, height: entity.size.height },
						offset1: this.point
					}
				});

			drawable.sticky = this.sticky;
			this.context.attach(drawable);
			
			if(entity.guid)
				this.context.getGuidGenerator().force(entity.guid);

			let control: EntityCoreControl = this.context.attach(new entity.control(this));
			control.attach(drawable);
			
			if(entity.backdoor)
			{
				Object.keys(entity.backdoor).forEach((key, index) => {
					let properties = key.split('.');
					let target: any = control;

					try
					{
						while(properties.length > 1)
							target = target[properties.shift()];

						//if(typeof target[properties[0]] === 'function')
						//	target[properties[0]](entity.backdoor[key]);
						//else
							target[properties[0]] = entity.backdoor[key];
					}
					catch(error)
					{
						console.log(error);
					}
				});
			}

			//let promise: Promise<unknown>;

			control.onLoading().then(
				success => {
					control.onLoaded();
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

		return returned;
	}

	public isMovable(source: string, point: Paperless.Point): boolean
	{
		let control: Paperless.Control = this.extractGuid(source);

		let destination: {point: Paperless.Point, size: Paperless.Size} = {
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
				let guid: string = this.getGuid(new Paperless.Point(x, y), new Array(control.guid));

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

		let sourceControl: EntityCoreControl = this.extractGuid(source);
		let destinationControl: EntityCoreControl = this.extractGuid(destination);

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

		let data = {
			point: new Paperless.Point(this._entities[guid].drawable.matrix.e, this._entities[guid].drawable.matrix.f),
			size: new Paperless.Size(this._attributes.hop, this._entities[guid].drawable.height),
			control: this._attributes.control,
			transpose: false
		};

		this._entities[guid].drawable.matrix.e += this._attributes.hop;
		this._entities[guid].drawable.width -= this._attributes.hop;
		this._entities[guid].drawable.generate();
		this._entities[guid].onSplitted();

		this.new([data]);
	}

	public splitFromRight(guid: string): void
	{
		if(!this._entities[guid])
			return null;

		let data = {
			point: new Paperless.Point(this._entities[guid].drawable.matrix.e + this._entities[guid].drawable.width - this._attributes.hop, this._entities[guid].drawable.matrix.f),
			size: new Paperless.Size(this._attributes.hop, this._entities[guid].drawable.height),
			control: this._attributes.control,
			transpose: false
		};

		this._entities[guid].drawable.width -= this._attributes.hop;
		this._entities[guid].drawable.generate();
		this._entities[guid].onSplitted();

		this.new([data]);
	}

	public splitFromTop(guid: string): void
	{
		if(!this._entities[guid])
			return null;

		let data = {
			point: new Paperless.Point(this._entities[guid].drawable.matrix.e, this._entities[guid].drawable.matrix.f),
			size: new Paperless.Size(this._entities[guid].drawable.width, this._attributes.hop),
			control: this._attributes.control,
			transpose: false
		};

		this._entities[guid].drawable.matrix.f += this._attributes.hop;
		this._entities[guid].drawable.height -= this._attributes.hop;
		this._entities[guid].drawable.generate();
		this._entities[guid].onSplitted();

		this.new([data]);
	}

	public splitFromBottom(guid: string): void
	{
		if(!this._entities[guid])
			return null;

		let data = {
			point: new Paperless.Point(this._entities[guid].drawable.matrix.e, this._entities[guid].drawable.matrix.f + this._entities[guid].drawable.height - this._attributes.hop),
			size: new Paperless.Size(this._entities[guid].drawable.width, this._attributes.hop),
			control: this._attributes.control,
			transpose: false
		};

		this._entities[guid].drawable.height -= this._attributes.hop;
		this._entities[guid].drawable.generate();
		this._entities[guid].onSplitted();

		this.new([data]);
	}

	// expand
	// ------------------------------

	public isExpandableToLeft(guid: string): boolean
	{
		if(!this._entities[guid] || !this._entities[guid].expandable || 
			this._entities[guid].drawable.matrix.e - this._attributes.hop + this.x < this.x)
			return false;

		for(let y: number = this._entities[guid].drawable.matrix.f; y < this._entities[guid].drawable.matrix.f + this._entities[guid].drawable.height - 1; y += this._attributes.hop)
		{
			if(this.getGuid(new Paperless.Point(this._entities[guid].drawable.matrix.e - this._attributes.hop, y)))
				return false;
		}

		return true;
	}

	public isExpandableToRight(guid: string): boolean
	{
		if(!this._entities[guid] || !this._entities[guid].expandable || 
			this._entities[guid].drawable.matrix.e + this._entities[guid].drawable.width + this._attributes.hop + this.x > this.x + this.width)
			return false;

		for(let y: number = this._entities[guid].drawable.matrix.f; y < this._entities[guid].drawable.matrix.f + this._entities[guid].drawable.height - 1; y += this._attributes.hop)
		{
			if(this.getGuid(new Paperless.Point(this._entities[guid].drawable.matrix.e + this._entities[guid].drawable.width, y)))
				return false;
		}

		return true;
	}

	public isExpandableToTop(guid: string): boolean
	{
		if(!this._entities[guid] || !this._entities[guid].expandable || 
			this._entities[guid].drawable.matrix.f - this._attributes.hop + this.y < this.y)
			return false;

		for(let x: number = this._entities[guid].drawable.matrix.e; x < this._entities[guid].drawable.matrix.e + this._entities[guid].drawable.width - 1; x += this._attributes.hop)
		{
			if(this.getGuid(new Paperless.Point(x, this._entities[guid].drawable.matrix.f - this._attributes.hop)))
				return false;
		}

		return true;
	}

	public isExpandableToBottom(guid: string): boolean
	{
		if(!this._entities[guid] || !this._entities[guid].expandable || 
			(this._entities[guid].drawable.matrix.f + this._entities[guid].drawable.height + this._attributes.hop + this.y > this.y + this.height && !this._attributes.expandable))
			return false;

		for(let x: number = this._entities[guid].drawable.matrix.e; x < this._entities[guid].drawable.matrix.e + this._entities[guid].drawable.width - 1; x += this._attributes.hop)
		{
			if(this.getGuid(new Paperless.Point(x, this._entities[guid].drawable.matrix.f + this._entities[guid].drawable.height)))
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
			this._entities[guid].drawable.matrix.e -= this._attributes.hop;
			this._entities[guid].drawable.width += this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded();
		}
	}

	public expandFromLeftMax(guid: string): void
	{
		let expanded: boolean = this.isExpandableToLeft(guid);

		while(this.isExpandableToLeft(guid))
		{
			this._entities[guid].drawable.matrix.e -= this._attributes.hop;
			this._entities[guid].drawable.width += this._attributes.hop;
		}

		if(expanded)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded();
		}
	}

	public expandFromRight(guid: string): void
	{
		if(this.isExpandableToRight(guid))
		{
			this._entities[guid].drawable.width += this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded();
		}
	}

	public expandFromRightMax(guid: string): void
	{
		let expanded: boolean = this.isExpandableToRight(guid);

		while(this.isExpandableToRight(guid))
			this._entities[guid].drawable.width += this._attributes.hop;

		if(expanded)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded();
		}
	}

	public expandFromTop(guid: string): void
	{
		if(this.isExpandableToTop(guid))
		{
			this._entities[guid].drawable.matrix.f -= this._attributes.hop;
			this._entities[guid].drawable.height += this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded();
		}
	}

	public expandFromTopMax(guid: string): void
	{
		let expanded: boolean = this.isExpandableToTop(guid);

		while(this.isExpandableToTop(guid))
		{
			this._entities[guid].drawable.matrix.f -= this._attributes.hop;
			this._entities[guid].drawable.height += this._attributes.hop;
		}

		if(expanded)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded();
		}
	}

	public expandFromBottom(guid: string): void
	{
		if(this.isExpandableToBottom(guid))
		{
			this._entities[guid].drawable.height += this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded();

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
			let expanded: boolean = this.isExpandableToBottom(guid);

			while(this.isExpandableToBottom(guid))
				this._entities[guid].drawable.height += this._attributes.hop;

			if(expanded)
			{
				this._entities[guid].drawable.generate();
				this._entities[guid].onExpanded();
			}
		}
		else
		{
			let stage: Paperless.Size = new Paperless.Size(this.context.canvas.width, this.context.canvas.height);

			while(this.isExpandableToBottom(guid) && (this._entities[guid].drawable.matrix.f + this._entities[guid].drawable.height < stage.height - this._attributes.hop))
				this._entities[guid].drawable.height += this._attributes.hop;

			this._entities[guid].drawable.generate();
			this._entities[guid].onExpanded();

			this.resize();
		}
	}

	// shrink
	// ------------------------------

	public isShrinkableWidth(guid: string): boolean
	{
		if(!this._entities[guid] || this._entities[guid].drawable.width < this._attributes.hop * 2)
			return false;

		return true;
	}

	public isShrinkableHeight(guid: string): boolean
	{
		if(!this._entities[guid] || this._entities[guid].drawable.height < this._attributes.hop * 2)
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
			this._entities[guid].drawable.matrix.e += this._attributes.hop;
			this._entities[guid].drawable.width -= this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked();
		}
	}

	public shrinkFromLeftMin(guid: string): void
	{
		let shrinked: boolean = this.isShrinkableWidth(guid);

		while(this.isShrinkableWidth(guid))
		{
			this._entities[guid].drawable.matrix.e += this._attributes.hop;
			this._entities[guid].drawable.width -= this._attributes.hop;
		}

		if(shrinked)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked();
		}
	}

	public shrinkFromRight(guid: string): void
	{
		if(this.isShrinkableWidth(guid))
		{
			this._entities[guid].drawable.width -= this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked();
		}
	}

	public shrinkFromRightMin(guid: string): void
	{
		let shrinked: boolean = this.isShrinkableWidth(guid);

		while(this.isShrinkableWidth(guid))
			this._entities[guid].drawable.width -= this._attributes.hop;

		if(shrinked)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked();
		}
	}

	public shrinkFromTop(guid: string): void
	{
		if(this.isShrinkableHeight(guid))
		{
			this._entities[guid].drawable.matrix.f += this._attributes.hop;
			this._entities[guid].drawable.height -= this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked();
		}
	}

	public shrinkFromTopMin(guid: string): void
	{
		let shrinked: boolean = this.isShrinkableHeight(guid);

		while(this.isShrinkableHeight(guid))
		{
			this._entities[guid].drawable.matrix.f += this._attributes.hop;
			this._entities[guid].drawable.height -= this._attributes.hop;
		}

		if(shrinked)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked();
		}
	}

	public shrinkFromBottom(guid: string): void
	{
		if(this.isShrinkableHeight(guid))
		{
			this._entities[guid].drawable.height -= this._attributes.hop;
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked();

			if(this._attributes.expandable)
				this.resize();
			else
				this.context.refresh();
		}
	}

	public shrinkFromBottomMin(guid: string): void
	{
		let shrinked: boolean = this.isShrinkableHeight(guid);

		while(this.isShrinkableHeight(guid))
			this._entities[guid].drawable.height -= this._attributes.hop;

		if(shrinked)
		{
			this._entities[guid].drawable.generate();
			this._entities[guid].onShrinked();

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
			this._entities[guid].drawable.matrix.e -= this._attributes.hop;
			this._entities[guid].drawable.generate();
		}

	}

	public quickMoveFromRight(guid: string)
	{
		if(this.isExpandableToRight(guid))
		{
			this._entities[guid].drawable.matrix.e += this._attributes.hop;
			this._entities[guid].drawable.generate();
		}
	}

	public quickMoveFromTop(guid: string): void
	{
		if(this.isExpandableToTop(guid))
		{
			this._entities[guid].drawable.matrix.f -= this._attributes.hop;
			this._entities[guid].drawable.generate();

			if(this._attributes.expandable)
				this.resize();
		}
	}

	public quickMoveFromBottom(guid: string): void
	{
		if(this.isExpandableToBottom(guid))
		{
			this._entities[guid].drawable.matrix.f += this._attributes.hop;
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
