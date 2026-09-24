export default function GeneratorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">Bulk ID Card Generator</div>
        <a href="/select-purpose" className="text-sm text-blue-600 hover:underline">Change Purpose</a>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
