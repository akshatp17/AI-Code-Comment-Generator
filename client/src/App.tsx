import React, { useState } from "react";
import { Copy, Download, Code, Moon } from "lucide-react";
import { generateComments } from "./services/comment-service";

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [commentedCode, setCommentedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateComments = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateComments(code, language);
      setCommentedCode(response.commented_code);
    } catch (error) {
      console.error("Error generating comments:", error);
      setCommentedCode("Error generating comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (commentedCode) {
      try {
        await navigator.clipboard.writeText(commentedCode);
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const handleDownload = () => {
    if (commentedCode) {
      const element = document.createElement("a");
      const file = new Blob([commentedCode], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `commented_code.${getFileExtension(language)}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const getFileExtension = (lang: string): string => {
    const extensions: { [key: string]: string } = {
      c: "c",
      cpp: "cpp",
      python: "py",
      java: "java",
      javascript: "js",
      golang: "go"
    };
    return extensions[lang] || "txt";
  };

  const handleNew = () => {
    setCode("");
    setCommentedCode("");
    setLanguage("javascript");
  };

  const handleThemeToggle = () => {
    console.log("Theme toggle button clicked");
    // Theme toggle functionality will be added later
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100 antialiased flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1 px-6 py-8">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-500 shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">AI Code Comment Generator</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Paste code → get clear, function-level comments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleThemeToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 cursor-pointer transition-colors duration-200"
            >
              <Moon className="w-4 h-4" />
              <span className="text-sm text-slate-300">Dark</span>
            </button>
            <button
              onClick={handleNew}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow cursor-pointer transition-colors duration-200"
            >
              New
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {/* LEFT: input form */}
          <section className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 shadow-inner flex flex-col">
            <form className="flex flex-col gap-4 flex-1" onSubmit={handleGenerateComments}>
              <label className="text-sm text-slate-300 flex items-center justify-between">
                <span>Paste your code</span>
                <span className="text-xs text-slate-400">
                  Helpful: include a few functions for best results
                </span>
              </label>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`def add(a, b):\n    return a + b\n\nfunction hello(name) {\n  return ` + "`Hello ${name}`;\n}"}
                className="w-full flex-1 p-4 rounded-md bg-[#071019] border border-slate-800 text-sm font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none cursor-text"
              />

              <div className="flex flex-col w-full gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 block mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-md bg-[#071019] border border-slate-800 px-3 py-2 text-sm text-slate-200 cursor-pointer"
                  >
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="golang">Go</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !code.trim()}
                  className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium cursor-pointer transition-colors duration-200"
                >
                  {isLoading ? "Generating..." : "Generate Comments"}
                </button>
              </div>
            </form>
          </section>

          {/* RIGHT: output preview */}
          <section className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800/60 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-medium">Commented Output</h2>
                <p className="text-xs text-slate-400">
                  Read-only preview. Copy or download when ready.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!commentedCode}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 disabled:bg-slate-800/20 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!commentedCode}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 disabled:bg-slate-800/20 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto border border-slate-800 rounded-lg p-4 bg-[#020409]">
              {commentedCode ? (
                <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap">
                  {commentedCode}
                </pre>
              ) : isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
                  <div className="p-4 rounded-full bg-slate-800/30 mb-3">
                    <Code className="w-6 h-6 text-slate-300 animate-spin" />
                  </div>
                  <p className="text-sm">Generating comments...</p>
                  <p className="text-xs mt-2 text-slate-500">
                    Please wait while we process your code.
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
                  <div className="p-4 rounded-full bg-slate-800/30 mb-3">
                    <Code className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm">Generated comments will appear here.</p>
                  <p className="text-xs mt-2 text-slate-500">
                    Try pasting a couple of functions and press{" "}
                    <strong>Generate Comments</strong>.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
