import { useRef } from "react";

// University-style dummy certificate with QR, seal, signature
function Certificate({ studentName, courseName, instructorName, completionDate, certificateId, progress = 100 }) {
  const certRef = useRef(null);

  // Dummy QR code (text-based pattern)
  const QR = () => (
    <div className="w-16 h-16 border border-gray-800 p-1">
      <div className="grid grid-cols-5 gap-0.5 w-full h-full">
        {(() => {
          const cells = [];
          const pattern = [
            1,1,1,1,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,1,1,1,1,
            1,0,1,0,1, 0,1,0,1,0, 1,0,1,0,1, 0,1,0,1,0, 1,0,1,0,1,
            1,1,1,1,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,1,1,1,1,
          ];
          pattern.forEach((v, i) =>
            cells.push(
              <div
                key={i}
                className={
                  v ? "bg-gray-800" : "bg-white"
                }
              />
            )
          );
          return cells;
        })()}
      </div>
    </div>
  );

  const print = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Certificate - ${studentName}</title>
      <style>
        body { margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#f3f4f6; }
      </style>
      </head><body>${certRef.current.outerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const share = async () => {
    const text = `🎓 I just completed "${courseName}" with ${progress}%! Certificate ID: ${certificateId}`;
    if (navigator.share) {
      try { await navigator.share({ title: "My Certificate", text }); } catch (e) {}
    } else {
      navigator.clipboard?.writeText(text);
      alert("Certificate text copied to clipboard!");
    }
  };

  return (
    <div>
      {/* Certificate */}
      <div
        ref={certRef}
        className="relative mx-auto max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-double border-amber-400"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {/* Gold seal */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-4 border-amber-600 flex flex-col items-center justify-center text-amber-900 shadow-lg">
          <span className="text-2xl">🏅</span>
          <span className="text-[8px] font-bold">GOLD SEAL</span>
        </div>

        {/* Institute logo placeholder */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-xl font-bold">
            🎓
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">CodeMentor Institute</p>
            <p className="text-[10px] text-gray-500">Center for Technology Excellence</p>
          </div>
        </div>

        <div className="px-12 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide mt-6">
            Certificate of Completion
          </h1>
          <div className="w-32 h-1 bg-amber-400 mx-auto my-4" />

          <p className="text-gray-500 text-sm mt-6">This is to certify that</p>
          <p className="text-3xl font-bold text-blue-700 my-3 uppercase tracking-wide">
            {studentName}
          </p>
          <p className="text-gray-500 text-sm">
            has successfully completed the course with an overall progress of
          </p>
          <p className="text-2xl font-bold text-amber-600 my-2">{progress}%</p>
          <p className="text-gray-500 text-sm">in</p>
          <p className="text-2xl font-bold text-gray-800 my-3">{courseName}</p>
          <p className="text-gray-500 text-sm">
            under the guidance of{" "}
            <span className="font-semibold text-gray-700">{instructorName}</span>
          </p>

          <div className="grid grid-cols-3 items-end mt-10 text-sm">
            <div className="text-left">
              <p className="font-semibold text-gray-700">{completionDate}</p>
              <div className="border-t border-gray-400 mt-1 pt-1 text-xs text-gray-500">
                Date
              </div>
            </div>
            <div className="flex justify-center">
              <QR />
            </div>
            <div className="text-right">
              <p className="text-2xl italic text-gray-500" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                A. Mentor
              </p>
              <div className="border-t border-gray-400 mt-1 pt-1 text-xs text-gray-500">
                Director
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Certificate ID: <span className="font-mono">{certificateId}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center mt-6">
        <button
          onClick={print}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          🖨 Print / Save PDF
        </button>
        <button
          onClick={share}
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          📤 Share
        </button>
      </div>
    </div>
  );
}

export default Certificate;
