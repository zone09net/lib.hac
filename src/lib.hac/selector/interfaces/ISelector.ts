import * as Paperless from '@zone09.net/paperless';



export interface IComponentSelectorAttributes 
{
	padding?: Paperless.Interfaces.IPadding,
	spacing?: number,
}

export interface IComponentSelectorAlignAttributes
{
	restrict?: Paperless.Enums.Restrict.horizontal | Paperless.Enums.Restrict.vertical,
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
