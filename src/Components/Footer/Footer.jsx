import React from "react";
import "./Footer.css";

import { Container, Row, Col, ListGroupItem, ListGroup } from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const quick__links = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/tours",
    display: "Tours",
  },
];

const quick__links2 = [
  {
    path: "/gallery",
    display: "Gallery",
  },
  {
    path: "/login",
    display: "Login",
  },
  {
    path: "/register",
    display: "Register",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3">
            <div className="logo">
              <img src={logo} alt="" />
              <p>
                Explore With Us is built to spark your wanderlust and turn every trip into a joyful memory. Whether you're discovering hidden gems or planning your dream getaway,
                our app helps you travel smarter, connect deeper, and explore with confidence. Let your next adventure be the start of something unforgettable.
              </p>

              <div className="social__links d-flex align-items-center gap-4">
                <span>
                  <Link to="https://youtube.com">
                    <i className="ri-youtube-fill"></i>
                  </Link>
                </span>
                <span>
                  <Link to="https://facebook.com">
                    <i className="ri-facebook-circle-line"></i>
                  </Link>
                </span>
                <span>
                  <Link to="https://instagram.com">
                    <i className="ri-instagram-line"></i>
                  </Link>
                </span>
                <span>
                  <Link to="https://twitter.com">
                    <i className="ri-twitter-line"></i>
                  </Link>
                </span>
              </div>
            </div>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">Discover</h5>

            <ListGroup className="footer__quick-links">
              {quick__links.map((items, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={items.path}>{items.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">Quick Links</h5>

            <ListGroup className="footer__quick-links">
              {quick__links2.map((items, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={items.path}>{items.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">Contact</h5>

            <ListGroup className="footer__quick-links">
              <ListGroupItem className="ps-0 border-0 d-flex flex-column flex-md-row align-items-md-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-warning">
                    <i className="ri-mail-line"></i>
                  </span>
                  <h6 className="mb-0">Email:</h6>
                </div>
                <p className="mb-0">
                  <Link
                    to="mailto:giridharak2301@gmail.com"
                    className="color-text"
                  >
                    giridharak2301@gmail.com
                  </Link>
                </p>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0 d-flex flex-column flex-md-row align-items-md-center gap-3">
                <div className="d-flex align-items-center gap-2 ">
                  <span className="text-warning">
                    <i className="ri-phone-fill"></i>
                  </span>
                  <h6 className="mb-0">Phone:</h6>
                </div>
                <p className="mb-0">
                  <Link to="tel:+919491956374">+91 9491956374</Link>
                </p>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0 d-flex flex-column flex-md-row align-items-md-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-warning">
                    <i className="ri-map-pin-line "></i>
                  </span>
                  <h6 className="mb-0">Address:</h6>
                </div>
                <p className="mb-0">Vijayawada, Andhra Pradesh, India</p>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg="12" className="text-center pt-5">
            <p className="copyright">
              &copy; {year} Explore With Us, All Rights Reserved.
              Designed and Developed By {" "}
              <Link to="https://www.linkedin.com/in/giridhara-?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">Developer(Me & My Team)</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
