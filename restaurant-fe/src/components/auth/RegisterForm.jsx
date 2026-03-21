import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../../styles/Register.css";
import { Link } from "react-router-dom";
import { registerApi } from "../../service/authservice";

export default function Register() {
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        password: "",
        email: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registerApi(form);
            console.log("Đăng ký thành công:", res.data);
            alert("Đăng ký thành công")
        } catch (err) {
            console.error("Đăng kí thất bại", err);
        }
    };

    return (
        <div className="bground_register">
            <form className="register_card" onSubmit={handleSubmit}>
                <h2 className="register_title">Đăng ký</h2>

                <div className="input_name">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                        className="name_register"
                        placeholder="Họ và tên"
                        value={form.fullName}
                        onChange={(e) =>
                            setForm({ ...form, fullName: e.target.value })
                        }
                    />
                </div>

                <div className="input_user">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                        className="username_register"
                        placeholder="Tên đăng nhập"
                        value={form.username}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />
                </div>

                <div className="input_email">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input
                        className="email_register"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </div>

                <div className="input_password">
                    <FontAwesomeIcon icon={faLock} />
                    <input
                        className="password_register"
                        type="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                </div>

                <button className="button_register" type="submit">
                    Đăng ký
                </button>

                <div className="back_login">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
            </form>
        </div>
    );
}