	/*!
	 * jQuery Notty
	 * http://www.userdot.net/#!/jquery
	 *
	 * Copyright 2011, UserDot www.userdot.net
	 * Licensed under the GPL Version 3 license.
	 * Version 1.0.0
	 *
	 */
	(function(a){a.notty=function(b){function l(a){var b=[[2,"One second","1 second from now"],[60,"seconds",1],[120,"One minute","1 minute from now"],[3600,"minutes",60],[7200,"One hour","1 hour from now"],[86400,"hours",3600],[172800,"One day","tomorrow"],[604800,"days",86400],[1209600,"One week","next week"],[2419200,"weeks",604800],[4838400,"One month","next month"],[29030400,"months",2419200],[58060800,"One year","next year"],[290304e4,"years",29030400],[580608e4,"One century","next century"],[580608e5,"centuries",290304e4]],c=(new Date-a)/1e3,d="ago",e=1;c<0&&(c=Math.abs(c),d="from now",e=1);var f=0,g;while(g=b[f++])if(c<g[0])return typeof g[2]=="string"?g[e]:Math.floor(c/g[2])+" "+g[1];return a}var c,d,e,f,g,h,i;b=a.extend({title:undefined,content:undefined,timeout:0,img:undefined,showTime:!0,click:undefined},b),c=a("#nottys"),c.length||(c=a("<div>",{id:"nottys"}).appendTo(document.body)),d=a("<div>"),d.addClass("notty pop"),e=a("<div>",{click:function(){a(this).parent().removeClass("pop").addClass("remove").delay(300).queue(function(){a(this).clearQueue(),a(this).remove()})}}),e.addClass("hide"),e.html("Hide notification");if(b.img!=undefined){f=a("<div>",{style:"background: url('"+b.img+"')"}),f.addClass("img"),h=a("<div class='left'>"),g=a("<div class='right'>");if(b.title!=undefined)var j="<h2>"+b.title+"</h2>";else var j="";if(b.content!=undefined)var k=b.content;else var k="";i=a("<div>",{html:j+k}),i.addClass("inner"),i.appendTo(g),f.appendTo(h),h.appendTo(d),g.appendTo(d)}else{if(b.title!=undefined)var j="<h2>"+b.title+"</h2>";else var j="";if(b.content!=undefined)var k=b.content;else var k="";i=j+k,d.html(i)}e.appendTo(d);if(b.showTime!=!1){var m=Number(new Date);timeHTML=a("<div>",{html:"<strong>"+l(m)+"</strong> ago"}),timeHTML.addClass("time").attr("title",m),b.img!=undefined?timeHTML.appendTo(g):timeHTML.appendTo(d),setInterval(function(){a(".time").each(function(){var b=a(this).attr("title");a(this).html("<strong>"+l(b)+"</strong> ago")})},4e3)}d.hover(function(){e.show()},function(){e.hide()}),d.prependTo(c),d.show(),b.timeout&&setTimeout(function(){d.removeClass("pop").addClass("remove").delay(300).queue(function(){a(this).clearQueue(),a(this).remove()})},b.timeout),b.click!=undefined&&(d.addClass("click"),d.click(function(c){var d=a(c.target);d.is(".hide")||b.click.call(this)}));return this}})(jQuery)
