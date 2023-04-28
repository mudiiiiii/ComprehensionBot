import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import * as qna from '@tensorflow-models/qna';
import * as tf from '@tensorflow/tfjs';
import { Fragment } from 'react';
import { Grid } from 'react-loader-spinner';
import { MdSend } from 'react-icons/md';


const App = () => {
  //  Setup references and state hooks
  const passageRef = useRef(null);
  const questionRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Load Tensorflow Model
  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    setLoading(false);
    console.log('Model loaded.');
  };

  //  Handle Questions
  const answerQuestion = async () => {
    if (model !== null) {
      console.log('Question submitted.');
      const passage = passageRef.current.value;
      const question = questionRef.current.value;
  
      const answers = await model.findAnswers(question, passage);
      if (answers.length > 0) {
        setAnswer(answers);
        console.log(answers);
      } else {
        setAnswer([{ text: 'Sorry, I could not find an answer to that question, please could you rephrase your question or passage. I am trained to respond to questions from the passage given.' }]);
      }
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  //  Setup input, question and result area
  return (
    <div className="App">
      <header className="App-header">
        <h1>COMPREHENSION PASSAGE ANSWER BOT</h1>
        {model == null ? (
          <div>
            <div>Model Loading</div>
          </div>
        ) : (
          <Fragment>
            Passage
            <textarea ref={passageRef} rows="30" cols="100" style={{fontSize: '15px'}}></textarea>
            Ask a Question
            <div style={{ display: 'flex' }}>
              <input
                ref={questionRef}
                size="80"
                style={{ height: '80px', width: '700px', fontSize:'20px' }}
              ></input>
              <button onClick={(e) => answerQuestion(e)} style={{ width: '60px', backgroundColor: '#500a2d'}}>
              <MdSend size={24}  />
              </button>
            </div>
            Answer
            {loading ? (
              <div>
                <Grid color="#00BFFF" height={80} width={80} loading={loading} />
              </div>
            ) : (
              <div>
                {answer ? (
                  <b>{answer[0].text}</b>
                ) : (
                  ''
                )}
              </div>
            )}
          </Fragment>
        )}
      </header>
      <footer style={{ background: 'linear-gradient(to right, #500a2d, #001f3f)', color: 'white', textAlign: 'center', padding: '20px' }}>
        Made with React and Tensorflow.js by Mudiaga Otojareri 
      </footer>
    </div>
  );
};

export default App;
