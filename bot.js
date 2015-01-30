var config = {
	channels: ["#testingtipbot"],
	server: "chat.freenode.net",
	botName: "netmonkbot"
};

// Get the lib
var irc = require("irc");
var https = require("https");
//http request structure 
var options = {
  hostname: 'www.cryptonator.com'
  ,port: '443'
  ,path: '/api/ticker/btc-eur'
  ,method: 'GET'
  ,headers: { 'Content-Type': 'application/json' }
};




// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels,
	userName: 'netmonk',
	realName: 'a wannabee tipbot',    
	port: 6697,
	localAddress: null,
	debug: true,
	showErrors: false,
	autoRejoin: false,
	autoConnect: true,
	secure: true,
	selfSigned: false,
	certExpired: false,
	floodProtection: false,
	floodProtectionDelay: 1000,
	sasl: false,
	stripColors: false,
	channelPrefixes: "&#",
	messageSplit: 512,
	encoding: ''

});

bot.addListener("join", function(channel, who) {
	// Welcome them in!
    if (who != config.botName) {
	setTimeout(function() {bot.say(channel, who + "...dude...welcome back!");},1250);
	}
});

bot.addListener("message", function(from, to, text, message) {
	
        if (text.match(config.botName)) {
		if (to != config.botName) {
                	bot.say(to, "Are you talking to me " + from +" ?");
                	bot.say(to, "Type !help for list and descriptions of commands");
        	} else  {	
                	bot.say(from, "Are you talking to me " + from +" ?");
                	bot.say(from, "Type !help for list and descriptions of commands");
		}
	} else if (text.substr(0,1) == "!") { parsecommand(from, to, text)
        } else {
	    console.log(from+"@"+to+": "+text);
	    }

});

function parsecommand(from, to, text) {
	var reg=new RegExp("[ ]+","g");
	var trimmed = text.trim()
	var command = trimmed.split(reg);
        if (from == 'hegemoOn') {
	    for (var i=0; i< command.length; i++) {
		bot.say(from, "command["+i+"]=" +command[i]);
	    }
	}
	if (command[0]=="!help") {
		bot.say(from, "Beside !help, i dont have much commands now");
		bot.say(from, "!join #channel to make me join this channel");
		bot.say(from, "!part #channel to make me leave this channel");
		bot.say(from, "!btc to know the current euro price of btc");
	} else if ( command[0] == "!join") {
		if (command.length > 1) {
			if (command[1].substr(0,1) != "#") {
				command[1]="#".concat(command[1]);
			}
			bot.join(command[1]);
		} else { 
			bot.say(from, "i need a channel name to join");
		} 	
		
	} else if (command[0] == "!part") {
		if (command.length == 1) {
			bot.say(from, "i need a channel to leave, please choose one");
			console.log(bot.chans);
			var keys = Object.keys(bot.chans);
			keys.forEach(function(key) {
				//var items = Object.keys(bot.chans[key]);
				//items.forEach(function(plop) {
				//var value = bot.chans[key][plop];
				console.log(key);
				bot.say(from, key) 
				//}); 	
			}); 	
		} else {
	               if (command[1].substr(0,1) != "#") {
        	        	command[1]="#".concat(command[1]);
                        }
                        bot.part(command[1],"brb",false);

		}
	} else if (command[0] == "!btc") {
	    var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (data) {
		    console.log(data); 
		    jsondata = JSON.parse(data);
		    //var tmp1 = Object.keys(jsondata); 
		    tmp1=jsondata.ticker;
		    console.log(tmp1);
		    var tmp2 = Object.keys(tmp1);
		    console.log(tmp2);
		    var base = tmp1.base;
		    var target = tmp1.target;
		    var price = tmp1.price;
		    var volume = tmp1.volume;
		    console.log("Currently 1 "+base+" is exchanged at "+price+" "+target);
		    bot.say(to, "Currently 1 "+base+" is exchanged at "+price+" "+target);
		});
	    });
	    req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	    });
	    req.end();
	}
}	

bot.addListener('error', function(message) {
    console.log('error: ', message);
});
