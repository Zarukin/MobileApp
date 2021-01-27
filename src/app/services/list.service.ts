import { Injectable } from '@angular/core';
import { List } from '../models/list';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists : List[];
  constructor() {
    this.lists = [];
    this.lists.push(new List("tmp",[]))
   }

  GetAll(){
    return  this.lists;
  }

  GetOne(id:number){
    return this.lists.find(list => list.id === id);
  }

  Create(list:List){
    this.lists.push(list);
  }

  CreateTodo(list:List,todo:Todo){
     list.todos.push(todo);
  }

  Delete(list:List){
    this.lists.splice(this.lists.indexOf(list),1);
 }

  DeleteTodo(list:List,todo:Todo){
     list.todos.splice( list.todos.indexOf(todo),1);
  }
}

