import { useState, useEffect } from "react";
import useInView from "../../hooks/useInView";
import Section from "./Section";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Frontend Developer",
    quote:
      "The AI tutor is a game-changer! I got stuck on a recursive problem and it walked me through it step by step. The course content is world-class.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    course: "Full Stack Web Development",
  },
  {
    name: "Priya Patel",
    role: "Data Analyst",
    quote:
      "I completed the Data Science track and got my certificate in just 3 months. The quizzes and assignments kept me accountable. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    course: "Data Science & AI",
  },
  {
    name: "Rahul Verma",
    role: "Software Engineer",
    quote:
      "The interactive code editor and instant feedback helped me learn faster than any other platform. The progress dashboard is brilliant.",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 4,
    course: "Advanced Python",
  },
  {
    name: "Sneha Reddy",
    role: "UI/UX Designer",
    quote:
      "Beautiful courses, great instructors, and certificates that actually get noticed. Landed my dream job thanks to this platform!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    course: "UI/UX Design",
  },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <Section
        eyebrow="Testimonials"
        title="What Our Students Say"
        subtitle="Join thousands of happy learners who transformed their careers."
      />

      <div
        ref={ref}
        className={`reveal reveal-scale ${inView ? "in-view" : ""} relative`}
      >
        {/* Quote card */}
        <div
          key={current}
          className="animate-fadeSlide glass rounded-3xl p-8 md:p-12 text-center shadow-xl"
        >
          <span className="text-6xl text-indigo-400 font-serif">"</span>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed -mt-4">
            {t.quote}
          </p>

          <div className="flex justify-center gap-1 mt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-xl ${i < t.rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
              >
                ★
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <img
              src={t.avatar}
              alt={t.name}
              loading="lazy"
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400"
            />
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                {t.course}
              </p>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current
                  ? "w-8 bg-indigo-600"
                  : "w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-indigo-400"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
