$(document).ready(function() {

	var cardsFromSql = [];

	//needs to come from firebase, which comes from sql
	var whiteCardsFromSql = []

	var user = "";

	var points;

	var playerIndex;

	var hand = [];

	var czar = false;


	  // Initialize Firebase
	var config = {
	    apiKey: "AIzaSyDSSNV1gjwiaCVLTvKSZwgW5wNoSZ6HMOs",
	    authDomain: "gwah-199f8.firebaseapp.com",
	    databaseURL: "https://gwah-199f8.firebaseio.com",
	    projectId: "gwah-199f8",
	    storageBucket: "gwah-199f8.appspot.com",
	    messagingSenderId: "817131336094"
	};
	  
	firebase.initializeApp(config);

	var database = firebase.database();

	database.ref().on("value", function(childSnapshot) {
	    var data = childSnapshot.child();
		// var databaseData = data;
		// console.log(data);
	});


	var ref = firebase.database().ref();

	var idCount = 0;

	whiteCardsGet();
 	blackCardsGet();

 	console.log(cardsFromSql, whiteCardsFromSql)

	//event listener for ID Count

	database.ref('count').on("value", function(snapshot) {
	  if (snapshot.exists()) {
		idCount = snapshot.val().idCount;
		$("#user-count").html("Number Of Users: " + idCount)
	  } 
	});


	//event listener for czar and for once the czar has selected his card. 

	var firebaseCzar;
	var czarSelected;
	var czarCardPlayed;

	ref.orderByChild("czar").equalTo(true).on("child_added", function(snapshot) {

	  	firebaseCzar = snapshot.key;
	  	console.log(firebaseCzar);

	  	database.ref(firebaseCzar).on("value", function(childSnapshot) {
			czarCardPlayed = childSnapshot.val().czarCardPlayed;
			if (czarCardPlayed != 0) {
				$("#play2").html(czarCardPlayed);
			};
		});

		database.ref(firebaseCzar).on("value", function(childSnapshot) {
			czarSelected = childSnapshot.val().czarSelected;
			if(czarSelected != 0) {
				console.log(czarSelected);
				$('.band').html("<div class='item-7 card'> <div class='thumb'></div> <article> <p id='play2'>" + czarCardPlayed + "</p></article></div>");
				$('.band').append("<div class='item-1 card'> <div class='thumb'></div> <article> <p>" + czarSelected + "</p></article></div>");
			}
		});
	
	});

	//event listener for player points

		ref.orderByChild("czar").equalTo(false).on("child_added", function(snapshot) {

		  	userName = snapshot.key;
		  	console.log(userName);

		  	database.ref(userName).on("value", function(childSnapshot) {
				uniquePoints = childSnapshot.val().points;
				if (uniquePoints != 0) {
					$("#username").append(userName + " is awarded " + uniquePoints + " point!");
				};
			});

		});



	//event listener for once all players have played their card

		database.ref("AllUsersPlayed").on("child_added", function(childSnapshot) {
			if(childSnapshot.val().played == true) {
				var query = firebase.database().ref("cardsPlayed").orderByKey();
				query.once("value").then(function(snapshot) {
					$('.band').html("<div class='item-7 card'> <div class='thumb'></div> <article> <p id='play2'>" + czarCardPlayed + "</p></article></div>");
							    
					snapshot.forEach(function(childSnapshot) {
						var childData = childSnapshot.val().card;
						console.log(childData);
					$('.band').append("<div class='item-1 card'> <div class='thumb'></div> <article><p>" + childData + "</p></article></div>");
					});
				});
			}	
		});

	$("#user-count").html("Number Of Users: " + idCount)


	//registers the user firebase. Modify this to capture Lebeza's data. 

  	$('#register-user').click(function() {

  		if(!user) {

		  	user = $('#username-input').val();

		  	if(idCount >= 1) {

		  		database.ref($('#username-input').val()).set({
		     // "username": $('#username-input').val(),
			        "hand": 0,
			        "selected": 0, 
			        "points": 0, 
			        "czar": false,
			        "playAgain": false
			    });

			    database.ref("count").update({
					"idCount": idCount + 1
				});

				database.ref().once("value", function(childSnapshot) {
					whiteCards = childSnapshot.val().whiteCards;
					console.log(whiteCards);
					hand = [whiteCards[0], whiteCards[1], whiteCards[2], whiteCards[3], whiteCards[4], whiteCards[5]];
					whiteCards.splice(0,6)
					database.ref().update({"whiteCards": whiteCards});
					push6CardsFromLocal(hand);
					dealtHandAppearsOnScreen();
				});



			} else {

				database.ref($('#username-input').val()).set({
			        "czarCardPlayed": 0, 
			        "czarSelected": 0,
			        "czar": true,
			        "playAgain": false
			    });

			    czar = true;

			    updateCardsToFirebase(cardsFromSql, whiteCardsFromSql)

			    database.ref("count").update({
					"idCount": idCount + 1
				});

			    $('.register').append("<button type='submit' class='btn btn-default' id='start'> Czar Card </button>")
				$('.band').html("<div class='item-7 card'> <div class='thumb'></div> <article> <p id='play2'> When Player Count Reaches 4, Please Play Your Card! </p></article></div>")

			};

		} else {
		  	alert("you have already joined the game");
		}
  	});

    $('.band').on('click', 'p', function() {

    	// if czar
    	if(czar) { 

			//if all users have played their hand, allow the czar to select a card
			cardSelected = $(this).html();

			//updates the czar's selected card in firebase

			database.ref().child(user).update({"czarSelected": cardSelected});

	  		//This Adds Points To the User Who's Card Is Selected!!!!!!!!!

			ref.orderByChild("selected").equalTo(cardSelected).once("child_added", function(snapshot) {
				firebaseUser = snapshot.key;
				console.log(firebaseUser)

				database.ref(firebaseUser).once("value", function(snapshot) {
					czarPoint = snapshot.val().points;
					database.ref().child(firebaseUser).update({"points": czarPoint +1})
				 });

			});

			//updated the Czar's Selected Card and The Czar's Card to the Screen. 

			//need to update to all screens.  

			database.ref(firebaseCzar).on("value", function(snapshot) {
				czarCardPlayed = snapshot.val().czarCardPlayed;
				czarSelected = snapshot.val().czarSelected;
				console.log(czarSelected, czarCardPlayed);
			});

			$('.band').html("<div class='item-7 card'> <div class='thumb'></div> <article> <p id='play2'>" + czarCardPlayed + "</p></article></div>");
			$('.band').append("<div class='item-1 card'> <div class='thumb'></div> <article> <p>" + czarSelected + "</p></article></div>");


    	} else {

    		var snapShotCardSelected

    		cardSelected = $(this).html();

			database.ref(user).on("value", function(snapshot) {
				snapShotCardSelected = snapshot.val().selected;
			});

			if(snapShotCardSelected == cardSelected) {
				alert("You have already played your card.  Please wait for the czar to selected the winning card");
			} else if (!czarCardPlayed) {
				alert("please wait for the czar to play his card")
			} else {
	    		//if not the czar selecting cards...

	    		//save the selected card

	    		// cardSelected = $(this).html();

	    		//update the user's selected card to firebase

	    		database.ref(user).once("value", function(snapshot) {  
					database.ref().child(user).update({"selected": cardSelected});
				});

				//update firebase with the card the user played - genera list.

				database.ref("cardsPlayed").push({
					"card": cardSelected,
				 });

				//set the variable, userHasntPlayed to false

				var userHasntPlayed = false;

				//child listener that watches for any selected == 0

				ref.orderByChild("selected").equalTo(0).on("child_added", function(snapshot) {
				  return userHasntPlayed = snapshot.key;
				}); 

				//checks to see if the user has selected a card.

				if (typeof userHasntPlayed == 'string') {
					//finds the card the user selected (within the hand array), and removes it from their hand

					var index = hand.indexOf(cardSelected);
					hand.splice(index, 1);
					// push6CardsFromLocal(hand)

					//updates the screen with their selected card and the czar's card.
					$('.band').html("<div class='item-7 card'> <div class='thumb'></div> <article> <p id='play2'>" + czarCardPlayed+ "</p></article></div>")
					$('.band').append("<div class='item-1 card'> <div class='thumb'></div> <article> <p>" + cardSelected + "</p></article></div>");
					console.log(userHasntPlayed);
				
				} else if (userHasntPlayed == false) {
					console.log(userHasntPlayed);

					database.ref("AllUsersPlayed").push({
						"played": true,
					 });

					var query = firebase.database().ref("cardsPlayed").orderByKey();
						query.once("value")
						  .then(function(snapshot) {
						  	$('.band').html("<div class='item-7 card'> <div class='thumb'></div> <article> <p id='play2'>" + czarCardPlayed + "</p></article></div>");
						    
						    snapshot.forEach(function(childSnapshot) {
						      var childData = childSnapshot.val().card;
						      console.log(childData);
							 $('.band').append("<div class='item-1 card'> <div class='thumb'></div> <article> <p>" + childData + "</p></article></div>");
						  });
					});
				}	
			};
		};
	});


  	$('.register').on('click', '#start', function() {

  		if(idCount >= 4 && czar == true){
  			alert("The game has started!")
  			singleBlackCardPlayed();
  		} else if (idCount >= 4  || idCount < 4 && czar == false) {
  			alert("Only the czar may draw a card!");
  		} else if (idCount < 4 && czar == true) {
  			alert("Please wait for the right number of players!")
  		}

	});




///////////////functions////////////////////////////////

	//I push two arrays to firebase.
	function updateCardsToFirebase(cardsFromSql, whiteCards) {
		//temporary - pulling from my computer.
		database.ref().update({
			"blackCards": cardsFromSql,
			"whiteCards": whiteCardsFromSql
		})
	};

	function push6CardsFromLocal(hand) {
		if(czar == false) {
			database.ref().once("value", function(childSnapshot) {
				database.ref().child(user).update({"hand": hand});
			});
		};
	}


	function singleBlackCardPlayed() {

		var indexOfCard =  Math.floor(Math.random() * (11 - 0 + 1)) + 0

		database.ref().once("value", function(childSnapshot) {
			blackCard = childSnapshot.val().blackCards[indexOfCard];
			database.ref().child(user).update({"czarCardPlayed": blackCard});
		});
	};

	function dealtHandAppearsOnScreen() {
		for(var i = 0; i < 6; i++) {
			$(".card" + i).html(hand[i]);
		}
	};


	function whiteCardsGet() {
    $.get("/api/whitecards", function(data) {
	    for (var i = 0; i < data.length; i++) {
	      whiteCardsFromSql.push(data[i].text);
	    }
	    console.log(whiteCardsFromSql);
    	});
  	};

  	function blackCardsGet() {
    $.get("/api/blackcard", function(data) {
	    for (var i = 0; i < data.length; i++) {
	      cardsFromSql.push(data[i].text);
	    }
	    console.log(cardsFromSql);
    	});
  	};

});



