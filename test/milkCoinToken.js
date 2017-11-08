
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

const MilkCoinToken = artifacts.require('MilkCoinToken')

contract('MilkCoinToken', function(wallets) {

  const notOwner = wallets[1]
  
  const newAddr = wallets[2]
  
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.milkCoinToken = await MilkCoinToken.new()
  })	 
  
  describe('not owner reject tests', function () {

      it('mint reject if not owner', async function () {
        await this.milkCoinToken.mint(newAddr, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('transfer reject if not owner', async function () {
        await this.milkCoinToken.transfer(newAddr, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('transferFrom reject if not owner', async function () {
        await this.milkCoinToken.transferFrom(newAddr, newAddr, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('retrieveTokens reject if not owner', async function () {
        await this.milkCoinToken.retrieveTokens(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('finishMinting reject if not owner', async function () {
        await this.milkCoinToken.finishMinting(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('resetDividendsCalculation reject if not owner', async function () {
        await this.milkCoinToken.resetDividendsCalculation({from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('calculateDividends reject if not owner', async function () {
        await this.milkCoinToken.calculateDividends(1, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('withdraw reject if not owner', async function () {
        await this.milkCoinToken.withdraw({from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

  })

})
