import React from "react";
import { Container, Row, Col } from "reactstrap";
import Subtitle from "../Shared/Subtitle";
import '../styles/About.css';
import worldImg from "../assets/images/world.png"
import logo1 from "../assets/images/logo1.png"
import Newsletter from "../Shared/Newsletter";
import Contact from "./Contact";

const About = () => {
  return (
    <><section className="about">
      <Container>
        <Row>
          <Col lg="6">
            <div className="hero__content">
              <div className="hero__subtitle d-flex align-items-center">
                <Subtitle subtitle={"About Us"} />
                <img src={worldImg} alt="" />
              </div>
              <h1>
                Traveling Opens The Door To Creating{" "}
                <span className="highlight">Memories</span>
              </h1>
              <p>
              Explore With Us is more than a travel app—it's your intelligent companion for discovering the world with confidence, clarity, and customization.
              Born from a passion for real-world exploration and smart planning, our platform empowers travelers to craft unforgettable journeys using real-time data,
              modular itineraries,and local expertise. Whether you're chasing Himalayan sunrises or navigating urban escapes, we help you travel smarter—not harder.
            </p>
             <p>
            ✈️ What We Offer
              Weather-Aware Planning Get personalized trip suggestions based on live weather forecasts, so you're never caught off guard.
              Modular Itinerary Builder Design your journey your way—choose destinations, activities, and timing with drag-and-drop simplicity.
              Local Guide Integration Connect with trusted guides who know the terrain, the culture, and the shortcuts that make all the difference.
              Smart Notifications Stay updated with travel alerts, safety tips, and local insights tailored to your route.
              Seamless Experience Built with a clean interface and robust backend, Explore With Us is engineered for speed, reliability, and ease of use.
             </p><p>
            🧭 Our Mission
              To make travel safer, smarter, and more meaningful—by blending technology with human insight. We believe every journey should be as unique as the traveler behind it.
            </p><p>
            🤝 Join the Movement
              Whether you're a solo adventurer, a family planner, or a content creator scouting your next story, Explore With Us is designed to support your journey from dream to destination.
              </p>
            </div>
          </Col>
          <div className="about__image d-flex align-items-center">
            <img src={logo1} height={250} width={250} alt="" />
          </div>
        </Row>
      </Container>
    </section>
    <Contact/>
    <Newsletter /></>
  );
};

export default About;
