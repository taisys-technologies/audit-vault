const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Setting", function () {
  let admin, user, tmp;
  let contract;
  const abi = ethers.utils.defaultAbiCoder;

  beforeEach(async function () {
    let contractFactory = await ethers.getContractFactory("Setting");

    [admin, user, tmp, ...signers] = await ethers.getSigners();
    let setter = [];

    // deploy
    contract = await upgrades.deployProxy(
      contractFactory,
      [admin.address, setter],
      {
        kind: "uups",
      }
    );
    await contract.deployed();
  });

  describe("setUint", function () {
    it("Positive/msgSenderIsEqual", async function () {
      // prepare and setUint
      let key = "setUint";
      let value = 1;
      let setUint = await contract.setUint(admin.address, key, value);
      await setUint.wait();

      let getUint = await contract.getUint(admin.address, key);
      let checkUint = await contract.checkUint(admin.address, key);
      let available = await contract.available(admin.address, key);

      expect(getUint).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkUint.value).to.be.equal(value);
      expect(checkUint.status).to.be.equal(true);
    });

    it("Positive/msgSenderHasRole", async function () {
      // grant Role to admin
      let batchGrantSetter = await contract.batchGrantSetter([admin.address]);
      await batchGrantSetter.wait();

      // prepare and setUint
      let key = "setUint";
      let value = 1;
      let setUint = await contract.setUint(user.address, key, value);
      await setUint.wait();

      let getUint = await contract.getUint(user.address, key);
      let checkUint = await contract.checkUint(user.address, key);
      let available = await contract.available(user.address, key);

      expect(getUint).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkUint.value).to.be.equal(value);
      expect(checkUint.status).to.be.equal(true);
    });

    it("Negative/FORBIDDEN", async function () {
      let key = "setUint";
      let value = 1;
      let setUint = contract.setUint(user.address, key, value);

      await expect(setUint).to.be.revertedWith("Setting_101");
    });
  });

  describe("setAddress", function () {
    it("Positive/msgSenderIsEqual", async function () {
      // prepare and setAddress
      let key = "setAddress";
      let value = tmp.address;
      let setAddress = await contract.setAddress(admin.address, key, value);
      await setAddress.wait();

      let getAddress = await contract.getAddress(admin.address, key);
      let checkAddress = await contract.checkAddress(admin.address, key);
      let available = await contract.available(admin.address, key);

      expect(getAddress).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkAddress.value).to.be.equal(value);
      expect(checkAddress.status).to.be.equal(true);
    });

    it("Positive/msgSenderHasRole", async function () {
      // grant Role to admin
      let batchGrantSetter = await contract.batchGrantSetter([admin.address]);
      await batchGrantSetter.wait();

      // prepare and setAddress
      let key = "setAddress";
      let value = tmp.address;
      let setAddress = await contract.setAddress(user.address, key, value);
      await setAddress.wait();

      let getAddress = await contract.getAddress(user.address, key);
      let checkAddress = await contract.checkAddress(user.address, key);
      let available = await contract.available(user.address, key);

      expect(getAddress).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkAddress.value).to.be.equal(value);
      expect(checkAddress.status).to.be.equal(true);
    });

    it("Negative/FORBIDDEN", async function () {
      let key = "setAddress";
      let value = tmp.address;
      let setAddress = contract.setAddress(user.address, key, value);

      await expect(setAddress).to.be.revertedWith("Setting_101");
    });
  });

  describe("setString", function () {
    it("Positive/msgSenderIsEqual", async function () {
      // prepare and setString
      let key = "setString";
      let value = "value";
      let setString = await contract.setString(admin.address, key, value);
      await setString.wait();

      let getString = await contract.getString(admin.address, key);
      let checkString = await contract.checkString(admin.address, key);
      let available = await contract.available(admin.address, key);

      expect(getString).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkString.value).to.be.equal(value);
      expect(checkString.status).to.be.equal(true);
    });

    it("Positive/msgSenderHasRole", async function () {
      // grant Role to admin
      let batchGrantSetter = await contract.batchGrantSetter([admin.address]);
      await batchGrantSetter.wait();

      // prepare and setString
      let key = "setString";
      let value = "value";
      let setString = await contract.setString(user.address, key, value);
      await setString.wait();

      let getString = await contract.getString(user.address, key);
      let checkString = await contract.checkString(user.address, key);
      let available = await contract.available(user.address, key);

      expect(getString).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkString.value).to.be.equal(value);
      expect(checkString.status).to.be.equal(true);
    });

    it("Negative/FORBIDDEN", async function () {
      let key = "setString";
      let value = "value";
      let setString = contract.setString(user.address, key, value);

      await expect(setString).to.be.revertedWith("Setting_101");
    });
  });

  describe("setInt", function () {
    it("Positive/msgSenderIsEqual", async function () {
      // prepare and setInt
      let key = "setInt";
      let value = -1;
      let setInt = await contract.setInt(admin.address, key, value);
      await setInt.wait();

      let getInt = await contract.getInt(admin.address, key);
      let checkInt = await contract.checkInt(admin.address, key);
      let available = await contract.available(admin.address, key);

      expect(getInt).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkInt.value).to.be.equal(value);
      expect(checkInt.status).to.be.equal(true);
    });

    it("Positive/msgSenderHasRole", async function () {
      // grant Role to admin
      let batchGrantSetter = await contract.batchGrantSetter([admin.address]);
      await batchGrantSetter.wait();

      // prepare and setInt
      let key = "setInt";
      let value = -1;
      let setInt = await contract.setInt(user.address, key, value);
      await setInt.wait();

      let getInt = await contract.getInt(user.address, key);
      let checkInt = await contract.checkInt(user.address, key);
      let available = await contract.available(user.address, key);

      expect(getInt).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkInt.value).to.be.equal(value);
      expect(checkInt.status).to.be.equal(true);
    });

    it("Negative/FORBIDDEN", async function () {
      let key = "setInt";
      let value = -1;
      let setInt = contract.setInt(user.address, key, value);

      await expect(setInt).to.be.revertedWith("Setting_101");
    });
  });

  describe("setBytes", function () {
    it("Positive/msgSenderIsEqual", async function () {
      // prepare and setBytes
      let key = "setBytes";
      let value = abi.encode(["uint", "string"], [1234, "Hello World"]);
      let setBytes = await contract.setBytes(admin.address, key, value);
      await setBytes.wait();

      let getBytes = await contract.getBytes(admin.address, key);
      let checkBytes = await contract.checkBytes(admin.address, key);
      let available = await contract.available(admin.address, key);

      expect(getBytes).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkBytes.value).to.be.equal(value);
      expect(checkBytes.status).to.be.equal(true);
    });

    it("Positive/msgSenderHasRole", async function () {
      // grant Role to admin
      let batchGrantSetter = await contract.batchGrantSetter([admin.address]);
      await batchGrantSetter.wait();

      // prepare and setBytes
      let key = "setBytes";
      let value = abi.encode(["uint", "string"], [1234, "Hello World"]);
      let setBytes = await contract.setBytes(user.address, key, value);
      await setBytes.wait();

      let getBytes = await contract.getBytes(user.address, key);
      let checkBytes = await contract.checkBytes(user.address, key);
      let available = await contract.available(user.address, key);

      expect(getBytes).to.be.equal(value);
      expect(available).to.be.equal(true);
      expect(checkBytes.value).to.be.equal(value);
      expect(checkBytes.status).to.be.equal(true);
    });

    it("Negative/FORBIDDEN", async function () {
      let key = "setBytes";
      let value = abi.encode(["uint", "string"], [1234, "Hello World"]);
      let setBytes = contract.setBytes(user.address, key, value);

      await expect(setBytes).to.be.revertedWith("Setting_101");
    });
  });

  describe("del", function () {
    it("Positive/msgSenderIsEqual", async function () {
      // prepare and setAddress
      let key = "delAddress";
      let value = tmp.address;
      let setAddress = await contract.setAddress(admin.address, key, value);
      await setAddress.wait();

      // delAddress
      let del = await contract.del(admin.address, key);
      await del.wait();

      let getAddress = await contract.getAddress(admin.address, key);
      let checkAddress = await contract.checkAddress(admin.address, key);
      let available = await contract.available(admin.address, key);

      expect(getAddress).to.be.equal(value);
      expect(available).to.be.equal(false);
      expect(checkAddress.value).to.be.equal(value);
      expect(checkAddress.status).to.be.equal(false);
    });

    it("Positive/msgSenderHasRole", async function () {
      // grant Role to admin
      let batchGrantSetter = await contract.batchGrantSetter([admin.address]);
      await batchGrantSetter.wait();

      // prepare and setAddress
      let key = "delAddress";
      let value = tmp.address;
      let setAddress = await contract.setAddress(user.address, key, value);
      await setAddress.wait();

      // delAddress
      let del = await contract.del(user.address, key);
      await del.wait();

      let getAddress = await contract.getAddress(user.address, key);
      let checkAddress = await contract.checkAddress(user.address, key);
      let available = await contract.available(user.address, key);

      expect(getAddress).to.be.equal(value);
      expect(available).to.be.equal(false);
      expect(checkAddress.value).to.be.equal(value);
      expect(checkAddress.status).to.be.equal(false);
    });

    it("Negative/FORBIDDEN", async function () {
      let key = "delAddress";
      let del = contract.del(user.address, key);

      await expect(del).to.be.revertedWith("Setting_101");
    });
  });
});
