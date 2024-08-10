import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const animateWithGsap = (
  target: string | gsap.DOMTarget,
  animationProps: gsap.TweenVars,
  scrollProps?: Partial<ScrollTrigger>
): void => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
};

export const animateWithGsapTimeline = (
  tl: gsap.core.Timeline,
  rotationalRef: React.RefObject<THREE.Group>,
  rotationalState: number,
  firstTarget: string,
  SecondTarget: string,
  animationProps: { transform: string; duration: number }
) => {
  if (rotationalRef.current) {
    tl.to(rotationalRef.current.rotation, {
      y: rotationalState,
      duration: 1,
      ease: "power2.inOut",
    });
  }

  // Apply animations to the targets
  tl.to(
    firstTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  ).to(
    SecondTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );
};
