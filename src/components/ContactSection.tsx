import React, { useState } from 'react';
import { DesignerProfile } from '../types';
import { Mail, Phone, MapPin, Copy, Check, Send, Download, ExternalLink, MessageSquare } from 'lucide-react';

interface ContactSectionProps {
  profile: DesignerProfile;
  onOpenResume: () => void;
  lang: 'ko' | 'en';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, onOpenResume, lang }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    projectType: 'Motion Graphics',
    budget: '협의 가능',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7a9ec7] uppercase tracking-widest mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4d74a3]"></span>
            <span>Get in Touch</span>
          </div>
          <h1 className="font-syne text-3xl sm:text-6xl font-extrabold text-white tracking-tight">
            {lang === 'ko' ? "Let's work together." : "Let's work together."}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-400 font-body max-w-2xl">
            {lang === 'ko'
              ? '채용 포지션 제안, 프로젝트 협업, 혹은 포트폴리오에 대한 모든 문의를 환영합니다. 24시간 이내에 회신드립니다.'
              : 'Available for full-time creative opportunities, in-house design roles, and select client commissions.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t border-[#1c283c] pt-12">
          {/* Left Column: Direct Contacts & Downloads */}
          <div className="lg:col-span-5 space-y-8">
            {/* Primary Email Card */}
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422]/80 p-6 space-y-4">
              <span className="text-xs font-mono text-[#7a9ec7] uppercase">Direct Email</span>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm sm:text-base font-semibold text-white truncate">
                  {profile.email}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 rounded-lg border border-[#223550] bg-[#131e2e] px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-[#1a2b42] transition-colors"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#64b5f6]" />
                      <span className="text-[#64b5f6]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#7a9ec7]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Details */}
            <div className="space-y-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#1e2d42] bg-[#0c1422]/50">
                <Phone className="h-4 w-4 text-[#7a9ec7]" />
                <span className="text-slate-200">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#1e2d42] bg-[#0c1422]/50">
                <MapPin className="h-4 w-4 text-[#7a9ec7]" />
                <span className="text-slate-200">{profile.location} (KST / GMT+9)</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-[#1c283c]">
              <span className="text-xs font-mono text-[#7a9ec7] uppercase block mb-3">
                Online Profiles & Portfolios
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Behance', url: profile.behance },
                  { name: 'YouTube', url: profile.youtube },
                  { name: 'Instagram', url: profile.instagram },
                ].filter((s) => Boolean(s.url)).map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-[#1e2d42] bg-[#0c1422] px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-[#4d74a3] transition-colors"
                  >
                    <span>{s.name}</span>
                    <ExternalLink className="h-3 w-3 text-[#7a9ec7]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#1e2d42] bg-[#0c1422] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-4 w-4 text-[#7a9ec7]" />
                <h3 className="font-syne text-lg font-bold text-white">
                  {lang === 'ko' ? '문의 양식 작성' : 'Send a Message'}
                </h3>
              </div>

              {isSubmitted ? (
                <div className="rounded-xl border border-[#224066] bg-[#0a1526]/80 p-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1b3252] text-[#8bb2e2]">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="font-syne text-lg font-bold text-white">
                    {lang === 'ko' ? '메시지가 성공적으로 접수되었습니다!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {lang === 'ko'
                      ? '보내주신 소중한 메시지를 확인 후 기재해주신 이메일 주소로 신속하게 답변드리겠습니다.'
                      : "Thank you for reaching out. I will review your message and reply via email within 24 hours."}
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        projectType: 'Motion Graphics',
                        budget: '협의 가능',
                        message: '',
                      });
                    }}
                    className="mt-4 rounded-full border border-[#223550] bg-[#131e2e] px-4 py-1.5 text-xs text-slate-300 hover:text-white"
                  >
                    {lang === 'ko' ? '추가 메시지 작성' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                        {lang === 'ko' ? '성함 / 담당자명 *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. 김담당 채용팀장"
                        className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-[#4d74a3] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                        {lang === 'ko' ? '회사 / 소속 스튜디오' : 'Company / Studio'}
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Design Agency, Studio"
                        className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-[#4d74a3] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                        {lang === 'ko' ? '회신받으실 이메일 *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-[#4d74a3] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                        {lang === 'ko' ? '문의 유형' : 'Inquiry Type'}
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] px-4 py-2.5 text-xs text-white focus:border-[#4d74a3] focus:outline-none"
                      >
                        <option value="Recruitment">채용 포지션 제안 (In-house / Agency)</option>
                        <option value="Motion Graphics">2D/3D 모션그래픽 프로젝트</option>
                        <option value="Poster Design">포스터 & 그래픽 디자인</option>
                        <option value="Video Editing">영상 편집 & 색보정</option>
                        <option value="AI Content">생성형 AI 비주얼 디렉팅</option>
                        <option value="Other">기타 문의</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                      {lang === 'ko' ? '메시지 내용 *' : 'Project Details or Message *'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        lang === 'ko'
                          ? '제안하시고자 하는 직무, 프로젝트 일정 및 구체적인 협업 내용을 남겨주세요.'
                          : 'Please describe the project scope, timeline, or recruitment requirements.'
                      }
                      className="w-full rounded-xl border border-[#1e2d42] bg-[#090e17] p-4 text-xs text-white placeholder-slate-600 focus:border-[#4d74a3] focus:outline-none resize-none leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#3b5b82] py-3 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors shadow-lg shadow-[#1e3352]/30"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{lang === 'ko' ? '메시지 전송하기' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
