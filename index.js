require("dotenv").config();
const configuration = require("./configuration");
const express = require("express");
const app = express();

const meetup = require("meetup-api")({
  key: configuration.MEETUP_API_KEY
});

// reactnyc,vueJsNYC,NYC-JavaScript-Flatiron,NY-JavaScript,AngularNYC,QueensJS,JS-NY

app.get("/", (req, res) => res.send("Hi3!!!"));
app.get("/groups/:group_urlname", (req, res, next) => {
  const { group_urlname } = req.params;
  console.log(group_urlname);
  // res.send(group_urlname);

  meetup.getGroups({ group_urlname }, function(err, resp) {
    console.log(err, resp);
    res.send(resp);
  });

  // next();
});
app.listen(3001, () => console.log("listening on port 3001"));

/*
  To Dos - brainstorm

  Get group info by group URL names
  Get events by group URL names

  Set up an http server (using express)
    Two end points
    1. Get Groups
    2. Get Events

  Enable cors


  Deploy it on Heroku
*/

// const groupNames = [
//   "reactnyc",
//   "vueJsNYC",
//   "NYC-JavaScript-Flatiron",
//   "NY-JavaScript",
//   "AngularNYC",
//   "QueensJS",
//   "JS-NYC"
// ];
// const groupArgs = { group_urlname: groupNames.join(",") };
// meetup.getGroups(groupArgs, function(err, resp) {
//   console.log(err, resp);
// });
