var apiKey = "AIzaSyBnxe8HZWottEGjOWD5b4FtYig4ZVCTTPA"
var playlistId = "UUM2Q6kuFaksN8HkXtSF21og"

var featuredListItemTemplate = "<li class='table-view-cell'><a onclick='loadFile(&quot;list.html?list=#INDEX#&quot;)' class='navigate-right'><span class='badge'>#COUNT#</span>#NAME#</a></li></ul>"
var questionTemplate = "<li class='table-view-cell'><strong>Question: </strong><br>#QUESTION#</li><li class='table-view-cell'><a onclick='loadFile(&quot;poll.html?url=#URL#&quot;)' class='navigate-right'>Vote</a></li>"
var emptyRecentsTemplate = "<li class='table-view-cell'>👀 Watch History is Empty</li>"

function getFeatures() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonReponse = JSON.parse(this.responseText);
            for (itemIndex in jsonReponse.items) {
                var item = jsonReponse.items[itemIndex]
                var name = item.name
                var count = item.ids.split(" ").length
                var listItem = featuredListItemTemplate.replace("#NAME#", name).replace("#COUNT#", count).replace("#INDEX#",itemIndex)
                document.getElementsByName("lists")[0].innerHTML += listItem
            }
        }
    };
    xmlhttp.open("GET", "features.json");
    xmlhttp.send();
}

function getPoll() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonReponse = JSON.parse(this.responseText);
                var question = jsonReponse.question
                var url = jsonReponse.url
                var listItem = questionTemplate.replace("#QUESTION#", question).replace("#URL#", url)
                document.getElementsByName("pollList")[0].innerHTML += listItem
        }
    };
    xmlhttp.open("GET", "poll.json");
    xmlhttp.send();
}



function getLatest() {
    var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=" + playlistId + "&key=" + apiKey
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonReponse = JSON.parse(this.responseText);
            for (itemIndex in jsonReponse.items) {
                var item = jsonReponse.items[itemIndex]
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
                var listItem = listItemTemplate.replace("#TITLE#", title).replace("#BODY#", body).replace("#THUMB#", item.snippet.thumbnails.medium.url).replace("#ID#", item.snippet.resourceId.videoId);
                document.getElementsByName("latestList")[0].innerHTML += listItem
            }
        }
    };
    xmlhttp.open("GET", url);
    xmlhttp.send();
}

function getHistory() {
    if (localStorage.getItem("recents") != null) {
        var recentsList = localStorage.getItem("recents").replaceAll(" ", ",")
        var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + recentsList + "&key=" + apiKey
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonReponse = JSON.parse(this.responseText);
                for (itemIndex in jsonReponse.items) {
                    var item = jsonReponse.items[itemIndex]
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
                    var listItem = listItemTemplate.replace("#TITLE#", title).replace("#BODY#", body).replace("#THUMB#", item.snippet.thumbnails.medium.url).replace("#ID#", item.id);
                    document.getElementsByName("historyList")[0].innerHTML += listItem
                    document.getElementsByName("loader")[0].style = "visibility:hidden"
                }
            }
        };
        xmlhttp.open("GET", url);
        xmlhttp.send();
    } else {
        document.getElementsByName("historyList")[0].innerHTML = emptyRecentsTemplate
        document.getElementsByName("loader")[0].style = "visibility:hidden"
    }
}