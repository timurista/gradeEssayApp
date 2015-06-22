// Load a 2-dim Array of comments
var COMMENTS = Comments;
//Setting Up Comments, kinds of comments are in first field
var setOfComments = [];
for (var i = 0; i < COMMENTS.length; i++) {
currentComment = COMMENTS[i][0];
if (setOfComments.indexOf(currentComment)==-1) {
	setOfComments.push(currentComment);
};
};
var arrayCommentsToEmail = [];
var arrayCCboxes = [];
var currentCategory = arrayCommentsToEmail[0];
var arrayCommentOptions = {};

//grades
var defaultTotalGrade = parseInt($("#defaultTotalGradeInput").val());
var defaultGrade= Math.floor(defaultTotalGrade/(setOfComments.length-1));
var defaultAdjustGrade = Math.ceil(defaultGrade*.1);

function reset() {
	//comments
	setOfComments = [];
	for (var i = 0; i < COMMENTS.length; i++) {
		currentComment = COMMENTS[i][0];
		if (setOfComments.indexOf(currentComment)==-1) {
			if (currentComment.length>15) {
				setOfComments.push(currentComment.substring(0,15)+"...");
			} else {
			setOfComments.push(currentComment);
			}
		};
	};
	//new Array from set of comments
	arrayCommentsToEmail = [];
	arrayCCboxes = [];
	arrayCommentOptions = {};

	$.each(setOfComments, function(index,value) {
		arrayCommentsToEmail.push({
			value:""});
		arrayCCboxes.push({
			value:""});
	});
	currentCategory = arrayCommentsToEmail[0];
	//emtpy eval Categories
	$('#evalCategories').empty();

	//adding options
	$.each(setOfComments, function (index, value) {
		$('#evalCategories').append($('<option>', { 
		    value: value,
		    text : value 
		}));
	});

	//total grade defaults
	defaultTotalGrade = parseInt($("#defaultTotalGradeInput").val());
	defaultGrade= Math.floor(defaultTotalGrade/(setOfComments.length-1));
	defaultAdjustGrade = Math.ceil(defaultGrade*.1);

	//update default grade

	updateTotalDefaultGrade();
	changeTotalGrade();

	//remove checked checkboxes
	$('input:checked').each(function () {
		$(this).prop("checked",false);
	});

	$('.checkBoxOptions').empty();

}

reset();

function updateTotalDefaultGrade() {
	defaultTotalGrade = parseInt($("#defaultTotalGradeInput").val());
	defaultGrade= Math.floor(defaultTotalGrade/(setOfComments.length-1));
	defaultAdjustGrade = Math.ceil(defaultGrade*.1);
	$(".gradeOption").each(function() {
		$(this).val(defaultGrade);
	});
}

function changeDefaultGradeTo(number) {
	defaultGrade = number;
	defaultAdjustGrade = Math.ceil(defaultGrade*.1);
}

//adding grading categories
$.each(setOfComments, function (index, value) {
	if (value !== "Praise") {
		$('#gradeCategories').append('<div>'+value+': <input class="gradeOption" type="number" value="'+defaultGrade+
			'" style="width: 2.5em;" name="'+value+'"/></div>');
	}
});
$('#gradeCategories').append('<div id="totalGrade">Grand Total: '+(setOfComments.length-1)*defaultGrade+"/"+$("#defaultTotalGradeInput").val()+'</div>');


var example = "";
if(!window.Kolich){
  Kolich = {};
}

Kolich.Selector = {};
Kolich.Selector.getSelected = function(){
  var t = '';
  if(window.getSelection){
    t = window.getSelection();
  }else if(document.getSelection){
    t = document.getSelection();
  }else if(document.selection){
    t = document.selection.createRange().text;
  }
  return t;
}

Kolich.Selector.mouseup = function(){
  var st = Kolich.Selector.getSelected();
  if(st!=''){
    example = st;
  }
}
//setting up document
$(document).ready(function(){
	$(document).bind("mouseup", Kolich.Selector.mouseup);
});

//helper functons
function changeTotalGrade() {
	var total = 0;
	$(".gradeOption").each(function() {
		total+=parseInt(this.value);
	});
	ptsPossible = $("#defaultTotalGradeInput").val();
	percent = Math.floor((total/ptsPossible)*100);
	$("#totalGrade").text("Grand Total: "+total+"/"+ptsPossible+", "+percent+" percent");
	// change running percent at top
	$("#gradePercent").text("Grade: "+percent+" %");

}
function copyToClipboard(text) {
  	window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

//detect you found it
function itExists(name) {
	return ($(name).length>0) ? "it exists" : "it doens't exist";
}

//check all ccboxes
function checkAllSavedCheckboxes() {
	if (arrayCCboxes[currentCategory] &&arrayCCboxes[currentCategory].length) {
		$.each(arrayCCboxes[currentCategory],function(index,value) {
			$('input[name="'+value+'"]').prop('checked', true);
		});
	}
}

function addToCurrentCategory(comment) {
	arrayCommentsToEmail[currentCategory] = arrayCommentsToEmail[currentCategory]+comment;
}
function removeFromCurrentCategory(comment) {
	i = arrayCommentsToEmail[currentCategory];
	if (i.indexOf(comment)>-1) {
		arrayCommentsToEmail[currentCategory] = i.replace(comment,"");
	}
}

function saveCheckedToArray() {
	var message = "";
	var tempID = [];
	var ex = "";
	//before you append, get checked boxes then save to array
	$('input:checked').each(function () {
		//Get ID of closest div
       var thisID = (this.checked ? $(this).attr("id") : "");
       // Get the selected options from nearest div by checkbox
       var selected = (this.checked ? $(this).closest("div").find("option:selected").val() : "");
       //Get the full comment using arrayComment Dictionary
       var fullComment = arrayCommentOptions[selected];
       ex = (this.checked ? $(this).closest("div").find("input[name='example']").val() : "");
       if (typeof ex==="undefined") {ex="";}
       message+=fullComment+" "+ex;
       tempID.push(thisID);
  	});
  	arrayCCboxes[currentCategory]=tempID;

  	// Check that #otherComments not blank
  	comments = $('#otherComments').val();

  	if (typeof comments != "undefined" && typeof currentCategory !='undefined') {
  		message+=comments;
  		console.log(message)
  		if (arrayCommentsToEmail[currentCategory]) {
	  		arrayCommentsToEmail[currentCategory]+=message;
	  	
	  } else {
	  	arrayCommentsToEmail[currentCategory]=message;
	  }
	  console.log("sending comments",arrayCommentsToEmail[currentCategory]);
	}
}

//if the user changes categories to grade
$("#evalCategories").change(function() {
	//save to Array
	saveCheckedToArray();
	currentCategory = $("#evalCategories").val();
	var types = [];

  	//empty and reset
	$(".checkBoxOptions").empty();

	//first add the types to each cateogry
	$.each(COMMENTS, function(index,category) {
		var type = category[1]; 
		if (types.indexOf(type)==-1 && category[0]===currentCategory) {
			types.push(type);
			$(".checkBoxOptions").append('<div id="'+type+'"><h2>'+type+'</h2></div>');
		}
	});

	//set up the comments after user changes category
	arrayCommentOptions = {}
	$.each(COMMENTS, function(index,category) {

		if (category[0]===currentCategory) {
			var type = category[1];
			var kind = category[2];
			var comments = category.slice(3,-1);
			var htmlString = "";
			var firstComment = comments[0].substring(0,25)+"...";

			// set dictionary of current values
			
			$.each(comments, function(index,value) {
				key = value.substring(0,25)+'...';
				arrayCommentOptions[key] = value;
			});

			htmlString += '<div id="new'+kind+'"><input type="checkbox" id="'+kind+'Checkbox" name="'+kind+'Checkbox" class="checkbox">'+kind;
			htmlString+='<select width="10" style="width: 10em" id="'+kind+'options">';
			// gets each comment as option from list
			$.each(comments, function(index,value) {
				keyString = value.substring(0,25)+"...";
				htmlString+='<option width="5" style="width: 5em">'+keyString+"</option>";
			});
			htmlString+='</select>'
			htmlString+='<button type="button" class="nextExample">Show Full Comment</button>';
			htmlString+='<button type="button" class="addExamples">Add Example</button>';

			$fullComment = $('<div class="fullComment">'+arrayCommentOptions[firstComment]+'</div>');



			$("div[id='"+type+"']").append(htmlString).append($fullComment.hide()).append('</div>');

			
		}
		
	});
	//recall checked boxes
	checkAllSavedCheckboxes();

	//dealing with examples
	$(".addExamples").click( function() {
		type = $(this).parent().closest("div").attr("id").substring(3);
		var $example = $('<div class="example"></div>');
		var string = type+" example: '"+example+"...' ";
		//TODO handle this so it shows up in div, NOT select options
		// $example.append('<div><p>'+string+'</p></div>');

		$example.append('<input class="exampleError" type="text" name="example" value="'+string+'"/><input type="button" class="removebtn" value="." id="removebtn">')
		$(this).parent().append($example);
		
		console.log(string);
	});

	//append the checkbox
	$(".checkBoxOptions").append('<h2>Add Other Comments</h2><textarea class="moreComments" id="otherComments" value=" " />');
});



$(document).on("click", ".removebtn", function(){
   $(this).parent().remove();
});

//make changes when the checkbox is changed
$(document).on("change", ".checkbox", function(){
	if($(this).is(":checked")) // "this" refers to the element that fired the event
    {
    	$('input[name="'+currentCategory+'"]').val($('input[name="'+currentCategory+'"]').val()-defaultAdjustGrade);
        console.log("checking box");

    }

    else if($('input[name="'+currentCategory+'"]').val()<defaultGrade) {
    	$('input[name="'+currentCategory+'"]').val(parseInt($('input[name="'+currentCategory+'"]').val())+defaultAdjustGrade);
    	console.log("unchekced");
    }
    changeTotalGrade();

});
function generateCommentText(delimiter) {
	saveCheckedToArray();
	console.log(arrayCommentsToEmail);
	var text = "Comments on your essay,"+delimiter+"=============="+delimiter+delimiter;
	//iterate over keys in array
	for(key in arrayCommentsToEmail) {
	    if (arrayCommentsToEmail.hasOwnProperty(key) && arrayCommentsToEmail[key].length>9) {
	    	if (typeof arrayCommentsToEmail[key] !='undefined') {
		        console.log (key, arrayCommentsToEmail[key]);
				text+=key+": "+delimiter+arrayCommentsToEmail[key];
				text+=delimiter+delimiter;
			}
			else {}
	    }
	}

	text+=delimiter+"=============="+delimiter+"Overall Grade"+delimiter+"=============="+delimiter+delimiter;
	$(".gradeOption").each(function() {
		console.log($(this).closest("div").text());
		text+=$(this).closest("div").text()+parseInt(this.value)+delimiter;
	});
	text+=$("#totalGrade").text();

	return text;
}
//copy To clipboard
$(document).on("click", "#copyToClipboard", function(){
	var text = generateCommentText("\n");
	//copyToClipboard(text);
	// sent to new window
	w = window.open();
	w.document.title = "Graded Comments"
	w.document.writeln("<pre>"+text+"</pre>");
	
	
});

//sendEmail
$(":submit").click(function () {
	charMessageLimit=1500;
	var message = generateCommentText("\n");
	message = encodeURIComponent(message);
	if (message.length>charMessageLimit) {message=message.substring(0,charMessageLimit-40)+"... Copy and Paste. MESSAGE TRUNCATED";}
	var email = $("#email").val();
	var subject = $("#essayTitle").val();
	window.location.href = "mailto:"+email+"?subject="+subject+"&body="+message;
});


//detecting and Changing Grades when user enters value
$(document).on("change", ".gradeOption", changeTotalGrade);

//change when user changes total grade
$(document).on("change", "#defaultTotalGradeInput", function() {
	updateTotalDefaultGrade();
	changeTotalGrade();
});

//reseting categories
$('#reset').click( function() {
	reset();
});

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}


//handle csv
$("#csvFile").change(function(e) {
	var ext = $("input#csvFile").val().split(".").pop().toLowerCase();

	if($.inArray(ext, ["csv"]) == -1) {
		alert('Upload CSV');
		return false;
	}
    
	if (e.target.files != undefined) {
	var reader = new FileReader();
	reader.onload = function(e) {
		
		var rows = e.target.result.split("\n");
		var allData = rows.map(function (row) { return row.split("\t"); });

		//error if the data length is not at least 3 for first val
		if (allData[0].length>1) {

			COMMENTS =allData;
		    reset();
		}
		else {
			alert("your array is too short, needs to have min 3 cols");
			console.log(allData[0].length);
			}
		};
	reader.readAsText(e.target.files.item(0));
	}
	return false;
});

//change the option if checked
$(document).on('click', '.nextExample', function() {
	selected = $(this).prev().val();
	$(this).parent().next().text(arrayCommentOptions[selected]).toggle();
});
//option change if user changes select


