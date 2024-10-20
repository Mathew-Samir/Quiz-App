
// JavaScript function to start the quiz based on subject and level
function startQuiz(subject, level) {
    // Display a confirmation message before starting the quiz
    const confirmation = confirm(`Are you sure you want to start the ${subject} quiz at the ${level} level?`);
    
    // If the user clicks "OK", redirect to the specific HTML page
    if (confirmation) {
        window.location.href = `${subject}-${level}.html`;
    }
}

