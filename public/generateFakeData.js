let startDate = new Date('2016-11-01');

const creditCard = ["Wagaya", "Amagansett Supersav", "Publix #719", "Joy Cafe", "Trader Joe's #539 Qps", "Trader Joe's #539 Qps", "Fellini's Pizza-buckhe", "Amagansett Supersav", "Trader Joe's #539 Qps", "Bar Taco Inman Park", "Comcast Atlanta Cs 1x", "Comcast Atlanta Cs 1x", "Comcast Atlanta Cs 1x", "Harris Teeter #80", "Amer Mus Nat Hist Tix", "Uber Trip Azk12", "Cinepolis Chelsea", "Uber Eats Azk12", "Tm *atlanta Hawks", "Mercedes Benz Stadium", "Ticketmaster", "Publix #282", "Karakatta", "Amagansett Supersav", "Publix #719", "Cvs/pharmacy #02082", "Tuk Tuk Thai Food Loft", "Amagansett Supersav", "Publix #719", "Mirch Masala", "Publix #719", "Trader Joe's #539 Qps", "La Abuela Ii", "Shell Oil 57446255408", "Publix #719", "Tm *atlanta United Fc", "Amazon.com*Azk12", "Sq *los Tacos Al Pastor", "Victory Sandwich Bar - De", "Amagansett Supersav", "Trader Joe's #539 Qps", "Uber Trip I35az", "Taqueria Del Sol Howell", "Publix #719", "Publix #719", "ConEd", "Publix #282", "Trader Joe's #539 Qps", "Amarachi Restaurant", "Spectrum", "Spectrum", "Spectrum", "Spectrum", "Publix #719", "Publix #719", "Sunoco 0718764400", "ConEd", "Trader Joe's #539 Qps", "Exxonmobil 48085070", "Tm *atlanta United Fc", "Chevron 0302330", "Bp#Azk12 Azk12", "Art Bar", "Exxonmobil 48085070", "Citgo-metro Food & Gas", "Trader Joe's #539 Qps", "Bp#1721828ck 2211932", "Exxonmobil 47449913", "Trader Joe's #539 Qps", "ConEd", "Uber Eats", "Tst* Sampan", "Vip Market", "Exxonmobil 48085070", "Trader Joe's #539 Qps", "Publix #719", "Publix #719", "Down The Hatch", "Playstationnetwork", "Ton Ton", "ConEd", "Publix #719", "ConEd", "Amagansett Supersav", "Texaco 0381549", "Citgo-metro Food & Gas", "Barnes & Noble #1907", "John Brown Smokehouse", "Sq *fifth Hammer Brewing", "Ookook Korean Bbq", "Publix #719", "Ingles Gas Exp #133", "9640 Amc Online", "Trader Joe's #539 Qps", "Ifc Theatres Llc Box Off", "Megabus.com", "Taqueria Del Sol Athens", "Proof Of The Pudding At G", "Best In Class Barber Shop", "Gu's Dumplings", "Tom's Dim Sum", "Bp#4979753speaks #106", "Exxonmobil 97303341", "Trader Joe's #539 Qps", "Mta*metrocard Machine", "Mta*metrocard Machine", "Mta*metrocard Machine", "Mta*metrocard Machine", "Mta*metrocard Machine", "Mta*metrocard Machine", "Mta*metrocard Machine", "Mta*metrocard Machine", "Mta*metrocard Machine", "Mta*metrocard Machine", "Record Stop Chs", "Best Buy 00006098", "Murphy6761atwalmart", "Publix #282", "Qt 798 07007982", "Qt 838 07008386", "Uber Trip", "Sq *american Whiskey", "Minero Restaurant", "Bp#1658533discount Zone", "Mercantile And Mas", "Amazon Mktplace Pmts Www.", "Sq *brick+mortar Go", "Atlantic Wines And Liquor", "Qt 838 07008386", "Bull Mccabes", "Exxonmobil 42181370", "76 - Gse 76 Los Feliz", "Ton Ton", "Qt 761 07007610", "Trader Joe's #539 Qps", "Amagansett Supersav", "Trader Joe's #539 Qps", "Sq *dsk Brooklyn", "CVS", "Publix #282", "Best Buy Mht 00008904", "Bp#8247694circle K St 27", "Amagansett Supersav", "Rosati's Pizza- Buckhead", "Megabus.com", "Publix #719", "Mezcalitos Group L", "Music Midtown", "Publix #719", "Supercuts", "Anticos Pizza", "Krispy Kreme Dough", "Marta Atlanta 00000018", "Playstationnetwork"];

const friends = ["Missy Hulme", "Darcie Ferreira", "Everett Dalton", "Arron Thorne", "Hina Couch", "Camden Merritt", "Kelsi Burt", "Aiysha Fleming", "Lidia Barclay", "Shaurya Horne", "Sara Harrington", "Cory Maguire", "Theodor Larson", "Jo Pena", "Anthony Palacios", "Theo Freeman", "Leen Mcgrath", "Alivia Mackay", "Carlo Hodge", "Paula Gallagher", "Malachi Cannon", "Lex Curran", "Emilis Jensen", "Dominick Arellano", "Murtaza Becker", "Camron Ramirez", "Courtnie Mccarty", "Tyrell Padilla", "Yousef Walls", "Tyriq Chavez", "Kitty John", "Nabilah Knowles", "Oran Crane", "Hassan Nicholson", "Devin Hollis", "Norman Liu", "Omar Nairn", "Adil Smart", "Amelia-Lily Pham", "Dominik Lowe", "Thelma Stacey", "Boyd Mcclain", "Todd Mcmillan", "Abdurahman Fox", "Renae Hutchinson", "Gemma Avery", "Jadene Holding", "Nafeesa Mitchell", "Aarron Timms", "Jamal Cole"];

const categories = ['Travel', 'Merchandise', 'Dining', 'Health Care', 'Other Services', 'Phone/Cable'];

const meals = ['Breakfast', 'Brunch', 'Lunch', 'Snacks', 'Dinner', 'Drinks', 'Groceries', 'Tickets'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const emojis = ["😍","😎","🥳","🤩","😋","🤯","🥵","🤗","🤐","🤑","🤠","👻","🤟","👌","🙏","⛄️","🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🥪","🥙","🧆","🌮","🌯"];

const randomArrEl = (arr) => arr[Math.floor(Math.random()*arr.length)];

for (let i = 0; i < 2500; i++) {
	let amt = (Math.random()*100).toFixed(2);
	let sender, recipient, note;
	
	//venmo
	if (Math.random() > 0.6) {
		let outgoingCharge = Math.random() > 0.5;
		sender = outgoingCharge? randomArrEl(friends) : 'Adam Sanders';
		recipient = outgoingCharge? 'Adam Sanders' : randomArrEl(friends);
		amt *= outgoingCharge? -1 : 1;
		note = `${randomArrEl(meals)} on ${randomArrEl(days)} ${randomArrEl(emojis)}${randomArrEl(emojis)}`;
	} else {
		sender = '';
		recipient = randomArrEl(creditCard);
		note = randomArrEl(categories);
	}
	
	console.log(`${amt}\t${startDate.toISOString()}\t${sender}\t${recipient}\t${note}`);
	
	if (i % 2) startDate.setDate(startDate.getDate()+1);
}