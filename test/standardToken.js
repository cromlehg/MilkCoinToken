
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

const StandardToken = artifacts.require('StandardToken')

contract('StandardToken', function(wallets) {

  const notOwner = wallets[1]
  
  const newAddr = wallets[2]
  
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.standardToken = await StandardToken.new()
  })	 
  
  describe('not owner reject tests', function () {

      it('transferFrom reject if not owner', async function () {
        await this.standardToken.transferFrom(newAddr, newAddr, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

  })

})
