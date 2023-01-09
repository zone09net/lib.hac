import * as Paperless from '@zone09.net/paperless';
import {Manipulator} from './Manipulator.js';
import {Item} from './Item.js';
import {IComponentSelectorAlignAttributes} from '../interfaces/ISelector.js';



export class Align extends Manipulator
{
	private _attributes: IComponentSelectorAlignAttributes;
	//---

	public constructor(attributes: IComponentSelectorAlignAttributes = {})
	{
		super();

		const {
			restrict = Paperless.Enums.Restrict.horizontal,
			isolated = 1,
			bypass = false,
			duration = {},
			direction = {},
		} = attributes;

		this._attributes = {
			restrict: restrict,
			isolated: isolated,
			bypass: bypass,
			duration: {...{fade: 300, shift: 500}, ...duration},
			direction: {...{fadeout: Paperless.Enums.Direction.top, fadein: Paperless.Enums.Direction.down, shift: Paperless.Enums.Direction.right}, ...direction},
		};
	}

	public onInitializing(): void
	{
		if(this._attributes.restrict == Paperless.Enums.Restrict.horizontal)
			this.alignHorizontal();
		else if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
			this.alignVertical();
	}

	public onPopping(item: Item): void
	{
		if(this._attributes.isolated > 1)
			return;

		let fadeDistance: number;

		if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
			fadeDistance = this.selector.size.width;
		else
			fadeDistance = this.selector.size.height;

		this.disableItems();

		item.onBeforeSelection();

		this.selector.fx.add({
			duration: this._attributes.duration.fade,
			drawable: item.drawable,
			effect: this.selector.fx.fadeOut,
			nogroup: true,
			smuggler: { ease: Paperless.Fx.easeOutSine },
		});

		this.selector.fx.add({
			duration: this._attributes.duration.fade,
			drawable: item.drawable,
			effect: this.selector.fx.translate,
			nogroup: true,
			smuggler: { ease: Paperless.Fx.easeOutExpo, angle: this._attributes.direction.fadeout, distance: fadeDistance },
			complete: () => { 
				let index = this.selector.items.indexOf(item);

				this.selector.items.splice(index, 1);
				if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
					item.drawable.matrix.f = this.selector.point.y + (item.drawable.size.height / 2) + this.selector.padding.top;
				else
					item.drawable.matrix.e = this.selector.point.x + (item.drawable.size.width / 2) + this.selector.padding.left;

				this.realign();
	
				this.selector.fx.add({
					duration: this._attributes.duration.fade,
					drawable: item.drawable,
					effect: this.selector.fx.fadeIn,
					nogroup: true,
					smuggler: { ease: Paperless.Fx.easeInExpo }
				});
				
				this.selector.fx.add({
					duration: this._attributes.duration.fade,
					drawable: item.drawable,
					effect: this.selector.fx.translate,
					nogroup: true,
					smuggler: { ease: Paperless.Fx.easeInSine, angle: this._attributes.direction.fadein, distance: fadeDistance },
					complete: () => {
						this.selector.items.unshift(item);
						
						window.requestAnimationFrame(() => {
							item.drawable.context.refresh();
							item.enabled = false;
							item.drawable.hoverable = false;
							item.onAfterSelection();
							this.enableItems();
							item.enabled = false;
						});
					}
				});
			}
		});
	}
	
	private realign(): void
	{
		if(this.selector.items.length > 0)
		{
			let point: number;
			let distance: number;
			let drawable: Paperless.Drawable;

			if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
				point = this.selector.point.y + this.selector.size.height
			else
				point = this.selector.point.x + this.selector.size.width;

			for(let i: number = this.selector.items.length - 1; i >= 0; i--)
			{
				drawable = this.selector.items[i].drawable;
				point -= (this._attributes.restrict == Paperless.Enums.Restrict.vertical) ? drawable.size.height : drawable.size.width;
	
				if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
					distance = point - drawable.matrix.f + (drawable.size.height / 2) - this.selector.padding.down;
				else
					distance = point - drawable.matrix.e + (drawable.size.width / 2) - this.selector.padding.right;

				this.selector.fx.add({
					duration: this._attributes.duration.shift,
					drawable: drawable,
					effect: this.selector.fx.translate,
					nogroup: true,
					smuggler: { ease: Paperless.Fx.easeInOutExpo, angle: this._attributes.direction.shift, distance: distance },
				});
	
				point -= this.selector.spacing;
			}
		}
	}

	private alignHorizontal(): void
	{
		this.selector.size.height = this.maxItemHeight();

		if(this.selector.items.length > 0)
		{
			let x: number = this.selector.point.x + this.selector.size.width - this.selector.padding.right;

			for(let i: number = this.selector.items.length - 1; i >= 0; i--)
			{
				if(i > this._attributes.isolated - 1)
				{
					// Right menu
					x -= (this.selector.items[i].drawable.size.width / 2);
					this.selector.items[i].drawable.matrix.e = x ;
					x -= (this.selector.items[i].drawable.size.width / 2) + this.selector.spacing;
				}
				else
				{
					// Left menu
					this.selector.items[i].drawable.matrix.e = (i * ((this.selector.items[i].drawable.size.width) + this.selector.spacing)) + this.selector.point.x + this.selector.padding.left + (this.selector.items[0].drawable.size.width / 2);

					if(!this._attributes.bypass)
						this.selector.items[i].enabled = false;
				}

				this.selector.items[i].drawable.matrix.f = this.selector.point.y + (this.selector.size.height / 2) + this.selector.padding.top - this.selector.padding.down;
			}
		}

		this.selector.context.refresh();
	}

	private alignVertical(): void
	{
		this.selector.size.width = this.maxItemWidth();

		if(this.selector.items.length > 0)
		{
			let y: number = this.selector.point.y + this.selector.size.height - this.selector.padding.down;

			for(let i: number = this.selector.items.length - 1; i >= 0; i--)
			{
				if(i > this._attributes.isolated - 1)
				{
					// Bottom menu
					y -= (this.selector.items[i].drawable.size.height / 2);
					this.selector.items[i].drawable.matrix.f = y ;
					y -= (this.selector.items[i].drawable.size.height / 2) + this.selector.spacing;
				}
				else
				{
					// Top menu
					this.selector.items[i].drawable.matrix.f = (i * ((this.selector.items[i].drawable.size.height) + this.selector.spacing)) + this.selector.point.y + this.selector.padding.top + (this.selector.items[0].drawable.size.height / 2);
					
					if(!this._attributes.bypass)
						this.selector.items[i].enabled = false;
				}

				this.selector.items[i].drawable.matrix.e = this.selector.point.x + (this.selector.size.width / 2) + this.selector.padding.left - this.selector.padding.right;
			}
		}

		this.selector.context.refresh();
	}
}
