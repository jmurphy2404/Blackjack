var money = 100;
var deck = [];
var dealercards = [];
var playercards = [];
var dealersuits = [];
var playersuits = [];
var bet = 10;
var elems = document.getElementsByClassName('debutton');

//Deal function to activate on click of bet amounts
function deal(playerbet) {
//check to be sure player has $ for bet
  if(playerbet > money){
    document.getElementById("message").innerHTML = "Not enough money!";
    return true;
  }
  deck = [];
  dealercards = [];
  playercards = [];
//pulls 2 cards for each dealer and player
  pullcard(0);
  pullcard(0);
  pullcard(1);
  pullcard(1);
//locks in bet amount
  bet = playerbet;
//reveals buttons needed for play
  document.getElementById("ddbutton").style.visibility = "visible";
  document.getElementById("stbutton").style.visibility = "visible";
  document.getElementById("htbutton").style.visibility = "visible";
//hides buttons for betting while playing
  for(var i = 0; i != elems.length; ++i)
  {
    elems[i].style.visibility = "hidden"; 
  }
//show bet amount
  document.getElementById("message").innerHTML = "You bet $" + bet;
//deduct bet from bank and update money
  money -= bet;
  document.getElementById("playermoney").innerHTML = "$" + money;
//double down bet amount update
  document.getElementById("ddbutton").innerHTML = "Double Down -$" + bet;
}

//draws card for dealer (0) or player (1)
function pullcard(playernum) {
  var keepgoing = true;
  var cardpull;
  var suit;
  var value = 0;
//checks deck isnt empty
  if (deck.length < 52) {
    while (keepgoing) {
      cardpull = Math.floor((Math.random() * 52) + 1);
      keepgoing = false;
//checks to see if that card has been played
      for (i = 0; i < deck.length; i++) {
        if (cardpull == deck[i]) {
          keepgoing = true;
        }
      }
    }
    deck.push(cardpull);
//checks suit
    if (cardpull <= 13) {
      suit = "S"
    } else if (cardpull <= 26) {
      suit = "C"
      cardpull -= 13;
    } else if (cardpull <= 39) {
      suit = "H"
      cardpull -= 26;
    } else if (cardpull <= 52) {
      suit = "D"
      cardpull -= 39;
    }
//push card value and suit to proper array (player or dealer)
    if (playernum == 0) {
      dealercards.push(cardpull);
      dealersuits.push(suit);
//show cardback graphic so dealer cards aren't revealed to player
      document.getElementById("dealerscore").innerHTML = "--";
      if (dealercards.length > 1) {
        var passcards = dealercards.slice(1, 2);
        var passsuits = dealersuits.slice(1, 2);
        document.getElementById("dealercards").innerHTML = drawcards(passcards, dealersuits);
      }

    }
    if (playernum == 1) {
      playercards.push(cardpull);
      playersuits.push(suit);
      document.getElementById("playerscore").innerHTML = calcscore(playercards);
      document.getElementById("playercards").innerHTML = drawcards(playercards, playersuits);
    }
    return true;
  }
  return "ERROR";
}

//hit button
function hit() {
//player takes a hit
  pullcard(1);
  document.getElementById("ddbutton").style.visibility = "hidden";
//check for bust
  if (calcscore(playercards) > 21) {
    stand();
  }

}

//stand button
function stand() {
//resets for next bet (hide gameplay reveal bet buttons)
  document.getElementById("ddbutton").style.visibility = "hidden";
  document.getElementById("stbutton").style.visibility = "hidden";
  document.getElementById("htbutton").style.visibility = "hidden";
  for(var i = 0; i != elems.length; ++i)
  {
    elems[i].style.visibility = "visible";
  }
  //play logic for dealer (hit until >= 17)
  dealerplay();
  
//checks score and sees who wins
  var playerend = calcscore(playercards);
  var dealerend = calcscore(dealercards);
  if (playerend > 21) {
    document.getElementById("message").innerHTML = "YOU BUSTED!";
  } else if (dealerend > 21 || playerend > dealerend) {
    document.getElementById("message").innerHTML = "YOU WIN! $" + 2 * bet;
    money += 2 * bet;
  } else if (dealerend == playerend) {
    document.getElementById("message").innerHTML = "PUSH! $" + bet;
    money += bet;
  } else {
    document.getElementById("message").innerHTML = "DEALER WINS!";
  }
  document.getElementById("playermoney").innerHTML = "$" + money;
}

//double down button (double bet, one more card then stand)
function doubledown() {
//checks if can afford
  if(money < bet){
    document.getElementById("message").innerHTML = "Not enough money to double down!";
    return true;
  }
//takes bet out of money, doubles bet, gives card, stands
  money -= bet;
  bet *= 2;
  hit();
  stand();
}

//dictates dealer play (pull card when under 17)
function dealerplay() {
  while (calcscore(dealercards) < 17) {
    pullcard(0);
  }
  document.getElementById("dealerscore").innerHTML = calcscore(dealercards);
  document.getElementById("dealercards").innerHTML = drawcards(dealercards, dealersuits);
}

//checks scored based on array of cards
function calcscore(cards) {
  var aces = 0;
  var endscore = 0;

//count and check if ace
  for (i = 0; i < cards.length; i++) {
    if (cards[i] == 1 && aces == 0) {
      aces++;
    } else { //if it's not an ace
      if (cards[i] >= 10) {
        endscore += 10;
      } else {
        endscore += cards[i];
      }
    }
  }

//adds ace if needed
  if (aces == 1) {
//if statements for if ace should be 11 or 1 (if 11 would cause a bust, add one, else add 11)
    if (endscore + 11 > 21) {
 //add 1 if 11 would bust
      endscore++;
    } else {
//add 11 if it isnt a bust to do so
      endscore += 11;
    }
  }
  return endscore;
}

//ascii drawing of card in 5 lines (1-top, 2-value, 3-suit, 4-value, 5-bottom)
function drawcards(cards, suits) {
  var lines = ["", "", "", "", ""];
  var value = [];
  if (cards.length == 1) { //if only one card is passed we draw the first card face down
    lines = [".---.", "|///|", "|///|", "|///|", "'---'"];
  }
  //topline
  for (i = 0; i < cards.length; i++) {
    lines[0] += ".---.";
  }
  lines[0] += "</br>";

  //2nd line (contains value)
  for (i = 0; i < cards.length; i++) {
    lines[1] += "|" + cardvalue(cards[i]);
    if (cardvalue(cards[i]) == 10) {
      lines[1] += " |";
    } else {
      lines[1] += "&nbsp; |";
    }
  }
  lines[1] += "</br>";

  //3rd line (contains suit)
  for (i = 0; i < cards.length; i++) {

    lines[2] += "| " + suits[i] + " |";
  }
  lines[2] += "</br>";

  //4th line (contains value)
  for (i = 0; i < cards.length; i++) {
    if (cardvalue(cards[i]) == 10) {
      lines[3] += "| " + cardvalue(cards[i]) + "|";
    } else {
      lines[3] += "| &nbsp;" + cardvalue(cards[i]) + "|";
    }

  }
  lines[3] += "</br>";

  //bottom line
  for (i = 0; i < cards.length; i++) {
    lines[4] += "'---'";
  }
  lines[4] += "</br>";
  return lines[0] + lines[1] + lines[2] + lines[3] + lines[4];
}

//makes face cards their correct character instead of their number value from random 
//(1,10,11,12 = ace, jack, queen, king)
function cardvalue(cardnum) {
  if (cardnum == 1) {
    return "A";
  }
  if (cardnum == 11) {
    return "J";
  }
  if (cardnum == 12) {
    return "Q";
  }
  if (cardnum == 13) {
    return "K";
  } else return cardnum;
}

//event listeners for clicks of buttons after DOM loads
document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("bet1").addEventListener("click", function(){
    deal(1);
  });
  document.getElementById("bet5").addEventListener("click", function(){
    deal(5);
  });
  document.getElementById("bet10").addEventListener("click", function(){
    deal(10);
  });
  document.getElementById("bet20").addEventListener("click", function(){
    deal(20);
  });  
  document.getElementById("htbutton").addEventListener("click", function(){
    hit();
  });
  document.getElementById("stbutton").addEventListener("click", function(){
    stand();
  });
  document.getElementById("ddbutton").addEventListener("click", function(){
    doubledown();
  });
});

