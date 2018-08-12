require("dotenv").config();
const configuration = require("./configuration");
const compression = require("compression");
const express = require("express");
const app = express();
const Promise = require("bluebird");

const meetup = require("meetup-api")({
  key: configuration.MEETUP_API_KEY
});

app.use(compression());

Promise.promisifyAll(Object.getPrototypeOf(meetup));

// reactnyc,vueJsNYC,NYC-JavaScript-Flatiron,NY-JavaScript,AngularNYC,QueensJS,JS-NY

// app.get("/", (req, res) => res.send("Hi3!!!"));

app.get("/groups/:group_urlname", async (req, res, next) => {
  const { group_urlname } = req.params;

  try {
    const { results: groupsResponse } = await meetup.getGroupsAsync({
      group_urlname
    });
    const groupIds = groupsResponse.map(_ => _.id);

    const { results: eventsResponse } = await meetup.getEventsAsync({
      group_id: groupIds
    });

    const data = groupsResponse.reduce((acc, group) => {
      const events = eventsResponse.filter(e => e.group.id === group.id);
      acc[group.urlname] = { group, events };
      return acc;
    }, {});

    res.send(data);
  } catch (e) {
    res.status(400).send(`Error while getting Group and Event details = ${e}`);
  }
});

app.listen(3001, () => console.log("listening on port 3001"));

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
