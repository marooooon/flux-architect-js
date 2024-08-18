// Dispatcher
class Dispatcher {
  constructor() {
    this.isDispatching = false;
    this.pendingPayloads = [];
    this.callbacks = [];
  }

  register(callback) {
    this.callbacks.push(callback);
  }

  dispatch(payload) {
    if (this.isDispatching) {
      this.pendingPayloads.push(payload);
      return;
    }

    this.isDispatching = true;

    while (payload) {
      for (const callback of this.callbacks) {
        callback(payload);
      }
      payload = this.pendingPayloads.shift();
    }

    this.isDispatching = false;
  }
}

// Store
class Store {
  constructor(dispatcher) {
    this.todos = [];
    dispatcher.register(this.reduce.bind(this));
  }

  reduce(action) {
    switch (action.type) {
      case 'ADD_TODO':
        this.todos.push(action.payload);
        this.emitChange();
        break;
      case 'REMOVE_TODO':
        this.todos = this.todos.filter((_, index) => index !== action.payload);
        this.emitChange();
        break;
    }
  }

    /*
        emitとは？
        子コンポーネントから親コンポーネントへイベント内容を伝えること
        親コンポーネントから子コンポーネントの場合はProps
    */
  emitChange() {
    if (this.changeListener) {
      this.changeListener();
    }
  }

  addChangeListener(listener) {
    this.changeListener = listener;
  }

  getTodos() {
    return this.todos;
  }
}

// Action creators
const addTodo = (dispatcher, todo) => {
  dispatcher.dispatch({ type: 'ADD_TODO', payload: todo });
};

const removeTodo = (dispatcher, index) => {
  dispatcher.dispatch({ type: 'REMOVE_TODO', payload: index });
};

// View
const render = (store) => {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  store.getTodos().forEach((todo, index) => {
    const li = document.createElement('li');
    li.textContent = todo;

    const removeButton = document.createElement('button');
    removeButton.textContent = '削除';
    removeButton.onclick = () => removeTodoButtonClicked(index);

    li.appendChild(removeButton);
    todoList.appendChild(li);
  });
};

// Initialize
const dispatcher = new Dispatcher();
const store = new Store(dispatcher);

store.addChangeListener(() => render(store));

const addTodoButtonClicked = () => {
  const newTodoInput = document.getElementById('new-todo');
  const newTodo = newTodoInput.value;
  if (newTodo.trim() !== '') {
    addTodo(dispatcher, newTodo);
    newTodoInput.value = '';
  }
};

const removeTodoButtonClicked = (index) => {
  removeTodo(dispatcher, index);
};

document
  .getElementById('add-todo')
  .addEventListener('click', addTodoButtonClicked);
