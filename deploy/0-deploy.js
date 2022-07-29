module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy, log} = deployments
  const {account_owner} = await getNamedAccounts()
  log("Deploying DiscoveryDEXToken")
  await deploy('DiscoveryDEXToken', {
    from: account_owner,
    args: [],
    log: true
  })
}
module.exports.tags = ['DiscoveryDEXToken']