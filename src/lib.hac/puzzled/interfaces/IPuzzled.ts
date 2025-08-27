import * as Paperless from '@zone09.net/paperless';
import {EntityCoreControl} from '../controls/EntityCoreControl.js';
import {EntityCoreDrawable} from '../drawables/EntityCoreDrawable.js';
import {Puzzled} from '../components/Puzzled.js';



export interface IComponentPuzzledAttributes extends Paperless.Interfaces.IComponentAttributes 
{
	hop?: number,
	expandable?: {width?: boolean, height?: boolean},
	nostroke?: boolean,
	nofill?: boolean,
	linewidth?: number,
	spacing?: number,
	shadow?: number,
	alpha?: number,
	rounded?: {topLeft: number, topRight: number, bottomLeft: number, bottomRight: number},
	drawable?: typeof EntityCoreDrawable,
	control?: typeof EntityCoreControl,
	color?: {
		fill?: string,
		stroke?: string,
		marked?: string,
		iconshadow?: string, 
		move?: string,
		nomove?: string,
		sizer?: string,
		splitter?: string,
		highlight?: string,
		faked?: string,
	},

	onEntityLoading?: (entity: EntityCoreControl) => Promise<unknown>,
	onEntityLoaded?: (entity: EntityCoreControl) => void,
}

export interface IControlIconAttributes extends Paperless.Interfaces.IControlButtonAttributes
{
	puzzled?: Puzzled,
	entity?: EntityCoreControl
}

export interface IDrawableSizerAttributes extends Paperless.Interfaces.IDrawableCircleAttributes
{
	puzzled?: Puzzled,
}

export interface IDrawableSliderAttributes extends Paperless.Interfaces.IDrawableAttributes
{
	puzzled?: Puzzled,
}

export interface IDrawableSplitterAttributes extends Paperless.Interfaces.IDrawableAttributes
{
	puzzled?: Puzzled,
}

export interface IDrawableHighlightAttributes extends Paperless.Interfaces.IDrawableAttributes
{
	puzzled?: Puzzled,
}

export interface IEntityCoreDrawableAttributes extends Paperless.Interfaces.IDrawableAttributes
{
	puzzled?: Puzzled,
}

export interface IEntityCoreControlAttributes extends Paperless.Interfaces.IControlAttributes
{
	puzzled?: Puzzled,
	swappable?: boolean;
	expandable?: boolean;
	shrinkable?: boolean;
	splittable?: boolean;
	stackable?: boolean;
	minimum?: {width?: number, height?: number},

	onLoading?: (self?: EntityCoreControl) => Promise<unknown>,
	onLoaded?: (self?: EntityCoreControl) => void,
	onRemoving?: (self?: EntityCoreControl) => Promise<unknown>,
	onRemoved?: (self?: EntityCoreControl) => void,
	onMoving?: (point: Paperless.Point, self?: EntityCoreControl) => Promise<unknown>,
	onMoved?: (point: Paperless.Point, self?: EntityCoreControl) => void,
	onSwapping?: (point: Paperless.Point, self?: EntityCoreControl) => Promise<unknown>,
	onSwapped?: (point: Paperless.Point, self?: EntityCoreControl) => void,
	onMarked?: (self?: EntityCoreControl) => void,
	onUnmarked?: (self?: EntityCoreControl) => void,
	onSplitted?: (self?: EntityCoreControl) => void,
	onExpanded?: (self?: EntityCoreControl) => void,
	onShrinked?: (self?: EntityCoreControl) => void,
	onIconsDefault?: (self?: EntityCoreControl) => void,
	onIconsRefresh?: (self?: EntityCoreControl) => void,
	onCancel?: (self?: EntityCoreControl) => void,
}

export interface IComponentPuzzledEntity 
{
	point?: Paperless.Point, 
	size?: Paperless.Size,
	minimum?: {width?: number, height?: number},
	control?: typeof EntityCoreControl, 
	drawable?: typeof EntityCoreDrawable, 
	attributes?: any, 
	backdoor?: any, 
}

