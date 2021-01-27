import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CreateTodoComponent } from "src/app/modals/create-todo/create-todo.component";
import { List } from "src/app/models/list";
import { Todo } from "src/app/models/todo";
import { ListService } from "src/app/services/list.service";

@Component({
  selector: "app-list-details",
  templateUrl: "./list-details.page.html",
  styleUrls: ["./list-details.page.scss"],
})
export class ListDetailsPage implements OnInit {
  public list: List;

  constructor(
    public route: ActivatedRoute,
    public listServices: ListService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    var id = Number(this.route.snapshot.paramMap.get("id"));
    this.list = this.listServices.GetOne(id);
  }

  async presentModalTodo() {
    const modal = await this.modalController.create({
      component: CreateTodoComponent,
      swipeToClose: true,
      cssClass: "my-custom-class",
      componentProps: {
        list: this.list,
      },
    });
    return await modal.present();
  }

  deleteTodo(todo: Todo) {
    this.listServices.DeleteTodo(this.list, todo);
  }

  done(todoToChange: Todo, event) {
    var isChecked = event.currentTarget.checked;
    if (isChecked) {
      this.list.todos.find((todo) => todo === todoToChange).isDone = true;
    } else {
      this.list.todos.find((todo) => todo === todoToChange).isDone = false;
    }
  }
}
