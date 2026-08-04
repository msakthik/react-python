import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import gsap from "gsap";

export const CirclrAnimation = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const torusGroupRef = useRef(null);

    const [currentSection, setCurrentSection] = useState(0);
    const [activeHoverSection, setActiveHoverSection] = useState(null);
    const [isLocked, setIsLocked] = useState(false);

    const sectionNames = ["\\home", "\\about", "\\projection", "\\webapp"];

    // Animate Torus 3D Rotation when Section changes
    useEffect(() => {
        if (!torusGroupRef.current) return;

        // Section Rotations (Matching Lucas Portfolio exact math)
        const rotX = [0, -(1.2 * Math.PI), -(1.2 * Math.PI), -(2.2 * Math.PI)];
        const rotY = [0, -Math.PI / 6, (7 * Math.PI) / 6, (13 * Math.PI) / 6];
        const rotZ = [0, 0, 0, 0];

        gsap.to(torusGroupRef.current.rotation, {
            x: rotX[currentSection],
            y: rotY[currentSection],
            z: rotZ[currentSection],
            duration: 1.2,
            ease: "power1.inOut",
            onComplete: () => {
                setIsLocked(false);
            },
        });
    }, [currentSection]);

    // Handle Wheel / Scroll Events for Section Snap
    useEffect(() => {
        let lastWheelTime = 0;

        const handleWheel = (e) => {
            const now = Date.now();
            if (now - lastWheelTime < 800 || isLocked) return;

            if (e.deltaY > 20) {
                if (currentSection < 3) {
                    setIsLocked(true);
                    setCurrentSection((prev) => prev + 1);
                    lastWheelTime = now;
                }
            } else if (e.deltaY < -20) {
                if (currentSection > 0) {
                    setIsLocked(true);
                    setCurrentSection((prev) => prev - 1);
                    lastWheelTime = now;
                }
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: true });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [currentSection, isLocked]);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        let animationFrameId;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // 1. Scene, Camera, Renderer Setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xffffff, 0.04);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting System
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.5);
        dirLight1.position.set(10, 10, 10);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xd23b2f, 0.6);
        dirLight2.position.set(-10, -5, 5);
        scene.add(dirLight2);

        // Group to hold 3D Torus
        const torusGroup = new THREE.Group();
        torusGroupRef.current = torusGroup;
        scene.add(torusGroup);

        const torusRadius = 3.0;
        const tubeRadius = 0.9;

        // 2. Base Solid White Torus Mesh
        const baseTorusGeo = new THREE.TorusGeometry(torusRadius, tubeRadius, 40, 120);
        const baseTorusMat = new THREE.MeshStandardMaterial({
            color: 0xfcfcfc,
            roughness: 0.2,
            metalness: 0.1,
            flatShading: false,
        });
        const baseTorusMesh = new THREE.Mesh(baseTorusGeo, baseTorusMat);
        torusGroup.add(baseTorusMesh);

        // Invisible Raycast Mesh for Mouse Interaction
        const raycastMat = new THREE.MeshBasicMaterial({ visible: false });
        const raycastMesh = new THREE.Mesh(baseTorusGeo, raycastMat);
        torusGroup.add(raycastMesh);

        // 3. Orbiting Atmospheric Platinum & Red Sparkle Particles
        const dustCount = 500;
        const dustGeo = new THREE.BufferGeometry();
        const dustPos = new Float32Array(dustCount * 3);
        const dustColors = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount; i++) {
            const rad = 3.1 + Math.random() * 3.0;
            const ang = Math.random() * Math.PI * 2;
            const h = (Math.random() - 0.5) * 4.0;
            dustPos[i * 3] = Math.cos(ang) * rad;
            dustPos[i * 3 + 1] = Math.sin(ang) * rad;
            dustPos[i * 3 + 2] = h;

            // 100% Platinum Metallic Silver sparkles
            const platShade = 0.82 + Math.random() * 0.16;
            dustColors[i * 3] = platShade;          // Platinum Silver R
            dustColors[i * 3 + 1] = platShade + 0.02; // Platinum Silver G
            dustColors[i * 3 + 2] = platShade + 0.05; // Platinum Silver B
        }

        dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
        dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

        const dustMat = new THREE.PointsMaterial({
            size: 0.045,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            sizeAttenuation: true,
        });
        const dustPoints = new THREE.Points(dustGeo, dustMat);
        torusGroup.add(dustPoints);

        // Scale torus to fit screen height
        const updateScale = () => {
            const vHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
            const vWidth = vHeight * (window.innerWidth / window.innerHeight);
            const scale = Math.min(vWidth, vHeight) / 7.5;
            torusGroup.scale.set(scale, scale, scale);
        };
        updateScale();

        // 4. GPUComputationRenderer Setup
        const boundRadius = torusRadius;
        const boundTubRadius = tubeRadius;
        const simW = Math.ceil(2 * Math.PI * boundRadius * 30);
        const simH = Math.ceil(2 * Math.PI * boundTubRadius * 30);

        const gpuCompute = new GPUComputationRenderer(simW, simH, renderer);

        const heightmapShader = `
            #include <common>
            uniform vec2 mousePos;
            uniform float mouseSize;
            uniform float viscosityConstant;
            uniform float mouseAmp;

            vec2 wrap(vec2 coo){
              vec2 wrapCoo = coo;
              if(coo.x > 1.0) wrapCoo.x = 0.0;
              if(coo.y > 1.0) wrapCoo.y = 0.0;
              if(coo.x < 0.0) wrapCoo.x = 1.0;
              if(coo.y < 0.0) wrapCoo.y = 1.0;
              return wrapCoo;
            }

            void main()	{
              vec2 cellSize = 1.0 / resolution.xy;
              vec2 uv = gl_FragCoord.xy * cellSize;

              vec4 heightmapValue = texture2D( heightmap, uv );

              vec4 north = texture2D( heightmap, wrap(uv + vec2( 0.0, cellSize.y ))); 
              vec4 south = texture2D( heightmap, wrap(uv + vec2( 0.0, - cellSize.y )));
              vec4 east  = texture2D( heightmap, wrap(uv + vec2( cellSize.x, 0.0 )));
              vec4 west  = texture2D( heightmap, wrap(uv + vec2( - cellSize.x, 0.0 )));

              float newHeight = ( ( north.x + south.x + east.x + west.x ) * 0.5 - heightmapValue.y ) * viscosityConstant;

              float distToMouse = length(uv - mousePos);
              float mouseFallof = cos(clamp(distToMouse * PI / mouseSize, 0.0, PI )) + 1.0;
              newHeight += mouseFallof * mouseAmp;

              heightmapValue.y = heightmapValue.x;
              heightmapValue.x = newHeight;

              if(abs(heightmapValue.x) > 0.1)
                heightmapValue.z = 1.0;
              heightmapValue.z = clamp(heightmapValue.z - 0.009, 0.0, 1.0);

              gl_FragColor = heightmapValue;
            }
        `;

        const heightTexture = gpuCompute.createTexture();
        const heightVariable = gpuCompute.addVariable("heightmap", heightmapShader, heightTexture);

        gpuCompute.setVariableDependencies(heightVariable, [heightVariable]);

        heightVariable.material.uniforms.mousePos = { value: new THREE.Vector2(10000, 10000) };
        heightVariable.material.uniforms.mouseSize = { value: 0.06 };
        heightVariable.material.uniforms.mouseAmp = { value: 0.04 };
        heightVariable.material.uniforms.viscosityConstant = { value: 0.989 };

        const error = gpuCompute.init();
        if (error !== null) {
            console.error("GPUComputationRenderer error:", error);
        }

        // 5. Instanced Particles Torus Geometry (120,000 instanced particle cubes)
        const instanceCount = 120000;
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const instancedGeo = new THREE.InstancedBufferGeometry();

        instancedGeo.setAttribute("position", boxGeo.getAttribute("position"));
        instancedGeo.setAttribute("normal", boxGeo.getAttribute("normal"));
        instancedGeo.setIndex(boxGeo.getIndex());

        const offsets = new Float32Array(instanceCount * 3);
        const orients = new Float32Array(instanceCount * 3);
        const seeds = new Float32Array(instanceCount);
        const uvPos = new Float32Array(instanceCount * 2);

        for (let i = 0; i < instanceCount; i++) {
            const u = Math.random();
            const v = Math.random();
            uvPos[i * 2] = u;
            uvPos[i * 2 + 1] = v;

            const theta = u * Math.PI * 2;
            const phi = v * Math.PI * 2;

            const p = new THREE.Vector3(
                (torusRadius + tubeRadius * Math.cos(phi)) * Math.cos(theta),
                (torusRadius + tubeRadius * Math.cos(phi)) * Math.sin(theta),
                tubeRadius * Math.sin(phi)
            );

            offsets[i * 3] = p.x;
            offsets[i * 3 + 1] = p.y;
            offsets[i * 3 + 2] = p.z;

            const centerOnTube = new THREE.Vector3(
                torusRadius * Math.cos(theta),
                torusRadius * Math.sin(theta),
                0
            );
            const normal = new THREE.Vector3().subVectors(p, centerOnTube).normalize();

            orients[i * 3] = normal.x;
            orients[i * 3 + 1] = normal.y;
            orients[i * 3 + 2] = normal.z;

            seeds[i] = i;
        }

        instancedGeo.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));
        instancedGeo.setAttribute("orient", new THREE.InstancedBufferAttribute(orients, 3));
        instancedGeo.setAttribute("seed", new THREE.InstancedBufferAttribute(seeds, 1));
        instancedGeo.setAttribute("uvPos", new THREE.InstancedBufferAttribute(uvPos, 2));

        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_heightmap: { value: null },
                u_time: { value: 0 },
                diffuse: { value: new THREE.Color(1.0, 1.0, 1.0) },
                emissive: { value: new THREE.Color(0, 0, 0) },
                roughness: { value: 0.8 },
                metalness: { value: 0.1 },
            },
            vertexShader: `
                uniform sampler2D u_heightmap;
                uniform float u_time;
                attribute vec3 offset;
                attribute vec3 orient;
                attribute vec2 uvPos;
                attribute float seed;

                varying vec3 vViewPosition;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying float vHeightVal;
                varying float vSeed;

                float random (vec2 s) {
                    return fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                void main() {
                    vUv = uvPos;
                    vSeed = seed;

                    float az = uvPos.x * 2.0 * 3.14159265 - 3.14159265 / 2.0;
                    float ay = floor(random(vec2(seed, 1.0)) * 3.0) * 1.570796325;
                    float ax = uvPos.y * 2.0 * 3.14159265;

                    mat3 instanceRotMatrix =  
                          mat3(cos(az), sin(az), 0.0, -sin(az), cos(az), 0.0, 0.0, 0.0, 1.0) 
                        * mat3(1.0, 0.0, 0.0, 0.0, cos(ax), sin(ax), 0.0, -sin(ax), cos(ax)) 
                        * mat3(cos(ay), 0.0, -sin(ay), 0.0, 1.0, 0.0, sin(ay), 0.0, cos(ay));

                    vNormal = normalize(normalMatrix * instanceRotMatrix * normal);

                    float sizeX = clamp(random(vec2(seed, 0.0)), 0.0, 1.0) * 0.1;
                    float sizeY = clamp(random(vec2(seed, 1.0)), 0.2, 1.0) * 20.0;
                    float sizeZ = clamp(random(vec2(seed, 2.0)), 0.0, 1.0); 
                    vec3 size = vec3(sizeX, sizeY, sizeZ) * 0.1;

                    vec2 uvSample = uvPos + (vec2(random(vec2(seed, 3.0)), random(vec2(seed, 4.0))) * 2.0 - 1.0) * 0.05;
                    float rawHeight = texture2D(u_heightmap, uvSample).r;
                    vHeightVal = rawHeight;
                    
                    float sizeMult = floor(clamp(rawHeight, 0.0, 100.0) * 100.0) / 100.0;

                    vec3 scalePos = vec3(position.x * size.x, position.y * size.y * sizeMult, position.z * size.z);
                    vec3 rotatePos = instanceRotMatrix * scalePos;
                    vec3 translatePos = rotatePos + offset - orient * 0.01;

                    vec4 mvPosition = modelViewMatrix * vec4(translatePos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;

                    vViewPosition = - mvPosition.xyz;
                }
            `,
            fragmentShader: `
                uniform sampler2D u_heightmap;
                uniform vec3 diffuse;
                uniform float u_time;
                varying vec2 vUv;
                varying vec3 vViewPosition;
                varying vec3 vNormal;
                varying float vHeightVal;
                varying float vSeed;

                float random (vec2 s) {
                    return fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                void main() {
                    vec3 accentRed = vec3(0.823, 0.231, 0.184); // Signature Red (#d23b2f)
                    float randVal = random(vec2(vSeed, 1.0));
                    
                    // Exact 10% Red Accents (10 red per 100 particles)
                    bool isAccent = randVal < 0.10;

                    if(isAccent) {
                        gl_FragColor = vec4(accentRed, 1.0);
                    } else {
                        vec3 lightDir = normalize(vec3(10.0, 10.0, 10.0));
                        float diff = max(dot(vNormal, lightDir), 0.38);

                        // High-End Specular Metallic Sheen for Bright Silverish Luster
                        vec3 viewDir = normalize(vViewPosition);
                        vec3 reflectDir = reflect(-lightDir, vNormal);
                        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 18.0);

                        // Bright Silverish Color Palette (Gleaming Silver White, Cool Metallic Silver, & Slate Silver)
                        float shadeSeed = random(vec2(vSeed, 2.0));
                        vec3 baseShade;

                        if (shadeSeed < 0.45) {
                            baseShade = vec3(0.94, 0.95, 0.98); // Gleaming Silver White
                        } else if (shadeSeed < 0.80) {
                            baseShade = vec3(0.82, 0.85, 0.89); // Bright Cool Metallic Silver
                        } else {
                            baseShade = vec3(0.70, 0.74, 0.78); // Slate Silver Gray
                        }

                        // Combine Silverish base shade with directional light & strong silver specular sheen
                        vec3 baseColor = baseShade * diff + vec3(spec * 0.45 * vec3(0.94, 0.97, 1.0));

                        // Extruded hover blocks glow with bright silverish luster
                        if (vHeightVal > 0.02) {
                            float highlight = clamp((vHeightVal - 0.02) * 2.0, 0.0, 0.4);
                            vec3 mixedHoverColor = mix(baseColor, vec3(0.96, 0.98, 1.0), highlight * 0.5);
                            gl_FragColor = vec4(mixedHoverColor, 1.0);
                        } else {
                            gl_FragColor = vec4(baseColor, 1.0);
                        }
                    }
                }
            `,
            lights: false,
        });

        const particleMesh = new THREE.Mesh(instancedGeo, particleMaterial);
        particleMesh.frustumCulled = false;
        torusGroup.add(particleMesh);

        // Initial entrance animation with GSAP
        gsap.from(torusGroup.position, { z: -10, duration: 1.2, ease: "power2.out" });
        gsap.from(torusGroup.rotation, { y: -Math.PI * 2, duration: 1.2, ease: "power2.out" });

        // Raycasting & Parallax Mouse Interaction Setup
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(10000, 10000);
        const targetTilt = { x: 0, y: 0 };
        let isSweeping = false;

        const onPointerMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            targetTilt.x = mouse.y * 0.15;
            targetTilt.y = mouse.x * 0.15;

            if (isSweeping) return;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(raycastMesh);

            if (intersects.length > 0 && intersects[0].uv) {
                const uv = intersects[0].uv;
                heightVariable.material.uniforms.mousePos.value.set(uv.x, uv.y);
                heightVariable.material.uniforms.mouseAmp.value = 0.04;
            } else {
                heightVariable.material.uniforms.mousePos.value.set(10000, 10000);
            }
        };

        const onPointerLeave = () => {
            targetTilt.x = 0;
            targetTilt.y = 0;
            if (!isSweeping) {
                heightVariable.material.uniforms.mousePos.value.set(10000, 10000);
            }
        };

        // Click Wave Sweep Animation
        const onClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(raycastMesh);

            const initialUv = (intersects.length > 0 && intersects[0].uv) ? intersects[0].uv : new THREE.Vector2(0, 0.5);

            const animProgress = { x: 0 };
            gsap.to(animProgress, {
                x: 1,
                duration: 1.0,
                ease: "power1.inOut",
                onStart: () => {
                    isSweeping = true;
                },
                onUpdate: () => {
                    let u = initialUv.x + animProgress.x;
                    if (u > 1.0) u -= 1.0;
                    if (u < 0.0) u += 1.0;

                    heightVariable.material.uniforms.mousePos.value.set(u, initialUv.y);
                    heightVariable.material.uniforms.mouseAmp.value = 0.18;
                },
                onComplete: () => {
                    isSweeping = false;
                    heightVariable.material.uniforms.mouseAmp.value = 0.04;
                },
            });
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerleave", onPointerLeave);
        window.addEventListener("click", onClick);

        // Window Resize Handler
        const onWindowResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            updateScale();
        };
        window.addEventListener("resize", onWindowResize);

        // Render Loop
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            torusGroup.position.x += (targetTilt.y * 0.3 - torusGroup.position.x) * 0.05;
            torusGroup.position.y += (-targetTilt.x * 0.3 - torusGroup.position.y) * 0.05;

            gpuCompute.compute();

            const currentRenderTarget = gpuCompute.getCurrentRenderTarget(heightVariable);
            if (currentRenderTarget) {
                particleMaterial.uniforms.u_heightmap.value = currentRenderTarget.texture;
            }
            particleMaterial.uniforms.u_time.value = clock.getElapsedTime();

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerleave", onPointerLeave);
            window.removeEventListener("click", onClick);
            window.removeEventListener("resize", onWindowResize);
            renderer.dispose();
        };
    }, []);

    // Handle Direct Click on Side Nav Dot
    const goToSection = (index) => {
        setIsLocked(true);
        setCurrentSection(index);
    };

    return (
        <div ref={containerRef} className="w-full h-svh overflow-hidden relative bg-white select-none">
            {/* 3D WebGL Canvas Backdrop */}
            <div className="fixed top-0 left-0 h-svh w-full pointer-events-auto">
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Content Overlay - Section 0: Home Hero */}
            <div className={`max-w-[1920px] h-svh mx-auto relative pointer-events-none overflow-hidden transition-all duration-700 ${currentSection === 0 ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-10 absolute inset-0"}`}>
                <div className="overflow-hidden h-svh w-full absolute top-0 left-0 pointer-events-none">
                    <div id="title-container" className="h-svh w-full opacity-100 absolute top-0 pointer-events-none">
                        <div className="text-center heading-xxl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none flex flex-col items-center">

                            <div className="detail text-xs md:text-sm font-mono uppercase tracking-[0.25em] text-gray-700 pb-3">
                                HI! I'M SAKTHI KUMAR, A
                            </div>

                            <h1 className="font-extrabold text-7xl md:text-[9.5rem] tracking-[0.02em] text-black uppercase leading-none">
                                DEVELOPER
                            </h1>

                            <div className="pt-4 text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-black font-semibold flex items-center justify-center">
                                CREATING INTERACTIVE AND IMMERSIVE DIGITAL EXPERIENCES
                                <span className="animate-pulse pl-0.5 text-lg font-bold">_</span>
                            </div>

                            <div className="pt-12 flex flex-col items-center">
                                <div id="scroll-container" className="flex gap-3 h-[70px] md:h-[85px] flex-col items-center opacity-100">
                                    <div id="scroll-icon" className="h-full w-[1px] relative bg-gray-300 opacity-100">
                                        <div id="scroll-black" className="bg-black h-full w-full top-0 left-0 absolute animate-pulse">
                                            <div id="scroll-handle" className="bg-black bottom-0 right-0 w-[8px] h-[1px] absolute"></div>
                                        </div>
                                    </div>
                                    <div id="scroll-text" className="detail opacity-100 text-black text-center text-[10px] md:text-xs font-mono uppercase tracking-widest leading-tight pt-1">
                                        SCROLL TO <br /> DISCOVER
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Content Overlay - Section 1: About Section */}
            <div className={`max-w-[1920px] h-svh mx-auto relative pointer-events-none overflow-hidden transition-all duration-700 ${currentSection === 1 ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-10 absolute inset-0"}`}>
                <div className="w-full h-full p-8 md:p-16 flex flex-col justify-center items-end text-right">
                    <div className="max-w-[650px] pointer-events-auto">
                        <div className="text-xs font-mono uppercase tracking-widest text-black mb-4 font-bold">
                            \ABOUT_
                        </div>
                        <p className="text-xl md:text-3xl leading-relaxed text-black font-light">
                            As a developer at the intersection of creativity, science, and art, I combine my expertise in mathematics with a passion for digital art to create immersive and interactive experiences. After completing a PhD in mathematics, I worked in the development of cultural mediation installations for renowned institutions such as the Natural History Museum of Paris, the Louvre Abu Dhabi, or the Grand Palais Immersif. I am passionate about procedural art and love exploring algorithm-driven creations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Overlay - Section 2: Interactive Projection */}
            <div className={`max-w-[1920px] h-svh mx-auto relative pointer-events-none overflow-hidden transition-all duration-700 ${currentSection === 2 ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-10 absolute inset-0"}`}>
                <div className="w-full h-full p-8 md:p-16 flex flex-col justify-center items-start text-left">
                    <div className="max-w-[650px] pointer-events-auto">
                        <div className="text-xs font-mono uppercase tracking-widest text-black mb-4 font-bold">
                            \INTERACTIVE PROJECTION_
                        </div>
                        <p className="text-xl md:text-3xl leading-relaxed text-black font-light mb-8">
                            I specialize in creating immersive, interactive projections that transform any surface into an engaging experience. By integrating advanced detection devices like cameras and LiDAR with tracking algorithms and large-scale projection systems, I’ve learned to bring interactivity to life. Over the years, I’ve refined this approach by mastering rendering tools like Unity and Unreal Engine, ensuring visually stunning and technically robust solutions.
                        </p>
                        <button className="border border-black text-black px-6 py-2.5 font-mono text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
                            GALLERY &gt;
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Overlay - Section 3: Web App */}
            <div className={`max-w-[1920px] h-svh mx-auto relative pointer-events-none overflow-hidden transition-all duration-700 ${currentSection === 3 ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-10 absolute inset-0"}`}>
                <div className="w-full h-full p-8 md:p-16 flex flex-col justify-center items-start text-left">
                    <div className="max-w-[650px] pointer-events-auto">
                        <div className="text-xs font-mono uppercase tracking-widest text-black mb-4 font-bold">
                            \WEB APP_
                        </div>
                        <p className="text-xl md:text-3xl leading-relaxed text-black font-light mb-8">
                            Creating high-performance web applications using modern web technologies like Next.js, Three.js, GSAP, and custom WebGL shaders to deliver interactive 3D portfolio experiences.
                        </p>
                        <button className="border border-black text-black px-6 py-2.5 font-mono text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
                            GALLERY &gt;
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Controls Side Navigation Overlay */}
            <div className="w-full h-svh absolute top-0 left-0 pointer-events-none z-50 p-6">
                <div className="w-full h-full relative">

                    {/* Side Square Dot Navigation (Bottom Right) */}
                    <div className="w-fit h-fit absolute bottom-2 flex flex-col right-2 pointer-events-auto gap-2.5 items-end">
                        {sectionNames.map((name, i) => (
                            <div key={i} className="flex flex-col items-end">
                                <div
                                    className="flex flex-row gap-[10px] items-center h-[10px] relative cursor-pointer group"
                                    onClick={() => goToSection(i)}
                                    onMouseEnter={() => setActiveHoverSection(i)}
                                    onMouseLeave={() => setActiveHoverSection(null)}
                                >
                                    {activeHoverSection === i && (
                                        <span className="font-mono text-xs text-black animate-fade-in pr-2">
                                            {name}_
                                        </span>
                                    )}
                                    <div className={`w-[8px] h-[8px] transition-all duration-300 ${currentSection === i ? "bg-black scale-125" : "bg-gray-400 hover:bg-black"}`} />
                                </div>
                                {i < sectionNames.length - 1 && (
                                    <div className="w-[1px] h-[18px] translate-x-[-3.5px] bg-gray-300 my-0.5" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* LET'S TALK ↗ CTA Button (Bottom Left) */}
                    <div className="flex flex-row absolute left-2 bottom-2 gap-5 items-center h-fit">
                        <a
                            href="mailto:lucas.pomot@gmail.com"
                            className="bg-[#d23b2f] hover:bg-[#b82e23] text-white pointer-events-auto px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-sm flex items-center gap-2 group"
                        >
                            LET'S TALK <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-sm">↗</span>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CirclrAnimation;
