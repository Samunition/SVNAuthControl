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
var gSearchableList = null; //Global
var gWrapped = 0;
var gSelectSingleAction = "";

var Rules = {
	ruleSet : []
};

//Will be run when page is loaded
function startup() {
	interfaceSetup()
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
	window.onclick = function(event) { // When the user clicks anywhere outside of the modal, close it
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
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
			updateLists();
			console.log("Lists populated");

			addUser("Samuel");
			// addGroup("samsgroup", ["sam", "and", "his", "mates"]);
			// addGroup("samsgroup", ["sam", "and", "his", "mates"]);
			// deleteGroup("samsgroup");
			// deleteGroup("samsgroup");
			// console.log("Load user rules");
			// userRuleLoader("user1");
			// rebuildFile();
			// deleteRepo("/");
			// deleteRepo("lol");
			// deleteRepoRule("/anotherone", "group5");
			// addRepoRule("/anotherone", "user7", "r");
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


// Populate the groups list with the groups
function populateGroups() {
	var groups = Rules.ruleSet[0];
	var ul = document.getElementById("lGroups"); //Get the list
	var nGroups = groups.length;

	console.log("Adding " + nGroups + " groups to groups list");

	for (var i=0; i<nGroups; i++) {
		litem = document.createElement("li"); //Create & get the new item
		litem.className = "contextgroup";
		litem.id = groups[i][0];
		litem.innerHTML = groups[i][0]; //Put text in the new item
		ul.appendChild(litem);
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

function wrapListItems() {
	if (gWrapped = 1) {
		$(".contextgroup a").unwrap();
	} else {
		gWrapped = 1;
	}
	//The .contextgroup on the li items are only there to serve as identifiers and are unrelated to the anchor's contextgroup
	$(".contextgroup").wrap('<a class = "contextgroup" href = "#" onclick = "activate(\'contextgroup\');"></a>'); //This need only run once whenever stuff is added
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
	var nGroups = Rules.ruleSet[0].length;
	var found = false;

	for (var i = 0; i < nGroups; i++) {
		if (Rules.ruleSet[0][i][0] == groupName) {
			Rules.ruleSet[0].splice(i, 1);
			console.log("deleted");
			break;
		}
	}

	if (!found) {
		// Not found
		console.log("Group not found");
	}

	// Todo search repos for group and delete rules
	updateLists();
}

function updateGroup(groupName, usernames) {
	// Todo find group, replace user list with new one
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
			var nRules = Rules.ruleSet[2][i].length
			console.log("Found Repo");
			for (var j = 0; j < nRules; j++) {
				console.log(Rules.ruleSet[2][i][1][j]);
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

function updateLists() {
	// Clear lists
	clearLists();
	// Populate lists
	populateGroups();
	populateUsers();
	populateRepos();
	wrapListItems();
	console.log("Screen Updated");
}

function saveFile(contents) {
	$.ajax({
    url: '/scripts/save-file.php',
    type: 'POST',
    data: {
      content: contents
    },
    success: function(deleted) {
      console.log("Saved!");
      console.log(deleted);
    }
  });
}

function userRuleLoader(username) {
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
}

function groupRuleLoader(groupName) {
 // Load rules for the groups
 // Check each repo against the group
 console.log("LOADING GROUP RULES");
 var nRepos = Rules.ruleSet[2].length;
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
		 if (groupName == Rules.ruleSet[2][i][1][j][0]) {
			 repoPerms.push([Rules.ruleSet[2][i][1][j][1], Rules.ruleSet[2][i][1][j][0]]);
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
}

function repoRuleLoader(repo) {
 // load rules for selected repos
}

//-------------------From here is UI code------------------

function UMTabTo(whichTab) {
	if (gSelectSingle != "") {
		return;
	}
	if (whichTab.toUpperCase() == 'USERS') {
		document.getElementById('usersTab').className = 'activeCurrent';
		document.getElementById('groupsTab').className = '';
		document.getElementById('userManagerGroups').style.display = 'none';
		document.getElementById('userManagerUsers').style.display = 'block';
	} else {
		document.getElementById('groupsTab').className = 'activeCurrent';
		document.getElementById('usersTab').className = ''
		document.getElementById('userManagerUsers').style.display = 'none';
		document.getElementById('userManagerGroups').style.display = 'block';
	}
	prepSearch("tabbox");
}

function addUsersPrompt() {
	var thisGroup = getActiveItem("contextgroup")[0];
	if ((!thisGroup) || (thisGroup.parentNode.parentNode.id != "lUsers")) {
		console.log("Add Users clicked without users. Got: " + thisGroup.parentNode.parentNode.id);
		window.alert("You'll have to select some users to add first");
	} else {
		UMTabTo("GROUPS");
		console.log("addUsersPrompt is DOING STUFF");
		gSelectSingle = "lGroups";
		gSelectSingleAction = "addToGroup"
		popupPrompt("Add users to which group?",30,10,300,25);
	}
}

function popupPrompt(message, x, y, w, h) {
	popup = document.getElementById("popup");
	popupText = document.getElementById("popupText");
	popup.style.left = x + "%";
	popup.style.top = y + "%";
	popup.style.width = w + "px";
	popup.style.height = h + "px";
	popupText.innerHTML = message;
	popup.style.display = "block";
}

function closePopupPrompt() {
	popup.style.display = none;
}

//Activates the clicked item in the list where all elements have the class nameOfList
function activate(nameOfList) {
	var activeItem = document.activeElement;
	listcontent = document.getElementsByClassName(nameOfList);
	console.log("Activate has " + nameOfList);
	console.log("Parentally active thingy is " + document.activeElement.parentNode.id);
	console.log("gSelectSingle is " + gSelectSingle);
	if ((gSelectSingle == "") || (gSelectSingle == document.activeElement.parentNode.id)) {
		if (gSelectSingleAction == "addToGroup") {
			gSelectSingleAction = "";
			var all = document.getElementsByTagName("*");
			var listOfUsers = [];
			for (var i=0; i<all.length; i++) {
				if ((all[i].className.includes("active")) && (all[i].parentNode.id.includes("lUsers"))) {
					console.log("getActiveItem has another item");
					listOfUsers.push(all[i]);
				}
			}
			var fromGroup = document.activeElement.innerHTML;
			console.log(fromGroup);
			updateGroup(fromGroup,listOfUsers);
		}
		if (selectMultiple) {
			for (var i=0; i<listcontent.length; i++) {
				listcontent[i].firstChild.className = nameOfList;
			}
		}
		if (activeItem.firstChild.className.includes("active")) {
			activeItem.firstChild.className = nameOfList;
		} else {
			activeItem.firstChild.className = nameOfList + " active";
		}
		updateContextBox(activeItem.firstChild);
		gSelectSingle = "";
	} else {
		console.log("You can't click this at the moment");
	}
}

function updateContextBox(withWhat) {
	console.log(withWhat.parentNode.parentNode.id);
	var originatingList = withWhat.parentNode.parentNode.id;
	console.log(originatingList);
	var contextBoxTitle = document.getElementById("contextHeader");
	if (originatingList == "lGroups") {
		contextBoxTitle.innerHTML = "Users that are in the group \"" + withWhat.innerHTML + "\"";
		userRuleLoader(withWhat.id);
	}
	if (originatingList == "lUsers") {
		contextBoxTitle.innerHTML = "Repositories that \"" + withWhat.innerHTML + "\" has access to";
		console.log(withWhat.id);
		userRuleLoader(withWhat.id);
	}
	if (originatingList == "lRepos") {
		contextBoxTitle.innerHTML = "Users that have access to \"" + withWhat.innerHTML + "\"";
	}
}

function getActiveItem(whichClass) { //Returns an array of the selected items
	var all = document.getElementsByTagName("*");
	var activeItems = [];
	for (var i=0; i<all.length; i++) {
		if ((all[i].className.includes("active")) && (all[i].className.includes(whichClass))) {
			console.log("getActiveItem has another item");
			activeItems.push(all[i]);
		}
	}
	return activeItems;
}

function prepSearch(which) {
	console.log("prepSearch has " + which);
	var listContainer;
	if (which == "tabbox") {
		if (document.getElementById('userManagerUsers').style.display == 'none') {
			listContainer = document.getElementById('lGroups');
		} else {
			listContainer = document.getElementById('lUsers');
		}
	} else {
		listContainer = document.getElementById(which);
	}
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
	var modal = document.getElementById("modalbox");
	modal.style.display = "none";
	modalContents.value = "";
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

function interfaceSetup() {
	modalSetup();
	UMTabTo('Groups');
	gSearchableList = null;
	document.getElementById("multiSelect").checked = true;
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
