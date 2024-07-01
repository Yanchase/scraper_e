import React, { useState } from "react";

function Monnit() {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    const url = `monnit`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `partner_link.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-8 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">
          Monnit
        </h2>

        <div className="flex justify-end pt-4 pb-2">
          <button
            className={`inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-6 py-2 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleDownload}
            disabled={loading}
            style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span className="text-sm font-medium">Loading...</span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium">Proceed</span>
                <svg
                  className="size-5 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
        {loading && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
            Please wait, your download is in progress...
          </div>
        )}
      </header>
    </div>
  );
}

export default Monnit;
