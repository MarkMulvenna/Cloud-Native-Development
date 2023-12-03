//The URIs of the REST endpoint
IUPS =
  "https://prod-47.eastus.logic.azure.com:443/workflows/5edcec59b6f24afe8822ece56551d52d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2iIogOlmIJhj5y-3IloFnx41fEnbjyzaMNGwTnl5Hls"
RAI =
  "https://prod-43.eastus.logic.azure.com:443/workflows/481edfd30f3c460181cff83996afc360/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HyM_J-AfsTd2zyuHtUBdd6ZpffRfheDjBxYoBjGYhOk"

BLOB_ACCOUNT = "https://blobstoragesust.blob.core.windows.net"

//Handlers for button clicks
$(document).ready(function () {
  $("#retImages").click(function () {
    //Run the get asset list function
    getImages()
  })

  //Handler for the new asset submission button
  $("#subNewForm").click(function () {
    //Execute the submit new asset function
    submitNewAsset()
  })
  $("#logoutBtn").click(function () {
    // Perform logout actions as needed
    // For example, you can redirect the user back to the login page
    window.location.href = "login.html"
  })
})

//A function to submit a new asset to the REST endpoint
function submitNewAsset() {
  //Create a form data object
  submitData = new FormData()

  //Get form variables and append them to the form data object
  submitData.append("FileName", $("#FileName").val())
  submitData.append("userID", $("#userID").val())
  submitData.append("userName", $("#userName").val())
  submitData.append("File", $("#UpFile")[0].files[0])

  //Post the form data  to the endpoint, note the need to set the content type header
  $.ajax({
    url: IUPS,
    data: submitData,
    cache: false,
    enctype: "multipart/form-data",
    contentType: false,
    processData: false,
    type: "POST",
    success: function (data) {
      console.log(data)
    },
  })
}
function getImages() {
  // Replace the current HTML in that div with a loading message
  $("#ImageList").html(
    '<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span></div>'
  )

  $.getJSON(RAI, function (data) {
    // Create an array to hold all the retrieved assets
    var items = []

    // Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) {
      items.push("<hr />")

      // Check if the URL indicates a video file (replace '.mp4' with the actual video file extension)
      if (atob(val["fileName"].$content).toLowerCase().endsWith(".mp4")) {
        items.push("<video width='400' controls>")
        items.push(
          "<source src='" +
            BLOB_ACCOUNT +
            val["filePath"] +
            "' type='video/mp4'>"
        )
        items.push("Your browser does not support the video tag.")
        items.push("</video> <br />")
      } else {
        items.push(
          "<img src='" +
            BLOB_ACCOUNT +
            val["filePath"] +
            "' width='400'/> <br />"
        )
      }

      items.push("File: " + atob(val["fileName"].$content) + "<br />")
      items.push(
        "Uploaded by: " +
          atob(val["userName"].$content) +
          " (user id: " +
          atob(val["userID"].$content) +
          ")<br />"
      )
      items.push("<hr />")
    })

    // Clear the assetlist div
    $("#ImageList").empty()

    // Append the contents of the items array to the ImageList Div
    $("<ul/>", {
      class: "my-new-list",
      html: items.join(""),
    }).appendTo("#ImageList")
  })
}

/*A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){
//Replace the current HTML in that div with a loading message
//$('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');

//$.getJSON(RAI, function( data ) {

  //Create an array to hold all the retrieved assets
  //var items = [];

  //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) 
	{

        items.push("<hr />");
		//items.push("<img src='" + BLOB_ACCOUNT + val["filePath"] + "'width='400'/> <br />");
    items.push("<img src='" + BLOB_ACCOUNT + val["filePath"] + "'width='400'/> <br />");
		items.push("File: " + atob(val["fileName"].$content) + "<br />");
		items.push("Uploaded by: " + atob(val["userName"].$content) + " (user id: " + atob(val["userID"].$content) + ")<br />");
		items.push("<hr />");

    });

    //Clear the assetlist div 
    $('#ImageList').empty();

    //Append the contents of the items array to the ImageList Div
    $( "<ul/>", {
      "class": "my-new-list",
      html: items.join( "" )
    }).appendTo( "#ImageList" );
  });*/
