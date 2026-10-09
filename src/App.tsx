import Nav from './components/Nav';
import InkBackground from './components/ink/InkBackground';
import Hero from './components/hero/Hero';
import About from './components/portfolio/About';
import Education from './components/portfolio/Education';
import Projects from './components/portfolio/Projects';
import Publications from './components/portfolio/Publications';
import Experience from './components/portfolio/Experience';
import Highlights from './components/portfolio/Highlights';
import Contact from './components/portfolio/Contact';
import './components/portfolio/portfolio.css';

export default function App() {
  return (
    <>
      <InkBackground />
      <Nav />
      <main id="top">
        <Hero />
        <div className="portfolio">
          <About />
          <Education />
          <Projects />
          <Publications />
          <Experience />
          <Highlights />
          <Contact />
        </div>
      </main>
    </>
  );
}
