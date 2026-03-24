import { useRef, useState } from "react";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ConfirmationResult } from "firebase/auth";
import axios from "axios";

declare global {
    interface Window {
        confirmationResult?: ConfirmationResult;
    }
}

export default function PhoneAuth() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

    // ---------- SEND OTP ----------
    const getCaptchaToken = async () => {
        if (!recaptchaRef.current) {
            recaptchaRef.current = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                }
            );

            await recaptchaRef.current.render();
        }

        return await recaptchaRef.current.verify();
    };

    const generateOtp = async () => {
        const token = await getCaptchaToken();
        console.log('token: ', token);

    };

    return (
        <div>
            <div id="recaptcha-container"></div>
            <input
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <button onClick={generateOtp}>
                Send OTP
            </button>

            <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />

            {/* <button onClick={verifyOtp}>
                Verify OTP
            </button> */}

            {/* REQUIRED */}
            <div id="recaptcha-container"></div>
        </div>
    );
}