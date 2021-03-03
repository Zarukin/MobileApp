import { Component, OnInit } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { Observable } from "rxjs";
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
  private todosCollection: AngularFirestoreCollection<Todo>;
  private todosObservable: Observable<Todo[]>;

  constructor(
    public route: ActivatedRoute,
    public listServices: ListService,
    public modalController: ModalController,
    private titleService: Title,
    private afs: AngularFirestore
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.list = this.listServices.GetOne(id);
    this.list.todos = [];
    this.todosCollection = this.afs.collection<List>("lists").doc(this.list.id).collection("todos");
    this.todosObservable = this.todosCollection.valueChanges();
    this.todosObservable.subscribe((todos) => {
      todos.forEach((todo) => {
        const todoInList = this.list.todos.find(x => x.id === todo.id );
        if (todoInList === undefined ) {
          this.list.todos.push(todo);
        } else {
          todoInList.isDone = todo.isDone;
          todoInList.name = todo.name;
          todoInList.description = todoInList.description;
        }
      });
    });
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – " + this.list.name);
  }

  onTodoUpdate(todo: Todo){
    todo.isDone = !todo.isDone;
    this.afs.collection("lists").doc(this.list.id).collection("todos").doc(todo.id).update({ isDone: todo.isDone });
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
}
