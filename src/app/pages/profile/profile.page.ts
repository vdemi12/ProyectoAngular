import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/core/models/auth.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  registerForm: FormGroup;
  user?: User | null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: BaseAuthenticationService,
    private mediaService: BaseMediaService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translateService: TranslateService
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      picture: ['']
    });
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      this.user = await this.authService.getCurrentUser();
      if (this.user) {
        this.registerForm.patchValue({
          username: this.user.username,
          name: this.user.name,
          surname: this.user.surname,
          email: this.user.email,
          picture: this.user.picture
        });
      }
    } catch (error) {
      console.error(error);
      const toast = await this.toastController.create({
        message: await lastValueFrom(this.translateService.get('COMMON.ERROR.LOAD')),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  async onSubmit() {
    if (this.registerForm.valid && this.user) {
      const loading = await this.loadingController.create();
      await loading.present();

      try {
        const updatedUser: Partial<User> = {};
        
        // Solo actualizar campos modificados
        Object.keys(this.registerForm.controls).forEach(key => {
          if (this.registerForm.get(key)?.dirty) {
            updatedUser[key as keyof User] = this.registerForm.get(key)?.value;
          }
        });

        // Manejo de imagen de perfil
        if (updatedUser.picture) {
          const base64Response = await fetch(updatedUser.picture);
          const blob = await base64Response.blob();
          const uploadedBlob = await lastValueFrom(this.mediaService.upload(blob));
        }

        // Llamar al método de actualización de usuario en tu servicio de autenticación
        await lastValueFrom(this.authService.updateUser(this.user.id, updatedUser));
        
        const toast = await this.toastController.create({
          message: await this.translateService.get('COMMON.SUCCESS.SAVE').toPromise(),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      } catch (error) {
        console.error(error);
        const toast = await this.toastController.create({
          message: await lastValueFrom(this.translateService.get('COMMON.ERROR.SAVE')),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      } finally {
        await loading.dismiss();
      }
    }
  }

  get username() {
    return this.registerForm.controls['username'];
  }

  get name(){
    return this.registerForm.controls['name'];
  }

  get surname(){
    return this.registerForm.controls['surname'];
  }

  get email(){
    return this.registerForm.controls['email'];
  }
}