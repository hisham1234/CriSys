import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageModel} from "../../models/image.model";
import {ImageService} from "../../services/image.service";
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
  import { Optional } from '@angular/core'; 
import * as e from 'express';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

  images: ImageModel[];
  selectedImages = []
  loading = true;
  public type: string = 'component';
  @Input() IsGalleryScreen:boolean;
  fileToUpload: FormData;  
  fileUpload: any;  
  fileUpoadInitiated: boolean; 
  public disabled: boolean = false;

  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;

  
  constructor(
    private imageService: ImageService,
    @Optional() private dialogRef: MatDialogRef<ImageDialogComponent>,
    @Optional()  @Inject(MAT_DIALOG_DATA) public data?: any
  ) {

    if(this.IsGalleryScreen)
      this.dialogRef.disableClose =true;
  }
  

  ngOnInit(): void {
    debugger;
    this.selectedImages =(this.IsGalleryScreen?[]:this.data) 
    this.getAllImages();
  }

  getAllImages(){
    this.loading = true;
    //debugger;
    this.imageService.getAllImages().subscribe(res => {
      //debugger;
        this.images = res['response'];
        this.loading = false;
    })
  }
  clearSelection(){
    this.selectedImages=[];
  }


   selectImage(image){
     //debugger;
        let indexToRemove = this.selectedImages.findIndex(im => im.id == image.id);
        if (indexToRemove!== undefined && indexToRemove !== -1) {
            this.selectedImages.splice(indexToRemove, 1);
        } else {
            this.selectedImages.push(image);
        }
   }

    selectedImageCSS(image){
        if(this.selectedImages.find(im => im.id == image.id)){
            return true
        } else {
            return false;
        }
    }

    closeDialog(){
        this.dialogRef.close({data:this.selectedImages});
    }

    addFile() {  
        
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
               //this.selectedLibraryImages.push(response.response);
               this.getAllImages();
               console.log("done");
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
  
    

    DownloadAll(){
      
      for (var i in this.selectedImages) { 
        window.open(this.selectedImages[i].url,'_blank')       
      }
      
    }

  onScrollEvent(event: any): void {
  }

}


