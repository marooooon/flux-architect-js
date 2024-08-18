/*
  Dispatcher: アクションを受け取り、ストアに伝達します。
  Store: 状態（スライダーの値）を保持し、変更時にビューに通知します。
  Actions: ユーザーの操作を表現するためのものです（例：スライダーの値を更新するアクション）。
  View: UIを表示し、ユーザーの操作をキャプチャしてアクションをディスパッチします。
*/


// Dispatcher
class Dispatcher {
  constructor() {
    this.isDispatching = false;
    this.handlers = [];
  }

  // Dispatcher.register
  register(handler) {
    this.handlers.push(handler);
  }

  dispatch(action) {
    if (this.isDispatching) {
      throw new Error('Cannot dispatch in the middle of a dispatch.');
    }

    this.isDispatching = true;
    try {
      this.handlers.forEach((handler) => handler(action));
    } finally {
      this.isDispatching = false;
    }
  }
}

// Store
class SliderStore {
  constructor(dispatcher) {
    this.value = 50;
    this.dispatcher = dispatcher;
    this.listeners = [];

    // bind(this)とすることで、SliderStoreのインスタンスを指定している。
    this.dispatcher.register(this.handleAction.bind(this));
  }

  handleAction(action) {
    if (action.type === 'UPDATE_SLIDER') {
      this.value = action.value;
      this.emitChange();
    }
  }

  getValue() {
    return this.value;
  }

  emitChange() {
    this.listeners.forEach((listener) => listener());
  }

  addChangeListener(listener) {
    this.listeners.push(listener);
  }

  removeChangeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}

// Actions
const updateSlider = (value) => ({
  type: 'UPDATE_SLIDER',
  value: value,
});

// View
document.addEventListener('DOMContentLoaded', () => {
  const dispatcher = new Dispatcher();
  const sliderStore = new SliderStore(dispatcher);

  const valueElement = document.getElementById('value');
  const decreaseButton = document.getElementById('decrease');
  const increaseButton = document.getElementById('increase');

  const render = () => {
    valueElement.textContent = sliderStore.getValue();
  };

  sliderStore.addChangeListener(render);

  decreaseButton.addEventListener('click', () => {
    const value = Math.max(0, sliderStore.getValue() - 1);
    dispatcher.dispatch(updateSlider(value));
  });

  increaseButton.addEventListener('click', () => {
    const value = Math.min(100, sliderStore.getValue() + 1);
    dispatcher.dispatch(updateSlider(value));
  });

  render();
});
