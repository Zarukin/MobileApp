import { Component, Input, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { List } from "src/app/models/list";
import { Todo } from "src/app/models/todo";
import { ListService } from "src/app/services/list.service";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";

@Component({
  selector: "app-todo-details",
  templateUrl: "./todo-details.page.html",
  styleUrls: ["./todo-details.page.scss"],
})
export class TodoDetailsPage implements OnInit {
  public todo: Todo;
  public parentList: List;
  public user: firebase.User;
  public isDisabled: boolean;
  public isReadonly: boolean;

  constructor(
    public route: ActivatedRoute,
    public listServices: ListService,
    private auth: AngularFireAuth,
    private titleService: Title,
    private afs: AngularFirestore
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    let listId;
    this.route.queryParams.subscribe((params) => {
      listId = params['list'];
    });
    this.parentList = this.listServices.GetOne(listId);
    console.log(this.parentList);
    this.todo = this.listServices.GetTodo(id, this.parentList);
    console.log(this.todo);
    this.user = await this.auth.currentUser;
    this.shouldDisable();
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Détail de la tâche");
  }

  updateDescription(e) {
    this.todo.description = e.currentTarget.value;
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({ description: this.todo.description });
  }

  updateName(e) {
    this.todo.name = e.currentTarget.value;
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({ name: this.todo.name });
  }

  updateIsDone(e) {
    if (this.user !== undefined  && this.parentList.canRead.indexOf(this.user.email) === -1){
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({ isDone: !this.todo.isDone });
    }
  }

  shouldDisable() {
    if (this.user !== undefined && this.parentList.canRead.indexOf(this.user.email) === -1) {
      this.isDisabled = false;
      this.isReadonly = false;
    } else {
      this.isDisabled = true;
      this.isReadonly = true;
    }
  }
}
