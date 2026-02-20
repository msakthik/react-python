import { motion } from "framer-motion";
import '../styles/parallax.css';

export default function Outro() {
    return (
        <section className="outro">
            <motion.h2
                initial={{ opacity: 0, y: 120 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Start Your Journey Today
            </motion.h2>
        </section>
    );
}
