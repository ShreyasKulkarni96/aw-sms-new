import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import APIService from "../../services/APIService";
import { LOGIN_API } from "../../constants/api";
import Logo from "../../assets/logo.png";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
    const { emailOrPhone, password } = formData;

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!emailOrPhone.trim() || !password.trim()) {
            toast.warn("Please fill in all the fields");
            return;
        }

        try {
            const response = await APIService.post(LOGIN_API, {
                emailOrPhone,
                password,
            });
            const { data } = response;

            if (data.status === "success") {
                const token = data.data.token;
                const userId = data.data.userId;
                toast.success(data.message);

                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);

                navigate("/otp");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login. Please try again.");
        }

    }

    return (
        <div className="background-image login-page-wrapper">
            <div className="overlay">
                <div className="flex-container">
                    <div className="page-title">
                        <h6>Student Management Portal</h6>
                    </div>
                    <div className="grid col-lg-12">
                        <div className="login-wrapper">
                            <div className="signin-wrapper">
                                <h6>Sign In</h6>
                            </div>
                            <div className="logo-wrapper">
                                <img src={Logo} alt="logo-image" />
                            </div>
                            <div className="login-form-wrapper">
                                <form onSubmit={onSubmit}>
                                    <div className="field-wrapper">
                                        <div className="login-form-outline">
                                            <label className="login-form-label">
                                                Email/ Phone No
                                            </label>
                                            <input
                                                type="text"
                                                id="emailOrPhone"
                                                className="login-form-input"
                                                placeholder="Email / Phone No"
                                                value={emailOrPhone}
                                                onChange={onInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field-wrapper">
                                        <div className="login-form-outline">
                                            <label className="login-form-label" htmlFor="password">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="login-form-input"
                                                placeholder="Password"
                                                value={password}
                                                onChange={onInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field-wrapper">
                                        <div className="mb-3">
                                            <label className="toggle-label">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-orange after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-orange-400"></div>
                                                <span className="toggle-text">Remember me</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="button-container">
                                        <Button style="primary" type="submit">
                                            Sign In
                                        </Button>
                                    </div>
                                    <div className="forgot-wrap">
                                        <Link to="/forgot-password">Forgot Password?</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="footer-text">
                    <div>
                        © Copyright 2023, <a href="/">Powered By Aikyam</a>
                    </div>
                </footer>
            </div>
        </div>
    );

}

export default Login;