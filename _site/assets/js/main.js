const sheety_link = "https://api.sheety.co/1c501100-a527-4093-b074-fa9a042d26f9";
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
    $.getJSON(sheety_link, function(data) {
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