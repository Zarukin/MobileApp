import { Component, Input, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { emailVerified } from "@angular/fire/auth-guard";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { LoadingController, MenuController, ModalController, ToastController } from "@ionic/angular";
import { CreateListComponent } from "../modals/create-list/create-list.component";
import { List } from "../models/list";
import { ListService } from "../services/list.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  @Input() lists: List[];
  darkMode = false;

  constructor(
    public listService: ListService,
    public modalController: ModalController,
    public router: Router,
    private titleService: Title,
    private auth: AngularFireAuth,
    public loadingController: LoadingController,
    private toastController: ToastController,
    private menuController: MenuController
  ) {
    this.lists = listService.GetAll();
  }

  ngOnInit() {
    this.lists = this.listService.GetAll();

    this.auth.user.subscribe((user) => {
      if (user) {
        const verifiedEmail = user.emailVerified;
        console.log("Is the email verified ? " + verifiedEmail);
        if (!verifiedEmail) {
          this.presentToastForEmailConfirmation();
        } else {
          this.dismissToast();
        }
      } else {
        this.dismissToast();
      }
    });
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Mes listes");
  }

  protected async presentModalList() {
    const modal = await this.modalController.create({
      component: CreateListComponent,
      swipeToClose: true,
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().then((data) => {
      this.lists = this.listService.GetAll();
    });
    return await modal.present();
  }

  private async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Déconnexion…",
      spinner: "dots",
      duration: 5000,
    });
    return loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  private async dismissLoading() {
    await this.loadingController.dismiss();
    console.log("dismissed");
  }

  private async presentToastForEmailConfirmation() {
    const toast = await this.toastController.create({
      header: "Courriel non vérifié",
      message:
        "Veuillez aller vérifier vos courriels pour confirmer votre adresse. Sans cela, vous ne pourrez pas réinitialiser votre mot de passe en cas de perte.",
      position: "bottom",
      color: "warning",
    });
    toast.present();
  }

  private async dismissToast() {
    try {
      if (this.toastController) {
        const dismissedToast =  await this.toastController.dismiss();
        console.log("toast dismissed ");
        return dismissedToast;
      }
    } catch (error) {
      console.error("The toast controller doesn't exist : " + error.message);
    }
  }

  protected deleteList(list: List) {
    this.listService.Delete(list);
  }

  protected toggleColourTheme(event) {
    if (event.detail.checked) {
      document.body.setAttribute("color-theme", "dark");
    } else {
      document.body.setAttribute("color-theme", "light");
    }
  }

  protected async logout() {
    this.menuController.close();
    await this.presentLoading();
    await this.auth.signOut();
    await this.router.navigate(["/", "login"]);
    this.dismissLoading();
  }
}
