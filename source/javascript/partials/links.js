$(function() {
	let $links = $("a.smooth");
		
	$links.click(function () {
		let elementClick = $(this).attr("href");
		let destination = $(elementClick).offset().top - (48 + 34);
		$('html,body').stop().animate(	{ scrollTop: destination }, 1000 );
		return false;
	});
})

