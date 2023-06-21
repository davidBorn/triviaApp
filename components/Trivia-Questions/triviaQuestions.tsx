import { count } from "console";
import React, { useState, useEffect } from "react";
import { start } from "repl";

export default function triviaQuestionSelector() {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [score, setScore] = useState(0);
    let [answerSubmitted, setAnswerSubmitted] = useState(false);
    let [scoreBoard, setScoreBoard] = useState(false);
    let [disabledButton, setDisabledButton] = useState("");
    let [countdown, setCountdown] = useState(15);
    let [answerSelected, setAnswerSelected] = useState(true);
    const [allAnswers, setAllAnswers] = useState<String[]>([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const select = document.querySelector("select") as HTMLSelectElement;
        const value = select.value;

        setLoading(true);

        fetch(`https://opentdb.com/api.php?amount=${value}`)
            .then((res) => res.json())
            .then((data) => {
                if (loading !== true) {
                    setQuestions(data.results);
                    // remove html entities (example: '&quot;' etc) from the questions
                    data.results = data.results.map((question) => {
                        const parser = new DOMParser();
                        const decodedString = parser.parseFromString(
                            `<!doctype html><body>${question.question}`,
                            "text/html"
                        ).body.textContent;
                        question.question = decodedString;
                        return question;
                    });
                    setQuestionNumber(1);
                    shuffleAnswers(data.results);
                    setCountdown(15);
                    startTimer();
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    };

    // Function shuffles the answers
    const shuffleAnswers = (data) => {
        // combine correct answer and correct answer array
        let answers = [
            ...data[questionNumber].incorrect_answers,
            data[questionNumber].correct_answer,
        ];
        // remove html entities (example: '&quot;' etc) from the answers
        answers = answers.map((answer) => {
            const parser = new DOMParser();
            const decodedString = parser.parseFromString(
                `<!doctype html><body>${answer}`,
                "text/html"
            ).body.textContent;
            return decodedString;
        });
        // shuffle the answers
        console.log(answers);
        answers = answers.sort(() => Math.random() - 0.5);
        // set the answers
        setAllAnswers(answers);
        console.log(answers);
        console.log(allAnswers);
        console.log(questionNumber);
    };

    // Function selects the answer
    const selectAnswer = (e) => {
        e.preventDefault();
        document.querySelectorAll(".answer-button button").forEach((button) => {
            button.classList.remove("active");
        });
        const answer = e.target as HTMLButtonElement;
        answer.classList.add("active");
    };

    // checks to see if the selected answer is correct or not
    const checkQuestion = () => {
        const answer = document.querySelector(
            "button.active"
        ) as HTMLButtonElement;
        if (answer === null) {
            setAnswerSelected(false);
            return;
        }
        if (answer.innerHTML === questions[questionNumber - 1].correct_answer) {
            document
                .querySelector(".correct-animation")
                .classList.add("active");
            setScore(score + 100 + countdown * 10);
            // if the countdown is greater than 0 and the answer is correct, add 10 points per second left to the score
            setAnswerSelected(true);
            setAnswerSubmitted(true);
            setDisabledButton("disabled");
        } else if (
            answer.innerHTML !== questions[questionNumber - 1].correct_answer
        ) {
            document
                .querySelector(".incorrect-animation")
                .classList.add("active");
            setAnswerSelected(true);
            setScore(score + 0);
            setAnswerSubmitted(true);
            setDisabledButton("disabled");
        }
    };

    // Function starts the timer, if the answer is submitted, the timer stops

    const startTimer = () => {
        let timer = setInterval(() => {
            setCountdown((countdown) => {
                // if the countdown is 0, clear the interval
                // if the answer is submitted, clear the interval
                document
                    .querySelector(".check_answer_button")
                    .addEventListener("click", () => {
                        clearInterval(timer);
                        return countdown;
                    });
                if (countdown === 0) {
                    clearInterval(timer);
                    return 0;
                } else {
                    return countdown - 1;
                }
            });
        }, 1000);
    };

    // loads the next question
    const loadNextQuestion = (e) => {
        e.preventDefault();
        if (
            document
                .querySelector(".correct-animation")
                .classList.contains("active")
        ) {
            document
                .querySelectorAll(".answer-button button")
                .forEach((button) => {
                    button.classList.remove("active");
                });
            document
                .querySelector(".correct-animation")
                .classList.remove("active");
            if (questionNumber !== questions.length) {
                setQuestionNumber(questionNumber + 1);
                shuffleAnswers(questions);
                startTimer();
                setCountdown(15);
                console.log("question-number: " + questionNumber);
                console.log("questions-length:  " + questions.length);
            } else {
                setScoreBoard(true);
            }
            setAnswerSubmitted(false);
            setDisabledButton("");
        } else if (
            document
                .querySelector(".incorrect-animation")
                .classList.contains("active")
        ) {
            document
                .querySelectorAll(".answer-button button")
                .forEach((button) => {
                    button.classList.remove("active");
                });
            document
                .querySelector(".incorrect-animation")
                .classList.remove("active");
            if (questionNumber !== questions.length) {
                setQuestionNumber(questionNumber + 1);
                shuffleAnswers(questions);
                startTimer();
                setCountdown(15);
                console.log("question-number: " + questionNumber);
                console.log("questions-length:  " + questions.length);
            } else {
                setScoreBoard(true);
            }
            setAnswerSubmitted(false);
            setDisabledButton("");
        }
    };

    if (loading) {
        return <div className="loader"></div>;
    }
    if (!loading && questions.length > 0 && scoreBoard === false) {
        return (
            <div>
                {/* Displays Question with question number */}
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-row items-center justify-center timer">
                        {countdown}
                    </div>
                    <h1 className="my-[20px] text-center">
                        Question {questionNumber}
                    </h1>
                    <p className="text-center mb-[10px]">
                        {questions[questionNumber - 1].question}
                    </p>
                    {/* Alert text if no answer is selected */}
                    {answerSelected ? null : (
                        <p className="text-red-500 text-center mb-[10px]">
                            Please select an answer
                        </p>
                    )}

                    <ul className="flex flex-row items-center flex-wrap gap-[15px] mt-[24px]">
                        {allAnswers.map((answer, index) => {
                            return (
                                <li key={index} className="answer-button">
                                    <button
                                        className="w-full text-center"
                                        onClick={selectAnswer}
                                    >
                                        {answer}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="mt-[24px] flex justify-center">
                        <button
                            className={`check_answer_button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${disabledButton}`}
                            onClick={checkQuestion}
                            disabled={answerSubmitted}
                        >
                            Submit
                        </button>
                    </div>
                    <div
                        className={`correct-animation text-lg relative z-10 transition duration-400 ease-in-out text-green-500/0 invisible px-[40px] py-[60px] mt-[30px] bg-slate-200/50 hidden`}
                    >
                        <p>Correct!</p>
                        <p>Your Score: {score}</p>
                        <button className="" onClick={loadNextQuestion}>
                            Next Question
                        </button>
                    </div>
                    <div className="incorrect-animation text-lg relative z-10 text-red-500/0 transition duration-400 ease-in-out invisible px-[40px] py-[60px] mt-[30px] bg-slate-200/50 hidden">
                        <p>
                            Incorrect!<br></br>The correct answer is:{" "}
                            {questions[questionNumber - 1].correct_answer}
                        </p>
                        <p>Your Score: {score}</p>
                        <button className="" onClick={loadNextQuestion}>
                            Next Question
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    // if the question number matches the amount of questions, display the score and a button to restart the game
    else if (scoreBoard) {
        return (
            <div>
                <h1 className="my-[20px] text-center">Trivia Application</h1>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-center mb-[10px]">
                        Your score is {score}
                    </p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            setQuestions([]);
                            setScoreBoard(false);
                            setScore(0);
                            // refresh the page
                            window.location.reload();
                        }}
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h1 className="my-[20px] text-center">Trivia Application</h1>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-center mb-[10px]">
                        Please select the how many questions you want to answer
                    </p>
                    <div className="flex flex-col items-center justify-center">
                        <select className="w-24 h-10 mb-[10px]">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
