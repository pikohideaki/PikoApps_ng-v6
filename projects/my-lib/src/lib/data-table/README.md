# data-table component

## 設計

* objectの配列の場合と`TCell`型の二次元配列の場合に対応
  * object配列版 ： `ObjectDataTableComponent`
  * `TCell`型二次元配列版 ： `DataTableComponent`
* objectの配列の場合は`settings`の`headerSettings`配列を基に
  `TCell`型二次元配列に変換したObservableを作り
  `DataTableComponent`に投げる
* `ObjectDataTableComponent`に渡す`settings`は，
  列をメンバ名で指定するためにヘッダ設定に`memberName`を追加して拡張した
  `HeaderSettingForObject`型の配列をヘッダ設定とした
  `TableSettingForObject`型オブジェクトとする．
<<<<<<< HEAD
* `TCell`はテーブルの各セルの型の定義である．`TCell`は 
    `TCellPrimitive`, `TCellPrimitive[]`, `Date`
    のunion型とする．
* `TCellPrimitive`は
    `undefined`, `boolean`, `number`, `string`
    のUnion型とする．
  * `Date`は対応しない．使用したい場合は，
      `table$`を`number`に変換したデータで渡し，
      `transform`関数として`value => new Date(value)`などを渡して
      表示時点で変換する．
=======
* `TCell`はテーブルの各セルの型の定義である．`TCell`は`TCellPrimitive` と `TCellPrimitive[]`, `Date` のunion型とする．
* `TCellPrimitive`は  `boolean`, `number`, `string` のunion型とする．
>>>>>>> d1c0de7c7312e0dd64facefab6a3bf628f4c35c7
* セルのデータが配列の場合は表示では`join(，)`などで文字列化することを想定している
* 各列のデータ


* `filterType`ごとに対応しているセル型は以下の通り．

<<<<<<< HEAD
| filter type      | cell type        |
| ---------------- | ---------------- |
| input            | string           |
| auto-complete    | string           |
| input-as-number  | number           |
| input-range      | number           |
| date             | Date             |
| select           | TCellPrimitive   |
| multi-select-and | TCellPrimitive[] |
| multi-select-or  | TCell            |



=======
| filter type     | cell type        |
| --------------- | ---------------- |
| input           | string           |
| select          | TCellPrimitive   |
| multiSelect-and | TCellPrimitive[] |
| multiSelect-or  | TCell            |
>>>>>>> d1c0de7c7312e0dd64facefab6a3bf628f4c35c7
