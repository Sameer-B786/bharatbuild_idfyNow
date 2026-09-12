import AttendanceScanner from "@/components/AttendanceScanner";

export default function ScanPage() {
  // In a real application, you would get this sessionId after calling your "Start Session" Lambda.
  // For now, we use a placeholder so you can test the UI immediately.
  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Live Scanner</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Click the button below to activate your camera and scan student ID cards.
        </p>
        
        <AttendanceScanner sessionId="demo_session_123" date={today} />
      </div>
    </main>
  );
}
