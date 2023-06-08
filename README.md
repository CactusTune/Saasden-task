# SAASDEN EXPRESS APPLICATION

This is a simple Express server that provides authentication using various social media platforms like Google, Facebook, Twitter, and LinkedIn. It also includes an API to fetch user statistics and retrieve secret keys & credentials.

## Cloning the repo

**NOTE:** Make sure you have Git installed on your system.

```bash
  # HTTPS
  $ git clone https://github.com/CactusTune/Saasden-task.git

  # SSH
  $ git clone git@github.com:CactusTune/Saasden-task.git

  $ cd Saasdenv2
```

## Running locally - Docker

### Prerequisites

Before the Docker build of the API can be run, make sure you have the following configured:

1. (Windows) Windows Subsystem for Linux is installed (instruction can be found
   [here](https://docs.microsoft.com/en-us/windows/wsl/install))

2. Have Docker Desktop installed ([Docker](https://www.docker.com/products/docker-desktop))

### Running the docker stack

For initial boot, run the following command in the root of the project

```bash
    $ docker build -t <image-name> .
    $ docker run -d -p 3000:3000 --env-file .env <image-name>
```


## Running locally - Manual

1. Clone this repository or download the source code.
2. Install the dependencies by running the following command: 
  ```bash
    $ npm install
  ```
3. Set up the required environment variables. Create a .env file in the root directory and add the following variables:
   PORT=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   FACEBOOK_APP_ID=
   FACEBOOK_APP_SECRET=
   TWITTER_CONSUMER_KEY=
   TWITTER_CONSUMER_SECRET=
   LINKEDIN_KEY=
   LINKEDIN_SECRET=
   KEY_VAULT_NAME=
   COSMOS_ENDPOINT=
   COSMOS_KEY=
   AZURE_TENANT_ID=
   AZURE_CLIENT_ID=
   AZURE_CLIENT_SECRET=

4. Start the server by running the following command: 
    ```bash
    $ npm run dev
    ```

5. ## HTTP API Endpoints
   ### HTTP Authentication Endpoints
   - [api](#api)
     - [Usage](#usage)
     - [HTTP API Endpoints](#http-api-endpoints)
       - [(/auth/google)]- Initiates the Google authentication process.
       - [(/auth/facebook)]-Initiates the Facebook authentication process.
       - [(/auth/twitter)]-Initiates the Twitter authentication process.
       - [(/auth/linkedin)]-Initiates the LinkedIn authentication process.

    ### HTTP Authentication Endpoints
      - [(/auth/google/callback)]-Callback URL for Google authentication.
      - [(/auth/facebook/callback)]-Callback URL for Facebook authentication.
      - [(/auth/twitter/callback)]-Callback URL for Twitter authentication.
      - [(/auth/linkedin/callback)]-Callback URL for LinkedIn authentication.

    ### Protected Endpoint
    - [(/auth/protected)]-The endpoint you are redirected to after login, requires authentication. Returns a greeting message along with user information and also stores users details in Azure Cosmos DB

    ### API Endpoints
    - [(/api/user-stats)]-Fetches user statistics from the database and returns the following information:
        numUsers - Total number of users.
        providers - Number of users by authentication provider.
        averageFriendsOrFollowers - Average number of friends or followers per user.
        locations - Number of users by location.   
    
    - [(/api/user-stats)]- Retrieves secret credentials from a Azure Key Vault and returns them in JSON format.

    ### Other endpoints
    - [(/)]-Home page that displays authentication options.
    - [(/auth/google/failure)]-Displayed when there is an error during the Google authentication process.
    - [(/logout)]-Logs out the user and destroys the session.





