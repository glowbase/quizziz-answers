import axios from 'axios';
import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [quizCode, setQuizCode] = useState("73642488");
  const [answers, setAnswers] = useState([]);

  async function getAnswers() {
    const { data } = await axios.get(`http://localhost:3001/answers?code=${quizCode}`);
    
    setAnswers(data);
  }
 
  return (
    <div className="App">
      <header className="App-header">
        <h3>Quizizz</h3>

        <div>
          <input placeholder="Quizizz Code" value={quizCode} onInput={e => setQuizCode(e.target.value)} />
          <button onClick={getAnswers}>Submit</button>
        </div>

        <div className='questions'>
          {
            answers.map(question => {
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
