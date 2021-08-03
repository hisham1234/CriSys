import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AnomalyModel} from "../../models/anomaly.model";
import {AnomalyService} from "../../services/anomaly.service";
export interface DistasterType {
  value: string;
  viewValue: string;
  icon : string
}
@Component({
  selector: 'app-add-anomaly',
  templateUrl: './add-anomaly.component.html',
  styleUrls: ['./add-anomaly.component.scss']
})
export class AddAnomalyComponent implements OnInit {
  selectedValue: string;
  selectTypeText= $localize `Anomaly Type`;
  distasterTypes: DistasterType[] = [
    {value: '自然災害', viewValue: '自然災害', icon :"disasters"},
    {value: '地震', viewValue: '地震', icon :"earthquake"},
    {value: '事故等', viewValue: '事故等', icon :"accident"},
    {value: '異常降雨', viewValue: '異常降雨', icon :"rain"},
    {value: '強風', viewValue: '強風', icon :"wind"},
    {value: '豪雪', viewValue: '豪雪', icon :"snowfall"},
    {value: '火山災害', viewValue: '火山災害', icon :"volcanic"},
    {value: '原子力災害', viewValue: '原子力災害', icon :"nuclear"},
    {value: 'テロ等', viewValue: 'テロ等', icon :"terrorism"},
    {value: 'その他', viewValue: 'その他', icon :"others"},
    {value: '会計検査', viewValue: '会計検査', icon :"audit"},
  ];
  anomalyForm: FormGroup;
  title: any='異常を追加'; //Add anomaly
  errorMessage=$localize `Please Fill Up the details`; //Please fill up the form
  anomaly: AnomalyModel;
  hasFormErrors: boolean;
  viewOrEdit = "";
  btnText=$localize `Save`
  isButtonDisabled = false;
  txtSaving = '';
  constructor(
      private formBuilder: FormBuilder,
      private anomalyService: AnomalyService,
      private dialogRef: MatDialogRef<AddAnomalyComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    
    if(this.data){
      this.anomaly = this.data['anomaly'];
    this.viewOrEdit = this.data['type'];
    if (this.anomaly){
      if(this.viewOrEdit == 'edit'){
        this.title = '異常の編集' //Edit anomaly
      } else if(this.viewOrEdit == 'view') {
        this.title = '異常を見る' //View anomaly
      }
    } 
  }else {
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
    this.isButtonDisabled = true;
    this.hasFormErrors = false;
    const controls = this.anomalyForm.controls;
    if (this.anomalyForm.invalid) {
      Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.errorMessage = $localize `Please Fill up the form`; //Please fill up the form
      setTimeout(() => {
        this.hasFormErrors = false;
      }, 2000)
      
      this.isButtonDisabled = false;     
      return;
    }
    let newAnomaly = new AnomalyModel();
    
    newAnomaly.title = this.anomalyForm.controls.title.value;
    newAnomaly.anomalyType = this.anomalyForm.controls.anomalyType.value;
    

    if (this.anomaly.id){
      this.txtSaving = $localize`Updating...`;
      newAnomaly.id = this.anomaly.id;
      newAnomaly.updatedAt = new Date();      
      this.anomalyService.editAnomaly(this.anomaly.id, newAnomaly).subscribe((anomaly)=>{
        this.dialogRef.close(123);
      })
    } else {
      this.txtSaving = $localize`Saving...`;
      newAnomaly.createdAt = new Date();
      newAnomaly.updatedAt = new Date();
      this.anomalyService.createAnomaly(newAnomaly).subscribe((anomaly)=>{
        this.dialogRef.close(123);
      })
    }
   
  }

}
