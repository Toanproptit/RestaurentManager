import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css"


export default function Login({onSubmit}){
    const [username ,setUsername] = useState('')
    const [password ,setPassword] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("Đã lấy dữ liệu để đăng nhập");
        
        onSubmit({username,password})
    } 
    return (
        <div className="bground_login">
            <form className="login_card" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="input_user">
                    <FontAwesomeIcon icon={faUser} size="xl"/>
                    <input
                        type="text"
                        className="username_login"
                        placeholder="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="input_password">
                    <FontAwesomeIcon icon = {faLock} size="xl" />
                    <input
                        type="password"
                        className="password_login"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="button_login">Login</button>
                <div className="register">
                    Chưa có tài khoản ? <Link to = "/register">Đăng ký</Link>
                </div>
                
            </form>
        </div>
    )
}