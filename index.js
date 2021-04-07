const express = require("express");
const app = express();
var Nightmare = require('nightmare');
var vo = require('vo');





app.use(express.static("public"));


app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.get("/results", async (request, response) => {
  console.log("keyword:"+request.query.keyword);
  const nightmare = Nightmare({ show: true });
  var elements = new Array();
  
  // await nightmare
  //   .goto("https://google.com")
  //   .type('[title="Search"]',request.query.keyword)
  //   .type('[title="Search"]', "\u000d")
  //   .wait("#search  #rso")
  //   .evaluate(function() {
  //     document
  //       .querySelectorAll("#search  #rso .g  div > div > a")
  //       .forEach(i => elements.push(i.href));
  //     return elements;
  //   })
  //   .end()
  //   .then(elements => {
  //     console.log(elements);
  //     response.send(elements);
  //   })
  //   .catch(error => {
  //     response.send({ "Search failed": "error" });
  //   });

  vo(run(request,response))(function(err, result) {
    if (err) throw err;
});

});


const listener = app.listen( 2350, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


function* run(request,response) {
  var nightmare = Nightmare(), 
      MAX_PAGE = request.query.maxpage, 
      currentPage = 0, 
      nextExists = true, 
      links = []; 

  yield nightmare 
      .goto('http://www.google.com')
      .wait('input[title="Search"]')
      .click('input[title="Search"]')
      .type('input[title="Search"]', request.query.keyword)
      .click('input[name="btnK"]') 
      .wait(2000)

  nextExists = yield nightmare.visible('#pnnext'); 

  while (nextExists && currentPage < MAX_PAGE) { 
      links.push(yield nightmare 
          .evaluate(function() { 
              var linkArray = [];
              document.querySelectorAll('#search  #rso .g  div > div > a').forEach(i => linkArray.push(i.href));
              return linkArray; 
          })); 

      yield nightmare 
          .click('#pnnext')
          .wait(2000)

      currentPage++; 
      nextExists = yield nightmare.visible('#pnnext'); 
  } 

  
  yield nightmare.end(); 
  response.send(links);
} 