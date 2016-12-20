// From Underscore.js
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};



// Ya know, I don't need to test if the header is currently on the screen...
// I need to see which of the headers my screen falls immediately after.
// So make a list of each header, mapped to the id field
// then cycle through until we exceed the scroll top. 
// Wait, no... cycle through until we find the first positive piece
// if the positive piece is greater than the window inner height, use the previous id
// otherwise, take that piece's id.
// Don't replace until deciding which one will be correct -- that way we can compare against
// what is already there, and update nothing if it's already good. Not that I'm animating 
// anymore, but maybe I will want to again later.
function updateHeader() {
    var named = $("#whichknauft");
    named.removeClass("rollup");
    var name = named.html();
    $(".whichknauft").each(function () {
            var elemTop = this.getBoundingClientRect().top + parseFloat(window.getComputedStyle(this).paddingTop);
            var elemBottom = this.getBoundingClientRect().bottom;
            if (((0<elemTop) && (elemTop <= window.innerHeight)) || 
                ((0<elemBottom) && (elemBottom <= window.innerHeight)) && this.id !== named.html()) {
                    named.html(this.id === "intro" ? "" : this.id);
                    named.attr("style", "--yoff:" + Math.max(100,elemTop));
                    named.addClass("rollup");
        }
    })
}

$(function () {
    $(window)
        .scroll(debounce(updateHeader, 100))
        .trigger("scroll");
    
    //30 list
    $.getJSON("https://api.github.com/repos/aknauft/30-list/issues?state=all&sort=updated", function (issues) {
        $.each(issues, function (i, issue) {
            $('#30-list')
                .append("("+issue.number+") <a href='"+issue.html_url+"'>"+ issue.title + "</a></br>");
//                .append("created at: " + issue.created_at + "</br>");
//                .append(issue.body + "</br></br></br>");
        });
    });
    var n = Date.now();
    
    // LimSoup
    $.getJSON("https://limsoup.blogspot.com/feeds/posts/default?alt=json-in-script&callback=?", function(posts){
        $.each(posts.feed.entry, function(i, post){
            $('#limsoup')
                .append("("+(n-Date.parse(post.updated.$t))+") <a href='"+post.link[4].href+"'>"+ post.link[4].title + "</a></br>");
        })
    })
    
    // MathToast
    feednami.setPublicApiKey('5e733fccd3b4538a67e4c746df862bdfbcd3fb1e83325997735340a4d39a2334');
    feednami.load('http://mathtoast.tumblr.com/rss')
    .then(feed => {
        $.each(feed.entries, function(i, entry){
            $('#mathtoast').append("("+(n-entry.date_ms)+") <a href='"+entry.link+"'>"+entry.title+"</a><br>");
        });
  });
    
    // Repository
    feednami.load("https://raindrop.io/collection/1944718/feed")
        .then(function(feed){
        $.each(feed.entries, function(i, entry){
            $('#repository').append("<dd>("+(n-entry.date_ms)+") <a href='"+entry.link+"'>"+entry.title+"</a></dd>");
        });
    });    
});