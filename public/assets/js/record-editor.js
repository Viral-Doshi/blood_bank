//utility functions and restore default input values
function assign(ele, data){ //assign if element is not null
  if(ele){
    ele.style.display = data;
  }
}

assign(document.getElementById("btn-update"), "none");
assign(document.getElementById("btn-cancel"), "none");
assign(document.getElementById("btn-delete"), "none");

var input_values; //used to restore values on cancel

function toggle(on){
  assign(document.getElementById("btn-edit"), on ? "none":"block");
  assign(document.getElementById("btn-submit"), on ? "none":"block");
  assign(document.getElementById("btn-update"), on ? "block":"none");
  assign(document.getElementById("btn-cancel"),  on ? "block":"none");
  assign(document.getElementById("btn-delete"), on ? "block":"none");
}
function edit_btn(class_name="editable") {
    var inputs = document.getElementsByClassName(class_name);
    input_values = []; //empty
    for(let i=0;i<inputs.length;i++){
      if(inputs[i].type=='radio'){
        input_values.push(inputs[i].checked);
      }
      else{
        input_values.push(inputs[i].value);
      }
      inputs[i].disabled = false;
    }
    toggle(true);
}
function cancel_btn(){
  var inputs = document.getElementsByClassName("editable");
  for(let i =0;i<inputs.length;i++){
    if(inputs[i].type=='radio'){
      inputs[i].checked=input_values[i];
    }
    else{
      inputs[i].value = input_values[i];
    }
    inputs[i].disabled = true;
  }
  toggle(false);
}

function toggle_class(class_name, value){
  var ele = document.getElementsByClassName(class_name);
  for(let i=0;i<ele.length;i++){
    ele[i].style.display = value;
  }
}

function toggle_required(class_name, value){
    var ele = document.getElementsByClassName(class_name);
    for(let i=0;i<ele.length;i++){
      ele[i].required = value;
    }
}
