import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

@Component({
  selector: 'app-gallery-screen',
  templateUrl: './gallery-screen.component.html',
  styleUrls: ['./gallery-screen.component.css']
})
export class GalleryScreenComponent implements OnInit {
  IsGalleryScreen=true;
  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
    /* let width = this.scrWidth - (this.scrWidth * .2);
		let height = this.scrHeight - (this.scrHeight * .2);
    const dialogRef = this.dialog.open(ImageDialogComponent,
			{
        
				width: width.toString() + 'px',
				height: height.toString() + 'px',
				data: {}
        
			
			}
		); */
  }

}
