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
    this.lists.push(new List("Liste 1",[new Todo("Faire les courses", "- Fourme de Montbrison\n- Papier toilette\n- Morbier\n- Bulots", false), new Todo("Aller chercher les enfants à l'école", "À 16h30", true)]))
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

