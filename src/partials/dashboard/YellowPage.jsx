import React, { useState } from "react";

function YellowPage() {
  const [keywords, setKeywords] = useState("");
  const [pageStart, setPageStart] = useState("");
  const [pageEnd, setPageEnd] = useState("");

  const handleDownload = () => {
    const keyword = keywords.split(" ").join("+");
    const start = pageStart;
    const end = pageEnd;
    const url = `/scrape?keyword=${keyword}&start=${start}&end=${end}`;

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
        a.download = `${keyword}_data.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-8 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">
          Yellow Page
        </h2>
        <div>
          <label
            htmlFor="Keywords"
            className="block text-xs font-medium text-gray-700 px-3"
          >
            {" "}
            Keywords{" "}
          </label>

          <input
            type="text"
            id="Keywords"
            placeholder="Enter the keyword you want to search for"
            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm px-2 py-2"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="PageNumberStart"
            className="block text-xs font-medium text-gray-700 px-3 pt-4"
          >
            {" "}
            Page Number Start{" "}
          </label>

          <input
            type="number"
            id="PageNumberStart"
            placeholder="The range of pages you want to scrape"
            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm px-2 py-2"
            value={pageStart}
            onChange={(e) => setPageStart(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="PageNumberEnd"
            className="block text-xs font-medium text-gray-700 px-3 pt-4"
          >
            {" "}
            Page Number End{" "}
          </label>

          <input
            type="number"
            id="PageNumberEnd"
            placeholder="The range of pages you want to scrape"
            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm px-2 py-2"
            value={pageEnd}
            onChange={(e) => setPageEnd(e.target.value)}
          />
        </div>
        <div className="flex justify-end pt-4 pb-2">
          <button
            className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-6 py-2 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            onClick={handleDownload}
          >
            <span className="text-sm font-medium"> Download </span>

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
          </button>
        </div>
      </header>
    </div>
  );
}

export default YellowPage;
