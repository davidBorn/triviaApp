'use client'
import TriviaQuestionSelector from '../components/Trivia-Questions/triviaQuestions'

export default function Home() {


  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <TriviaQuestionSelector />
    </main>
  )
}
