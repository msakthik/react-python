import { motion, useScroll, useTransform } from "framer-motion";

export default function FeaturesParallax() {

    const { scrollYProgress } = useScroll();

    const phoneY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    const card1 = useTransform(scrollYProgress, [0, 1], ["80%", "-80%"]);
    const card2 = useTransform(scrollYProgress, [0, 1], ["120%", "-60%"]);

    return (
        <section className="featureWrapper">

            <div className="sticky">

                <motion.img src="https://media.gettyimages.com/id/147557453/photo/sports-car.jpg?s=612x612&w=0&k=20&c=Aorg8SlOCvJTNnKedANtkJVN4YswPeQf-FRzKPfLP6c=" className="phone" style={{ y: phoneY }} />

                <motion.div className="card card1" style={{ y: card1 }}>
                    Instant Ticket Booking
                </motion.div>

                <motion.div className="card card2" style={{ y: card2 }}>
                    Live Fare Tracking
                </motion.div>

            </div>

        </section>
    );
}
