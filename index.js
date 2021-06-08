const express = require("express");
const app = express();
var Nightmare = require("nightmare");
var vo = require("vo");
var foundIndex = 0;
var port = process.env.PORT || 9000;
app.use(express.static("public"));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.get("/results", async (request, response) => {
  console.log("keyword:" + request.query.keyword);
  const nightmare = Nightmare({ show: true });
  var elements = new Array();
  vo(run(request, response))(function (err, result) {
    if (err) throw err;
  });
});
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
function* run(request, response) {
  var nightmare = Nightmare(),
    MAX_PAGE = parseInt(request.query.maxpage),
    currentPage = 0,
    nextExists = true,
    links = [];

  yield nightmare
    .goto("http://www.google.com")
    .wait('input[title="Search"]')
    .click('input[title="Search"]')
    .type('input[title="Search"]', request.query.keyword)
    .click('input[name="btnK"]')
    .wait(2000);
  nextExists = yield nightmare.visible("#pnnext");
  while (nextExists && currentPage < MAX_PAGE) {
    if (
      request.query.website != null &&
      request.query.website != "" &&
      request.query.website != undefined &&
      links[currentPage - 1] != undefined &&
      arrayContains(links[currentPage - 1], request.query.website)
    ) {
      yield nightmare.end();
      response.send({
        data: links,
        page_number: currentPage,
        index: foundIndex + 1,
      });
    } else {
      links.push(
        yield nightmare.evaluate(function () {
          var linkArray = [];
          document
            .querySelectorAll("#search  #rso .g  div > div > a")
            .forEach((i) => linkArray.push(i.href));
          return linkArray;
        })
      );
      yield nightmare.click("#pnnext").wait(2000);
    }
    currentPage++;
    nextExists = yield nightmare.visible("#pnnext");
  }
  yield nightmare.end();
  response.send({ data: links, page_number: 0, index: 0 });
}
function arrayContains(array, word) {
  var isContains = false;
  array.forEach((i, j) => {
    if (i.indexOf(word) != -1) {
      isContains = true;
      foundIndex = j;
    }
  });
  return isContains;
}
