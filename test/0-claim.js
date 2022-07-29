const {ethers, getNamedAccounts} = require('hardhat')
const {expect} = require('chai')

const approval_amt = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

describe("Claiming", () => {

    const setup = async function(amount) {
        const {account_owner, account_user, account_invalid_user} = await getNamedAccounts()
    
        const factory = await ethers.getContractFactory("DiscoveryDEXToken", account_owner)
        const token_contract = await factory.deploy(amount)
        await token_contract.deployed()
    
        return {
            token_contract: token_contract,
            account_owner: await ethers.getSigner(account_owner),
            account_user: await ethers.getSigner(account_user),
            account_invalid_user: await ethers.getSigner(account_invalid_user)
        }
    }
    
    it("Should mint the crowdsale reserves to contract owner address", async () => {
        const {token_contract, account_owner} = await setup(999999)
        const balance = await token_contract.balanceOf(account_owner.address)
        expect(balance).to.equal(999999)
    })

    it("Should allow user to claim tokens", async () => {
        const setupAmount = 100
        const signedAmount = 1000
        const {token_contract, account_owner, account_user} = await setup(setupAmount)
        const hash = ethers.utils.solidityKeccak256(["uint", "address"], [signedAmount, account_user.address])
        const sig = await account_owner.signMessage(ethers.utils.arrayify(hash))
        await token_contract.connect(account_user).claimTick(signedAmount, sig)
        const balance = await token_contract.balanceOf(account_user.address)
        expect(balance).to.equal(signedAmount)
        const total = await token_contract.totalSupply()
        expect(total).to.equal(setupAmount + signedAmount)
    })
    
    it("Should not allow user to claim incorrect amount", async () => {
        const setupAmount = 100
        const signedAmount = 1000
        const requestAmount = 1001
        const {token_contract, account_owner, account_user} = await setup(setupAmount)
        const hash = ethers.utils.solidityKeccak256(["uint", "address"], [signedAmount, account_user.address])
        const sig = await account_owner.signMessage(ethers.utils.arrayify(hash))
        await expect(token_contract.connect(account_user).claimTick(requestAmount, sig)).to.be.revertedWith("invalid claim signature")
        const balance = await token_contract.balanceOf(account_user.address)
        expect(balance).to.equal(0)
        const total = await token_contract.totalSupply()
        expect(total).to.equal(setupAmount)
    })
    
    it("Should not allow incorrect user to claim a signed amount intended for someone else", async () => {
        const setupAmount = 100
        const signedAmount = 1000
        const {token_contract, account_owner, account_user, account_invalid_user} = await setup(setupAmount)
        const hash = ethers.utils.solidityKeccak256(["uint", "address"], [signedAmount, account_user.address])
        const sig = await account_owner.signMessage(ethers.utils.arrayify(hash))
        await expect(token_contract.connect(account_invalid_user).claimTick(signedAmount, sig)).to.be.revertedWith("invalid claim signature")
        const balance = await token_contract.balanceOf(account_user.address)
        expect(balance).to.equal(0)
        const balance2 = await token_contract.balanceOf(account_invalid_user.address)
        expect(balance2).to.equal(0)
        const total = await token_contract.totalSupply()
        expect(total).to.equal(setupAmount)
    })
    
})