import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageModel} from "../../models/image.model";
import {ImageService} from "../../services/image.service";
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';


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

  public disabled: boolean = false;

  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;


  constructor(
    private imageService: ImageService,
    private dialogRef: MatDialogRef<ImageDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.selectedImages = this.data;
    this.getAllImages();
  }

  getAllImages(){
    this.loading = true;
    this.imageService.getAllImages().subscribe(res => {
        this.images = res['response'];
        this.loading = false;
    })
  }


   selectImage(image){
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

  onScrollEvent(event: any): void {
  }

}
