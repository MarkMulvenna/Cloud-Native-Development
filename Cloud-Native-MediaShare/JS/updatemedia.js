const RETRIEVESINGLEASSETROUTE = "https://prod-02.ukwest.logic.azure.com/workflows/ecf29c49f84c49da931f9069190563b7/triggers/manual/paths/invoke/id/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=p_xxqiDa8XOsnyUYlBx__m1v5Uebai7hQro6lABzVdc";
const BLOB_ACCOUNT = "https://mediashare00783510.blob.core.windows.net";
const UIA = "https://prod-18.ukwest.logic.azure.com/workflows/51006aa2614c4d3b9cdfff33fccdb36a/triggers/manual/paths/invoke/id/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=z7OvWddJLYMfFXNoVG_JkKJ8toVJOTfQtQpMTie4uK8"


function retrieveImageAsset(imageId) {
    const retrieveImageAssetEndpoint = RETRIEVESINGLEASSETROUTE.replace("{id}" , imageId);

    $.ajax({
    url: retrieveImageAssetEndpoint,
    type: 'GET',
    success: function(response) {
        console.log(response);
        initializeMediaUpdateFields(response);
    },
    error: function (xhr, status, error) {
        console.error(`Error get Image/Video with ID ${imageId}:`, error);
    }
    });
}

$(document).ready(function () {
    $("#updateMediaForm").click(function () {
      updateAsset(localStorage.getItem('updateId'));
    });
});

function getFileExtension(fileName) {
    return fileName.split(".").pop().toLowerCase(); 
  }

function shaveFileExtention(fileName) {
    return fileName.replace(/\.[^/.]+$/, '');
}

function updateAsset(imageId) {
    const UIARoute = UIA.replace("{id}", imageId)
    const submitData = new FormData();

    const selectedFile = $("#UpFile")[0].files[0] || null;
    if (selectedFile != null)
        submitData.append("File", selectedFile);
    else
        return;

    submitData.append("FileName", $("#FileName").val() + (selectedFile ? '.' + getFileExtension(selectedFile.name) : ''));
    console.log("FileName", $("#FileName").val() + (selectedFile ? '.' + getFileExtension(selectedFile.name) : ''));
    submitData.append("userID", localStorage.userID);
    submitData.append("userName", localStorage.username);
    submitData.append("password", localStorage.password)

    const formDataArray = Array.from(submitData);
console.log(formDataArray);

    
    
    $.ajax({
        url: UIARoute,
        data: submitData,
        cache: false,
        enctype: "multipart/form-data",
        contentType: false,
        processData: false,
        type: "PUT",
        success: function (data) {
          console.log(data);
          location.reload();
        },
      });
}

$(document).ready(function() {
    retrieveImageAsset(localStorage.getItem('updateId'))
});

function initializeMediaUpdateFields(response) {
    $('.media-asset').attr('src', BLOB_ACCOUNT + response["filePath"])
    document.getElementById("FileName").value = shaveFileExtention(response["fileName"]);
    document.getElementById("UpFile") = null;
}