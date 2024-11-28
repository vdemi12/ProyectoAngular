import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from 'src/app/core/models/serie.model';
import { Person } from 'src/app/core/models/season.model';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss'],
})
export class PersonModalComponent  implements OnInit {
  genders:string[] = ['Masculino', 'Femenino', 'Otros'];
  formGroup:FormGroup;
  mode:'new'|'edit' = 'new';
  isMobile: boolean = false;

  private _groups:BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  public groups$:Observable<Group[]> = this._groups.asObservable();

  @Input() set groups(groups:Group[]){
    this._groups.next(groups);
  }

  @Input() set person(_person:Person){
    if(_person && _person.id)
      this.mode = 'edit';
    
    this.formGroup.controls['name'].setValue(_person.name);
    this.formGroup.controls['surname'].setValue(_person.surname);
    this.formGroup.controls['age'].setValue(_person.age);
    this.formGroup.controls['gender'].setValue(_person.gender);
    this.formGroup.controls['email'].setValue(_person.email);
    this.formGroup.controls['groupId'].setValue(_person.groupId);
  }

  constructor(
    private fb:FormBuilder,
    private modalCtrl:ModalController,
    private platform: Platform
  ) { 
    this.isMobile = this.platform.is('ios') || this.platform.is('android');
    this.formGroup = this.fb.group({
      name:['', [Validators.required, Validators.minLength(2)]],
      surname:['', [Validators.required, Validators.minLength(2)]],
      email:['', [Validators.required, Validators.email]],
      gender:['', [Validators.required]],
      age:['', [Validators.pattern(/^\d+$/)]],
      groupId:[null, [Validators.required]]
    });
  }
  

  ngOnInit() {}

  get name(){
    return this.formGroup.controls['name'];
  }

  get surname(){
    return this.formGroup.controls['surname'];
  }

  get age(){
    return this.formGroup.controls['age'];
  }

  get email(){
    return this.formGroup.controls['email'];
  }

  get gender(){
    return this.formGroup.controls['gender'];
  }
  
  getDirtyValues(formGroup: FormGroup): any {
    const dirtyValues: any = {};
  
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control?.dirty) {
        dirtyValues[key] = control.value;
      }
    });
  
    return dirtyValues;
  }

  onSubmit(){
    if (this.formGroup.valid) {
      this.modalCtrl.dismiss(
          (this.mode=='new'?
            this.formGroup.value:
            this.getDirtyValues(this.formGroup)), this.mode
      );
    } else {
      console.log('Formulario inválido');
    }

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
