import { Component, Input, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
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
    private titleService: Title
  ) {
    this.lists = listService.GetAll();
  }

  ngOnInit() {
    this.lists = this.listService.GetAll();
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Mes listes");
  }

  async presentModalList() {
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

  deleteList(list: List) {
    this.listService.Delete(list);
  }

  toggleColourTheme(event) {
    if (event.detail.checked) {
      document.body.setAttribute("color-theme", "dark");
    } else {
      document.body.setAttribute("color-theme", "light");
    }
  }
}
