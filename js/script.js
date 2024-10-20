const quizApp = (() => {
    const state = {
        currentQuestionIndex: 0,
        score: 0,
        timer: 120, // 2 minutes for the quiz
        draftTimer: 60,
        draftedQuestions: [],
        draftScores: [],
        currentQuestion: null,
        timeOver: false,
        quizQuestions: [],
        draftTimeOver: false, // Track draft time
    };

    let timerInterval; // For the main quiz timer
    let draftTimerInterval; // For the draft timer

    // Fetch questions from external JSON file
    const fetchQuestions = async (type) => {
        try {
            const response = await fetch('./json/questions.json');
            const data = await response.json();

            // Filter questions based on the type
            //##########<< Chemistry >>###########
            if (type === 'easyQuestionsChemistry') {
                state.quizQuestions = shuffleQuestions(data.easyQuestionsChemistry);
            } else if (type === 'intermediateQuestionsChemistry') {
                state.quizQuestions = shuffleQuestions(data.intermediateQuestionsChemistry);
            } else if (type === 'difficultQuestionsChemistry') {
                state.quizQuestions = shuffleQuestions(data.difficultQuestionsChemistry);

            //##########<< Physics >>###########
            } else if (type === 'easyQuestionsPhysics') {
                state.quizQuestions = shuffleQuestions(data.easyQuestionsPhysics);
            } else if (type === 'intermediateQuestionsPhysics') {
                state.quizQuestions = shuffleQuestions(data.intermediateQuestionsPhysics);
            } else if (type === 'difficultQuestionsPhysics') {
                state.quizQuestions = shuffleQuestions(data.difficultQuestionsPhysics);

            //##########<< Math >>###########
            } else if (type === 'easyQuestionsMath') {
                state.quizQuestions = shuffleQuestions(data.easyQuestionsMath);
            } else if (type === 'intermediateQuestionsMath') {
                state.quizQuestions = shuffleQuestions(data.intermediateQuestionsMath);
            } else if (type === 'difficultQuestionsMath') {
                state.quizQuestions = shuffleQuestions(data.difficultQuestionsMath);
            }

            startQuiz();
        } catch (error) {
            console.error("Failed to load questions:", error);
        }
    };

    const shuffleQuestions = (questions) => questions.sort(() => Math.random() - 0.5);

    const startQuiz = () => {
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.timer = 120;
        state.draftedQuestions = [];
        state.draftScores = [];
        state.timeOver = false;
        state.draftTimeOver = false; // Reset draft time over flag
        displayNextQuestion();
        startTimer();
    };

    const startTimer = () => {
        // Clear any existing timer
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        timerInterval = setInterval(() => {
            if (state.timer <= 0) {
                clearInterval(timerInterval);
                endQuiz("Time is Over");
                return;
            }
            if (state.timeOver) {
                clearInterval(timerInterval);
                return;
            }
            state.timer -= 1;  // Decrement the timer by 1
            document.getElementById('time').innerText = state.timer; // Update the displayed time
        }, 1000);  // 1000 milliseconds interval
    };

    const startDraftTimer = () => {
        if (draftTimerInterval) {
            clearInterval(draftTimerInterval);
        }

        draftTimerInterval = setInterval(() => {
            if (state.draftTimer <= 0) {
                clearInterval(draftTimerInterval);
                state.draftTimeOver = true; // Set flag for draft time over
                alert("Draft time is over!");
                disableDraftOptions(); // Disable draft options when time is over
                return;
            }
            state.draftTimer -= 1; // Decrement the draft timer
            document.getElementById('draft-time').innerText = state.draftTimer; // Update displayed draft time
        }, 1000);
    };

    const disableDraftOptions = () => {
        const draftAnswers = document.querySelectorAll('.draft-question input[type="radio"]');
        draftAnswers.forEach(answer => {
            answer.disabled = true; // Disable all radio buttons
        });
    };

    const displayNextQuestion = () => {
        const questionContainer = document.getElementById('question-container');
        const questionData = state.quizQuestions[state.currentQuestionIndex];
        state.currentQuestion = questionData;

        questionContainer.innerHTML = `
            <p>Question ${state.currentQuestionIndex + 1}: ${questionData.question}</p>
            <ul style="list-style-type: none;">
                ${questionData.options.map((option, index) => `<li><label><input type="radio" name="answer" value="${index}"> ${option}</label></li>`).join('')}
            </ul>
        `;
    };

    const submitAnswer = () => {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        
        if (!selectedAnswer) {
            alert("Please select an answer before submitting.");
            return; // Stop further execution if no answer is selected
        }

        const questionData = state.currentQuestion;
        const isCorrect = parseInt(selectedAnswer.value) === questionData.answer;
        const points = 1; // Now all questions are easy, assign 1 point

        if (isCorrect) {
            state.score += points;
        }

        // Move to the next question if an answer was selected
        nextQuestion();
    };

    const draftAnswer = () => {
        // Add the current question to draftedQuestions if not already drafted
        if (!state.draftedQuestions.includes(state.currentQuestion)) {
            state.draftedQuestions.push(state.currentQuestion);
        }
        // Move to the next question
        nextQuestion();
    };

    const nextQuestion = () => {
        state.currentQuestionIndex += 1;

        if (state.currentQuestionIndex < state.quizQuestions.length) {
            displayNextQuestion();
        } else {
            endQuiz(); // No more questions
        }
    };

    const evaluateScore = (score) => {
        if (score >= 0 && score <= 6) {
            return "Poor";
        } else if (score >= 7 && score <= 14) {
            return "Good";
        } else if (score >= 15 && score <= 20) {
            return "Very Good";
        }
        return "Invalid score"; // Just in case the score is out of expected range
    };

    const endQuiz = (message = "") => {
        clearInterval(timerInterval);
        clearInterval(draftTimerInterval); // Clear draft timer

        const resultContainer = document.getElementById('result-container');
        resultContainer.classList.remove('hidden');
        const evaluation = evaluateScore(state.score); // Get evaluation based on score
        document.getElementById('result-text').innerText = message ? message : `Your score: ${state.score}  Evaluation: ${evaluation}`;
        document.getElementById('draft-container').classList.add('hidden'); // Hide draft container on quiz end
    };

    const viewDraftedQuestions = () => {
        if (state.draftedQuestions.length === 0) {
            alert("No drafted questions to answer.");
            return;
        }

        const draftContainer = document.getElementById('draft-container');
        const draftQuestionsContainer = document.getElementById('draft-questions-container');
        const resultContainer = document.getElementById('result-container');
        resultContainer.classList.add('hidden');

        draftQuestionsContainer.innerHTML = state.draftedQuestions.map((question, index) => `
            <div class="draft-question">
                <p>Drafted Question ${index + 1}: ${question.question}</p>
                <ul style="list-style-type: none;"> 
                    ${question.options.map((option, optIndex) => `<li><label><input type="radio" name="draft-answer-${index}" value="${optIndex}"> ${option}</label></li>`).join('')}
                </ul>
            </div>
        `).join('');

        // Show the draft timer at the top of the draft container
        draftQuestionsContainer.innerHTML = `<div>Draft Time Left: <span id="draft-time">${state.draftTimer}</span>s</div>` + draftQuestionsContainer.innerHTML;

        // Change buttons to submit drafts
        draftQuestionsContainer.innerHTML += `<button id="submit-drafts">Submit Drafts</button>`;

        draftContainer.classList.remove('hidden');

        // Start the draft timer
        startDraftTimer();

        // Attach event listener for submitting drafts
        document.getElementById('submit-drafts').addEventListener('click', submitDrafts);
    };

    const submitDrafts = () => {
        const draftQuestions = document.querySelectorAll('.draft-question');

        draftQuestions.forEach((draftQuestion, index) => {
            const selectedAnswer = draftQuestion.querySelector(`input[name="draft-answer-${index}"]:checked`);
            const questionData = state.draftedQuestions[index];
            const isCorrect = selectedAnswer && parseInt(selectedAnswer.value) === questionData.answer;
            const points = isCorrect ? 1 : 0; // Assign 1 point for correct draft answers
            
            state.draftScores.push(points); // Store the score for each draft
            state.score += points; // Update total score
        });

        const draftContainer = document.getElementById('draft-container');
        draftContainer.classList.add('hidden');

        // Clear drafted questions after submission
        state.draftedQuestions = [];

        // Show final results
        endQuiz();
    };

    const attachEventListeners = () => {
        document.getElementById('submit-answer').addEventListener('click', submitAnswer);
        document.getElementById('draft-answer').addEventListener('click', draftAnswer);
        document.getElementById('view-drafts').addEventListener('click', viewDraftedQuestions);
        document.getElementById('finish-drafts').addEventListener('click', () => {
            // Optional: Handle if needed
            // Currently, drafts are handled via 'Submit Drafts' button
        });
    };

    return {
        init: (type) => {
            attachEventListeners();
            fetchQuestions(type);  // Pass either 'easy', 'intermediate', or 'difficult' to load corresponding questions
        }
    };
})();

// After completing questions  [button [try again with random question] - end the app [login app again]]
function tryAgain() {
    window.location.href = `index.html`;
}

window.onload = quizApp.init;
