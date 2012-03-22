/**
 * jScroll jQuery Plugin v1.1
 * http://jscroll.com/
 * 
 * Copyright 2011, Philip Klauzinski
 * http://klauzinski.com/
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * http://jscroll.com/#license
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 * 
 * @author Philip Klauzinski
 * @requires jQuery v1.4.3+
 */
(function(b){b.jscroll={defaults:{debug:false,autoTrigger:true,loadingHtml:"<small>Loading...</small>",padding:0,nextSelector:"a:last",contentSelector:""}};var a=function(c,m){var d=c.data("jscroll"),h=(typeof m==="function")?{callback:m}:m;_options=b.extend({},b.jscroll.defaults,h,d||{}),_$next=c.find(_options.nextSelector).first();c.data("jscroll",b.extend({},d,{initialized:true,waiting:false,nextHref:_$next.attr("href")}));c.contents().wrapAll('<div class="jscroll-inner" />');l();if(_options.autoTrigger){g(_$next);c.bind("scroll.jscroll",function(){return f()})}else{_$next.bind("click.jscroll",function(){g(_$next);i();return false})}function l(){var o=b(_options.loadingHtml).filter("img").attr("src");if(o){var n=new Image();n.src=o}}function g(n){var o=n.parent().not(".jscroll-inner").addClass("jscroll-next-parent").hide();if(!o.length){n.wrap('<div class="jscroll-next-parent" />').parent().hide()}}function j(){return c.unbind(".jscroll").removeData("jscroll").find(".jscroll-inner").children().unwrap().filter(".jscroll-added").children().unwrap()}function f(){var r=c.find("div.jscroll-inner").first(),q=c.data("jscroll"),o=parseInt(c.css("paddingTop"))+parseInt(c.css("borderTopWidth")),n=Math.ceil(c.offset().top-r.offset().top+c.height()+o),p=b.trim(q.nextHref+" "+_options.contentSelector);if(k(q)&&!q.waiting&&n+_options.padding>=r.outerHeight()){e("info","jScroll:",r.outerHeight()-n,"from bottom. Loading next request...");return i()}}function k(n){n=n||c.data("jscroll");if(!n.nextHref){e("warn","jScroll: nextSelector not found - destroying");c.jscroll.destroy();return false}else{return true}}function i(){var o=c.find("div.jscroll-inner").first(),n=c.data("jscroll");n.waiting=true;o.append('<div class="jscroll-added" />').children(".jscroll-added").last().html('<div class="jscroll-loading">'+_options.loadingHtml+"</div>");return k(n)&&c.animate({scrollTop:o.outerHeight()},0,function(){o.find("div.jscroll-added").last().load(n.nextHref,function(s,q,t){var p=b(this).find(_options.nextSelector).first();n.waiting=false;n.nextHref=p.attr("href");b(".jscroll-next-parent",c).remove();if(_options.autoTrigger){g(p)}else{p.bind("click.jscroll",function(){g(p);f();return false})}e("dir",n)})})}function e(n){if(_options.debug&&typeof console==="object"&&(typeof n==="object"||typeof console[n]==="function")){if(typeof n==="object"){var p=[];for(var o in n){if(typeof console[o]==="function"){p=(n[o].length)?n[o]:[n[o]];console[o].apply(console,p)}else{console.log.apply(console,p)}}}else{console[n].apply(console,Array.prototype.slice.call(arguments,1))}}}b.extend(c.jscroll,{destroy:j});return c};b.fn.jscroll=function(c){return this.each(function(){var f=b(this),e=f.data("jscroll");if(e&&e.initialized){return}var d=new a(f,c)})}})(jQuery);