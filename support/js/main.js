window.addEventListener("hashchange", setPage, false);


if (window.location.hash == "") {
    window.location.hash = "#home"
}

function setPage() {
    let htmlCollection = document.getElementsByTagName("content");
    var arr = [].slice.call(htmlCollection); 
    arr.forEach((content) => {
        if (content.id == window.location.hash.replace("#","")) {
            $("#"+content.id).show();
        } else {
            $("#"+content.id).hide();
        }
    })
}