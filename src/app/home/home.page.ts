import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { MenuController, ModalController } from "@ionic/angular";
import { Observable, Subscription } from "rxjs";
import { CreateListComponent } from "../modals/create-list/create-list.component";
import { List } from "../models/list";
import { ListService } from "../services/list.service";
import { LoadingService } from "../services/loading.service";
import { RoutingService } from "../services/routing.service";
import { ToastService } from "../services/toast.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy {
  @Input() lists: List[];
  darkMode = false;
  verifiedEmail: boolean;
  userSub: Subscription;
  private listsCollection: AngularFirestoreCollection<List>;
  listsObservable: Observable<List[]>;

  constructor(
    public listService: ListService,
    public router: Router,
    private titleService: Title,
    private auth: AngularFireAuth,
    public modalController: ModalController,
    private menuController: MenuController,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private routeService: RoutingService,
    private afs: AngularFirestore
  ) {

  }

  ngOnInit() {
    this.listsObservable = this.listService.GetAll();
    this.listsObservable.subscribe((lists) => {
      this.lists = lists;
      lists.forEach(element => {
        if (element.todos === undefined) {
          element.todos = [];
        }
      });
    });
    if (document.body.getAttribute("color-theme") === "light") {
      this.darkMode = false;
    } else if (document.body.getAttribute("color-theme") === "dark") {
      this.darkMode = true;
    }

    this.routeService.subscribeRoute();
    this.userSub = this.auth.user.subscribe((user) => {
      if (user) {
        this.verifiedEmail = user.emailVerified;
        console.log("Is the email verified ? " + this.verifiedEmail);
        if (
          !this.verifiedEmail &&
          this.routeService.getPreviousRoute() !== "/register"
        ) {
          // this.toastService.presentToastForEmailConfirmation();
        }
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Mes listes");
  }

  public async presentModalList() {
    const modal = await this.modalController.create({
      component: CreateListComponent,
      swipeToClose: true,
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().then((data) => {
      this.listsObservable = this.listService.GetAll();
    });
    return await modal.present();
  }

  public deleteList(list: List) {
    this.listService.Delete(list);
  }

  public toggleColourTheme() {
    if (this.darkMode === true) {
      document.body.setAttribute("color-theme", "dark");
    } else {
      document.body.setAttribute("color-theme", "light");
    }
  }

  public async logout() {
    this.menuController.close();
    await this.loadingService.presentLoading("Déconnexion…");
    await this.auth.signOut();
    await this.router.navigate(["/", "login"]);
    if (!this.verifiedEmail) {
      await this.toastService.dismissToast();
    }
    this.loadingService.dismissLoading();
  }

  doRefresh(event) {
    window.location.reload();
  }
}
