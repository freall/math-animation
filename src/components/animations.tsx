import React, { useState, useEffect } from 'react';

export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  return <div className={`fade-in ${visible ? 'visible' : ''}`}>{children}</div>
}

export const Bounce = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  return <div className={`bounce ${visible ? 'visible' : ''}`}>{children}</div>
}

export const Star = ({ style }: { style: React.CSSProperties }) => (
  <div className="star" style={style}>
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  </div>
)

export type RuntimeBadge = {
  label: string
  value: string
}

export const LessonCode = ({
  lines,
  activeLine = -1,
  lineBadges = {},
  runtimeBadges = [],
  runtimeTitle = '当前变量',
  runtimeHint,
}: {
  lines: string[],
  activeLine?: number,
  lineBadges?: Record<number, RuntimeBadge[]>,
  runtimeBadges?: RuntimeBadge[],
  runtimeTitle?: string,
  runtimeHint?: string,
}) => (
  <div className="code-board">
    {lines.map((line, index) => (
      <div key={`${index}-${line}`} className={`code-line ${activeLine === index ? 'active' : ''}`}>
        <div className="code-line-main">
          <span className="code-index">{index + 1}</span>
          <code>{line}</code>
        </div>
        {lineBadges[index]?.length ? (
          <div className="code-badges">
            {lineBadges[index].map((badge) => (
              <span key={`${index}-${badge.label}-${badge.value}`} className="code-badge">
                {badge.label} = {badge.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    ))}
    {(runtimeBadges.length > 0 || runtimeHint) && (
      <div className="runtime-panel">
        <div className="runtime-title">{runtimeTitle}</div>
        <div className="runtime-list">
          {runtimeBadges.map((badge) => (
            <div key={`${badge.label}-${badge.value}`} className="runtime-item">
              <span className="runtime-label">{badge.label}</span>
              <span className="runtime-value">{badge.value}</span>
            </div>
          ))}
        </div>
        {runtimeHint ? <p className="runtime-hint">{runtimeHint}</p> : null}
      </div>
    )}
  </div>
)
