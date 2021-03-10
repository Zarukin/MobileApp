import { Component, OnInit, Output } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { Observable } from "rxjs";
import { CreateTodoComponent } from "src/app/modals/create-todo/create-todo.component";
import { ShareListComponent } from "src/app/modals/share-list/share-list.component";
import { List } from "src/app/models/list";
import { Todo } from "src/app/models/todo";
import { ListService } from "src/app/services/list.service";
import { AngularFireAuth } from "@angular/fire/auth";
@Component({
  selector: "app-list-details",
  templateUrl: "./list-details.page.html",
  styleUrls: ["./list-details.page.scss"],
})
export class ListDetailsPage implements OnInit {
  public list: List;
  private todosCollection: AngularFirestoreCollection<Todo>;
  private todosObservable: Observable<Todo[]>;
  public user: firebase.User;
  constructor(
    public route: ActivatedRoute,
    public listServices: ListService,
    private auth: AngularFireAuth,
    public modalController: ModalController,
    private titleService: Title,
    private afs: AngularFirestore
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.list = this.listServices.GetOne(id);
    this.list.todos = [];
    this.user = await this.auth.currentUser;
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

  updateIsDone(todo: Todo) {
    if (this.user !== undefined  && (this.list.owner === this.user.email || this.list.canWrite.indexOf(this.user) !== -1)) {
    this.afs.collection("lists").doc(this.list.id).collection("todos").doc(todo.id).update({ isDone: !todo.isDone });
    }
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

  async presentModalShare() {
    const modal = await this.modalController.create({
      component: ShareListComponent,
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

  share() {
    this.presentModalShare();
  }
}
