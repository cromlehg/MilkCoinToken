
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


  const investorIndex = 10

  const investorIndex1 = investorIndex

  const investorIndex2 = 20

  const investorIndex3 = 30

  const investorsCount = 50
/*
  var investors = {}


  for (var i = investorIndex; i < investorsCount; i++) {
    var investedValue = 0
    if(i > investorIndex3) {
      investedValue = value3
    } else if(i > investorIndex2) {
      investedValue = value2
    } else {
      investedValue = value1
    }
    let balance = investedValue.
    investors[wallets[i]] = {'invested': investedValue}
  }
  
*/
/* 

  Object.keys(investors).forEach(function (val) {
    console.log(val)
  })*/


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

      // set wallet
      await this.crowdsale.setWallet(owner).should.be.fulfilled

      // increase time to start crowdsale
      let start = await this.crowdsale.start()
      await increaseTimeTo(start)

      // initialize investors properties
      let bonus = await this.crowdsale.getMilestoneBonus()
      console.log('Bonus: ' + bonus)
      var investors = {}
      var summaryTokensMinted = new BigNumber(0)
      var summaryInvested = new BigNumber(0)
      for (var i = investorIndex; i < investorsCount; i++) {
        var investedValue = 0
        if(i > investorIndex3) {
          investedValue = value3
        } else if(i > investorIndex2) {
          investedValue = value2
        } else {
          investedValue = value1
        }
        let balance = investedValue.mul(this.price).mul(this.PERCENT_RATE.add(bonus)).div(this.DIVIDER).div(this.PERCENT_RATE)
        investors[wallets[i]] = {'invested': investedValue, 'balance': balance}
        summaryTokensMinted = summaryTokensMinted.add(balance)
        summaryInvested = summaryInvested.add(investedValue)
      }


      // starts to invest
      const crowdsale = this.crowdsale
      await Promise.all(Object.keys(investors).map(async (investor) => {
        let invested = investors[investor]['invested']
        await crowdsale.sendTransaction({from: investor, value: invested}).should.be.fulfilled
      }))

      // invest manually TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

      // finish crowdsale
      await this.crowdsale.finishMinting().should.be.fulfilled
 
      // check balances
      const token = this.token
      await Promise.all(Object.keys(investors).map(async (investor) => {
        let balance = investors[investor]['balance']
        let balanceFrom = await token.balanceOf(investor)
        balanceFrom.should.be.bignumber.equal(balance)
      }))
 
      // check total minted
      let totalSupply = await token.totalSupply()
      totalSupply.should.be.bignumber.equal(summaryTokensMinted)
     
      // take initial investors size
      var initInvestorsSize = Object.keys(investors).length   
 
      // transfer to increase investors
      // TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      // starts to calculate dividents
      var investorsSize = await token.countOfAddresses()
      const countPerIter = 11
      const itersFloat = investorsSize.toNumber()/countPerIter
      var iters = Math.ceil(itersFloat) 

      const yearPercent = 10

//      console.log('Investors size: ' + investorsSize)

      for(var i = 0; i < iters; i++) {
//        console.log(i)
    //    let localIndex = await token.dividendsIndex()
  //      console.log('local index ' + localIndex)
        await token.calculateDividends(yearPercent, countPerIter).should.be.fulfilled
      }

      var dIndex = await token.dividendsIndex()
      dIndex.should.be.bignumber.equal(new BigNumber(0))

//    var calculatedDivs = await token.dividendsCalculated()
//    calculatedDivs.should.be.equal(true)

      
      //console.log('Index: ' + index)

      await token.calculateDividends(yearPercent, countPerIter).should.be.rejectedWith(EVMThrow)
  
      // transfer all ethers from main wallet to token 
      
      await token.send(summaryInvested).should.be.fulfilled

      console.log('Pay dividends....')
      for(var i = 0; i < iters; i++) {
        console.log(i)
        let localIndex = await token.dividendsPayedIndex()
        console.log('local index ' + localIndex)
        await token.payDividends(countPerIter).should.be.fulfilled
      }
    

      await token.payDividends(countPerIter).should.be.rejectedWith(EVMThrow)
 

    })

  })


})
