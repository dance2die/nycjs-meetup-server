require("dotenv").config();
const configuration = require("./configuration");
const compression = require("compression");
const express = require("express");
const app = express();
const Promise = require("bluebird");
const cors = require("cors");

// https://m4xq07441x.codesandbox.io
// https://arjunphp.com/enable-cors-express-js/
// var allowedOrigins = ["https://m4xq07441x.codesandbox.io"];

let allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    // some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
    origin: function(origin, callback) {
      // allow requests with no origin

      // (like mobile apps or curl requests)

      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";

        return callback(new Error(msg), false);
      }

      return callback(null, true);
    }
  })
);
// const corsOptions = {
//   origin: "*",
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

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

app.listen(configuration.PORT, () =>
  console.log(`listening on port ${configuration.PORT}`)
);

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
