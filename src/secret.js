const azureIdentity = require("@azure/identity");
const azureKeyVault = require("@azure/keyvault-secrets");
const router = require("express").Router();

const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID;
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;

const credentials = new azureIdentity.DefaultAzureCredential({
  tenantId: AZURE_TENANT_ID,
  clientId: AZURE_CLIENT_ID,
  clientSecret: AZURE_CLIENT_SECRET,
});

const client = new azureKeyVault.SecretClient(
  "https://cactuskey.vault.azure.net/",
  credentials
);

const secretKeys = {
  azureClientSecret: "AZURE-CLIENT-SECRET",
  azureClientId: "AZURE-CLIENT-ID",
  azureTenantId: "AZURE-TENANT-ID",
  cosmosKey: "COSMOS-KEY",
  cosmosEndpoint: "COSMOS-ENDPOINT",
  keyVaultName: "KEY-VAULT-NAME",
  linkedInSecret: "LINKEDIN-SECRET",
  linkedInKey: "LINKEDIN-KEY",
  twitterConsumerSecret: "TWITTER-CONSUMER-SECRET",
  twitterConsumerKey: "TWITTER-CONSUMER-KEY",
  facebookAppSecret: "FACEBOOK-APP-SECRET",
  facebookAppId: "FACEBOOK-APP-ID",
  googleClientSecret: "Google-Client-Secret",
  googleClientId: "GoogleClientId",
};

router.get("/get-credentials", async (req, res) => {
  try {
    const secretValues = await Promise.all(
      Object.values(secretKeys).map((secretKey) => client.getSecret(secretKey))
    );

    const keys = Object.keys(secretKeys).reduce((acc, key, index) => {
      acc[key] = secretValues[index].value;
      return acc;
    }, {});

    res.json(keys);
  } catch (err) {
    res.status(400).json({ err });
    console.log(err);
  }
});

module.exports = router;
