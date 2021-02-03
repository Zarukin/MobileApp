import { Todo } from "./todo";

export class List {
  static LastId = 0;
  id: number;
  name: string;
  todos: Todo[];
  colour: string;

  constructor(name: string, todos: Todo[]) {
    this.name = name;
    this.todos = todos;
    this.id = List.LastId++;
    this.colour = "";
  }
}
