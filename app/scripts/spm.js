/* $(document).ready(function () {
  // Prevent Ajax caching - always get a new result
  $.ajaxSetup({
    cache: false
  });

  // Bloomin text area keeps content after refresh
  document.getElementById('content').value = '';
}); */

//Will be run when page is loaded
gSearchableList = null; //Global
gWrapped = 0;
function startup() {
	UMTabTo('Groups');
	loadFile();
	loadGroups();
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
function loadGroups() {
  $.ajax({
    url: '/scripts/load-groups.php',
    dataType: 'json',
    type: 'POST',
    success: function(rules) {
      console.log("Groups loaded.");
      bringGroups(rules);
			bringUsers(rules);
			wrapListItems();
    }
  });
};

// Checks if an item exists in
Array.prototype.pushUnique = function(item) {
	if (this.indexOf(item) == -1) {
		this.push(item);
		return true;
	}
	return false;
};

function bringUsers(json) {
	 var users = []; // An array of unique users

	 // Loop through the keys
	 for (var key in json) {
		 // Get users from the group list
		 if (key == 'groups') {
			 for (subkey in json[key]) {
				 // Users in the group to be split as its a list
				 var gusers = json[key][subkey].match(/\w+/g);

				 for (var i = 0; i < gusers.length; i++){
					 console.log(gusers[i]);
					 users.pushUnique(gusers[i]);
				 }
			 }
		 }
		 // Get users from repo access lists
		 if (key != 'groups') {
			 console.log(key, json[key]);
			 for (subkey in json[key]) {
				 // @ means groups and * means all so we dont want them as they are not users
				 if (subkey.charAt(0) != '@' &&  subkey.charAt(0) != '*') {
					 users.pushUnique(subkey);
				 }
			 }
		 }
	 }

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

function wrapListItems() {
	if (gWrapped = 1) {
		$(".contextgroup a").unwrap();
	} else {
		gWrapped = 1;
	}
	//The .contextgroup on the li items are only there to serve as identifiers and are unrelated to the anchor's contextgroup
	$(".contextgroup").wrap('<a class = "contextgroup" href = "#" onclick = "activate(\'contextgroup\');"></a>'); //This need only run once whenever stuff is added
}

//Refresh the groups box with the JSON's information
function bringGroups(json) {
	var ul = document.getElementById("lGroups"); //Get the list
	var nGroups = Object.keys(json.groups).length;
	console.log("The JSON is updating the groups box with "+nGroups+" items");
	for (var i=0; i<nGroups; i++) {
		litem = document.createElement("li"); //Create & get the new item
		litem.className = "contextgroup";
		litem.innerHTML = Object.keys(json.groups)[i];; //Put text in the new item
		ul.appendChild(litem);
	}
	console.log("The JSON has finished updating the groups box.");
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

function populateLists() {
	//Populate the groups
	var ul = document.getElementById('lGroups');

	for (var i=0; i<groups.length; i++) {
		var li = document.createElement('li');
		var liContent = document.createTextNode(groups[i]);
		li.appendChild(document.createTextNode(liContent));
		ul.appendChild(li);
	}
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
	console.log("activate is called with " + nameOfList);
	listcontent = document.getElementsByClassName(nameOfList);
	console.log("activate has " + listcontent.length + " items.");
	for (var i=0; i<listcontent.length; i++) {
        listcontent[i].firstChild.className = nameOfList;
    }
	activeItem.firstChild.className = nameOfList + " active";
	console.log("activate has finished.");
	updateContextBox(activeItem.firstChild);
}

function updateContextBox(withWhat) {
	var originatingList = withWhat.parentNode.parentNode;
	var contextBoxTitle = document.getElementById("contextHeader");
	console.log(originatingList.className);
	if (originatingList.className = 'lGroups') {
		contextBoxTitle.innerHTML = "Users that are in the group \"" + withWhat.innerHTML + "\"";
	}
	if (originatingList.className = 'lUsers') {
		contextBoxTitle.innerHTML = "Repositories that \"" + withWhat.innerHTML + "\" has access to";
	}
}

function prepSearch(which) {
	console.log("prepSearch has " + which);
	var listContainer;
	if (which=="tabbox") {
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
		if (currentItem.includes(document.activeElement.value)) {
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

/*---------------From here is unused code------------------

function listGroups(json) {
    // Groups
    var groups = json.groups;
    console.log("Groups: " + JSON.stringify(groups, null, 4));
    // Remove once function for where this goes is made
    $("#content").val(JSON.stringify(groups, null, 4));
}

*/
