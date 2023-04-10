# Vault Test Document

## addErc20List

### 正向測試

測試 新增單一個 erc20 至清單中

輸入：

- 以 Setter 執行
- `newErc20Address`: 欲新增的 erc20 位址

預期結果：

- 確認 erc20List 資料已更新

### 負向測試 - 位址規格不符

測試欲新增的位址為 0x0

輸入：

- 以 Setter 執行
- `newErc20Address`: 欲新增的 erc20 位址（0x0）

預期結果：

- Transaction Revert：收到錯誤 `Vault_001`

### 負向測試 - 重複新增

測試欲新增的位址已存在於清單中

輸入：

- 以 Setter 執行
- `newErc20Address`: 欲新增的 erc20 位址（已存在位址）

預期結果：

- Transaction Revert：收到錯誤 `Vault_102`

### 負向測試 - 清單過長

測試新增位址後，超出長度限制

輸入：

- 以 Setter 執行
- `newErc20Address`: 欲新增的 erc20 位址

預期結果：

- Transaction Revert：收到錯誤 `Vault_109`

## delErc20List

### 正向測試 - msgSender 相符

測試刪除 erc20 清單中特定位址

輸入：

- 以 Setter 執行
- `erc20Address`: 欲刪除的 erc20 位址

預期結果：

- 確認 erc20List 資料已更新

## setErc20List

### 正向測試

測試重設 erc20 清單

輸入：

- 以 Setter 執行
- `newErc20AddressList`: 欲設定 erc20 位址清單

預期結果：

- 確認 erc20List 資料已更新

### 負向測試 - 清單過長

測試重設之 erc20 清單過長

輸入：

- 以 Setter 執行
- `newErc20AddressList`: 欲設定 erc20 位址清單（超出 20）

預期結果：

- Transaction Revert：收到錯誤 `Vault_101`

## setToListMerkleRoot

### 正向測試

測試設定 to 清單之 Merkle Tree Root

輸入：

- 以 Setter 執行
- `newToListMerkleRoot`: 欲設定 to 清單之 Merkle Tree Root

預期結果：

- 確認 toListMerkleRoot 資料已更新

## setTrustedToListMerkleRoot

### 正向測試

測試設定 trustedTo 清單之 Merkle Tree Root

輸入：

- 以 Setter 執行
- `newTrustedToListMerkleRoot`: 欲設定 trustedTo 清單之 Merkle Tree Root

預期結果：

- 確認 trustedToListMerkleRoot 資料已更新

## setConfigAddress

### 正向測試

測試設定 config

輸入：

- 以 Setter 執行
- `newConfig`: 欲設定新的 config

預期結果：

- 確認 config 資料已更新

### 負向測試 - 位址規格不符

測試設定 config 為 0x0

輸入：

- 以 Setter 執行
- `newConfig`: 欲設定新的 config（0x0）

預期結果：

- Transaction Revert：收到錯誤 `Vault_001`

## setParamAddress

### 正向測試

測試設定 param

輸入：

- 以 Setter 執行
- `newParam`: 欲設定新的 param

預期結果：

- 確認 param 資料已更新

### 負向測試 - 位址規格不符

測試設定 param 為 0x0

輸入：

- 以 Setter 執行
- `newParam`: 欲設定新的 param（0x0）

預期結果：

- Transaction Revert：收到錯誤 `Vault_001`

## transfer

### 正向測試 - to 在 toList 清單中

測試出金

輸入：

- 以 SmallTransfer 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- 確認 `${to}` 餘額以及合約紀錄其當日領取上限正確

### 正向測試 - toList 清單為 0

測試出金

輸入：

- 以 SmallTransfer 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- 確認 `${to}` 餘額以及合約紀錄其當日領取上限正確

### 正向測試 - to 在 trustedToList 清單中

測試出金

輸入：

- 以 一般錢包 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- 確認 `${to}` 餘額正確

### 正向測試 - 擁有無限制轉出權限

測試出金

輸入：

- 以 NoLimitTransfer 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- 確認 `${to}` 餘額正確

### 負向測試 - 不支援的 erc20

測試出金為不支援的 erc20

輸入：

- 以 一般錢包 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20（不支援的位址）
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- Transaction Revert：收到錯誤 `Vault_103`

### 負向測試 - 無效的轉出（large amount = 0）

測試出金，但條件不符（large amount 為 0）

輸入：

- 以 SmallTransfer 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- Transaction Revert：收到錯誤 `Vault_104`

### 負向測試 - 無效的轉出（出金金額為 large amount）

測試出金，但條件不符（amount 達到 large amount）

輸入：

- 以 SmallTransfer 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額（等於 large amount）
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- Transaction Revert：收到錯誤 `Vault_104`

### 負向測試 - to 驗證無效

測試出金，但條件不符（to 不在 toList 清單中）

輸入：

- 以 SmallTransfer 執行
- `to`: 欲收款的地址（不在 toList 清單中之位址）
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- Transaction Revert：收到錯誤 `Vault_105`

### 負向測試 - 超出每次出金額度上限

測試出金，但金額超出每次出金額度上限

輸入：

- 以 SmallTransfer 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額（超出每次出金額度上限）
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- Transaction Revert：收到錯誤 `Vault_106`

### 負向測試 - 超出每日出金額度上限

測試出金，但最終金額超出每日出金額度上限

輸入：

- 以 SmallTransfer 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額（總金額超出每日出金額度上限）
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- Transaction Revert：收到錯誤 `Vault_107`

### 負向測試 - 超出每日出金次數上限

測試出金，但最終次數超出每日出金次數上限

輸入：

- 以 SmallTransfer 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- Transaction Revert：收到錯誤 `Vault_108`

### 負向測試 - 以沒有權限錢包執行

測試出金，但執行錢包沒有任何權限

輸入：

- 以 一般錢包 執行
- `to`: 欲收款的地址
- `erc20`: 欲轉出的 erc20
- `amount`: 欲轉出的金額
- `opcode`: event 紀錄之 opcode
- `toProof`: 驗證 to 是否在 toList 所需 proof
- `trustedToProof`: 驗證 to 是否在 trustedToList 所需 proof

預期結果：

- Transaction Revert：收到錯誤 `Vault_110`