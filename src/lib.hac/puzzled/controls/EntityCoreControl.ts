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



export class EntityCoreControl extends Paperless.Control
{
	/** @ignore */
	[key: string]: any;

	private _puzzled: Puzzled;
	private _swappable: boolean = true;
	private _expandable: boolean = true;
	private _shrinkable: boolean = true;
	private _splittable: boolean = true;
	private _highlightMoving: Highlight;
	private _highlightOrigin: Highlight;
	private _isMovable: boolean = false;
	private _isSwappable: boolean = false;
	private _pointCurrent: Paperless.Point;
	//---

	public constructor(puzzled: Puzzled)
	{
		super();

		this._puzzled = puzzled;
		this._highlightMoving = new Highlight(this.puzzled);
		this._highlightOrigin = new Highlight(this.puzzled);
	}

	public onDragBegin(): void
	{
		this.puzzled.detach(this.puzzled.getIcons());
		this.puzzled.removeMarker();

		this._highlightMoving.width = this.drawable.width;
		this._highlightMoving.height = this.drawable.height
		this._highlightMoving.offset1 = {x: this.puzzled.x, y: this.puzzled.y};
		this._highlightMoving.generate();

		this._highlightOrigin.width = this.drawable.width;
		this._highlightOrigin.height = this.drawable.height;
		this._highlightOrigin.x = this.drawable.x;
		this._highlightOrigin.y = this.drawable.y;
		this._highlightOrigin.offset1 = {x: this.puzzled.x, y: this.puzzled.y};
		this._highlightOrigin.generate();
	}

	public onDrag(): void
	{
		let context2D: OffscreenCanvasRenderingContext2D = this.context.context2D;

		this._pointCurrent = this.context.states.pointer.current;

		this._pointCurrent = new Paperless.Point(
			(Math.round((this._pointCurrent.x - this.context.states.pointer.dragdiff.x) / this.puzzled.hop) * this.puzzled.hop),
			(Math.round((this._pointCurrent.y - this.context.states.pointer.dragdiff.y) / this.puzzled.hop) * this.puzzled.hop)
		);

		let guid: string = this.puzzled.getGuid(new Paperless.Point(this._pointCurrent.x, this._pointCurrent.y), new Array(this.guid));
		if(this.puzzled.isSwappable(this.guid, guid))
		{
			let control: Paperless.Control = this.puzzled.extractGuid(guid);

			if(this._swappable)
			{
				this._isSwappable = true;
				this._highlightOrigin.draw(context2D);
			}

			this._highlightMoving.x = control.drawable.matrix.e;
			this._highlightMoving.y = control.drawable.matrix.f;
		}
		else
		{
			this._isSwappable = false;
			this._highlightMoving.matrix.e = this._pointCurrent.x;
			this._highlightMoving.matrix.f = this._pointCurrent.y;
		}

		context2D.save();
		context2D.shadowBlur = this.puzzled.shadow;

		if(!this.puzzled.isMovable(this.guid, new Paperless.Point(this._pointCurrent.x, this._pointCurrent.y)) && !this._isSwappable)
		{
			this._highlightMoving.fillcolor = this.puzzled.color.nomove;
			context2D.shadowColor = this.puzzled.color.nomove;
			//context2D.strokeStyle = this.puzzled.color.nomove;
			//context2D.fillStyle = this.puzzled.color.nomove;
			this._isMovable = false;
		}
		else
		{
			this._highlightMoving.fillcolor = this.puzzled.color.move;
			context2D.shadowColor = this.puzzled.color.move;
			//context2D.strokeStyle = this.puzzled.color.move;
			//context2D.fillStyle = this.puzzled.color.move;
			this._isMovable = true;
		}

		this._highlightMoving.draw(context2D);
		context2D.restore();
	}

	public async onDragEnd(): Promise<void>
	{
		if(!this._isMovable && !this._isSwappable)
		{
			this.drawable.matrix.e = this._highlightOrigin.x;
			this.drawable.matrix.f = this._highlightOrigin.y;
			this.onCancel();
		}

		else if(this._isSwappable)
		{
			let promise = this.onSwapping(new Paperless.Point(this.drawable.matrix.e, this.drawable.matrix.f));

			promise.then(
				success => {
					let guid: string = this.puzzled.getGuid(this._pointCurrent, new Array(this.guid));
					let control: EntityCoreControl = this.puzzled.extractGuid(guid);
					
					this.drawable.matrix.e = this._highlightMoving.matrix.e;
					this.drawable.matrix.f = this._highlightMoving.matrix.f;
 
					control.drawable.matrix.e = this._highlightOrigin.x;
					control.drawable.matrix.f = this._highlightOrigin.y;

					control.onSwapped(new Paperless.Point(this._highlightMoving.matrix.e, this._highlightMoving.matrix.f));
					this.onSwapped(this._highlightOrigin.point);
				},
				error => {
					this.drawable.matrix.e = this._highlightOrigin.x;
					this.drawable.matrix.f = this._highlightOrigin.y;
				}
			);
		}

		else if(this._isMovable)
		{
			this.drawable.matrix.e = this._highlightMoving.matrix.e;
			this.drawable.matrix.f = this._highlightMoving.matrix.f;

			let promise: Promise<unknown> = this.onMoving(new Paperless.Point(this.drawable.matrix.e, this.drawable.matrix.f));

			promise.then(
				success => {
					if(this.puzzled.expandable)
						this.puzzled.resize();

					this.onMoved(this._highlightOrigin.point);
				},
				error => {
					this.drawable.matrix.e = this._highlightOrigin.x;
					this.drawable.matrix.f = this._highlightOrigin.y;
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
		let pointBottomRight: Paperless.Point = new Paperless.Point(this.drawable.matrix.e + this.drawable.width - 9, this.drawable.matrix.f + this.drawable.height);

		this.attachIcon(pointBottomRight, new Paperless.Size(22, 22), Assets.delete, () => {
			this.toggleMarker();
			this.puzzled.removeGuid(this.guid);
		});
	}

	public onIconsRefresh(): void {}

	public toggleMarker(restrict: Restrict = Restrict.none): void
	{
		if(this.puzzled.getMarker() == this.guid)
		{
			/*
			if(this.puzzled.group != undefined && restrict == Restrict.none)
			{
				let group: Paperless.Group = this.context.get(this.puzzled.group);

				group.map.forEach((entry: any) => {
					if(entry.object.constructor.name == 'Puzzled')
						entry.object.detach(entry.object.getIcons());
				});
			}
			else
			*/
				this.puzzled.detach(this.puzzled.getIcons());

			this.puzzled.removeMarker();
		}
		else
		{
			/*
			if(this.puzzled.group != undefined && restrict == Restrict.none)
			{
				let group: Paperless.Group = this.context.get(this.puzzled.group);

				group.map.forEach((entry: any) => {
					if(entry.object.constructor.name == 'Puzzled')
						entry.object.detach(entry.object.getIcons());
				});
			}
			*/

			this.puzzled.removeMarker();
			this.puzzled.setMarker(new Paperless.Point(this.drawable.matrix.e, this.drawable.matrix.f));
			this.refreshIcons();
		}
	}

	public attachIcon(point: Paperless.Point, size: Paperless.Size, object: string | HTMLImageElement | Paperless.Drawable, callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null, newicon?: typeof Icon)
	{
		let drawable: Paperless.Drawable;
		let icon: Icon;

		if(!newicon)
			newicon = Icon

		if(typeof object == 'string' || object instanceof HTMLImageElement)
			drawable = this.context.attach(new Paperless.Drawables.Artwork({point: {x: point.x, y: point.y}, offset1: {x: this._puzzled.x, y: this._puzzled.y}, size: {width: size.width, height: size.height}, content: object, hoverable: true}));
		else
			drawable = object;

		if(this.drawable.sticky)
			drawable.sticky = true;
			
		icon = this.context.attach(new newicon(
			this.puzzled,
			{
				callbackLeftClick: () => { callbackLeftClick(smugglerLeftClick); },
				callbackRightClick: () => { callbackRightClick(smugglerRightClick); }
			}

		));
		icon.attach(drawable);

		this.puzzled.attach(icon);
	}

	public refreshIcons(): void
	{
		let expandable: {left: boolean, right: boolean, top: boolean, bottom: boolean} = this.puzzled.isExpandable(this.guid);
		let shrinkable: {width: boolean, height: boolean} = this.puzzled.isShrinkable(this.guid);
		let pointLeft: Paperless.Point = new Paperless.Point(this.drawable.matrix.e, this.drawable.matrix.f + ((this.drawable.height - this.puzzled.spacing) / 2));
		let pointRight: Paperless.Point = new Paperless.Point(this.drawable.matrix.e + this.drawable.width - this.puzzled.spacing, this.drawable.matrix.f + ((this.drawable.height - this.puzzled.spacing) / 2));
		let pointTop: Paperless.Point = new Paperless.Point(this.drawable.matrix.e + ((this.drawable.width - this.puzzled.spacing) / 2), this.drawable.matrix.f);
		let pointBottom: Paperless.Point = new Paperless.Point(this.drawable.matrix.e + ((this.drawable.width - this.puzzled.spacing) / 2), this.drawable.matrix.f + this.drawable.height - this.puzzled.spacing);
		let redraw: boolean = expandable.left || expandable.right || expandable.top || expandable.bottom;

		this.puzzled.detach(this.puzzled.getIcons());

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
		point = new Paperless.Point(point.x, point.y);

		let drawable: Paperless.Drawable = this.context.attach(new DSizer(this.puzzled, {point: {x: point.x, y: point.y}, offset1: {x: this.puzzled.x, y: this.puzzled.y}, angleStart: angle1, angleEnd: angle2}));
		let icon: CSizer = this.context.attach(new CSizer(
			this.puzzled,
			this,
			{
				callbackLeftClick: () => {
					this.puzzled[leftClickCallback](this.guid); 
					(<EntityCoreDrawable>this.drawable).generate(redraw); 
					this.refreshIcons(); 
				},
				callbackRightClick: () => { 
					this.puzzled[rightClickCallback](this.guid); 
					(<EntityCoreDrawable>this.drawable).generate(redraw); 
					this.refreshIcons(); 
				}
			}			
		));
		icon.attach(drawable);

		if(leftClickCallback == 'shrinkFromLeft' || leftClickCallback == 'shrinkFromRight' || leftClickCallback == 'expandFromLeft' || leftClickCallback == 'expandFromRight')
			icon.restrict = Paperless.Enums.Restrict.horizontal;
		else if(leftClickCallback == 'shrinkFromTop' || leftClickCallback == 'shrinkFromBottom' || leftClickCallback == 'expandFromTop' || leftClickCallback == 'expandFromBottom')
			icon.restrict = Paperless.Enums.Restrict.vertical;

		this.puzzled.attach(icon);
	}

	private addSplitter(point: Paperless.Point, angle: number, leftClickCallback: string, rightClickCallback: string, redraw: boolean): void
	{
		point = new Paperless.Point(point.x, point.y);

		let drawable: Paperless.Drawable = this.context.attach(new DSplitter(this.puzzled, {point: {x: point.x, y: point.y}, offset1: {x: this.puzzled.x, y: this.puzzled.y}, angle: angle}));
		let icon: CSplitter = this.context.attach(new CSplitter(
			this.puzzled,
			{
				callbackLeftClick: () => { 
					this.puzzled[leftClickCallback](this.guid); 
					(<EntityCoreDrawable>this.drawable).generate(redraw); 
					this.refreshIcons(); 
				},
				callbackRightClick: () => { }
			}
		));
		icon.attach(drawable);
		
		this.puzzled.attach(icon);
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
}
