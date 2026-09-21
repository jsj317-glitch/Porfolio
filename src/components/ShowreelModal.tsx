import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, Film, UploadCloud, Check, Loader2 } from 'lucide-react';
import { saveUploadedFile, resolveMediaUrl } from '../utils/mediaStorage';

const DEFAULT_SHOWREEL =
  'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-grid-animation-43093-large.mp4';
const SHOWREEL_STORAGE_KEY = 'seonjeong_custom_showreel_v1';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ko' | 'en';
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({ isOpen, onClose, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(() => {
    try {
      return localStorage.getItem(SHOWREEL_STORAGE_KEY) || DEFAULT_SHOWREEL;
    } catch {
      return DEFAULT_SHOWREEL;
    }
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:30');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Attempt unmuted audio playback on open
      setIsPlaying(true);
      setAudioBlocked(false);
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.volume = volume;
          videoRef.current.muted = isMuted;
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Browser prevented autoplay with sound in showreel:', err);
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                setAudioBlocked(true);
                videoRef.current.play().catch(() => {});
              }
            });
          }
        }
      }, 150);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
      };
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMuted, volume]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted && videoRef.current.volume === 0) {
        videoRef.current.volume = 0.8;
        setVolume(0.8);
      }
      setAudioBlocked(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      if (newVol === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
        setAudioBlocked(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 30;
      setProgress((cur / dur) * 100);
      const curMin = Math.floor(cur / 60).toString().padStart(2, '0');
      const curSec = Math.floor(cur % 60).toString().padStart(2, '0');
      setCurrentTime(`${curMin}:${curSec}`);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 30;
      const durMin = Math.floor(dur / 60).toString().padStart(2, '0');
      const durSec = Math.floor(dur % 60).toString().padStart(2, '0');
      setDuration(`${durMin}:${durSec}`);
    }
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * (videoRef.current.duration || 30);
    }
  };

  const jumpToTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const res = await saveUploadedFile(file);
      setVideoSrc(res.url);
      try {
        localStorage.setItem(SHOWREEL_STORAGE_KEY, res.url);
      } catch (err) {
        console.error(err);
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetToDefault = () => {
    setVideoSrc(DEFAULT_SHOWREEL);
    try {
      localStorage.removeItem(SHOWREEL_STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  };

  const shotlist = [
    { time: 0, timecode: '00:00', title: '2D Motion & Kinetic Typography', titleKr: '2D 브랜드 모션 & 키네틱 타이포' },
    { time: 8, timecode: '00:08', title: '3D Kinetic Simulation & Shading', titleKr: '3D 키네틱 아트 & PBR 셰이딩' },
    { time: 16, timecode: '00:16', title: 'Cinematic Cut & Color Grading', titleKr: '시네마틱 영상 컷 & 색보정' },
    { time: 23, timecode: '00:23', title: 'Generative AI Direction & Posters', titleKr: '생성형 AI 디렉팅 & 포스터 디자인' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Hidden File Input for Showreel Video */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#1e2d42] bg-[#0c1422] shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#1c283c] px-5 py-3.5 bg-[#090e17] gap-2">
          <div className="flex items-center gap-2.5">
            <Film className="h-4 w-4 text-[#7a9ec7]" />
            <span className="font-syne text-sm font-bold tracking-wider text-white">
              SHOWREEL 2025/2026
            </span>
            <span className="rounded-full bg-[#131e2e] px-2 py-0.5 text-[10px] font-mono text-[#8bb2e2]">
              00:30 MASTER CUT
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Upload Showreel Video from local computer */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 rounded-lg border border-[#2a3f5c] bg-[#142337] px-3 py-1.5 text-xs font-semibold text-[#8bb2e2] transition-colors hover:bg-[#1f3654] hover:text-white"
              title="내 컴퓨터에서 쇼릴 비디오 파일(MP4, WebM 등) 직접 업로드"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : uploadSuccess ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <UploadCloud className="h-3.5 w-3.5" />
              )}
              <span>
                {uploadSuccess
                  ? '쇼릴 업로드 완료!'
                  : isUploading
                  ? '동영상 저장 중...'
                  : lang === 'ko'
                  ? '내 컴퓨터에서 비디오 교체'
                  : 'Upload My Video'}
              </span>
            </button>

            {videoSrc !== DEFAULT_SHOWREEL && (
              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-1 rounded-lg border border-[#1e2d42] px-2 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                title="기본 샘플 쇼릴로 복원"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="text-[11px]">{lang === 'ko' ? '기본 복원' : 'Reset'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-[#131e2e] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

          {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            src={resolveMediaUrl(videoSrc)}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="h-full w-full object-cover cursor-pointer"
            onClick={togglePlay}
          />

          {/* Autoplay Sound Blocked Banner */}
          {audioBlocked && (
            <div
              onClick={toggleMute}
              className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-black/80 px-3 py-1.5 backdrop-blur-md cursor-pointer hover:bg-black/95 transition-all text-amber-300"
            >
              <VolumeX className="h-4 w-4 animate-pulse" />
              <span className="text-xs font-medium">
                {lang === 'ko' ? '브라우저 음소거됨 — 클릭하여 소리 켜기' : 'Audio muted by browser — Click to unmute'}
              </span>
            </div>
          )}

          {/* Central Play/Pause Overlay Indicator */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3b5b82] text-white shadow-lg transition-transform hover:scale-110">
                <Play className="h-8 w-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Overlay Controls Bar */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
            {/* Scrubber */}
            <div
              onClick={seekTo}
              className="group relative mb-3 h-2 w-full cursor-pointer rounded-full bg-slate-800/80 transition-all hover:h-2.5"
            >
              <div
                className="h-full rounded-full bg-[#4d74a3] transition-all"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className="absolute top-1/2 -mt-1.5 h-3 w-3 -ml-1.5 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100 shadow-md"
                style={{ left: `${progress}%` }}
              ></div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="rounded p-1 text-white hover:text-[#8bb2e2] transition-colors"
                  title={isPlaying ? '일시 정지' : '재생'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-1.5 rounded p-1 text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? '소리 켜기 (M)' : '음소거 (M)'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-rose-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-[#8bb2e2]" />
                  )}
                  <span className="text-[11px] font-mono">
                    {isMuted ? '소리 꺼짐' : '오디오 ON'}
                  </span>
                </button>

                {/* Volume Slider */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="h-1.5 w-16 sm:w-20 cursor-pointer accent-[#6ca1e2] bg-slate-800 rounded-lg appearance-none"
                    title="볼륨 조절"
                  />
                  <span className="text-[10px] font-mono text-slate-400 w-7">
                    {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>

                <span className="font-mono text-[11px] text-slate-400">
                  {currentTime} / {duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => jumpToTime(0)}
                  className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                  title="Replay from start"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Restart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shotlist Navigation (Jump to scene) */}
        <div className="border-t border-[#1c283c] bg-[#090e17] p-4">
          <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-[#7a9ec7]">
            {lang === 'ko' ? '주요 시퀀스 타임라인 (클릭 시 이동)' : 'Sequence Timeline Breakdown (Click to jump)'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {shotlist.map((shot, idx) => (
              <button
                key={idx}
                onClick={() => jumpToTime(shot.time)}
                className="group flex flex-col rounded-lg border border-[#1e2d42] bg-[#0c1422] p-2.5 text-left transition-all hover:border-[#4d74a3] hover:bg-[#131e2e]"
              >
                <span className="font-mono text-[10px] text-[#8bb2e2] group-hover:underline">
                  {shot.timecode}
                </span>
                <span className="mt-1 text-xs font-medium text-slate-200 line-clamp-1">
                  {lang === 'ko' ? shot.titleKr : shot.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
