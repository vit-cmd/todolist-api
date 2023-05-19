import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Todo, TodoList, TodoRelations} from '../models';
import {TodolistRepository} from './todolist.repository';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {

  public readonly todolist: BelongsToAccessor<TodoList, typeof Todo.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TodolistRepository') protected todolistRepositoryGetter: Getter<TodolistRepository>,
  ) {
    super(Todo, dataSource);
    this.todolist = this.createBelongsToAccessorFor('todoList', todolistRepositoryGetter,);
    this.registerInclusionResolver('todoList', this.todolist.inclusionResolver);
  }
}
