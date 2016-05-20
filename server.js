var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
  id: 1,
  description: "piscine",
  completed: false
},{
  id: 2,
  description: "france loisir",
  completed: false
},{
  id: 3,
  description: "foutu jardin",
  completed: true
}];

app.get("/", function(req, res){
  res.send("Todo API Root");
});

app.get("/todos", function(req,res){
  res.json(todos);
});

app.get("/todo/:id", function(req,res){
  var id = req.params.id;
  var todo = todos.find(function(item){return item.id == id; });
  if(todo) res.json(todo);
  else res.status(404).send();
});





app.listen(PORT, function(){
  console.log(`Express listening on port ${PORT}`);
});
