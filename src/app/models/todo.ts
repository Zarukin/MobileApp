import firebase from "firebase/app";

export class Todo {
  static LastId = 0;
  id: string;
  name: string;
  description: string;
  isDone: boolean;
  deadline?: firebase.firestore.Timestamp;
  timestamp: firebase.firestore.FieldValue;

  constructor(name: string, description: string, isDone) {
    this.name = name;
    this.description = description;
    this.isDone = isDone;
    this.id = "";
  }
}
