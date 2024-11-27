import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIMindmapAttributes} from '../interfaces/IUI.js';



export class Mindmap extends EntityCoreDrawable
{
	private _map: string = undefined;
	//---

	public constructor(attributes: IDrawableUIMindmapAttributes = {})
	{
		super(attributes);

		this._map = attributes.map;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get map(): string
	{
		return this._map;
	}
	public set map(map: string)
	{
		this._map = map;
	}
}

