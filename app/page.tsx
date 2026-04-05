"use client";

import { useState, useCallback } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { motion } from "motion/react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let validChars = "";
    if (includeUppercase) validChars += uppercaseChars;
    if (includeLowercase) validChars += lowercaseChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSymbols) validChars += symbolChars;

    if (validChars === "") {
      setPassword("");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[randomIndex];
    }

    setPassword(generatedPassword);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateStrength = () => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (password.length >= 16) score += 1;
    if (includeUppercase) score += 1;
    if (includeLowercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;
    
    // Max score is 7
    return Math.min(4, Math.ceil(score / 1.75)); // 0 to 4
  };

  const strength = calculateStrength();
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"];

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans text-neutral-100 selection:bg-emerald-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-white tracking-tight">Password Generator</h1>
          
          {/* Password Display */}
          <div className="relative mb-8 group">
            <div className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 pr-14 text-xl font-mono text-center break-all min-h-[72px] flex items-center justify-center text-emerald-400 shadow-inner">
              {password || <span className="text-neutral-600 text-sm font-sans">Click Generate Password</span>}
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Strength Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-neutral-400 font-medium">Password Strength</span>
              <span className={`font-semibold tracking-wide uppercase text-xs ${strength > 2 ? 'text-emerald-400' : strength > 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                {password ? strengthLabels[strength] : "-"}
              </span>
            </div>
            <div className="flex gap-1.5 h-1.5">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-full transition-all duration-500 ${
                    password && i < strength ? strengthColors[strength] : 'bg-neutral-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-neutral-300">Password Length</label>
                <span className="text-lg font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg">{length}</span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 pt-2">
              <CheckboxRow 
                label="Include Uppercase Letters" 
                checked={includeUppercase} 
                onChange={setIncludeUppercase} 
              />
              <CheckboxRow 
                label="Include Lowercase Letters" 
                checked={includeLowercase} 
                onChange={setIncludeLowercase} 
              />
              <CheckboxRow 
                label="Include Numbers" 
                checked={includeNumbers} 
                onChange={setIncludeNumbers} 
              />
              <CheckboxRow 
                label="Include Symbols" 
                checked={includeSymbols} 
                onChange={setIncludeSymbols} 
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            className="w-full mt-10 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
          >
            <RefreshCw className="w-5 h-5" />
            Generate Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group p-1 -m-1 rounded-lg hover:bg-neutral-800/50 transition-colors">
      <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{label}</span>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </div>
    </label>
  );
}
