import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./style.css"
import { Link } from 'react-router-dom'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";



export function Connexion() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post("http://localhost:8000/login/", {
                email,
                password,
            })

            localStorage.setItem('token', response.data.token)
            window.location.reload()
        } catch (error) {
            console.log(error)
            setErrorMessage("Les identifiants saisis sont incorrects.")
        }
    }

    const toggleModalConnexion = () => {
        setIsModalOpen(!isModalOpen)
    }

    const toggleIsPasswordVisible = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }
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
                                type={isPasswordVisible ? "text" : "password"}
                                className=''
                                placeholder='Mot de passe'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <span className='passwordShowToggle' onClick={toggleIsPasswordVisible}>
                                {isPasswordVisible ? <FaRegEye/> : <FaRegEyeSlash/>}
                            </span>
                            <button type='submit' id="btnConnexion">
                                Se connecter
                            </button>
                            <p>Vous n'avez pas de compte ? <Link onClick={toggleModalConnexion} to="/inscription">Créer un compte</Link></p>
                            <p>Mot de passe oublié</p>
                        </form>
                    </div>
                </div>

            )}

        </div>
    )
}
