$(function(){
	$('#main').find('.content').css({"min-height":$(window).height()-80});
	//menu
	$('#menuExpand .menuBtn').click(function(){
		$('#menuExpand').hide();
		$('#menuContract').show();
	});
	$('#menuContract .menuBtn').click(function(){
		$('#menuContract').hide();
		$('#menuExpand').show();
	});
});
//plugin
(function($){
	//tzSelect
	$.fn.tzSelect = function(options){
		options = $.extend({
			render : function(option){
				return $('<li>',{
					html : option.text()
				});
			},
			'class' : ''
		},options);
		
		return this.each(function(){
			
			// The "this" points to the current select element:
			
			var select = $(this);
		
			var selectBoxContainer = $('<div>',{
				width		: select.outerWidth()+25,
				'class'	: 'tzSelect',
				html		: '<div class="selectBox"></div>'
			});
		
			var dropDown = $('<ul>',{'class':'dropDown'});
			var selectBox = selectBoxContainer.find('.selectBox');
			
			// Looping though the options of the original select element

			if(options.className){
				dropDown.addClass(options.className);
			}
			
			select.find('option').each(function(i){
				var option = $(this);
				if(i==select[0].selectedIndex){
					selectBox.html(option.text());
				}
				
				// As of jQuery 1.4.3 we can access HTML5 
				// data attributes with the data() method.
				
				if(option.data('skip')){
					return true;
				}
				
				// Creating a dropdown item according to the
				// data-icon and data-html-text HTML5 attributes:
				
				var li = options.render(option);

				li.click(function(){
					
					selectBox.html(option.text());
					if(option.val()=='wenda'){
						$('.search .askQ').show();
					}else{
						$('.search .askQ').hide();
					}
					dropDown.trigger('hide');
					
					// When a click occurs, we are also reflecting
					// the change on the original select element:
					select.val(option.val());
					
					return false;
				});
		
				dropDown.append(li);
			});
			
			selectBoxContainer.append(dropDown.hide());
			select.hide().after(selectBoxContainer);
			
			// Binding custom show and hide events on the dropDown:
			
			dropDown.bind('show',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.addClass('expanded');
				dropDown.slideDown();
				
			}).bind('hide',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.removeClass('expanded');
				dropDown.slideUp();
				
			}).bind('toggle',function(){
				if(selectBox.hasClass('expanded')){
					dropDown.trigger('hide');
				}
				else dropDown.trigger('show');
			});
			
			selectBox.click(function(){
				dropDown.trigger('toggle');
				return false;
			});
		
			// If we click anywhere on the page, while the
			// dropdown is shown, it is going to be hidden:
			
			$(document).click(function(){
				dropDown.trigger('hide');
			});

		});
	};
})(jQuery);
(function() {
	//BrowserDetect
	var BrowserDetect = {
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{ 	string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS : [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				string: navigator.userAgent,
				subString: "iPhone",
				identity: "iPhone/iPod"
		    },
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]
	
	};
	
	BrowserDetect.init();
	
	window.$.client = { os : BrowserDetect.OS, browser : BrowserDetect.browser };
	
})(jQuery);