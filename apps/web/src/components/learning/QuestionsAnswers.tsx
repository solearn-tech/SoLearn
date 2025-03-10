import React, { useState, useEffect, ChangeEvent as ReactChangeEvent } from 'react';
import { FiMessageCircle, FiThumbsUp, FiThumbsDown, FiCheck, FiEdit2, FiTrash2, FiFlag, FiFilter } from 'react-icons/fi';
import { useAppContext } from '../../store/AppContext';
import { useDataFetching, useDataMutation } from '../../hooks/useDataFetching';
import LoadingState from '../common/LoadingState';

// Question interface
export interface Question {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: {
    name: string;
    avatar?: string;
    level: number;
  };
  createdAt: Date;
  updatedAt?: Date;
  tags: string[];
  upvotes: number;
  downvotes: number;
  isResolved: boolean;
  answerCount: number;
  acceptedAnswerId?: string;
}

// Answer interface
export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  author: {
    name: string;
    avatar?: string;
    level: number;
  };
  createdAt: Date;
  updatedAt?: Date;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
}

// Question filter options
export type QuestionFilter = 'all' | 'unanswered' | 'resolved' | 'my-questions' | 'my-answers';
export type QuestionSort = 'recent' | 'top' | 'active';

// Props interface
interface QuestionsAnswersProps {
  courseId: string;
  lessonId?: string;
  userId?: string;
  tags?: string[];
  limit?: number;
}

// User interface for context
interface User {
  id: string;
  name: string;
  // Add other user properties as needed
}

// Notification interface for context
interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  id?: string;
  duration?: number;
}

// App context interface
interface AppContextValues {
  user: User | null;
  isAuthenticated: boolean;
  addNotification: (notification: Notification) => void;
}

/**
 * Questions and Answers Component
 * Displays and manages questions and answers for a course or lesson
 */
const QuestionsAnswers = ({ 
  courseId, 
  lessonId, 
  userId,
  tags,
  limit = 10
}: QuestionsAnswersProps) => {
  // Use a type assertion for the app context to resolve type errors
  const { user, isAuthenticated, addNotification } = useAppContext() as unknown as AppContextValues;
  
  // State management
  const [filter, setFilter] = useState('all' as QuestionFilter);
  const [sort, setSort] = useState('recent' as QuestionSort);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  
  // Form state
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionTags, setQuestionTags] = useState<string[]>(tags || []);
  const [answerContent, setAnswerContent] = useState('');
  
  // API parameters
  const queryParams = {
    courseId,
    lessonId,
    filter,
    sort,
    page,
    limit,
    search: searchQuery,
    authorId: filter === 'my-questions' ? userId : undefined,
    answeredBy: filter === 'my-answers' ? userId : undefined,
    tags: questionTags.length > 0 ? questionTags.join(',') : undefined
  };
  
  // Fetch questions
  const { 
    data: questionsData, 
    isLoading: isLoadingQuestions,
    refetch: refetchQuestions
  } = useDataFetching(
    ['questions', queryParams],
    '/questions',
    queryParams
  );
  
  // Fetch answers if a question is selected
  const { 
    data: answersData, 
    isLoading: isLoadingAnswers,
    refetch: refetchAnswers
  } = useDataFetching(
    ['answers', selectedQuestion],
    `/questions/${selectedQuestion}/answers`,
    undefined,
    { enabled: !!selectedQuestion }
  );
  
  // Mutations for creating questions and answers
  const { mutate: createQuestion } = useDataMutation(
    'questions',
    '/questions',
    'POST',
    {
      onSuccess: () => {
        setShowNewQuestionForm(false);
        setQuestionTitle('');
        setQuestionContent('');
        addNotification({
          type: 'success',
          title: 'Question Posted',
          message: 'Your question has been posted successfully'
        });
        refetchQuestions();
      }
    }
  );
  
  const { mutate: createAnswer } = useDataMutation(
    'answers',
    '/answers',
    'POST',
    {
      onSuccess: () => {
        setShowAnswerForm(false);
        setAnswerContent('');
        addNotification({
          type: 'success',
          title: 'Answer Posted',
          message: 'Your answer has been posted successfully'
        });
        refetchAnswers();
      }
    }
  );
  
  // Vote mutations
  const { mutate: voteQuestion } = useDataMutation(
    'question-votes',
    '/votes/question',
    'POST'
  );
  
  const { mutate: voteAnswer } = useDataMutation(
    'answer-votes',
    '/votes/answer',
    'POST'
  );
  
  // Accept answer mutation
  const { mutate: acceptAnswer } = useDataMutation(
    'accept-answer',
    '/answers/accept',
    'POST',
    {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Answer Accepted',
          message: 'You have accepted this answer'
        });
        refetchQuestions();
        refetchAnswers();
      }
    }
  );
  
  // Handle question submission
  const handleSubmitQuestion = () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in to ask a question'
      });
      return;
    }
    
    if (!questionTitle.trim() || !questionContent.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide both a title and content for your question'
      });
      return;
    }
    
    createQuestion({
      title: questionTitle,
      content: questionContent,
      courseId,
      lessonId,
      tags: questionTags
    });
  };
  
  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in to answer'
      });
      return;
    }
    
    if (!answerContent.trim() || !selectedQuestion) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide content for your answer'
      });
      return;
    }
    
    createAnswer({
      questionId: selectedQuestion,
      content: answerContent
    });
  };
  
  // Handle voting on a question
  const handleQuestionVote = (questionId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in to vote'
      });
      return;
    }
    
    voteQuestion({ questionId, vote: voteType }, {
      onSuccess: () => refetchQuestions()
    });
  };
  
  // Handle voting on an answer
  const handleAnswerVote = (answerId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in to vote'
      });
      return;
    }
    
    voteAnswer({ answerId, vote: voteType }, {
      onSuccess: () => refetchAnswers()
    });
  };
  
  // Handle accepting an answer
  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    acceptAnswer({ questionId, answerId });
  };
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Questions section
  const renderQuestions = () => {
    const questions = questionsData?.data || [];
    
    if (isLoadingQuestions) {
      return <LoadingState text="Loading questions..." />;
    }
    
    if (questions.length === 0) {
      return (
        <div className="text-center py-8 px-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery 
              ? 'Try adjusting your search or filters' 
              : filter === 'my-questions' 
                ? 'You have not asked any questions yet' 
                : 'Be the first to ask a question!'}
          </p>
          <button
            onClick={() => setShowNewQuestionForm(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
          >
            <FiMessageCircle className="mr-2" />
            Ask a Question
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4 mb-6">
        {questions.map((question: Question) => (
          <div 
            key={question.id}
            className={`p-4 bg-white dark:bg-gray-800 rounded-lg border ${
              selectedQuestion === question.id 
                ? 'border-primary-400 dark:border-primary-500' 
                : 'border-gray-200 dark:border-gray-700'
            } ${question.isResolved ? 'border-l-4 border-l-green-500' : ''}`}
          >
            <div className="flex items-start">
              {/* Voting */}
              <div className="flex flex-col items-center mr-4">
                <button 
                  onClick={() => handleQuestionVote(question.id, 'up')}
                  className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
                  aria-label="Upvote"
                >
                  <FiThumbsUp />
                </button>
                <span className="my-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {question.upvotes - question.downvotes}
                </span>
                <button 
                  onClick={() => handleQuestionVote(question.id, 'down')}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none"
                  aria-label="Downvote"
                >
                  <FiThumbsDown />
                </button>
              </div>
              
              {/* Question content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 
                    className="text-lg font-medium text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setSelectedQuestion(question.id)}
                  >
                    {question.title}
                    {question.isResolved && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <FiCheck className="mr-1" />
                        Resolved
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">{question.answerCount} {question.answerCount === 1 ? 'answer' : 'answers'}</span>
                    <span>{formatDate(question.createdAt)}</span>
                  </div>
                </div>
                
                <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                  {question.content}
                </p>
                
                <div className="mt-3 flex flex-wrap items-center">
                  <div className="flex items-center mr-4">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {question.author.avatar ? (
                        <img src={question.author.avatar} alt={question.author.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                          {question.author.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {question.author.name}
                      <span className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                        Lv.{question.author.level}
                      </span>
                    </span>
                  </div>
                  
                  {question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
                      {question.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Pagination */}
        {questionsData?.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {questionsData.totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(questionsData.totalPages, page + 1))}
                disabled={page === questionsData.totalPages}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    );
  };
  
  // Answers section
  const renderAnswers = () => {
    if (!selectedQuestion) return null;
    
    const question = (questionsData?.data || []).find((q: Question) => q.id === selectedQuestion);
    const answers = answersData?.data || [];
    
    if (isLoadingAnswers) {
      return <LoadingState text="Loading answers..." />;
    }
    
    return (
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Selected question header */}
        {question && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {question.title}
                {question.isResolved && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <FiCheck className="mr-1" />
                    Resolved
                  </span>
                )}
              </h2>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Back to Questions
              </button>
            </div>
            
            <div className="mt-4 text-gray-600 dark:text-gray-300">
              {question.content}
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {question.author.avatar ? (
                    <img src={question.author.avatar} alt={question.author.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                      {question.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {question.author.name}
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                    Lv.{question.author.level}
                  </span>
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(question.createdAt)}
              </div>
            </div>
          </div>
        )}
        
        {/* Answers list */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h3>
          
          {answers.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No answers yet. Be the first to answer this question!
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((answer: Answer) => (
                <div 
                  key={answer.id}
                  className={`p-4 rounded-lg border ${
                    answer.isAccepted 
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex">
                    {/* Voting */}
                    <div className="flex flex-col items-center mr-4">
                      <button 
                        onClick={() => handleAnswerVote(answer.id, 'up')}
                        className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
                        aria-label="Upvote"
                      >
                        <FiThumbsUp />
                      </button>
                      <span className="my-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {answer.upvotes - answer.downvotes}
                      </span>
                      <button 
                        onClick={() => handleAnswerVote(answer.id, 'down')}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none"
                        aria-label="Downvote"
                      >
                        <FiThumbsDown />
                      </button>
                      
                      {/* Accept answer button (if user is question author) */}
                      {question && 
                       user && 
                       question.authorId === user.id && 
                       !question.isResolved && (
                        <button
                          onClick={() => handleAcceptAnswer(question.id, answer.id)}
                          className={`mt-2 w-6 h-6 flex items-center justify-center rounded-full ${
                            answer.isAccepted 
                              ? 'bg-green-500 text-white' 
                              : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                          }`}
                          aria-label="Accept answer"
                          title="Accept this answer"
                        >
                          <FiCheck />
                        </button>
                      )}
                      
                      {/* Accepted indicator */}
                      {answer.isAccepted && question?.authorId !== user?.id && (
                        <div className="mt-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                          <FiCheck />
                        </div>
                      )}
                    </div>
                    
                    {/* Answer content */}
                    <div className="flex-1">
                      <div className="text-gray-600 dark:text-gray-300">
                        {answer.content}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            {answer.author.avatar ? (
                              <img src={answer.author.avatar} alt={answer.author.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                                {answer.author.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {answer.author.name}
                            <span className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                              Lv.{answer.author.level}
                            </span>
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(answer.createdAt)}
                          {answer.isAccepted && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <FiCheck className="mr-1" />
                              Accepted Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Answer form */}
          {isAuthenticated && (
            <div className="mt-6">
              {showAnswerForm ? (
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your Answer</h4>
                  <textarea
                    value={answerContent}
                    onChange={(e: ReactChangeEvent<HTMLTextAreaElement>) => setAnswerContent(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    rows={6}
                    placeholder="Type your answer here..."
                  ></textarea>
                  <div className="flex justify-end mt-3 space-x-3">
                    <button
                      onClick={() => setShowAnswerForm(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAnswer}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswerForm(true)}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center"
                >
                  <FiMessageCircle className="mr-2" />
                  Answer this Question
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="questions-answers-container">
      {/* Header section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Questions & Answers
        </h2>
        <button
          onClick={() => setShowNewQuestionForm(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
        >
          <FiMessageCircle className="mr-2" />
          Ask a Question
        </button>
      </div>
      
      {/* Question form */}
      {showNewQuestionForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Ask a New Question
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="question-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                id="question-title"
                type="text"
                value={questionTitle}
                onChange={(e: ReactChangeEvent<HTMLInputElement>) => setQuestionTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                placeholder="What's your question about?"
              />
            </div>
            
            <div>
              <label htmlFor="question-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="question-content"
                value={questionContent}
                onChange={(e: ReactChangeEvent<HTMLTextAreaElement>) => setQuestionContent(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                rows={6}
                placeholder="Provide details about your question..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="question-tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <input
                id="question-tags"
                type="text"
                value={questionTags.join(', ')}
                onChange={(e: ReactChangeEvent<HTMLInputElement>) => setQuestionTags(e.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                placeholder="Add tags separated by commas (e.g. solana, programming, nft)"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewQuestionForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuestion}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!selectedQuestion && (
        <>
          {/* Filters and search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    filter === 'all' 
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  All Questions
                </button>
                
                <button 
                  onClick={() => setFilter('unanswered')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    filter === 'unanswered' 
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Unanswered
                </button>
                
                <button 
                  onClick={() => setFilter('resolved')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    filter === 'resolved' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Resolved
                </button>
                
                {isAuthenticated && (
                  <>
                    <button 
                      onClick={() => setFilter('my-questions')}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        filter === 'my-questions' 
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      My Questions
                    </button>
                    
                    <button 
                      onClick={() => setFilter('my-answers')}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        filter === 'my-answers' 
                          ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      My Answers
                    </button>
                  </>
                )}
              </div>
              
              {/* Sort and search */}
              <div className="flex flex-col sm:flex-row gap-2 md:ml-auto">
                <div className="flex items-center">
                  <FiFilter className="text-gray-400 mr-2" />
                  <select
                    value={sort}
                    onChange={(e: ReactChangeEvent<HTMLSelectElement>) => setSort(e.target.value as QuestionSort)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-0 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="top">Top Voted</option>
                    <option value="active">Most Active</option>
                  </select>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e: ReactChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full px-3 py-1.5 pl-10 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-0 focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Questions list */}
          {renderQuestions()}
        </>
      )}
      
      {/* Selected question with answers */}
      {selectedQuestion && renderAnswers()}
    </div>
  );
};

export default QuestionsAnswers; 