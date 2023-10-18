import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../../puzzled/components/Puzzled.js';
import {Palette} from '../../palette/components/Palette.js'
import {EntityCoreControl as Control} from '../../puzzled/controls/EntityCoreControl.js';



export class EntityCoreControl extends Control
{
	public constructor(puzzled: Puzzled)
	{
		super(puzzled);
	}

	public attachPalette(): void
	{
		/*
		let palette: Palette = new Palette(new Paperless.Point(this.drawable.x, this.drawable.y), (fillcolor: string, strokecolor: string) => {
			this._fillcolor2 = fillcolor;
			this._strokecolor2 = strokecolor;
		
		});
		
		this.context.attach(palette);
		*/
	}


	// Accessors
	// --------------------------------------------------------------------------
}
