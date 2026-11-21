import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Certificate from "../../components/Certificate";
import { toast } from "react-hot-toast";

export default function CertificateTab({ course, courseId, enrollment, totals, user, certificate, getCertificate, earnedBadges }) {
  const [localCertificate, setLocalCertificate] = useState(certificate);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (certificate) {
      setLocalCertificate(certificate);
    }
  }, [certificate]);

  const handleGenerateCertificate = async () => {
    if (totals.progress < 100) {
      toast.error("Complete the course first to earn a certificate!");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/enroll/${courseId}/certificate`);
      setLocalCertificate(data.certificate);
      toast.success("🎓 Certificate issued!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Certificate not available yet");
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    if (!localCertificate) return;
    try {
      const response = await api.get(`/certificates/${courseId}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${course.title}-certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Certificate downloaded! 📄");
    } catch (err) {
      toast.error("Failed to download certificate");
    }
  };

  const shareCertificate = () => {
    if (!localCertificate) return;
    const url = `${window.location.origin}/verify/${localCertificate.verificationCode || localCertificate.certificateId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Verification link copied to clipboard! 🔗");
    });
  };

  if (totals.progress < 100) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border dark:border-gray-800 animate-fadeInUp">
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-8 text-center">
          <div className="text-6xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-white mb-2">Certificate Locked</h2>
          <p className="text-gray-100">Complete all lessons to unlock your certificate</p>
        </div>
        <div className="p-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Course Progress: {totals.progress}%</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Complete all {totals.total} lessons to earn your certificate of completion.
          </p>
          <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totals.progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!localCertificate) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border dark:border-gray-800 animate-fadeInUp">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-8 text-center">
          <div className="text-6xl mb-3 animate-bounce">🎓</div>
          <h2 className="text-xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-yellow-100">You've completed the course!</p>
        </div>
        <div className="p-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <span className="text-5xl">🏆</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Generate Your Certificate</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Click the button below to generate your official certificate of completion.
          </p>
          <button
            onClick={handleGenerateCertificate}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? "Generating..." : "🎓 Generate Certificate"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border dark:border-gray-800 animate-fadeInUp">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">🎓 Certificate of Completion</h2>
          <p className="text-yellow-100 text-sm">{course.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadCertificate}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            📄 Download PDF
          </button>
          <button
            onClick={shareCertificate}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            🔗 Share
          </button>
        </div>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <Certificate
          course={course}
          student={user}
          certificate={localCertificate}
          verificationUrl={`${window.location.origin}/verify/${localCertificate.verificationCode || localCertificate.certificateId}`}
        />
      </div>

      {/* Earned badges during this session */}
      {earnedBadges.length > 0 && (
        <div className="mt-8 p-6 border-t dark:border-gray-800">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-center">🏅 Badges Earned</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {earnedBadges.map((b, i) => (
              <div key={i} className={`${b.color} text-white rounded-xl p-3 w-24 text-center animate-scaleIn`}>
                <span className="text-3xl block">{b.icon}</span>
                <span className="text-[10px] font-semibold mt-1 block leading-tight">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}