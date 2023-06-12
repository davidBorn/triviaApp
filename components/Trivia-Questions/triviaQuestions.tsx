import { count } from "console";
import React, { useState, useEffect } from "react";

export default function triviaQuestionSelector() {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [score, setScore] = useState(0);
    let [answerSubmitted, setAnswerSubmitted] = useState(false);
    let [disabledButton, setDisabledButton] = useState("");
    let [countdown, setCountdown] = useState(10);
    const [allAnswers, setAllAnswers] = useState<String[]>([]);

    // Function shuffles the answers
    const shuffleAnswers = (data) => {
        // combine correct answer and correct answer array
        let answers = [
            ...data[questionNumber].incorrect_answers,
            data[questionNumber].correct_answer,
        ];
        // shuffle the answers
        console.log(answers);
        answers = answers.sort(() => Math.random() - 0.5);
        // set the answers
        setAllAnswers(answers);
        console.log(answers);
        console.log(allAnswers);
        console.log(questionNumber);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const select = document.querySelector("select") as HTMLSelectElement;
        const value = select.value;

        setLoading(true);

        fetch(`https://opentdb.com/api.php?amount=${value}`)
            .then((res) => res.json())
            .then((data) => {
                setQuestions(data.results);
                setQuestionNumber(1);
                shuffleAnswers(data.results);
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    };

    // Function starts the timer
    const startTimer = () => {
        let timer = setInterval(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return timer;
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
        if (answer.innerHTML === questions[questionNumber - 1].correct_answer) {
            document
                .querySelector(".correct-animation")
                .classList.add("active");
            setScore(score + 100);
            setAnswerSubmitted(true);
            setDisabledButton("disabled");
        } else {
            document
                .querySelector(".incorrect-animation")
                .classList.add("active");
            setScore(score + 0);
            setAnswerSubmitted(true);
            setDisabledButton("disabled");
        }
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
            setQuestionNumber(questionNumber + 1);
            setAnswerSubmitted(false);
            setDisabledButton("");
            shuffleAnswers(questions);
            // startTimer();
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
            setQuestionNumber(questionNumber + 1);
            setAnswerSubmitted(false);
            setDisabledButton("");
            shuffleAnswers(questions);
            // startTimer();
        }
    };

    if (loading) {
        return <div className="loader"></div>;
    }
    if (!loading && questions.length > 0) {
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
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${disabledButton}`}
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
