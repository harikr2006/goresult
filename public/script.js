// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");

const dreamsForm = document.querySelector("form");
// a helper function that creates a list item for a given dream
function appendNewDream(dream) {
  const newListItem = document.createElement("li");
  const a = document.createElement("a");
  a.href = dream;
  a.innerHTML = dream;
  newListItem.appendChild(a);
  dreamsList.appendChild(newListItem);
}
dreamsForm.addEventListener("submit",function(e){
  e.preventDefault();
  fetchRecords(document.getElementById("dream").value,document.getElementById("website").value,document.getElementById("noofpages").value);
})
var firstTime = true;
// fetch the initial list of dreams
function fetchRecords(keyword,website,pages){
  dreamsList.innerHTML = "";
  console.log("keyword:"+keyword+"&website="+website);
  fetch("/results?keyword="+keyword+"&website="+website+"&maxpage="+pages)
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    dreams.forEach(function(item,i){
      const newListItem = document.createElement("li");
      newListItem.innerHTML = "Page Number "+(i+1);
      newListItem.classList = "page";
      dreamsList.appendChild(newListItem);
      item.forEach(appendNewDream)
    });
  });
}