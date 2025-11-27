import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button, Alert } from "reactstrap";
import axios from "axios";
import "../styles/Contact.css";
import Subtitle from "../Shared/Subtitle";
import { BASE_URL } from "../utils/config";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    axios
      .post(`${BASE_URL}/send-email`, formData)
      .then((response) => {
        setAlertType("success");
        setAlertMessage("Message sent successfully! We'll get back to you soon.");
        setAlertVisible(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertType("danger");
        setAlertMessage("Failed to send message. Please try again later.");
        setAlertVisible(true);
        setIsSubmitting(false);
      });
  };

  return (
    <section>
      <Container>
        <Row>
          <Col sm={12} md={{ size: 6, offset: 3 }}>
            <Subtitle subtitle={"Contact Us"} />
            <div className="contact-info">
              <p>Contact No: +919491956374</p>
              <p>Email: giridharak2301@gmail.com</p>
            </div>

            {alertVisible && (
              <Alert color={alertType} className="mt-3">
                {alertMessage}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup className="form__group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup className="form__group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup className="form__group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup className="form__group">
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </FormGroup>
              <Button type="submit" className="btn primary__btn w-100" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;
