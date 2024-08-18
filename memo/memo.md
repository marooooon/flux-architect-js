# Fluxを言語化してみた

## 全体的な流れ
1. 各要素のidを取得
  - prevボタン
  - 値表示
  - nextボタン
2. スライダーの値をUIに表示させる
3. スライダー値が変更されたときに、スライダーストアを更新する（＝リスナーを追加する、という）
4. ボタンのクリックイベントを設定
   - スライダー画像を移動させる（-1 or +1）
   - 更新内容を

## Action
Actionは状態を変更するためのオブジェクト

```js
const action = {
    type: 'UPDATE_SLIDER',
    value: 75
};
```

## Action Creator
Action Creator はアクションオブジェクトを生成する関数
スライダーの場合、Nextボタンを押下する場合や、Prevボタンを押下する場合、状態をアップデートしないといけない。
そのためにはAction Creatorを作らないと状態変化をアクションに伝えることができない。

難しいことはない。もはやactionに引数があるバージョンという認識でOKな気がする。

```js
const updateSlider = (value) => ({
    type: 'UPDATE_SLIDER',
    value: value
});

// アクションオブジェクトを生成する
const action = updateSlider(75);
```
