import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {Icon} from './Icon.js';
import {Highlight} from '../drawables/Highlight.js';
import {Assets} from '../drawables/Assets.js';
import {Sizer as CSizer} from './Sizer.js';
import {Sizer as DSizer} from '../drawables/Sizer.js';
import {Splitter as CSplitter} from './Splitter.js';
import {Splitter as DSplitter} from '../drawables/Splitter.js';
import {EntityCoreDrawable} from '../drawables/EntityCoreDrawable.js';
import {Restrict} from '../enums/Restrict.js';
import {IEntityCoreControlAttributes} from '../interfaces/IPuzzled.js';



export class EntityCoreControl extends Paperless.Control
{
	/** @ignore */
	[key: string]: any;

	private _puzzled: Puzzled;
	private _swappable: boolean;
	private _expandable: boolean;
	private _shrinkable: boolean;
	private _splittable: boolean;
	private _stackable: boolean;
	private _highlightMoving: Highlight;
	private _highlightOrigin: Highlight;
	private _isMovable: boolean = false;
	private _isSwappable: boolean = false;
	private _pointCurrent: Paperless.Point;
	private _minimum: {width?: number, height?: number} = {width: 0, height: 0};
	//---

	public constructor(attributes: IEntityCoreControlAttributes = {})
	{
		super(attributes);

		const {
			swappable = true,
			splittable = true,
			shrinkable = true,
			expandable = true,
			stackable = false,
			minimum = {width: 0, height: 0},
		} = attributes;

		this._puzzled = attributes.puzzled;
		this._swappable = swappable;
		this._expandable = expandable;
		this._splittable = splittable;
		this._shrinkable = shrinkable;
		this._stackable = stackable;
		this._minimum = {width: minimum.width, height: minimum.height};
	}

	public onDragBegin(): void
	{
		this._puzzled.removeMarker();

		this._highlightMoving = new Highlight({
			puzzled: this._puzzled, 
			layer: this._puzzled.layer,
			size: {width: this.drawable.width, height: this.drawable.height},
			offset1: {x: this._puzzled.x, y: this._puzzled.y}
		});

		this._highlightOrigin = new Highlight({
			puzzled: this._puzzled, 
			layer: this._puzzled.layer,
			size: {width: this.drawable.width, height: this.drawable.height},
			offset1: {x: this._puzzled.x, y: this._puzzled.y},
			point: {x: this.drawable.x, y: this.drawable.y}
		});
	}

	public onDrag(): void
	{
		const context2D: OffscreenCanvasRenderingContext2D = this.context.context2D;

		this._pointCurrent = this.context.states.pointer.current;

		this._pointCurrent = new Paperless.Point(
			(Math.round((this._pointCurrent.x - this.context.states.pointer.dragdiff.x) / this._puzzled.hop) * this._puzzled.hop),
			(Math.round((this._pointCurrent.y - this.context.states.pointer.dragdiff.y) / this._puzzled.hop) * this._puzzled.hop)
		);

		const guid: string = this._puzzled.getGuid(new Paperless.Point(this._pointCurrent.x, this._pointCurrent.y), [this.guid]);

		if(this._puzzled.isSwappable(this.guid, guid))
		{
			const control: Paperless.Control = this._puzzled.extractGuid(guid);

			if(this._swappable)
			{
				this._isSwappable = true;
				this._highlightOrigin.draw(context2D);
			}

			this._highlightMoving.x = control.drawable.x;
			this._highlightMoving.y = control.drawable.y;
		}
		else
		{
			this._isSwappable = false;
			this._highlightMoving.x = this._pointCurrent.x;
			this._highlightMoving.y = this._pointCurrent.y;
		}

		context2D.save();

		if(!this._puzzled.isMovable(this.guid, new Paperless.Point(this._pointCurrent.x, this._pointCurrent.y)) && !this._isSwappable && !this._stackable)
		{
			this._highlightMoving.fillcolor = this._puzzled.color.nomove;
			context2D.shadowColor = this._puzzled.color.nomove;
			this._isMovable = false;
		}
		else
		{
			this._highlightMoving.fillcolor = this._puzzled.color.move;
			context2D.shadowColor = this._puzzled.color.move;
			this._isMovable = true;
		}

		this._highlightMoving.draw(context2D);
		context2D.restore();
	}

	public async onDragEnd(): Promise<void>
	{
		if(!this._isMovable && !this._isSwappable)
		{
			this.drawable.x = this._highlightOrigin.x;
			this.drawable.y = this._highlightOrigin.y;
			this.onCancel();
		}

		else if(this._isSwappable)
		{
			const promise = this.onSwapping(new Paperless.Point(this.drawable.x, this.drawable.y));

			promise.then(
				success => {
					const guid: string = this._puzzled.getGuid(this._pointCurrent, new Array(this.guid));
					const control: EntityCoreControl = this._puzzled.extractGuid(guid);
					
					this.drawable.x = this._highlightMoving.x;
					this.drawable.y = this._highlightMoving.y;
 
					control.drawable.x = this._highlightOrigin.x;
					control.drawable.y = this._highlightOrigin.y;

					control.onSwapped(new Paperless.Point(this._highlightMoving.x, this._highlightMoving.y));
					this.onSwapped(this._highlightOrigin.point);
				},
				error => {
					this.drawable.x = this._highlightOrigin.x;
					this.drawable.y = this._highlightOrigin.y;
					this.onCancel();
				}
			);
		}

		else if(this._isMovable)
		{
			this.drawable.x = this._highlightMoving.x;
			this.drawable.y = this._highlightMoving.y;

			const promise: Promise<unknown> = this.onMoving(new Paperless.Point(this.drawable.x, this.drawable.y));

			promise.then(
				success => {
					if(this._puzzled.expandable)
						this._puzzled.resize();

					this.onMoved(this._highlightOrigin.point);
				},
				error => {
					this.drawable.x = this._highlightOrigin.x;
					this.drawable.y = this._highlightOrigin.y;
					this.onCancel();
				}
			);
		}

		this.context.detach(this._highlightMoving.guid);
	}

	public onLoading(): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onLoaded(): void {}

	public onLeftClick(): void
	{
		this.toggleMarker();
	}

	public onRightClick(): void {}

	public onRemoving(): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onRemoved(): void {}

	public onCancel(): void {}

	public onMoving(pointDestination: Paperless.Point): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onMoved(pointSource: Paperless.Point): void {}

	public onSwapping(pointDestination: Paperless.Point): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onSwapped(pointSource: Paperless.Point): void {}

	public onFocus(): void {}

	public onLostFocus(): void {}

	public onMarked(): void {}

	public onUnmarked(): void {}

	public onSplitted(): void {}

	public onExpanded(): void {}

	public onShrinked(): void {}

	public onIconsDefault(): void
	{
		const pointBottomRight: Paperless.Point = new Paperless.Point(this.drawable.x + this.drawable.width - 9, this.drawable.y + this.drawable.height);

		this.attachIcon(pointBottomRight, new Paperless.Size(22, 22), Assets.close, () => {
			this._puzzled.detach(this._puzzled.getIcons());
			this._puzzled.removeMarker();
			this._puzzled.removeGuid(this.guid);
		});
	}

	public onIconsRefresh(): void {}

	public toggleMarker(restrict: Restrict = Restrict.none): void
	{
		if(this._puzzled.getMarker() == this.guid)
		{
			/*
			if(this._puzzled.group != undefined && restrict == Restrict.none)
			{
				let group: Paperless.Group = this.context.get(this._puzzled.group);

				group.map.forEach((entry: any) => {
					if(entry.object.constructor.name == 'Puzzled')
						entry.object.detach(entry.object.getIcons());
				});
			}
			else
			*/
			
			//this._puzzled.detach(this._puzzled.getIcons());
			//this._puzzled.removeMarker();
		}
		else
		{
			/*
			if(this._puzzled.group != undefined && restrict == Restrict.none)
			{
				let group: Paperless.Group = this.context.get(this._puzzled.group);

				group.map.forEach((entry: any) => {
					if(entry.object.constructor.name == 'Puzzled')
						entry.object.detach(entry.object.getIcons());
				});
			}
			*/

			//this._puzzled.detach(this._puzzled.getIcons());
			this._puzzled.removeMarker();
			this._puzzled.setMarker(new Paperless.Point(this.drawable.x, this.drawable.y));
			this.refreshIcons();
		}
	}

	public attachIcon(point: Paperless.Point, size: Paperless.Size, object: string | HTMLImageElement | Paperless.Drawable, callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null, newicon?: typeof Icon): Icon
	{
		const layer: number = Paperless.Layer.decode(this._puzzled.guid);
		let drawable: Paperless.Drawable;
		let icon: Icon;

		if(!newicon)
			newicon = Icon;

		if(typeof object == 'string' || object instanceof HTMLImageElement)
		{
			drawable = new Paperless.Drawables.Artwork({
				context: this.context,
				layer: layer, 
				point: {x: point.x, y: point.y}, 
				offset1: this._puzzled.point, 
				size: {width: size.width, height: size.height}, 
				content: object, 
				hoverable: true
			});
		}
		else
			drawable = object;

		if(this.drawable.sticky)
			drawable.sticky = true;

		icon = new newicon({
			context: this.context,
			drawable: drawable,
			layer: layer,
			puzzled: this._puzzled
		});

		if(!smugglerLeftClick)
			smugglerLeftClick = icon;

		if(!smugglerRightClick)
			smugglerRightClick = icon;

		icon.callbackLeftClick = () => { callbackLeftClick(smugglerLeftClick); }
		icon.callbackRightClick = () => { callbackRightClick(smugglerRightClick); }

		this._puzzled.attach(icon);

		return icon;
	}

	public refreshIcons(): void
	{
		const expandable: {left: boolean, right: boolean, top: boolean, bottom: boolean} = this._puzzled.isExpandable(this.guid);
		const shrinkable: {width: boolean, height: boolean} = this._puzzled.isShrinkable(this.guid);
		const pointLeft: Paperless.Point = new Paperless.Point(this.drawable.x, this.drawable.y + ((this.drawable.height - this._puzzled.spacing) / 2));
		const pointRight: Paperless.Point = new Paperless.Point(this.drawable.x + this.drawable.width - this._puzzled.spacing, this.drawable.y + ((this.drawable.height - this._puzzled.spacing) / 2));
		const pointTop: Paperless.Point = new Paperless.Point(this.drawable.x + ((this.drawable.width - this._puzzled.spacing) / 2), this.drawable.y);
		const pointBottom: Paperless.Point = new Paperless.Point(this.drawable.x + ((this.drawable.width - this._puzzled.spacing) / 2), this.drawable.y + this.drawable.height - this._puzzled.spacing);
		const redraw: boolean = expandable.left || expandable.right || expandable.top || expandable.bottom;

		this._puzzled.detach(this._puzzled.getIcons());

		if(this._shrinkable)
		{
			if(shrinkable.width)
			{
				this.addSizer(pointLeft, 270, 90, 'shrinkFromLeft', 'shrinkFromLeftMin', redraw);
				this.addSizer(pointRight, 90, 270, 'shrinkFromRight', 'shrinkFromRightMin', redraw);
			}
			if(shrinkable.height)
			{
				this.addSizer(pointTop, 0, 180, 'shrinkFromTop', 'shrinkFromTopMin', redraw);
				this.addSizer(pointBottom, 180, 0, 'shrinkFromBottom', 'shrinkFromBottomMin', redraw);
			}
		}

		if(this._expandable)
		{
			if(expandable.left)
				this.addSizer(pointLeft, 90, 270, 'expandFromLeft', 'expandFromLeftMax', redraw);
			if(expandable.right)
				this.addSizer(pointRight, 270, 90, 'expandFromRight', 'expandFromRightMax', redraw);
			if(expandable.top)
				this.addSizer(pointTop, 180, 0, 'expandFromTop', 'expandFromTopMax', redraw);
			if(expandable.bottom)
				this.addSizer(pointBottom, 0, 180, 'expandFromBottom', 'expandFromBottomMax', redraw);
		}

		if(this._splittable)
		{
			if(shrinkable.width)
			{
				pointLeft.x += 17;
				pointRight.x -= 17;

				this.addSplitter(pointLeft, 0, 'splitFromLeft', undefined, redraw);
				this.addSplitter(pointRight, 0, 'splitFromRight', undefined, redraw);
			}
			if(shrinkable.height)
			{
				pointTop.y += 17;
				pointBottom.y -= 17;

				this.addSplitter(pointTop, 90, 'splitFromTop', undefined, redraw);
				this.addSplitter(pointBottom, 90, 'splitFromBottom', undefined, redraw);
			}
		}

		this.onIconsDefault();
		this.onIconsRefresh();
	}

	private addSizer(point: Paperless.Point, angle1: number, angle2: number, leftClickCallback: string, rightClickCallback: string, redraw: boolean): void
	{
		const layer: number = Paperless.Layer.decode(this._puzzled.guid);

		const icon: CSizer = new CSizer({
			context: this.context,
			layer: layer,
			puzzled: this._puzzled,
			entity: this,
			callbackLeftClick: () => {
				this._puzzled[leftClickCallback](this.guid); 
				(<EntityCoreDrawable>this.drawable).generate(redraw); 
				this.refreshIcons(); 
			},
			callbackRightClick: () => { 
				this._puzzled[rightClickCallback](this.guid); 
				(<EntityCoreDrawable>this.drawable).generate(redraw); 
				this.refreshIcons(); 
			},
			drawable: new DSizer({
				context: this.context,
				layer: layer,
				puzzled: this._puzzled,
				point: {x: point.x, y: point.y}, 
				offset1: {x: this._puzzled.x, y: this._puzzled.y}, 
				angleStart: angle1, 
				angleEnd: angle2
			})
		});

		if(leftClickCallback == 'shrinkFromLeft' || leftClickCallback == 'shrinkFromRight' || leftClickCallback == 'expandFromLeft' || leftClickCallback == 'expandFromRight')
			icon.restrict = Paperless.Enums.Restrict.horizontal;
		else if(leftClickCallback == 'shrinkFromTop' || leftClickCallback == 'shrinkFromBottom' || leftClickCallback == 'expandFromTop' || leftClickCallback == 'expandFromBottom')
			icon.restrict = Paperless.Enums.Restrict.vertical;

		this._puzzled.attach(icon);
	}

	private addSplitter(point: Paperless.Point, angle: number, leftClickCallback: string, rightClickCallback: string, redraw: boolean): void
	{
		const layer: number = Paperless.Layer.decode(this._puzzled.guid);
		const icon: CSplitter = new CSplitter({
			context: this.context,
			layer: layer,
			puzzled: this._puzzled,
			callbackLeftClick: () => { 
				this._puzzled[leftClickCallback](this.guid); 
				(<EntityCoreDrawable>this.drawable).generate(redraw); 
				this.refreshIcons(); 
			},
			callbackRightClick: () => { },
			drawable: new DSplitter({
				context: this.context,
				layer: layer,
				puzzled: this._puzzled,
				point: {x: point.x, y: point.y}, 
				offset1: {x: this._puzzled.x, y: this._puzzled.y}, 
				angle: angle
			})
		});
		
		this._puzzled.attach(icon);
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}

	public get swappable(): boolean
	{
		return this._swappable;
	}
	public set swappable(swappable: boolean)
	{
		this._swappable = swappable;
	}

	public get expandable(): boolean
	{
		return this._expandable;
	}
	public set expandable(expandable: boolean)
	{
		this._expandable = expandable;
	}

	public get shrinkable(): boolean
	{
		return this._shrinkable;
	}
	public set shrinkable(shrinkable: boolean)
	{
		this._shrinkable = shrinkable;
	}

	public get splittable(): boolean
	{
		return this._splittable;
	}
	public set splittable(splittable: boolean)
	{
		this._splittable = splittable;
	}

	public get stackable(): boolean
	{
		return this._stackable;
	}
	public set stackable(stackable: boolean)
	{
		this._stackable = stackable;
	}

	public get minimum(): {width?: number, height?: number}
	{
		return this._minimum;
	}
	public set minimum(minimum: {width?: number, height?: number})
	{
		this._minimum = minimum;
	}
}
