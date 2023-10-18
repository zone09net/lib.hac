import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {EntityCoreControl} from './EntityCoreControl.js';
import {Slider} from '../drawables/Slider.js';



export class Sizer extends Paperless.Controls.Button
{
	private _puzzled: Puzzled;
	private _entity: EntityCoreControl;
	private _side: string;
	private _ghost: Slider;
	//---

	public constructor(puzzled: Puzzled, entity: EntityCoreControl, attributes: Paperless.Interfaces.IControlButtonAttributes = {})
	{
		super(attributes);

		this.focusable = false;
		this._puzzled = puzzled;
		this._entity = entity;
		this._ghost = new Slider(puzzled);
	}

	public onInside(): void
	{
		this.drawable.toFront();
		this.drawable.fillcolor = this._puzzled.color.sizer;
	}

	public onOutside(): void
	{
		this.drawable.fillcolor = this._puzzled.color.marked;
	}
	
	public onDragBegin() : void
	{
		this._puzzled.removeMarker();
		this._entity.drawable.generate();
		
		if(this.drawable.x == this._entity.drawable.x)
		{
			this._side = 'left';
			this._ghost.angle = 90;
		}
		else if(this.drawable.x == this._entity.drawable.x + this._entity.drawable.width - this._puzzled.spacing)
		{
			this._side = 'right';
			this._ghost.angle = 90;
		}
		else if(this.drawable.y == this._entity.drawable.y)
			this._side = 'top';
		else if(this.drawable.y == this._entity.drawable.y + this._entity.drawable.height - this._puzzled.spacing)
			this._side = 'bottom';

		(<Paperless.Drawables.Circle>this.drawable).angleStart = 0;
		(<Paperless.Drawables.Circle>this.drawable).angleEnd = 360;
		(<Paperless.Drawables.Circle>this.drawable).generate();

		this._puzzled.detach(this._puzzled.getIcons().filter(icon => 
			icon.guid != this.guid && 
			(icon.constructor.name == 'Sizer' || icon.constructor.name == 'Splitter' || icon.constructor.name == 'Icon')
		));

		this._ghost.width = this._entity.drawable.width - this._puzzled.spacing;
		this._ghost.height = this._entity.drawable.height - this._puzzled.spacing;
		this._ghost.generate();
	}

	public onDrag(): void
	{
		this._ghost.x = this.drawable.x + this._puzzled.spacing;
		this._ghost.y = this.drawable.y + this._puzzled.spacing;

		switch(this._side)
		{
			case 'left':
				if(this.drawable.x < this._entity.drawable.x - this._puzzled.hop)
					this._puzzled.expandFromLeft(this._entity.guid);
				else if(this.drawable.x > this._entity.drawable.x + this._puzzled.hop)
					this._puzzled.shrinkFromLeft(this._entity.guid);

				break;

			case 'right':
				if(this._ghost.x > this._entity.drawable.x + this._entity.drawable.width + this._puzzled.hop)
					this._puzzled.expandFromRight(this._entity.guid);
				else if(this._ghost.x < this._entity.drawable.x + this._entity.drawable.width - this._puzzled.hop)
					this._puzzled.shrinkFromRight(this._entity.guid);

				break;

			case 'top':
				if(this._ghost.y < this._entity.drawable.y - this._puzzled.hop + this._puzzled.spacing)
					this._puzzled.expandFromTop(this._entity.guid);
				else if(this._ghost.y > this._entity.drawable.y + this._puzzled.hop)
					this._puzzled.shrinkFromTop(this._entity.guid);
				break;

			case 'bottom':
				if(this._ghost.y > this._entity.drawable.y + this._entity.drawable.height + this._puzzled.hop)
					this._puzzled.expandFromBottom(this._entity.guid);
				else if(this._ghost.y < this._entity.drawable.y + this._entity.drawable.height - this._puzzled.hop)
					this._puzzled.shrinkFromBottom(this._entity.guid);

				break;
		}

		this._ghost.draw(this.context.context2D);
	}

	public onDragEnd(): void
	{
		this._puzzled.setMarker(new Paperless.Point(this._entity.drawable.x, this._entity.drawable.y));
		this._puzzled.detach(this._puzzled.getIcons());
		this._entity.refreshIcons();
	}
}
