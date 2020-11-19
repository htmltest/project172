/*
*
* STARTUP
*
*/

$(document).ready(function() {

	// binds
	$(window).bind('hashchange', function () { articleFilter();	});
	
	// toggle navigation
	$("#header .nav").on('click', toggleNavigation);

	// resize search field by user input
	setTimeout(function() {
		resizableSearch(document.getElementById('search-input'));
	}, 10);
	
	// play/stop video when scroll it in/out viewport
	window.addEventListener('scroll', autoPlayVideo, false);
	window.addEventListener('resize', autoPlayVideo, false);
	
	// make header transparent on scroll
//	window.addEventListener('scroll', transparentHeader, false);
//	window.addEventListener('resize', transparentHeader, false);

	// lazy loading
	window.addEventListener('scroll', loadmoreTrigger, false);
	window.addEventListener('resize', loadmoreTrigger, false);
	
    // ESCAPE key pressed
	$(document).keydown(function(e) {
		if (e.keyCode == 27) {
			closeGallery();
    	}
	});

	// scroll menu and show it
	scrollMenu();
	
	// filter articles
	articleFilter();
	
	// resize Facebook iFrames
	$(".recent-facebook-posts iframe").height($(".recent-facebook-posts iframe").width() * 0.635);
	window.addEventListener("resize", function() { $(".recent-facebook-posts iframe").height($(".recent-facebook-posts iframe").width() * 0.635) }, false);
	
	// replace content for IE
	replaceIE();
});

function scrollMenu() {
	var menu = $('.menu');
	
	// get scroll from hash
	var scroll =  window.location.search.substring(1).split('menu_scroll=')[1];
	// or calculate it based on selected tag
	if (scroll === undefined) {
		var elem = $('.secondarymenu .selected');
		if (elem.length > 0) {
			var viewport_height = menu.outerHeight();
			var elem_offset = elem.offset().top + elem.height() / 2 - menu.offset().top;
			var offset = viewport_height / 2 - elem_offset;
			scroll = menu.scrollTop() - offset;
		}
	}
	
	// scroll menu
	if (scroll !== undefined)
		menu.scrollTop(scroll);
	
	// show menu
	menu.css('visibility', 'visible');
}

/*
*
* TOGGLING
*
*/

function toggleNavigation() {
	// scroll to top first
	$(window).scrollTop(0);
	// toggle submenu and tag
	$('#sidebar .submenu, #close').slideToggle(500);
	// toggle menu
	if ($('.body_container').hasClass('sidebar-popup'))
		$('#sidebar .mainmenu, #sidebar .secondarymenu').slideUp(500);		
	else
		$($('#glossary .container').hasClass('off') ? '#sidebar .mainmenu' : '#sidebar .secondarymenu').slideDown(500);
	// change header
	$('.body_container').toggleClass('sidebar-popup');				
	
	// to stopPropagation and preventDefault
	return false;
}

function toggleGlossary(isLeft) {
	// stop if previous action is not finished yet
	if ($('#glossary :animated').length > 0)
		return;
	
	// animation speed
	var SPEED = 250;

	var MARGIN_SHIFT = 20;
	var BUTTON_SHIFT = 5;
	
	var isOn = $('#glossary .container').hasClass('on');
	var isOff = $('#glossary .container').hasClass('off');
	
	var toggleOff = !isOff && (isLeft || isLeft === null);
	var toggleOn = !isOn && (!isLeft || isLeft === null);

	// switch to MAIN menu
	if (toggleOff) {
		// text
		$('#glossary .left').addClass('active');
		$('#glossary .right').removeClass('active');
		// sidebar
		var margin = $('#sidebar .secondarymenu li').css('margin-left');
		var margin_val = parseInt(margin, 10);
		$('#sidebar .secondarymenu li').stop(true, true).map(function () { 
			$(this).animate({
				opacity: 0,
				marginLeft: margin_val - MARGIN_SHIFT
			}, SPEED, function() {
				$('.menu').scrollTop(0);
				$('#sidebar .secondarymenu').css('display', 'none'); 
				$('#sidebar .mainmenu li, #sidebar .addonmenu').css('opacity', '0');
				$('#sidebar .mainmenu li, #sidebar .addonmenu').css('margin-left', margin_val - MARGIN_SHIFT);
				$('#sidebar .mainmenu, #sidebar .addonmenu').css('display', 'block');
				$('#sidebar .mainmenu li, #sidebar .addonmenu').animate({
					opacity: 1,
					marginLeft: margin
				}, SPEED, function() {
					$('#glossary .container').addClass('off');
					$('#glossary .container').removeClass('on');					
				});
			});
		});
		// button
		$('#glossary .switch').stop(true, true).animate({
			right: 17 + BUTTON_SHIFT
		}, SPEED, function() {
			$('#glossary .switch').stop(true, true).animate({
				right: 17
			}, SPEED);
		});
	}
	// switch to GLOSSARY menu
	else if (toggleOn) {
		// text
		$('#glossary .right').addClass('active');
		$('#glossary .left').removeClass('active');
		// sidebar
		var margin = $('#sidebar .mainmenu li').css('margin-left');
		var margin_val = parseInt(margin, 10);
		$('#sidebar .mainmenu li, #sidebar .addonmenu').stop(true, true).animate({
			opacity: 0,
			marginLeft: margin_val + MARGIN_SHIFT
		}, SPEED, function() {
			$('.menu').scrollTop(0);
			$('#sidebar .mainmenu, #sidebar .addonmenu').css('display', 'none'); 
			$('#sidebar .secondarymenu li').css('opacity', '0');
			$('#sidebar .secondarymenu li').css('margin-left', margin_val + MARGIN_SHIFT);
			$('#sidebar .secondarymenu').css('display', 'block');
			$('#sidebar .secondarymenu li').map(function () {
				$(this).animate({
					opacity: 1,
					marginLeft: margin
				}, SPEED, function() {
					$('#glossary .container').addClass('on');
					$('#glossary .container').removeClass('off');					
				});
			});
		});
		// button
		$('#glossary .switch').stop(true, true).animate({
			right: 7 - BUTTON_SHIFT
		}, SPEED, function() {
			$('#glossary .switch').stop(true, true).animate({
				right: 7
			}, SPEED);
		});
	} else {
		$('.menu').animate({ scrollTop: 0 }, SPEED);
	}

	// to stopPropagation and preventDefault
	return false;
}

function toggleTag(elem) {
	// stop if the same tag
	if ( $('.secondarymenu .selected a')[0] === elem)
		return false;

	// animation speed
	var SPEED = 250;
	
	// de-focus the OLD tag
	var prev  = $('.secondarymenu .selected a');
	// li
	prev.parent().css('overflow', 'hidden');
	prev.parent().removeClass('selected');
	// a
	prev.css('position', 'relative');
	prev.animate({ left: -7 }, SPEED);

	// focus the NEW tag
	var next = $(elem);
	// li
	next.parent().css('overflow', 'hidden');
	next.parent().addClass('selected');
	// a
	next.html('#' + next.html());
	next.css('position', 'relative');
	next.css('left', -7);
	next.animate({ left: 0 }, SPEED);
	
	// scroll NEW tag into the middle of viewport
	var menu = $('.menu');
	var viewport_height = menu.outerHeight();
	var elem_offset = next.offset().top + next.height() / 2 - menu.offset().top;
	var offset = viewport_height / 2 - elem_offset;
	menu.animate({ scrollTop: menu.scrollTop() - offset }, SPEED);

	// go to new page
	setTimeout(function() { 
		window.location.href = next.attr('href') + '?menu_scroll=' + menu.scrollTop();
	}, SPEED + 100);
	
	// to stopPropagation and preventDefault
	return false;
}

function toggleSubmenu(elem) {
	$('.selected').unbind('click');
	$('.selected').removeClass('selected');
	if (elem === null) {
		$('.submenu .item.tag').addClass('selected');
		// collapse for Mobile
		if (isMedia())
			$('.submenu .item.level2').slideDown(500);
	} else {
		$(elem).addClass('selected');
		// collapse for Mobile
		if (isMedia()) {
			$('.submenu .item.level2.selected').slideDown(500);
			$('.submenu .item.level2.selected').click(function() { $('.submenu .item.level2:not(.selected)').slideToggle(500); } );
			$('.submenu .item.level2:not(.selected)').slideUp(500);
		}
	}
}

/*
*
* ARTICLES
*
*/

function articleLayout() {
	// apply submenu filter
	var articles = $('#content article:not(.view)');
	articles.each(function( index ) {
		var tags = $(this).find('.tags a');
		var found = filter.tag_name === undefined;
		if (!found)
			tags.each(function( ind ) {
				if (filter.tag_name == $(this).text()) {
					found = true;
					return false;
				}
			});
		$(this).addClass(found ? 'show' : 'hide');
		$(this).removeClass(found ? 'hide' : 'show');
	});
	
	// position articles
	articles = $('#content article:not(.hide)');
	var mediumHeight = 0;
	var smallHeight = 0;
	articles.each(function( index ) {
		var article_last = (index == (articles.length - 1)) && ($('.loadmore-content').size() == 0); 
		// skip VIEW article (add SEPARATOR if there are something else) 
		if ($(this).hasClass('view')) {
			if (!article_last)
				$(this).addClass('separator');
			else
				$(this).removeClass('separator');
		} 
		// set first article as BIG (add SEPARATOR if there are something else)  
		else if (index == 0) {
			$(this).addClass('big');
			$(this).removeClass('small medium');
			if (!article_last)
				$(this).addClass('separator');
			else 
				$(this).removeClass('separator');
		}
		// set second article as BIG if there are only two articles
		else if (index == 1 && article_last) {
			$(this).addClass('big');
			$(this).removeClass('small medium');
		}
		// common algorithm to build-in article in articles feed
		else {
			// if this article is last then put it in lowest column
			if (article_last) {
				$(this).addClass(mediumHeight > smallHeight ? 'small' : 'medium');
				$(this).removeClass(mediumHeight > smallHeight ? 'medium big' : 'small big');
			}
			// otherwise try to put article in MEDIUM column first
			else {
				$(this).addClass('medium');
				$(this).removeClass('small big');
				mediumHeight += $(this).outerHeight(true); 
				// and after that if MEDIUM > SMALL then move article into SMALL column
				if (mediumHeight > smallHeight) {
					mediumHeight -= $(this).outerHeight(true); 
					$(this).addClass('small');
					$(this).removeClass('medium big');
					smallHeight += $(this).outerHeight(true); 
				}
			}
		}
		// and show article
		$(this).removeClass('invisible');
	});
}

function articleFilter() {
	// try to find elem to select in submenu
	var elem;
	// category page
	if ($('#sidebar .container').hasClass('category')) {
		var tag = decodeURI(window.location.hash.substring(1));
		if (tag === '')
			elem = null; // tag submenu item
		else {
			var tag = decodeURI(window.location.hash.substring(1));
			var items = $('.submenu .item.level2');
			items.each(function(index) {
				if ($(this).text() === tag) {
					elem = this; // hash tag found
					return false;
				} 
			});
		}
	} 
	// internal page
	else if ($('#sidebar .container').hasClass('internal')) {
		elem = $('.submenu .item.level2.selected')[0];
	}

	// scroll to top first
	if (elem !== undefined)
		$(window).scrollTop(0);
	
	// set tag name filter
	if (elem !== undefined)
		filter.tag_name = elem === null ? undefined : $(elem).text();

	// animate menu
	if (elem !== undefined)
		toggleSubmenu(elem);

	// position articles (show/hide them, change BIG/MEDIUM/SMALL)
	articleLayout();

	// try lazy loading
	loadmoreTrigger();
}

/*
*
* LAZY LOADING
*
*/

function loadmoreTrigger() {
	var viewportBottom = $(window).scrollTop() + $(window).height();
	
	// load more content articles if need
	var loadmoreContent = $(".loadmore-content");
	if (loadmoreContent[0]) {
		var containerBottom = loadmoreContent.offset().top;  
		if (containerBottom - viewportBottom < 500) {
			loadmoreContent.remove();
			loadmoreRequest('loadmore-content');
		}
	}

	// load more sidebar articles if need
	var loadmoreSidebar = $(".loadmore-sidebar");
	if (loadmoreSidebar[0]) {
		var containerBottom = loadmoreSidebar.offset().top;  
		if (containerBottom - viewportBottom < 500) {
			loadmoreSidebar.remove();
			loadmoreRequest('loadmore-sidebar');
		}
	}
}

function loadmoreRequest(loadmoreClass) {
	// AJAX request to load more 
	var articles = [];
	$('article').each(function() { articles.push($(this).attr('id').replace('article_', '')); });
	$.ajax({
		url: ajaxurl,
		data: { 
			'action' : 'loadmore', 
			'articles' : articles.join(),
			'cat_id' : filter.cat_id, 
			'tag_id' : filter.tag_id,
			'class' : loadmoreClass
		},
		type: 'POST',
		success: function(data) {
			// add articles
			if (data) {
				if (loadmoreClass == 'loadmore-content')
					$('main .container').append(data);
				if (loadmoreClass == 'loadmore-sidebar')
					$('aside .addonmenu').append(data);
			}
		}
	});
}

/*
*
* TOOLS
*
*/

/*
function transparentHeader() {
	// make transparent only when @media is applied and popup menu not shown
	if (!isMedia())
		return;
	
	var opacity = (250 - 0.7 * $(window).scrollTop()) / 250; 
	$('#header, #header_bg').css("opacity", opacity);
	$('#header, #header_bg').css("display", opacity > 0 ? "block" : "none");
}
*/

function resizableSearch(elem) {
	  function resize() {
		  var span = document.getElementById('search-span');
		  span.innerHTML = elem.value;
		  elem.style.width = ($("#search-span").width() + 14) + 'px';
	  }
	  var e = 'keyup,keypress,focus,blur,change'.split(',');
	  for (var i in e)
		  elem.addEventListener(e[i], resize, false);
	  resize();
}

function autoPlayVideo(stop) {
	// restrict video autoplay on mobile devices
	if (isMobile())
		return;
	
	var viewport_top = $(window).scrollTop() + $('#header .container').height();
	var viewport_bottom = viewport_top + $(window).height();
	var viewport_center = (viewport_top + viewport_bottom) / 2;
  
  var video_to_play = null;
  var dist = null;
  $('video').each(function( ) {
	    var bounds = $(this).offset();
	    var video_center = bounds.top + $(this).outerHeight() / 2;
	    if (video_center >= viewport_top && video_center <= viewport_bottom) {
	    	var new_dist = Math.abs(viewport_center - video_center);
	    	if (video_to_play === null || new_dist < dist) {
	    		video_to_play = this;
	    		dist = new_dist;
	    	}
	    }
  });
  
  $('video').each(function( ) {
	    if (this === video_to_play)
      	this.play();
      else
      	this.pause();
   });
}

function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isMedia() {
	return $('#header .logo .small').css('visibility') == 'visible' && $('#header .logo .small').css('display') == 'block';
}

function replaceIE() {
	// if IE detected then replace content
	var ua = window.navigator.userAgent;
	if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) {
		$("body > *").hide();
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		$(".ie-message span").css("lineHeight", h + "px");
		$(".ie-message").show();
	}
}
