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
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { AnomalyService } from 'src/app/services/anomaly.service';



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
	errorMessage = $localize `Please Fill up the form`;
	hasFormErrors: boolean;
	private sub: any;
	anomalyId: number;
    anomalyName: string;
	reportId: any;
	report: ReportModel;
	loading = false;
	//files: string[] = [];  
    fileToUpload: FormData;  
    fileUpload: any;  
    fileUpoadInitiated: boolean; 
    btnAzure=$localize `Select From Azure`
	btnSave=$localize`Save`
	titleAnomaly=$localize`List Of Anomaly`
	titleReport=$localize`List Of Reports`

  	isButtonDisabled = false;
  	formActionText = '';

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
		private anomalyService:AnomalyService,
        private eventEmitterService: EventEmitterService
	) {
		this.getScreenSize();
	}

	ngOnInit(): void {
		
		this.sub = this.route.params.subscribe(params => {
			this.anomalyId = params['aid']; // (+) converts string 'id' to a number
			this.reportId = params['rid']; // (+) converts string 'id' to a number
			//this.anomalyName = params['aname']
      if (this.reportId !== 'add') {
				this.title = $localize`Edit Report`;
				this.getReport();
			}
		});
		this.getAnomalyName();
		this.createForm();
	}

	getAnomalyName(){
		this.anomalyService.getAnomaly(this.anomalyId).subscribe((res)=>{		
		  this.anomalyName=res['response'].title;		 
		})
	  }

	createForm() {
		this.reportForm = this.formBuilder.group({
			title: [''],
			latitude: [''],
			longitude: [''],
			kp: ['',],
			road: [''],
			comment:['']
		});
	}

	fillUpForm() {
		this.reportForm = this.formBuilder.group({
			title: [this.report.title ? this.report.title : '', Validators.required],
			latitude: [this.report.latitude ? this.report.latitude : '', Validators.required],
			longitude: [this.report.longitude ? this.report.longitude : '', Validators.required],
			kp: [this.report.kp ? this.report.kp : '',],
			road: [this.report.road ? this.report.road : ''],
			comment: [this.report.comment ? this.report.comment : '']
		});
	}

	getReport() {
		this.loading = true;
		this.reportService.getReport(this.reportId).subscribe(res => {
			this.report = res["response"];
           
			if (this.report.anomalyReportImage) {
				
				this.selectedLibraryImages = this.report.anomalyReportImage.map(i => i.image);
			}
			this.fillUpForm();
			this.loading = false;
		})
	}

	addFile() {  
		//if (!this.fileUpoadInitiated) {  
		  document.getElementById('fileUpload').click();  
		  
	  }
	  handleFileInput(files: any) {  
		  
		let formData: FormData = new FormData();  
		formData.append("imageFile", files[0],files[0].name);  
		
		this.fileToUpload = formData;  
		this.onUploadFiles();  
	
	  }
	  
	  onUploadFiles() { 
		   
		 
		if (this.fileToUpload == undefined) {  
		  this.fileUpoadInitiated = false;  
		  return false;  
		}  
		else {  
			
		  return this.imageService.createImage(this.fileToUpload)  
			.subscribe((response: any) => {  
			  this.fileUpoadInitiated = false;  
			  this.fileUpload = ''; 
			   
			  if (response) {  							
			   this.selectedLibraryImages.push(response.response);
			  }  
			  else {  
				alert('Error occured!');  
				this.fileUpoadInitiated = false;  
			  }  
			},  
			  err => console.log(err),  
			);  
	  
		}  
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

  checkFormHasErrors(formControls: any): boolean {
    if (
      formControls['title'].value === '' ||
      formControls['latitude'].value === '' ||
      formControls['longitude'].value === ''
    ) {
      this.hasFormErrors = true;
      this.isButtonDisabled = false;
      return true;
    } else {
      return false;
    }
  }

	saveReport() {
		
		if (this.reportId !== 'add') {
        this.formActionText = $localize`Updating...`;
			let editedReport = new ReportModel();
			Object.assign(editedReport, this.report);
			let formControls = this.reportForm.controls;
		
      if (this.checkFormHasErrors(formControls)) {
        return;
      }
    
            editedReport.title = formControls['title'].value;
			editedReport.latitude = formControls['latitude'].value;
			editedReport.longitude = formControls['longitude'].value;
			editedReport.kp = formControls['kp'].value;
			editedReport.road = formControls['road'].value;
			editedReport.comment =formControls['comment'].value;

			let selectedLibraryImageIds = this.selectedLibraryImages.map( image => image.id);

			let anomalyReportImageDatas = {
				anomalyReportId : this.report.id,
				imageIds : selectedLibraryImageIds
			}			

			this.loading = true;
			this.reportService.editReport(editedReport.id, editedReport).subscribe((res) => {
				if (res) {
					this.imageService.createOrUpdateAnomalyReportImageWithImageIds(anomalyReportImageDatas)
						.subscribe((r) => {
							console.log(r);
							
						});
				
					this.loading = false;
					let message = "新しいイベントが追加されました";
					this._snackBar.open(message, 'OK', {
						duration: 2000
					});
				}
        this.hasFormErrors = false;
        this.eventEmitterService.sendClickEvent();
        this.redirectTo(`anomaly/${this.anomalyId}/report`);
			})
      
		}
		else {
      this.isButtonDisabled = true;
      this.formActionText = $localize`Saving...`;

			let formControls = this.reportForm.controls;
      if (this.checkFormHasErrors(formControls)) {
        setTimeout(() => {
          this.hasFormErrors = false;
        }, 2000)
        return;
      }
			let newReport = new ReportModel();
			newReport.anomalyId = this.anomalyId;
			newReport.title = formControls['title'].value;
			newReport.latitude = formControls['latitude'].value;
			newReport.longitude = formControls['longitude'].value;
			newReport.kp = formControls['kp'].value;
			newReport.road = formControls['road'].value;
			newReport.comment = formControls['comment'].value;

			//newReport.anomelyReportImage = this.selectedLibraryImages;
			let selectedLibraryImageIds = this.selectedLibraryImages.map( image => image.id);

			
			this.loading = true;

			this.reportService.createReport(newReport).subscribe((res:any) => {
				if (res) {
                   let anomalyReportImageDatas = {
				anomalyReportId : res.response.id,
				imageIds : selectedLibraryImageIds
			}

					this.imageService.createOrUpdateAnomalyReportImageWithImageIds(anomalyReportImageDatas)
						.subscribe((r) => {
							console.log(r);
							
						});
					
					this.loading = false;
					let message = "新しいイベントが追加されました";
					this._snackBar.open(message, 'OK', {
						duration: 2000
					});
          this.eventEmitterService.sendClickEvent();
          this.redirectTo(`anomaly/${this.anomalyId}/report`);
				}
			})
		}
	}
  redirectTo(uri: string) {
     this.router.navigate([uri]); //.then(() => this.router.navigate([uri]));
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
