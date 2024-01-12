import React, { useState } from 'react';
import { fetchQuizQuestions, Difficulty, QuestionState } from './API';
// components
import QuestionCard from './components/QuestionCard';
// styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setloading] = useState(false)
  const [questions, setquestions] = useState<QuestionState[]>([])
  const [number, setnumber] = useState(0)
  const [userAnswers, setuserAnswers] = useState<AnswerObject[]>([])
  const [score, setscore] = useState(0)
  const [gameOver, setgameOver] = useState(true)

  console.log(questions)

  const startIrivia = async () => {
    setloading(true)
    setgameOver(false)
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setquestions(newQuestions);
    setscore(0);
    setuserAnswers([]);
    setnumber(0)
    setloading(false)

  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // user answer
      const answer = e.currentTarget.value;
      // check answer against correct answer
      const correct = questions[number].correct_answer == answer;
      // add score if answer is correct
      if (correct) setscore(prev => prev + 1);
      // save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setuserAnswers((prev) => [...prev, answerObject])
    }

  }

  const nextQuestion = () => {
    // move to next question if not the last 
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setgameOver(true)
    } else {
      setnumber(nextQuestion)
    }

  }


  return (
    <>
    <GlobalStyle />
      <Wrapper>
        <h1>QUIZ APP</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ?
          <button className='start' onClick={startIrivia}>
            Start
          </button>
          : null}

        {!gameOver ? <p className='score'>Score:{score} </p> : null}
        {loading && <p>Loading Questions... </p>}
        {!loading && !gameOver && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
          <button className='next' onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App;
