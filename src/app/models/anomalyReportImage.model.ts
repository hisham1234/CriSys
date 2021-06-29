import { ImageModel } from "./image.model";

export class AnomalyReportImageModel {
	id: number;
	anomalyReportId: number;
	imageId: number;
	createdAt: Date;
	updatedAt: Date;
	image: ImageModel

	constructor() {
		this.id = undefined;
		this.anomalyReportId = undefined;
		this.imageId = undefined;
		this.createdAt = new Date;
		this.updatedAt = new Date;
			}
}
