import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  constructor(private loadingController: LoadingController) {}

  public async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: "dots",
    });
    return loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  public async dismissLoading() {
    await this.loadingController.dismiss();
    console.log("Loading dismissed!");
  }
}
