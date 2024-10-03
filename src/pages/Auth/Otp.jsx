import { useState } from "react";
import Logo from "../../assets/logo.png";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { VERIFY_OTP_API, RESEND_OTP_API } from "../../constants/api";
import APIService from "../../services/APIService";
import { toast } from 'react-toastify';

function Otp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const onInputChange = (e) => {
        setOtp(e.target.value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!otp.trim()) {
            toast.warn("Please enter the OTP");
            return;
        }

        const userId = localStorage.getItem("userId");

        if (!userId) {
            toast.error("User ID not found. Please login again.");
            navigate("/login");
            return;
        }

        try {
            const response = await APIService.post(VERIFY_OTP_API, {
                userId,
                otp,
            });
            const { data } = response;

            if (data.status === "success") {
                const newtoken = data.data.token;
                toast.success("OTP Verified Successfully!");
                localStorage.setItem("token", newtoken);
                navigate("/dashboard");
            } else {
                toast.error("Invalid OTP or an error occurred.");
            }
        } catch (error) {
            console.error("OTP Verification error:", error);
            toast.error("Invalid OTP or an error occurred.");
        }
    }

    const resendOtp = async () => {
        const userId = localStorage.getItem("userId");

        try {
            await APIService.post(RESEND_OTP_API, { userId });
            toast.success("OTP resent successfully.");
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error("Error resending OTP. Please try again.");
        }
    };

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
                                <h6>Verify OTP</h6>
                            </div>
                            <div className="logo-wrapper">
                                <img src={Logo} alt="logo-image" />
                            </div>
                            <div className="login-form-wrapper">
                                <form onSubmit={onSubmit}>
                                    <div className="field-wrapper">
                                        <div className="login-form-outline">
                                            <label className="login-form-label">OTP</label>
                                            <input
                                                type="text"
                                                id="otp"
                                                className="login-form-input"
                                                placeholder="Verify OTP"
                                                value={otp}
                                                onChange={onInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="button-container">
                                        <Button style="primary" type="submit">
                                            Verify OTP
                                        </Button>
                                    </div>
                                    <div className="forgot-wrap">
                                        <Button style="primary" onClick={resendOtp}>
                                            Resend OTP
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Otp;