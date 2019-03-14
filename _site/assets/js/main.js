var jokes;
var scroll = new SmoothScroll('a[href*="#"]');

function getRandomJoke(joke) {
	console.log('new joke')
	var joke = jokes[Math.floor(Math.random() * jokes.length)];
	$('#joke-title').text(joke.title);
	$('#joke-text').text(joke.joke);
	scroll.animateScroll(0);
}

jQuery(window).on("load", function(){
    $.getJSON('https://api.sheety.co/ea92d66f-0056-4607-88b1-33fdd65f4e0d', function(data) {
		jokes = data;
		getRandomJoke()
		$('.initially-hidden').css({
	        opacity: 1,
	    })
	})
});

$('#new-joke').on("click",function(){
	getRandomJoke()
})