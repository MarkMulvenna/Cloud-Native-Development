$(document).ready(function () {
  $("#registerBtn").click(function (e) {
    e.preventDefault();

    var formData = {
      username: $("#username").val(),
      email: $("#email").val(),
      password: $("#password").val(),
    };

    if (username == "" || email == "" || password == "") {
      $("#registrationError").text(
        "One or more necessary fields were not filled."
      );
      return;
    }

    $.ajax({
      type: "POST",
      url: "https://prod-17.ukwest.logic.azure.com/workflows/2c04df54d50b4e219e36612626e129e2/triggers/manual/paths/invoke/auth/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1CiCisum_b6CHtqBZO-6MnyuBfzcN4NGyY5LLFbno1k",
      data: formData,
      success: function (response) {
        console.log("Registration successful", response);
        performLogin(formData.username, formData.password);
      },
      error: function (xhr, status, error) {
        console.error("Registration error", status, error);
        $("#registrationError").text(xhr["responseText"]);
      },
    });
  });
});
