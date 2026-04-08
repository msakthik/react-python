import React from 'react';

// ─── Honeycomb geometry constants ─────────────────────────────────────────────
const HEX_W = 192;   // px
const HEX_H = 222;   // px
const HEX_GAP = 8;   // px  (gap-2 = 0.5rem = 8px)
// For a flat-bottom hex the vertical step = H * 3/4
const VERT_STEP = HEX_H * 0.75;                 // 166.5
const VERT_OVERLAP = HEX_H - VERT_STEP;         // negative margin = 55.5 ≈ -56
const STAGGER = (HEX_W + HEX_GAP) / 2;          // half cell = 100

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

/**
 * Honeycomb Layout Page — Section 1 (nature / travel)
 */
export default function Honeycomb() {
    const baseItems = [
        { id: 1, title: 'Beach', image: 'https://images.unsplash.com/photo-1506744626753-1fa44df31c78?auto=format&fit=crop&q=80&w=400' },
        { id: 2, title: 'Mountains', image: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&q=80&w=400' },
        { id: 3, title: 'Forest', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=400' },
        { id: 4, title: 'Desert', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=400' },
        { id: 5, title: 'City', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400' },
        { id: 6, title: 'Ocean', image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=400' },
        { id: 7, title: 'Sky', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=400' },
    ];

    const items = Array.from({ length: 28 }).map((_, i) => ({
        ...baseItems[i % baseItems.length],
        id: i + 1,
        title: `${baseItems[i % baseItems.length].title} ${i + 1}`,
    }));

    const Hexagon = ({ item }) => (
        <div
            style={{
                width: HEX_W,
                height: HEX_H,
                flexShrink: 0,
                position: 'relative',
                clipPath: HEX_CLIP,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.55))',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, z-index 0s',
            }}
            className="group hover:scale-105 hover:z-10"
        >
            <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                className="group-hover:scale-110"
            />
            <div
                style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(30,80,200,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.3s ease',
                }}
                className="group-hover:opacity-100"
            >
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', textAlign: 'center', padding: '0 8px', letterSpacing: 2 }}>
                    {item.title}
                </h3>
            </div>
        </div>
    );

    // rows: [6, 5, 6, 5, 6]  — 5-item rows get a stagger offset
    const rows = [
        { slice: [0, 6], stagger: false },
        { slice: [6, 11], stagger: true },
        { slice: [11, 17], stagger: false },
        { slice: [17, 22], stagger: true },
        { slice: [22, 28], stagger: false },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 16px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 64, position: 'relative', zIndex: 20 }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: 12, lineHeight: 1.1 }}>
                    The Honeycomb Web
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 420, margin: '0 auto', fontSize: 16 }}>
                    Immerse yourself into this massive full-screen interlocking grid!
                </p>
            </div>

            {/* Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transform: 'scale(0.75)', transformOrigin: 'top center' }}>
                {rows.map(({ slice, stagger }, rowIdx) => (
                    <div
                        key={rowIdx}
                        style={{
                            display: 'flex',
                            gap: HEX_GAP,
                            marginBottom: rowIdx < rows.length - 1 ? -VERT_OVERLAP : 0,
                            marginLeft: stagger ? STAGGER : 0,
                        }}
                    >
                        {items.slice(...slice).map(it => <Hexagon key={it.id} item={it} />)}
                    </div>
                ))}
            </div>

            <Honeycomb1 />
        </div>
    );
}

// ─── Section 2: Golden Network ────────────────────────────────────────────────
function Honeycomb1() {
    const baseItems = [
        { id: 1, title: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=600' },
        { id: 2, title: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=600' },
        { id: 3, title: 'Bali', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=600' },
        { id: 4, title: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600' },
        { id: 5, title: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e90760b646e?auto=format&fit=crop&q=80&w=600' },
        { id: 6, title: 'Santorini', image: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=600' },
    ];

    const items = Array.from({ length: 28 }).map((_, i) => ({
        ...baseItems[i % baseItems.length],
        id: i + 1,
    }));

    const GoldenHex = ({ item }) => (
        <div
            style={{
                width: HEX_W,
                height: HEX_H,
                flexShrink: 0,
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.5s ease',
                filter: 'drop-shadow(0 6px 16px rgba(251,191,36,0.3))',
            }}
            className="group hover:scale-[1.12] hover:z-50"
        >
            {/* Golden border shell */}
            <div
                style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #fde68a, #f59e0b, #92400e)',
                    clipPath: HEX_CLIP,
                    transition: 'filter 0.3s ease',
                }}
                className="group-hover:brightness-125"
            >
                {/* Inner image cell */}
                <div
                    style={{
                        position: 'absolute',
                        top: 4, left: 4, right: 4, bottom: 4,
                        clipPath: HEX_CLIP,
                        overflow: 'hidden',
                        background: '#0f172a',
                    }}
                >
                    {/* Dot overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 10, opacity: 0.25, pointerEvents: 'none',
                        backgroundImage: 'radial-gradient(#fbbf24 2px, transparent 2px)',
                        backgroundSize: '15px 15px',
                        mixBlendMode: 'overlay',
                    }} />

                    <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65, transition: 'opacity 0.7s, transform 0.7s', display: 'block' }}
                        className="group-hover:opacity-100 group-hover:scale-125"
                    />

                    {/* Text overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 20,
                        background: 'linear-gradient(to top, rgba(120,53,15,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <h3
                            style={{
                                color: '#fffbeb', fontWeight: 900, fontSize: 18,
                                textTransform: 'uppercase', letterSpacing: 4,
                                textShadow: '0 4px 8px rgba(0,0,0,1)',
                                transform: 'translateY(12px)',
                                transition: 'transform 0.5s ease',
                            }}
                            className="group-hover:translate-y-0"
                        >
                            {item.title}
                        </h3>
                    </div>
                </div>

                {/* Glow ring on hover */}
                <div style={{
                    position: 'absolute', inset: 0,
                    clipPath: HEX_CLIP,
                    background: 'rgba(251,191,36,0.2)',
                    mixBlendMode: 'overlay',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                }}
                    className="group-hover:opacity-100"
                />
            </div>
        </div>
    );

    const rows = [
        { slice: [0, 6], stagger: false },
        { slice: [6, 11], stagger: true },
        { slice: [11, 17], stagger: false },
        { slice: [17, 22], stagger: true },
        { slice: [22, 28], stagger: false },
    ];

    return (
        <div style={{
            minHeight: '100vh', background: '#020617',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '80px 16px', overflow: 'hidden', position: 'relative',
        }}>
            {/* Ambient glow */}
            <div style={{
                position: 'absolute', top: '30%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800, height: 800,
                background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
            }} />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 80, position: 'relative', zIndex: 20 }}>
                <div style={{ position: 'relative', display: 'inline-block', marginTop: 40 }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 900, lineHeight: 1.05,
                        background: 'linear-gradient(90deg, #fde68a, #f59e0b, #d97706)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-1px', padding: '0 48px', marginBottom: 24,
                    }}>
                        The Golden Network
                    </h1>

                    {/* Animated Bee */}
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/009/419/189/original/honey-bee-isolated-with-transparent-background-png.png"
                        alt="Bee"
                        style={{
                            position: 'absolute', top: -80, right: -32,
                            width: 160, height: 160,
                            filter: 'drop-shadow(0 20px 15px rgba(251,191,36,0.3))',
                            animation: 'beeBounce 3s ease-in-out infinite',
                            cursor: 'pointer', zIndex: 50,
                        }}
                    />
                </div>

                <p style={{ color: 'rgba(254,243,199,0.65)', maxWidth: 560, margin: '0 auto', fontSize: 17, fontWeight: 500 }}>
                    Explore exquisite luxury destinations linked through our magnificent golden honeycomb.
                    Experience travel like a bee drawn to the most brilliant nectar.
                </p>
            </div>

            {/* Grid */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                position: 'relative', zIndex: 10,
                transform: 'scale(0.75)', transformOrigin: 'top center',
            }}>
                {rows.map(({ slice, stagger }, rowIdx) => (
                    <div
                        key={rowIdx}
                        style={{
                            display: 'flex',
                            gap: HEX_GAP,
                            marginBottom: rowIdx < rows.length - 1 ? -VERT_OVERLAP : 0,
                            marginLeft: stagger ? STAGGER : 0,
                        }}
                    >
                        {items.slice(...slice).map(it => <GoldenHex key={it.id} item={it} />)}
                    </div>
                ))}
            </div>

            {/* Keyframes injected once */}
            <style>{`
                @keyframes beeBounce {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50%       { transform: translateY(-20px) rotate(5deg); }
                }
            `}</style>
        </div>
    );
}
