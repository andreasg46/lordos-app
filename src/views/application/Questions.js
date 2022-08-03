import React from 'react'
import { CQuestion } from './components/CQuestion';
import { CheckSession } from './functions/general'

const Questions = () => {
  CheckSession();
  return (
    <>
      <CQuestion />
    </>
  )
}

export default Questions
