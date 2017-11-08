
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

  var owner = wallets[0]

  const notOwner = wallets[1]
  
  const newAddr = wallets[2]

  const purchaser = wallets[3]

  const bountyUser = wallets[4]

  const value = ether(3)
  
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.crowdsale = await MilkCoinTokenCrowdsale.new()
    //owner = await this.crowdsale.owner()
  })	 
  
  describe('accepting payments', function () {

    it('should reject payments before start for purchaser', async function () {
      await this.crowdsale.sendTransaction({from: purchaser, value: value}).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokens({from: purchaser, value: value}).should.be.rejectedWith(EVMThrow)
    })

    it('should reject payments before start for owner', async function () {
      await this.crowdsale.sendTransaction({from: owner, value: value}).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokens({from: owner, value: value}).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokensManually(bountyUser, value, {from: owner}).should.be.rejectedWith(EVMThrow)
    })

    it('should accept payments after start for purchaser', async function () {
      let start = await this.crowdsale.start()
      await increaseTimeTo(start)
      await this.crowdsale.sendTransaction({from: purchaser, value: value}).should.be.fulfilled
      await this.crowdsale.createTokens({value: value, from: purchaser}).should.be.fulfilled
    })

    it('should accept payments after start for owner', async function () {
      await this.crowdsale.sendTransaction({from: owner, value: value}).should.be.fulfilled
      await this.crowdsale.createTokens({value: value, from: owner}).should.be.fulfilled
      await this.crowdsale.createTokensManually(bountyUser, value, {from: owner}).should.be.fulfilled
    })

    it('should reject payments after end for purchaser', async function () {
      let end = await this.crowdsale.end()
      await increaseTimeTo(end)
      await this.crowdsale.sendTransaction({from: purchaser, value: value}).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokens({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow)
    })

    it('should reject payments after end for owner', async function () {
      await this.crowdsale.sendTransaction({from: owner, value: value}).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokens({value: value, from: owner}).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.createTokensManually(bountyUser, value, {from: owner}).should.be.rejectedWith(EVMThrow)
    })

  })


})
