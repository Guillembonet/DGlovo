var DGlovo = artifacts.require("./DGlovo.sol");

module.exports = function(deployer) {
  deployer.deploy(DGlovo, "10000000000000000000" );
};
