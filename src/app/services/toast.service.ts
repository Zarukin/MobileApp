import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(private toastController: ToastController, private router: Router) {}

  public async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: "bottom",
      buttons: [
        {
          side: "end",
          text: "D'accord",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();
  }

  public async presentToastError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: "bottom",
      color: "danger",
      buttons: [
        {
          side: "end",
          text: "D'accord",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();
  }

  public async presentToastSuccess(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 10000,
      position: "bottom",
      color: "success",
      buttons: [
        {
          side: "end",
          text: "D'accord",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();
  }

  public async presentToastSuccessWithHeader(header: string, message: string) {
    const toast = await this.toastController.create({
      header,
      message,
      duration: 10000,
      position: "bottom",
      color: "success",
      buttons: [
        {
          side: "end",
          text: "D'accord",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();
  }

  public async presentToastForgotPassword() {
    const toast = await this.toastController.create({
      cssClass: "my-custom-toast",
      position: "top",
      buttons: [
        {
          side: "start",
          text: "Mot de passe oublié ?",
          handler: () => {
            console.log("Forgot password clicked YES");
            this.router.navigate(["/", "password-recovery"]);
          },
        },
        {
          side: "end",
          text: "Non",
          role: "cancel",
          handler: () => {
            console.log("Forgot password clicked NO");
          },
        },
      ],
    });
    toast.present();
  }

  public async presentToastSuccessSignUp() {
    const toast = await this.toastController.create({
      header: "Vous être maintenant enregistré !",
      message: "Veuillez aller vérifier vos courriels pour confirmer votre adresse.",
      position: "bottom",
      color: "success",
      duration: 10000,
      buttons: [
        {
          side: "end",
          text: "D'accord",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();

    const { role, data } = await toast.onDidDismiss();
    console.log("Toast dismissed!");
  }

  // Non utilisé actuellement
  public async presentToastForEmailConfirmation() {
    const toast = await this.toastController.create({
      header: "Courriel non vérifié",
      message:
        "Veuillez aller vérifier vos courriels pour confirmer votre adresse. Sans cela, vous ne pourrez pas réinitialiser votre mot de passe en cas de perte.",
      position: "bottom",
      color: "warning",
    });
    toast.present();
  }

  public async dismissToast() {
    try {
      const dismissedToast = await this.toastController.dismiss();
      console.log("toast dismissed");
      return dismissedToast;
    } catch (error) {
      console.error("The toast controller doesn't exist : " + error.message);
    }
  }

  // Example de code pour supprimer tous les toasts présents.
  /** const toastToDismiss = await this.toastController.getTop();
   *  while (toastToDismiss !== undefined) {
   *    await this.toastController.dismiss();
   *    console.log("toast dismissed : " + toastToDismiss);
   *  }
   */
}
