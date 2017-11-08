
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

const CommonCrowdsale = artifacts.require('CommonCrowdsale')

contract('CommonCrowdsale', function(wallets) {

  const notOwner = wallets[1]
  
  const newAddr = wallets[2]
  
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.commonCrowdsale = await CommonCrowdsale.new()
  })	 
  
  describe('not owner reject tests', function () {

      it('setHardcap reject if not owner', async function () {
        await this.commonCrowdsale.setHardcap(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setStart reject if not owner', async function () {
        await this.commonCrowdsale.setStart(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setWallet reject if not owner', async function () {
        await this.commonCrowdsale.setWallet(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setPrice reject if not owner', async function () {
        await this.commonCrowdsale.setPrice(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setMinInvestedLimit reject if not owner', async function () { 
        await this.commonCrowdsale.setMinInvestedLimit(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('addMilestone reject if not owner', async function () {
        await this.commonCrowdsale.addMilestone(1, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('createTokensManually reject if not owner', async function () {
        await this.commonCrowdsale.createTokensManually(newAddr, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('finishMinting reject if not owner', async function () {
        await this.commonCrowdsale.finishMinting({from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('retrieveTokens reject if not owner', async function () {
        await this.commonCrowdsale.retrieveTokens(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

  })

})
