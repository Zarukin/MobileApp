import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { List } from "../models/list";
import { Todo } from "../models/todo";
import firebase from "firebase/app";

@Injectable({
  providedIn: "root",
})
export class ListService {
  private lists: List[];
  private listsCollection: AngularFirestoreCollection<List>;
  listsObservable: Observable<List[]>;
  private user: firebase.User;
  private userSub: Subscription;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
    this.lists = [];
    this.listsCollection = this.afs.collection<List>("lists", ref => ref.orderBy("timestamp", "asc"));
    this.listsObservable = this.listsCollection.valueChanges();
    this.userSub = this.auth.user.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    // this.auth.currentUser.then((user) => {
    //   this.user = user;
    this.listsObservable.subscribe((lists) => {
      lists.forEach(element => {
        if (element.todos === undefined) {
          element.todos = [];
        }
        if (element.canRead === undefined) {
          element.canRead = [];
        }
        if (element.canWrite === undefined) {
          element.canWrite = [];
        }
      });
      this.lists = lists.filter((list) => {
        return list.owner === this.user.email || list.canRead.indexOf(this.user.email) !== -1 ||
          list.canWrite.indexOf(this.user.email) !== -1;
      });
    });
    // });
  }

  GetAll(): Observable<List[]> {
    return this.listsObservable;
  }

  GetOne(id: string): List {
    console.log(this.lists);
    return this.lists.find((list) => list.id === id);
  }

  GetTodo(id: string, parentList: List): Todo {
    let todo: Todo;
    todo = parentList.todos.find((td) => td.id === id);
    console.log(todo);
    return todo;
  }

  GetTodoObservable(list: List) {
    let todosCollection: AngularFirestoreCollection<Todo>;
    let todosObservable: Observable<Todo[]>;
    todosCollection = this.afs
      .collection<List>("lists")
      .doc(list.id)
      .collection("todos", (ref) => ref.orderBy("timestamp", "asc"));
    todosObservable = todosCollection.valueChanges();
    todosObservable.subscribe((todos) => {
      list.todos = todos;
      todos.forEach((todo) => {
        const todoInList = list.todos.find((x) => x.id === todo.id);
        if (todoInList === undefined) {
          list.todos.push(todo);
        } else {
          todoInList.isDone = todo.isDone;
          todoInList.name = todo.name;
          todoInList.description = todo.description;
        }
      });
    });
    return todosObservable;
  }

  async Create(listName: string) {
    const id = this.afs.createId();
    const email = this.user.email;
    const list: List = {
      id,
      name: listName,
      colour: this.GetRandomColour(),
      owner: email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    this.listsCollection.doc(id).set(list);
  }

  CreateTodo(list: List, todoName: string, todoDesc: string) {
    const id = this.afs.createId();
    const todo: Todo = {
      id,
      name: todoName,
      description: todoDesc,
      isDone: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    this.listsCollection.doc(list.id).collection<Todo>("todos").doc(id).set(todo);
  }

  Delete(list: List) {
    this.afs.collection("lists").doc(list.id).delete();
  }

  DeleteTodo(list: List, todo: Todo) {
    this.afs.collection("lists").doc(list.id).collection("todos").doc(todo.id).delete();
  }

  private GetRandomColour(): string {
    const colourArray = ["primary", "secondary", "tertiary", "success", "warning", "danger", "medium", "dark"];
    return colourArray[Math.floor(Math.random() * colourArray.length)];
  }
}
