# Setting Test Document

## setUint

### 正向測試 - msgSender 相符

測試 msgSender 與 `${wallet}` 相符的狀況下，設定 uint 資料

輸入：

- 以 一般錢包 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- 確認對應 `${key}` 資料已更新

### 正向測試 - 擁有 Setter 權限

測試擁有 Setter 權限狀況下，設定 uint 資料

輸入：

- 以 Setter 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- 確認對應 `${key}` 資料已更新

### 負向測試 - 權限不足

測試 msgSender 與 `${wallet}` 不符 以及 沒有 Setter 權限的狀況下，設定 uint 資料

輸入：

- 以 Admin 執行
- `wallet`: 欲設定的位址（與 msgSender 不符的位址）
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- Transaction Revert：收到錯誤 `Setting_101`

## setAddress

### 正向測試 - msgSender 相符

測試 msgSender 與 `${wallet}` 相符的狀況下，設定 address 資料

輸入：

- 以 一般錢包 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的 address

預期結果：

- 確認對應 `${key}` 資料已更新

### 正向測試 - 擁有 Setter 權限

測試擁有 Setter 權限狀況下，設定 address 資料

輸入：

- 以 Setter 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的 address

預期結果：

- 確認對應 `${key}` 資料已更新

### 負向測試 - 權限不足

測試 msgSender 與 `${wallet}` 不符 以及 沒有 Setter 權限的狀況下，設定 address 資料

輸入：

- 以 Admin 執行
- `wallet`: 欲設定的位址（與 msgSender 不符的位址）
- `key`: 欲設定的 key
- `value`: 欲設定的 address

預期結果：

- Transaction Revert：收到錯誤 `Setting_101`

## setString

### 正向測試 - msgSender 相符

測試 msgSender 與 `${wallet}` 相符的狀況下，設定 string 資料

輸入：

- 以 一般錢包 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的字串

預期結果：

- 確認對應 `${key}` 資料已更新

### 正向測試 - 擁有 Setter 權限

測試擁有 Setter 權限狀況下，設定 string 資料

輸入：

- 以 Setter 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的字串

預期結果：

- 確認對應 `${key}` 資料已更新

### 負向測試 - 權限不足

測試 msgSender 與 `${wallet}` 不符 以及 沒有 Setter 權限的狀況下，設定 string 資料

輸入：

- 以 Admin 執行
- `wallet`: 欲設定的位址（與 msgSender 不符的位址）
- `key`: 欲設定的 key
- `value`: 欲設定的字串

預期結果：

- Transaction Revert：收到錯誤 `Setting_101`

## setInt

### 正向測試 - msgSender 相符

測試 msgSender 與 `${wallet}` 相符的狀況下，設定 int 資料

輸入：

- 以 一般錢包 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- 確認對應 `${key}` 資料已更新

### 正向測試 - 擁有 Setter 權限

測試擁有 Setter 權限狀況下，設定 int 資料

輸入：

- 以 Setter 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- 確認對應 `${key}` 資料已更新

### 負向測試 - 權限不足

測試 msgSender 與 `${wallet}` 不符 以及 沒有 Setter 權限的狀況下，設定 int 資料

輸入：

- 以 Admin 執行
- `wallet`: 欲設定的位址（與 msgSender 不符的位址）
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- Transaction Revert：收到錯誤 `Setting_101`

## setBytes

### 正向測試 - msgSender 相符

測試 msgSender 與 `${wallet}` 相符的狀況下，設定 bytes 資料

輸入：

- 以 一般錢包 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- 確認對應 `${key}` 資料已更新

### 正向測試 - 擁有 Setter 權限

測試擁有 Setter 權限狀況下，設定 bytes 資料

輸入：

- 以 Setter 執行
- `wallet`: 欲設定的位址
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- 確認對應 `${key}` 資料已更新

### 負向測試 - 權限不足

測試 msgSender 與 `${wallet}` 不符 以及 沒有 Setter 權限的狀況下，設定 bytes 資料

輸入：

- 以 Admin 執行
- `wallet`: 欲設定的位址（與 msgSender 不符的位址）
- `key`: 欲設定的 key
- `value`: 欲設定的值

預期結果：

- Transaction Revert：收到錯誤 `Setting_101`

## del

### 正向測試 - msgSender 相符

測試 msgSender 與 `${wallet}` 相符的狀況下，刪除資料

輸入：

- 以 一般錢包 執行
- `wallet`: 欲刪除的位址
- `key`: 欲刪除的 key

預期結果：

- 確認對應 `${key}` 資料已更新

### 正向測試 - 擁有 Setter 權限

測試擁有 Setter 權限狀況下，刪除資料

輸入：

- 以 Setter 執行
- `wallet`: 欲刪除的位址
- `key`: 欲刪除的 key

預期結果：

- 確認對應 `${key}` 資料已更新

### 負向測試 - 權限不足

測試 msgSender 與 `${wallet}` 不符 以及 沒有 Setter 權限的狀況下，刪除資料

輸入：

- 以 Admin 執行
- `wallet`: 欲刪除的位址（與 msgSender 不符的位址）
- `key`: 欲刪除的 key

預期結果：

- Transaction Revert：收到錯誤 `Setting_101`