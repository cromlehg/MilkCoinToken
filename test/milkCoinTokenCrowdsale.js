
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

const MilkCoinTokenCrowdsale = artifacts.require('MilkCoinTokenCrowdsale')

contract('MilkCoinTokenCrowdsale', function(wallets) {

  const owner = wallets[0]

  const notOwner = wallets[1]
  
  const newAddr = wallets[2]

  const purchaser = wallets[3]

  const bountyUser = wallets[4]

  const value = ether(42)
  
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.crowdsale = await MilkCoinTokenCrowdsale.new()
  })	 
  
  describe('not owner reject tests', function () {

      it('MilkCointTokenCrowdsale reject if not owner', async function () {
        await this.crowdsale.MilkCointTokenCrowdsale({from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

  })

  describe('accepting payments', function () {

    it('should reject payments before start for purchaser', async function () {
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokens({from: purchaser, value: value}).should.be.rejectedWith(EVMThrow)
    })

    it('should reject payments before start for owner', async function () {
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokens({from: owner, value: value}).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokensManually(bountyUser, value, {from: owner}).should.be.rejectedWith(EVMThrow)
    })

    it('should accept payments after start for purchaser', async function () {
      await increaseTimeTo(this.startTime)
      await this.crowdsale.send(value).should.be.fulfilled
      await this.crowdsale.createTokens({value: value, from: purchaser}).should.be.fulfilled
    })

    it('should accept payments after start for owner', async function () {
      await increaseTimeTo(this.startTime)
      await this.crowdsale.send(value).should.be.fulfilled
      await this.crowdsale.createTokens({value: value, from: owner}).should.be.fulfilled
      await this.crowdsale.createTokensManually(bountyUser, value, {from: owner}).should.be.fulfilled
    })

    it('should reject payments after end for purchaser', async function () {
      await increaseTimeTo(this.afterEndTime)
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokens({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow)
    })

    it('should reject payments after end for owner', async function () {
      await increaseTimeTo(this.afterEndTime)
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokens({value: value, from: owner}).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokensManually(bountyUser, value, {from: owner}).should.be.rejectedWith(EVMThrow)
    })

  })


})
