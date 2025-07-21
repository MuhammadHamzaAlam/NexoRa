import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const caseStudies = document.querySelectorAll('.case-study');

  caseStudies.forEach((study, index) => {
    const text = study.querySelector('.case-study-text');
    const img = study.querySelector('.case-study-img');

    gsap.fromTo(
      text,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: study,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          stagger: index * 0.1,
        },
      }
    );

    gsap.fromTo(
      img,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: study,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          stagger: index * 0.1,
        },
      }
    );
  });
});