export default function DashboardModal({
  modal,
  onClose,
}: {
  modal: { title: string; columns: string[]; data: (string | number)[][] };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-2xl max-w-3xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 text-2xl">×</button>
        <h2 className="text-2xl font-extrabold mb-4">{modal.title}</h2>
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-sm border">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                {modal.columns.map((h) => (
                  <th key={h} className="px-4 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modal.data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 border-t">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
