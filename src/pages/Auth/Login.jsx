import React from 'react';
import Logo from "../../assets/images/logo.png";
import { Link } from 'react-router-dom';
import Button from '../../components/Button'

function Login() {
    return (
        <>
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
                                    <form >
                                        <div className="field-wrapper">
                                            <div className="login-form-outline">
                                                <label className="login-form-label">
                                                    Email/ Phone No
                                                </label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    className="login-form-input"
                                                    placeholder="Email / Phone No"
                                                />
                                            </div>
                                        </div>
                                        <div className="field_wrap">
                                            <div className="login-form-outline">
                                                <label className="login-form-label" htmlFor="form12">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="login-form-input"
                                                    placeholder="Password"
                                                />
                                            </div>
                                        </div>
                                        <div className="field-wrap">
                                            <div className='mb-3'>
                                                <label className="toggle-label">
                                                    <input
                                                        type="checkbox"
                                                        value=""
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-orange after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-orange-400"
                                                    ></div>
                                                    <span className="toggle-text">Remember me</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="button-container">
                                            <Link to='/dashboard'>
                                                <Button style="primary" type="submit">Sign In</Button>
                                            </Link>
                                        </div>
                                        <div className="forgot-wrap">
                                            <a to="/forgot-password">Forgot Password?</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="footer-text">
                        <div >
                            © Copyright 2023, <a href="/">Powered By Aikyam</a>
                        </div>
                    </footer>
                </div >

            </div >
        </>
    )
}

export default Login;