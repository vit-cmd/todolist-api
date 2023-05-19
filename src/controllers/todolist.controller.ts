import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Todo, TodoList} from '../models';
import {TodolistRepository} from '../repositories';

export class TodolistController {
  constructor(
    @repository(TodolistRepository)
    public todolistRepository : TodolistRepository,
  ) {}

  @post('/todolists')
  @response(200, {
    description: 'Todolist model instance',
    content: {'application/json': {schema: getModelSchemaRef(TodoList)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {
            title: 'NewTodolist',
            exclude: ['id'],
          }),
        },
      },
    })
    todolist: Omit<TodoList, 'id'>,
  ): Promise<TodoList> {
    return this.todolistRepository.create(todolist);
  }

  @get('/todolists/count')
  @response(200, {
    description: 'Todolist model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TodoList) where?: Where<TodoList>,
  ): Promise<Count> {
    return this.todolistRepository.count(where);
  }

  @get('/todolists')
  @response(200, {
    description: 'Array of Todolist model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TodoList, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TodoList) filter?: Filter<TodoList>,
  ): Promise<TodoList[]> {
    return this.todolistRepository.find(filter);
  }

  @patch('/todolists')
  @response(200, {
    description: 'Todolist PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {partial: true}),
        },
      },
    })
    todolist: TodoList,
    @param.where(TodoList) where?: Where<TodoList>,
  ): Promise<Count> {
    return this.todolistRepository.updateAll(todolist, where);
  }

  @get('/todolists/{id}')
  @response(200, {
    description: 'Todolist model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TodoList, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TodoList, {exclude: 'where'}) filter?: FilterExcludingWhere<TodoList>
  ): Promise<TodoList> {
    return this.todolistRepository.findById(id, filter);
  }

  @patch('/todolists/{id}')
  @response(204, {
    description: 'Todolist PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {partial: true}),
        },
      },
    })
    todolist: TodoList,
  ): Promise<void> {
    await this.todolistRepository.updateById(id, todolist);
  }

  @put('/todolists/{id}')
  @response(204, {
    description: 'Todolist PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todolist: TodoList,
  ): Promise<void> {
    await this.todolistRepository.replaceById(id, todolist);
  }

  @del('/todolists/{id}')
  @response(204, {
    description: 'Todolist DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todolistRepository.deleteById(id);
  }

  @get('/todolists/{id}/todos', {
    responses: {
      '200': {
        description: 'Array of Todolist has many Todo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Todo)},
          },
        },
      },
    },
  })
  async findTodosById(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Todo>,
  ): Promise<Todo[]> {
    const data = this.todolistRepository.todos(id);
    console.log(data);

    return this.todolistRepository.todos(id).find(filter);
  }

  @post('/todolists/{id}/todos', {
    responses: {
      '200': {
        description: 'Todolist model instance',
        content: {'application/json': {schema: getModelSchemaRef(Todo)}},
      },
    },
  })
  async createTodoById(
    @param.path.number('id') id: typeof TodoList.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodoInTodolist',
            exclude: ['id', 'isComplete'],
            optional: ['todoListId']
          }),
        },
      },
    }) todo: Omit<Todo, 'id'>,
  ): Promise<Todo> {
    return this.todolistRepository.todos(id).create(todo);
  }

  @patch('/todolists/{id}/todos', {
    responses: {
      '200': {
        description: 'Todolist.Todo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Partial<Todo>,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todolistRepository.todos(id).patch(todo, where);
  }

  @del('/todolists/{id}/todos', {
    responses: {
      '200': {
        description: 'Todolist.Todo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todolistRepository.todos(id).delete(where);
  }
}
