import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { List } from "src/app/models/list";
import { Todo } from "src/app/models/todo";
import { ListService } from "src/app/services/list.service";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";

@Component({
  selector: "app-todo-details",
  templateUrl: "./todo-details.page.html",
  styleUrls: ["./todo-details.page.scss"],
})
export class TodoDetailsPage implements OnInit {
  public todo: Todo;
  public parentList: List;

  constructor(
    public route: ActivatedRoute,
    public listServices: ListService,
    private titleService: Title,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.todo = this.listServices.GetTodo(id).todo;
    this.parentList = this.listServices.GetTodo(id).currentList;
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Détail de la tâche");
  }

  updateDescription(e) {
    this.todo.description = e.currentTarget.value;
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({description: this.todo.description});
  }

  updateName(e) {
    this.todo.name = e.currentTarget.value;
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({name: this.todo.name});
  }
}
