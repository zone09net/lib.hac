import * as Paperless from '@zone09.net/paperless';



export interface IComponentPaletteAttributes extends Paperless.Interfaces.IComponentAttributes 
{
	fillcolor?: string,
	strokecolor?: string,
	radius?: number,
	spacing?: number,
	colors?: string[][],
	movable?: boolean,
	onColor?: (fillcolor: string, strokecolor: string) => void
}
