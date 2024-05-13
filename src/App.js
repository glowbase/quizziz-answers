import axios from 'axios';
import { useState } from 'react';

import './App.css';

function App() {
  const [quizCode, setQuizCode] = useState("");
  const [questions, setQuestions] = useState([]);

  async function getQuestions() {
    setQuestions([]);

    const { data } = await axios.get(`http://localhost:3001/questions?code=${quizCode}`);

    data.questions.forEach(async question => {
      const answer = await getAnswer(data.room, question.id, question.type);

      setQuestions(questions => [...questions, {
        answer: answer,
        ...question
      }]);
    });
  }

  async function getAnswer(room, id, type) {
    const { data } = await axios.get(`http://localhost:3001/answer?room=${room}&id=${id}&type=${type}`);

    return data;
  }
 
  return (
    <div className="App">
      <header className="App-header">
        <h3>Quizizz</h3>

        <div>
          <input placeholder="Quizizz Code" value={quizCode} onInput={e => setQuizCode(e.target.value)} />
          <button onClick={getQuestions}>Submit</button>
        </div>

        <div className='questions'>
          {
            questions.map(question => {
              return <div key={question.id} className='question'>
                <div className='que' dangerouslySetInnerHTML={{__html: question.text.replaceAll('&nbsp;', '')}} />
                {
                  question.options.map((option, i) => {
                    return <div key={question.id + i} className={question.answer.includes(i) ? 'ans correct' : 'ans'} dangerouslySetInnerHTML={{__html: option.text.replaceAll('&nbsp;', '').replace('<strong>', '<p>')}} />
                  })
                }
              </div>
            })
          }
        </div>
      </header>
    </div>
  );
}

export default App;
