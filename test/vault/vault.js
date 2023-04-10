const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const getTime = () => {
  return Math.floor(new Date() / 1000);
};

describe("Vault", function () {
  let admin, to, trustedTo, setter, noLimitTransfer, smallTransfer, tmp;
  let contract, erc20, setting;
  const OPCODE = "opcode";
  const PREFIX = "prefix";
  const max_amount_per_count = ethers.utils.parseUnits("100");
  const max_amount_per_day = ethers.utils.parseUnits("500");
  const max_count_per_day = 10;
  const large_amount = ethers.utils.parseUnits("200");
  const limit = {
    max_amount_per_count,
    max_amount_per_day,
    max_count_per_day,
    large_amount,
  };
  const STRING = [
    "max_amount_per_count",
    "max_amount_per_day",
    "max_count_per_day",
    "large_amount",
  ];
  const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
  let erc20Arr = [];
  let toArr = [];
  let trustedToArr = [];
  let tmpArr = [];
  let setterArr = [];
  let toTree, trustedToTree, tmpTree;

  beforeEach(async function () {
    let contractFactory = await ethers.getContractFactory("Vault");
    let settingFactory = await ethers.getContractFactory("Setting");
    let erc20Factory = await ethers.getContractFactory(
      "contracts/vault/mocks/ERC20Mock.sol:ERC20Mock"
    );

    [
      admin,
      to,
      trustedTo,
      setter,
      noLimitTransfer,
      smallTransfer,
      tmp,
      ...signers
    ] = await ethers.getSigners();

    // deploy erc20
    erc20 = await erc20Factory.deploy();
    await erc20.deployed();
    erc20Arr[0] = erc20.address;
    toArr = await generateForTree(5);
    toArr.unshift([to.address]);
    trustedToArr = await generateForTree(5);
    trustedToArr.unshift([trustedTo.address]);
    tmpArr = await generateForTree(5);
    tmpArr.unshift([tmp.address]);

    // deploy Setting contract
    setting = await upgrades.deployProxy(
      settingFactory,
      [admin.address, setterArr],
      {
        kind: "uups",
      }
    );
    await setting.deployed();

    // prepare merkle tree for toList and trustedToList
    toTree = StandardMerkleTree.of(toArr, ["address"]);
    trustedToTree = StandardMerkleTree.of(trustedToArr, ["address"]);
    tmpTree = StandardMerkleTree.of(tmpArr, ["address"]);

    // deploy
    contract = await contractFactory.deploy(
      admin.address,
      [setter.address],
      [noLimitTransfer.address],
      [smallTransfer.address],
      setting.address,
      admin.address, // param => multisig
      PREFIX,
      erc20Arr,
      toTree.root,
      trustedToTree.root
    );
    await contract.deployed();

    // mint to vault
    let mint = await erc20.mint(
      contract.address,
      ethers.utils.parseUnits("100000000")
    );
    await mint.wait();

    // set info to setting
    for (let i = 0; i < STRING.length; i++) {
      let setUint = await setting.setUint(
        admin.address,
        `${PREFIX}_${erc20.address.toLowerCase()}_${STRING[i]}`,
        limit[STRING[i]]
      );
      await setUint.wait();
    }
  });

  const createErc20 = async (size) => {
    let erc20Factory = await ethers.getContractFactory(
      "contracts/vault/mocks/ERC20Mock.sol:ERC20Mock"
    );
    let res = [];
    for (let i = 0; i < size; i++) {
      // deploy erc20
      let erc20 = await erc20Factory.deploy();
      await erc20.deployed();
      res.push(erc20.address);
    }
    return res;
  };

  // generate signer
  const generateSigner = async () => {
    let user = ethers.Wallet.createRandom();
    user = user.connect(ethers.provider);

    // give user token
    await network.provider.send("hardhat_setBalance", [
      user.address,
      ethers.utils.parseEther("10").toHexString(),
    ]);

    return user;
  };

  const generateMultipleSigner = async (size) => {
    let res = [];
    for (let i = 0; i < size; i++) {
      let user = await generateSigner();
      res.push(user.address);
    }
    return res;
  };

  const generateForTree = async (size) => {
    let res = [];
    for (let i = 0; i < size; i++) {
      let user = await generateSigner();
      res.push([user.address]);
    }
    return res;
  };

  describe("addErc20List", function () {
    it("Positive", async function () {
      let erc20List = await createErc20(1);
      let addErc20List = await contract
        .connect(setter)
        .addErc20List(erc20List[0]);
      await addErc20List.wait();

      let getErc20List = await contract.getErc20List();
      let duErc20Arr = erc20Arr.concat(erc20List);

      getErc20List.forEach((item, index) => {
        expect(item).to.be.equal(duErc20Arr[index]);
      });
    });

    it("Negative/ZERO_ADDRESS", async function () {
      let addErc20List = contract.connect(setter).addErc20List(EMPTY_ADDRESS);

      await expect(addErc20List).to.be.revertedWith("Vault_001");
    });

    it("Negative/DUPLICATED_ADDRESS", async function () {
      let addErc20List = contract.connect(setter).addErc20List(erc20.address);

      await expect(addErc20List).to.be.revertedWith("Vault_102");
    });

    it("Negative/LIST_EXCEED_LENGTH_LIMIT", async function () {
      let addrList = await generateMultipleSigner(20);
      let setErc20List = await contract.connect(setter).setErc20List(addrList);
      await setErc20List.wait();

      let addErc20List = contract.connect(setter).addErc20List(tmp.address);

      await expect(addErc20List).to.be.revertedWith("Vault_109");
    });
  });

  describe("delErc20List", function () {
    it("Positive", async function () {
      let Erc20 = await contract.connect(setter).delErc20List(erc20.address);
      await Erc20.wait();

      let getErc20List = await contract.getErc20List();

      expect(getErc20List.length).to.be.equal(0);
    });
  });

  describe("setErc20List", function () {
    it("Positive", async function () {
      let erc20List = await createErc20(20);
      let setErc20List = await contract.connect(setter).setErc20List(erc20List);
      await setErc20List.wait();

      let getErc20List = await contract.getErc20List();

      getErc20List.forEach((item, index) => {
        expect(item).to.be.equal(erc20List[index]);
      });
    });

    it("Negative/LIST_TO_LONG", async function () {
      let erc20List = await createErc20(21);
      let setErc20List = contract.connect(setter).setErc20List(erc20List);

      await expect(setErc20List).to.be.revertedWith("Vault_101");
    });
  });

  describe("setToListMerkleRoot", function () {
    it("Positive", async function () {
      let addrList = await generateForTree(20);
      let newToTree = StandardMerkleTree.of(addrList, ["address"]);
      let setToListMerkleRoot = await contract
        .connect(setter)
        .setToListMerkleRoot(newToTree.root);
      await setToListMerkleRoot.wait();

      let getToListMerkleRoot = await contract.getToListMerkleRoot();

      expect(getToListMerkleRoot).to.be.equal(newToTree.root);
    });
  });

  describe("setTrustedToListMerkleRoot", function () {
    it("Positive", async function () {
      let addrList = await generateForTree(20);
      let newTrustedToTree = StandardMerkleTree.of(addrList, ["address"]);
      let setTrustedToListMerkleRoot = await contract
        .connect(setter)
        .setTrustedToListMerkleRoot(newTrustedToTree.root);
      await setTrustedToListMerkleRoot.wait();

      let getTrustedToListMerkleRoot =
        await contract.getTrustedToListMerkleRoot();

      expect(getTrustedToListMerkleRoot).to.be.equal(newTrustedToTree.root);
    });
  });

  describe("setConfigAddress", function () {
    it("Positive", async function () {
      let setConfigAddress = await contract
        .connect(setter)
        .setConfigAddress(tmp.address);
      await setConfigAddress.wait();

      let config = await contract.config();

      expect(config).to.be.equal(tmp.address);
    });

    it("Negative/ZERO_ADDRESS", async function () {
      let setConfigAddress = contract
        .connect(setter)
        .setConfigAddress(EMPTY_ADDRESS);

      await expect(setConfigAddress).to.be.revertedWith("Vault_001");
    });
  });

  describe("setParamAddress", function () {
    it("Positive", async function () {
      let setParamAddress = await contract
        .connect(setter)
        .setParamAddress(tmp.address);
      await setParamAddress.wait();

      let param = await contract.param();

      expect(param).to.be.equal(tmp.address);
    });

    it("Negative/ZERO_ADDRESS", async function () {
      let setParamAddress = contract
        .connect(setter)
        .setParamAddress(EMPTY_ADDRESS);

      await expect(setParamAddress).to.be.revertedWith("Vault_001");
    });
  });

  describe("transfer", function () {
    it("Positive/user", async function () {
      let amount = ethers.utils.parseUnits("1");
      const toProof = toTree.getProof([to.address]);
      const tmpProof = tmpTree.getProof([tmp.address]);

      let transfer = await contract
        .connect(smallTransfer)
        .transfer(to.address, erc20.address, amount, OPCODE, toProof, tmpProof);
      await transfer.wait();

      let getStatus = await contract.getStatus(
        to.address,
        erc20.address,
        getTime()
      );
      let balanceOf = await erc20.balanceOf(to.address);

      expect(getStatus.frequency).to.be.equal(max_count_per_day - 1);
      expect(getStatus.amount).to.be.equal(max_amount_per_day.sub(amount));
      expect(balanceOf).to.be.equal(amount);
    });

    it("Positive/user/toListIsZero", async function () {
      let amount = ethers.utils.parseUnits("1");
      const toProof = toTree.getProof([to.address]);
      const tmpProof = tmpTree.getProof([tmp.address]);

      // set toList to bytes(0)
      let setToListMerkleRoot = await contract
        .connect(setter)
        .setToListMerkleRoot(ethers.constants.HashZero);

      let transfer = await contract
        .connect(smallTransfer)
        .transfer(
          tmp.address,
          erc20.address,
          amount,
          OPCODE,
          toProof,
          tmpProof
        );
      await transfer.wait();

      let getStatus = await contract.getStatus(
        tmp.address,
        erc20.address,
        getTime()
      );
      let balanceOf = await erc20.balanceOf(tmp.address);

      expect(getStatus.frequency).to.be.equal(max_count_per_day - 1);
      expect(getStatus.amount).to.be.equal(max_amount_per_day.sub(amount));
      expect(balanceOf).to.be.equal(amount);
    });

    it("Positive/includedInTrustedTo", async function () {
      let amount = large_amount;
      const trustedToProof = trustedToTree.getProof([trustedTo.address]);
      const tmpProof = tmpTree.getProof([tmp.address]);

      let transfer = await contract
        .connect(trustedTo)
        .transfer(
          trustedTo.address,
          erc20.address,
          amount,
          OPCODE,
          tmpProof,
          trustedToProof
        );
      await transfer.wait();

      let balanceOf = await erc20.balanceOf(trustedTo.address);

      expect(balanceOf).to.be.equal(amount);
    });

    it("Positive/hasNoLimitTransfer", async function () {
      let amount = large_amount;
      const toProof = toTree.getProof([to.address]);
      const trustedToProof = trustedToTree.getProof([trustedTo.address]);

      let transfer = await contract
        .connect(noLimitTransfer)
        .transfer(
          tmp.address,
          erc20.address,
          amount,
          OPCODE,
          trustedToProof,
          toProof
        );
      await transfer.wait();

      let balanceOf = await erc20.balanceOf(tmp.address);

      expect(balanceOf).to.be.equal(amount);
    });

    it("Negative/NOT_SUPPORTED_ERC20", async function () {
      let delErc20List = await contract
        .connect(setter)
        .delErc20List(erc20.address);
      let amount = ethers.utils.parseUnits("1");
      const toProof = toTree.getProof([to.address]);
      const trustedToProof = trustedToTree.getProof([trustedTo.address]);

      let transfer = contract
        .connect(to)
        .transfer(
          to.address,
          erc20.address,
          amount,
          OPCODE,
          trustedToProof,
          toProof
        );

      await expect(transfer).to.be.revertedWith("Vault_103");
    });

    it("Negative/INVALID_TRANSFER/largeAmount = 0", async function () {
      let del = await setting.del(
        admin.address,
        `${PREFIX}_${erc20.address.toLowerCase()}_${STRING[3]}`
      );
      await del.wait();

      let amount = ethers.utils.parseUnits("1");
      const toProof = toTree.getProof([to.address]);
      const trustedToProof = trustedToTree.getProof([trustedTo.address]);

      let transfer = contract
        .connect(smallTransfer)
        .transfer(
          to.address,
          erc20.address,
          amount,
          OPCODE,
          trustedToProof,
          toProof
        );

      await expect(transfer).to.be.revertedWith("Vault_104");
    });

    it("Negative/INVALID_TRANSFER/equalToLargeAmount", async function () {
      let amount = large_amount;
      const toProof = toTree.getProof([to.address]);
      const trustedToProof = trustedToTree.getProof([trustedTo.address]);

      let transfer = contract
        .connect(smallTransfer)
        .transfer(
          to.address,
          erc20.address,
          amount,
          OPCODE,
          trustedToProof,
          toProof
        );

      await expect(transfer).to.be.revertedWith("Vault_104");
    });

    it("Negative/INVALID_TO_ADDRESS", async function () {
      let amount = ethers.utils.parseUnits("1");
      const toProof = toTree.getProof([to.address]);
      const tmpProof = tmpTree.getProof([tmp.address]);

      let transfer = contract
        .connect(smallTransfer)
        .transfer(
          tmp.address,
          erc20.address,
          amount,
          OPCODE,
          toProof,
          tmpProof
        );

      await expect(transfer).to.be.revertedWith("Vault_105");
    });

    it("Negative/OVER_MAX_AMOUNT_PER_COUNT", async function () {
      let amount = max_amount_per_count.add(ethers.utils.parseUnits("1"));
      const toProof = toTree.getProof([to.address]);
      const tmpProof = tmpTree.getProof([tmp.address]);

      let transfer = contract
        .connect(smallTransfer)
        .transfer(to.address, erc20.address, amount, OPCODE, toProof, tmpProof);

      await expect(transfer).to.be.revertedWith("Vault_106");
    });

    it("Negative/OVER_MAX_AMOUNT_PER_DAY", async function () {
      let amount = max_amount_per_count;
      const toProof = toTree.getProof([to.address]);
      const tmpProof = tmpTree.getProof([tmp.address]);

      for (let i = 0; i < 5; i++) {
        let tx = await contract
          .connect(smallTransfer)
          .transfer(
            to.address,
            erc20.address,
            amount,
            OPCODE,
            toProof,
            tmpProof
          );
        await tx.wait();
      }

      let transfer = contract
        .connect(smallTransfer)
        .transfer(to.address, erc20.address, amount, OPCODE, toProof, tmpProof);

      await expect(transfer).to.be.revertedWith("Vault_107");
    });

    it("Negative/OVER_MAX_COUNT_PER_DAY", async function () {
      let amount = ethers.utils.parseEther("1");
      const toProof = toTree.getProof([to.address]);
      const tmpProof = tmpTree.getProof([tmp.address]);

      for (let i = 0; i < max_count_per_day; i++) {
        let tx = await contract
          .connect(smallTransfer)
          .transfer(
            to.address,
            erc20.address,
            amount,
            OPCODE,
            toProof,
            tmpProof
          );
        await tx.wait();
      }

      let transfer = contract
        .connect(smallTransfer)
        .transfer(to.address, erc20.address, amount, OPCODE, toProof, tmpProof);

      await expect(transfer).to.be.revertedWith("Vault_108");
    });

    it("Negative/FORBIDDEN", async function () {
      let amount = ethers.utils.parseUnits("1");
      const toProof = toTree.getProof([to.address]);
      const tmpProof = tmpTree.getProof([tmp.address]);

      let transfer = contract
        .connect(tmp)
        .transfer(to.address, erc20.address, amount, OPCODE, toProof, tmpProof);

      await expect(transfer).to.be.revertedWith("Vault_110");
    });
  });
});
