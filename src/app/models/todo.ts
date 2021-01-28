export class Todo {
  static LastId = 0;
  id: number;
  name: string;
  description: string;
  isDone: boolean;

  constructor(name: string, description: string, isDone) {
    this.name = name;
    this.description = description;
    this.isDone = isDone;
    this.id = Todo.LastId++;
  }
}
