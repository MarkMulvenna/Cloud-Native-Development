function performLogin(username, password) {
  var data = {
    username: username,
    password: password
  };

  $.ajax({
    type: "POST",
    url: "https://prod-05.ukwest.logic.azure.com/workflows/29be6dcf66af4e4aa6eaf6e04a734c28/triggers/manual/paths/invoke/auth/v1/login?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=78tmK8oz4ZdSgh-bmadEWZ3EuPmbNMit65mX4YWjtHg",
    data: data,
    success: function(response) {

      var userID = response.Table1[0].UserID;
      var email = response.Table1[0].Email;
      var username = response.Table1[0].Username;
      var password = response.Table1[0].Password;

      localStorage.setItem('userID', userID);
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);

      window.location.href = "index.html";
    },
    error: function(xhr, status, error) {
      alert("Invalid username or password. Please try again.");
    }
  });
}

$(document).ready(function() {
  $("#loginBtn").click(function() {
    var username = $("#username").val();
    var password = $("#password").val();
    performLogin(username, password)
  });
});