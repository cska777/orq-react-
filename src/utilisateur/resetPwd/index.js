import axios from "axios";
import { useState } from "react";
import "./style.css"


export function ResetPassword() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")


    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post("http://localhost:8000/password_reset/", { email })
            setMessage(`Un email de réinitialisation a été envoyé à "${email}".`)
            setError("")
        } catch (error) {
            setError("Une erreur est survenue veuillez réessayer.")
            setMessage("")
        }
    }
    return (
        <div className="passwordResetContainer">
            <h2>Réinitialiser le mot de passe</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Entrez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /> <br></br>
                <button type="submit" id="resetBtn">Réinitialiser mot de passe</button>
            </form>
            {message && <p className="successMessage">{message}</p>}
            {error && <p className="errorMessage">{error}</p>}
        </div>

    )

}