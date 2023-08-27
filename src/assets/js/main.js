function navto() {
	var navto = $(this).attr('navto');
	if(navto != "#") {
		var $div = $('#' + navto);
		var top = $div.offset().top || 0;
		$('html,body').animate({
			'scroll-top': top - 70
			}, 500);
	} else {
	    $('html,body').animate({
			'scroll-top': 0
		   }, 500);
 
		}
}