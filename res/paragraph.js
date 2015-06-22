// for testing using npm and zombie
var assert = require("assert");
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();

// cloning
Object.defineProperty(Object.prototype, "extend", {
    enumerable: false,
    value: function(from) {
        var props = Object.getOwnPropertyNames(from);
        var dest = this;
        props.forEach(function(name) {
            if (name in dest) {
                var destination = Object.getOwnPropertyDescriptor(from, name);
                Object.defineProperty(dest, name, destination);
            }
        });
        return this;
    }
});

Array.prototype.sort_tuple_by_value = function() {
	this.sort(function(a,b){
	    return b[1]-a[1];
	});
}

Object.prototype.tuple = function() {
	tuple = []
	for(var key in this) {
		var val = this[key];
		if (typeof val !== 'function') {
			tuple.push([key,val])
		}
	}
	return tuple;
}

// Array methods

Array.prototype.sum = function() {
	sum = 0;
	for (var i = 0; i < this.length; i++) {
		sum+=this[i]|| 0;
	};
	return sum;
}
Array.prototype.mean = function() {
	return this.sum()/this.length;
}

Array.prototype.variance = function() {
	v = 0;
	for (var i = 0; i < this.length; i++) {
		v+=Math.pow(this[i]-this.mean(),2) || 0;
	};
	return v;
}
Array.prototype.standard_deviation = function () {
	return Math.sqrt(this.variance());
}

Array.prototype.average_deviation = function() {
	z_scores = [];
	for (var i = 0; i < this.length; i++) {
		z_scores.push(( this[i] - this.mean() ) / this.standard_deviation());
	};
	return z_scores.mean();
}

// best tool for regex
// http://www.regexr.com/

// class paragraph
function paragraph (text) {
	// clean text
	if (text && typeof text == "string") {
		this.text = text.replace("<br/>","");
	} else {
		this.text = "";
	}
	this.type = "paragraph";
	this.size = this.text.length;
	this.documentation = this.documentation();
	this.mla_documentation = this.countMLADoc();
	this.words = this.getWords(this.text);
	this.usertext = this.getUserText();
	this.userwords = this.getWords(this.usertext).length;
	this.quotedtext = this.getQuotations().join("");
	this.quotedwords = this.getWords(this.quotedtext).length;
	this.sentence_variety = this.getSentenceVariety();
	this.intro = this.get_intro();
	this.conclusion = this.get_conclusion();
	this.freqChart = this.getFreqChart();
	this.top_five_words = this.getTopFive();
	this.comma_sentence_ratio = this.get_comma_sentence_ratio();

}

paragraph.prototype.toString = function () {
	cutoff = 40;
	// do freq chart

	return "\ntype: "+this.type+"\n"+"text: "+this.text.substring(0,cutoff)+"..."+
		"\nchar size: "+this.size+
		"\nwords: "+this.words.length+
		'\ninline documentation: '+this.countDoc()+
		"\nproper mla documentation: "+this.mla_documentation+
		"\nnumber of userwords: "+this.userwords+
		"\nnumber of quoted words: "+this.quotedwords+
		"\nsentence length variety (avg z-score): "+this.sentence_variety+
		"\nintro: "+this.intro.substring(0,cutoff)+"..."+
		"\nconclusion: "+this.conclusion.substring(0,cutoff)+"..."+
		"\nfreqChart length: "+this.freqChart.length+
		"\ntop 5 words: "+this.top_five_words+
		"\ncomma-sentence ratio: "+this.comma_sentence_ratio+"\n"
		;
}
// clean input
paragraph.prototype.clean = function () {
	this.text = this.text.replace("<br/>","");
	this.text = this.text.replace("\n","");
}

paragraph.prototype.setText = function(text) {
	this.text = text;
}

paragraph.prototype.sentences = function () {
	text = this.text.split(/[?!.]+/g).filter(Boolean);
	return text
}

paragraph.prototype.user_sentences = function () {
	text = this.usertext.split(/[?!.]+/g).filter(Boolean);
	return text
}

paragraph.prototype.sentenceCount = function () {
	return this.sentences().length;
}

paragraph.prototype.getWords = function (text) {
	//console.log(typeof text);
	return text.split(/[0-9:;.“”‘’()\s,]/g).filter(Boolean) || [];
}

paragraph.prototype.getQuotations = function () {
	quotes = this.text.match(/“[^\”]+”/g) || [];
	//console.log(quotes);
	return quotes.filter(Boolean);
}

paragraph.prototype.getUserText = function () {
	return this.text.split(/“[^\”]+”/g).filter(Boolean).join("");
}

paragraph.prototype.setTextToUserText = function () {
	text = this.getUserText();
	this.setText(text);
	this.size = text.length;
}

// dealing with documentation
paragraph.prototype.documentation = function() {
	return this.text.match(/\(([^\)]+)\)/g);
}
paragraph.prototype.countDoc = function() {
	return this.documentation.length;
}

paragraph.prototype.countMLADoc = function() {
	doc = this.documentation || [];
	commas = doc.join(" ").match(/[,]+/g) || [];
	return commas.length;
}
paragraph.prototype.getArrayOfSentenceLengths = function() {
	lengths = []
	sentences = this.sentences();
	for (var i = 0; i < sentences.length; i++) {
		lengths.push(this.getWords(sentences[i]).length);
	};
	return lengths;
}

paragraph.prototype.getSentenceVariety = function() {
	return this.getArrayOfSentenceLengths().average_deviation() || 0;
}

paragraph.prototype.get_conclusion = function() {
	sentences = this.sentences();
	return sentences[sentences.length-1] || "";
}

paragraph.prototype.get_intro = function() {
	sentences = this.sentences();
	return sentences[0] || "";
}

function getNounsOfText(text) {
	nouns = []
	console.log(text);
	nouns.push(text);
	return nouns;
}

paragraph.prototype.mainPoints = function() {
	conclusion = new sentence(this.conclusion);
	return conclusion.nouns;
}

paragraph.prototype.getFreqChart = function() {
	words = this.getWords(this.usertext);
	freqChart = {}
	excluded = ['it','they','us','we',
	'a', 'the','and','i','he',' she ',
	'them',' an ','so','thus','can','will',
	'if','of','has','to','in','as','by','is','his','who']

	for (var i=0; i<words.length;i++) {
		word = words[i].toLowerCase();
		if (excluded.indexOf(word)<0) {
			if (freqChart[word]) {
				freqChart[word]+=1;
			}
			else {
				freqChart[word]=1;
			}
		}
	}
	return freqChart.tuple();
}
paragraph.prototype.getTopFive = function() {
	freq = this.freqChart;
	sorted = freq.sort_tuple_by_value() || [];	//console.log('freq',freq,'type',typeof freq,'sorted',freq.sort_tuple_by_value())
	return freq.slice(0,5) || [];
}

paragraph.prototype.commasPerSentence = function() {
	commas = {}
	text = this.user_sentences();
	for (var i = 0; i < text.length; i++) {
		match = text[i].match(/[,]+/g);
		//console.log(match);
		if (match) {
			commas[i+1]=match.length;
		} else commas[i+1]=0;
	};
	return commas;
}

paragraph.prototype.get_comma_sentence_ratio = function() {
	commas = this.commasPerSentence();
	ratio = []
	for (key in commas) {
		val = commas[key]
		if (typeof val !== 'function') {
			ratio.push(commas[key]);
		}
	}
	return  ratio.mean() || 0;
}

// ----- methods to get
// setnences with too many commas
// sentences with non-academic language
// sentences which seem too short
// sentences without proper semicolon use
// list of academic words used
// statements of analysis eg there, one can see, this shows


// count 




// divide into sentences
// TESTING
p1 = new paragraph("hello world? This is, truly awesome.");
comp = p1.sentenceCount();
assert.equal(p1.sentences().length,2,"paragraph is not properly splitting into sentences \n len: "+comp);


p2 = new paragraph("“Through Rap, Muslim youth were exposed to black history and non-Muslims were introduced to Islam” states Hisham Adi (Aidi 1). Rap has come a long way through the years and has become more than just a genre in music. When it comes to hip hop, specifically in rap, it is in a way a message that talks about “social, political and contradictions” as stated in the article, “Black and Blue: Remembering Islam and Hip Hop” by The Islamic Monthy (Black and Bluec: Remembering Islam and Hip Hop 1). Just as the quote states, rap has played a major role within the Islam religion and through rap, public opinions in connection with Islam beliefs have been rising up to today. The history of Islam being a major influence in hip hop had started with the Nation of Islam, which gives off the idea of ‘race war’. The Nation of Islam is the pathway that many artists in the rap world take to learn about Islam. In this organization, many rappers are participants, going to the events by the organization as well as donating money. Islam has become hip hops’ official religion, entering the lives of many rap artists, most of who were non-Muslims. The reasoning as to why Islam has been so effective is because of the messages that it gives off of social justice, self-knowledge and community (Black and Bluec: Remembering Islam and Hip Hop 1). These messages are what many rap artists feel most connection to and want everyone else in the world to know about. To this day, the Islam religion has played an impacting role within rap artists in the United States within the three following ways: having rap artists convert to the religion, using the Islam teachings in their lyrics, and influencing the youth to become more aware of the Islam religion.<br/>\
");
//console.log(p2+"",p2.getArrayOfSentenceLengths())
//console.log(p2.documentation, p2.countMLADoc());
assert.equal(p2.sentences().length,11);
assert.equal(p2.getQuotations().length,3);
assert.equal(p2.size,1739);
//console.log("quotes ",p2.getQuotations());//,p2.getUserText());
p2.setTextToUserText();
assert.equal(p2.size,1556);
assert.equal(p2.countDoc(),3);
assert.ok([1,2,3,4].standard_deviation());
assert.equal([1,2,3,4].standard_deviation(),2.2360679774997898);

console.log(p2+"")
p3 = new paragraph('The conversion of the Islam religion had started all the way back to Malcom X, a man that many rap artists looked up to over the years. Malcom X was an activist of the Nation of Islam just as many rappers such as Ice Cube, Mos Def, Snoop Dogg, Loop, Eve and many more are. When it comes to the dedication of the Islam religion from the African American community, the most dedicated are Hip Hop and Rap singers. The way that many of the rap artists had learned of the Islam religion is through the Nation of Islam. The reasoning for this organization is “fighting and militant opposition to white racism and oppression of blacks” as mentioned in the article “Conversion to Islam among Rap and Hip Hop Artists, from Ice Cube to Snoop Dogg” (Conversion to Islam among Rap and Hip Hop Artists 1). For most rappers who have converted to becoming Muslims, they have strayed away from the violence that they once been involved with. One of these artists who have made a turn around and continues to change is Snoop Dogg. Snoop Dogg is known for his crimes and the usage of drugs. Now he is straightening up his life and trying to live a more conservative life. Snoop Dogg ended up converting his name to Snoop Lion because of his religious findings through Islam. Another artist who has changed his ways for the better is Loon, who had changed his name to an Islamic name, Amir Junaid (Conversion to Islam among Rap and Hip Hop Artists 1). Loon is a great example of a man who not only converted fully to Islam, but had showed the world within the music industry about Islam. Loon is a man is devoted to Allah, the known to be god in the Islam religion. Loon used to be a rap artists who worked in the Bad Boy Records Label Company and lived a life of “money and women” until he found his true calling into the Islamic world. Loon wanted to live a life that was of peace and eventually strayed away as a rapper to pursue his spiritually in a deeper sense (Furay 1). As stated in the article by The Islamic Monthly, “It is this pursuit for self-knowledge that has led many to convert to Islam, including hip hop artists” (Black and Bluec: Remembering Islam and Hip Hop 1). Rappers want to know of what is in them as individuals along with live a life beyond what is expected of the African Americans as being violent. To go beyond the conversion of rappers in the Islam world, there are even rappers such as Nas, who have not converted to a Muslim, but still use the some of the teachings in their music (Moussly 1). This shows that the religion does not have to be fully practiced but that the main ideas of it can still be preached.<br/>\
')
console.log(p3+"");

function sentence(text) {
	this.type = 'sentence';
	this.size = text.length;
	this.text = text;
	this.nouns = this.getMajorNouns();
}

data =[];

sentence.prototype.getMajorNouns = function() {
	nouns = [];
	wordpos.getNouns(this.text,function(result) {
		if (result) {
		console.log(result);
		this.nouns = result;
		//$('#callback_test').text(result);
		}
	});
	this.nouns = nouns;
}

p = new sentence('hello this is Tim The nouns are here.');
//
//p.getMajorNouns();
console.log(p)

console.log('data',data)

