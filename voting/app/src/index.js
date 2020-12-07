import Web3 from "web3";
import voting_artifacts from '../../build/contracts/Voting.json';

let candidates = {"张三": "candidate-1","李四":"candidate-2","王五": "candidate-3"}

const App = {
    web3: null,
    account: null,
    meta: null,

    init: async function () {
        const {web3} = this;

        try {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = voting_artifacts.networks[networkId];
            this.meta = new web3.eth.Contract (
                voting_artifacts.abi,
                deployedNetwork.address,
            );

            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];

            this.loadCurrentVoting();
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    loadCurrentVoting: async function () {
        let candidateNames = Object.keys(candidates);
        const { totalVotesFor } = this.meta.methods;

        for (var i = 0; i< candidateNames.length; i++) {
            let name = candidateNames[i];
            const v = await totalVotesFor(this.web3.utils.utf8ToHex(name)).call();

            $("#" + candidates[name]).html(v.toString());
        }
    },

    voteAction: async function (){
        let name = $("#candidate").val()
        const { voteForCandidate } = this.meta.methods;
        await voteForCandidate(this.web3.utils.utf8ToHex(name)).send ({ from: this.account});

        this.loadCurrentVoting();
    }
}

window.App = App;

$(document).ready(function() {
    if (window.ethereum) {
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    } else {
        console.warn(
            "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this 62  fallback when you deploy live",
        );
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
        );
    }

    App.init();
});