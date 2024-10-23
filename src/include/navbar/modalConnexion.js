import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./style.css";
import { Link } from 'react-router-dom';
import { useAppStore } from "../../store"; // Importer le store Zustand

export function Connexion() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Récupérer l'action getUserData et les états du store Zustand
    const  getUserData  = useAppStore((state) => state.getUserData)

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8000/login/`, {
                email,
                password,
            });

            const token = response.data.token;

            // Stocker le token dans le localStorage et utiliser getUserData pour mettre à jour l'état
            localStorage.setItem('token', token);
            getUserData(token); // Utiliser l'action du store pour mettre à jour l'utilisateur et le token

            setIsModalOpen(false);
            navigate('/');
        } catch (error) {
            console.log("Erreur de connexion : ", error);
            setErrorMessage("Les identifiants saisis sont incorrects.");
        }
    };

    const toggleModalConnexion = () => {
        setIsModalOpen(!isModalOpen);
    };


    return (
        <div>
            <button id="btnNavPasCo" onClick={toggleModalConnexion}>Connexion</button>

            {isModalOpen && (
                <div className='modalConnexion'>
                    <div className='modalContentConnexion'>
                        <span className='closeBtnConnexion' onClick={toggleModalConnexion}>&times;</span>
                        <h1 className=''>Connexion</h1>
                        {errorMessage && <p className='error-message errorMessage text-danger text-center mb-3'>{errorMessage}</p>}
                        <form onSubmit={handleSubmit} method='POST'>
                            <input
                                type='email'
                                className=''
                                placeholder='Adresse email'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <input
                                type="password"
                                className=''
                                placeholder='Mot de passe'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <button type='submit' id="btnConnexion">
                                Se connecter
                            </button>
                            <p>Vous n'avez pas de compte ? <Link onClick={toggleModalConnexion} to="/inscription">Créer un compte</Link></p>
                            <p><Link to="/reset_pwd" onClick={toggleModalConnexion}>Mot de passe oublié ?</Link></p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
