//essayIDs
essayIDs = []

// helper to split into modules
	function addProofreader(id) {
		$(id).addProofreader();
	}
// add simple proofreader
//addProofreader("#essay");





	// store vals inside array
	// log all errors

	// function


	function chunk(str, chunkSize) {
		chunks = [];
	  	while (str) {
    	if (str.length < chunkSize) {
        	chunks.push(str);
        	break;
   		 }
   		else {
        	chunks.push(str.substr(0, chunkSize));
        	str = str.substr(chunkSize);
   		 }

		}
		return chunks;
		console.log(chunks)
	  }
	  

	  //ATD to check essay
	function check(id)
		 {

		    AtD.checkCrossAJAX(id, 
		    {
		    	
		       success : function(errorCount) 
		       {

		          if (errorCount == 0)
		          {
		          	//collect alerts into string
		          	console.log(id+' has no errors');
		          } else {
		          	console.log(id+ " has some errors");
		          }

		       },

		       error : function(reason)
		       {

		          alert(reason);
		       }
		    });
		}

	function createNewDivs(textArray) {
		$.each(textArray, function(index, text) {
			// create newID
			newId = id+index.toString();
			essayIDs.push(newId);
			//create jquery rep of newDiv
			newDiv = $(newId);
			newDiv.text(text);
			//console.log(newDiv);

			$('#essayTextArea').append("<p id='"+newId+"' class='essayElements' contentEditable=true>"+"P "+index+") "+text+"</p>");
			//$('#'+newId).addProofreader();

			// checkEachId
			//console.log(newId);
		});

	}
	// check ids
	function checkNewDivs(idArray) {
		
		for (var i = 0; i < essayIDs.length; i++) {
			//check(essayIDs[i]);

			
			//addProofreader('#'+essayIDs[i]);
			setTimeout(check(essayIDs[i]), 1000);
		};
		//check(essayIDs[7]);

	}



	// check the text
	 $("#checkText").click(function () {
	 	//check("essay");

	 	if ($("#essay").length>200) {

	 		// get text
	 		id="essayDiv";
	 		essayText = $("#essay").children().text(); //.replace(/\r?\n/g,'<br/>'); //convert newlines into <br> tags
	 		
	 		// break into chunks
	 		sizeParseable = 200
	 		console.log(essayText[0])
		 	textArray = essayText.split("<br/>");

		 	// remove empty strings
		 	textArray = textArray.filter(function(s){ return s.length>3 })


		 	console.log(textArray.length);

		 	// 
		 	$(this).parent().append("<div id='essayTextArea' class='essay'> </div>");

		 	createNewDivs(textArray,id);

		 	// check new divs
		 	//checkNewDivs(essayIDs);
	 		
		 	//$(this).parent().append("<div id='"+id+"' contentEditable=true>"+essayText+"</div>");
		 	//check(id);

		 	checkNewDivs(essayIDs);


		 	$("#essay").remove();

		}

	 	
	 });