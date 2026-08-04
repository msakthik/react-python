import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const RoundAni = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Set canvas dimensions
        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // Mouse position tracking
        const mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            targetX: window.innerWidth / 2,
            targetY: window.innerHeight / 2,
        };

        const handleMouseMove = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Particle & Circle configuration
        const center = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };

        // Concentric rings setup
        const ringCount = 12;
        const rings = Array.from({ length: ringCount }, (_, i) => ({
            baseRadius: (i + 1) * 35,
            radius: (i + 1) * 35,
            speed: 0.005 + i * 0.002,
            angle: i * 0.5,
            dashLength: 5 + i * 3,
            gapLength: 10 + i * 4,
            width: 1 + (i % 3) * 0.5,
            alpha: Math.max(0.1, 0.6 - i * 0.04),
        }));

        // Orbiting particles setup
        const particleCount = 60;
        const particles = Array.from({ length: particleCount }, (_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 350;
            return {
                angle,
                distance,
                speed: (0.002 + Math.random() * 0.008) * (i % 2 === 0 ? 1 : -1),
                size: 1.5 + Math.random() * 3.5,
                alpha: 0.2 + Math.random() * 0.6,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                pulseAngle: Math.random() * Math.PI * 2,
            };
        });

        let time = 0;

        // Render animation loop
        const render = () => {
            time += 0.015;

            // Smooth lerp mouse position
            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            const width = window.innerWidth;
            const height = window.innerHeight;

            ctx.clearRect(0, 0, width, height);

            // Shift center slightly towards mouse position
            const currentCenter = {
                x: width / 2 + (mouse.x - width / 2) * 0.15,
                y: height / 2 + (mouse.y - height / 2) * 0.15,
            };

            // 1. Draw glowing background radial gradient
            const bgGradient = ctx.createRadialGradient(
                currentCenter.x,
                currentCenter.y,
                10,
                currentCenter.x,
                currentCenter.y,
                Math.max(width, height) * 0.6
            );
            bgGradient.addColorStop(0, "rgba(235, 238, 245, 0.8)");
            bgGradient.addColorStop(0.5, "rgba(245, 247, 250, 0.4)");
            bgGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // 2. Draw animated concentric rings
            rings.forEach((ring, idx) => {
                ring.angle += ring.speed;

                // Sine wave pulsing on ring radius
                const wave = Math.sin(time * 2 + idx * 0.4) * 8;
                const dynamicRadius = ring.baseRadius + wave;

                ctx.save();
                ctx.beginPath();
                ctx.translate(currentCenter.x, currentCenter.y);
                ctx.rotate(ring.angle);

                // Dashed circles for alternate rings
                if (idx % 2 === 0) {
                    ctx.setLineDash([ring.dashLength, ring.gapLength]);
                } else {
                    ctx.setLineDash([]);
                }

                ctx.arc(0, 0, Math.max(0, dynamicRadius), 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 0, 0, ${ring.alpha})`;
                ctx.lineWidth = ring.width;
                ctx.stroke();
                ctx.restore();
            });

            // 3. Draw connected line web between close orbiting particles
            const particlePositions = particles.map((p) => {
                p.angle += p.speed;
                p.pulseAngle += p.pulseSpeed;

                const currentDist = p.distance + Math.sin(p.pulseAngle) * 12;
                return {
                    x: currentCenter.x + Math.cos(p.angle) * currentDist,
                    y: currentCenter.y + Math.sin(p.angle) * currentDist,
                    size: p.size,
                    alpha: p.alpha + Math.sin(p.pulseAngle) * 0.2,
                };
            });

            // Draw connection lines
            for (let i = 0; i < particlePositions.length; i++) {
                for (let j = i + 1; j < particlePositions.length; j++) {
                    const dx = particlePositions[i].x - particlePositions[j].x;
                    const dy = particlePositions[i].y - particlePositions[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particlePositions[i].x, particlePositions[i].y);
                        ctx.lineTo(particlePositions[j].x, particlePositions[j].y);
                        ctx.strokeStyle = `rgba(0, 0, 0, ${(1 - dist / 80) * 0.12})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            // 4. Draw orbiting particles
            particlePositions.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0, p.alpha)})`;
                ctx.fill();
            });

            // 5. Draw mouse interaction ripple circle
            const mouseDistFromCenter = Math.sqrt(
                Math.pow(mouse.x - currentCenter.x, 2) + Math.pow(mouse.y - currentCenter.y, 2)
            );
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 25 + Math.sin(time * 4) * 5, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.setLineDash([]);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        // GSAP Animations for Hero Elements
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
            "#title-container",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, delay: 0.2 }
        )
            .fromTo(
                "#scroll-black",
                { height: "0%" },
                { height: "100%", duration: 1.5, repeat: -1, yoyo: true, ease: "power2.inOut" },
                "-=0.5"
            );

        // Cursor blink animation
        gsap.to(".tech-heading span", {
            opacity: 0,
            repeat: -1,
            yoyo: true,
            duration: 0.6,
            ease: "steps(1)",
        });

        // Cleanup on unmount
        return () => {
            window.removeEventListener("resize", setCanvasSize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="w-full h-svh overflow-hidden relative bg-white">
            <div className="h-full w-full overscroll-none overflow-auto">

                {/* Background Canvas for Circular Animation */}
                <div className="fixed top-0 left-0 h-svh w-full pointer-events-auto">
                    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                        <div style={{ width: "100%", height: "100%" }}>
                            <canvas ref={canvasRef} style={{ display: "block" }}></canvas>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1920px] h-svh mx-auto relative pointer-events-none overflow-hidden opacity-100">
                    <div className="overflow-hidden h-svh w-full absolute top-0 left-0 pointer-events-none">

                        {/* Title Container */}
                        <div id="title-container" className="h-svh w-full opacity-100 absolute top-0 pointer-events-none">
                            <div className="text-center heading-xxl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none text-black font-extrabold text-6xl md:text-8xl tracking-tight">
                                <div className="detail absolute top-0 -translate-y-full w-full pb-1 text-lg md:text-xl font-normal uppercase tracking-widest text-gray-700">
                                    Hi! I'm Sakthi Kumar, a
                                </div>
                                developer
                                <div className="pt-2 absolute bottom-0 translate-y-full w-full flex flex-col items-center">
                                    <div className="flex flex-row">
                                        <div className="tech-heading text-2xl font-mono">
                                            <span className="font-bold">_</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 translate-y-full pt-10">
                                        <div id="scroll-container" className="flex gap-4 h-[90px] md:h-[100px] flex-col items-center opacity-100">
                                            <div id="scroll-icon" className="h-full w-[1px] relative bg-gray-300 opacity-100">
                                                <div id="scroll-black" className="bg-black h-0 w-full top-0 left-0 absolute">
                                                    <div id="scroll-handle" className="bg-black bottom-0 right-0 w-[8px] h-[1px] absolute"></div>
                                                </div>
                                                <div id="scroll-gray" className="bg-gray-300 h-0 w-full top-0 left-0 absolute"></div>
                                            </div>
                                            <div id="scroll-text" className="detail opacity-100 text-black w-fit lg:w-fit text-center text-xs uppercase tracking-wider font-medium">
                                                scroll to <br /> discover
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-1/2 left-1/2">
                                <div className="lg:opacity-0" style={{ left: 0, top: 0, position: "absolute" }}>
                                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full"></div>
                                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full"></div>
                                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Panel 1 */}
                        <div className="h-full w-full absolute top-0 left-0 translate-x-full opacity-0">
                            <div className="w-full h-full relative p-5 pointer-events-auto overflow-y-scroll">
                                <div className="w-full max-w-[1300px] mx-auto flex flex-col relative gap-5"></div>
                            </div>
                            <button className="w-[50px] h-[50px] absolute top-0 left-0 bg-white pointer-events-auto ml-5 mt-5 border-[1px] border-black tech-heading text-[36px] p-2">
                                <svg viewBox="0 0 15 15" className="w-full h-full p-2">
                                    <path fill="none" stroke="currentColor" d="M10 14L3 7.5L10 1" />
                                </svg>
                            </button>
                        </div>

                        {/* Panel 2 */}
                        <div className="h-full w-full absolute top-0 left-0 translate-x-full opacity-0">
                            <div className="w-full h-full relative p-5 pointer-events-auto overflow-y-scroll">
                                <div className="w-full max-w-[1300px] mx-auto flex flex-col relative gap-5"></div>
                            </div>
                            <button className="w-[50px] h-[50px] absolute top-0 left-0 bg-white pointer-events-auto ml-5 mt-5 border-[1px] border-black tech-heading text-[36px] p-2">
                                <svg viewBox="0 0 15 15" className="w-full h-full p-2">
                                    <path fill="none" stroke="currentColor" d="M10 14L3 7.5L10 1" />
                                </svg>
                            </button>
                        </div>

                        {/* Controls / Footer overlay */}
                        <div className="w-full h-svh absolute top-0 left-0 pointer-events-none z-50 p-5">
                            <div className="w-full h-full relative">
                                <div className="w-fit h-fit absolute bottom-0 flex flex-col right-0">
                                    <div className="flex flex-row gap-[10px] place-items-center h-[8px] md:h-[10px] relative pointer-events-auto">
                                        <div className="h-full aspect-square bg-black opacity-20"></div>
                                        <button className="absolute top-0 left-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4"></button>
                                    </div>
                                    <div className="w-[1px] h-[25px] md:h-[30px] translate-x-[7px] md:translate-x-[9px] relative">
                                        <div className="absolute left-0 w-full bg-black h-full" style={{ clipPath: "inset(0% 0% 100% 0%)" }}></div>
                                    </div>
                                    <div className="flex flex-row gap-[10px] place-items-center h-[8px] md:h-[10px] relative pointer-events-auto">
                                        <div className="h-full aspect-square bg-black opacity-20"></div>
                                        <button className="absolute top-0 left-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4"></button>
                                    </div>
                                    <div className="w-[1px] h-[25px] md:h-[30px] translate-x-[7px] md:translate-x-[9px] relative">
                                        <div className="absolute left-0 w-full bg-black h-full" style={{ clipPath: "inset(0% 0% 100% 0%)" }}></div>
                                    </div>
                                    <div className="flex flex-row gap-[10px] place-items-center h-[8px] md:h-[10px] relative pointer-events-auto">
                                        <div className="h-full aspect-square bg-black opacity-20"></div>
                                        <button className="absolute top-0 left-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4"></button>
                                    </div>
                                    <div className="w-[1px] h-[25px] md:h-[30px] translate-x-[7px] md:translate-x-[9px] relative">
                                        <div className="absolute left-0 w-full bg-black h-full" style={{ clipPath: "inset(0% 0% 100% 0%)" }}></div>
                                    </div>
                                    <div className="flex flex-row gap-[10px] place-items-center h-[8px] md:h-[10px] relative pointer-events-auto">
                                        <div className="h-full aspect-square bg-black opacity-20"></div>
                                        <button className="absolute top-0 left-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4"></button>
                                    </div>
                                </div>
                                <div className="flex flex-row absolute left-0 bottom-0 gap-5 items-center h-fit">
                                    <a href="mailto:lucas.pomot@gmail.com" className="bg-black text-white pointer-events-auto detail px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider group hover:bg-gray-800 transition-colors">
                                        let's talk <span className="pl-1">↗</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoundAni;
