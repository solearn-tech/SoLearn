import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { FiPlay, FiCheck, FiRefreshCw, FiHelpCircle, FiBook, FiCode } from 'react-icons/fi';
import LoadingState from '../common/LoadingState';
import CodeExampleShare from './CodeExampleShare';

// Exercise type definition
export type ExerciseType = 'code' | 'quiz' | 'fill-blank' | 'match';

// Exercise validation status
export type ValidationStatus = 'idle' | 'validating' | 'success' | 'error';

// Exercise difficulty level
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Exercise interface
export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  description: string;
  instructions: string;
  difficulty: DifficultyLevel;
  // Specific properties for different exercise types
  codeTemplate?: string;
  language?: string;
  solution?: string;
  testCases?: TestCase[];
  hints?: string[];
  points: number;
  timeLimit?: number; // in seconds
}

// Test case interface
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

// Exercise execution result
export interface ExerciseResult {
  success: boolean;
  message: string;
  testResults?: TestResult[];
  executionTime?: number;
  score?: number;
}

// Test result
export interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  message?: string;
}

interface InteractiveExerciseProps {
  exercise: Exercise;
  onComplete?: (result: ExerciseResult) => void;
  onCodeChange?: (code: string) => void;
}

// Timer type definition to fix NodeJS.Timeout error
type TimerType = ReturnType<typeof setTimeout> | null;

/**
 * Interactive Exercise Component
 * Supports code editing, execution, and validation
 */
const InteractiveExercise = ({
  exercise,
  onComplete,
  onCodeChange
}: InteractiveExerciseProps) => {
  // User code state
  const [code, setCode] = useState(exercise.codeTemplate || '');
  // Execution result state
  const [result, setResult] = useState<ExerciseResult | null>(null);
  // Validation status
  const [validationStatus, setValidationStatus] = useState('idle' as ValidationStatus);
  // Whether to show hints
  const [showHints, setShowHints] = useState(false);
  // Current hint index
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  // Whether to show solution
  const [showSolution, setShowSolution] = useState(false);
  // Remaining time (if there's a time limit)
  const [timeLeft, setTimeLeft] = useState(exercise.timeLimit || 0);
  // Whether in fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Console output
  const [consoleOutput, setConsoleOutput] = useState('');
  
  // Timer reference
  const timerRef = useRef<TimerType>(null);
  
  // Initialize exercise and timer
  useEffect(() => {
    // Reset state
    setCode(exercise.codeTemplate || '');
    setResult(null);
    setValidationStatus('idle');
    setShowHints(false);
    setCurrentHintIndex(0);
    setShowSolution(false);
    setConsoleOutput('');
    
    // If there's a time limit, set countdown
    if (exercise.timeLimit) {
      setTimeLeft(exercise.timeLimit);
      
      // Clear old timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start new timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            // Time's up, clear timer
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Clear timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [exercise]);
  
  // Auto-submit when time's up
  useEffect(() => {
    if (timeLeft === 0 && exercise.timeLimit) {
      handleRunCode(true);
    }
  }, [timeLeft]);
  
  // Handle code change
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };
  
  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle code execution
  const handleRunCode = async (isSubmission = false) => {
    // Set validation status
    setValidationStatus(isSubmission ? 'validating' : 'idle');
    setConsoleOutput('');
    
    try {
      // Simulate API call to execute code
      const executionResult = await simulateCodeExecution(code, exercise, isSubmission);
      
      setResult(executionResult);
      setConsoleOutput(generateConsoleOutput(executionResult));
      
      // If it's a submission request, update validation status
      if (isSubmission) {
        setValidationStatus(executionResult.success ? 'success' : 'error');
        
        // If there's a completion callback, call it
        if (onComplete) {
          onComplete(executionResult);
        }
      }
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during code execution';
      
      setResult({
        success: false,
        message: errorMessage,
        executionTime: 0,
        score: 0
      });
      
      setConsoleOutput(`Error: ${errorMessage}`);
      
      if (isSubmission) {
        setValidationStatus('error');
      }
    }
  };
  
  // Simulate code execution (should be replaced with real API call in production)
  const simulateCodeExecution = async (
    userCode: string, 
    exercise: Exercise, 
    isSubmission: boolean
  ): Promise<ExerciseResult> => {
    // Add an artificial delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // If there are no test cases, return basic result
    if (!exercise.testCases || exercise.testCases.length === 0) {
      return {
        success: true,
        message: 'Code executed, but no validation tests available',
        executionTime: 0.5,
        score: 0
      };
    }
    
    // Simulate test results
    const testResults: TestResult[] = exercise.testCases.map(testCase => {
      // In real implementation, code should be run and output compared
      // Now we're just simulating some results
      const random = Math.random();
      const passed = isSubmission 
        // More precise validation logic for submissions
        ? testCase.expectedOutput.trim() === `Simulated output for ${testCase.input}`.trim() || random > 0.3
        // More lenient validation when just running
        : random > 0.2;
        
      return {
        testCaseId: testCase.id,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: passed 
          ? testCase.expectedOutput 
          : `Simulated output for ${testCase.input}`,
        message: passed 
          ? 'Test passed' 
          : 'Output does not match expected value'
      };
    });
    
    // Calculate pass rate and score
    const passedCount = testResults.filter(r => r.passed).length;
    const totalCount = testResults.length;
    const successRate = totalCount > 0 ? passedCount / totalCount : 0;
    const success = successRate >= 0.7; // At least 70% of tests must pass for success
    
    // Calculate score
    const score = Math.round(exercise.points * successRate);
    
    return {
      success,
      message: success 
        ? `Success! Passed ${passedCount}/${totalCount} tests.` 
        : `Tests failed. Passed ${passedCount}/${totalCount} tests.`,
      testResults,
      executionTime: 0.5 + Math.random(),
      score
    };
  };
  
  // Generate console output
  const generateConsoleOutput = (result: ExerciseResult): string => {
    let output = '';
    
    if (result.testResults) {
      output += `Execution time: ${result.executionTime?.toFixed(2)}s\n\n`;
      
      result.testResults.forEach((testResult, index) => {
        const testCase = exercise.testCases?.find(tc => tc.id === testResult.testCaseId);
        const isHidden = testCase?.isHidden;
        
        output += `Test #${index + 1}: ${testResult.passed ? '✅ Passed' : '❌ Failed'}\n`;
        
        if (!isHidden || !testResult.passed) {
          output += `Input: ${testResult.input}\n`;
          output += `Expected output: ${testResult.expectedOutput}\n`;
          
          if (!testResult.passed) {
            output += `Actual output: ${testResult.actualOutput}\n`;
          }
        }
        
        if (testResult.message) {
          output += `${testResult.message}\n`;
        }
        
        output += '\n';
      });
      
      if (result.score !== undefined) {
        output += `Score: ${result.score}/${exercise.points}\n`;
      }
    } else {
      output = result.message;
    }
    
    return output;
  };
  
  // Show next hint
  const showNextHint = () => {
    if (exercise.hints && currentHintIndex < exercise.hints.length - 1) {
      setCurrentHintIndex((prevIndex: number) => prevIndex + 1);
    }
  };
  
  // Reset exercise
  const resetExercise = () => {
    setCode(exercise.codeTemplate || '');
    setResult(null);
    setValidationStatus('idle');
    setShowHints(false);
    setCurrentHintIndex(0);
    setShowSolution(false);
    setConsoleOutput('');
  };
  
  // Render hints
  const renderHints = () => {
    if (!exercise.hints || exercise.hints.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400">No hints available.</p>;
    }
    
    return (
      <div className="space-y-2">
        {exercise.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">{hint}</p>
          </div>
        ))}
        
        {currentHintIndex < exercise.hints.length - 1 && (
          <button
            onClick={showNextHint}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Show Next Hint
          </button>
        )}
      </div>
    );
  };
  
  // Render exercise result
  const renderResult = () => {
    if (!result) return null;
    
    return (
      <div className={`p-4 border rounded-lg ${
        validationStatus === 'success' 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : validationStatus === 'error' 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}>
        <h4 className={`text-lg font-medium mb-2 ${
          validationStatus === 'success' 
            ? 'text-green-700 dark:text-green-300' 
            : validationStatus === 'error' 
              ? 'text-red-700 dark:text-red-300'
              : 'text-gray-700 dark:text-gray-300'
        }`}>
          {validationStatus === 'success' 
            ? 'Exercise Completed' 
            : validationStatus === 'error' 
              ? 'Needs Correction'
              : 'Execution Results'}
        </h4>
        
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {result.message}
        </p>
        
        {/* Console output */}
        <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-auto max-h-60">
          <pre>{consoleOutput}</pre>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`interactive-exercise-container ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-auto p-4' : ''}`}>
      {/* Exercise header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {exercise.title}
            </h3>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  exercise.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  exercise.difficulty === 'advanced' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
              </span>
              
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {exercise.points} points
              </span>
              
              {exercise.timeLimit && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${timeLeft > 60 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                    timeLeft > 30 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              title="Hints"
            >
              <FiHelpCircle />
            </button>
            
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
              title="View Solution"
              disabled={validationStatus !== 'success'}
            >
              <FiBook />
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            >
              <FiCode />
            </button>
          </div>
        </div>
        
        {/* Description and instructions */}
        <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="mb-3">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-300">{exercise.description}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Task</h4>
              <p className="text-gray-600 dark:text-gray-300">{exercise.instructions}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hints area */}
      {showHints && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Hints</h4>
          {renderHints()}
        </div>
      )}
      
      {/* Code editor */}
      <div className="mb-6">
        <CodeExampleShare
          code={code}
          language={exercise.language || 'javascript'}
          readOnly={false}
          onCodeChange={handleCodeChange}
          allowFork={false}
          allowDownload={true}
        />
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => handleRunCode(false)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          disabled={validationStatus === 'validating'}
        >
          <FiPlay className="mr-2" />
          Run Code
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={resetExercise}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            disabled={validationStatus === 'validating'}
          >
            <FiRefreshCw className="mr-2" />
            Reset
          </button>
          
          <button
            onClick={() => handleRunCode(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            disabled={validationStatus === 'validating'}
          >
            <FiCheck className="mr-2" />
            Submit
          </button>
        </div>
      </div>
      
      {/* Results area */}
      {(validationStatus === 'validating') && (
        <div className="mb-6">
          <LoadingState text="Validating your code..." />
        </div>
      )}
      
      {result && renderResult()}
      
      {/* Solution area */}
      {showSolution && exercise.solution && (
        <div className="mt-6 bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <h4 className="text-lg font-medium text-purple-900 dark:text-purple-300 mb-2">Reference Solution</h4>
          <CodeExampleShare
            code={exercise.solution}
            language={exercise.language || 'javascript'}
            readOnly={true}
            allowFork={false}
            allowDownload={true}
          />
        </div>
      )}
    </div>
  );
};

export default InteractiveExercise; 