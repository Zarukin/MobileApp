import { Component, Input, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreateListComponent } from '../modals/create-list/create-list.component';
import { List } from '../models/list';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  @Input() lists:List[];


  constructor(public listService:ListService,public modalController: ModalController,public router:Router) {
    this.lists = listService.GetAll();
  }

  ngOnInit() {
      this.lists = this.listService.GetAll();
    }

  async presentModalList() {
    const modal = await this.modalController.create({
      component: CreateListComponent,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data=>{
      this.lists= this.listService.GetAll();
      });
    return await modal.present();
  }

   presentModalTodo(list:List) {
    this.router.navigateByUrl('list-details/'+list.id)
  }

  deleteList(list:List){
      this.listService.Delete(list)
  }
}
