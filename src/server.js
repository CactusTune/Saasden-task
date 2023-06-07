const express = require("express");
require("dotenv").config();
require("./auth");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const createContainer = require("./db");

const app = express();

app.use(express.json());

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(cors());

app.use(
  session({
    secret: "My secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["user_friends", "manage_pages"] })
);

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "LSKJFW " }),
  function (req, res) {}
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/auth/protected");
  }
);

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/auth/protected");
  }
);

app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/auth/protected",
    failureRedirect: "/",
  })
);

app.get("/auth/protected", isLoggedIn, async (req, res) => {
  try {
    const user = {
      id: req.user.id, // Assuming the user has an ID property
      displayName: req.user.displayName,
      provider: req.user.provider,
      followers: req.user._json.followers_count,
      location: req.user._json.location,
    };

    const container = await createContainer(); // Get the container object
    console.log(req.user);

    const { resource: createdUser } = await container.items.create(user); // Create the user document

    console.log("User data stored in Azure Cosmos DB:", createdUser);

    res.send(`Hello ${req.user.displayName}`);
  } catch (error) {
    console.error("Error storing user data:", error);
    res.status(500).json({ error: "Failed to store user data" });
  }
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Something went wrong!");
});

app.get("/", (req, res) => {
  res.send(`
      <a href="/auth/google">Authenticate with Google</a>
      <br>
      <a href="/auth/facebook">Authenticate with Facebook</a>
      <br>
      <a href="/auth/twitter">Authenticate with Twitter</a>
      <br>
      <a href="/auth/linkedin">Authenticate with LinkedIn</a>
    `);
});

app.get("/api/user-stats", async (req, res) => {
  try {
    const container = await createContainer();
    const { resources: users } = await container.items
      .query("SELECT * FROM c")
      .fetchAll();

    const numUsers = users.length;
    const providers = {};
    let totalFriendsOrFollowers = 0;
    const locations = {};

    users.forEach((user) => {
      const { provider, followers, location } = user;
      providers[provider] = providers[provider] ? providers[provider] + 1 : 1;
      totalFriendsOrFollowers = followers;
      locations[location] = locations[location] ? locations[location] + 1 : 1;
    });

    const averageFriendsOrFollowers = totalFriendsOrFollowers / numUsers;

    const stats = {
      numUsers,
      providers,
      averageFriendsOrFollowers,
      locations,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Goodbye!");
});

app.listen(3000, () => {
  console.log("server started on 3000");
});
