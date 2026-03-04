import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../../styles/Register.css"
import { Link } from "react-router-dom";

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
                <h2 className="register_title">Đăng ký</h2>

                <div className="input_user">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                        className="username_register"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                <div className="input_email">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input
                        className="email_register"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="input_password">
                    <FontAwesomeIcon icon={faLock} />
                    <input
                        className="password_register"
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button className="button_register" type="submit">
                    Đăng ký
                </button>
                <div className="back_login">
                    Đã có tài khoản? <Link to = "/login">Đăng nhập</Link>
                </div>
            </form>
        </div>

    )
}