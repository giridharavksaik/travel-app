import React, { useState } from "react";
import "./Newsletter.css";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import MaleTourist from "../assets/images/male-tourist.png";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success | error

  const handleSubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Please enter a valid email");
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/newsletter/subscribe`, { email });
      alert("successfully")
      setStatus("success");
      setMessage(res.data.message);
      setEmail(""); // reset input
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Subscription failed. Try again.");
    }
  };

  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter__content">
              <h2>Subscribe to get Useful Traveling Information</h2>

              <div className="newsletter__input">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn newsletter__btn" onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>

              {message && (
                <p style={{ color: status === "success" ? "green" : "red", marginTop: "10px" }}>
                  {message}
                </p>
              )}

              <p>
                Get practical travel insights delivered straight to your inbox—from weather-based
                planning tips to hidden gems and local guide recommendations. Stay informed, travel
                smarter, and turn every journey into a lifelong memory.
              </p>
            </div>
          </Col>~
          <Col lg="6">
            <div className="newsletter__img">
              <img src={MaleTourist} alt="Tourist" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
