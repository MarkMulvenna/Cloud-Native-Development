$(document).ready(function () {
    $(".dropdown-item").on('click', function () {
        $("#dropdownMenuButton").text($(this).text());
    });    

    $("#translateBtn").click(function () {
        translateText($("#dropdownMenuButton").text(), $("#rawText").val());
    });   
});



function translateText(targetLanguage, rawText)
{
    var data = {
        targetLanguage: targetLanguage,
        rawText: rawText,
    };

    if (rawText.length != 0 && targetLanguage.length != 0){
        $.ajax({
            type: "POST",
            url: "https://prod-21.ukwest.logic.azure.com:443/workflows/8abc9cba3e5a4e34b2b8549574f67ff7/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FaK1KrRRtxIE9Gfquk7p1ugWulmmGalbqBSEle5rG5Y",
            data: data,

            success: function(response) {
                document.getElementById('translationResponse').value = response[0].TranslatedText;
            },
            error: function (xhr, status, error) {
                console.error('Error getting translation response');
            }
        })
    }
}

