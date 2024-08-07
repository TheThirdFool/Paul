
// This is a javascript file to run the seating plan.

// Guest class


class Guest {

	// Name;
	// ID;
	// Table;
	// SeatNumber;
	
	PeopleTheyLike    = [];
	PeopleTheyDislike = [];

	NumberOfLikes = 0;
	NumberOfDislikes = 0;

	IDsTheyLike    = [];
	IDsTheyDislike = [];

	Happiness = 0;
	xPos      = 0;
	yPos      = 0;

	IDBitMask       = 0;
	LikesBitMask    = 0;
	DislikesBitMask = 0;

	constructor(inName, inID){
		this.Name = inName;
		this.ID   = inID; 
		this.IDBitMask = (1 << this.ID)
	}	

	AddLike(inLikeName, inLikeID){
		this.PeopleTheyLike.push( inLikeName );
		this.IDsTheyLike.push(    inLikeID   );

		this.LikesBitMask = this.LikesBitMask | (1 << inLikeID);
		this.NumberOfLikes++;
	}
	AddLike(inGuest){
		this.PeopleTheyLike.push( inGuest.Name );
		this.IDsTheyLike.push(    inGuest.ID   );

		this.LikesBitMask = this.LikesBitMask | (1 << inGuest.ID);
		this.NumberOfLikes++;
	}

	AddDislike(inDislikeName, inDislikeID){
		this.PeopleTheyDislike.push( inDislikeName );
		this.IDsTheyDislike.push(    inDislikeID   );

		this.DislikesBitMask = this.DislikesBitMask | (1 << inDislikeID);
		this.NumberOfDislikes++;
	}
	AddDislike(inGuest){
		this.PeopleTheyDislike.push( inGuest.Name );
		this.IDsTheyDislike.push(    inGuest.ID   );

		this.DislikesBitMask = this.DislikesBitMask | (1 << inGuest.ID);
		this.NumberOfDislikes++;
	}

	PrintLikes(){
		console.log(this.dec2bin(this.IDBitMask));
		console.log("Likes:");
		for(let i = 0; i < this.PeopleTheyLike.length; i++){
			console.log(this.PeopleTheyLike[i]);
		}

		console.log(this.dec2bin(this.LikesBitMask));

		console.log("Dislikes:");
		for(let i = 0; i < this.PeopleTheyDislike.length; i++){
			console.log(this.PeopleTheyDislike[i]);
		}

		console.log(this.dec2bin(this.DislikesBitMask));
	}

	Likes( otherGuest ){
		if(otherGuest.IDBitMask == (this.LikesBitMask & otherGuest.IDBitMask)) {
			return true;
		} else { 
			return false;
		}
	}

	Dislikes( otherGuest ){
		if(otherGuest.IDBitMask == (this.DislikesBitMask & otherGuest.IDBitMask)) {
			return true;
		} else { 
			return false;
		}
	}

	Distance( otherGuest ){
		return Math.sqrt((this.xPos - otherGuest.xPos) ** 2 + (this.yPos - otherGuest.yPos) ** 2);
	}

	LikeFunction(x){
		return (x - Math.sqrt(2))**5.0 * (1 + 2**x) * 2;
	}
	
	DislikeFunction(x){
		if(x > 0){
			return -1.0 / (x**2);
		} else {
			return -10000;
		}
	}

	AddHappiness( otherGuest ){	
		if(this.Likes( otherGuest )){
			this.Happiness += this.LikeFunction(this.Distance(otherGuest));
		} else if(this.Dislikes( otherGuest )){
			this.Happiness += this.DislikeFunction(this.Distance(otherGuest));
		}
	}

	GetHappiness( otherGuest ){	
		var happyChange = 0;
		
		if(this.Likes( otherGuest )){
			happyChange += this.LikeFunction(this.Distance(otherGuest));
		} else if(this.Dislikes( otherGuest )){
			happyChange += this.DislikeFunction(this.Distance(otherGuest));
		}

		return happyChange;
	}

	GetLikesLength(){	
		return this.NumberOfLikes;
	//	return this.PeopleTheyLike.Length;
	}

	GetDislikesLength(){	
		return this.NumberOfDislikes;
		//return this.PeopleTheyDislike.Length;
	}

	dec2bin(dec) {
	  return (dec >>> 0).toString(2);
	}
}



// Table class

// Name
// ID
// PeopleOnTable
// TableHappiness
// Shape

// If rectangle
	// Dimension (X)
	// Dimension (Y)

// If Circle 
	// Number of seats
	// Radius



class Table {

	ListOfGuests = [];

	TableOccupantBitMask = 0;

	constructor(inName, inID, innSeats){
		this.Name = inName;	
		this.ID   = inID; 
		this.nSeats = innSeats;
		this.ListOfGuests.length = this.nSeats;
	}

	AddGuest(inGuest, inSeatNo){
		if(inSeatNo >= this.nSeats){
			console.log("Table is full!");
			return false;
		}

		if(this.ListOfGuests[inSeatNo] != null){
			console.log("Seat is taken!");
			return false;
		}

		this.ListOfGuests[inSeatNo] = inGuest;
		this.TableOccupantBitMask = this.TableOccupantBitMask | (1 << inGuest.ID);

		return true;
	}


	DoesGuestLikePeopleOnTable(inGuest){
		if((this.TableOccupantBitMask & inGuest.LikesBitMask) > 0){		
	//		console.log(this.dec2bin(this.TableOccupantBitMask & inGuest.LikesBitMask));
			return true;
		} else {
			return false;
		}
	}

	DoesGuestDislikePeopleOnTable(inGuest){
		if((this.TableOccupantBitMask & inGuest.DislikesBitMask) > 0){		
	//		console.log(this.dec2bin(this.TableOccupantBitMask & inGuest.DislikesBitMask));
			return true;
		} else {
			return false;
		}
	}


	dec2bin(dec) {
	  return (dec >>> 0).toString(2);
	}
}








var AllGuests = [];



function MakeList(){
	const Craig = new Guest("Craig", 0);
	const Bill  = new Guest("Bill",  1);
	const Will  = new Guest("Will",  2);
	
	const KidsTable = new Table("Kids table", 0, 3);
	
	AllGuests.push( Craig );
	AllGuests.push( Bill  );
	AllGuests.push( Will  ); 
	
	KidsTable.AddGuest( Craig , 2 ); 
	KidsTable.AddGuest( Bill , 0 );
	KidsTable.AddGuest( Will , 1 ); 
	
	Craig.xPos = 2;
	Craig.yPos = 2;
	
	Bill.xPos = 0;
	Bill.yPos = 0;
	
	Will.xPos = -2;
	Will.yPos = -2;
	
	Craig.AddLike(Bill);
	Craig.AddDislike(Will);
	
	Bill.AddLike(Will);
	Bill.AddLike(Craig);
	
	Will.AddLike(Bill);
	Will.AddDislike(Craig);
	
	
	for(let i = 0; i < AllGuests.length; i++){
		for( let j = 0; j < AllGuests.length; j++){
	
			if(i == j) continue;
			AllGuests[i].AddHappiness(AllGuests[j]);
	
		}
	}
	
	
	console.log("Craig likes Bill: " + Craig.Likes(Bill) + Craig.GetDislikesLength());
	console.log("Craig likes Will: " + Craig.Likes(Will));
	
	console.log("Craig dislikes Bill: " + Craig.Dislikes(Bill));
	console.log("Craig dislikes Will: " + Craig.Dislikes(Will));
	
	//Craig.GetHappiness( Bill );
	//Craig.GetHappiness( Will );
	
	for(let i = 0; i < AllGuests.length; i++){
		console.log(AllGuests[i].Name + " is " + AllGuests[i].Happiness + " happy.");
	
		for( let j = 0; j < AllGuests.length; j++){
			if(i == j) continue;
			console.log("	" + AllGuests[i].GetHappiness(AllGuests[j]) + " - " + AllGuests[j].Name);
		}
	
	}
	
	
	console.log("Does Craig dislike anyone on " + KidsTable.Name + " : " + KidsTable.DoesGuestDislikePeopleOnTable(Craig));
	console.log("Does Will  dislike anyone on " + KidsTable.Name + " : " + KidsTable.DoesGuestDislikePeopleOnTable(Will));
	
	console.log("Does Craig like anyone on " + KidsTable.Name + " : " + KidsTable.DoesGuestLikePeopleOnTable(Craig));
	console.log("Does Will  like anyone on " + KidsTable.Name + " : " + KidsTable.DoesGuestLikePeopleOnTable(Will));
}



function ShowLikes(){
		
	var name = document.getElementById("myInput").value; 	

	for(let i = 0; i < AllGuests.length; i++){
		if(AllGuests[i].Name == name){

			let LikeList   = document.getElementById("LikeListDiv");
			LikeList.innerHTML = "";
			let DislikeList = document.getElementById("DislikeListDiv");
			DislikeList.innerHTML = "";
		
			for(let j=0; j < AllGuests[i].GetLikesLength(); j++){
				let li = document.createElement('li');
				li.innerText = AllGuests[i].PeopleTheyLike[j];
				LikeList.appendChild(li);
			} 

			for(let j=0; j < AllGuests[i].GetDislikesLength(); j++){
				let li = document.createElement('li');
				li.innerText = AllGuests[i].PeopleTheyDislike[j];
				DislikeList.appendChild(li);
			} 
		}
	}
		
}

function AddLike(){
		
	var name = document.getElementById("myInput").value; 	
	var LikedName = document.getElementById("AddLikePromt").value; 	
	
	let i = 0; 
	for(i; i < AllGuests.length; i++){
		if(AllGuests[i].Name == LikedName){
			break;
		}
	}

	for(let j = 0; j < AllGuests.length; j++){
		if(AllGuests[j].Name == name){
			AllGuests[j].AddLike(AllGuests[i]);
			break;
		}
	}
	
	ShowLikes();	
	return false;
}

function AddDislike(){
		
	var name = document.getElementById("myInput").value; 	
	var DislikedName = document.getElementById("AddDislikePrompt").value; 	

	
	let i = 0; 
	for(i; i < AllGuests.length; i++){
		if(AllGuests[i].Name == DislikedName){
			break;
		}
	}

	for(let j = 0; j < AllGuests.length; j++){
		if(AllGuests[j].Name == name){
			AllGuests[j].AddDislike(AllGuests[i]);
			break;
		}
	}
	
	ShowLikes();	
	return false;
}

function ListNames(){
	let FullList   = document.getElementById("FullList");	
	FullList.innerHTML = "";
	for(let i = 0; i < AllGuests.length; i++){
		let li = document.createElement('li');
		li.innerText = AllGuests[i].Name;
		FullList.appendChild(li);
	}
}

function AddGuest(){	
	var name = document.getElementById("AddGuestName").value; 	
	var ID   = AllGuests.length;
	
	const NG = new Guest(name, ID);
	AllGuests.push(NG);
	return false;
}








function DrawTablePlan(){

	const canvas = document.getElementById("tablePlanCanvas");
	const ctx = canvas.getContext("2d");
	
	ctx.beginPath();
	
	// Set start-point
	ctx.moveTo(20,20);
	
	// Set sub-points
	ctx.lineTo(100,20);
	ctx.lineTo(175,100);
	ctx.lineTo(20,100);
	
	// Set end-point
	ctx.lineTo(20,20);
	
	// Stroke it (do the drawing)
	ctx.stroke();

	ctx.beginPath();
	
	// Set start-point
	ctx.moveTo(10,10);
	
	// Set sub-points
	ctx.lineTo(180,10);
	ctx.lineTo(180,30);
	
	// Set end-point
	ctx.lineTo(10,10);
	
	// Stroke it (do the drawing)
	ctx.stroke();

}






//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
		//console.log(arr[i].Name);
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].Name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].Name.substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].Name.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i].Name + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}  


function ShowObject(ElementID, InputElementID) {
	var text = document.getElementById(ElementID);

	console.log(ElementID);
	if (!text.style.display) {
		text.style.display = "none";
	}
	if (text.style.display === "none") {
		text.style.display = "block";
	} else {
		text.style.display = "none";
	}

	autocomplete(document.getElementById(InputElementID),    AllGuests);
}














