function addUsers() {
	var groups = getActiveItems("lGroups");
	var users = getActiveItems("lUsers");
	var groupIndex;
	var listOfUsers;
	if (groups.length == 0) {
		window.alert("Please select one or more groups to add the users to. (Hold ALT to select multiple items)");
		return;
	}
	if (users.length == 0) {
		window.alert("Please select one or more users to add to the groups. (Hold ALT to select multiple items)");
		return;
	}
	for (var i=0; i<groups.length; i++) {
		groupIndex = findGroup(groups[i].innerText);
		listOfUsers = Rules.ruleSet[0][groupIndex][1]; //Gets the list of users already in the group
		for (var j=0; j<users.length; j++) {
			listOfUsers.pushUnique(users[i].innerText); //Adds to that list
		}
		updateGroup(groups[i].innerText,listOfUsers); //Writes that list back into the group
	}
	popupPrompt("Added "+users.length+" user(s) to "+groups.length+" group(s)","50","50","400","25",true);
}

function popupPrompt(message, x, y, w, h, autoclose=false) {
	popup = document.getElementById("popup");
	if (popup.style.display == "none") {
		popupText = document.getElementById("popupText");
		popup.style.left = x + "%";
		popup.style.top = y + "%";
		popup.style.width = w + "px";
		popup.style.height = h + "px";
		popupText.innerHTML = message;
		popup.style.display = "block";
		if (autoclose) {
			$('#popup').delay(2000).fadeOut(500);
		}
		return true;
	} else { return false; }
}

function closePopupPrompt() {
	popup = document.getElementById("popup");
	popup.style.display = "none";
}

function activate(nameOfList) { //Activates the clicked item in the list where all elements have the class nameOfList
	var activeItem = document.activeElement;
	if (nameOfList == "none") {
		console.log("Deactivating all elements.");
		var all = document.getElementsByTagName("*");
		for (var i=0; i<all.length; i++) {
			//console.log("Deactivating " + all[i].className);
			all[i].className.replace("active", "");
		}
		return;
	}
	listcontent = document.getElementsByClassName(nameOfList);
	console.log("Activate has " + nameOfList);
	console.log("Parentally active thingy is " + document.activeElement.parentNode.id);
	console.log("gSelectSingle is " + gSelectSingle);
	if ((gSelectSingle == "") || (gSelectSingle == document.activeElement.parentNode.id)) {
		activeItem = document.activeElement;
		if (!selectMultiple) { //If only one is to be selected, unselect everything first
			for (var i=0; i<listcontent.length; i++) {
				listcontent[i].className = nameOfList;
			}
		}
		if (activeItem.firstChild.className.includes("active")) {
			activeItem.firstChild.className = nameOfList;
		} else {
			activeItem.firstChild.className = nameOfList + " active";
		}
		updateContextBox();
		gSelectSingle = "";
	} else {
		console.log("You can't click this at the moment");
	}
}

function getActiveItems(whichList) { //Returns an array of the selected items
	var all = document.getElementsByTagName("*");
	var activeItems = [];
	for (var i=0; i<all.length; i++) {
		if ((all[i].className.includes("active")) && (all[i].parentNode.parentNode.id.includes(whichList))) {
			console.log("getActiveItems has another item");
			activeItems.push(all[i]);
		}
	}
	return activeItems;
}

function prepSearch(which) {
	console.log("prepSearch has " + which);
	var listContainer;
	listContainer = document.getElementById(which);
	console.log("This happens to be " + listContainer);
	gSearchableList = listContainer.getElementsByTagName("li");
}

function search() {
	var results = 0;
	var currentItem;
	console.log("Searching list " + gSearchableList);
	for (var i=0; i<gSearchableList.length; i++) {
		currentItem = gSearchableList[i].innerHTML;
		if (currentItem.toUpperCase().includes(document.activeElement.value.toUpperCase())) {
			gSearchableList[i].style.display = 'block';
			results++;
		} else {
			gSearchableList[i].style.display = 'none';
		}
	}
	console.log("Search returned " + results + " results.");
}

function endSearch() {
	for (var i=0; i<gSearchableList.length; i++) {
		gSearchableList[i].style.display = 'block';
	}
	gSearchableList = null;
}

function getInput(prompt, target) { //Opens the modal box to get a string from the user
	modalTarget = target;
	var modal = document.getElementById("modalbox");
	var modalHead = document.getElementById("modalHeader");
	var modalButton = document.getElementById("modalButton");
	modal.style.display = "block";
	modalHead.innerHTML = prompt;
}

function closeModal() {
	var modalContents = document.getElementById("modalContent");
	var modal = document.getElementById("modalbox");
	modalContents.value = "";
	modal.style.display = "none";
}

function okModal() {
	console.log("okModal has " + modalTarget);
	var modalContents = document.getElementById("modalContent");
	switch (modalTarget) {
		case "user":
			addUser(modalContents.value);
			break;
		case "group":
			addGroup(modalContents.value);
			break;
	}
	closeModal();
}

function saveButton() {
	var success = saveFile();
	if (success == true) {
		popupPrompt("Saved to file", "50", "50", "320", "24", true);
	} else {
		if (!popupPrompt("The file could not be saved.", "50", "50", "320", "24", true)) {
			window.alert("The file could not be saved.");
		}
	}
}

function oldUpdateLists() {
	clearLists();
	populateGroups();
	populateUsers();
	populateRepos();
	wrapListItems();
	console.log("Screen Updated");
}

function updateLists() { //Updates what shows in all boxes
	clearLists();
	var users = document.getElementById("lUsers").childNodes;
	var groups = document.getElementById("lGroups").childNodes;
	var repos = document.getElementById("lRepos").childNodes;
	var activeUsers = getActiveItems("lUsers");
	
	var activeRepos = getActiveItems("lRepos");
	var relevantUsersOnly = document.getElementById("filterUsers").checked;
	var relevantReposOnly = document.getElementById("filterRepos").checked;
	
	
	if (relevantUsersOnly) {
	} else {
		for (var i=0; i<nPerms; i++) {
			litem = document.createElement("li");
			litem.className = "contextgroup";
			litem.innerHTML = perms[i][0] + " " + perms[i][1][0][0];
			ul.appendChild(litem);
		}
	}
	
	wrapListItems();
}

function populateGroups() {
	var groups = Rules.ruleSet[0];
	var ul = document.getElementById("lGroups"); //Get the list
	var activeRepos = getActiveItems("lRepos"); //Get selected repos
	var activeUsers = getActiveItems("lUsers"); //Get selected repos
	var groups = Rules.ruleSet[0];
	var thisGroup;
	var indexOfAccess;
	var relevantGroupsOnly = document.getElementById("filterGroups").checked;
	if (activeRepos.length == 0) { relevantGroupsOnly = false; } //There are no selected repositories to BE relevant with!

	for (var i=0; i<groups.length; i++) { //For every group
		litem = document.createElement("li"); //Make a list item
		litem.innerHTML = groups[i][0]; //Put the group's name in it
		litem.className = "contextgroup"; //Prepare it to be added
		litem.id = groups[i][0];
		ul.appendChild(litem); //And add it to the HTML list.
		if (relevantGroupsOnly) { 
			if (activeRepos.length != 0) { //If only groups with access to the selected repositories should appear
				thisGroup = groupRuleLoader(groups[i][0]); //Get the group's repositories
				for (var j=0; j<activeRepos.length; j++) { //For every selected repository
					indexOfAccess = thisGroup[0].indexOf(thisRule); //Find where it is in the group's access list (thisGroup[0] is the array of names of repositories)
					if (indexOfAccess == -1) { //If the group has no access to it at all
						$(litem).remove(); //Delete the list item.
					}
				}
			}
			if (activeUsers.length != 0) { //If only groups containing selected users should appear
				
			}
		}
	}
}

function relevantGroups() { //Returns all the groups that can access the currently selected repo
}

function populateRepos() {
	var repos = Rules.ruleSet[2];
	var ul = document.getElementById("lRepos"); //Get the list
	var nRepos = repos.length;

	console.log("Adding " + nRepos + " repos to repo list");

	for (var i=0; i<nRepos; i++) {
		litem = document.createElement("li"); //Create & get the new item
		litem.className = "contextgroup";
		litem.id = repos[i][0];
		litem.innerHTML = repos[i][0]; //Put text in the new item
		ul.appendChild(litem);
	}
}

function populateUsers() {
	 var users = Rules.ruleSet[1];
	 var ul = document.getElementById("lUsers"); //Get the user list
	 var nUsers = users.length;

	 console.log("Adding " + nUsers + " users to users list");

	 for (var i = 0; i < nUsers; i++) {
		 litem = document.createElement("li");
		 litem.className = "contextgroup";
		 litem.id = users[i];
		 litem.innerHTML = users[i];
		 ul.appendChild(litem);
	 }
}

function addReadOnlyImage(toWhat) {
	toWhat.innerHTML = litem.innerHTML + giRead;
}
function addReadWriteImage(toWhat) {
	toWhat.innerHTML = litem.innerHTML + giRead;
}

function interfaceSetup() {
	modalSetup();
	gSearchableList = null;
	document.getElementById("multiSelect").checked = false;
	popup = document.getElementById("popup");
	popup.style.display = "none";
	giRead = new Image();
	giReadWrite = new Image();
	giRead.src = '..\\img\\read.bmp';
	giReadWrite.src = '..\\img\\write.bmp';
	giRead.alt = "Read";
	giReadWrite.alt = "Read/Write";
}

/*---------------From here is unused code------------------

function listGroups(json) {
    // Groups
    var groups = json.groups;
    console.log("Groups: " + JSON.stringify(groups, null, 4));
    // Remove once function for where this goes is made
    $("#content").val(JSON.stringify(groups, null, 4));
}
*/
