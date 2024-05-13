const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

async function getAnswer(room, id, type) {
    const { data } = await axios({
        method: 'POST',
        url: 'https://game.quizizz.com/play-api/v4/proceedGame',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : JSON.stringify({
            "roomHash": room,
            "playerId": "test",
            "response": {
                "questionId": id,
                "questionType": type,
                "response": type == "MSQ" ? [0, 1] : 0,
                "timeTaken": 0,
                "provisional": {
                    "scores": {
                        "correct": 0,
                        "incorrect": 0
                    },
                    "scoreBreakups": {
                        "correct": {
                            "base": 0,
                            "timer": 0,
                            "streak": 0,
                            "total": 0,
                            "powerups": []
                        },
                        "incorrect": {
                            "base": 0,
                            "timer": 0,
                            "streak": 0,
                            "total": 0,
                            "powerups": []
                        }
                    },
                    "teamAdjustments": {
                        "correct": 0,
                        "incorrect": 0
                    }
                }
            },
            "questionId": id
        })
    });

    const answer = data.question.structure.answer;

    return Array.isArray(answer) ? answer : [answer];
}

async function getRoom(code) {
    const { data: { room: { hash } } } = await axios({
        method: 'POST',
        url: 'https://game.quizizz.com/play-api/v5/checkRoom',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : JSON.stringify({
            roomCode: code
        })
    });

    return hash;
}

async function getQuestions(room) {
    const { data } = await axios({
        method: 'POST',
        url: 'https://game.quizizz.com/play-api/v5/join',
        headers: { 
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            roomHash: room,
            player: {
                id: ""
            },
            ip: "201.10.49.40"
        })
    });

    return {
        questions: data.room.questions,
        ids: data.room.questionIds
    };
}

app.get('/questions', async (req, res) => {
    try {
        const code = req.query.code;

        const room = await getRoom(code);
        const { ids, questions } = await getQuestions(room);

        const response = [];

        for (i = 0; i < ids.length; i++) {
            const {
                _id: id,
                structure: {
                    kind: type,
                    options,
                    query: {
                        text
                    }
                }
            } = questions[ids[i]];

            response.push({
                id: id,
                options,
                text,
                type
            });
        }

        res.send({
            questions: response,
            room: room
        });
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/answer', async (req, res) => {
    try {
        const { room, id, type } = req.query;

        const answer = await getAnswer(room, id, type);

        res.send(answer);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(3001, () => {
    console.log('Running on Port 3001');
});