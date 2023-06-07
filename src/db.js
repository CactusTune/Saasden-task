const CosmosClient = require("@azure/cosmos").CosmosClient;
require("dotenv").config();

const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;

// Set Database name and container name
const databaseName = "saasdendb";
const containerName = `saasdenCtn1686013653198`;
const partitionKeyPath = "/id";

async function createContainer() {
  const client = new CosmosClient({ endpoint, key });
  const { database } = await client.databases.createIfNotExists({
    id: databaseName,
  });
  console.log(`${database.id} database ready`);
  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: {
      paths: [partitionKeyPath],
    },
  });
  console.log(`Container '${container.id}'ready.`);
  return container;
}

createContainer().catch((error) => {
  console.error("Error creating container:", error);
});

module.exports = createContainer;
