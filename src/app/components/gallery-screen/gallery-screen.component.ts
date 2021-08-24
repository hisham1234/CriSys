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
   
  }

}
