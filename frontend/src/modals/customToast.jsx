import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const CountdownBar = ({ duration, onTimeout, start }) => {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, duration - elapsed);
      setWidth((remaining / duration) * 100);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeout();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onTimeout]);

  return (
    <div className="w-full h-1 bg-gray-200 mt-3 rounded overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-100"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

const ShowConfirmToast = (onYes, onNo, content = "Are you sure?") => {
  const duration = 5000;
  const start = Date.now();

  const toastId = toast.custom((t) => {
    const handleTimeout = () => {
      toast.dismiss(t.id);
      onNo?.();
    };

    return (
      <div
        className="bg-white border border-gray-200 shadow rounded-2xl px-5 py-4 w-[260px] flex flex-col items-center animate-fade-in"
        style={{ animation: "fadeIn 0.2s ease-in-out" }}
      >
        <p className="text-gray-800 text-center font-semibold mb-3">
          {content}
        </p>
        <div className="flex space-x-4">
          <button
            className="px-4 py-1.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white transition-all duration-200"
            onClick={() => {
              toast.dismiss(t.id);
              onYes();
            }}
          >
            Yes
          </button>
          <button
            className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all duration-200"
            onClick={() => {
              toast.dismiss(t.id);
              onNo?.();
            }}
          >
            No
          </button>
        </div>
        <CountdownBar
          duration={duration}
          onTimeout={handleTimeout}
          start={start}
        />
      </div>
    );
  });

  return toastId;
};

export default ShowConfirmToast;
