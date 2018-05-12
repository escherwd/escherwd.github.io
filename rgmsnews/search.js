var apiKey = "AIzaSyBnxe8HZWottEGjOWD5b4FtYig4ZVCTTPA"
var channelId = "UCM2Q6kuFaksN8HkXtSF21og"

var noResultsTemplate = "<li class='table-view-cell'>🎞 No Results</li>"

function searchFor(term) {
    document.getElementsByName("loader")[0].style = "visibility:visible"
    document.getElementsByName("searchList")[0].innerHTML = ""
    document.getElementsByName("resultsHeader")[0].style = "visibility:hidden;"
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=" + term + "&type=video&channelId=" + channelId + "&key=" + apiKey
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(this.responseText);
            for (itemIndex in jsonResponse.items) {
                var item = jsonResponse.items[itemIndex]
                if (item.snippet.channelId == channelId) {
                    var date = parseDate(item.snippet.publishedAt)
                    var body = "Uploaded: " + date[0] + "/" + date[1] + "/" + date[2] + "<br>"
                    var titleArray = parseTitle(item.snippet.title)
                    var title = titleArray[0]
                    if (titleArray.length > 1) {
                        body = "<strong> " + titleArray[1] + "</strong><br>" + body
                    }
                    //They screwed up their title somehow
                    if (date[1] == 27 && date[0] == 4 && date[2] == 2018 && title == "RGMS News") {
                        body = "<strong> Season 4 </strong><br>" + body
                        title = "Episode 29-F"
                    }
                    var listItem = listItemTemplate.replace("#TITLE#", title).replace("#BODY#", body).replace("#THUMB#", item.snippet.thumbnails.medium.url).replace("#ID#", item.id.videoId);
                    document.getElementsByName("searchList")[0].innerHTML += listItem
                    document.getElementsByName("resultsHeader")[0].style = "visibility:visible;"
                    document.getElementsByName("loader")[0].style = "visibility:hidden"
                }
            }
            if (jsonResponse.items.length <= 0) {
                document.getElementsByName("searchList")[0].innerHTML = noResultsTemplate
                document.getElementsByName("loader")[0].style = "visibility:hidden"
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}