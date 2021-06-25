import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { database } from '../services/firebase'

import '../styles/auth.scss'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

export function Home(){
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')
    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle()
        }
        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault()

        if(roomCode.trim() === ''){
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if(!roomRef.exists()){
            alert('Room does not exists')
            return
        }

        if(roomRef.val().endedAt){
            alert('Room already closed');
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    return(
        <div id="page-auth">
        <aside>
            <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
            <div>
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </div>
        </aside>
        <main>
            <div className="main-content">
                <img src={logoImg} alt="Letmeask" />
                <button onClick={handleCreateRoom} className="create-room"> <img src={googleIconImg} alt="Logo do Google" /> Crie uma sala com o Google</button>
                <div className="separator">ou entre em uma sala</div>
                <form onSubmit={handleJoinRoom}>
                    <input 
                    type="text" 
                    placeholder="Digite o código da sala"
                    onChange={event => {setRoomCode(event.target.value)}}
                    value={roomCode}/>
                    <Button type="submit"> Entrar na sala</Button>
                </form>
            </div>
        </main>
    </div>
)
}