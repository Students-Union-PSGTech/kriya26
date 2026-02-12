"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";
import VantaBackground from "./ui/VantaBackground";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "top top",
        end: "+=1000",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".prize-pool-card", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      duration: 1,
    });

    clipAnimation.to(
      ".prize-pool-text",
      {
        scale: 2.5,
        duration: 1,
      },
      0
    );
  });

  return (
    <>
      <section id='clip' className="prize-section h-screen w-full bg-white flex justify-center items-center overflow-hidden">
        <div
          className="prize-pool-card relative bg-gray-900 flex justify-center items-center"
          style={{
            width: "70vw",
            height: "70vh",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <VantaBackground>
            <div className="prize-pool-text bg-black/50 xl:bg-transparent w-full absolute inset-0 flex flex-col justify-center items-center text-center">
              <AnimatedTitle
                title="<b>P</b>rize <b>P</b>ool <br /> 6,00,000"
                containerClass="special-font !text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              />
            </div>
          </VantaBackground>
        </div>
      </section>
    </>
  );
};

export default About;