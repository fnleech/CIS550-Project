//Run dynamic JS quiz to test the user's knowledge

// start quiz
(function() {
  var questions = [{
    question: "Which country has the most number of gold medals in the 2012 Summer Olympics??",
    choices: ["Russia", "USA", "China", "Great Britain", "France"],
  }, {
    question: "What's the best height to win a gold medal in swimming if you're a guy?",
    choices: [190, 163, 183, 177, 185],
  }, {
    question: "Which Summer Olympics was most expensive per athlete",
    choices: ["Soviet Union", "London", "Barcelona", "Athens", "Beijing"],
  }, {
    question: "From 1960-2012, how many Summer Olympics did the USA take home the most number of gold medals?",
    choices: [14, 13, 10, 9, 11],
  }, {
    question: "How many gold medals has the smallest IOC Country (by population) won?",
    choices: [53, 11, 33, 62, 29],
  }];
  
  //keep track of the question number
  var questionCounter = 0;
  //make an array that has the user answers
  var selections = []; 
  //use jquery here
  //quiz object 
  var quiz = $('#quiz'); 
  
  // Show the first question
  displayNext();
  
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
    
    // Get rid of clicker
    if(quiz.is(':animated')) {        
      return false;
    }
    choose();
    
    // User has to make a selection, can't skip
     if (isNaN(selections[questionCounter])) {
      alert('Pick an answer');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });

    // Click handler for the 'Start Over' button
  $('#score').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }

    var data = {};
    data.name = prompt("Enter your name:");
    data.score = -1;
    if (data.name) {
      data.score = $('p[id="question"]').attr("score");
    }
    if (data.score !== -1) {
      $.ajax({
        type: "POST",
        url: "/quiz",
        data: data
      });
    }

    $('#score').hide();
  });
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });
  
  // Activate and animates buttons when user hovers on it 
  $('.button').on('mouseenter', function () {
    $(this).addClass('active');
  });
  $('.button').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);
    
    var question = $('<p>').append(questions[index].question);
    qElement.append(question);
    
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    
    return qElement;
  }
  
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }
  
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
    $('#start').hide();
    $('#score').hide();
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#score').show();
        $('#start').show();
      }
    });
  }
 // Calculate the score and display score
  function displayScore() {
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (questions[i].choices[selections[i]] === local_results[i]) {
        numCorrect++;
      }
    }

    var score = $('<p>',{id: 'question'});
    score.attr('score', numCorrect);

    // Now return user score
    score.append('You got ' + numCorrect + ' out of ' +
                 questions.length + ' correct!');
    

    return score;
  } 

})();