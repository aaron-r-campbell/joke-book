var scroll = new SmoothScroll('a[href*="#"]');
// Don't change this
const sheety_link = "https://api.sheety.co/1c501100-a527-4093-b074-fa9a042d26f9";
// We don't want jokes to repeat (until there aren't any more jokes)
// So what we do is make two arrays - both containing all of the jokes
// As the user reloads, we take out jokes from the first array (items)
// And when all of the jokes are used up, we set items = items_backup
var items;
var items_backup; // will stay untouched while items is being edited
var current_index;

function getNew() {
	// If we've run out of jokes
	if (items.length == 0) {
		// Copy items_backup to items using slice()
		items = items_backup.slice()
	}
	// Get a random index for a joke
	var new_index = Math.floor(Math.random() * items.length);
	// Get the joke from the items array
	var newItem = items[new_index];
	// Update the HTMl with what we have
	$('#joke-title').text(newItem.title);
	$('#joke-text').text(newItem.joke);
	// Scroll to the top
	scroll.animateScroll(0);
	// Remove the joke we just got
	items.splice(new_index, 1); // 1 is the number of elements to remove
}

jQuery(window).on("load", function(){
	// Pulls from sheety
    $.getJSON(sheety_link, function(data) {
		items = data.slice();
		items_backup = data.slice();
		getNew()
		// Show the stuff which is initially hidden
		$('.initially-hidden').css({
	        opacity: 1,
	    })
	})
});

// Get a new joke when they click the reload button
$('#reload').on("click",function(){
	getNew()
})

$("body").keydown(function(e) {
	// Get a new joke anytime a key is pressed
	getNew()
	// 32 is spacebar. We don't want the page to scroll down when pressing the spaceba
	if (e.which == 32) {
	    return false;
	}
});