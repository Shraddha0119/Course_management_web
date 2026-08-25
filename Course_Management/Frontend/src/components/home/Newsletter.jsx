import { useState } from "react";
import { toast } from "react-hot-toast";
import useInView from "../../hooks/useInView";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [ref, inView] = useInView();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Subscribed! Check your inbox. 🎉");
    setEmail("");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div
        ref={ref}
        className={`reveal reveal-scale ${inView ? "in-view" : ""} relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-14 text-center`}
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <span className="inline-block text-4xl mb-4">✉️</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Stay Ahead, Keep Learning
          </h2>
          <p className="text-indigo-100 mt-3 max-w-xl mx-auto">
            Subscribe to get the latest courses, learning tips, and exclusive
            offers delivered straight to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/95 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="btn-ripple bg-white text-indigo-700 px-7 py-3.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Subscribe
            </button>
          </form>

          <p className="text-xs text-indigo-200 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
