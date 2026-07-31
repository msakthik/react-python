import { useLayoutEffect } from "react";
import gsap from "gsap";

export const GSAP = () => {
    useLayoutEffect(() => {
        gsap.to(".box", {
            x: 300,
            duration: 1,
            repeat: -1,
            yoyo: true,
            stagger: {
                each: 0.2,
                from: "center"
            },
            rotation: 360,
        });

        gsap.to(".dot", {
            y: -20,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            stagger: 0.15,
            ease: "power1.inOut"
        });

        const tl = gsap.timeline({
            defaults: {
                duration: 0.8,
                ease: "power2.out"
            }
        });

        tl
            .from(".logo", {
                x: 10,
                opacity: 0
            })
            .from(".nav-item", {
                y: 20,
                opacity: 0,
                stagger: 0.15
            }, "-=0.3");
    }, []);

    return (
        <>
            <div className="box"></div>

            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <nav>
                <div className="logo">Logo</div>
                <ul>
                    <li className="nav-item">Home</li>
                    <li className="nav-item">About</li>
                    <li className="nav-item">Services</li>
                    <li className="nav-item">Contact</li>
                </ul>
            </nav>
        </>
    );
};
