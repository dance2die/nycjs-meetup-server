require("dotenv").config();
const configuration = require("./configuration");
const meetup = require("meetup-api")({
  key: configuration.MEETUP_API_KEY
});

const groupNames = [
  "reactnyc",
  "vueJsNYC",
  "NYC-JavaScript-Flatiron",
  "NY-JavaScript",
  "AngularNYC",
  "QueensJS",
  "JS-NYC"
];
const groupArgs = { group_urlname: groupNames.join(",") };
meetup.getGroups(groupArgs, function(err, resp) {
  console.log(err, resp);
});
