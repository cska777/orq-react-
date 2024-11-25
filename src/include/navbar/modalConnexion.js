import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./style.css";
import { Link } from 'react-router-dom';
import { useAppStore } from "../../store"; // Importer le store Zustand

const API_URL =
process.env.NODE_ENV === "development"
? process.env.REACT_APP_BACKEND_URL_DEV
: process.env.REACT_APP_BACKEND_URL_PROD

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
            const response = await axios.post(`${API_URL}/login/`, {
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
                                className='inputCo'
                                placeholder='Adresse email'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <input
                                type="password"
                                className='inputCo'
                                placeholder='Mot de passe'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <button type='submit' id="btnConnexion">
                                Se connecter
                            </button>
                            <p className='text-center'>Vous ne possédez pas de compte ? <br></br> <Link onClick={toggleModalConnexion} to="/inscription">Créer un compte</Link></p>
                            {/* <p><Link to="/reset_pwd" onClick={toggleModalConnexion}>Mot de passe oublié ?</Link></p> */}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
