import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../styles/Register.css"

export default function Register({onSubmit}){
    
    const [username ,setUsername] = useState('');
    const [email , setEmail] =useState('');
    const [password ,setPassword] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        onSubmit({username,email,password})
    } 
    return (
        <div className="bground_register">
            <form className="register_card" onSubmit={handleSubmit}>
            <h2>Register</h2>
            <div className="input_user">  
                <FontAwesomeIcon icon={faUser} size="xl"/>
                <input  
                    className="username_register"
                    placeholder="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div className="input_email">
                <FontAwesomeIcon icon={faEnvelope} size="xl"/>
                <input
                    className="email_register"
                    placeholder="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="input_password">
                <FontAwesomeIcon icon={faLock} size="xl" /> 
                <input
                    className="password_register"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button className="button_register" type="submit">Register</button>
            </form>
        </div>
    )
}