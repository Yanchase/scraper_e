import React, { useState, useEffect, useRef } from "react";

function FindEmails() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    try {
      if (logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Failed to scroll to the bottom of the log view:", error);
    }
  }, [logs]);

  useEffect(() => {
    const eventSource = new EventSource("/emails/stream_logs");
    console.log("EventSource:", eventSource);
    eventSource.onmessage = (event) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage(""); // Clear any existing messages
  };

  // Handle the file upload
  const handleUpload = async () => {
    if (!file) {
      console.log("Please select a file to upload.");
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    await fetch("/emails/find", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Network response was not ok.");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "processed_emails.csv"; // This should match the filename given in the Content-Disposition
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setLoading(false);
      })
      .catch((error) => console.error("Error downloading the file:", error));
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-8 xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">
          Upload File to extract emails
        </h2>

        <div className="font-[sans-serif] max-w-md mx-auto">
          <label className="text-base text-gray-500 font-semibold mb-2 block">
            Upload file
          </label>
          <input
            type="file"
            accept=".csv"
            className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-400 mt-2">
            Only CSV files are supported.
          </p>
        </div>

        <div className="flex justify-end items-end pb-2">
          <button
            className={`inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-6 py-2 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpload}
            disabled={loading}
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
                <span className="text-sm font-medium">Upload</span>
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
          <div className="flex flex-col items-center justify-center pb-4">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Please wait, your download is in progress...
            </div>
            <div className="overflow-auto h-32 w-full p-2 bg-gray-100 dark:bg-gray-700">
              {logs.map((log, index) => (
                <p
                  key={index}
                  className="text-gray-700 dark:text-gray-300 text-xs"
                >
                  {log}
                </p>
              ))}
              <div ref={logsEndRef}></div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default FindEmails;
