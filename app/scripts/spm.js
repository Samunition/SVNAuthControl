/* $(document).ready(function () {
  // Prevent Ajax caching - always get a new result
  $.ajaxSetup({
    cache: false
  });

  // Bloomin text area keeps content after refresh
  document.getElementById('content').value = '';
}); */

var Rules = {
	ruleSet : []
};

//Will be run when page is loaded
function startup() {
	UMTabTo('Groups');
	//loadFile();
	load();
	gSearchableList = null; //Global
}

function loadFile() {
  $.ajax({
    url: '/scripts/load-file.php',
    type: 'POST',
    success: function(html) {
      $("#content").val(html);
      console.log("File loaded.");
    }
  });
};

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

			// addUser("sam");
			// addGroup("samsgroup", ["sam", "and", "his", "mates"]);
			// addGroup("samsgroup", ["sam", "and", "his", "mates"]);
			// deleteGroup("samsgroup");
			// deleteGroup("samsgroup");
    }
  });
};

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
		litem.innerHTML = repos[i][0]; //Put text in the new item
		ul.appendChild(litem);
	}
}

function wrapListItems() {
	//$(".contextgroup").unwrap();
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
		// Message sayiong it worked like a popup notification or something
	}
	else {
		// Message saying user already present
	}
	updateLists();
}

function deleteUser(username) {
	// Delete from users and from group rules and repos
}

function addRepo(repoLoc) {
	//Todo add a repo value
}

function addRepoRule(repoLoc, delegate, perms) {
	// Todo add a rule to the repo
}

function deleteRepoRule(repoLoc, delegate) {
	// Todo delete the given repo rule
}

function updateRepoRule(repoLoc, delegate, perms) {
	// Todo update given repo rule
}

function deleteRepo(repoLoc) {
	// Todo delete repo
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

function saveFile() {
  var contents = $('#content').val();

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

//-------------------From here is UI code------------------

function UMTabTo(whichTab) {
	if (whichTab == 'Users') {
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
}

//Activates the clicked item in the list where all elements have the class nameOfList
function activate(nameOfList) {
	var activeItem = document.activeElement;
	//console.log("activate is called with " + nameOfList);
	listcontent = document.getElementsByClassName(nameOfList);
	//console.log("activate has " + listcontent.length + " items.");
	for (var i=0; i<listcontent.length; i++) {
        listcontent[i].firstChild.className = nameOfList;
    }
	activeItem.firstChild.className = nameOfList + " active";
	//console.log("activate has finished.");
	updateContextBox(activeItem.firstChild);
}

function updateContextBox(withWhat) {
	var originatingList = $(withWhat).closest('ul');
	var contextBoxTitle = document.getElementById("contextName");
	if (originatingList.className = "lGroups") {
		contextBoxTitle.innerHTML = "<p>Users that are in the group \"" + withWhat.innerHTML + "\"<input type=\"text\" name=\"searchbar\" placeholder=\"Search\" onclick=\"prepSearch('lContextBox')\" onblur=\"endSearch()\" oninput=\"search()\"></input></p>"; //YES, I KNOW
	}
	if (originatingList.className = "lUsers") {
		contextBoxTitle.innerHTML = "<p>Repositories that \"" + withWhat.innerHTML + "\" has access to<input type=\"text\" name=\"searchbar\" placeholder=\"Search\" onclick=\"prepSearch('lContextBox')\" onblur=\"endSearch()\" oninput=\"search()\"></input></p>"; //I KNOW
	}
}

function prepSearch(which) {
	console.log("prepSearch has " + which);
	var listContainer;
	if (which=="tabbox") {
		if (document.getElementById('userManagerUsers').style.display == 'none') {
			console.log("prepSearch is assigning lGroups");
			listContainer = document.getElementById('lGroups');
		} else {
			console.log("prepSearch is assigning lUsers");
			listContainer = document.getElementById('lUsers');
		}
	} else {
		listContainer = document.getElementById(which);
	}

	gSearchableList = listContainer.getElementsByTagName("li");
}

function search() {
	for (var i=0; i<gSearchableList.length; i++) {
		if (contains(gSearchableList[i],document.activeElement.text)) {
			gSearchableList[i].style.display = 'block';
		} else {
			gSearchableList[i].style.display = 'none';
		}
	}
}

function endSearch() {
	for (var i=0; i<gSearchableList.length; i++) {
		gSearchableList[i].style.display = 'block';
	}
	gSearchableList = null;
}

function contains(that,theOther) {
	//Iterate looking for first letter
	//sequentially match letters once that's found. If they're wrong, start again.
}

/*---From here is unused code, can be deleted eventually---

function listPopulatorTest() {	//Sample function for adding list item
	ul = document.getElementById("lGroups");
	litem = document.createElement("li"); //Get the new item
	litem.className = "contextgroup";
	litem.innerHTML = "I'm a group"; //Put text in the new item
	ul.appendChild(litem);

	litem = document.createElement("li"); //Get the new item
	litem.className = "contextgroup";
	litem.innerHTML = "So am I a group too!"; //Put text in the new item
	ul.appendChild(litem);

	litem = document.createElement("li"); //Get the new item
	litem.className = "contextgroup";
	litem.innerHTML = "I am also a group"; //Put text in the new item
	ul.appendChild(litem);

	ul = document.getElementById("lUsers"); //Get the list
	litem = document.createElement("li"); //Get the new item
	litem.className = "contextgroup";
	litem.innerHTML = "I'm a user"; //Put text in the new item
	ul.appendChild(litem);

	litem = document.createElement("li"); //Get the new item
	litem.className = "contextgroup";
	litem.innerHTML = "So am I a user too!"; //Put text in the new item
	ul.appendChild(litem);

	litem = document.createElement("li"); //Get the new item
	litem.className = "contextgroup";
	litem.innerHTML = "I am also a user"; //Put text in the new item
	ul.appendChild(litem);

	$(".contextgroup").wrap('<a class = "contextgroup" href = "#" onclick = "activate(\'contextgroup\');"></a>'); //This need only run once whenever stuff is added
	console.log("Lists are populated.");
}

function listGroups(json) {
    // Groups
    var groups = json.groups;
    console.log("Groups: " + JSON.stringify(groups, null, 4));
    // Remove once function for where this goes is made
    $("#content").val(JSON.stringify(groups, null, 4));
}

//Remains of a different data structure. Not used.
var order = 1; //1 or 2, inverts list order
*/
