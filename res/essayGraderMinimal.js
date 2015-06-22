// 3 program approach

// 0 load essay into text
// 	load from essay array


// 1 assign minimal grade
	// figure out x things to look for
	// these 10 are modular and can be swapped out
		// 1. main idea clearly shown
		// 2. transitions between paragraphs
		// 3. each paragraph relates to main idea
		// 4. varied vocabulary
		// 5. 0-2 spelling mistakes
		// 6. complete sentences
		// 7. sentence variety
		// 8. thesis contains major points
		// 9. no first person (we, I)
		// 10. OPTIONAL: supported with evidence?
	
	// 1.1 checklist x things looking for
		// if >ceil((2/3)*x) met then strong eg 10*(2/3) == 6.67, 7
		// if <ceil((2/3)*x) or >=ceil((1/3)*x) eg 10*(1/3) == 3.33, 4
		// if <ceil((1/3)*x) 

// save essays to a new array somewhere in here

// 2 sort essays by grade
	// put into 3 piles: strong, satisfactory, poor
	// present user with essay from pile
	// inform user which pile it is
	// inform user how many essays to go
	// give user option to send to another pile 
		// using simple select menu to change grade


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


