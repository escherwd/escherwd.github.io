var apiKey = "AIzaSyBnxe8HZWottEGjOWD5b4FtYig4ZVCTTPA"
var playlistId = "UUM2Q6kuFaksN8HkXtSF21og"



var thumbHeight = 62
if (window.innerWidth > 350) {
    thumbHeight = 62
} else {
    thumbHeight = 42
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function OpenLink(theLink) {
    window.location.href = theLink.href;
}

var listItemTemplate = "<li class='table-view-cell media'><a onclick='loadID(&quot;#ID#&quot;)' class='navigate-right'><img class='media-object pull-left' height=" + thumbHeight + " width=" + ((thumbHeight * 16) / 9) + " src='#THUMB#'><div class='media-body'>#TITLE#<p>#BODY#</p></div></a></li>"

function loadFile(file) {
    document.getElementsByName("loader")[0].style = "visibility:visible"
    window.open(file, "_self");
}

function parseTitle(titleToParse) {
    var title = String(titleToParse)
    if (title.includes("Special") || title.includes("Announcement") || title.includes("Opening Night")) {
        //Special Announcement video
        return [title]
    } else {
        if (title.includes("rgms.news.s")) {
            //Season 4 most likely
            var stuff = title.split(".")[2].toLowerCase()
            var episode = Number(stuff.substring(stuff.lastIndexOf("e") + 1).replace(/\D/g, ''));
            var season = Number(stuff.substring(stuff.lastIndexOf("s") + 1, stuff.lastIndexOf("e")).replace(/\D/g, ''));
            return [("Episode " + episode), ("Season " + season)]
        } else if (title.includes("RGMS News S")) {
            //Season 3/2
            var stuff = title.split(" ")[2].toLowerCase()
            var episode = Number(stuff.substring(stuff.lastIndexOf("e") + 1).replace(/\D/g, ''));
            var season = Number(stuff.substring(stuff.lastIndexOf("s") + 1, stuff.lastIndexOf("e")).replace(/\D/g, ''));
            return [("Episode " + episode), ("Season " + season)]
        } else if (title.includes("RGMS News - S")) {
            //Season 2
            var stuff = title.split(" ")[3].toLowerCase()
            var episode = Number(stuff.substring(stuff.lastIndexOf("e") + 1).replace(/\D/g, ''));
            var season = Number(stuff.substring(stuff.lastIndexOf("s") + 1, stuff.lastIndexOf("e")).replace(/\D/g, ''));
            return [("Episode " + episode), ("Season " + season)]
        } else if (title.includes("RGMS News - ")) {
            //A few season 1 videos
            return [title.replace("RGMS News - ", ""), "Season 1"]
        } else {
            return [title]
        }
    }
}

function parseDate(date) {
    var month = Number(date.split("T")[0].split("-")[1])
    var day = Number(date.split("T")[0].split("-")[2])
    var year = date.split("T")[0].split("-")[0]
    return [month, day, year]
}

var nextPageToken = ""

function loadVideos(pageToken) {
    document.getElementsByName("loader")[0].style = "visibility:visible"
    if (pageToken == "nonext") {
        document.getElementsByName("loadMore")[0].innerText = "No More 😭"
        document.getElementsByName("loader")[0].style = "visibility:hidden"
    } else {
        var xmlhttp = new XMLHttpRequest()
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=" + playlistId + "&key=" + apiKey
        if (pageToken != null && pageToken != "") {
            url += "&pageToken=" + pageToken
        }
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                if (jsonResponse.nextPageToken != null) {
                    nextPageToken = jsonResponse.nextPageToken
                } else {
                    nextPageToken = "nonext"
                }
                for (itemIndex in jsonResponse.items) {
                    var item = jsonResponse.items[itemIndex]
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
                    document.getElementsByName("loadingIndicator")[0].innerText = ""
                    document.getElementsByName("videoList")[0].innerHTML += listItem
                }
                if (location.hash == "#all") {
                    console.log("hash is")
                    location.hash = '#allVids'
                }
                document.getElementsByName("loader")[0].style = "visibility:hidden"
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
}


