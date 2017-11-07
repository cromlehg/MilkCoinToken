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

### Contracts contains
1. _MilkCoinToken_ 
2. _MilkCoinCrowdsale_

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

