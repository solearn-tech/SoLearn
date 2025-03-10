import React from 'react';
import { type ReactNode, type FC, type ChangeEvent, type MouseEvent, type KeyboardEvent } from 'react';

// Declare module for React
declare module 'react' {
  export type ReactNode = 
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | boolean
    | null
    | undefined;
}

// Declare modules for Next.js
declare module 'next/router';
declare module 'next/image';
declare module 'next/head';
declare module 'next/link';

// Declare modules for React Icons
declare module 'react-icons/fi';
declare module 'react-icons/fa';
declare module 'react-icons/hi';

// Declare JSX namespace
namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Course related types
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  rating: number;
  enrollmentCount: number;
  tokenReward: number;
  category: string;
  instructor?: string;
  instructorTitle?: string;
  instructorAvatar?: string;
  modules: CourseModule[];
  prerequisites: string[];
  whatYouWillLearn: string[];
  longDescription: string;
}

interface CourseModule {
  id: string;
  title: string;
  duration: number;
  lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  videoUrl?: string;
  description?: string;
  resources?: LessonResource[];
}

interface LessonResource {
  title: string;
  url: string;
}

// Wallet context types
interface WalletContextState {
  connected: boolean;
  walletAddress: string | null;
  connecting: boolean;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  balance: number;
  learningTokens: number;
  error: string | null;
}

interface WalletContextProviderProps {
  children: React.ReactNode;
}

// Type declarations for missing libraries
declare module 'react-window';
declare module 'react-window-infinite-loader';
declare module 'react-virtualized-auto-sizer';
declare module 'react-query';
declare module 'axios';

// React extended type definitions
declare namespace React {
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }
  
  export type ReactNode = 
    | ReactElement
    | string
    | number
    | Iterable<ReactNode>
    | ReactPortal
    | boolean
    | null
    | undefined;
    
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  export type CSSProperties = {
    [key: string]: string | number | null | undefined;
  };
  
  export type Dispatch<A> = (value: A) => void;
  
  export interface UIEvent<T = Element> extends SyntheticEvent<T> {
    detail: number;
    view: Window;
  }
  
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  
  export interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget & T;
    timeStamp: number;
    type: string;
  }
  
  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    style?: CSSProperties;
    [key: string]: any;
  }
  
  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: 'submit' | 'reset' | 'button';
    value?: string | ReadonlyArray<string> | number;
  }
  
  export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    checked?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | ReadonlyArray<string> | number;
    width?: number | string;
  }
  
  export interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string;
    htmlFor?: string;
  }
  
  export interface AriaAttributes {
    [key: `aria-${string}`]: string | number | boolean | undefined;
  }
  
  export interface DOMAttributes<T> {
    children?: ReactNode;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
    onChange?: (event: ChangeEvent<T>) => void;
    onClick?: (event: MouseEvent<T>) => void;
    onKeyDown?: (event: KeyboardEvent<T>) => void;
    [key: string]: any;
  }
  
  export interface MouseEvent<T = Element> extends SyntheticEvent<T> {
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
  }
  
  export interface KeyboardEvent<T = Element> extends SyntheticEvent<T> {
    altKey: boolean;
    ctrlKey: boolean;
    key: string;
    keyCode: number;
    metaKey: boolean;
    shiftKey: boolean;
  }
}

// Jest and testing types
declare const describe: (name: string, fn: () => void) => void;
declare const beforeAll: (fn: () => void) => void;
declare const beforeEach: (fn: () => void) => void;
declare const afterAll: (fn: () => void) => void;
declare const afterEach: (fn: () => void) => void;
declare const test: (name: string, fn: () => void | Promise<void>, timeout?: number) => void;
declare const expect: any;
declare const jest: {
  fn: <T extends Function>(implementation?: T) => jest.Mock<T>;
  useFakeTimers: () => void;
  useRealTimers: () => void;
  advanceTimersByTime: (ms: number) => void;
  [key: string]: any;
};

declare interface jest {
  Mock<T extends Function>: {
    new (...args: any[]): T;
    mockImplementation: (fn: T) => jest.Mock<T>;
    mockReturnValue: (value: any) => jest.Mock<T>;
    mockReturnThis: () => jest.Mock<T>;
    mockRestore: () => void;
    mockReset: () => void;
    mockClear: () => void;
    [key: string]: any;
  };
}

// Node.js globals
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string;
    [key: string]: string | undefined;
  }
  
  interface Timeout {
    // No specific properties needed for this use case
  }
  
  interface Global {
    document: Document;
    window: Window;
    [key: string]: any;
  }
}

declare const global: NodeJS.Global;
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  };
};

// React-Query and Axios declarations
declare module 'react-query' {
  export function useQuery<TData = any, TError = unknown>(
    queryKey: string | unknown[],
    queryFn: () => Promise<TData>,
    options?: any
  ): {
    data: TData | undefined;
    isLoading: boolean;
    error: TError | null;
    refetch: () => Promise<any>;
  };
  
  export function useMutation<TData = any, TVariables = any, TError = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: any
  ): {
    mutate: (variables: TVariables, options?: any) => void;
    isLoading: boolean;
    error: TError | null;
    data: TData | undefined;
  };
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: Record<string, string>;
    params?: any;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    responseType?: string;
    [key: string]: any;
  }
  
  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
    request?: any;
  }
  
  export interface AxiosError<T = any> extends Error {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;
    toJSON: () => object;
  }
  
  export function create(config?: AxiosRequestConfig): AxiosInstance;
  
  export interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<AxiosResponse>;
    (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    interceptors: {
      request: any;
      response: any;
    };
  }
}

declare module 'react-window' {
  export interface ListChildComponentProps {
    index: number;
    style: React.CSSProperties;
    data: any;
  }
  
  export interface FixedSizeListProps {
    height: number;
    width: number | string;
    itemCount: number;
    itemSize: number;
    children: React.ComponentType<ListChildComponentProps>;
    itemData?: any;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  
  export class FixedSizeList extends React.Component<FixedSizeListProps> {}
}

// App context interface
export interface AppContextType {
  user: {
    id: string;
    name: string;
    [key: string]: any;
  } | null;
  isAuthenticated: boolean;
  addNotification: (notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    id?: string;
    duration?: number;
  }) => void;
  wallet: WalletContextState;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  loading: boolean;
  error: string | null;
  courses: Course[];
  currentCourse: Course | null;
  setCurrentCourse: (course: Course | null) => void;
  recentCourses: Course[];
  addRecentCourse: (course: Course) => void;
  clearError: () => void;
} 