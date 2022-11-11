import * as Paperless from '@zone09.net/paperless';



export interface IComponentSelectorAttributes 
{
	padding?: {top?: number, bottom?: number, left?: number, right?: number},
	spacing?: number,
}

export interface IComponentSelectorAlignAttributes
{
	align?: Paperless.Enums.Align.Horizontal | Paperless.Enums.Align.Vertical,
	isolated?: number,
	bypass?: boolean,
	disableisolated?: boolean,
	duration?: { 
		fade?: number,
		shift?: number,
	},
	direction?: {
		fadeout?: Paperless.Enums.Direction,
		fadein?: Paperless.Enums.Direction,
		shift?: Paperless.Enums.Direction,
	}
}
