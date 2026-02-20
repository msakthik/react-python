import { motion, useScroll, useTransform } from "framer-motion";
import "../styles/parallax.css";

export default function HeroParallax() {

    const { scrollYProgress } = useScroll();

    // depth layers
    const bg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const mountain = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const person = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);
    const text = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return (
        <section className="hero">

            <motion.img src="/assets/bg.jpg" className="layer bg" style={{ y: bg }} />
            <motion.img src="/assets/mountain.png" className="layer mountain" style={{ y: mountain }} />
            <motion.img src="/assets/person.png" className="layer person" style={{ y: person }} />

            <motion.div className="heroText" style={{ y: text, opacity }}>
                <h1>Explore The World</h1>
                <p>Book flights. Discover places. Live dreams.</p>
            </motion.div>

        </section>
    );
}
