// The URIs of the REST endpoint
const IUPS =
  "https://prod-14.ukwest.logic.azure.com:443/workflows/570a207554a7459aba6b85cb982b096a/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Q0y--8rGy1t15RUvd4tD6ZR_NzT0AqJaK0WrxwNOPfw";

const RAI =
  "https://prod-30.ukwest.logic.azure.com:443/workflows/6c75893044a0496198c027acef7fdf97/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GlRWWTMmtW7t2fRn5Vq0K_BZqfSJgNgTcu5iTsidcHk";

const DAI =
  "https://prod-23.ukwest.logic.azure.com/workflows/37a536ed718440adbed8704dfc3f32b5/triggers/manual/paths/invoke/id/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=39bMNiDUGCIG3iqXwN_02w948siuaNYEe6vUlVVJP2E"

const USRIMGROUTE =
  "https://prod-07.ukwest.logic.azure.com/workflows/b4d524a68e02444eacacd305560b83a8/triggers/manual/paths/invoke/images/" + localStorage.userID + "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=LPaIhDoMQQvZWXcQibddRz9OXwjZbaqvrRr1yITis7U";

const BLOB_ACCOUNT = "https://mediashare00783510.blob.core.windows.net";

$(document).ready(function () {
  $("#getImages").click(function () {
    getImages();
  });

  $("#subNewForm").click(function () {
    submitNewAsset();
  });
  $("#logoutBtn").click(function () {
    localStorage.clear();
    window.location.href = "login.html";
  });

  $("#UpFile").change(function (event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');
      $("#FileName").val(fileNameWithoutExtension);
    }
  });
});
 
function getFileExtension(fileName) {
  return fileName.split(".").pop().toLowerCase(); 
}

function submitNewAsset() {
  const submitData = new FormData();

  const selectedFile = $("#UpFile")[0].files[0];
  submitData.append("FileName", $("#FileName").val() + (selectedFile ? '.' + getFileExtension(selectedFile.name) : ''));
  console.log("FileName", $("#FileName").val() + (selectedFile ? '.' + getFileExtension(selectedFile.name) : ''));
  submitData.append("userID", localStorage.userID);
  submitData.append("userName", localStorage.username);
  submitData.append("File", selectedFile);

  $.ajax({
    url: IUPS,
    data: submitData,
    cache: false,
    enctype: "multipart/form-data",
    contentType: false,
    processData: false,
    type: "POST",
    success: function (data) {
      console.log(data);
    },
  });
}

function getImages() {
  console.log("Running");
  $("#ImageList").html(
    '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>'
  );

  let selectedEndpoint = $("#btnViewMyFiles").is(":checked") ? USRIMGROUTE : RAI;

  $.getJSON(selectedEndpoint, function (data) {
    var items = [];

    $.each(data, function (key, val) {
      items.push("<hr />");

      const isUserItem = val["userID"] == localStorage.userID;

      if ((val["fileName"]).toLowerCase().endsWith(".mp4")) {
        items.push("<video width='400' controls id='" + val["id"] + "'>");
        items.push(
          "<source src='" +
            BLOB_ACCOUNT +
            val["filePath"] +
            "' type='video/mp4'>"
        );
        items.push("Your browser does not support the video tag.");
        items.push("</video> <br />");
      } else {
        items.push(
          "<img src='" +
            BLOB_ACCOUNT +
            val["filePath"] +
            "' width='400' id='" +
            val["id"] +
            "'/> <br />"
        );
      }

      items.push("File: " + (val["fileName"]) + "<br />");
      items.push(
        "Uploaded by: " +
          val["userName"] +
          " (user id: " +
          val["userID"] +
          ")<br />"
      );

      if (isUserItem) {
        items.push(
          "<button class='btn btn-danger deleteButton' data-item-id='" +
            val["id"] + 
            "'>Delete</button><br />"
        );

        items.push(
          "<button class='button updateButton' data-item-id='" 
          + val["id"] + 
            "'>Update</button><br />"
        ) 
      }

      items.push("<hr />");
    });

    $("#ImageList").empty();

    $("<ul/>", {
      class: "my-new-list",
      html: items.join(""),
    }).appendTo("#ImageList");

    $(".deleteButton").click(function () {
      const itemId = $(this).data("item-id");
      deleteMedia(itemId);
    });

    $(".updateButton").click(function () {
      const itemId = $(this).data("item-id");
      localStorage.setItem('updateId', itemId);
      window.location.href = "updateMedia.html";
    });
  });
}

function deleteMedia(imageId) {
  const deleteEndpoint = DAI;
  
  const updatedEndpoint = deleteEndpoint.replace("{id}", imageId);

  $.ajax({
    url: updatedEndpoint,
    type: 'DELETE',
    success: function (response) {
      console.log(`Image/Video with ID ${imageId} deleted.`, response);
      setTimeout(getImages(), 1000);
    },
    error: function (xhr, status, error) {
      console.error(`Error deleting Image/Video with ID ${imageId}:`, error);
    }
  });
}