// define variables that reference elements on our page
var result;
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
  var loader = document.getElementById("loader");
  loader.style.display = "block";
  dreamsList.innerHTML = "";
  console.log("keyword:"+keyword+"&website="+website);
  fetch("/results?keyword="+keyword+"&website="+website+"&maxpage="+pages)
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    result = dreams.data;
    // debugger
    // dreams.data.forEach(function(item,i){
    //   const newListItem = document.createElement("li");
    //   newListItem.innerHTML = "Page Number "+(i+1);
    //   newListItem.classList = "page";
    //   dreamsList.appendChild(newListItem);
    //   item.forEach(appendNewDream)
    // });
    if(parseInt(dreams.page_number)==0 && parseInt(dreams.index)==0){
      document.getElementById("result").innerHTML = "Not found your website("+website+") for this keyword:"+keyword;
    }
    else{
      document.getElementById("result").innerHTML = "Result found in page number <strong>"+dreams.page_number+"</strong> at <strong>"+dreams.index+"th</strong> positon";

    }
    loader.style.display = "none";
    // csvGenerate();
  });
  
}
var csv;
function csvGenerate(){
  csv = "data:text/csv;charset=utf-8,";
  result.forEach(function(item,i){
    csv+=  "Page Number "+(i+1)+"\r\n";
    
    item.forEach(function(row){
      csv+=row+"\r\n";
    })
  });
  var encodedUri = encodeURI(csv);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "my_data.csv");
document.body.appendChild(link);
link.click();
link.remove();
}

