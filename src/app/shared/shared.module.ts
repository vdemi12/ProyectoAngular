import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupSelectableComponent } from './components/serie-selectable/serie-selectable.component';
import { PictureSelectableComponent } from './components/picture-selectable/picture-selectable.component';
import { PersonModalComponent } from './components/season-modal/season-modal.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    PersonModalComponent, 
    GroupSelectableComponent, 
    PictureSelectableComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    PersonModalComponent, 
    GroupSelectableComponent, 
    PictureSelectableComponent
  ]
})
export class SharedModule { }
