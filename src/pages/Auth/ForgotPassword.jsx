import Logo from "../../assets/logo.png";
import Button from "../../components/Button";

const ForgotPassword = () => {
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
                                <form >
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
                                            />
                                        </div>
                                    </div>
                                    <div className="field-wrapper">
                                        <div className="login-form-outline">
                                            <label className="login-form-label">
                                                New Password
                                            </label>
                                            <input
                                                type="text"
                                                id="newPassword"
                                                className="login-form-input"
                                                placeholder="New Password"

                                            />
                                        </div>
                                    </div>
                                    <div className="field-wrapper">
                                        <div className="login-form-outline">
                                            <label className="login-form-label">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="text"
                                                id="confirmPassword"
                                                className="login-form-input"
                                                placeholder="Confirm Password"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 mb-4">
                                        <div className="button-container">
                                            <Button style="primary" type="submit">
                                                Reset
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default ForgotPassword;