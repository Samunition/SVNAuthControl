var modalTarget = ""; //Yes... I know.
var selectMultiple = true;
var gSelectSingle = "";
var gSearchableList = null;
var gWrapped = 0;

var relevantGroupsOnly = false;
var relevantReposOnly = false;
var relevantUsersOnly = false;

var Rules = {
	ruleSet : []
};

//Will be run when page is loaded
function startup() {
	interfaceSetup();
	//loadFile();
	load();
	updateContext(); //Should not be called before load();
}

function modalSetup() {
	var modal = document.getElementById('modalbox'); // Get the modal
	modal.style.display = "none";
	window.onclick = function(event) { // When the  user clicks anywhere outside of the modal, close it
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	};
}

function diff(oldFile, newFile) {
	$.ajax({
		url: '/scripts/diff-files.php',
		type: 'POST',
		data: {
			file1: oldFile,
			file2: newFile
		},
		success: function(differences) {
			console.log(differences);
		}
	});
}

// Change to load rules
function load() {
	$.ajax({
    url: '/scripts/load-groups.php',
    dataType: 'json',
    type: 'POST',
    success: function(rules) {
		try {
			console.log("Parsing rules");
			// Rules.ruleSet = [groups, users, repos]
			Rules.ruleSet = parseFileData(rules);
			console.log("Rules parsed and stored");
			console.log("Populating lists");
			console.log("Lists populated");
			//addUser("Samuel");
			addGroup("samsgroup", ["sam", "and", "his", "mates"]);
			updateGroup("samsgroup", ["boff", "jeff"]);

			console.log(Rules.ruleSet[0]);
			//addGroup("samsgroup", ["sam", "and", "his", "mates"]);
			addRepoRule("/anotherone", "samsgroup", "rw");
			// deleteGroup("samsgroup");
			console.log(Rules.ruleSet[2]);
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
		} catch(err) {
			document.getElementById("pleaseWaitMessage").innerHTML = "";
			popupPrompt("Failed to load, "+err.message+".","50","50","800","300");
		}
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
	var groupNames = [];

	// Loop through all the keys
	for (var key in fileData) {
		// Parse groups section
		if (key == 'groups') {
			for (subkey in fileData[key]) {
				// Split value into its seperate users
				var groupMembers = fileData[key][subkey].match(/\w+/g);

				// Add the key and value to groups
				groups.push([subkey, groupMembers]);
				groupNames.push(subkey);

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

	var rules = [groups, users, repos, groupNames];
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
			return false
			break;
		}
	}
	if (!found) {
		Rules.ruleSet[0].push([groupName, usernames]);
		Rules.ruleSet[3].push(groupName);
	}
	updateLists();
	return true;
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

function removeUser(groupName, username) { //Removes a user from a group
	var newUserSet = [];
	for (var i=0; i<Rules.ruleSet[0].length; i++) {
		if (Rules.ruleSet[0][i][0] == groupName) {
			for (var j=0; j<Rules.ruleSet[0][i][1].length; j++) {
               if (Rules.ruleSet[0][i][1][j] != username) { //If the member is not the deletable one
				newUserSet.push(Rules.ruleSet[0][i][1][j]); //Add it to newUserSet
			   }
			}
			Rules.ruleSet[0][i][1] = newUserSet; //Replace the group with newUserSet
        }
	}
}

function emptyGroup(groupName) {
	for (var i=0; i<Rules.ruleSet[0].length; i++) {
		if (Rules.ruleSet[0][i][0] == groupName) {
			Rules.ruleSet[0][i][1] = [];
        }
	}
	updateLists();
}

function addUser(username) {
	if (Rules.ruleSet[1].pushUnique(username)) {
		console.log("User added");
		updateLists();
		return true;
	}
	else {
		return false
	}
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

function addRepo(repoLoc, perms) {
    if (Rules.ruleSet[2].pushUnique([repoLoc, [["*", ""]]])) {
		updateLists();
		return true;
	}
	else {
		return false;
	}
}

function addRepoRule(repoLoc, delegate, perms) {
	// Todo add a rule to the repo
	var nRepos = Rules.ruleSet[2].length;
	var found = false;
	for (var i = 0; i < nRepos; i++) {
		if (Rules.ruleSet[2][i][0] == repoLoc) {
			var nRules = Rules.ruleSet[2][i][1].length;
			console.log("Found Repo");
			for (var j = 0; j < nRules; j++) {
				if (Rules.ruleSet[2][i][1][j][0] == delegate) {
					console.log("Rule for delegate already exists so update");
					found = true;
					Rules.ruleSet[2][i][1][j][1] = perms;
				}
			}
			if (!found) {
				Rules.ruleSet[2][i][1].push([delegate, perms]);
				break;
			}
		}
	}
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
					console.log("Found" + delegate + " in " + repoLoc);
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
	var successful = false;
	$.ajax({
    url: '/scripts/save-file.php',
    type: 'POST',
    data: {
      groups: jsonStringGroup,
			repos: jsonStringRepos
    }}).done(function(deleted) {
			if (deleted == "true") {
				popupPrompt("Saved to file", "50", "50", "320", "24", true);
			}
			else {
				popupPrompt("The file could not be saved.", "50", "50", "320", "24", true);
			}
    });
}

// function ruleLoader(groupName) {
// 	// Load rules for the passed group (or user), check each repo against the group
// 	console.log("LOADING GROUP RULES");
// 	var nRepos = Rules.ruleSet[2].length;
// 	var perms = []; // perms[i][0] is all the repos with permissions
// 	for (var i = 0; i < nRepos; i++) {
// 		var nRules = Rules.ruleSet[2][i][1].length;
// 		var repoPerms = [];
// 		for (var j = 0; j < nRules; j++) {
// 			if (Rules.ruleSet[2][i][1][j][0] == ["*"] && Rules.ruleSet[2][i][1][j][1] != "") { // Check to see if all, *, has permissions
// 				repoPerms.push(Rules.ruleSet[2][i][1][j]);
// 			}
// 			if (groupName == Rules.ruleSet[2][i][1][j][0]) { // Check the checklist against repo rules
// 				repoPerms.push([Rules.ruleSet[2][i][1][j][1], Rules.ruleSet[2][i][1][j][0]]);
// 			}
// 		}
// 		// Add the repo perms to perms list
// 		if (repoPerms.length != 0) {
// 			perms.push([Rules.ruleSet[2][i][0], repoPerms]);
// 		}
//   }
// 	return perms;
// }

function ruleLoader(username) {
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
	//Load rules for selected repos
}

function keyPressed(e) {
	switch (e.keyCode) {
		case 18: //Alt
			selectMultiple=!selectMultiple;
			document.getElementById("multiSelect").checked = selectMultiple;
			break;
		case 13: //Carriage return
			modalthing = document.getElementById("modalbox");
			if (modalthing.style.display == "block") {
				okModal();
			}
			break;
	}
}

function keyReleased(e) {
	switch (e.keyCode) {
		/* case 18: //Alt
			selectMultiple = false;
			document.getElementById("multiSelect").checked = selectMultiple;
			break; */
	}
}


//-------------------FROM HERE IS UI CODE----------------


function addUsers() {
	var groups = getActiveItems("lGroups");
	var users = getActiveItems("lUsers");
	var groupIndex;
	var listOfUsers;
	if (groups.length == 0) {
		window.alert("Please select one or more groups to add the users to. (Use ALT to select multiple items)");
		return;
	}
	if (users.length == 0) {
		window.alert("Please select one or more users to add to the groups. (Use ALT to select multiple items)");
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

function removeUsers() {
	var aUsers = getActiveItems("lUsers");
	var aGroups = getActiveItems("lGroups");
	var lGroups = document.getElementById("lGroups").getElementsByTagName("li");
	if ((aUsers.length == 0) && (aGroups.length == 0)) {
		window.alert("Please select either:\n• One or more users to remove from all groups\n• One or more groups to empty completely\n• One or more of both to remove selected users only from selected groups only");
		return;
	}
	if (aGroups.length == 0) { //No groups are selected, remove the users from everything
		for (var i=0; i<aUsers.length; i++) {
			for (var j=0; j<lGroups.length; j++) {
				removeUser(lGroups[j].innerText, aUsers[i].innerText);
			}
		}
	} else { //there are selected groups
		if (aUsers.length == 0) { //If there are no selected users, however
			for (var j=0; j<aGroups.length; j++) {
				emptyGroup(aGroups[j].innerText); //Empty the selected groups
			}
		} else { //Users AND groups are selected.
			for (var i=0; i<aUsers.length; i++) {
				for (var j=0; j<aGroups.length; j++) {
					removeUser(aGroups[j].innerText, aUsers[i].innerText);
				}
			}
		}
	}
	updateLists();
}

//Shows the small black text overlay.
function popupPrompt(message, x, y, w, h, autoclose=false) {
	popup = document.getElementById("popup");
	//if (popup.style.display == "none") {
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
	//} else { return false; }
}

//Hides the small black text overlay.
function closePopupPrompt() {
	popup = document.getElementById("popup");
	popup.style.display = "none";
}

//Activates the clicked item in the list where all elements have the class nameOfList
function activate(nameOfList) {
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

//Returns an array of the items currently selected by the user
function getActiveItems(whichList) {
	var all = document.getElementsByTagName("*");
	var activeItems = [];
	for (var i=0; i<all.length; i++) {
		if (all[i].className.includes("active")) {
			if ((all[i].parentNode.parentNode.id.includes(whichList)) || (whichList == "*")) {
				activeItems.push(all[i]);
			}
		}
	}
	return activeItems;
}

function prepSearch(which) {
	var listContainer;
	listContainer = document.getElementById(which);
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

//Opens the modal box to get a string from the user
function getInput(prompt, target) {
	modalTarget = target;
	var modal = document.getElementById("modalbox");
	var modalHead = document.getElementById("modalHeader");
	var modalButton = document.getElementById("modalButton");
	var modalRadio = document.getElementById("modalRadio");
	var modalText = document.getElementById("modalContent");
	modal.style.display = "block";
	modalText.style.display = "block";
	modalHead.innerHTML = prompt;
	if (target == "repoRule") {
		modalButton.innerText = "Authorise";
		modalText.style.display = "none";
		modalRadio.style.display = "block";
	} else {
		modalRadio.style.display = "none";
		if (target == "rename") {
			modalButton.innerText = "Rename";
		} else {
			modalButton.innerText = "Create";
		}
	}
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
			if (!addUser(modalContents.value)) {
				popupPrompt("That user already exists", "50", "50", "320", "24", true)
			}
			break;
		case "group":
			if (!addGroup(modalContents.value)) {
				popupPrompt("That group already exists", "50", "50", "320", "24", true)
			}
			break;
		case "repo":
			if (!addRepo(modalContents.value)) {
				popupPrompt("That repository rule already exists", "50", "50", "320", "24", true)
			}
			break;
		case "rename":
			var active = getActiveItems("*");
			if (active.length > 1) {
				popupPrompt("Error renaming - only one item at a time can be renamed", "50", "50", "320", "40", true);
			} else {
				if (active[0].parentNode.parentNode.id == "lGroups") { //If it's a group to rename
					console.log("Renaming a group.");
					for (var i=0; i<Rules.ruleSet[0].length; i++) {
						if (Rules.ruleSet[0][i][0] == active[0].innerText) {
							Rules.ruleSet[0][i][0] = modalContents.value;
							break;
						}
					}
				}
				if (active[0].parentNode.parentNode.id == "lUsers") { //If it's a user to rename
					console.log("Renaming a user.");
					for (var i=0; i<Rules.ruleSet[1].length; i++) {
						if (Rules.ruleSet[1][i] == active[0].innerText) {
							Rules.ruleSet[1][i] = modalContents.value;
							break;
						}
					}
				}
				if (active[0].parentNode.parentNode.id == "lRepos") { //If it's a repo to rename
					console.log("Renaming a repo.");
					for (var i=0; i<Rules.ruleSet[2].length; i++) {
						if (Rules.ruleSet[2][i][0] == active[0].innerText) {
							Rules.ruleSet[2][i][0] = modalContents.value;
							break;
						}
					}
				}
			}
			updateLists();
			break;
		case "repoRule":
			var ruletype = "obh";
			if (document.getElementById("permr").checked) {
				ruletype = "r";
			}
			if (document.getElementById("permrw").checked) {
				ruletype = "rw";
			}
			authButton(ruletype);
			break;
		default:
			window.alert("Modal box error - it was passed something unknown. Bloomin eck indeed..");
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

function revertButton() {
	if (window.confirm("This will undo all changes since you last saved the file.")) {
		load();
		updateLists();
		popupPrompt("Reverted", "50", "50", "320", "24", true);
	}
}

function deleteButton() {
	var deletableGroups = getActiveItems("lGroups");
	var deletableUsers = getActiveItems("lUsers");
	var deletableRepos = getActiveItems("lRepos");
	var messageinfo = "";
	if (deletableGroups.length != 0) {
		messageinfo = messageinfo + deletableGroups.length + " group(s)";
	}
	if (deletableUsers.length != 0) {
		if (messageinfo != "") { messageinfo = messageinfo + ", " }
		messageinfo = messageinfo + deletableUsers.length + " user(s)";
	}
	if (deletableRepos.length != 0) {
		if (messageinfo != "") { messageinfo = messageinfo + ", " }
		messageinfo = messageinfo + deletableRepos.length + " repository rule(s)";
	}
	if (messageinfo == "") {
		popupPrompt("Nothing is selected", "50", "50", "320", "24", true);
		return;
	}
	if (window.confirm("Ready to delete " + messageinfo + ". Continue?")) { //If the user definately wants them deleted
		var i=0;
		console.log("Deleting " +deletableGroups.length+ " groups...");
		for (i=0; i<deletableGroups.length; i++) {
			deleteGroup(deletableGroups[i].innerText);
		}
		console.log("Deleting " +deletableUsers.length+ " users...");
		for (i=0; i<deletableUsers.length; i++) {
			deleteUser(deletableUsers[i].innerText);
		}
		console.log("Deleting " +deletableRepos.length+ " repos...");
		for (i=0; i<deletableRepos.length; i++) {
			deleteRepo(deletableRepos[i].innerText);
		}
		popupPrompt("Deleted", "50", "50", "320", "24", true);
	}
}

function renameButton() {
	var active = getActiveItems("*");
	if (active.length > 1) {
		popupPrompt("Please select just one item", "50", "50", "320", "24", true);
		return;
	}
	getInput("Enter the new name for " + active[0].innerText,"rename");
}

function authButton(permission) {
	activeDelegates = getActiveItems("lGroups").concat(getActiveItems("lUsers"));
	activeRepos = getActiveItems("lRepos");
	if (activeDelegates.length == 0) {
		window.alert("Please select one or more users/groups to authorise (Use ALT to select multiple items)");
		return;
	}
	if (activeRepos.length == 0) {
		window.alert("Please select one or more repositories to authorise access to (Use ALT to select multiple items)");
		return;
	}
	if (permission == "obh") {
		window.alert("Invalid permission");
	}
	for (var i=0; i<activeRepos.length; i++) {
		for (var j=0; j<activeDelegates.length; j++) {
			addRepoRule(activeRepos[i].innerText, activeDelegates[j].innerText, permission);
		}
	}
	updateContext();
	popupPrompt("Authorised selection to access<br>" +activeRepos.length+ " repository(ies)", "50", "50", "320", "40", true);
}

function diffButton() {
	window.alert("Placeholder");
}

//Updates the contents of all boxes.
function updateLists() {
	clearLists();
	populateGroups();
	populateUsers();
	populateRepos();
	wrapListItems();
	updateContext();
}

function updateContext() {
	if (relevantGroupsOnly) {
		document.getElementById("lGroupsHeader").innerHTML = "►Filtered Groups";
	} else {
		document.getElementById("lGroupsHeader").innerHTML = "▼All Groups";
	}
	if (relevantUsersOnly) {
		document.getElementById("lUsersHeader").innerHTML = "►Filtered Users";
	} else {
		document.getElementById("lUsersHeader").innerHTML = "▼All Users";
	}
	if (relevantReposOnly) {
		document.getElementById("lReposHeader").innerHTML = "►Repositories that the selection has access to";
	} else {
		document.getElementById("lReposHeader").innerHTML = "▼All Repositories";
	}
	filterGroupsList();
	filterUsersList();
	filterReposList();
}

//Shows/hides items in the groups list based on selected filtering options and applies read/write icons to them
function filterGroupsList() {
	var ul = document.getElementById("lGroups");
	var lGroups = ul.getElementsByTagName("li");
	var groups = Rules.ruleSet[0]; //Get the groups
	var activeRepos = getActiveItems("lRepos"); //Get selected repos
	var activeUsers = getActiveItems("lUsers"); //Get selected users
	var thisPermission = 0;
	var perms = Rules.ruleSet[2];
	for (var i = 0; i < lGroups.length; i++) {
		lGroups[i].style.display = 'block'; //Show everything
		removeReadImage(lGroups[i]);
		if (activeRepos.length != 0) {
			for (var j = 0; j < activeRepos.length; j++) { // For all selected repos
				for (var k = 0; k < perms.length; k++) { //For all permissions
					if (activeRepos[j].innerText == perms[k][0]) { // If they match get current groups rule if exist
						for (var n = 0; n < perms[k][1].length; n++) {
							//console.log(perms[k][1][n][0] + " == " + lGroups[i].innerText);
							if (perms[k][1][n][0] == lGroups[i].innerText) { //If the group has permission
								if (perms[k][1][n][1] == 'r') { //Depending on permission
									addReadOnlyImage(lGroups[i]); //Show the "READ" icon alongside the group
								} else {
									addReadWriteImage(lGroups[i]); //Show the "WRITE" icon alongside the group
								}
							}
						}
					}
				}
			}
		}
		if (relevantGroupsOnly) {
			if (activeUsers.length != 0) { //If only groups containing selected users should appear
				thisGroup = groupUsersLoader(groups[i][0]); //Get the group's users
				for (var j=0; j<activeUsers.length; j++) { //For every selected user
					if (thisGroup.indexOf(activeUsers[j].innerText) == -1) { //If it is not there
						lGroups[i].style.display = "none"; //Hide the group
					}
				}
			}
			if (activeRepos.length != 0) {
				for (var k=0; k<lGroups.length; k++) {
					if (lGroups[k].style.backgroundImage == "none") { //If it has no permissions
						lGroups[k].style.display = "none"; //Hide the group
					}
				}
			}
		}
	}
}

function filterUsersList() {
	var ul = document.getElementById("lUsers");
	var lUsers = ul.getElementsByTagName("li");
	var groups = Rules.ruleSet[0] //Get the groups
	var users = Rules.ruleSet[1]; //Get the users
	var activeRepos = getActiveItems("lRepos"); //Get selected repos
	var activeGroups = getActiveItems("lGroups"); //Get selected groups
	var thisPermission = 0;
	var thisGroupsUsers;
	var perms = Rules.ruleSet[2];
	console.log(lUsers);
	for (var i=0; i<lUsers.length; i++) { //For every user
		lUsers[i].style.display = "block";
		removeReadImage(lUsers[i]);
		if (activeRepos.length != 0) { //If only users with access to the selected repositories should appear
			for (var j = 0; j < activeRepos.length; j++) { // For all selected repos
				for (var k = 0; k < perms.length; k++) { //For all permissions
					if (activeRepos[j].innerText == perms[k][0]) { // If they match, get current rules if exist
						for (var n = 0; n < perms[k][1].length; n++) {
							// console.log(perms[k][1][n][0] + " == " + lUsers[i].innerText);
							if (perms[k][1][n][0] == lUsers[i].innerText) { //If the group has permission
								if (perms[k][1][n][1] == 'r') { //Depending on permission
									addReadOnlyImage(lUsers[i]); //Show the "READ" icon alongside the group
								} else {
									addReadWriteImage(lUsers[i]); //Show the "WRITE" icon alongside the group
								}
							}
						}
					}
				}
			}
		}
		if (relevantUsersOnly) { //If the users list should be filtered
			if (activeGroups.length != 0) { //If only users in selected groups should appear
				for (var j=0; j<activeGroups.length; j++) { //For every selected group
					thisGroupsUsers = groupUsersLoader(activeGroups[j].innerText);
					if (!thisGroupsUsers.includes(users[i])) { //If it is not there
						lUsers[i].style.display = "none"; //Hide the user
					}
				}
			}
			if (activeRepos.length != 0) {
				for (var i=0; i<lUsers.length; i++) {
					if (lUsers[i].style.backgroundImage == "none") { //If it has no permissions
						lUsers[i].style.display = "none"; //Hide the user
					}
				}
			}
		}
	}
}

function filterReposList() {
	var lRepos = document.getElementById("lRepos").getElementsByTagName("li");
	var groups = Rules.ruleSet[3]; //Get the groups
	var users = Rules.ruleSet[1];
	var activeGroups = getActiveItems("lGroups"); //Get selected repos
	var activeUsers = getActiveItems("lUsers"); //Get selected repos
	var activeDelegates = activeUsers.concat(activeGroups);
	console.log("Repos filter has " + activeDelegates.length + " active delegates");
	var iRules;
	var currentAuthLevel = "";
	var inherited = false;
	for (var i=0; i<lRepos.length; i++) {
		currentAuthLevel = "";
		removeReadImage(lRepos[i]);
		lRepos[i].style.display = 'block'; //Show everything
		for (var j=0; j<activeDelegates.length; j++) {
			iRules = ruleLoader(activeDelegates[j].innerText);
			console.log(iRules);
			for (var k=0; k<iRules.length; k++) {
				if (iRules[k][0] == lRepos[i].innerText) {
					for (var l=0; l<iRules[k][1].length; l++) {
						if ((iRules[k][1][l][0]  == 'rw') || (iRules[k][1][l][0]  == 'r')) {
							console.log("Repos filter has a rule from " + iRules[k][1][l][1]);

							console.log(groups.includes(iRules[k][1][l][1]) + " " + users.includes(activeDelegates[j].innerText) + currentAuthLevel != "rw");
							if ((groups.includes(iRules[k][1][l][1])) && (users.includes(activeDelegates[j].innerText)) && currentAuthLevel != "rw") {
								console.log("Inherited set to true");
								currentAuthLevel = iRules[k][1][l][0];
								inherited = true;
							}
							else if(!groups.includes(iRules[k][1][l][1]) && users.includes(activeDelegates[j].innerText) && currentAuthLevel != "rw") {
								console.log("Inherited set to false");
								currentAuthLevel = iRules[k][1][l][0];
								inherited = false;
							}
							else {
								if (currentAuthLevel != "rw") {
									console.log("Rule is from " + iRules[k][1][l][1]);
									console.log("Input was " + activeDelegates[j].innerText);
									currentAuthLevel = iRules[k][1][l][0];
								}
							}
						}
					}
				}
			}
		}
		if (currentAuthLevel == "rw") {
			if (inherited) {
				addReadWriteInheritImage(lRepos[i]);
			} else {
				addReadWriteImage(lRepos[i]);
			}
		}
		if (currentAuthLevel == "r") {
			if (inherited) {
				addReadOnlyInheritImage(lRepos[i]);
				inherited = false;
			} else {
				addReadOnlyImage(lRepos[i]);
			}
		}
	}
	if (relevantReposOnly) { //If the list should be filtered (as in, unimportant ones are hidden)
		if (activeDelegates.length != 0) {
			for (var i=0; i<lRepos.length; i++) {
				if (lRepos[i].style.backgroundImage == "none") { //If it has no permissions
					lRepos[i].style.display = "none"; //Hide the repo
				}
			}
		}
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

function addReadOnlyInheritImage(toWhat) {
	toWhat.style.backgroundImage = "url('img/readInherit.bmp')";
}

function addReadWriteInheritImage(toWhat) {
	toWhat.style.backgroundImage = "url('img/writeInherit.bmp')";
}

function removeReadImage(fromWhat) {
	fromWhat.style.backgroundImage = "none";
}

function interfaceSetup() {
	modalSetup();
	gSearchableList = null;
	document.getElementById("multiSelect").checked = true;
	popup = document.getElementById("popup");
	popup.style.display = "none";
}

function deauthButton() {
	console.log("Deauthing inputs");
	activeDelegates = getActiveItems("lGroups").concat(getActiveItems("lUsers"));
	activeRepos = getActiveItems("lRepos");

	if (activeDelegates.length == 0) {
		window.alert("Please select one or more users/groups to authorise (Use ALT to select multiple items)");
		return;
	}
	if (activeRepos.length == 0) {
		window.alert("Please select one or more repositories to authorise access to (Use ALT to select multiple items)");
		return;
	}

	for (var i = 0; i < activeRepos.length; i++) {
		for (var j = 0; j < activeDelegates.length; j++) {
			console.log("Deleting " + activeDelegates[j].innerText + " from " + activeRepos[i].innerText);
			deleteRepoRule(activeRepos[i].innerText, activeDelegates[j].innerText);
		}
	}
	updateContext();
}
