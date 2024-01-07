const AUTHDLTENDPOINT =
  "https://prod-01.ukwest.logic.azure.com/workflows/6cbb202e062a42a2bb3c1a5f5c3d79a2/triggers/manual/paths/invoke/auth/v1/user/" +
  localStorage.userID +
  "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=JnGO6w6fuiPf_UDTF0R-cOd2oRi4RCndSStbOCr2x48";

const AUTHUPDTENDPOINT =
  "https://prod-19.ukwest.logic.azure.com/workflows/876b64fcecf9467daf8862dee23c6f79/triggers/manual/paths/invoke/auth/v1/update?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WdHuE-ZsZrA-W0Tiz61ywwj5GGyjBaE2lVQGENLua1Y";

document.addEventListener("DOMContentLoaded", function () {
  initializeAccountFields();

  document
    .getElementById("confirmDeleteButton")
    .addEventListener("click", showDeleteConfirmation);
  document
    .getElementById("deleteAccountButton")
    .addEventListener("click", handleAccountDeletion);

  document
    .getElementById("updateButton")
    .addEventListener("click", updateUser)
});

function initializeAccountFields() {
  document.getElementById("userName").value = localStorage.username || "";
  document.getElementById("email").value = localStorage.email || "";
  document.getElementById("password").value = localStorage.password || "";
}





function updateUser() {
  console.log("Update")
  const email = $("#email").val();
  const password = $("#password").val();
  const userId = localStorage.userID;

  const requestData = {
    Email: email,
    Password: password,
    UserId: userId 
  };

  $.ajax({
    url: AUTHUPDTENDPOINT,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(requestData),
    success: function (response) {
      console.log("User details updated successfully:", response);
      performLogin(localStorage.username, password ?? localStorage.password);
    },
    error: function (xhr, status, error) {
      console.error("Error updating user details:", error);
    },
  });
}

function deleteUser() {
  $.ajax({
    url: AUTHDLTENDPOINT,
    type: "DELETE",
    success: function (response) {
      window.location.href = "login.html";
      console.log("Account deleted successfully:", response);
    },
    error: function (xhr, status, error) {
      console.error("Error deleting account:", error);
    },
  });
}

// Function to show the delete confirmation modal
function showDeleteConfirmation() {
  const modal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  modal.show();
}

// Function to handle account deletion
function handleAccountDeletion() {
  deleteUser();
  console.log("Account deleted!");
}
