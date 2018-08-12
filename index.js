require("dotenv").config();
const configuration = require("./configuration");
const compression = require("compression");
const express = require("express");
const app = express();

app.use(compression());

const Promise = require("bluebird");

const meetup = require("meetup-api")({
  key: configuration.MEETUP_API_KEY
});

Promise.promisifyAll(Object.getPrototypeOf(meetup));

// reactnyc,vueJsNYC,NYC-JavaScript-Flatiron,NY-JavaScript,AngularNYC,QueensJS,JS-NY

// need to construct a data structure like following.
/*
  data: {
    url_name: {
      // result from "meetup.getGroups"
      group: {},
      // result from "meetup.getEvents"
      events: []
    },
    url_name: {
      // result from "meetup.getGroups"
      group: {},
      // result from "meetup.getEvents"
      events: []
    },
    ...
  }

*/

app.get("/", (req, res) => res.send("Hi3!!!"));
app.get("/groups/:group_urlname", async (req, res, next) => {
  const { group_urlname } = req.params;
  console.log(group_urlname);

  try {
    const { results: groups } = await meetup.getGroupsAsync({
      group_urlname
    });
    const groupIds = groups.map(_ => _.id);

    const { results: events } = await meetup.getEventsAsync({
      group_id: groupIds
    });
    console.log(events);
    res.send(events);
  } catch (e) {
    res.status(400).send(`Error while getting Group and Event details = ${e}`);
  }

  // const groups = groupResults.reduce((acc, group) => {
  //   acc[group.urlname] = group;
  //   return acc;
  // }, {});
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
