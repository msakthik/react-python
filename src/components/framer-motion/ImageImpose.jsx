import { motion, useScroll, useTransform } from "framer-motion";
import "./impose.css";

export default function ImageImpose() {

    const { scrollYProgress } = useScroll();
    // const scaleFront = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

    // Different speeds
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const midY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
    const frontY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

    return (
        <section className="impose-container">

            {/* Background */}
            <motion.img
                src="https://media.gettyimages.com/id/109722688/photo/black-sports-car.jpg?s=612x612&w=0&k=20&c=b9XsVGszAPpDsWdWMlfsymDCVdSu-bljQo2bFGA00-k="
                className="layer bg"
                style={{ y: bgY }}
            />

            {/* Middle */}
            <motion.img
                src="https://media.gettyimages.com/id/171573202/photo/supercar.jpg?s=612x612&w=0&k=20&c=bHy9OIqDR9CS-8uEU_5YlJcmulwDCZ-TSjiZaCHnxMY="
                className="layer mid"
                style={{ y: midY }}
            />

            {/* Front */}
            <motion.img
                src="https://media.gettyimages.com/id/147557453/photo/sports-car.jpg?s=612x612&w=0&k=20&c=Aorg8SlOCvJTNnKedANtkJVN4YswPeQf-FRzKPfLP6c="
                className="layer front"
                style={{ y: frontY, /* scale: scaleFront */ }}
            />

            <div className="text" style={{ color: 'red' }}>
                <h1>Explore The World</h1>
            </div>

        </section>
    );
}
