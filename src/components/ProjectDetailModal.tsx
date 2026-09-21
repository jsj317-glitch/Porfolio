import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { resolveMediaUrl } from '../utils/mediaStorage';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Edit2,
  Share2,
  Check,
  Sparkles,
  Layers,
  Clock,
  Wrench,
  User,
  Sliders,
  Trash2,
  Film
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onNextProject: () => void;
  onPrevProject: () => void;
  onDeleteProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  isAdminAuthed?: boolean;
  lang: 'ko' | 'en';
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onNextProject,
  onPrevProject,
  onDeleteProject,
  onEditProject,
  isAdminAuthed,
  lang,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState('00:00');
  const [videoCurrentTime, setVideoCurrentTime] = useState('00:00');
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Rich Lightbox State
  const [activeLightbox, setActiveLightbox] = useState<{ url: string; title: string } | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [isVideoCinema, setIsVideoCinema] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const openLightbox = (url: string, title?: string) => {
    setActiveLightbox({ url, title: title || (project?.title ?? '') });
    setLightboxZoom(1);
  };

  const closeLightbox = () => {
    setActiveLightbox(null);
    setLightboxZoom(1);
  };

  const toggleFullscreenVideo = () => {
    const el = videoContainerRef.current || videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {
          setIsVideoCinema((prev) => !prev);
        });
      } else {
        setIsVideoCinema((prev) => !prev);
      }
    }
  };

  // When project opens or changes, attempt unmuted playback
  useEffect(() => {
    if (!project) return;
    setIsVideoPlaying(true);
    setAudioBlocked(false);

    // Give the DOM a moment to mount the video element
    const timer = setTimeout(() => {
      if (videoRef.current && project.heroMediaType === 'video') {
        videoRef.current.volume = volume;
        videoRef.current.muted = isMuted;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Browser autoplay with sound was prevented:', err);
            // Fallback: mute video so it can autoplay, and inform user
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

    return () => clearTimeout(timer);
  }, [project?.id, project?.heroMediaType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeLightbox) {
          closeLightbox();
        } else if (isVideoCinema) {
          setIsVideoCinema(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowRight' && !activeLightbox) onNextProject();
      if (e.key === 'ArrowLeft' && !activeLightbox) onPrevProject();
      if (e.key === 'm' || e.key === 'M') toggleMute();
    };

    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose, onNextProject, onPrevProject, isMuted, volume, activeLightbox, isVideoCinema]);

  if (!project) return null;

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
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
      const dur = videoRef.current.duration || 1;
      setVideoProgress((cur / dur) * 100);
      const curMin = Math.floor(cur / 60).toString().padStart(2, '0');
      const curSec = Math.floor(cur % 60).toString().padStart(2, '0');
      setVideoCurrentTime(`${curMin}:${curSec}`);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 0;
      const durMin = Math.floor(dur / 60).toString().padStart(2, '0');
      const durSec = Math.floor(dur % 60).toString().padStart(2, '0');
      setVideoDuration(`${durMin}:${durSec}`);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * (videoRef.current.duration || 0);
    }
  };

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDraggingSlider(true);
  const handleMouseUp = () => setIsDraggingSlider(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) handleSliderMove(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/95 p-0 sm:p-4 md:p-6 backdrop-blur-xl">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Main Modal Content Container */}
      <div className="relative z-10 my-auto flex min-h-screen sm:min-h-0 w-full max-w-5xl flex-col rounded-none sm:rounded-2xl border-0 sm:border border-[#1e2d42] bg-[#0c1422] shadow-2xl overflow-hidden">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#1c283c] bg-[#090e17]/95 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-[#131e2e] px-2 py-1 text-[11px] font-mono text-[#8bb2e2]">
              {project.category}
            </span>
            <span className="font-mono text-xs text-slate-400 hidden sm:inline">
              {project.year}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthed && onEditProject && (
              <button
                onClick={() => onEditProject(project)}
                className="flex items-center gap-1.5 rounded-lg border border-[#2a3f5c] bg-[#142337] px-3 py-1.5 text-xs text-[#8bb2e2] hover:bg-[#1f3654] hover:text-white transition-colors"
                title={lang === 'ko' ? '프로젝트 수정' : 'Edit Project'}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{lang === 'ko' ? '수정' : 'Edit'}</span>
              </button>
            )}

            {isAdminAuthed && onDeleteProject && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 rounded-lg border border-rose-900/40 bg-rose-950/20 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                title={lang === 'ko' ? '프로젝트 삭제' : 'Delete Project'}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{lang === 'ko' ? '삭제' : 'Delete'}</span>
              </button>
            )}

            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 rounded-lg border border-[#1e2d42] bg-[#090e17] px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
              title="Copy link"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-[#1e2d42] bg-[#090e17] p-1.5 text-slate-400 hover:bg-[#131e2e] hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Project Body */}
        <div className="max-h-[85vh] overflow-y-auto px-5 sm:px-8 py-6 sm:py-10 space-y-12">
          {/* 1. Title & Intro */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#7a9ec7]">
              Case Study / {project.clientOrPurpose}
            </span>
            <h1 className="mt-2 font-syne text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-slate-300 font-medium">
              {project.titleKr}
            </p>
          </div>

          {/* 2. Hero Media (Image or Video) */}
          <div className="relative w-full overflow-hidden rounded-xl border border-[#1e2d42] bg-black shadow-2xl">
            {project.heroMediaType === 'video' ? (
              <div ref={videoContainerRef} className="relative aspect-video w-full group bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={resolveMediaUrl(project.heroMediaUrl)}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="h-full w-full object-contain cursor-pointer"
                  onClick={toggleVideo}
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

                {/* Center Play/Pause indicator when paused */}
                {!isVideoPlaying && (
                  <div
                    onClick={toggleVideo}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 cursor-pointer"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3b5b82] text-white shadow-xl transition-transform hover:scale-110">
                      <Play className="h-8 w-8 fill-current ml-1" />
                    </div>
                  </div>
                )}

                {/* Top overlay badges: Duration & Fullscreen Trigger */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleFullscreenVideo}
                    className="flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 font-mono text-xs text-slate-200 backdrop-blur-md border border-[#1e2d42] hover:bg-[#1a2b42] hover:text-white transition-all shadow-md"
                    title={lang === 'ko' ? '비디오 전체화면' : 'Fullscreen Video'}
                  >
                    <Maximize2 className="h-3 w-3 text-[#8bb2e2]" />
                    <span className="hidden sm:inline">{lang === 'ko' ? '전체보기' : 'Fullscreen'}</span>
                  </button>
                  {project.duration && (
                    <span className="rounded-full bg-black/75 px-3 py-1 font-mono text-xs text-slate-300 backdrop-blur-md border border-[#1e2d42]">
                      {project.duration}
                    </span>
                  )}
                </div>

                {/* Bottom Video Controls Overlay (Scrubber + Play/Pause + Sound + Volume + Fullscreen) */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 sm:p-4 opacity-95 group-hover:opacity-100 transition-opacity">
                  {/* Progress scrubber bar */}
                  <div
                    onClick={handleSeek}
                    className="group/bar relative mb-2.5 h-1.5 w-full cursor-pointer rounded-full bg-slate-800/90 hover:h-2 transition-all"
                  >
                    <div
                      className="h-full rounded-full bg-[#5b8bc4] transition-all"
                      style={{ width: `${videoProgress}%` }}
                    />
                    <div
                      className="absolute top-1/2 -mt-1.5 h-3 w-3 -ml-1.5 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-md"
                      style={{ left: `${videoProgress}%` }}
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause Button */}
                      <button
                        type="button"
                        onClick={toggleVideo}
                        className="rounded p-1 text-white hover:text-[#8bb2e2] transition-colors"
                        title={isVideoPlaying ? '일시 정지 (Space)' : '재생 (Space)'}
                      >
                        {isVideoPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Sound Toggle (Mute / Unmute) */}
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="flex items-center gap-1.5 rounded p-1 text-white hover:text-[#8bb2e2] transition-colors"
                        title={isMuted ? '소리 켜기 (M)' : '음소거 (M)'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-4 w-4 text-rose-400" />
                        ) : volume < 0.5 ? (
                          <Volume1 className="h-4 w-4 text-[#8bb2e2]" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-[#8bb2e2]" />
                        )}
                        <span className="text-[11px] font-mono font-medium">
                          {isMuted ? '소리 꺼짐' : '오디오 ON'}
                        </span>
                      </button>

                      {/* Volume Slider */}
                      <div className="hidden sm:flex items-center gap-1.5 group/vol">
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
                        <span className="text-[10px] font-mono text-slate-400 w-8">
                          {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                        </span>
                      </div>

                      {/* Timecode */}
                      <span className="font-mono text-[11px] text-slate-400 pl-1">
                        {videoCurrentTime} / {videoDuration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden md:inline font-mono text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-[#1e2d42]">
                        M: 음소거 / 스페이스: 재생
                      </span>
                      {/* Fullscreen Button */}
                      <button
                        type="button"
                        onClick={toggleFullscreenVideo}
                        className="flex items-center gap-1 rounded bg-[#131e2e] px-2 py-1 text-xs text-slate-200 hover:bg-[#1e2f46] hover:text-white border border-[#223550] transition-colors"
                        title={lang === 'ko' ? '비디오 전체화면' : 'Fullscreen Video'}
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-[#8bb2e2]" />
                        <span className="font-mono text-[11px]">{lang === 'ko' ? '전체보기' : 'Fullscreen'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full min-h-[380px] max-h-[80vh] py-6 px-3 sm:px-6 flex items-center justify-center bg-[#070b14] overflow-hidden group">
                {/* Ambient Blurred Background to eliminate empty letterboxing */}
                <img
                  src={resolveMediaUrl(project.heroMediaUrl)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
                />

                {/* Main Image with original aspect ratio preserved without clipping */}
                <img
                  src={resolveMediaUrl(project.heroMediaUrl)}
                  alt={project.title}
                  className="relative z-10 max-h-[74vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 hover:scale-[1.01] cursor-zoom-in"
                  onClick={() => openLightbox(resolveMediaUrl(project.heroMediaUrl), project.title)}
                />

                {/* Top overlay badges: Original aspect & Fullscreen zoom button */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openLightbox(resolveMediaUrl(project.heroMediaUrl), project.title)}
                    className="flex items-center gap-1.5 rounded-full bg-black/85 px-3.5 py-1.5 text-xs font-mono text-white backdrop-blur-md border border-[#223550] hover:bg-[#1a2b42] hover:border-[#4d74a3] transition-all shadow-lg"
                    title={lang === 'ko' ? '원본 비율 전체보기' : 'Fullscreen / Original Ratio'}
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-[#8bb2e2]" />
                    <span>{lang === 'ko' ? '전체보기 / 원본 비율' : 'Fullscreen / Original'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Project Meta Card (Category, Year, Role, Tools, Duration) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-[#1e2d42] bg-[#090e17]/80 p-5 sm:p-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#7a9ec7] font-mono uppercase">
                <Layers className="h-3.5 w-3.5" />
                <span>Category</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-200">
                {project.category}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#7a9ec7] font-mono uppercase">
                <Clock className="h-3.5 w-3.5" />
                <span>Year / Duration</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-200">
                {project.year} {project.duration ? `(${project.duration})` : ''}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#7a9ec7] font-mono uppercase">
                <User className="h-3.5 w-3.5" />
                <span>Role</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1" title={project.role}>
                {project.role}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#7a9ec7] font-mono uppercase">
                <Wrench className="h-3.5 w-3.5" />
                <span>Tools Used</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {project.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-[#131e2e] border border-[#1c283c] px-1.5 py-0.5 text-[10px] font-mono text-[#8bb2e2]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4 & 5. Overview & Concept */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#1c283c]">
            <div>
              <h3 className="font-syne text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4d74a3]"></span>
                {lang === 'ko' ? '01. 프로젝트 개요 (Overview)' : '01. Project Overview'}
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-body">
                {project.overview}
              </p>
            </div>

            <div>
              <h3 className="font-syne text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7a9ec7]"></span>
                {lang === 'ko' ? '02. 기획 의도 & 컨셉 (Concept)' : '02. Concept & Creative Direction'}
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-body">
                {project.concept}
              </p>
            </div>
          </div>

          {/* Optional: Before & After Comparison Slider (Very high impact for Recruiters) */}
          {project.beforeAfter && (
            <div className="pt-6 border-t border-[#1c283c]">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8bb2e2] uppercase tracking-widest">
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Directing Impact / Before & After Analysis</span>
                </div>
                <h3 className="mt-1 font-syne text-xl font-bold text-white">
                  {lang === 'ko' ? '제작 전후 비교 (Interactive Slider)' : 'Directing & Post-Production Comparison'}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {project.beforeAfter.description}
                </p>
              </div>

              {/* Interactive Comparison Slider */}
              <div
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#1e2d42] select-none cursor-ew-resize bg-black"
              >
                {/* AFTER Image (Full background) */}
                <img
                  src={project.beforeAfter.afterUrl}
                  alt="After"
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                />
                <div className="absolute top-4 right-4 rounded-md bg-black/80 px-2.5 py-1 text-[11px] font-mono text-emerald-400 border border-emerald-900/60 backdrop-blur-md">
                  {project.beforeAfter.afterTitle}
                </div>

                {/* BEFORE Image (Clipped) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={project.beforeAfter.beforeUrl}
                    alt="Before"
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none max-w-none"
                    style={{ width: sliderRef.current?.clientWidth || '100%' }}
                  />
                  <div className="absolute top-4 left-4 rounded-md bg-black/80 px-2.5 py-1 text-[11px] font-mono text-slate-300 border border-[#1e2d42] backdrop-blur-md">
                    {project.beforeAfter.beforeTitle}
                  </div>
                </div>

                {/* Vertical Divider Line */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow-2xl"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -mt-4 -ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg">
                    <Sliders className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center font-mono text-[11px] text-slate-400">
                {lang === 'ko' ? '← 마우스나 터치로 좌우를 드래그하여 전후를 비교해 보세요 →' : '← Drag slider horizontally to inspect before & after →'}
              </div>
            </div>
          )}

          {/* 6. Process Steps */}
          {project.process.length > 0 && (
            <div className="pt-6 border-t border-[#1c283c]">
              <h3 className="font-syne text-xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4d74a3]"></span>
                {lang === 'ko' ? '03. 제작 과정 & 워크플로우 (Work in Progress)' : '03. Creative Process & Workflow'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.process.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="group flex flex-col rounded-xl border border-[#1e2d42] bg-[#090e17]/60 overflow-hidden"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#070b14] relative flex items-center justify-center">
                      <img
                        src={resolveMediaUrl(step.mediaUrl)}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover blur-xl opacity-20 scale-110 pointer-events-none"
                      />
                      {step.mediaType === 'video' ? (
                        <video
                          src={resolveMediaUrl(step.mediaUrl)}
                          controls
                          playsInline
                          className="relative z-10 h-full w-full object-contain"
                        />
                      ) : (
                        <>
                          <img
                            src={resolveMediaUrl(step.mediaUrl)}
                            alt={step.title}
                            className="relative z-10 h-full w-full object-contain hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                            onClick={() => openLightbox(resolveMediaUrl(step.mediaUrl), `STAGE ${step.stepNumber}: ${step.title}`)}
                          />
                          <button
                            type="button"
                            onClick={() => openLightbox(resolveMediaUrl(step.mediaUrl), `STAGE ${step.stepNumber}: ${step.title}`)}
                            className="absolute bottom-2 right-2 z-20 rounded bg-black/80 p-1.5 text-slate-300 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-[#1e2d42]"
                            title="전체보기"
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#8bb2e2]">
                          STAGE {step.stepNumber}
                        </span>
                        <h4 className="mt-1 font-syne text-sm font-bold text-slate-100">
                          {step.title}
                        </h4>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Final Outputs Gallery */}
          {project.finalOutputs.length > 0 && (
            <div className="pt-6 border-t border-[#1c283c]">
              <h3 className="font-syne text-xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7a9ec7]"></span>
                {lang === 'ko' ? '04. 최종 결과물 (Final Outputs)' : '04. Final Outputs'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.finalOutputs.map((item, idx) => (
                  <div
                    key={idx}
                    className="group overflow-hidden rounded-xl border border-[#1e2d42] bg-[#090e17] flex flex-col"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[#070b14] relative flex items-center justify-center">
                      <img
                        src={resolveMediaUrl(item.url)}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover blur-xl opacity-20 scale-110 pointer-events-none"
                      />
                      {item.mediaType === 'video' ? (
                        <div className="relative z-10 h-full w-full flex items-center justify-center">
                          <video
                            src={resolveMediaUrl(item.url)}
                            controls
                            playsInline
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <>
                          <img
                            src={resolveMediaUrl(item.url)}
                            alt={item.title}
                            className="relative z-10 h-full w-full object-contain group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                            onClick={() => openLightbox(resolveMediaUrl(item.url), item.title)}
                          />
                          <button
                            type="button"
                            onClick={() => openLightbox(resolveMediaUrl(item.url), item.title)}
                            className="absolute bottom-2 right-2 z-20 rounded bg-black/80 p-1.5 text-slate-300 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-[#1e2d42]"
                            title="전체보기"
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="p-4 bg-[#0c1422]">
                      <h5 className="font-syne text-xs font-bold text-slate-200">
                        {item.title}
                      </h5>
                      {item.caption && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Reflection & Learnings */}
          <div className="pt-6 border-t border-[#1c283c]">
            <div className="rounded-xl border border-[#1e2d42] bg-[#090e17]/80 p-6">
              <h3 className="font-syne text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                {lang === 'ko' ? '05. 디자이너 회고 & 인사이트 (Reflection)' : '05. Retrospective & Learnings'}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
                {project.reflection}
              </p>
            </div>
          </div>

          {/* 9. Next Project & Navigation Traversal */}
          <div className="pt-8 border-t border-[#1c283c] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onPrevProject}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{lang === 'ko' ? '이전 프로젝트' : 'Previous Project'}</span>
            </button>

            <button
              onClick={onNextProject}
              className="group flex items-center gap-2 rounded-full bg-[#3b5b82] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#4a72a3] transition-all shadow-lg shadow-[#1e3352]/30"
            >
              <span>{lang === 'ko' ? '다음 프로젝트 보기 (Next Project)' : 'Next Project'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Cinema Mode (fallback / immersive modal) */}
      {isVideoCinema && project.heroMediaType === 'video' && (
        <div className="fixed inset-0 z-70 flex flex-col items-center justify-center bg-black p-2 sm:p-6">
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            <button
              onClick={() => setIsVideoCinema(false)}
              className="flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700 px-4 py-2 text-xs font-mono text-white hover:bg-slate-800 transition-colors shadow-2xl"
            >
              <Minimize2 className="h-4 w-4" />
              <span>{lang === 'ko' ? '전체화면 닫기 (Esc)' : 'Exit Fullscreen (Esc)'}</span>
            </button>
          </div>
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              src={resolveMediaUrl(project.heroMediaUrl)}
              controls
              autoPlay
              playsInline
              className="max-h-[94vh] max-w-[96vw] object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Fullscreen Interactive Lightbox Modal for Images */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-70 flex flex-col items-center justify-center bg-black/95 p-2 sm:p-6 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto rounded-full bg-slate-900/90 border border-[#1e2d42] px-4 py-1.5 backdrop-blur-md max-w-[60vw] truncate">
              <span className="font-mono text-xs text-white font-medium">
                {activeLightbox.title || project.title}
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <div className="flex items-center rounded-full bg-slate-900/90 border border-[#1e2d42] p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                  className="rounded-full p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="축소"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="font-mono text-[11px] text-slate-400 px-2 min-w-[42px] text-center">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                  className="rounded-full p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="확대"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="100% 원본 비율 리셋"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="rounded-full bg-slate-900/90 border border-[#1e2d42] p-2 text-slate-300 hover:text-white hover:bg-rose-950/80 hover:border-rose-800 transition-colors shadow-xl"
                title="닫기 (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Container (Preserves 100% original aspect ratio) */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-auto p-4">
            <img
              src={activeLightbox.url}
              alt={activeLightbox.title}
              style={{ transform: `scale(${lightboxZoom})`, transformOrigin: 'center center' }}
              className="max-h-[88vh] max-w-[92vw] object-contain rounded-md shadow-2xl transition-transform duration-200"
            />
          </div>

          <div className="absolute bottom-4 z-20 font-mono text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-[#1e2d42] pointer-events-none">
            {lang === 'ko' ? '마우스 휠이나 버튼으로 확대/축소 가능 • ESC로 닫기' : 'Zoom controls available • Press ESC to close'}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-rose-900/60 bg-[#0c1422] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs">
              <Trash2 className="h-4 w-4" />
              <span>Delete Confirmation</span>
            </div>
            <h3 className="font-syne text-lg font-bold text-white">
              {lang === 'ko' ? '정말 이 프로젝트를 삭제하시겠습니까?' : 'Are you sure you want to delete this project?'}
            </h3>
            <div className="rounded-xl border border-[#1e2d42] bg-[#090e17] p-3 flex items-center gap-3">
              <div className="h-10 w-14 overflow-hidden rounded bg-[#131e2e] flex-shrink-0">
                {project.thumbnailUrl ? (
                  <img src={resolveMediaUrl(project.thumbnailUrl)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-600">
                    <Film className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm truncate">{project.title}</div>
                <div className="text-[11px] text-slate-400 font-mono">{project.category} • {project.year}</div>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'ko'
                ? '삭제 후에는 포트폴리오 목록에서 완전히 제거됩니다. 계속하시겠습니까?'
                : 'This will be permanently removed from your portfolio projects. Are you sure?'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-[#1e2d42] px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                {lang === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  if (onDeleteProject) {
                    onDeleteProject(project);
                  }
                  onClose();
                }}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-900/30"
              >
                {lang === 'ko' ? '삭제 확인' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
