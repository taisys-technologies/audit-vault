# audit-vault

## Intro
The `Setting` contract records limitations for other contracts, and the `Vault` contract is a fund pool which limitation is from `Setting`.\
If we want to `transfer` from this pool, it will only success while under specific circumstances. Therefore, we can restrict the cash flow of the pool by the limitation.\
The doc below will explain these two contracts respectively.

### Setting
This is a contract for storing data.\
Everyone can call get function to fetch corresponding value, but to set value in this contract, msgSender must have `SETTER_ROLE` or equal to the address of param `wallet`.\
The difference between `Setting` and other contracts is that we store all the data in bytes type becasue of client demand. Thus, when users want to get value from `Setting`, the get function will convert the type depend on users' choice then return.

### Vault
This is a contract to be used as fund pool.\
We storage `_config`, `_param` and `_prefix` which are needed when get limitaton from `Setting`. The `_config` means the address of `Setting`, and the `_param` means the limitation of which address this contract reference from. As for `_prefix`, it's a part of key when getting limitation from `Seeting`, and it's added because client required.

As just mentioned, this contract is a fund pool, so we will mainly call the function `transfer` to withdraw money from it.\
Transactions will only success while meeting the following conditions:
- `erc20` is including in `_erc20List`
- msgSender or `to` meet any of the following conditions
  - to is in the `_trustedToList`
  - msgSender has `NO_LIMIT_TRANSFER_ROLE`
  - msgSender has `SMALL_AMOUNT_TRANSFER_ROLE`, `to` is in the `_trustedToList`, and the `amount` is not greater than limitations setted in another contract.\
    For the last restriction, the contract will call `Setting` contract to get the limitation.