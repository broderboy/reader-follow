// ==UserScript==
// @name           Reader Sharing
// @namespace      http://www.timbroder.com
// @description    Bringing Following and Sharing back to Google Reader
// @include        http://www.google.com/reader/view/*
// @include        https://www.google.com/reader/view/*
// @require        http://cdnjs.cloudflare.com/ajax/libs/jquery/1.7/jquery.min.js
// ==/UserScript==

function main() {
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
	    GM_getValue = function (key,def) {
	        return localStorage[key] || def;
	    };
	    
	    GM_setValue = function (key,value) {
	        localStorage[key] = value;
	        return localStorage[key];
	    };
	    
	    GM_deleteValue = function (key) {
	        return delete localStorage[key];
	    };
	}
	
	var Loader = function() {
		if(typeof unsafeWindow !== 'undefined') {
			this.body = unsafeWindow.document.body;
		} else {
			this.body = document.body;
		}
	};
	
	Loader.prototype = {
		addScript: function(url) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			this.body.appendChild(script);
		}
	};
	
	var ReaderSharing = function() {
		var self = this;
		this.key = GM_getValue("greader_key");
		self.post_url = 'http://readersharing.net/post/';
		
		this.buttons_check();
		
		$('#viewer-entries-container').scroll(function() {
			self.add_buttons();
		});
		
		/** may need something for clicking to new feeds but scrolling tends to take care of it
		$('#viewer-container').livequery(function() {
			console.log('live?');
		});**/
		
		//settings

		this.show_modal(false);
		this.loader = new Loader();

	};

	ReaderSharing.prototype = {
		show_modal: function(force) {
			if (this.key === '' || this.key === null || this.key === 'undefined' || force) {
				var key = prompt('Please enter your auth key', this.key);
				if (key !== null && key !== '') {
					this.key = key;
					GM_setValue("greader_key", key);
				}
				
			}
		},
		
		bind_menu: function() {
			var self = this,
				$controls = $('#viewer-top-controls'),
				$button = $('<a href="#">Reader Sharing Settings</a>');
			
			$button.on('click', function(){
				self.show_modal(true);
			});
			$button.appendTo($controls);
		},
		
		buttons_check: function() {
			var self = this;
			setTimeout(function () {
				if($('#entries .entry').length === 0) {
					self.buttons_check();
				}
				else{
					self.bind_menu();
					self.add_buttons();
				}
			}, 100);
		},
		
		add_buttons: function () {
			var self = this;
			$('.entry-actions:not(.reader-shareable)').each(function () {
				self.add_button($(this));
			});
		},
		
		add_button: function($action) {
			var self = this,
				$share_button = $('<span class="item-link link reader-sharing"><span class="link unselectable">Sharing</span></span>');
			$share_button.on('click', function(){
				self.post($(this));
			});
			$share_button.insertAfter($action.find(".star"));
			$share_button.parent().addClass('reader-shareable');
		},
		
		post: function($elm) {
			var self = this,
				$data = $elm.parents('.card').find('.entry-container');
			var $title = $data.find('.entry-title a');
			if (this.key === '' || this.key === null || this.key === 'undefined') {
				this.show_modal(false);
				return;
			}
			var json = {
					'url': $title.attr('href'),	
					'body': $data.find('.entry-body').html(),
					'published_on': $data.find('.entry-date').text(),
					'title': $title.text(),
					'auth': this.key
					//'callback': myFunction
			};
			
			/*GM_xmlhttpRequest({
				url: this.post_url + '?' + $.param(json),// + '?callback=?',
				data : json,
				method: "GET",
				onload: function (responseObject){
					var data = responseObject.responseText;
					var tmpFunc = new Function(data);
					tmpFunc(); 
				},
				onerror: function () {}
			});*/
			var url = this.post_url + '?' + $.param(json);
			this.loader.addScript(url);
		}
	};
	
	var loadr = new Loader();
	if (!(navigator.userAgent.toLowerCase().indexOf('chrome') > -1)) {
		loadr.addScript('http://cdnjs.cloudflare.com/ajax/libs/jquery/1.7/jquery.min.js');
	}
	loadr.addScript('http://readersharing.net/media/js/notty.js');
	
	$(function(){
		new ReaderSharing();
	});
	

}


//needed for chrome
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://cdnjs.cloudflare.com/ajax/libs/jquery/1.7/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


// load jQuery and execute the main function
if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
	addJQuery(main);
}
else if (typeof jQuery !== 'undefined') {
	main();
}


var style = "#nottys{position:fixed;top:20px;right:20px;width:280px;z-index:999}" +
"#nottys .notty{margin-bottom:20px;color:#FFF;text-shadow:#000 0 1px 2px;font:normal 12px/17px Helvetica;border:1px solid rgba(0,0,0,0.7);background:0 transparent), 0 rgba(0,0,0,0.4));-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-box-shadow:rgba(0,0,0,0.8) 0 2px 13px rgba(0,0,0,0.6) 0 -3px 13px rgba(255,255,255,0.5) 0 1px 0 inset;-moz-box-shadow:rgba(0,0,0,0.8) 0 2px 13px rgba(0,0,0,0.6) 0 -3px 13px rgba(255,255,255,0.5) 0 1px 0 inset;box-shadow:rgba(0,0,0,0.8) 0 2px 13px rgba(0,0,0,0.6) 0 -3px 13px rgba(255,255,255,0.5) 0 1px 0 inset;position:relative;cursor:default;-webkit-user-select:none;-moz-user-select:none;overflow:hidden;_overflow:visible;_zoom:1;padding:10px;background:black}" +
".pop{-webkit-animation-duration:.5s;-webkit-animation-iteration-count:1;-webkit-animation-name:pop;-webkit-animation-timing-function:ease-in}" +
".remove{-webkit-animation-iteration-count:1;-webkit-animation-timing-function:ease-in-out;-webkit-animation-duration:.3s;-webkit-animation-name:remove}" +
"#nottys .notty.click{cursor:pointer}" +
"#nottys .notty .hide{position:absolute;font-weight:700;line-height:20px;height:20px;right:0;top:0;background:0;-webkit-border-top-right-radius:6px;-webkit-border-bottom-left-radius:6px;-moz-border-radius-bottomleft:6px;-moz-border-radius-topright:6px;-webkit-box-shadow:rgba(255,255,255,0.5) 0 -1px 0 inset, rgba(255,255,255,0.5) 0 1px 0 inset, #000 0 5px 6px;-moz-box-shadow:rgba(255,255,255,0.5) 0 -1px 0 inset, rgba(255,255,255,0.5) 0 1px 0 inset, #000 0 5px 6px;box-shadow:rgba(255,255,255,0.5) 0 -1px 0 inset, rgba(255,255,255,0.5) 0 1px 0 inset, #000 0 5px 6px;border-left:1px solid rgba(255,255,255,0.5);cursor:pointer;display:none;padding:5px 15px}" +
"#nottys .notty .hide:hover{background:0 #fff);color:#000;text-shadow:none}" +
"#nottys .notty .right,#nottys .notty .left{width:79%;height:100%;float:left}" +
"#nottys .notty .time{font-size:9px;position:relative}" +
"#nottys .notty .right .time{margin-left:19px}" +
"#nottys .notty .left{width:20%}" +
"#nottys .notty .right .inner{padding-left:19px}" +
"#nottys .notty .left .img:after{content:'';background:0 transparent);width:1px;height:50px;position:absolute;right:-10px}" +
"#nottys .notty .left .img{width:100%;background-size:auto 100%;height:50px;border-radius:6px;-webkit-box-shadow:rgba(255,255,255,0.9) 0 1px 0 inset, rgba(0,0,0,0.5) 0 1px 6px;-moz-box-shadow:rgba(255,255,255,0.9) 0 1px 0 inset, rgba(0,0,0,0.5) 0 1px 6px;box-shadow:rgba(255,255,255,0.9) 0 1px 0 inset, rgba(0,0,0,0.5) 0 1px 6px;border:1px solid rgba(0,0,0,0.55);position:relative}" +
"#nottys .notty:after{content:'.';visibility:hidden;display:block;clear:both;height:0;font-size:0}" +
"#nottys .notty h2{font-size:14px;text-shadow:#000 0 2px 4px;color:#fff;margin:0 0 5px}" +
"80%{-webkit-transform:scale(1.05);opacity:1}" +
"to{-webkit-transform:scale(1)}" +
"100%{right:-223px;opacity:0}";
GM_addStyle(style);

/**
@name           Script Update Checker
@namespace      http://www.crappytools.net
@description    Code to add to any Greasemonkey script to let it check for updates.

//NOTES:
//Feel free to copy this into any script you write; that's what it's here for. A credit and/or URL back to here would be appreciated, though.
//I was careful to use as few variables as I could so it would be easy to paste right into an existing script. All the ones you need to set are at the very top.
//The target script needs to be uploaded to userscripts.org. The update checks will -not- increase the install count for the script there.
//This script is set up to check for updates to itself by default. It may be a good idea to leave it like this.
**/

var SUC_script_num = 118173; // Change this to the number given to the script by userscripts.org (check the address bar)
try{function updateCheck(forced){if ((forced) || (parseInt(GM_getValue('SUC_last_update', '0')) + 86400000 <= (new Date().getTime()))){try{GM_xmlhttpRequest({method: 'GET',url: 'http://userscripts.org/scripts/source/'+SUC_script_num+'.meta.js?'+new Date().getTime(),headers: {'Cache-Control': 'no-cache'},onload: function(resp){var local_version, remote_version, rt, script_name;rt=resp.responseText;GM_setValue('SUC_last_update', new Date().getTime()+'');remote_version=parseInt(/@uso:version\s*(.*?)\s*$/m.exec(rt)[1]);local_version=parseInt(GM_getValue('SUC_current_version', '-1'));if(local_version!=-1){script_name = (/@name\s*(.*?)\s*$/m.exec(rt))[1];GM_setValue('SUC_target_script_name', script_name);if (remote_version > local_version){if(confirm('There is an update available for the Greasemonkey script "'+script_name+'."\nWould you like to go to the install page now?')){GM_openInTab('http://userscripts.org/scripts/show/'+SUC_script_num);GM_setValue('SUC_current_version', remote_version);}}else if (forced)alert('No update is available for "'+script_name+'."');}else GM_setValue('SUC_current_version', remote_version+'');}});}catch (err){if (forced)alert('An error occurred while checking for updates:\n'+err);}}}GM_registerMenuCommand(GM_getValue('SUC_target_script_name', '???') + ' - Manual Update Check', function(){updateCheck(true);});updateCheck(false);}catch(err){}





