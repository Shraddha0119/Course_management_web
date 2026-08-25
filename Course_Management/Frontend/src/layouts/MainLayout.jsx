import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";
import { useAuth } from "../context/AuthContext";

function MainLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {children}
      </main>

      <Footer />

      {/* AI Learning Assistant - available on every page after login */}
      {user && <AIChatbot />}
    </div>
  );
}

export default MainLayout;
