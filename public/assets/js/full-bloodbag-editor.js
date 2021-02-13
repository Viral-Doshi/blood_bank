// update and delete records of full-bloodbag.html from here
function update_btn(){
  var inputs = document.getElementsByClassName("editable");
  for(let i =0;i<inputs.length;i++){
    inputs[i].disabled = true;
  }
  //update database here
  toggle(false);
}
function delete_btn(){
  var inputs = document.getElementsByClassName("editable");
  for(let i =0;i<inputs.length;i++){
    inputs[i].disabled = true;
  }
  toggle(false);
  if(confirm("Are you sure you want to DELETE this record?")) {
    //confirm and then delete from database
    //then close this tab, and refresh the previous tab which contains record
    window.close();
  }
  else{
    cancel_btn();
  }
}
function hide_fields() {

	if (!document.getElementById('don').checked){

		assign(document.getElementById("receiver-name"), "none");
		assign(document.getElementById("receiver-profile"), "none");
		assign(document.getElementById("receiver-date"), "none");
	}
	else{

		assign(document.getElementById("receiver-name"), "table-row");
		assign(document.getElementById("receiver-profile"), "table-row");
		assign(document.getElementById("receiver-date"), "table-row");

	}
}
hide_fields(); //initialize
