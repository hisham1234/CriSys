export class QueryParamsModel {
	filter: any;
	sortOrder: string;
	sortField: string;
	pageNumber: number;
	pageSize: number;

	constructor(_filter: any, _sortOrder: string = 'asc', _sortField: string = '', _pageNumber: number = 0, _pageSize: number = 10) {
		this.filter = _filter;
		this.sortOrder = _sortOrder;
		this.sortField = _sortField;
		this.pageNumber = _pageNumber;
		this.pageSize = _pageSize;
	}
}
