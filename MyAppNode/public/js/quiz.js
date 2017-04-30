// Run JS quiz to test the user's knowledge

// start quiz
(function() {

  // Click handler for the 'Start Over' button
  $('#score').on('click', function (e) {
    e.preventDefault();

    var correct = 0;
    var answers = [];
    for (var i = 0; i < 5; i++) {
      var select = $('input[name="q' + i + '"]:checked').val();
      if (select) {
        answers.push(select);
      }
    }
    console.log(answers);
    if (answers.length < 5) {
      alert("Please enter a selection for each question");
    } else {
      for (var j = 0; j < 5; j++) {
        if (answers[j] === local_results[j].toString()) {
          correct++;
        }
      }

      var promptstring = "You got " + correct + " out of 5 correct! Enter a name to save your score:"
      var data = {};
      data.name = prompt(promptstring);
      data.score = correct;
      if (data.name !== null) {
        $.ajax({
          type: "POST",
          url: "/quiz",
          data: data
        });
      }
      location.reload();
    }
  });

})();