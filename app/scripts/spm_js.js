//document.getElementById('userManagerGroups').style.display = 'none';
//document.getElementById('userManagerUsers').style.display = 'block';
//Structures to hold relevant lists.
var groups = [];
var users = [];
var itemsObject;

//Settings
var order = 1; //1 or 2, inverts list order

//For demo purposes.
groups.push('Group A');
groups.push('Group B');
groups.push('Group C');

function UMTabTo(whichTab) {
	if (whichTab == 'Users') {
		document.getElementById('usersTab').className = 'active';
		document.getElementById('groupsTab').className = '';
		document.getElementById('userManagerGroups').style.display = 'none';
		document.getElementById('userManagerUsers').style.display = 'block';
	} else {
		document.getElementById('groupsTab').className = 'active';
		document.getElementById('usersTab').className = ''
		document.getElementById('userManagerUsers').style.display = 'none';
		document.getElementById('userManagerGroups').style.display = 'block';
	}
}

function loadJSON() {
}

function listPopulatorTest() {
	var ul = document.getElementById("lGroups");
	var li = document.createElement("li");
	var liContent = document.createTextNode("Y'alright m8");
	li.appendChild(liContent);
	li.href = "javascript:void(0)"
	ul.appendChild(li);
}

function populateLists() {
	var ul = document.getElementById('lGroups');
	
	//Code to add ul to li
	for (i=0; i<groups.length; i++) {
		var li = document.createElement('li');
		var liContent = document.createTextNode(groups[i]);
		li.appendChild(document.createTextNode(liContent));
		ul.appendChild(li);
	}
	//End of code
}

function loadList() {
}

function commit() {
}