import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import '../Styles/IDE.css';

function IDE() {
  const [code, setCode] = useState('print("Hello, HappyFox Team!")');
  const [output, setOutput] = useState('Initializing Pyodide...');
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    // Dynamically load Pyodide script from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js'; // You can update version if needed
    script.async = true;

    script.onload = async () => {
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/',
        });
        setPyodide(pyodideInstance);
        setOutput('Pyodide loaded successfully.');
      } catch (error) {
        console.error('Pyodide load failed:', error);
        setOutput('Pyodide load failed: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    script.onerror = () => {
      setOutput('Failed to load Pyodide script.');
      setLoading(false);
    };

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCodeChange = (value) => {
    setCode(value ?? '');
  };

  const runCode = async () => {
    if (!pyodide) {
      setOutput('Pyodide not loaded yet. Please wait...');
      return;
    }
    setOutput('Running code...');

    // Wrap code to capture print output
    const codeToRun = `
import sys
import io
_stdout = sys.stdout
sys.stdout = io.StringIO()
try:
  exec("""
${code}
  """)
  output = sys.stdout.getvalue()
finally:
  sys.stdout = _stdout
output
    `.trim();

    try {
      let result = await pyodide.runPythonAsync(codeToRun);
      setOutput(`Output:\n${result || 'No output'}`);
    } catch (err) {
      setOutput(`Error:\n${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <h2>Python Online IDE</h2>
      <div className="ide-container">
        <Editor
          height="400px"
          defaultLanguage="python"
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
        />
        <button
          className="next-btn"
          onClick={runCode}
          disabled={loading || !pyodide}
        >
          {loading ? "Loading..." : "Run Code"}
        </button>
        <pre className="output">{output}</pre>
      </div>
    </div>
  );
}

export default IDE;
