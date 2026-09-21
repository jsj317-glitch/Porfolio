import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Film, X, Check, Loader2, Link as LinkIcon, HardDrive } from 'lucide-react';
import { saveUploadedFile, resolveMediaUrl, formatFileSize } from '../utils/mediaStorage';

interface FileUploadZoneProps {
  label: string;
  subLabel?: string;
  acceptType?: 'image' | 'video' | 'any';
  value: string; // The URL (either http..., idb://..., or data:)
  onChange: (url: string, detectedType?: 'image' | 'video', meta?: { name: string; size: number }) => void;
  mediaType?: 'image' | 'video';
  onMediaTypeChange?: (type: 'image' | 'video') => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  subLabel,
  acceptType = 'any',
  value,
  onChange,
  mediaType = 'image',
  onMediaTypeChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [inputMode, setInputMode] = useState<'local' | 'url'>(
    value && !value.startsWith('idb://') && !value.startsWith('blob:') && !value.startsWith('data:')
      ? 'url'
      : 'local'
  );
  const [urlInput, setUrlInput] = useState(value || '');
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedUrl = resolveMediaUrl(value);
  const isVideo =
    mediaType === 'video' ||
    (acceptType === 'video') ||
    /\.(mp4|webm|mov|m4v|ogg)$/i.test(value) ||
    value.includes('video');

  const acceptMime =
    acceptType === 'image'
      ? 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
      : acceptType === 'video'
      ? 'video/mp4,video/webm,video/quicktime,video/ogg'
      : 'image/*,video/*';

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate type if constrained
    if (acceptType === 'image' && !file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, WebP, GIF 등)만 업로드 가능합니다.');
      return;
    }
    if (acceptType === 'video' && !file.type.startsWith('video/')) {
      alert('영상 파일(MP4, WebM, MOV 등)만 업로드 가능합니다.');
      return;
    }

    try {
      setIsUploading(true);
      const res = await saveUploadedFile(file);
      setFileName(res.name);
      setFileSizeStr(formatFileSize(res.size));
      if (onMediaTypeChange) {
        onMediaTypeChange(res.mediaType);
      }
      onChange(res.url, res.mediaType, { name: res.name, size: res.size });
    } catch (err) {
      console.error('File upload error:', err);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onChange('', mediaType);
    setUrlInput('');
    setFileName('');
    setFileSizeStr('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    const isVid = /\.(mp4|webm|mov)$/i.test(urlInput.trim());
    const detected = isVid ? 'video' : 'image';
    if (onMediaTypeChange) onMediaTypeChange(detected);
    onChange(urlInput.trim(), detected);
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
          {acceptType === 'video' ? (
            <Film className="h-3.5 w-3.5 text-[#7a9ec7]" />
          ) : (
            <ImageIcon className="h-3.5 w-3.5 text-[#7a9ec7]" />
          )}
          <span>{label}</span>
        </label>

        {/* Tab switch between Local File and Web URL */}
        <div className="flex items-center rounded-lg border border-[#1e2d42] bg-[#090e17] p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setInputMode('local')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              inputMode === 'local'
                ? 'bg-[#3b5b82] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="h-3 w-3" />
            <span>내 로컬 파일</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              inputMode === 'url'
                ? 'bg-[#3b5b82] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>웹 URL 입력</span>
          </button>
        </div>
      </div>

      {subLabel && <p className="text-[11px] text-slate-400">{subLabel}</p>}

      {/* Mode 1: Local File Upload with Drag & Drop */}
      {inputMode === 'local' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptMime}
            onChange={handleInputChange}
            className="hidden"
          />

          {value ? (
            /* Uploaded Preview Card */
            <div className="relative overflow-hidden rounded-xl border border-[#263c5a] bg-[#0c1626] p-3 flex flex-col sm:flex-row items-center gap-4">
              {/* Media Preview Box */}
              <div className="relative h-28 w-full sm:w-44 flex-shrink-0 overflow-hidden rounded-lg bg-[#070b14] border border-[#1e2d42] flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={resolvedUrl}
                    controls
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <img
                    src={resolvedUrl}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                )}
                <div className="absolute top-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400 backdrop-blur-sm border border-emerald-500/30 flex items-center gap-1">
                  <Check className="h-2.5 w-2.5" />
                  <span>로컬 파일 적용됨</span>
                </div>
              </div>

              {/* Info & Action Controls */}
              <div className="flex-1 w-full space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#162740] px-2 py-0.5 text-[10px] font-mono text-[#8bb2e2] font-semibold">
                    {isVideo ? '비디오 미디어' : '이미지 미디어'}
                  </span>
                  {fileSizeStr && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {fileSizeStr}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-200 font-medium truncate max-w-sm" title={fileName || value}>
                  {fileName || (value.startsWith('idb://') ? '내 컴퓨터에서 업로드된 파일' : value)}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-[#2a4365] bg-[#122238] px-3 py-1 text-xs font-semibold text-[#8bb2e2] hover:bg-[#1a3152] transition-colors"
                  >
                    다른 파일로 교체
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1 rounded-lg border border-rose-900/60 bg-rose-950/20 px-2.5 py-1 text-xs text-rose-300 hover:bg-rose-950/50 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State: Drag & Drop Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#5c86ba] bg-[#14233a]'
                  : 'border-[#1e2d42] bg-[#090e17] hover:border-[#3b5b82] hover:bg-[#0c1422]'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center py-2 space-y-2">
                  <Loader2 className="h-7 w-7 animate-spin text-[#7a9ec7]" />
                  <p className="text-xs font-medium text-slate-300">내 로컬 파일 불러오는 중...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#122034] text-[#7a9ec7] transition-transform group-hover:scale-110 group-hover:bg-[#192c48]">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      클릭하여 내 컴퓨터에서 파일 선택{' '}
                      <span className="text-slate-400 font-normal">또는 여기로 드래그 앤 드롭</span>
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {acceptType === 'image'
                        ? '지원 형식: JPG, PNG, WebP, GIF, SVG (최대 50MB)'
                        : acceptType === 'video'
                        ? '지원 형식: MP4, WebM, MOV (최대 100MB)'
                        : '지원 형식: 이미지 (JPG, PNG, GIF) 또는 영상 (MP4, MOV, WebM)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: External Web URL Input */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={
                acceptType === 'video'
                  ? 'https://example.com/video.mp4'
                  : 'https://images.unsplash.com/...'
              }
              className="flex-1 rounded-xl border border-[#1e2d42] bg-[#090e17] p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4d74a3]"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="rounded-xl bg-[#3b5b82] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4a72a3] transition-colors"
            >
              적용
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-xl border border-[#1e2d42] bg-[#090e17] px-3 py-2 text-xs text-slate-400 hover:text-white"
              >
                비우기
              </button>
            )}
          </div>
          {value && (
            <div className="relative h-24 w-40 overflow-hidden rounded-lg bg-[#070b14] border border-[#1e2d42] flex items-center justify-center">
              {isVideo ? (
                <video src={value} controls className="h-full w-full object-contain" />
              ) : (
                <img src={value} alt="Preview" className="h-full w-full object-contain" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
