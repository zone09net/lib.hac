import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIWhiteboardAttributes} from '../interfaces/IUI.js';



export class Whiteboard extends EntityCoreDrawable
{
	private _board: string = undefined;
	//---

	public constructor(attributes: IDrawableUIWhiteboardAttributes = {})
	{
		super(attributes);

		this._board = attributes.board;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get board(): string
	{
		return this._board;
	}
	public set board(board: string)
	{
		this._board = board;
	}
}

