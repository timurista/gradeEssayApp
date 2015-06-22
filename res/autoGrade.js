// 3 program approach

// helpers

// zombie headless testing
// var Browser = require("zombie");
// var assert = require("assert");

//import 

// var imported = document.createElement('script');
// imported.src = './demoText.js';
// document.head.appendChild(imported);


Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;

};

//range method
function range(start, count) {
	return Array.apply(0, Array(count))
		.map(function(element, index) {
			return index + start;
		});
}

// random choice
function randomChoice(arr) {
	return arr[Math.floor(arr.length * Math.random())];
}

//debug testing
function assert(computed, relationship, expected) {
	condition = eval(computed + relationship + expected);
	if (!condition) {
		throw "Assertion failed Computed: " + computed + " NOT " + relationship + " Expected: " + expected;
	}
}

//get array size
Object.size = function(obj) {
	var size = 0,
		key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

//more helpers

// grading functions

function stepGrade(stepValue, possibleScore, score) {
	grade = 1;
	s = score
	if (typeof s === 'undefined') s = 0;
	console.log(score / possibleScore, s)
	if (score / possibleScore >= 1) {
		grade = 1
	} else if (s <= 0 || possibleScore <= 0) return 0;
	else grade = stepValue * Math.ceil((s / possibleScore) * stepValue);
	return grade;
}

//buidling functions

function buildDictionaryOfFrequentWords(paragraph) {
	freqChart = [];
	if (!paragraph) return freqChart;
	words = paragraph.split(" ").clean("");
	// lowercase words
	for (var i = 0; i < words.length; i++) {
		words[i] = words[i].toLowerCase();
	};

	non_words = ['"', "'", "/", ".", ",", ";", "?", "!", "(", ")", "[", "]", "#", "%"];


	//remove non-words
	for (var i = 0; i < words.length; i++) {
		word = words[i];
		word.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "");
		word.replace(/[0-9]/g, "X");
	};

	articles = ['a', 'an', 'many', 'few', 'several',
		'couple', 'of', 'the', 'these', 'those',
		'much', 'some', 'all', 'most', 'and', 'in', 'to',
		'as', 'has'
	];


	//remove articles
	for (var i = 0; i < articles.length; i++) words.clean(articles[i]);



	for (var i = 0; i < words.length; i++) {
		word = words[i];
		word.replace('"', '');

		if (word in freqChart) {
			freqChart[word] += 1;
		} else {
			freqChart[word] = 1;
		}
	};
	//assert(freqChart.length,'>',1)
	return freqChart;
}

function sortAssociativeArray(aarray) {
	var tuples = [];

	for (var key in aarray) tuples.push([key, aarray[key]]);

	tuples.sort(function(a, b) {
		a = a[1];
		b = b[1];
		return a > b ? -1 : (a < b ? 1 : 0);
	});
	//console.log(tuples);

	for (var i = 0; i < tuples.length; i++) {
		var key = tuples[i][0];
		var value = tuples[i][1];

		// do something with key and value
	}
	return tuples;
}

function buildArrayOfMainParagraphs(essayArray) {
	lengthOfParagraph = 20;

	ps = []
	for (var i = 0; i < essayArray.length; i++) {
		paragraph = essayArray[i];
		//console.log(paragraph.length);
		wc = wordCount(paragraph);

		if (wc >= lengthOfParagraph) {
			ps.push(paragraph)
		}
	}
	return ps
}

function divideIntoParagraphs(essay) {
	//assert(essay.length,'>',0);
	returnEssay = essay.split('<br/>').clean("");
	if (returnEssay.length < 3) {
		returnEssay = []
		$('#essay').contents().each(function() {
			returnEssay.push($(this).text());
		});
	}
	return returnEssay

}

function wordCount(text) {
	return text.split(" ").length;
}

//function count words in paragraph
function arrayItemsInArray(arrayOfMatching, paragraph) {
	accumulatorMainIdea = [];
	for (var j = 0; j < arrayOfMatching.length; j++) {
		wordsToMatch = arrayOfMatching[j];
		for (var k = 0; k < wordsToMatch.length; k++) {
			word = wordsToMatch[k];

			if (paragraph) {
				paragraph.toLowerCase();
				if (paragraph.indexOf(word) > -1)
					accumulatorMainIdea.push([word, paragraph.indexOf(word)]);
			}
		};
		return accumulatorMainIdea;
	}
};
//ending function
function generateCheck(accumulator, good_message, bad_message) {
	if (accumulator.length >= 1) {
		console.log('yes');
		return [good_message, 1];
	} else {
		console.log('no');
		return [bad_message, 0];
	}
}

//grading functions
function gradeEssay(score, possibleScore, totalPoints) {
	// return percentScore;
	if (isNaN(score)) score = 0;
	//console.log("score",score,possibleScore,totalPoints,(score/possibleScore)*totalPoints)
	if (score / possibleScore > 1) {
		percentScore = 1
	} else percentScore = score / possibleScore;
	return Math.ceil(percentScore * totalPoints);
}

//
/** EACH CHECKING FUNCTION **/
//
// define Essay Class Methods

// check no first person (we, I)
Object.firstPersonUse = function(essay) {
	accumulator = [];
	first_person = [' i ', ' we ', ' me ', ' my ', ' us '];
	found = 0;
	grade = 1;

	for (var i = 0; i < first_person.length; i++) {
		text = essay.toLowerCase();
		if (text.indexOf(first_person[i]) < -1) found += 1;
	};
	allowedToFind = 3;
	if (found.length > allowedToFind) {
		grade -= .1 * found;
	}

	if (grade < .01) {
		grade = 0
	}

	accumulator.push([found])

	good_messages = ["Your essay does not have excessive use of the first person. ",
		"This essay is academic in tone and avoids common pitfalls such as the use of the first person. "
	];
	bad_messages = ["Your essay has excessive use of the first person 'I' 'we' avoid these in the future. ",
		"Avoid using the first person in academic writing. "
	];
	return generateCheck(accumulator, randomChoice(good_messages), randomChoice(bad_messages));
}

Object.mainIdea = function(essay) {
	console.log("checking main idea clearly shown...");
	// main idea to look for
	articles = ['the', 'this', 'these', 'those'];
	punctuation = [',', ':'];
	indicators = ['following']
	pArray = divideIntoParagraphs(essay);
	paragraphs = buildArrayOfMainParagraphs(pArray);

	//assert(paragraphs.length,'>=',2);
	arrayOfMatching = [articles, punctuation, indicators];
	firstParagraph = paragraphs[0];
	accumulatorMainIdea = arrayItemsInArray(arrayOfMatching, firstParagraph);

	//check if any article punctuation, etc are in accumulator
	//assert(accumulatorMainIdea.length,'>=',2);
	good_messages = ["The main idea is clearly shown. ", "You did a good job introducing the main idea. "];
	bad_messages = ["The main idea is not present. ", "Your main idea needs significant work. "];

	checkItem = [];
	checkItem.push(generateCheck(accumulatorMainIdea, randomChoice(good_messages), randomChoice(bad_messages)));
	// check relates to main idea
	checkItem.push(Object.firstPersonUse(essay));

	// average score for all categories with cumulative comments
	sum = 0;
	count = 0;
	messages = ""
	for (var i = 0; i < checkItem.length; i++) {
		messages += checkItem[i][0];
		sum += checkItem[i][1];
		count++;
	};
	if (count == 0) {
		avg = 0
	} else {
		avg = sum / count;
	}
	//console.log(messages,sum,avg,count)

	return [messages, avg]
}

// Organization
// check thesis contains major points
Object.thesisCheck = function(essay) {
	console.log("checking thesis contains major points...");
	accumulator = [];
	paragraphs = buildArrayOfMainParagraphs(divideIntoParagraphs(essay));
	firstParagraph = paragraphs[0];
	if (firstParagraph) {
		//console.log(firstParagraph)

		sentences = firstParagraph.split(".");

		// get thesis by getting last paragraph
		if (sentences[sentences.length - 1].length > 10) {
			thesis = sentences[sentences.length - 1];
		} else {
			thesis = sentences[sentences.length - 2]
		}

		if (thesis.length > 10) {
			// look for punctation
			commas = thesis.split(",").length - 1;
			useOfAnd = thesis.split("and").length - 1;
			console.log("useOFAnd,Commas", useOfAnd, commas);

			if ((commas + useOfAnd) / 3 >= 1.0) accumulator = [1];
		}
		console.log("grade", accumulator);
	}

	// generate messages
	good_messages = ["Your thesis contains major points of your essay. "];
	bad_messages = ["Your thesis does not contain major points or they are in the wrong place. "]
	return generateCheck(accumulator, randomChoice(good_messages), randomChoice(bad_messages));

}

Object.thesisCheck(demoText);

Object.transitions = function(essay) {
	//good_message = ()

	console.log("checking effective transitions...");
	numberOfTransitions = [];
	transition_words = ['therefore', 'furthermore', 'moreover', 'so', 'thus', 'however', 'but', 'and'];
	punctuation = [','];
	pArray = divideIntoParagraphs(essay);
	paragraphs = buildArrayOfMainParagraphs(pArray);
	arrayOfMatching = [transition_words, punctuation];
	accumulator = []

	for (var i = 1; i < paragraphs.length; i++) {
		introP = paragraphs[i].split(".")[0];
		accumulator.push(arrayItemsInArray(arrayOfMatching, introP));
	};

	good_messages = ["You do a good job with transitions between paragraphs. "];
	bad_messages = ["This essay lacks solid transitions between its paragraphs. "]

	checkItem = [];
	checkItem.push(generateCheck(accumulator, randomChoice(good_messages), randomChoice(bad_messages)));
	// check relates to main idea
	checkItem.push(Object.relatesMainIdea(essay));

	// average score for all categories with cumulative comments
	sum = 0;
	count = 0;
	messages = ""
	for (var i = 0; i < checkItem.length; i++) {
		messages += checkItem[i][0];
		sum += checkItem[i][1];
		count++;
	};
	if (count == 0) {
		avg = 0
	} else {
		avg = sum / count;
	}
	//console.log(messages,sum,avg,count)

	return [messages, avg]
}

Object.relatesMainIdea = function(essay) {
	message = 'each paragraph relates to the main idea'
	//find main idea
	console.log("checking " + message + "...");

	pArray = divideIntoParagraphs(essay);
	paragraphs = buildArrayOfMainParagraphs(pArray);
	firstParagraph = paragraphs[0];
	// build dict
	freqChart = buildDictionaryOfFrequentWords(firstParagraph);
	// sort dict
	sortedTuples = sortAssociativeArray(freqChart);
	// top 10 words
	topWords = sortedTuples.slice(0, 10);
	//console.log('top words',topWords);
	// See if any of these words show up in the other paragraphs
	accumulator = []
	paragraphsWithTopWords = []
	// start after first paragraph
	for (var i = 1; i < paragraphs.length; i++) {
		for (var j = 0; j < topWords.length; j++) {
			paragraph = paragraphs[i].toLowerCase();
			if (paragraph.indexOf(topWords[j][0]) > -1) {
				//accumulator.push(topWords[j][0]);
				if (i + 1 in paragraphsWithTopWords) {
					paragraphsWithTopWords[i + 1] += 1;
				} else {
					paragraphsWithTopWords[i + 1] = 1;
				}
			}
		};
	};
	// check that all paragraphs represented
	if (paragraphsWithTopWords.length == paragraphs.length + 1) accumulator.push(['relates to main idea', 1])
	paragraphsNotThere = ""
	for (var i = 0; i < paragraphs.length; i++) {
		if (i in paragraphsWithTopWords) {

		} else {
			paragraphsNotThere += i + " ";
		}
	};

	console.log('word spread in each paragraph', paragraphsWithTopWords);

	good_messages = ["Your essay does a good job relating each paragraph to the main idea. "];
	bad_messages = ["One or more paragraphs do not relate to the main idea. "]

	return generateCheck(accumulator, randomChoice(good_messages), randomChoice(bad_messages));

	//add score
}

//grammar mistakes
Object.mechanicsIssues = function(essay) {
	console.log('checking mechanics...');
	if (essay.length < 100) {
		return ["Essay not long enough to make a signficant grammar or spelling mistake. ", 0];
	}

	wc = wordCount(essay);
	errText = ""
	grammErrCount = $('.hiddenGrammarError').length;
	spellErrCount = $('.hiddenSpellError').length;
	errorsTotal = grammErrCount;
	score = 1;
	// round out score by 1/5 or .2 steps
	gradeSteps = (1 / 5)
	// 1 error for every 50 words
	allowedErrors = Math.ceil(wc * (1.0 / 150.0))
	if (errorsTotal <= allowedErrors) {
		score = 1
	}
	//round out score via steps	
	else score = gradeSteps * Math.ceil((allowedErrors / errorsTotal) / gradeSteps);

	spellErr = ""
	grammErr = ""

	if (spellErrCount > 10) {
		spellErr = "\nSpelling Errors \n===========\n There were some spelling errors\n"
		// $('.hiddenSpellError').each( function () {
		// 	spellErr+=$(this).text()+"\n"
		// });
	} else if (spellErrCount <= 10 && spellErrCount >= 5) {
		spellErr = "\nSpelling Errors \n===========\n There were a few mispelled words\n"
	}

	if (grammErrCount > 2)
		grammErr = "\nOther Grammar Errors \n===========\n There were some grammar issues\n"
	$('.hiddenGrammarError').each(function() {
		// declare where the error is
		errWord = $(this).text();
		idx = essay.indexOf(errWord);
		//determine start of sentence
		charsBack = 50;
		sentenceExceprt = essay.substring(idx - 50, idx) + "...";
		first_space = sentenceExceprt.indexOf(" ");
		sentenceExceprt = sentenceExceprt.substring(first_space + 1, sentenceExceprt.length);
		grammErr += 'In the sentence which reads: "' + sentenceExceprt +
			'" this phrase had grammatical issues: "' + errWord + '."\n';
	});


	errText += spellErr + grammErr.substring(0, 800) + "...\n" +
		"\nMechanics errors: " + grammErrCount +
		"\nAllowed errors: " + allowedErrors + "\n"
	//"\n\nGrammar Score :"+score

	return [errText, score];
}

Object.documentation = function(essay) {
	count = essay.split("(").length - 1;
	paragraphs = divideIntoParagraphs(essay);
	paragraphCount = buildArrayOfMainParagraphs(paragraphs).length;
	possible = paragraphCount * 2.0
	console.log("count", count, paragraphCount);
	if (count == 0 && possible == 0) score = 0;
	else score = count / possible;
	if (score >= 1) score = 1;
	console.log("score", score);
	message = ""
	if (score >= .666) {
		message += "Great work with documentation"
	} else if (score >= .333 && score < .666) {
		message += "Good documentation, but consider finding more sources next time"
	} else message += "Work on documentation your sources properly and cite everything you read or paraphrase"
	console.log("score", score);

	// deduct if not many sources



	return [message, score];
}
// Content
Object.requiredWords = function(essay) {
	wc = wordCount(essay);
	if (typeof wc === 'undefined') wc = 0;
	wordsRequired = 1500;
	grade = stepGrade(.2, wordsRequired, wc);
	console.log(grade, wc);
	message = ""
	if (grade >= 0.66) {
		message += "Good job, your content was very well done. Good insight. ";
	} else if (grade < 0.66 && grade > 0.33) {
		message += "Good, but your content can use some improvement for this assignment. ";
	} else if (grade <= 0.33) {
		message += "Your content is seriously lacking for this assignment. ";
	}
	console.log(grade);
	checkItem = [];
	// check word length
	checkItem.push([message, grade]);

	// check relates to thesis
	checkItem.push(Object.thesisCheck(essay));

	// average score for all categories with cumulative comments
	sum = 0;
	count = 0;
	messages = ""
	for (var i = 0; i < checkItem.length; i++) {
		messages += checkItem[i][0];
		sum += checkItem[i][1];
		count++;
	};
	if (count == 0) {
		avg = 0
	} else {
		avg = sum / count;
	}
	console.log("sum, avg, count", sum, avg, count)

	return [messages, avg]
}



// 0 load essay into text
essayText = $('#essay').text();
//console.log(essayText);

//testing loaded from demoText
demo = demoText;
essayText = demo;

// 1 assign minimal grade
function assign_minimal_grade(essay) {
	// figure out x things to look for

	score = 0;
	overallComments = "\nOverall\n========="

	// these check for 5 areas I grade in an essay
	checkedItems = [];

	// 1. organization transitions between paragraphs
	checkedItems.push(Object.transitions(essay));

	// 2. Content via word count
	//checkedItems.push(Object.requiredWords(essay));

	// 3. Mechanics via grammarly
	checkedItems.push(Object.mechanicsIssues(essay));

	// 4. Style via main idea clearly shown and each paragraph relates to main idea
	//checkedItems.push(Object.mainIdea(essay));

	// 5. Evidence via parenthesis search
	//checkedItems.push(Object.documentation(essay));

	// clean the essay
	checkedItems.clean("undefined");

	// score the essay
	for (var i = 0; i < checkedItems.length; i++) {
		score += checkedItems[i][1];
		console.log(score);
		overallComments += '\n' + checkedItems[i][0];
	};
	//remove clean function
	score -= 1;

	totalPoints = $('#defaultTotalGradeInput').val();
	possibleScore = checkedItems.length;
	pts = gradeEssay(score, possibleScore, totalPoints);
	//add to message
	updateGrade(checkedItems, pts);

	//optional return value
	//return [pts, overallComments];
}


//assign_minimal_grade(essayText);

$('#checkText').click(function() {
	assign_minimal_grade($('#essay').text())
	//scores = tupleScoredEssay[0]
	//comments = tupleScoredEssay[1]


});

function updateGrade(checkedItems) {
	total = 0
	overallpts = $('#defaultTotalGradeInput').val()
	commNum = $('#gradeCategories').find('.gradeOption');
	ptsPerCategory = Math.floor(overallpts / commNum.length);

	$('#gradeCategories').find('.gradeOption').each(function(index, value) {
		score = Math.ceil(ptsPerCategory * checkedItems[index][1])
		$(this).val(score);
		total += score;
		console.log("score for cat", checkedItems[index][1])

		comment = checkedItems[index][0] + "\n";
		category = $(this).attr('name');
		console.log("comment", comment);

		//append only if not already there
		if (arrayCommentsToEmail[category]) {
			if (arrayCommentsToEmail[category].indexOf(comment) < -1) {
				arrayCommentsToEmail[category] += comment;
			}
		} else {
			arrayCommentsToEmail[category] = comment
		}


	});
	$('#totalGrade').text("Grand Total: " + total);
	$('#gradePercent').text("Grade: " + Math.floor((total / $('#defaultTotalGradeInput').val()) * 100) + "%")
}

function addToComments(comments) {
	//arrayCommentsToEmail["overall"] = comments;
	console.log("comments", comments);
	//console.log(arrayCommentsToEmail["overall"] = comments)
}
// 3 decide if minimal grading or not
// if minimal then output grades/comments step 5
// if not minimal go to step 4

// 4 decide if better or worse
// 4.1 go through checklist
// identify paragraphs with potential problems
// offer suggestions

// 4 make comments and adjust grades
// offer user various areas to comment on
// present checkboxes to check with appropraite comments


// 4.2 if no comments
// offer praise using rubric 
// if strong, weak or average essay
// choose from array of comments and add summary comment

// 5 output comments in array format
// prompt user to copy comments and email them

// TESTS

//assert(Object.requiredWords("this is a recording of the best in tucson.")[1],"==",".2");