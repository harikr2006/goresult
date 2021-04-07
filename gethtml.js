const Nightmare = require("nightmare");
const nightmare = Nightmare({show:true});

nightmare.goto('https://google.com')
.type('[title="Search"]', 'tnpsc books')
.type('[title="Search"]', '\u000d')
.wait('#search  #rso')
.evaluate(function(){
    // var elements = Array.from(document.querySelectorAll('#search  #rso .g  div > div > a').forEach(i=>i.href));
    var elements = Array();

    document.querySelectorAll('#search  #rso .g  div > div > a').forEach(i=> elements.push(i.href));
    return elements;
})
  .end()
  .then((href)=>{

    console.log(href);
  })
  .catch(error => {
    console.error('Search failed:', error)
  });