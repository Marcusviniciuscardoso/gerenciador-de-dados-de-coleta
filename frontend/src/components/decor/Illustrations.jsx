import React from 'react';

export const ButterflyIcon = ({ className = '', size = 48 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none">
    <ellipse cx="20" cy="24" rx="14" ry="11" fill="#D9CBA1" stroke="#7A8A4F" strokeWidth="1.2" />
    <ellipse cx="44" cy="24" rx="14" ry="11" fill="#D9CBA1" stroke="#7A8A4F" strokeWidth="1.2" />
    <ellipse cx="22" cy="42" rx="11" ry="9" fill="#D9CBA1" stroke="#7A8A4F" strokeWidth="1.2" />
    <ellipse cx="42" cy="42" rx="11" ry="9" fill="#D9CBA1" stroke="#7A8A4F" strokeWidth="1.2" />
    <circle cx="20" cy="24" r="2" fill="#3D4A2A" />
    <circle cx="44" cy="24" r="2" fill="#3D4A2A" />
    <line x1="32" y1="14" x2="32" y2="50" stroke="#3D4A2A" strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="14" x2="28" y2="8" stroke="#3D4A2A" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="32" y1="14" x2="36" y2="8" stroke="#3D4A2A" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const MothIcon = ({ className = '', size = 48 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none">
    <path d="M32 32 Q14 20 10 30 Q14 40 32 36 Z" fill="#E8DDB8" stroke="#9B5C3F" strokeWidth="1" opacity="0.8" />
    <path d="M32 32 Q50 20 54 30 Q50 40 32 36 Z" fill="#E8DDB8" stroke="#9B5C3F" strokeWidth="1" opacity="0.8" />
    <line x1="32" y1="22" x2="32" y2="44" stroke="#3D4A2A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const FlowerIcon = ({ className = '', size = 36 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none">
    <circle cx="24" cy="14" r="5" fill="#C58B7A" stroke="#7A4530" strokeWidth="1" />
    <circle cx="14" cy="22" r="5" fill="#C58B7A" stroke="#7A4530" strokeWidth="1" />
    <circle cx="34" cy="22" r="5" fill="#C58B7A" stroke="#7A4530" strokeWidth="1" />
    <circle cx="24" cy="22" r="3" fill="#D4A04A" />
    <line x1="24" y1="22" x2="24" y2="44" stroke="#7A8A4F" strokeWidth="1.5" />
    <path d="M24 34 Q18 30 16 34" stroke="#7A8A4F" strokeWidth="1.5" fill="none" />
  </svg>
);

export const FernIcon = ({ className = '', size = 36 }) => (
  <svg viewBox="0 0 48 64" width={size} height={size * 1.33} className={className} fill="none">
    <line x1="24" y1="4" x2="24" y2="60" stroke="#7A8A4F" strokeWidth="1.5" />
    {[10, 18, 26, 34, 42, 50].map((y, i) => (
      <g key={i}>
        <line x1="24" y1={y} x2={14 - i} y2={y + 3} stroke="#7A8A4F" strokeWidth="1.2" />
        <line x1="24" y1={y} x2={34 + i} y2={y + 3} stroke="#7A8A4F" strokeWidth="1.2" />
      </g>
    ))}
  </svg>
);

export const LeafIcon = ({ className = '', size = 36 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none">
    <path d="M8 40 Q24 4 40 8 Q36 32 8 40 Z" fill="#CFD4A5" stroke="#7A8A4F" strokeWidth="1" opacity="0.6" />
    <path d="M8 40 Q22 22 38 10" stroke="#7A8A4F" strokeWidth="0.8" fill="none" />
  </svg>
);

export const BeetleIcon = ({ className = '', size = 48 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none">
    <ellipse cx="32" cy="34" rx="18" ry="22" fill="#D9CBA1" stroke="#7A4530" strokeWidth="1.2" />
    <line x1="32" y1="14" x2="32" y2="54" stroke="#3D4A2A" strokeWidth="1.5" />
    <circle cx="22" cy="20" r="2" fill="#3D4A2A" />
    <circle cx="42" cy="20" r="2" fill="#3D4A2A" />
    <circle cx="22" cy="36" r="2" fill="#3D4A2A" />
    <circle cx="42" cy="36" r="2" fill="#3D4A2A" />
  </svg>
);

export const DragonflyIcon = ({ className = '', size = 48 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none">
    <ellipse cx="20" cy="26" rx="14" ry="6" fill="#CFD4A5" stroke="#7A8A4F" strokeWidth="1" opacity="0.8" />
    <ellipse cx="44" cy="26" rx="14" ry="6" fill="#CFD4A5" stroke="#7A8A4F" strokeWidth="1" opacity="0.8" />
    <ellipse cx="20" cy="38" rx="10" ry="4" fill="#CFD4A5" stroke="#7A8A4F" strokeWidth="1" opacity="0.7" />
    <ellipse cx="44" cy="38" rx="10" ry="4" fill="#CFD4A5" stroke="#7A8A4F" strokeWidth="1" opacity="0.7" />
    <line x1="32" y1="10" x2="32" y2="58" stroke="#3D4A2A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="14" r="3" fill="#3D4A2A" />
  </svg>
);

export const MushroomIcon = ({ className = '', size = 48 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none">
    <path d="M14 32 Q14 12 32 12 Q50 12 50 32 Z" fill="#D4A04A" stroke="#7A4530" strokeWidth="1.2" />
    <rect x="24" y="32" width="16" height="22" rx="3" fill="#E8DDB8" stroke="#7A4530" strokeWidth="1.2" />
    <circle cx="22" cy="22" r="2" fill="#FAF3DF" />
    <circle cx="36" cy="18" r="2.5" fill="#FAF3DF" />
    <circle cx="42" cy="26" r="1.8" fill="#FAF3DF" />
  </svg>
);

export const CornerOrnament = ({ position = 'top-left', className = '' }) => {
  const transforms = {
    'top-left': '',
    'top-right': 'scaleX(-1)',
    'bottom-left': 'scaleY(-1)',
    'bottom-right': 'scale(-1, -1)',
  };
  return (
    <svg viewBox="0 0 60 60" className={className} style={{ transform: transforms[position] }} fill="none">
      <path d="M2 30 Q2 2 30 2" stroke="#B8A878" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M8 30 Q8 8 30 8" stroke="#B8A878" strokeWidth="0.6" fill="none" opacity="0.4" />
    </svg>
  );
};

export const Logo = ({ size = 40, className = '' }) => (
  <div className={`inline-flex items-center justify-center rounded-full border border-olive/30 bg-paper-light ${className}`} style={{ width: size, height: size }}>
    {/*<ButterflyIcon size={size * 0.65} />*/}
    <img src="/LogoSistema.png" alt='Logo do sistema' style={{borderRadius: '10%', objectFit: 'cover'}}></img>
  </div>
);
