import * as Paperless from '@zone09.net/paperless';
import {IEntityCoreDrawableAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {IComponentEditableAttributes} from '../../editable/interfaces/IEditable.js';
import {IDrawableCursorAttributes} from '../../editable/interfaces/IEditable.js';
import {IComponentPopupAttributes} from '../../popup/interfaces/IPopup.js';



export interface IDrawableUIButtonAttributes extends IEntityCoreDrawableAttributes
{
	content?: string,
	rectangle?: Paperless.Interfaces.IDrawableAttributes,
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
}

export interface IDrawableUIEditableAttributes extends IEntityCoreDrawableAttributes
{
	content?: string,
	maxchar?: number,
	maxline?: number,
	restrict?: RegExp,
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
	cursor?: IDrawableCursorAttributes
}

export interface IDrawableUILabelAttributes extends IEntityCoreDrawableAttributes
{
	content?: string,
	align?: Paperless.Enums.Align,
	label?: Paperless.Interfaces.IDrawableLabelAttributes
}

export interface IDrawableUIArtworkAttributes extends IEntityCoreDrawableAttributes
{
	artwork?: Paperless.Interfaces.IDrawableArtworkAttributes
}

export interface IDrawableUITexmageAttributes extends IEntityCoreDrawableAttributes
{
	content?: string,
	type?: string,
	label?: Paperless.Interfaces.IDrawableLabelAttributes
	artwork?: Paperless.Interfaces.IDrawableArtworkAttributes
}

export interface IDrawableUISeparatorAttributes extends IEntityCoreDrawableAttributes
{
	padding?: number,
	line?: Paperless.Interfaces.IDrawableAttributes
}

export interface IDrawableUIEmptyAttributes extends IEntityCoreDrawableAttributes
{
	padding?: number,
	line?: Paperless.Interfaces.IDrawableAttributes,
}

export interface IDrawableUIFieldAttributes extends IEntityCoreDrawableAttributes
{
	content?: string,
	leftwidth?: number,
	rightwidth?: number,
	editable?: IComponentEditableAttributes,
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
	right?: Paperless.Interfaces.IDrawableAttributes,
}

export interface IDrawableUIDropzoneAttributes extends IEntityCoreDrawableAttributes
{
	content?: string,
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
}

export interface IDrawableUIDrawioAttributes extends IEntityCoreDrawableAttributes
{
	content?: string,
	artwork?: Paperless.Interfaces.IDrawableArtworkAttributes
}

export interface IDrawableUICodemirrorAttributes extends IEntityCoreDrawableAttributes
{
	content?: string,
	maxchar?: number,
	maxline?: number,
	firstline?: number,
	tabsize?: number,
	language?: string,
	padding?: number,
	cursor?: IDrawableCursorAttributes
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
}

export interface IDrawableUIGanttAttributes extends IEntityCoreDrawableAttributes
{
	chart?: string
}

export interface IDrawableUIMindmapAttributes extends IEntityCoreDrawableAttributes
{
	map?: string
}

export interface IDrawableUIWhiteboardAttributes extends IEntityCoreDrawableAttributes
{
	board?: string
	content?: string,
	artwork?: Paperless.Interfaces.IDrawableArtworkAttributes
}

export interface IDropzoneFile
{
	name: string,
	type: string,
	size: number,
	modified: number,
	data?: Uint8Array
}

export interface IDrawio
{
	context?: Paperless.Context,
	diagram?: string,
	onSave?: (diagram: string) => Promise<void>,
	nopng?: boolean,
	palette?: {
		black: string,
		grey0: string,
		grey1: string,
		grey2: string,
		grey3: string,
		pink: string,
		blue: string,
		orange: string,
		green: string,
		yellow: string,
	},
	popup?: IComponentPopupAttributes
}

export interface ICodemirror
{
	context?: Paperless.Context,
	name?: string,
	language?: string,
	snippet?: string,
	onSave?: (snippet: string) => Promise<void>,
	palette?: {
		black: string,
		grey0: string,
		grey1: string,
		grey2: string,
		grey3: string,
		pink: string,
		blue: string,
		orange: string,
		green: string,
		yellow: string,
	},
	popup?: IComponentPopupAttributes
}

export interface IGantt
{
	context?: Paperless.Context,
	name?: string,
	chart?: string,
	onSave?: (chart: string) => Promise<void>,
	palette?: {
		black: string,
		grey0: string,
		grey1: string,
		grey2: string,
		grey3: string,
		pink: string,
		blue: string,
		orange: string,
		green: string,
		yellow: string,
	},
	popup?: IComponentPopupAttributes
}

export interface IMindmap
{
	context?: Paperless.Context,
	name?: string,
	map?: string,
	onSave?: (chart: string) => Promise<void>,
	palette?: {
		black: string,
		grey0: string,
		grey1: string,
		grey2: string,
		grey3: string,
		pink: string,
		blue: string,
		orange: string,
		green: string,
		yellow: string,
	},
	popup?: IComponentPopupAttributes
}

export interface IWhiteboard
{
	context?: Paperless.Context,
	name?: string,
	board?: string,
	onSave?: (data: {board: string, png: string}) => Promise<void>,
	nopng?: boolean,
	palette?: {
		black: string,
		grey0: string,
		grey1: string,
		grey2: string,
		grey3: string,
		pink: string,
		blue: string,
		orange: string,
		green: string,
		yellow: string,
	},
	popup?: IComponentPopupAttributes
}

export interface IEditableRestrict
{
	numeric: RegExp,
	alphabetic: RegExp,
	alphanumeric: RegExp,
	email?: RegExp,
	phone?: RegExp,
	website?: RegExp,
	password?: RegExp,
	string?: RegExp,

}

export interface IFormUITemplate
{
	button?: IDrawableUIButtonAttributes,
	editable?: IDrawableUIEditableAttributes,
	label?: IDrawableUILabelAttributes,
	artwork?: IDrawableUIArtworkAttributes,
	texmage?: IDrawableUITexmageAttributes,
	separator?: IDrawableUISeparatorAttributes,
	empty?: IDrawableUIEmptyAttributes,
	field?: IDrawableUIFieldAttributes,
	dropzone?: IDrawableUIDropzoneAttributes,
	drawio?: IDrawableUIDrawioAttributes,
	gantt?: IDrawableUIGanttAttributes,
	mindmap?: IDrawableUIMindmapAttributes,
	whiteboard?: IDrawableUIWhiteboardAttributes,
	//codemirror?: IDrawableUICodemirrorAttributes
}

