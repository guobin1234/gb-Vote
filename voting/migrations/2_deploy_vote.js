var Voting = artifacts.require("./Voting.sol");
module.exports = function(deployer) {
    deployer.deploy(Voting,[web3.utils.utf8ToHex('张三'),
    web3.utils.utf8ToHex('李四'),web3.utils.utf8ToHex('王五')]);
};