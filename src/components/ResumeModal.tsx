import React from 'react';
import { X, Printer, Download, Mail, Phone, MapPin, Globe, CheckCircle } from 'lucide-react';
import { DesignerProfile } from '../types';
import { defaultDesignerProfile } from '../data/defaultProjects';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DesignerProfile;
  lang: 'ko' | 'en';
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, profile, lang }) => {
  if (!isOpen) return null;

  const experiences =
    profile.experiences && profile.experiences.length > 0
      ? profile.experiences
      : defaultDesignerProfile.experiences || [];

  const skillCategories =
    profile.skillCategories && profile.skillCategories.length > 0
      ? profile.skillCategories
      : defaultDesignerProfile.skillCategories || [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const skillsText = skillCategories
      .map((c) => `- ${c.name}: ${c.tools.join(', ')}`)
      .join('\n');
    const expText = experiences
      .map((e) => `[${e.period}] ${e.role} @ ${e.place}\n${e.desc}`)
      .join('\n\n');

    const element = document.createElement('a');
    const file = new Blob(
      [
        `RESUME - ${profile.nameEn} (${profile.roleTitleEn})\n\nEmail: ${profile.email}\nPhone: ${profile.phone}\nLocation: ${profile.location}\n\nPROFILE SUMMARY:\n${profile.detailedBioKr}\n\nWORK EXPERIENCE:\n${expText}\n\nCORE SKILLS:\n${skillsText}`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Resume_${profile.nameEn.replace(/\s+/g, '_')}_Designer.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col rounded-2xl border border-[#1e2d42] bg-[#0c1422] shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Actions Bar */}
        <div className="flex items-center justify-between border-b border-[#1c283c] bg-[#090e17] px-6 py-3.5">
          <span className="font-mono text-xs text-[#7a9ec7]">
            OFFICIAL RESUME / CV DOCUMENT
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-[#223550] bg-[#131e2e] px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-[#1a2b42] transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-[#3b5b82] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#4a72a3] transition-colors shadow-md shadow-[#1e3352]/30"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-[#131e2e] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Body */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-white text-zinc-900 space-y-8 font-sans">
          {/* Header */}
          <div className="border-b-2 border-zinc-900 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-syne">
                  {profile.nameEn} <span className="text-xl font-normal text-zinc-600">({profile.nameKr})</span>
                </h1>
                <p className="mt-1 text-sm font-semibold tracking-wider text-zinc-700 uppercase">
                  {profile.roleTitleEn}
                </p>
              </div>

              <div className="text-xs text-zinc-600 space-y-1 sm:text-right font-mono">
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="h-3 w-3" />
                  <span>{profile.email}</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="h-3 w-3" />
                  <span>{profile.phone}</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.location}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Profile Overview */}
          <div>
            <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase mb-2">
              Professional Summary
            </h2>
            <p className="text-sm text-zinc-800 leading-relaxed font-normal">
              {profile.detailedBioKr}
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase border-b border-zinc-300 pb-1">
              Work Experience
            </h2>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-zinc-900">{exp.role}</h3>
                    <span className="text-xs font-mono text-zinc-500">{exp.period}</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-700">{exp.place}</p>
                  <p className="mt-1 text-xs text-zinc-700 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase border-b border-zinc-300 pb-1 mb-3">
              Technical Skill Matrix
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {skillCategories.map((cat, idx) => (
                <div key={cat.id || idx}>
                  <strong className="block text-zinc-900 font-semibold mb-1">{cat.name}:</strong>
                  <p className="text-zinc-700">{cat.tools.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase border-b border-zinc-300 pb-1 mb-2">
              Education
            </h2>
            <div className="flex justify-between items-baseline text-xs">
              <div>
                <span className="font-bold text-zinc-900">시각영상디자인 학사 (B.F.A in Visual & Motion Design)</span>
                <p className="text-zinc-600">홍익대학교 조형대학 / Graduated with Honors</p>
              </div>
              <span className="font-mono text-zinc-500">2019.03 — 2023.02</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
