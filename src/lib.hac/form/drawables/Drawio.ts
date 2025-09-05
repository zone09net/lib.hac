import {IDrawableUIDrawioAttributes} from '../interfaces/IUI.js';
import {Artwork} from './Artwork.js';



export class Drawio extends Artwork
{
	private _diagram: string = undefined;
	private _svg: string = undefined;
	//---

	public constructor(attributes: IDrawableUIDrawioAttributes)
	{
		super({
			...attributes,
			artwork: { 
				...attributes.artwork,
				...{
					content: attributes.svg != undefined ? 'data:image/svg+xml;base64,' + btoa(attributes.svg) : (attributes.content ? attributes.content : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAC0XRFWHRteGZpbGUAJTNDbXhmaWxlJTIwaG9zdCUzRCUyMmVtYmVkLmRpYWdyYW1zLm5ldCUyMiUyMG1vZGlmaWVkJTNEJTIyMjAyMS0wMy0wNlQwMyUzQTMyJTNBMjkuNTM4WiUyMiUyMGFnZW50JTNEJTIyNS4wJTIwKFdpbmRvd3MlMjBOVCUyMDEwLjAlM0IlMjBXaW42NCUzQiUyMHg2NCklMjBBcHBsZVdlYktpdCUyRjUzNy4zNiUyMChLSFRNTCUyQyUyMGxpa2UlMjBHZWNrbyklMjBDaHJvbWUlMkY4MS4wLjQwNDQuMTM4JTIwU2FmYXJpJTJGNTM3LjM2JTIyJTIwZXRhZyUzRCUyMjBzeUFEb3FLd096VTRfZl84Z1pwJTIyJTIwdmVyc2lvbiUzRCUyMjE0LjQuNCUyMiUyMHR5cGUlM0QlMjJlbWJlZCUyMiUzRSUzQ2RpYWdyYW0lMjBpZCUzRCUyMmVtWVJTRERSa0RQMllkM0VaeTNyJTIyJTIwbmFtZSUzRCUyMlBhZ2UtMSUyMiUzRWRkSEJFb0lnRUFEUXIlMkJHdU1GTjVOcXRMSnclMkJkU1RabFF0WkJITFd2VHdjWVk2b0xBMjkzMkYwZ0xHJTJCbnMlMkJGZGMwVUJpdEJFVElRZENhWFpQbG5XRldZSGg1UTZxSTBVanBJTlN2a0NoMm5RUVFyb3ZUbXlpTXJLTHNZS3RZYktSc2FOd1RGT2U2Q0txM2E4aGloamhiTGk2bHR2VXRqR1QwRjNtMTlBMWsyb25PNHlGN256NmxrYkhMU3ZwMUdEaTdROFhPTjc2QnN1Y1B3Z1ZoQ1dHMFRyZHUyVWcxcGZOWDZ4MDUlMkJvYjdtM2N4Z2k5R3BBMng4M0xKdXQySEtJJTJGcElWYnclM0QlM0QlM0MlMkZkaWFncmFtJTNFJTNDJTJGbXhmaWxlJTNFCTg1HwAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC'),
				}
			},
		});
		
		const {
			diagram = undefined,
			svg = undefined,
		} = attributes;

		this._diagram = diagram;
		this._svg = svg;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get diagram(): string
	{
		return this._diagram;
	}
	public set diagram(diagram: string)
	{
		this._diagram = diagram;
	}

	public get svg(): string
	{
		return this._svg;
	}
	public set svg(svg: string)
	{
		this._svg = svg;
	}
}

