var apiKey = "AIzaSyBnxe8HZWottEGjOWD5b4FtYig4ZVCTTPA"
var channelId = "UCM2Q6kuFaksN8HkXtSF21og"

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var vidId = getParameterByName("id")

function loadVid() {
    var iframeTemplate = "<iframe name='youtubeFrame' src='https://www.youtube.com/embed/#ID#?autoplay=1&playsinline=1&rel=0&amp&;showinfo=0' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>"
    if (vidId != null) {
        youtubeFrame = iframeTemplate.replace("#ID#", vidId)
        document.getElementsByName("top")[0].innerHTML = youtubeFrame
        resize()
        //Get video info
        var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=" + vidId + "&key=" + apiKey
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                var nameAndSeason = parseTitle(jsonResponse.items[0].snippet.title)
                document.getElementsByName("title")[0].innerText = nameAndSeason[0]
                if (nameAndSeason.length > 1) {
                    document.getElementsByName("season")[0].innerText = nameAndSeason[1]
                } else {
                    document.getElementsByName("season")[0].innerText = ""
                }
                var item = jsonResponse.items[0]
                var month = Number(item.snippet.publishedAt.split("T")[0].split("-")[1])
                var day = Number(item.snippet.publishedAt.split("T")[0].split("-")[2])
                var year = item.snippet.publishedAt.split("T")[0].split("-")[0]
                var views = item.statistics.viewCount
                document.getElementsByName("stats")[0].innerHTML = "Upload Date: " + month + "/" + day + "/" + year + " • Views: " + views
                document.getElementsByName("OpenYoutube")[0].href = "https://youtu.be/" + vidId;
                updateRecents(vidId)
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    }
    loadRelatedVids()
}

function updateRecents(withId) {
    if (localStorage.getItem("recents") != null) {
        if (localStorage.getItem("recents").includes(withId) != true) {
            var recents = localStorage.getItem("recents").split(" ")
            var strToSet = ""
            if (recents.length >= 5) {
                strToSet = withId + " " + recents[0] + " " + recents[1] + " " + recents[2] + " " + recents[4]
            } else if (recents.length <= 0) {
                strToSet = withId
            } else {
                strToSet = withId + " " + localStorage.getItem("recents")
            }
            localStorage.setItem("recents", strToSet)
        }
    } else {
        localStorage.setItem("recents", withId)
    }
}


function loadRelatedVids() {
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=" + vidId + "&type=video&channelId=" + channelId + "&key=" + apiKey
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
                    document.getElementsByName("relatedList")[0].innerHTML += listItem
                }
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
