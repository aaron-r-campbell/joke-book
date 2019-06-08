var scroll = new SmoothScroll('a[href*="#"]');
// Don't change this (joke list API)
const sheety_link = "https://api.sheety.co/0a81bcbb-d20f-4f5f-83f6-403ffd7e4b59";

// ------ How it all works ------
// We don't want jokes to repeat (until there aren't any more jokes)
// So what we do is make two arrays - both containing all of the jokes
// As the user reloads, we take out jokes from the first array (items)
// And when all of the jokes are used up, we set items = items_backup

// ------ Variables ------
var items; // List of all jokes that gets smaller to avoid repeats
var items_backup; // Will stay untouched while items is being edited
var items_completed = []; // List of joke viewing history (no cookies so session dependant)
var items_completed_temp = []; // Prevents history from containing current joke
var nsfw = false; // NSFW jokes disabled by default
var swear = false; // Jokes with language disabled by default
var stereotype = false; // Jokes that use stereotypes disabled by default
var dark = false; // Dark jokes disabled by default
var long = true; // Long jokes disabled by default

// ------ Functions ------
// To toggle joke selector variables
function toggleSwear() {
	swear = !swear;
}
function toggleDark() {
	dark = !dark;
}
function toggleNsfw() {
	nsfw = !nsfw;
}
function toggleStereotype() {
	stereotype = !stereotype;
}
function toggleLong() {
	long = !long;
}

// Function for the back button
function goBack() {
	// Sets oldItem to the last joke viewed and removes it from the list of completed jokes
	var oldItem = items_completed.pop();
	// Updates page text to last joke
	$('#joke-title').text(oldItem.title);
	$('#joke-text').text(oldItem.joke);
	// Scrolls to the top of the page
	scroll.animateScroll(0);

	// Hides back button if completed jokes list is empty
	if (items_completed.length == 0 || items_completed[0] == oldItem) {
			Back.style.display = "none";
			ButtonSpacer.style.display = "none";
} else {
			Back.style.display = "block";
			ButtonSpacer.style.display = "block";
}
}

// Function to display options menu
function gear() {
		Options.style.display = "block";
		$("#Overlay").fadeTo(400,0.5);
}

// Gets a random joke
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
	// Remove the joke we just got (since we have newItem now)
	items.splice(new_index, 1); // 1 is the number of elements to remove


	// I flipped the order because then the things can start as false (I think, idk but now it works)
	if (newItem.dark && !dark || newItem.nsfw && !nsfw || newItem.swear && !swear || newItem.stereotype && !stereotype || newItem.long && !long) {
		getNew()
	} else {
		// Update the HTMl with what we have
		$('#joke-title').text(newItem.title);
		$('#joke-text').text(newItem.joke);
		// Adds current joke to temp list (dealt with later in saveCurrent())
		items_completed_temp.push(newItem);

		// Show values in console (uncomment for debugging) (keep bottom blank logs so you can tell when new joke starts easily)
		// console.log("sheet dark: " + newItem.dark)
		// console.log("sheet stereotype: " + newItem.stereotype)
		// console.log("sheet nsfw: " + newItem.nsfw)
		// console.log("sheet swear: " + newItem.swear)
		// console.log("var dark: " + dark)
		// console.log("var stereotype: " + stereotype)
		// console.log("var nsfw: " + nsfw)
		// console.log("var swear: " + swear)
		// console.log(" ")

		// Scroll to the top
		scroll.animateScroll(0);
	}
}

// Gets the joke specified by number after url (eg: https://joke-book.netlify.com/52 will return 52nd joke)
function getSpecific() {
	var appendText = sessionStorage.getItem("appendText");
	var newItem = items[appendText - 1];
	// Remove the joke we just got (since we have newItem now)
	items.splice(appendText, 1); // 1 is the number of elements to remove
	$('#joke-title').text(newItem.title);
	$('#joke-text').text(newItem.joke);
	// Adds current joke to temp list (dealt with later in saveCurrent())
	items_completed_temp.push(newItem);
	scroll.animateScroll(0);
	appendText = [];
}

// Hides options window (and permalink window)
function options() {
	Options.style.display = "none";
	$("#Overlay").fadeTo(400,0);
	PermalinkWindow.style.display = "none";
	setTimeout(function(){Overlay.style.display = "none";},400)
}

// Shows permalink window
function permalink() {
	var currentJoke = items_completed_temp[0];
	var jokeTitle = currentJoke.title
	var index = items_backup.map(function(items_backup) { return items_backup.title; }).indexOf(jokeTitle);
	$('#Link').text("http://joke-book.com/" + index);
	$('#Link').attr('href',"http://joke-book.com/" + index);
	PermalinkWindow.style.display = "block";
	Overlay.style.display = "block";
}

// Saves the current joke (used to help build joke history variable)
function saveCurrent() {
	// Get the (hopefully only) item from the temp list and sets it as the value of currentItem
	var currentItem = items_completed_temp[0];
	// Clears the temp list
	items_completed_temp = [];
	// Adds currentItem to the completed jokes list (keeps track of joke history)
	items_completed.push(currentItem);
	// Hides joke button if completed jokes list is empty
	if (items_completed.length == 0) {
			Back.style.display = "none";
			Permalink.style.display = "none";
	} else {
			Back.style.display = "block";
			Permalink.style.display = "block";
	}
}

// Triggered when the window loads
jQuery(window).on("load", function(){
		// Welcome Message
		console.log("Hello! Welcome to the joke-book console.")
		console.log("Please visit assets/js/main.js and look for console.log() scripts for debugging.")
		console.log("Best of luck!")
		// Pulls from sheety
    $.getJSON(sheety_link, function(data) {
			items = data.slice();
			items_backup = data.slice();
	 		var appendText = sessionStorage.getItem("appendText");
			// For debugging appended text
			// console.log(appendText);
			if (appendText == null || isNaN(appendText)) {
				getNew();
			} else {
				getSpecific();
			}
			// Show Splash Screen
			$(".splashIcon").fadeTo(600,1);
			$("#splashText").fadeTo(600,0.5);
			setTimeout(function() {
				$(".splashIcon").fadeOut()
				$("#splashText").fadeOut()
				setTimeout(function() {
					$("#Splash").fadeOut(1000)
				},500);
			},1000)
		})
});

// Get a new joke when they click the reload button
$('#Reload').on("click",function(){
	saveCurrent()
	getNew()
})

// Go back when back button pressed
$('#back').on("click",function(){
	goBack()
})

// Show permalink window when permalink button pressed
$('#Permalink').on("click",function(){
	permalink()
})

// Get a new joke when space bar or arrow key is pressed
$("body").keydown(function(e) {
	if(e.keyCode == 39) {
		saveCurrent()
		getNew()
	}
	if (e.which == 32) {
		saveCurrent()
		getNew()
	  return false;
	}
});
