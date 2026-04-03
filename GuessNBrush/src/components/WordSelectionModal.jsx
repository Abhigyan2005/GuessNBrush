import { useState, useEffect } from "react";
function WordSelectionModal({
  wordChoices,
  isDrawer,
  drawerName,
  onWordSelect,
}) {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isDrawer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          if (wordChoices.length === 0) return 0; // guard

          const random =
            wordChoices[Math.floor(Math.random() * wordChoices.length)];

          onWordSelect(random);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDrawer, wordChoices]);
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 
      flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6">
        {isDrawer ? (
          <>
            <h2 className="text-2xl font-bold">Choose a word to draw</h2>

            <p
              className={`text-lg font-semibold ${timeLeft <= 10 ? "text-red-500" : "text-gray-500"}`}
            >
              {timeLeft}s
            </p>

            <div className="flex gap-4">
              {wordChoices.map((word) => (
                <button
                  key={word}
                  onClick={() => onWordSelect(word)}
                  className="px-6 py-3 bg-amber-600 text-white rounded-xl 
                  font-medium hover:bg-amber-700 hover:scale-105 
                  transition-all shadow-md"
                >
                  {word}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">Get Ready!</h2>
            <p className="text-gray-600 text-lg">
              <span className="font-semibold text-amber-600">
                {drawerName}{" "}
              </span>
              is choosing a word...
            </p>
            <div className="flex gap-2 mt-2">
              <span className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WordSelectionModal;
