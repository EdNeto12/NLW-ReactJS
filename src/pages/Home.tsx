import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

import { useAuth } from '../hooks/useAuth';

import { getDatabase, ref, get, child } from 'firebase/database';

export function Home() {
    const history = useHistory(); 
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');      
    }  

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = ref(getDatabase());

        const result = await get(child(roomRef, `rooms/${roomCode}`));        

        if (!result.exists()) {
            alert('Room does not exists.');
            return;
        } 
        
        if (result.val().endedAt) {
            alert('Room already closed.');
            return;        
        
        }  

        history.push(`/rooms/${roomCode}`);        
        
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />"
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>                
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
            <footer className="rodape">
                <p>
                     Desenvolvido por Edmundo Neto - 2021 <br/>                
                    <a href="https://www.facebook.com/edmundo.sebadelhe" target="_blank" rel="noreferrer" id="face">Facebook</a> || 
                    <a href="https://www.instagram.com/esvneto/" target="_blank" rel="noreferrer" id="inst">Instagram</a>
                </p>
            </footer>
        </div> 
    )
}