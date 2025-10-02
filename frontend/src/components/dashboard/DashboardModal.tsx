export default function DashboardModal({
  modal,
  onClose,
}: {
  modal: { title: string; columns: string[]; data: (string | number)[][] };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-2xl max-w-3xl w-full relative border border-gray-200 dark:border-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl transition-colors"
        >
          ×
        </button>
        <h2 className="text-2xl font-extrabold mb-4 text-gray-900 dark:text-white pr-8">
          {modal.title}
        </h2>
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-sm border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            <thead className="sticky top-0 bg-gray-100 dark:bg-neutral-800">
              <tr>
                {modal.columns.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modal.data.map((row, i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0
                      ? 'bg-white dark:bg-neutral-900'
                      : 'bg-gray-50 dark:bg-neutral-800/50'
                  }
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 border-t border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-gray-100"
                    >
                      {cell}
                    </td>
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
