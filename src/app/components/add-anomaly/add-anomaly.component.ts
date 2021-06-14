import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AnomalyModel} from "../../models/anomaly.model";
import {AnomalyService} from "../../services/anomaly.service";

@Component({
  selector: 'app-add-anomaly',
  templateUrl: './add-anomaly.component.html',
  styleUrls: ['./add-anomaly.component.scss']
})
export class AddAnomalyComponent implements OnInit {

  anomalyForm: FormGroup;
  title: any='異常を追加'; //Add anomaly
  errorMessage: any='フォームに記入してください'; //Please fill up the form
  anomaly: AnomalyModel;
  hasFormErrors: boolean;
  viewOrEdit = "";

  constructor(
      private formBuilder: FormBuilder,
      private anomalyService: AnomalyService,
      private dialogRef: MatDialogRef<AddAnomalyComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.anomaly = this.data['anomaly'];
    this.viewOrEdit = this.data['type'];
    if (this.anomaly){
      if(this.viewOrEdit == 'edit'){
        this.title = '異常の編集' //Edit anomaly
      } else if(this.viewOrEdit == 'view') {
        this.title = '異常を見る' //View anomaly
      }
    } else {
      this.anomaly = new AnomalyModel()
    }
    this.createForm();
  }

  createForm(){
    this.anomalyForm = this.formBuilder.group({
      title: [{value: this.anomaly.title, disabled: this.viewOrEdit == 'view' ? true : false}, Validators.required],
      anomalyType: [{value: this.anomaly.anomalyType, disabled: this.viewOrEdit == 'view' ? true : false}, Validators.required]
    });
  }

  saveAnomaly(){
    this.hasFormErrors = false;
    const controls = this.anomalyForm.controls;
    if (this.anomalyForm.invalid) {
      Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.errorMessage = 'フォームに記入してください'; //Please fill up the form
      return;
    }
    let newAnomaly = new AnomalyModel();
    
    newAnomaly.title = this.anomalyForm.controls.title.value;
    newAnomaly.anomalyType = this.anomalyForm.controls.anomalyType.value;
    

    if (this.anomaly.id){
      newAnomaly.id = this.anomaly.id;
      newAnomaly.updatedAt = new Date();      
      this.anomalyService.editAnomaly(this.anomaly.id, newAnomaly).subscribe((anomaly)=>{
        this.dialogRef.close(123);
      })
    } else {
      newAnomaly.createdAt = new Date();
      newAnomaly.updatedAt = new Date();
      this.anomalyService.createAnomaly(newAnomaly).subscribe((anomaly)=>{
        this.dialogRef.close(123);
      })
    }
  }

}
