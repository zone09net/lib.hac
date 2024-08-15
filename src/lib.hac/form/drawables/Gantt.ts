import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIGanttAttributes} from '../interfaces/IUI.js';



export class Gantt extends EntityCoreDrawable
{
	private _chart: string = undefined;
	//---

	public constructor(attributes: IDrawableUIGanttAttributes = {})
	{
		super(attributes);

		this._chart = attributes.chart;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get chart(): string
	{
		return this._chart;
	}
	public set chart(chart: string)
	{
		this._chart = chart;
	}
}

