import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { QueryParamsModel } from "../../models/query-param.model";
import { ReportService } from "../../services/report.service";
import { ImageModel } from "../../models/image.model";
import { RouterExtService } from "../../services/router-ext.service";
import { ReportModel } from "../../models/report.model";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Routes, RouterModule, ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { HostListener } from "@angular/core";
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ImageService } from 'src/app/services/image.service';



@Component({
	selector: 'app-add-report',
	templateUrl: './add-report.component.html',
	styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit {
	// Declare height and width variables
	scrHeight: any;
	scrWidth: any;
	selectedLibraryImages = [];

	reportForm: FormGroup;
	title: any = 'イベントを追加';
	errorMessage: any = 'フォームに記入してください';
	hasFormErrors: boolean;
	private sub: any;
	anomalyId: number;
	reportId: any;
	report: ReportModel;
	loading = false;

	public files: NgxFileDropEntry[] = [];


	constructor(
		private formBuilder: FormBuilder,
		private reportService: ReportService,
		private imageService: ImageService,
		private routerExtService: RouterExtService,
		private router: Router,
		private route: ActivatedRoute,
		public dialog: MatDialog,
		private _snackBar: MatSnackBar,
	) {
		this.getScreenSize();
	}

	ngOnInit(): void {

		this.sub = this.route.params.subscribe(params => {
			this.anomalyId = params['aid']; // (+) converts string 'id' to a number
			this.reportId = params['rid']; // (+) converts string 'id' to a number
			if (this.reportId !== 'add') {
				this.title = 'イベントの編集';
				this.getReport();
			}
		});

		this.createForm();
	}

	createForm() {
		this.reportForm = this.formBuilder.group({
			title: [''],
			latitude: [''],
			longitude: [''],
			kp: ['',],
			road: ['']
		});
	}

	fillUpForm() {
		this.reportForm = this.formBuilder.group({
			title: [this.report.title ? this.report.title : '', Validators.required],
			latitude: [this.report.latitude ? this.report.latitude : '', Validators.required],
			longitude: [this.report.longitude ? this.report.longitude : '', Validators.required],
			kp: [this.report.kp ? this.report.kp : '',],
			road: [this.report.road ? this.report.road : '']
		});
	}

	getReport() {
		this.loading = true;
		this.reportService.getReport(this.reportId).subscribe(res => {
			this.report = res["response"];

			if (this.report.anomelyReportImage) {
				this.selectedLibraryImages = this.report.anomelyReportImage.map(i => i.image);
			}
			this.fillUpForm();
			this.loading = false;
		})
	}

	openImageDialog() {
		let width = this.scrWidth - (this.scrWidth * .2);
		let height = this.scrHeight - (this.scrHeight * .2);

		const dialogRef = this.dialog.open(ImageDialogComponent,
			{
				width: width.toString() + 'px',
				height: height.toString() + 'px',
				data: this.selectedLibraryImages
			}
		);
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.selectedLibraryImages = res['data'];
				// 				this.getReport();
				let message = "新しいイベントが追加されました";
				//                 this._snackBar.open(message, 'OK', {
				//                     duration: 2000
				//                 });
			}
		});
	}

	showImage(selectedLibraryImage) {
		const dialogRef = this.dialog.open(ImageCarouselComponent, { data: [selectedLibraryImage], width: '700px' });
		dialogRef.afterClosed().subscribe(res => {
		});

	}

	saveReport() {
		if (this.reportId !== 'add') {
			let editedReport = new ReportModel();
			Object.assign(editedReport, this.report);
			let formControls = this.reportForm.controls;
			editedReport.title = formControls['title'].value;
			editedReport.latitude = formControls['latitude'].value;
			editedReport.longitude = formControls['longitude'].value;
			editedReport.kp = formControls['kp'].value;
			editedReport.road = formControls['road'].value;

			console.log(this.selectedLibraryImages);
			let selectedLibraryImageIds = this.selectedLibraryImages.map( image => image.id);
			console.log(selectedLibraryImageIds);

			let anomalyReportImageDatas = {
				anomalyReportId : this.report.id,
				imageIds : selectedLibraryImageIds
			}
			

			this.loading = true;
			this.reportService.editReport(editedReport.id, editedReport).subscribe((res) => {
				if (res) {
					// this.imageService.createOrUpdateAnomalyReportImageWithImageIds(anomalyReportImageDatas)
					// 	.subscribe((r) => {
					// 		console.log(r);
							
					// 	});
					if(res["statusCode"] ==200){


						for (const droppedFile of this.files) {

							// Is it a file?
							if (droppedFile.fileEntry.isFile) {
					
							  const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
							  fileEntry.file((file: File) => {
									
									let formData = new FormData();
									formData.append(`imageFile`, file, file.name);
									formData.append('fileName', file.name);

									console.log(formData);
									

									this.imageService.createAnomalyReportImage(formData, res["response"]["id"]);

								  });									
								  }
								} 
					}
					
					this.loading = false;
					let message = "新しいイベントが追加されました";
					this._snackBar.open(message, 'OK', {
						duration: 2000
					});
				}
			})
		}
		else {
			let formControls = this.reportForm.controls;
			let newReport = new ReportModel();
			newReport.anomalyId = this.anomalyId;
			newReport.title = formControls['title'].value;
			newReport.latitude = formControls['latitude'].value;
			newReport.longitude = formControls['longitude'].value;
			newReport.kp = formControls['kp'].value;
			newReport.road = formControls['road'].value;

			newReport.anomelyReportImage = this.selectedLibraryImages.map(image => image.id);

			this.loading = true;

			this.reportService.createReport(newReport).subscribe((res) => {
				if (res) {
					this.loading = false;
					let message = "新しいイベントが追加されました";
					this._snackBar.open(message, 'OK', {
						duration: 2000
					});
				}
			})
		}
	}

	goToPrevRoute() {
		let preRoute = this.routerExtService.getPreviousUrl();
		return preRoute;
	}

	deleteSelectedImage(image) {
		let indexToRemove = this.selectedLibraryImages.findIndex(im => im.id == image.id);
		if (indexToRemove !== undefined && indexToRemove !== -1) {
			this.selectedLibraryImages.splice(indexToRemove, 1);
		}
	}

	@HostListener('window:resize', ['$report'])
	getScreenSize(report?) {
		this.scrHeight = window.innerHeight;
		this.scrWidth = window.innerWidth;
	}

	dropped(files: NgxFileDropEntry[]) {
		files.forEach(outerFile => {
			if (outerFile.fileEntry.name) {
				let found = this.files.find(innerFile => {
					return innerFile['fileEntry']['name'] == outerFile['fileEntry']['name']
				});
				if (!found) {
					this.files.push(outerFile);
				}
			}
		})
	}

	removeFile(fileName) {
		let foundIndex = this.files.findIndex(element =>
			element['fileEntry']['name'] == fileName
		)
		if (foundIndex >= 0) {
			this.files.splice(foundIndex, 1);
		}
	}

	showImageUploadedFromPC(item) {
		const fileEntry = item.fileEntry as FileSystemFileEntry;
		const reader = new FileReader();
		fileEntry.file((file: File) => {
			reader.readAsDataURL(file);
			reader.onload = () => {
				let newImage = new ImageModel();
				newImage.url = reader.result;
				this.showImage(newImage);
			};
		});
	}


	fileOver(report) {
		console.log(report);
	}

	fileLeave(report) {
		console.log(report);
	}

}
