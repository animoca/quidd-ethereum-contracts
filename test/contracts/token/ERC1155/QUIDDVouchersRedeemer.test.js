const {artifacts, accounts, web3} = require('hardhat');
const {ZeroAddress, EmptyByte, Zero, One, Two} = require('@animoca/ethereum-contracts-core').constants;

const [deployer] = accounts;

describe('QUIDDVouchersRedeemer', function () {
  beforeEach(async function () {
    // await fixtureLoader(fixture, this);
    this.redeemer = await artifacts.require('QUIDDVouchersRedeemerMock').new(ZeroAddress, ZeroAddress, ZeroAddress);
  });

  describe('_voucherValue(uint256)', function () {
    // it('reverts if the voucher is not a QUIDD voucher', async function () {
    //   const tokenId = '100010101';
    //   await expectRevert(this.redeemer.voucherValue(tokenId), 'Redeemer: wrong voucher');
    // });

    it('returns the correct voucher value', async function () {
      const tokenId = One;
      (await this.redeemer.voucherValue(tokenId)).should.be.bignumber.equal(tokenId);
    });
  });
});
