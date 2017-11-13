<p align="center">
  <h1> Milkcoin</h1>
  <img src="./logo.png">
</p>


* _Standart_        : ERC20
* _Name_            : Milkcoin
* _Ticket_          : MLCN
* _Decimals_        : 2
* _Emission_        : Mintable
* _Crowdsales_      : 1
* _Fiat dependency_ : No
* _Tokens locked_   : No

## Smart-contracts description

Contract mint bounty, advisors and founders tokens after each stage finished. 
Crowdsale contracts have special function to retrieve transferred in errors tokens.

### How to manage contract
To start working with contract you should follow next steps:
1. Compile it in Remix with enamble optimization flag and compiler 0.4.18
2. Deploy bytecode with MyEtherWallet. 

After crowdsale contract manager must call finishMinting. 

### How to invest
To purchase tokens investor should send ETH (more than minimum 0.1 EHT) to corresponding crowdsale contract.
Recommended GAS: 250000, GAS PRICE - 21 Gwei.

### Wallets with ERC20 support
1. MyEtherWallet - https://www.myetherwallet.com/
2. Parity 
3. Mist/Ethereum wallet

EXODUS not support ERC20, but have way to export key into MyEtherWallet - http://support.exodus.io/article/128-how-do-i-receive-unsupported-erc20-tokens

Investor must not use other wallets, coinmarkets or stocks. Can lose money.

## Main network configuration

* _Base price_                 : 1500 MLCN per ETH
* _Minimal insvested limit_    : 0.1 ETH

### Contracts contains
1. _MilkCoinToken_ - https://etherscan.io/token/0xb008b81eaa812a3e5ab6e8a9a9233fa31b744d6d#readContract
2. _MilkCoinCrowdsale_ - https://etherscan.io/address/0x4341852389bd149920cae3540dd88031ade8d0e6#readContract

### ICO
* _Hardcap_                    : 250000 ETH
* _Start_                      : Wed, 15 Nov 2017 15:00:00 GMT
* _End_                        : Fri, 15 Dec 2017 15:00:00 GMT
* _Contract manager_           : 0xb794B6c611bFC09ABD206184417082d3CA570FB7
* _ETH Wallet_                 : 0x87127Cb2a73eA9ba842b208455fa076cab03E844

_Milestones_

1. 3 days                      : bonus +100%
2. 5 days                      : bonus +67%
3. 5 days                      : bonus +43%
4. 5 days                      : bonus +25%
5. 12 days                     : no bonus


## Kovan network configuration

* _Base price_                 : 1500 MLCN per ETH
* _Minimal insvested limit_    : 0.1 ETH

### Contracts contains
1. _MilkCoinToken_ - https://kovan.etherscan.io/token/0x03493d89004f83ecea78cfdb06ce8d981025204a#readContract
2. _MilkCoinCrowdsale_ - https://kovan.etherscan.io/address/0x5ad7d92958062cadbab287f1a9f5fecc0fa6989f#readContract

### ICO
* _Hardcap_                    : 250000 ETH
* _Start_                      : Wed, 13 Nov 2017 00:00:00 GMT
* _End_                        : Fri, 15 Dec 2017 00:00:00 GMT
* _Contract manager_           : 0xb8600b335332724Df5108Fc0595002409c2ADbC6
* _ETH Wallet_                 : 0xb8600b335332724Df5108Fc0595002409c2ADbC6

_Milestones_

1. 1 days                      : bonus +100%
5. 1 days                      : no bonus

### Transactions
* https://kovan.etherscan.io/tx/0xc6be2fe3df85e9a1342678d3e3a2e1c6025311cebacb542e197191c1103ccece
