import React, { useState, useRef } from 'react';
import { FiCopy, FiCheck, FiGithub, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { useAppContext } from '../../store/AppContext';

interface CodeExampleShareProps {
  code: string;
  language: string;
  title?: string;
  description?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt?: Date;
  allowFork?: boolean;
  allowDownload?: boolean;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
  onFork?: () => void;
  onShare?: () => void;
}

/**
 * Code Example Share Component
 * Allows users to view, copy, and share code examples
 */
const CodeExampleShare: React.FC<CodeExampleShareProps> = ({
  code,
  language,
  title,
  description,
  author,
  createdAt,
  allowFork = true,
  allowDownload = true,
  readOnly = true,
  onCodeChange,
  onFork,
  onShare
}) => {
  const { addNotification } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Format date if provided
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : null;

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode)
      .then(() => {
        setCopied(true);
        addNotification({
          type: 'success',
          title: 'Copied!',
          message: 'Code copied to clipboard'
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        addNotification({
          type: 'error',
          title: 'Copy Failed',
          message: 'Failed to copy code to clipboard'
        });
      });
  };

  // Handle code changes in editable mode
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setEditableCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  // Handle downloading code
  const handleDownload = () => {
    const blob = new Blob([editableCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'code-example'}.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle fork button click
  const handleFork = () => {
    if (onFork) {
      onFork();
    } else {
      addNotification({
        type: 'info',
        title: 'Fork Code',
        message: 'This code example has been forked to your library'
      });
    }
  };

  // Get file extension based on language
  const getFileExtension = (lang: string): string => {
    const extensionMap: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      rust: 'rs',
      solidity: 'sol',
      html: 'html',
      css: 'css',
      json: 'json',
      go: 'go',
      csharp: 'cs',
      cpp: 'cpp',
      c: 'c',
      ruby: 'rb',
      php: 'php',
      swift: 'swift',
      kotlin: 'kt'
    };
    
    return extensionMap[lang.toLowerCase()] || 'txt';
  };

  return (
    <div className={`code-example-share rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden ${expanded ? 'fixed inset-4 z-50' : 'relative'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
              {title}
            </h3>
          )}
          
          {(author || formattedDate) && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {author && `By ${author.name}`}
              {author && formattedDate && ' • '}
              {formattedDate && `Posted on ${formattedDate}`}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Copy code"
            title="Copy code"
          >
            {copied ? <FiCheck /> : <FiCopy />}
          </button>
          
          {allowFork && (
            <button
              onClick={handleFork}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Fork code"
              title="Fork this code"
            >
              <FiGithub />
            </button>
          )}
          
          {allowDownload && (
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Download code"
              title="Download code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          )}
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={expanded ? "Exit fullscreen" : "Fullscreen"}
            title={expanded ? "Exit fullscreen" : "Fullscreen"}
          >
            {expanded ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
      </div>
      
      {/* Description (if provided) */}
      {description && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      )}
      
      {/* Code Section */}
      <div className="relative">
        <div className="absolute top-0 left-0 px-4 py-1 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-br">
          {language.toUpperCase()}
        </div>
        
        {readOnly ? (
          <pre className="language-code p-4 pt-8 overflow-x-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm">
            <code>{editableCode}</code>
          </pre>
        ) : (
          <textarea
            ref={textAreaRef}
            value={editableCode}
            onChange={handleCodeChange}
            className="w-full p-4 pt-8 min-h-[200px] bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm border-0 focus:ring-0 focus:outline-none resize-y"
            spellCheck="false"
            aria-label="Editable code"
          />
        )}
      </div>
    </div>
  );
};

export default CodeExampleShare; 