
import ether from './helpers/ether'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMThrow from './helpers/EVMThrow'

const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const Crowdsale = artifacts.require('MilkCoinTokenCrowdsale')

const Token = artifacts.require('MilkCoinToken')

contract('MilkCoinTokenCrowdsale', function(wallets) {

  const owner = wallets[0]

  const value1 = ether(1)

  const value2 = ether(2)

  const value3 = ether(3)

  const serviceAddressIndex = 10

  const manualInvestorsLength = 3

  const manualInvestorsStartIndex = serviceAddressIndex

  const transferInvestorsLength = 3

  const transferInvestorsStartIndex = manualInvestorsStartIndex + manualInvestorsLength

  const investorIndex = transferInvestorsStartIndex + transferInvestorsLength

  const investorIndex1 = investorIndex

  const investorIndex2 = 20

  const investorIndex3 = 30

  const investorsCount = 50
  //const investorsCount = wallets.length - 1 - investorIndex


  const investorTransferFromIndex = investorIndex


  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.crowdsale = await Crowdsale.new()
    this.token = Token.at(await this.crowdsale.token())
    this.price = await this.crowdsale.price()
    this.DIVIDER = await this.crowdsale.DIVIDER()
    this.PERCENT_RATE = await this.crowdsale.PERCENT_RATE()
  })	 
  
  describe('Test crowdsale', function () {

    it('should accept payments after start for purchaser', async function () {

      console.log('Set new wallet: ' + owner)
      // set wallet
      await this.crowdsale.setWallet(owner).should.be.fulfilled

      // increase time to start crowdsale
      console.log('Increase time to start crowdsale')
      let start = await this.crowdsale.start()
      await increaseTimeTo(start)

      console.log('Initialize investors.')
      // initialize investors properties
      let bonus = await this.crowdsale.getMilestoneBonus()
      console.log('Bonus: ' + bonus)
      var investors = {}
      var summaryTokensMinted = new BigNumber(0)
      var summaryInvested = new BigNumber(0)
      for (var i = investorIndex; i < investorIndex + investorsCount; i++) {
        var investedValue = 0
        if(i > investorIndex3) {
          investedValue = value3
        } else if(i > investorIndex2) {
          investedValue = value2
        } else {
          investedValue = value1
        }
//        let balance = investedValue.mul(this.price).mul(this.PERCENT_RATE.add(bonus)).div(this.DIVIDER).div(this.PERCENT_RATE)
        let tokens = investedValue.mul(this.price).div(this.DIVIDER)
        let tokensWithBonus = tokens.add(tokens.mul(bonus).div(this.PERCENT_RATE))
        investors[wallets[i]] = {'invested': investedValue, 'balance': tokensWithBonus}
        summaryTokensMinted = summaryTokensMinted.add(tokensWithBonus)
        summaryInvested = summaryInvested.add(investedValue)
      }


      console.log('Initialized investors ' +  Object.keys(investors).length)
      // starts to invest
      console.log('Invest...')
      const crowdsale = this.crowdsale
      await Promise.all(Object.keys(investors).map(async (investor) => {
        let invested = investors[investor]['invested']
        await crowdsale.sendTransaction({from: investor, value: invested}).should.be.fulfilled
      }))


      console.log('Create tokens manually...')
      // invest manually 
      const manualInvestorsLength = 3
      const manualInvestorsStartIndex = 1
     
      for(var i = manualInvestorsStartIndex; i < manualInvestorsStartIndex + manualInvestorsLength; i++) {
        let tokens = new BigNumber(i*100)
        let investor = wallets[i]
        console.log('Create ' + tokens + ' tokens manually for ' + investor)
        await crowdsale.createTokensManually(investor, tokens).should.be.fulfilled
        investors[investor] = {'invested': ether(0), 'balance': tokens}
        summaryTokensMinted = summaryTokensMinted.add(tokens)  
      }

      console.log('Token holders after manually operations ' +  Object.keys(investors).length)

      // finish crowdsale
      console.log('Finish crowdsale')
      await this.crowdsale.finishMinting().should.be.fulfilled
 
      console.log('Check balances')
      // check balances
      const token = this.token
      await Promise.all(Object.keys(investors).map(async (investor) => {
        let balance = investors[investor]['balance']
        let balanceFrom = await token.balanceOf(investor)
        balanceFrom.should.be.bignumber.equal(balance)
      }))

 
      console.log('Check total minted')
      // check total minted
      let totalSupply = await token.totalSupply()
      totalSupply.should.be.bignumber.equal(summaryTokensMinted)
     

      console.log('Transfer to increase token holders. ')
     
      const startTransferPercent = new BigNumber(50)
      for(var i = 0; i < transferInvestorsLength; i++) {
        let investorFrom = wallets[investorTransferFromIndex + i]
        let investorFromBalance = investors[investorFrom]['balance']
        let investorTo = wallets[transferInvestorsStartIndex+ i]
        let percent = startTransferPercent.add(i).div(100)
        let transferredValue = investorFromBalance.mul(percent)
        let remainingValue = investorFromBalance.sub(transferredValue)
        console.log('Transfer amount ' + percent + '% or ' + transferredValue + ' tokens from ' + investorFrom + ' to' + investorTo)
        await token.transfer(investorTo, transferredValue, {from: investorFrom}).should.be.fulfilled
        investors[investorFrom]['balance'] = remainingValue
        investors[investorTo] = {'invested': ether(0), 'balance': transferredValue}
      }

      console.log('Token holders after first transfer operations ' +  Object.keys(investors).length)

      console.log('Check invested ETH')
      const totalInvested = await this.token.invested()
      totalInvested.should.be.bignumber.equal(summaryInvested)
      console.log('Invested ' + summaryInvested)

      // take initial investors size
      var initInvestorsSize = Object.keys(investors).length   
      console.log('Env investors count ' + initInvestorsSize)
 
      // starts to calculate dividents
      var investorsSize = await token.countOfAddresses()
      const countPerIter = 11
      const itersFloat = investorsSize.toNumber()/countPerIter
      var iters = Math.ceil(itersFloat) 

      const yearPercent = 10
 
 
      console.log('Actual investors count: ' + investorsSize)
      console.log('Calculate ' +  yearPercent + '% dividens of ' + summaryInvested + '  for ' + investorsSize + ' investors.')

      for(var i = 0; i < iters; i++) {
        await token.calculateDividends(yearPercent, countPerIter).should.be.fulfilled
      }


      console.log('Check dividends calculation index equals 0')
      var dIndex = await token.dividendsIndex()
      dIndex.should.be.bignumber.equal(new BigNumber(0))


      console.log('Check dividends calculated flag')
      var calculatedDivs = await token.dividendsCalculated()
      calculatedDivs.should.equal(true)

      
      console.log('Check after calculation rejection')
      await token.calculateDividends(yearPercent, countPerIter).should.be.rejectedWith(EVMThrow)
  
      // transfer all ethers from main wallet to token 
      
      console.log('Transfer all ETH from wallet to token for dividens pay process')
      await token.send(summaryInvested).should.be.fulfilled

      console.log('Pay dividends....')
      for(var i = 0; i < iters; i++) {
        let localIndex = await token.dividendsPayedIndex()
        await token.payDividends(countPerIter).should.be.fulfilled
      }
    

      console.log('Check pay dividends rejection')
      await token.payDividends(countPerIter).should.be.rejectedWith(EVMThrow)
 

    })

  })


})
