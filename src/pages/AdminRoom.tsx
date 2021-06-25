import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useRoom } from '../hooks/useRoom'
// import { useAuth } from '../hooks/useAuth'
import { Questions } from '../components/Questions'
import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
    id: string;
}

export function AdminRoom(){
    // const {user} = useAuth()
    const params = useParams<RoomParams>()
    const history = useHistory()

    const roomId = params.id
    const {questions, title} = useRoom(roomId)

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        })
    }

    async function handleCheckQuestionAsAnswered(questionId:string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })        
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Tem certeza que deseja excuir essa pergunta?")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button 
                            isOutlined
                            onClick={handleEndRoom}
                        >Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span> {questions.length} pergunta(s)</span> }
                </div>

                <div className="question-list">
                {questions.map(question => {
                    return (
                        <Questions
                        key={question.id}
                        content={question.content}
                        author={question.author}
                        isAnswered={question.isAnswered}
                        isHighlighted={question.isHighLighted}
                        >
                            {
                                !question.isAnswered && (
                                <>
                                <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                        <img src={checkImg} alt="Marcar Pergunta Respondida" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}>
                                        {question.isHighLighted && !question.isAnswered ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#835afd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>                                        
                                        ) : <img src={answerImg} alt="Dar destaque à pergunta" />}
                                        
                                </button>
                                </>)
                                
                            }
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                        </Questions>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}