import { useState } from "react";
import "./SpinWheel.css";

const items = ["₹100", "₹200", "₹300", "TRY AGAIN", "₹500", "₹1000"];

export default function SpinWheel() {
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);

    const spin = () => {
        if (spinning) return;

        setSpinning(true);
        const randomIndex = Math.floor(Math.random() * items.length);
        const anglePerItem = 360 / items.length;

        const extraSpins = 5 * 360; // full spins
        const targetRotation = extraSpins + (360 - randomIndex * anglePerItem - anglePerItem / 2);

        setRotation(targetRotation);

        setTimeout(() => {
            setResult(items[randomIndex]);
            setSpinning(false);
        }, 4000);
    };

    return (
        <div className="wheel-container">
            <div className="pointer">▼</div>
            <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                {items.map((item, index) => (
                    <div key={index} className="segment" style={{ transform: `rotate(${index * (360 / items.length)}deg)` }}>
                        <span>{item}</span>
                    </div>
                ))}
            </div>
            <button onClick={spin} disabled={spinning}>{spinning ? "Spinning..." : "SPIN"}</button>
            {result && <h3>🎉 You got: {result}</h3>}
        </div>
    );
}
