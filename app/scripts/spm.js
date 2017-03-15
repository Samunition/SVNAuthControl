$(document).ready(function () {
  // Prevent Ajax caching - always get a new result
  $.ajaxSetup({
    cache: false
  });

  // Bloomin text area keeps content after refresh
  document.getElementById('content').value = '';
});

function parseGroups(json) {
    // Groups
    var groups = json.groups;
    console.log("Groups: " + JSON.stringify(groups, null, 4));
    // Remove once function for where this goes is made
    $("#content").val(JSON.stringify(groups, null, 4));
}

function loadFile() {
  $.ajax({
    url: '/scripts/load-file.php',
    type: 'POST',
    success: function(html) {
      $("#content").val(html);
      console.log("Loaded!");
    }
  });
};

function loadGroups() {
  $.ajax({
    url: '/scripts/load-groups.php',
    dataType: 'json',
    type: 'POST',
    success: function(rules) {
      //var rules = $.parseJSON(result)
      console.log(rules);
      console.log("Loaded!");
      parseGroups(rules);
    }
  });
};

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
