import * as Paperless from '@zone09.net/paperless';
import {Window} from '../components/Window.js';



export class Header extends Paperless.Controls.Button
{
	private _delay: number;
	//---

	public constructor(callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null)
	{
		super(callbackLeftClick, callbackRightClick, smugglerLeftClick, smugglerRightClick);
	}

	public onInside(): void
	{
		this._delay = this.context.dragging.delay;
		this.context.dragging.delay = 0;
	}

	public onOutside(): void
	{
		this.context.dragging.delay = this._delay;
	}
	
	public onDragBegin(): void
	{
		this.context.getComponents().map.forEach((entry: any) => {
				
			if(entry.object instanceof Window)
			{
				entry.object.puzzled.removeGuid(entry.object.puzzled.getIcons());
				entry.object.puzzled.removeMarker();
			}
		});
	}
}
