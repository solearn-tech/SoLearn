import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize } from 'react-icons/fi';

interface CoursePlayerProps {
  videoUrl: string;
  title: string;
  lessonId: string;
  onComplete?: () => void;
  currentTime?: number;
}

const CoursePlayer = ({
  videoUrl,
  title,
  lessonId,
  onComplete,
  currentTime = 0
}: CoursePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTimeState, setCurrentTimeState] = useState(currentTime);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Save progress to local storage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`lesson-progress-${lessonId}`);
    if (savedProgress) {
      setCurrentTimeState(parseFloat(savedProgress));
    }
  }, [lessonId]);

  // Function to save progress
  const saveProgress = (time: number) => {
    localStorage.setItem(`lesson-progress-${lessonId}`, time.toString());
    setCurrentTimeState(time);
    
    // Check if course is completed (assuming 90% watched counts as complete)
    if (duration > 0 && time / duration > 0.9 && onComplete) {
      onComplete();
    }
  };

  // Handle video element reference
  const handleVideoRef = (element: HTMLVideoElement | null) => {
    if (element) {
      // Set initial time
      element.currentTime = currentTimeState;
      
      // Set volume
      element.volume = volume;
      element.muted = isMuted;
      
      // Listen for timeupdate event
      element.addEventListener('timeupdate', () => {
        setProgress((element.currentTime / element.duration) * 100);
        saveProgress(element.currentTime);
      });
      
      // Listen for metadata loaded event to get video duration
      element.addEventListener('loadedmetadata', () => {
        setDuration(element.duration);
      });
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    const video = document.querySelector('video');
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const video = document.querySelector('video');
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainer.requestFullscreen();
      }
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = percentage * video.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="video-container bg-black rounded-lg overflow-hidden relative">
      <video
        ref={handleVideoRef}
        className="w-full h-auto"
        src={videoUrl}
        poster="/images/course-placeholder.jpg"
        onClick={togglePlay}
      />
      
      {/* Video Title */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
        <h3 className="text-white font-medium">{title}</h3>
      </div>
      
      {/* Play Control Layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="bg-primary-500/80 hover:bg-primary-600/80 text-white rounded-full p-4 backdrop-blur-sm transition-transform transform hover:scale-110"
          >
            <FiPlay size={24} />
          </button>
        )}
      </div>
      
      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        {/* Progress Bar */}
        <div
          className="progress-bar h-1 bg-gray-600 rounded-full mb-2 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary-400"
            >
              {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
            </button>
            
            <button
              onClick={toggleMute}
              className="text-white hover:text-primary-400"
            >
              {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
            </button>
            
            <div className="text-white text-sm">
              {formatTime(currentTimeState)} / {formatTime(duration)}
            </div>
          </div>
          
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-primary-400"
          >
            <FiMaximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer; 