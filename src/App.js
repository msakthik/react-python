import './App.css';
import ParallaxSection from './components/parallaxScroll/ParallaxSection';
// import Home from './pages/Home';
import Outro from './sections/Outro';
import "./style.scss";

function App() {
  return (
    <>
      {/* <Home /> */}
      <div className="App">
        <ParallaxSection image={'http://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg'}>
          Welcome to Dream Travel
        </ParallaxSection>

        <ParallaxSection image={'https://media.istockphoto.com/id/500221637/photo/digital-world.jpg?s=612x612&w=0&k=20&c=wbMfTwRUtss0B5KSWRlH-ivSm8BAjMCBUKSi30d6rYo='}>
          Book Flights Easily
        </ParallaxSection>

        <ParallaxSection image={'https://shorthand.com/the-craft/raster-images/assets/5kVrMqC0wp/sh-unsplash_5qt09yibrok-4096x2731.jpeg'}>
          Explore the World
        </ParallaxSection>
        <Outro />
      </div>
    </>
  );
}

export default App;
