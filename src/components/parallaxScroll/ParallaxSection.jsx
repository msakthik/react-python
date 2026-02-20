import './parallax.css';

export default function ParallaxSection({ image, children }) {
    return (
        <section className="parallax" style={{ backgroundImage: `url(${image})` }}>
            <div className="content">
                {children}
            </div>
        </section>
    );
}
