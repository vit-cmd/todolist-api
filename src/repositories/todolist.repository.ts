import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Todo, TodoList, TodolistRelations} from '../models';
import {TodoRepository} from './todo.repository';

export class TodolistRepository extends DefaultCrudRepository<
TodoList,
  typeof TodoList.prototype.id,
  TodolistRelations
> {

  public readonly todos: HasManyRepositoryFactory<Todo, typeof TodoList.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TodoRepository') protected todoRepositoryGetter: Getter<TodoRepository>,
  ) {
    super(TodoList, dataSource);
    this.todos = this.createHasManyRepositoryFactoryFor('todos', todoRepositoryGetter,);
    this.registerInclusionResolver('todos', this.todos.inclusionResolver);
  }

  // Add the following function
  public findByTitle(title: string) {
    return this.findOne({where: {title}});
  }
}
