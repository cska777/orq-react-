import React, { useEffect, useState } from 'react'
import "./style.css"
import axios from "axios"
import {useNavigate} from 'react-router-dom'

const API_URL =
process.env.NODE_ENV === "development"
? process.env.REACT_APP_BACKEND_URL_DEV
: process.env.REACT_APP_BACKEND_URL_PROD

export default function Inscription() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessageUsername, setErrorMessageUsername] = useState('')
    const [errorMessageEmail, setErrorMessageEmail] = useState('')
    const [errorMessagePassword, setErrorMessagePassword] = useState('')
    const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const token = window.localStorage.getItem("token")
        if(token){
            navigate("/")
        }
    })

    const handleSubmit = async (event) =>{
        event.preventDefault()
        
        if(username.length < 3){
            setErrorMessageUsername("Le nom d'utilisateur doit contenir plus de 2 carractères.")
            document.getElementById("username").className="errorInput"
            document.getElementById("usernameLabel").className="errorLabel"
            return
        }else{
            document.getElementById("username").classList.remove("errorInput")
            document.getElementById("usernameLabel").classList.remove("errorLabel")
            setErrorMessageUsername("")
        }

        if(!validateEmail(email)){
            setErrorMessageEmail("Veuillez saisir une adresse email valide.")
            document.getElementById("email").className="errorInput"
            document.getElementById("emailLabel").className="errorLabel"
            return
        }else{
            document.getElementById("email").classList.remove("errorInput")
            document.getElementById("emailLabel").classList.remove("errorLabel")
            setErrorMessageEmail("")
        }

        if(password.length < 8){
            setErrorMessagePassword("Le mot de passe doit contenir au moins 8 carractères.")
            document.getElementById("password").className="errorInput"
            document.getElementById("passwordLabel").className="errorLabel"
            return
        }else{
            document.getElementById("password").classList.remove("errorInput")
            document.getElementById("passwordLabel").classList.remove("errorLabel")
            setErrorMessagePassword("")
        }

        if(password !== confirmPassword){
            setErrorMessageConfirmPassword("Les champs mot de passe doivent être identique.")
            document.getElementById("confirmPassword").className="errorInput"
            document.getElementById("confirmPasswordLabel").className="errorLabel"
            return
        }else{
            document.getElementById("confirmPassword").classList.remove("errorInput")
            document.getElementById("confirmPasswordLabel").classList.remove("errorLabel")
            setErrorMessageConfirmPassword("")
        }

            try{
            const response = await axios.post(`${API_URL}/signup/`,{
                username,
                email,
                password,
            })
            //console.log(response.data)
            navigate("/")
            
        }catch(error){
            console.error(error)
        }
        return true
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    }

    return (
        <div className='main'>
            <div className='containerInscription'>
                <h1 className=''>Inscription </h1>
                <form action='' method='POST' onSubmit={handleSubmit}>
                    <label id='usernameLabel'>Nom d'utilisateur <span>*</span></label>
                    <input
                    id='username'
                    type="text" 
                    className='' 
                    name='username' 
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    />{errorMessageUsername && <p className='error-message text-danger'>{errorMessageUsername}</p>}
                    <br></br>
                    <label id='emailLabel'>Adresse email <span>*</span></label>
                    <input 
                    id='email'
                    type="email" 
                    className='' 
                    placeholder='Adresse email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    />
                    {errorMessageEmail && <p className='error-message text-danger'>{errorMessageEmail}</p>}
                    <br></br>
                    <label id='passwordLabel'>Mot de passe <span>*</span></label>
                    <input 
                    id='password'
                    type="password" 
                    className='' 
                    placeholder='Créer un mot de passe'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    />
                    {errorMessagePassword && <p className='error-message text-danger'>{errorMessagePassword}</p>}
                    <br></br>
                    <label id='confirmPasswordLabel'>Confirmation mot de passe  <span>*</span></label>
                    <input
                    id='confirmPassword' 
                    type="password" 
                    className='' 
                    placeholder='Confirmer le mot de passe'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    />
                    {errorMessageConfirmPassword && <p className='error-message text-danger mb-5'>{errorMessageConfirmPassword}</p>}
                    <button type="submit" id='btnInscription'>S'inscrire</button>
                    <p className='text-danger'>* Ces champs sont obligatoires.</p>
                </form>
            </div>
        </div>
    )
}
