
/* $(document).ready(function () {
  // Prevent Ajax caching - always get a new result
  $.ajaxSetup({
    cache: false
  });
  // Bloomin text area keeps content after refresh
  document.getElementById('content').value = '';
}); */

var modalTarget = ""; //Yes... I know.
var selectMultiple = false;
var gSelectSingle = "";
var gSearchableList = null;
var gWrapped = 0;

var Rules = {
	ruleSet : []
};

//Will be run when page is loaded
function startup() {
	interfaceSetup();
	//loadFile();
	load();
}

// function loadFile() {
//   $.ajax({
//     url: '/scripts/load-file.php',
//     type: 'POST',
//     success: function(html) {
//       $("#content").val(html);
//       console.log("File loaded.");
//     }
//   });
// }

function modalSetup() {
	var modal = document.getElementById('modalbox'); // Get the modal
	modal.style.display = "none";
	window.onclick = function(event) { // When the  user clicks anywhere outside of the modal, close it
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	};
}

// Change to load rules
function load() {
	$.ajax({
    url: '/scripts/load-groups.php',
    dataType: 'json',
    type: 'POST',
    success: function(rules) {
      console.log("Rules loaded.");
			console.log("Parsing rules");

			// Rules.ruleSet = [groups, users, repos]
			Rules.ruleSet = parseFileData(rules);
			console.log("Rules parsed and stored");

			console.log("Populating lists");
			console.log("Lists populated");
			addUser("Samuel");
			 addGroup("samsgroup", ["sam", "and", "his", "mates"]);
            updateGroup("samsgroup", ["boff", "jeff"]);

        console.log(Rules.ruleSet[0]);
        //addGroup("samsgroup", ["sam", "and", "his", "mates"]);
        addRepoRule("/anotherone", "samsgroup", "rw");
			// deleteGroup("samsgroup");
        console.log(Rules.ruleSet[2]);
			 deleteGroup("samsgroup");
        console.log(Rules.ruleSet[0]);
        console.log(Rules.ruleSet[2]);
        deleteRepoRule("/anotherone", "samsgroup");
           console.log(Rules.ruleSet[2]);


			// console.log("Load user rules");
			// userRuleLoader("user1");
			// rebuildFile();
			// deleteRepo("/");
			// deleteRepo("lol");
			// deleteRepoRule("/anotherone", "group5");
			 addRepoRule("/anotherone", "samsgroup", "rw");
			 deleteRepoRule("/anotherone", "samsgroup");
			 console.log(Rules.ruleSet[2]);
			// addRepoRule("/anotherone", "group9", "rw");
      // deleteUser("user1");
    }
  });
}

// Checks if an item exists in and if not pushes it
Array.prototype.pushUnique = function(item) {
	if (this.indexOf(item) == -1) {
		this.push(item);
		return true;
	}
	return false;
};

function parseFileData(fileData) {
	// groups[i][0] to get the group names
	// groups[i][1] to get the group members array
	// repos [i][0] = repo name
	// repos [i][1] = 2D array of rules
	// repos [i][1][0] = first rule e.g. "user10", "rw"
	var groups = []; // Group names and member array pairings
	var users = []; // Array of unique users
	var repos = []; // Array of unique repos

	// Loop through all the keys
	for (var key in fileData) {
		// Parse groups section
		if (key == 'groups') {
			for (subkey in fileData[key]) {
				// Split value into its seperate users
				var groupMembers = fileData[key][subkey].match(/\w+/g);

				// Add the key and value to groups
				groups.push([subkey, groupMembers]);

				// Add unique users to user array
				for (var i = 0; i < groupMembers.length; i++) {
					users.pushUnique(groupMembers[i]);
				}
			}
		}
		else {
			var rule = []; // rules to be paired with repo
			for (subkey in fileData[key]) {
				// @ means groups and * means all so we dont want them as they are not users
				if (subkey.charAt(0) != '@' &&  subkey.charAt(0) != '*') {
					users.pushUnique(subkey);
					rule.push([subkey, fileData[key][subkey]]);
				}
				else if (subkey.charAt(0) == '@') {
					// Renive @ from group name
					rule.push([subkey.substring(1), fileData[key][subkey]]);
				}
				else if (subkey.charAt(0) == '*') {
					rule.push([subkey, fileData[key][subkey]]);
				}
			}
			repos.push([key, rule]);
		}
	}

	var rules = [groups, users, repos];
	return rules;
}

function wrapListItems() {
	if (gWrapped == 1) {
		$("*").unwrap(".contextgroupAnchor");
	} else {
		gWrapped = 1;
	}
	$(".contextgroup").wrap('<a class = "contextgroupAnchor" href = "#" onclick = "activate(\'contextgroup\');"></a>'); //This need only run once whenever stuff is added
}

function addGroup(groupName, usernames) {
	var nGroups = Rules.ruleSet[0].length;
	var found = false;

	for (var i = 0; i < nGroups; i++) {
		if (Rules.ruleSet[0][i][0] == groupName) {
			// Group already exists
			found = true;
			break;
		}
	}
	if (!found) {
		Rules.ruleSet[0].push([groupName, usernames]);
	}
	updateLists();
}

function deleteGroup(groupName) {
    var nUsers = Rules.ruleSet[1].length;
    var nGroups = Rules.ruleSet[0].length;
    var nRepos = Rules.ruleSet[2].length;
	for (var i = 0; i < nGroups; i++) {
		if (Rules.ruleSet[0][i][0] == groupName) {
			Rules.ruleSet[0].splice(i, 1);
			console.log("deleted");
			break;
		}
	}
    for (var i = 0; i < nRepos; i++)
    {
        var newReposLength = Rules.ruleSet[2][i][1].length;
        for (var j = 0; j < newReposLength; j++)
        {
            if (Rules.ruleSet[2][i][1][j][0] == groupName)
            {
                Rules.ruleSet[2][i][1].splice(j,1);

            }
        }
    }
	// Todo search repos for group and delete rules
	updateLists();
}

function updateGroup(groupName, usernames) {
	//usernames is an array
    var nGroups = Rules.ruleSet[0].length;
	for (var i = 0; i < nGroups; i++) {
		if (Rules.ruleSet[0][i][0] == groupName) {
               Rules.ruleSet[0][i][1] = usernames;
        }
	}
	updateLists();
}

function addUser(username) {
	if (Rules.ruleSet[1].pushUnique(username)) {
		console.log("User added");
	}
	else {
		window.alert("There's already a user called " + username);
	}
	updateLists();
}

function deleteUser(username) {
	// Delete from users and from group rules and repos
    var nUsers = Rules.ruleSet[1].length;
    var nGroups = Rules.ruleSet[0].length;
    var nRepos = Rules.ruleSet[2].length;

    for (var i = 0; i < nUsers; i++)
    {
        if(Rules.ruleSet[1][i] == username)
        {
            Rules.ruleSet[1].splice(i, 1);
            console.log("User deleted from user list");
        }
    }
	for (var i = 0; i < nGroups; i++)
    {
        var newGroupLength = Rules.ruleSet[0][i].length;
        for (var j = 0; j < newGroupLength; j++)
        {
            if (Rules.ruleSet[0][i][1][j] == username)
            {
                Rules.ruleSet[0][i][1].splice(j, 1);
                console.log("User deleted from group");
            }
        }
    }

    for (var i = 0; i < nRepos; i++)
    {
        var newReposLength = Rules.ruleSet[2][i][1].length;
        for (var j = 0; j < newReposLength; j++)
        {
            if (Rules.ruleSet[2][i][1][j][0] == username)
            {
                Rules.ruleSet[2][i][1].splice(j, 1);
                console.log("User deleted from repos");
            }
        }
    }

    updateLists();
}

function addRepo(repoLoc) {
	//Todo add a repo value

    if (Rules.ruleSet[2].pushUnique([repoLoc, [["*", ""]]])) {
		// Message sayiong it worked like a popup notification or something
        console.log("Successfully Added");
	}
	else {
		// Message saying user already present
        console.log("Repo already exists");
	}

	updateLists();
}

function addRepoRule(repoLoc, delegate, perms) {
	// Todo add a rule to the repo
	var nRepos = Rules.ruleSet[2].length;
	var found = false;

	for (var i = 0; i < nRepos; i++) {
		if (Rules.ruleSet[2][i][0] == repoLoc) {
			var nRules = Rules.ruleSet[2][i].length
			console.log("Found Repo");
			for (var j = 0; j < nRules; j++) {
				if (Rules.ruleSet[2][i][1][j][0] == delegate) {
					console.log("Rule for delegate already exists");
				}
				else {
					Rules.ruleSet[2][i][1].push([delegate, perms]);
          break;
				}
			}
		}
	}
	updateLists();
}

function deleteRepoRule(repoLoc, delegate) {
	// Todo delete the given repo rule
	// repos [i][1] = 2D array of rules
	// repos [i][1][0] = first rule e.g. "user10", "rw"
	var nRepos = Rules.ruleSet[2].length;

	for (var i = 0; i < nRepos; i++) {
		if (Rules.ruleSet[2][i][0] == repoLoc) {
			var nRules = Rules.ruleSet[2][i][1].length
			console.log("Found Repo to delete from");
			for (var j = 0; j < nRules; j++) {
				if (Rules.ruleSet[2][i][1][j][0] == delegate) {
					console.log("Found group1 in anotherone");
					Rules.ruleSet[2][i][1].splice(j, 1);
				}
			}
		}
	}
}

function updateRepoRule(repoLoc, delegate, perms) {
	// Todo update given repo rule

}

function deleteRepo(repoLoc) {
	var nRepos = Rules.ruleSet[2].length;
	var found = false;

	for (var i = 0; i < nRepos; i++) {
		if (Rules.ruleSet[2][i][0] == repoLoc) {
			Rules.ruleSet[2].splice(i, 1);
			console.log("deleted");
			break;
		}
	}

	if (!found) {
		// Not found
		console.log("Repo not found");
	}

	// Todo search repos for group and delete rules
	updateLists();
}

function clearLists() {
	$(document.getElementById("lGroups")).empty();
	$(document.getElementById("lUsers")).empty();
	$(document.getElementById("lRepos")).empty();
}

function saveFile() {
	var jsonStringGroup = JSON.stringify(Rules.ruleSet[0]);
	var jsonStringRepos = JSON.stringify(Rules.ruleSet[2]);
	$.ajax({
    url: '/scripts/save-file.php',
    type: 'POST',
    data: {
      groups: jsonStringGroup,
			repos: jsonStringRepos
    },
    success: function(deleted) {
			console.log(deleted);
    }
  });
  return true;
}

function ruleLoader(groupName) {
	// Load rules for the group (or user)
	// Check each repo against the group
	console.log("LOADING GROUP RULES");
	var nRepos = Rules.ruleSet[2].length;
	var perms = []; // perms[i][0] is all the repos with permissions
	for (var i = 0; i < nRepos; i++) {
		var nRules = Rules.ruleSet[2][i][1].length;
		var repoPerms = [];
		for (var j = 0; j < nRules; j++) {
			if (Rules.ruleSet[2][i][1][j][0] == ["*"] && Rules.ruleSet[2][i][1][j][1] != "") { // Check to see if all, *, has permissions
				repoPerms.push(Rules.ruleSet[2][i][1][j]);
			}
			if (groupName == Rules.ruleSet[2][i][1][j][0]) { // Check the checklist against repo rules
				repoPerms.push([Rules.ruleSet[2][i][1][j][1], Rules.ruleSet[2][i][1][j][0]]);
			}
		}
		// Add the repo perms to perms list
		if (repoPerms.length != 0) {
			perms.push([Rules.ruleSet[2][i][0], repoPerms]);
		}
  }
	return perms;
}

function groupUsersLoader(groupName) {
	var groups = Rules.ruleSet[0]; //Will be the array of groups
	for (var i=0; i<groups.length; i++) {
		if (groups[i][0] == groupName) {
			return groups[i][1]; //Will be the array of members
		}
	}
}

function findGroup(name) {
	for (i=0; i<Rules.ruleSet[0].length; i++) {
		if (Rules.ruleSet[0][i][0] == name) {
			return i;
		}
	}
	return -1;
}

function repoRuleLoader(repo) {
 // load rules for selected repos
}

function keyPressed(e) {
	switch (e.keyCode) {
		case 18: //Alt
			selectMultiple = true;
			document.getElementById("multiSelect").checked = true;
			break;
	}
}

function keyReleased(e) {
	switch (e.keyCode) {
		case 18: //Alt
			selectMultiple = false;
			document.getElementById("multiSelect").checked = false;
			break;
	}
}


//-------------------FROM HERE IS UI CODE----------------


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
		if (listOfUsers == null) {
			listOfUsers = [];
		}
		for (var j=0; j<users.length; j++) {
			listOfUsers.pushUnique(users[j].innerText); //Adds to that list
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
		if (!selectMultiple) { //If only one is to be activated, deactivate everything first
			for (var i=0; i<listcontent.length; i++) {
				listcontent[i].className = nameOfList;
			}
		}
		if (activeItem.firstChild.className.includes("active")) { //If the item is active already
			activeItem.firstChild.className = nameOfList; //Deactivate it
		} else {
			activeItem.firstChild.className = activeItem.firstChild.className + " active"; //Otherwise activate it
		}
		updateContext();
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

function updateLists() { //Updates what shows in all boxes
	clearLists();
	populateGroups();
	populateUsers();
	populateRepos();
	wrapListItems();
}

function updateContext() {
	if (document.getElementById("filterGroups").checked) {
		document.getElementById("lGroupsHeader").innerHTML = "Groups with selection";
	} else {
		document.getElementById("lGroupsHeader").innerHTML = "Groups";
	}
	if (document.getElementById("filterUsers").checked) {
		document.getElementById("lUsersHeader").innerHTML = "Users with selection";
	} else {
		document.getElementById("lUsersHeader").innerHTML = "Users";
	}
	if (document.getElementById("filterRepos").checked) {
		document.getElementById("lReposHeader").innerHTML = "Repositories that the selection has access to";
	} else {
		document.getElementById("lReposHeader").innerHTML = "Repositories";
	}
	filterGroupsList();
	filterUsersList();
	filterReposList();
}

function filterGroupsList() {
	var relevantGroupsOnly = document.getElementById("filterGroups").checked;
	var ul = document.getElementById("lGroups");
	var lGroups = ul.getElementsByTagName("li");
	var groups = Rules.ruleSet[0]; //Get the groups
	var activeRepos = getActiveItems("lRepos"); //Get selected repos
	var activeUsers = getActiveItems("lUsers"); //Get selected users
	var thisPermission = 0;
	var perms;
			
	if (relevantGroupsOnly) { //If the groups list should be filtered
		if (activeRepos.length != 0) { //If any repos are selected
			perms = ruleLoader(groups[i][0]); //Get the group's repositories
			for (var j=0; j<activeRepos.length; j++) { //For every selected repository
				for (var k=0; k<perms.length; k++) { //For every repository that the group has permissions for
					if (perms[k][1] == "r") { //If the permission is read-only
						addReadOnlyImage(lGroups[i]); //Show the "READ" icon alongside the group
					} else {
						addReadWriteImage(lGroups[i]); //Show the "WRITE" icon alongside the group
					}
				}
			}
		}
		for (var i=0; i<lGroups.length; i++) { //For every group
			removeReadImage(lGroups[i]);
			lGroups[i].style.display = "none";
			if (activeRepos.length != 0) { //If only groups with access to the selected repositories should appear
				lGroups[i].style.display = "none"; //Hide the group in the list
				perms = ruleLoader(groups[i][0]); //Get the group's repositories
				for (var j=0; j<activeRepos.length; j++) { //For every selected repository
					for (var k=0; k<perms.length; k++) { //For every repository that the group has permissions for
						lGroups[i].style.display = "block"; //Show the group
					}
				}
			}
			if (activeUsers.length != 0) { //If only groups containing selected users should appear
				thisGroup = groupUsersLoader(groups[i][0]); //Get the group's users
				for (var j=0; j<activeUsers.length; j++) { //For every selected user
					if (thisGroup.indexOf(activeUsers[j].innerText) != -1) { //If it is there
						lGroups[i].style.display = "block"; //Show the group
					}
				}
			}
		}
	} else { //If the groups list should not be filtered
		for (var i=0; i<lGroups.length; i++) {
			lGroups[i].style.display = 'block'; //Just show everything
		}
		document.getElementById("searchGroups").value = ""; //Clear searchbox to avoid confusion
	}
}

function filterUsersList() {
	var relevantUsersOnly = document.getElementById("filterUsers").checked;
	var ul = document.getElementById("lUsers");
	var lUsers = ul.getElementsByTagName("li");
	var groups = Rules.ruleSet[0] //Get the groups
	var users = Rules.ruleSet[1]; //Get the users
	var activeRepos = getActiveItems("lRepos"); //Get selected repos
	var activeGroups = getActiveItems("lGroups"); //Get selected groups
	var thisPermission = 0;
	var thisGroupsUsers;
	var perms;
			
	if (relevantUsersOnly) { //If the users list should be filtered
		for (var i=0; i<lUsers.length; i++) { //For every user
			lUsers[i].style.display = "none";
			removeReadImage(lUsers[i]);
			if (activeRepos.length != 0) { //If only users with access to the selected repositories should appear
				lUsers[i].style.display = "none"; //Hide the user in the list
				perms = ruleLoader(users[i]); //Get the user's repositories
				for (var j=0; j<activeRepos.length; j++) { //For every selected repository
					for (var k=0; k<perms.length; k++) { //For every repository that the user has permissions for
						lUsers[i].style.display = "block"; //Show the user
					}
				}
			}
			if (activeGroups.length != 0) { //If only users in selected groups should appear
				for (var j=0; j<activeGroups.length; j++) { //For every selected group
					thisGroupsUsers = groupUsersLoader(activeGroups[j].innerText);
					if (thisGroupsUsers.includes(users[i])) { //If it is there
						lUsers[i].style.display = "block"; //Show the user
					}
				}
			}
		}
	} else { //If the groups list should not be filtered
		for (var i=0; i<lUsers.length; i++) {
			lUsers[i].style.display = 'block'; //Just show everything
		}
		document.getElementById("searchGroups").value = ""; //Clear searchbox to avoid confusion
	}
}

function filterReposList() {
	var relevantReposOnly = document.getElementById("filterRepos").checked;
	var ul = document.getElementById("lRepos");
	var lRepos = ul.getElementsByTagName("li");
	var groups = Rules.ruleSet[0]; //Get the groups
	var activeGroups = getActiveItems("lGroups"); //Get selected repos
	var activeUsers = getActiveItems("lUsers"); //Get selected repos
	var indexOfAccess = 0;

	if (relevantReposOnly) { //If the groups list should be filtered
		//Hide all repos
		//Show repos with permissions for the selected groups, if any are selected
		//Show repos with permissions for the selected users, if any are selected
	} else { //If the groups list should not be filtered
		for (var i=0; i<lRepos.length; i++) {
			lRepos[i].style.display = 'block'; //Just show everything
		}
		document.getElementById("searchRepos").value = ""; //Clear searchbox to avoid confusion
	}
}

function populateGroups() {
	var groups = Rules.ruleSet[0];
	var ul = document.getElementById("lGroups"); //Get the list
	var groups = Rules.ruleSet[0];
	var thisGroup;

	for (var i=0; i<groups.length; i++) { //For every group
		litem = document.createElement("li"); //Make a list item
		litem.innerHTML = groups[i][0]; //Put the group's name in it
		litem.className = "contextgroup"; //Prepare it to be added
		litem.id = groups[i][0];
		ul.appendChild(litem); //And add it to the HTML list.
	}
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
	toWhat.style.backgroundImage = "url('img/read.bmp')";
}

function addReadWriteImage(toWhat) {
	toWhat.style.backgroundImage = "url('img/write.bmp')";
}

function removeReadImage(fromWhat) {
	//todo
}

function interfaceSetup() {
	modalSetup();
	gSearchableList = null;
	document.getElementById("multiSelect").checked = false;
	popup = document.getElementById("popup");
	popup.style.display = "none";
}

/*---------------From here is unused code------------------

function listGroups(json) {
    // Groups
    var groups = json.groups;
    console.log("Groups: " + JSON.stringify(groups, null, 4));
    // Remove once function for where this goes is made
    $("#content").val(JSON.stringify(groups, null, 4));
}

old{
	// Get a list of groups the user is a part of
	console.log("LOADING USER RULES");
	var checklist = [username];
	var nGroups = Rules.ruleSet[0].length;

	for (var i = 0; i < nGroups; i++) {
		var inGroup = $.inArray(username, Rules.ruleSet[0][i][1]);
		if (inGroup > -1) {
			checklist.push(Rules.ruleSet[0][i][0]);
		}
	}

	// Check each repo against the checklist
	var nRepos = Rules.ruleSet[2].length;
	var nChecklist = checklist.length;
	var perms = []; // perms[i][0] is all the repos with permissions

	for (var i = 0; i < nRepos; i++) {
		var nRules = Rules.ruleSet[2][i][1].length;
		var repoPerms = [];
		for (var j = 0; j < nRules; j++) {

			// Check to see if all, *, has permissions
			if (Rules.ruleSet[2][i][1][j][0] == ["*"] && Rules.ruleSet[2][i][1][j][1] != "") {
				repoPerms.push(Rules.ruleSet[2][i][1][j]);
			}

			// Check the checklist against repo rules
			for ( var k = 0; k < nChecklist; k++) {
				if (checklist[k] == Rules.ruleSet[2][i][1][j][0]) {
					repoPerms.push([Rules.ruleSet[2][i][1][j][1], Rules.ruleSet[2][i][1][j][0]]);
				}
			}
		}

		// Add the repo perms to perms list
		if (repoPerms.length != 0) {
			perms.push([Rules.ruleSet[2][i][0], repoPerms]);
		}
	}

	//  List the results
	var ul = document.getElementById("lContextbox"); // Get the list
	var nPerms = perms.length;

	// clear the current list

	ul.innerHTML = "";
	console.log("Adding " + nPerms + " permissions to the context list");

	for (var i = 0; i < nPerms; i++) {
		litem = document.createElement("li");
		litem.className = "contextgroup";
		litem.innerHTML = perms[i][0] + " " + perms[i][1][0][0];
		ul.appendChild(litem);
	}
	wrapListItems();
}
*/