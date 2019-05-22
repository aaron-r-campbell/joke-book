var scroll = new SmoothScroll('a[href*="#"]');
// Don't change this
const sheety_link = "https://api.sheety.co/0a81bcbb-d20f-4f5f-83f6-403ffd7e4b59";
// We don't want jokes to repeat (until there aren't any more jokes)
// So what we do is make two arrays - both containing all of the jokes
// As the user reloads, we take out jokes from the first array (items)
// And when all of the jokes are used up, we set items = items_backup
var items;
var items_backup; // will stay untouched while items is being edited
var current_index;
var nsfw;
var swear;
var ist;
var dark;

// Theoritically sets all initial variables to false but more realistically will just break everything (edit: it works!!! somehow...)
if(nsfw === undefined) {nsfw = false}
if(dark === undefined) {dark = false}
if(swear === undefined) {swear = false}
if(ist === undefined) {ist = false}

// This works, the other one didnt, idk...
function toggleSwear() {
	swear = !swear;
}
function toggleDark() {
	dark = !dark;
}
function toggleNsfw() {
	nsfw = !nsfw;
}
function toggleIst() {
	ist = !ist;
}

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

	// I flipped the order because then the things can start as false (I think, idk but now it works)
	if (newItem.dark && !dark || newItem.nsfw && !nsfw || newItem.swear && !swear || newItem.ist && !ist) {
		getNew()
	} else{
		// Update the HTMl with what we have
		$('#joke-title').text(newItem.title);
		$('#joke-text').text(newItem.joke);

		// Show values in console (uncomment for debugging)
		// console.log("CURRENT JOKE")
		// console.log("sheet dark: " + newItem.dark)
		// console.log("sheet ist: " + newItem.ist)
		// console.log("sheet nsfw: " + newItem.nsfw)
		// console.log("sheet swear: " + newItem.swear)
		// console.log("var dark: " + dark)
		// console.log("var ist: " + ist)
		// console.log("var nsfw: " + nsfw)
		// console.log("var swear: " + swear)
		// console.log(" ")
		// console.log(" ")
		// Scroll to the top
		scroll.animateScroll(0);
	}


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
