import React, { useState, useEffect } from 'react';
import { TextField, Grid } from '@material-ui/core';
import { Card, Button } from "react-bootstrap";
import { Clues } from '../../../data/staticData/clues';
import { check } from '../utility';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import './QuestionNine.scss';
import { useGetUserAnswerQuery } from '../../../data/queries';
import { useSaveUserAnswerMutation } from '../../../data/mutations';

import Table from '../images/table.png';
import Gene from '../images/gene.png';

const QuestionNine = ({ progress, setActiveStep, completed, setCompleted  }) => {

  const [answer, setAnswer] = useState("");
  const [loading, setLoading ] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ans = Clues[8].answers[0];

  const { data: getUserAnswerQueryData, loading: getUserAnswerQueryLoading } = useGetUserAnswerQuery({
    variables: {
      question_number: 9
    }
  });

  const [saveUserAnswer, { loading: mutationLoading }] = useSaveUserAnswerMutation();

  useEffect(() => {
    if(!getUserAnswerQueryLoading) {
      let persisted_user_answer = getUserAnswerQueryData.currentUser.answerTo;
      if(persisted_user_answer){
        updateCompleted();
        setAnswer(persisted_user_answer);
      }
    }
  });

  const updateCompleted = () => {
    const newCompleted = completed;
    newCompleted[progress].score = 1;
    newCompleted[progress].isCompleted = true;
    setCompleted(newCompleted);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setLoading(true);
    const temp = answer.split(', ');
    const cl = ans.split(', ');
    if (JSON.stringify(temp) === JSON.stringify(cl)) {
      if(!mutationLoading){
        saveUserAnswer({
          variables: {
            "input": {
              "answerAttributes": {
                "questionNumber": 9,
                "answer": answer
              }
            }
          }
        });
      }
      setToggle(true);
      updateCompleted();
       
    } else {
      setToggle(false);
    }
    setLoading(false);
  }
  const handleChange = (event) => {
    setAnswer(event.target.value.toLowerCase());
  }

  return(
    <Card>
      <Card.Header>
        <h1>Puzzle #9</h1>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit} >
          <Grid container direction="column">
            <Grid  container justify="center" item>
              <img src={Table} className="table" />
            </Grid>
            <Grid container item xs={12}>
              <div className="letter-box">
                <img src={Gene} className="gene" />
      
                <br/>
                <br/>
                  The Faculty of Science has a program with the same name as the acronym concealed within this DNA sequence. Use the given table to decode the DNA! Treat the top strand as the template, transcribe from 3’ to 5’, and translate.
                <br/>
                <br/>
                  What does each letter stand for in the program we’re referring to?
              </div>
              <br/>
              Separate the words with a comma and space (e.g. word, word, word, ...)
              <br/>
              <br/>
            </Grid>
            
            <div className="center-text">
              <TextField required 
                disabled={completed[progress].isCompleted}
                style={{width: 280}}
                id="question" 
                label="Answer" 
                variant="outlined"
                aria-describedby="Write your answer here" 
                value={answer} 
                onChange={handleChange}
              />
            </div>
              
          <Grid container justify="center" alignItems="center">
          {
            (completed[progress].isCompleted || (submitted && toggle)) &&
              <CheckCircleOutlineIcon style={{ color: 'green', width: 50, height: 50}}/>
          }
          {
            submitted && !toggle &&
              <HighlightOffIcon style={{ color: 'red', width: 50, height: 50}}/>
          }
                 
          </Grid>
          {
           (!toggle && !completed[progress].isCompleted)  &&
            <div className="center-text">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                Submit
              </Button>
            </div>
          }
      
          </Grid>
        </form>
      </Card.Body>
    </Card>

  )
}

export { QuestionNine };
