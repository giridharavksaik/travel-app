import React from 'react'
import Slider from 'react-slick'
import ava01 from "../../assets/images/ava-1.jpg"
import ava02 from "../../assets/images/ava-2.jpg"
import ava03 from "../../assets/images/ava-3.jpg"
import ava04 from "../../assets/images/ava-4.jpg"
import ava05 from "../../assets/images/ava-5.jpg"

const Testimonials = () => {

    const settings = {
        dots:true,
        infinite:true,
        autoplay:true,
        speed:1000,
        swipeToSlide:true,
        autoplaySpeed:2000,
        slidesToShow:3,

        responsive:[
            {
                breakpoint: 992,
                settings:{
                    slidesToShow:2,
                    slideToScroll:1,
                    dots:true,
                    infinite:true,
                },
            },
            {
                breakpoint:576,
                settings: {
                    slidesToShow:1,
                    slideToScroll:2,
                },
            }
        ]
    }

  return (
    <Slider {...settings}>
        <div className="testimonials py-4 px-3">
            <p>"Explore With Us nailed my bike trip to Spiti Valley.
              The weather alerts helped me dodge a snowstorm, and the route planner was spot-on.
              It’s like having a pit crew in your pocket."
            </p>

            <div className="d-flex align-items-center gap-4 mt-3">
                <img src={ava01} className="w-25 h-25 rounded-2" alt="" />
                <div>
                    <h6 className="mb-0 mt-3">Raghu Ram</h6>
                    <p>Customer</p>
                </div>
            </div>
        </div>
        <div className="testimonials py-4 px-3">
            <p>"I’ve used many travel apps, but Explore With Us impressed me with its curated cultural tours.
                The guide knew every hidden story behind the monuments.
                Felt like I was walking through history with a scholar."
            </p>

            <div className="d-flex align-items-center gap-4 mt-3">
                <img src={ava02} className="w-25 h-25 rounded-2" alt="" />
                <div>
                    <h6 className="mb-0 mt-3">Dr.D.Veeraiah</h6>
                    <p>Customer</p>
                </div>
            </div>
        </div>
        <div className="testimonials py-4 px-3">
            <p>"I travel often for work, and Explore With Us helps me squeeze in local experiences without the hassle.
                The customization feature is a game-changer—quick, clean, and efficient."
            </p>

            <div className="d-flex align-items-center gap-4 mt-3">
                <img src={ava03} className="w-25 h-25 rounded-2" alt="" />
                <div>
                    <h6 className="mb-0 mt-3">Dr.M.Srinivasa Rao</h6>
                    <p>Customer</p>
                </div>
            </div>
        </div>
        <div className="testimonials py-4 px-3">
            <p>"I love how Explore With Us uses location and weather data to optimize travel plans.
                It’s not just smart—it’s practical.
                The app feels engineered for real-world use, not just pretty screens."
            </p>

            <div className="d-flex align-items-center gap-4 mt-3">
                <img src={ava04} className="w-25 h-25 rounded-2" alt="" />
                <div>
                    <h6 className="mb-0 mt-3">Dr.S.Pichi reddy</h6>
                    <p>Customer</p>
                </div>
            </div>
        </div>
        <div className="testimonials py-4 px-3">
            <p>"Explore With Us helped me scout locations for my travel vlog.
                The guide suggestions were authentic, and the app’s UX made planning effortless.
                It’s now part of my creative toolkit."
            </p>

            <div className="d-flex align-items-center gap-4 mt-3">
                <img src={ava05} className="w-25 h-25 rounded-2" alt="" />
                <div>
                    <h6 className="mb-0 mt-3">Dr.Ramesh reddy</h6>
                    <p>Customer</p>
                </div>
            </div>
        </div>
    </Slider>
  )
}

export default Testimonials