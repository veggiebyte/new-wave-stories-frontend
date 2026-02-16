import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-bg">
      <div className="landing-hero">

        {/* Logo */}
        <div className="landing-logo-wrap">
          <img
            src="/images/logo_color.png"
            alt="New Wave Stories logo"
            className="landing-logo"
          />
        </div>

        {/* Tagline */}
        <p className="landing-tagline">
          Create 1980s-inspired fashion collages and pair them with atmospheric scene narratives.
        </p>

        <div className="divider divider--center" />

        {/* About copy */}
        <p className="landing-body">
          New Wave Fashion Stories is a creative web application inspired by early-1980s new wave
          club culture. Assemble visual fashion compositions using curated clothing and accessory
          cutouts, drawing from nightlife scenes in New York, London, and Los Angeles.
        </p>
        <p className="landing-body">
          Each board is a visual collage — emphasizing mood, composition, and nostalgia. Generate
          short AI-assisted scene descriptions that reflect your chosen city, vibe, and song
          inspiration.
        </p>

        {/* CTAs */}
        <div className="landing-actions">
          <Link to="/sign-in" className="btn btn-primary">Sign In</Link>
          <Link to="/sign-up" className="btn btn-green">Sign Up</Link>
        </div>

        {/* Footer note */}
        <p className="landing-footer-note">
          Step inside. The night is just beginning.
        </p>

      </div>
    </div>
  );
};

export default Landing;