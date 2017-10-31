// Sticky v1.0 by Daniel Raftery
// http://thrivingkings.com/sticky
//
// http://twitter.com/ThrivingKings

(function( $ )
	{
	
	// Using it without an object
	$.stickynew = function(note, options, callback) { return $.fn.stickynew(note, options, callback); };
	
	$.fn.stickynew = function(note, options, callback) 
		{
		// Default settings
		var position = 'bottom-right'; // top-left, top-right, bottom-left, or bottom-right
		
		var settings =
			{
			'speed'			:	'200',	 // animations: fast, slow, or integer
			'duplicates'	:	true,  // true or false
			'autoclose'		:	20000,  // integer or false
			'position'      :   'bottom-right'
			};
		
		// Passing in the object instead of specifying a note
		if(!note)
			{ note = this.html(); }
		
		if(options)
			{ $.extend(settings, options); }
		position = settings.position;
		// Variables
		var display = true;
		var duplicate = 'no';
		
		// Somewhat of a unique ID
		var uniqID = Math.floor(Math.random()*99999);
		
		// Handling duplicate notes and IDs
		$('.sticky-note').each(function()
			{
			if($(this).html() == note && $(this).is(':visible'))
				{ 
				duplicate = 'yes';
				if(!settings['duplicates'])
					{ display = false; }
				}
			if($(this).attr('id')==uniqID)
				{ uniqID = Math.floor(Math.random()*9999999); }
			});
		
		// Make sure the sticky queue exists
		if(!$('body').find('.sticky-queue').html()){ 
			$('body').append('<div class="sticky-queue sticky-' + position + '"></div>');
		}
		
		// Can it be displayed?
		if(display)
			{
			// Building and inserting sticky note
			$('.sticky-queue').prepend('<div class="sticky sticky-border-' + position + '" id="' + uniqID + '"></div>');
			$('#' + uniqID).append('<img src="images/close.png" class="sticky-close" rel="' + uniqID + '" title="Close" />');
			$('#' + uniqID).append('<div class="sticky-note" rel="' + uniqID + '">' + note + '</div>');
			
			// Smoother animation
			//
			$('#' + uniqID).css('visibility', "hidden");
			$("#" + uniqID).show();
			var height = $('#' + uniqID).height();
			$('#' + uniqID).height(height);
			$('#' + uniqID).css('visibility', "");
			$("#" + uniqID).hide();
			$('#' + uniqID).slideDown(100);
			$('#' + uniqID).mouseenter(function(){
				window.clearTimeout($(this).data("hideTimeout"));
			});
			$('#' + uniqID).mouseleave(function(){
				autoClose();
			});
			display = true;
			}
		
		// Listeners
		$('.sticky').ready(function()
			{
			// If 'autoclose' is enabled, set a timer to close the sticky
			if(settings['autoclose'])
				{ autoClose(); }
			});
		function autoClose(){
			var _timeout = $('#' + uniqID).data("hideTimeout");
			if(_timeout){
				window.clearTimeout(_timeout);
			}
			var timeout = setTimeout(function(){
				$('#' + uniqID).slideUp(settings['speed']);
				$('#' + uniqID).removeData("hideTimeout");
			},settings['autoclose']);
			$('#' + uniqID).data("hideTimeout",timeout);
		}
		// Closing a sticky
		$('.sticky-close').click(function()
			{ $('#' + $(this).attr('rel')).dequeue().slideUp(settings['speed']); });
		
		
		// Callback data
		var response = 
			{
			'id'		:	uniqID,
			'duplicate'	:	duplicate,
			'displayed'	: 	display,
			'position'	:	position
			}
		
		// Callback function?
		if(callback)
			{ callback(response); }
		else
			{ return(response); }
		
		}
	})( jQuery );