import { Todo } from "./todo";
import firebase from "firebase/app";

export class List {
  static LastId = 0;
  id: string;
  name: string;
  todos?: Todo[];
  colour: string;
  owner: string;
  canRead: string[] = [];
  canWrite: string[] =[];
  timestamp: firebase.firestore.FieldValue;

  constructor(name: string, todos: Todo[], owner: string) {
    this.name = name;
    this.todos = todos;
    this.id = "";
    this.colour = "";
    this.owner = owner;
    this.canRead = [];
    this.canWrite = [];
  }
}
