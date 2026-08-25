import { useState } from "react";
import { Link } from "react-router-dom";

// Course categories mapped to /courses?category=... links
const courseColumns = [
  {
    title: "Courses",
    links: [
      { label: "Web Development", to: "/courses?category=Web Development" },
      { label: "Data Science", to: "/courses?category=Data Science" },
      { label: "AI & ML", to: "/courses?category=AI & ML" },
      { label: "Cloud", to: "/courses?category=Cloud" },
      { label: "Design", to: "/courses?category=Design" },
    ],
  },
];

// Company links: unusable pages point to home; contact opens mailto
const companyColumn = {
  title: "Company",
  links: [
    { label: "About Us", to: "/" },
    { label: "Careers", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Press", to: "/" },
    { label: "Contact", to: "mailto:support@coursepro.com" },
  ],
};

// Support links: general pages point to home
const supportColumn = {
  title: "Support",
  links: [
    { label: "Help Center", to: "/" },
    { label: "FAQs", to: "/" },
    { label: "Community", to: "/courses" },
    { label: "Terms of Service", to: "/" },
    { label: "Privacy Policy", to: "/" },
  ],
};

// Social platforms with real external URLs
const socials = [
  { label: "𝕏", name: "X (Twitter)", href: "https://x.com" },
  { label: "f", name: "Facebook", href: "https://facebook.com" },
  { label: "in", name: "LinkedIn", href: "https://linkedin.com" },
  { label: "▶", name: "YouTube", href: "https://youtube.com" },
  { label: "📷", name: "Instagram", href: "https://instagram.com" },
];

function Footer() {
  const year = new Date().getFullYear();

  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Please enter a valid email address.");
      setSubscribed(false);
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");
    // Auto-hide the success message after a few seconds
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      {/* Top gradient border */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-extrabold flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg">
                🎓
              </span>
              <span className="text-white">
                Course<span className="text-gradient">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-sm">
              An AI-powered learning platform that helps you master in-demand
              tech skills with personalized tutoring, interactive courses, and
              verified certificates.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center text-sm transition-colors"
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-white font-bold mb-4">{companyColumn.title}</h4>
            <ul className="space-y-2.5">
              {companyColumn.links.map((link, j) => (
                <li key={j}>
                  {link.to.startsWith("mailto:") ? (
                    <a
                      href={link.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Courses column */}
          {courseColumns.map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support column */}
          <div>
            <h4 className="text-white font-bold mb-4">{supportColumn.title}</h4>
            <ul className="space-y-2.5">
              {supportColumn.links.map((link, j) => (
                <li key={j}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter + copyright row */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-400">
            © {year} CoursePro. All Rights Reserved.
          </p>

          {/* Newsletter mini form */}
          <div className="w-full md:w-auto">
            {subscribed ? (
              <p className="text-sm text-green-400 font-medium">
                ✅ Thanks for subscribing!
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
              >
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Subscribe for updates..."
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {error && (
                    <p className="text-xs text-red-400 mt-1">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Made-with line */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-sm text-gray-400">Made with</span>
          <span className="text-red-500">❤</span>
          <span className="text-sm text-gray-400">for learners worldwide</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
