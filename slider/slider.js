// chatGPTで作成したコード https://chatgpt.com/share/b728ac97-0a72-4aa2-a9e9-4796e94bceff

const Dispatcher = {
  // _で始まる名前は、プライベートな（外部から直接アクセスしない）ことを示す慣習的な記法です。つまり、この_callbacksリストはディスパッチャー内部で管理され、外部から直接操作するべきではないことを意味します。
  // 最初に「_callbacks: [],」として空のリストにしているのは、これからコールバックが登録される準備が整っていることを示している。
  _callbacks: [],
  register(callback) {
    this._callbacks.push(callback);
    console.log('this._callbacks register', this._callbacks);
  },
  dispatch(action) {
    this._callbacks.forEach((callback) => callback(action));
    console.log('this._callbacks dispatch', this._callbacks);
  },
};

const SliderActions = {
  next() {
    Dispatcher.dispatch({
      type: 'NEXT_SLIDE',
    });
  },
  prev() {
    Dispatcher.dispatch({
      type: 'PREV_SLIDE',
    });
  },
};

const SliderStore = {
  // liタグのindex番号の初期値
  _currentIndex: 0,
  // _listeners は、Storeが管理する**「状態が変わったときに通知を受け取るための関数（リスナー）」のリスト**です。
  // タスクランナーでいうwatchみたいなこと！
  // 状態が変化したときにアプリケーションの状態の変化を監視し、その変化があったときにUIを更新する。
  _listeners: [],
  init() {
    Dispatcher.register(this._handleAction.bind(this));
  },
  _handleAction(action) {
    switch (action.type) {
      case 'NEXT_SLIDE':
        this._currentIndex = (this._currentIndex + 1) % this.getImageCount();
        this._notify();
        break;
      case 'PREV_SLIDE':
        this._currentIndex =
          (this._currentIndex - 1 + this.getImageCount()) %
          this.getImageCount();
        this._notify();
        break;
    }
  },
  getCurrentIndex() {
    return this._currentIndex;
  },
  getImageCount() {
    return document.querySelectorAll('#images li').length;
  },
  addChangeListener(callback) {
    this._listeners.push(callback);
  },
  _notify() {
    this._listeners.forEach((callback) => callback());
  },
};

SliderStore.init();

document.addEventListener('DOMContentLoaded', () => {
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const images = document.getElementById('images');

  const updateView = () => {
    // liタグのindex番号
    const currentIndex = SliderStore.getCurrentIndex();

    // ulタグにおけるcssのtransformXを「currentIndex ✖️ -100%」している
    const offset = -currentIndex * 100;
    images.style.transform = `translateX(${offset}%)`;
  };

  prevButton.addEventListener('click', () => {
    SliderActions.prev();
  });

  nextButton.addEventListener('click', () => {
    SliderActions.next();
  });

  SliderStore.addChangeListener(updateView);

  // 初期表示（→いらない気がする）
  // updateView();
});