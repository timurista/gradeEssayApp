// helpers
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

//debug testing
function assert(computed,relationship,expected) {
	condition = eval(computed+relationship+expected);
    if (!condition) {
        throw "Assertion failed Computed: "+computed+" NOT "+relationship+" Expected: "+expected;
    }
}


checkingFunctions = {
	"main idea clearly shown": [function(){}],
	"transitions between paragraphs":[function(){}],
	"each paragraph relates to main idea":[function(){}],
	"varied vocabulary": [function(){}],
	"0-2 spelling mistakes": [function(){}],
	"complete sentences": [function(){}],
	"sentence variety": [function(){}],
	"thesis contains major points": [function(){}],
	"no first person (we, I)": [function(){}],
	"supported with evidence?":[function(){}]
}

function mainIdea(essay) {
	console.log("checking main idea clearly shown...");
	// main idea to look for
	articles = ['the','this','these','those'];
	punctuation = [',',':'];
	indicators = ['following']
	paragraphs = divideIntoParagraphs(essay);
	assert(paragraphs.length,'>=',1);

}

function buildDictionaryOfFrequentWords(paragraph) {

}

function divideIntoParagraphs(essay) {
	return essay.split('\n').split('<br/>').clean("");
}