const {artifacts, accounts, web3} = require('hardhat');
const {BN, expectRevert} = require('@openzeppelin/test-helpers');
const {constants} = require('@animoca/ethereum-contracts-core');
const {One, Two} = constants;
const {shouldBehaveLikeERC20} = require('@animoca/ethereum-contracts-assets-1.1.5/test/contracts/token/ERC20/behaviors/ERC20.behavior');

const implementation = {
  contractName: 'QUIDDMock',
  name: 'QUIDD',
  symbol: 'QUIDD',
  decimals: new BN(18),
  tokenURI: '',
  revertMessages: {
    ApproveToZero: 'ERC20: zero address spender',
    TransferExceedsBalance: 'ERC20: insufficient balance',
    TransferToZero: 'ERC20: to zero address',
    TransferExceedsAllowance: 'ERC20: insufficient allowance',
    TransferFromZero: 'ERC20: insufficient balance',
    BatchTransferValuesOverflow: 'ERC20: values overflow',
    BatchTransferFromZero: 'ERC20: insufficient balance',
    AllowanceUnderflow: 'ERC20: insufficient allowance',
    AllowanceOverflow: 'ERC20: allowance overflow',
    InconsistentArrays: 'ERC20: inconsistent arrays',
    TransferRefused: 'ERC20: transfer refused',
    MintToZero: 'ERC20: zero address',
    BatchMintValuesOverflow: 'ERC20: values overflow',
    SupplyOverflow: 'ERC20: supply overflow',
    PermitFromZero: 'ERC20: zero address owner',
    PermitExpired: 'ERC20: expired permit',
    PermitInvalid: 'ERC20: invalid permit',
    NonMinter: 'Ownable: not the owner',
  },
  features: {
    ERC165: true,
    EIP717: true, // unlimited approval
    AllowanceTracking: true,
  },
  interfaces: {
    ERC20: true,
    ERC20Detailed: true,
    ERC20Metadata: true,
    ERC20Allowance: true,
    ERC20BatchTransfer: true,
    ERC20Safe: true,
    ERC20Permit: true,
  },
  methods: {
    'mint(address,uint256)': async (contract, account, value, overrides) => {
      return contract.mint(account, value, overrides);
    },
  },
  deploy: async function (initialHolders, initialBalances, deployer) {
    const registry = await artifacts.require('ForwarderRegistry').new({from: deployer});
    const forwarder = await artifacts.require('UniversalForwarder').new({from: deployer});
    return artifacts.require('QUIDDMock').new(initialHolders, initialBalances, registry.address, forwarder.address, {from: deployer});
  },
};

describe('QUIDD', function () {
  this.timeout(0);

  const [deployer, other, bogus] = accounts;

  context('constructor', function () {
    it('it reverts with inconsistent arrays', async function () {
      await expectRevert(implementation.deploy([], [Two], deployer), implementation.revertMessages.InconsistentArrays);
      await expectRevert(implementation.deploy([other, other], [Two], deployer), implementation.revertMessages.InconsistentArrays);
    });
  });

  context('setTokenURI(string)', function () {
    beforeEach(async function () {
      this.token = await implementation.deploy([], [], deployer);
    });

    it('reverts if the sender is not the contract owner', async function () {
      await expectRevert(this.token.setTokenURI('http://testuri.com/', {from: other}), 'Ownable: not the owner');
    });

    it('sets the token URI', async function () {
      const tokenURI = 'http://testuri.com/';
      await this.token.setTokenURI(tokenURI, {from: deployer});
      (await this.token.tokenURI()).should.be.equal(tokenURI);
    });
  });

  context('_msgData()', function () {
    beforeEach(async function () {
      this.token = await implementation.deploy([], [], deployer);
    });
    it('call for 100% coverage', async function () {
      (await this.token.msgData()).should.not.be.empty;
    });
  });

  shouldBehaveLikeERC20(implementation);
});
