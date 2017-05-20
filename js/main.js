// From Underscore.js:
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



function updateHeader() {
    var named = $("#whichknauft");
    var name = named.html();
    
    $(".whichknauft").each(function () {
            var elemTop = this.getBoundingClientRect().top + parseFloat(window.getComputedStyle(this).paddingTop);
            var elemBottom = this.getBoundingClientRect().bottom;
            if (((0<elemTop) && (elemTop <= window.innerHeight)) || 
                ((0<elemBottom) && (elemTop <= window.innerHeight)) && this.id !== named.html()) {
                    named.html(this.id === "intro" ? "ndrew" : "&nbsp;"+this.id);
                    named.attr("style", "--yoff:" + Math.max(100,elemTop));
                    
                    //history.pushState({},"A "+this.id+" Knauft","#"+this.id); // Useful when not scrolling, but could be annoying.
        }
    });
}

$(function () {
    $(window)
        .scroll(debounce(updateHeader, 100))
        .trigger("scroll");
    
    //30 list
    $.getJSON("https://api.github.com/repos/aknauft/30-list/issues?state=open&sort=updated", function (issues) {
        $.each(issues, function (i, issue) {
            $('#30-list')
                .append("<dd>("+issue.number+") <a href='"+issue.html_url+"'>"+ issue.title + "</a></dd>");
//                .append("created at: " + issue.created_at + "</br>");
//                .append(issue.body + "</br></br></br>");
        });
    });
    
    // LimSoup, following the blogger api
    $.getJSON("https://www.googleapis.com/blogger/v3/blogs/1347215485435204892/posts?key=AIzaSyBO--k--KWPFryloQTSD_lmqUBi3RUBpew&callback=?", function(posts){
        $.each(posts.items, function(i, post){
            if(i < 5){ // Only pull in the five most recent
                var d = new Date(post.published);
                $('#limsoup') // At some point, get a nicer date format.
                    .append("<dd><a href='"+post.url+"'>"+d.toDateString()+"</a> "+ post.title + "</dd>");
            }
        });
    });
    
    // Smooth Scroll, from https://css-tricks.com/snippets/jquery/smooth-scrolling/
    // Hey, Andrew, come back to this and build it yourself! You don't need most of the logic here.
    $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
