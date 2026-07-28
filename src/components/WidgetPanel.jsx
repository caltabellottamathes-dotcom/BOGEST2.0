import React, { useState, useRef, useCallback } from 'react';

const DRAG_THRESHOLD = 8;
const HANDLE_WIDTH = 34;

/**
 * Reusable sliding panel that wraps a third-party widget.
 * Slides from the right edge. When minimized, only a thin handle stays visible.
 * Swipe (or tap handle) to restore.
 */
export default function WidgetPanel({
  children,
  label,
  icon: Icon,
  topOffset = '100px',
  panelWidth = 80,
  panelHeight = 80,
  isDark,
  contentRef,
}) {
  const [minimized, setMinimized] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startXRef = useRef(null);
  const startYRef = useRef(null);
  const draggingRef = useRef(false);
  const onHandleRef = useRef(false);

  const maxOffset = panelWidth;

  const onPointerDown = useCallback((e) => {
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    draggingRef.current = false;
    onHandleRef.current = !!e.target.closest('[data-handle="true"]');
  }, []);

  const onPointerMove = useCallback((e) => {
    if (startXRef.current === null) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    if (!draggingRef.current) {
      if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;
      draggingRef.current = true;
    }
    if (minimized) {
      setDragX(Math.max(-maxOffset, Math.min(0, dx)));
    } else {
      setDragX(Math.max(0, Math.min(maxOffset, dx)));
    }
  }, [minimized, maxOffset]);

  const onPointerUp = useCallback((e) => {
    if (startXRef.current === null) return;
    const wasDragging = draggingRef.current;
    const wasOnHandle = onHandleRef.current;
    draggingRef.current = false;
    startXRef.current = null;
    startYRef.current = null;
    onHandleRef.current = false;

    if (wasDragging) {
      // Swallow the synthetic click after a drag
      const swallow = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        document.removeEventListener('click', swallow, true);
      };
      document.addEventListener('click', swallow, true);

      const threshold = maxOffset / 3;
      if (minimized && dragX < -threshold) {
        setMinimized(false);
      } else if (!minimized && dragX > threshold) {
        setMinimized(true);
      }
      setDragX(0);
    } else if (wasOnHandle) {
      setMinimized(!minimized);
    }
  }, [minimized, dragX, maxOffset]);

  const translateX = (minimized ? maxOffset : 0) + dragX;

  return (
    <div
      className="fixed z-[99998] flex items-stretch"
      style={{
        top: topOffset,
        right: 0,
        height: panelHeight,
        transform: `translateX(${translateX}px)`,
        transition: draggingRef.current ? 'none' : 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Handle — leftmost, stays visible when panel slides right */}
      <div
        data-handle="true"
        className="flex items-center justify-center flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80"
        style={{
          width: HANDLE_WIDTH,
          height: '100%',
          background: isDark ? 'rgba(20,14,0,0.92)' : 'rgba(254,252,248,0.94)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: isDark ? '1px solid rgba(231,205,112,0.30)' : '1px solid rgba(107,122,63,0.30)',
          borderRight: 'none',
          borderRadius: '10px 0 0 10px',
          color: isDark ? 'rgba(231,205,112,0.80)' : 'rgba(107,122,63,0.80)',
        }}
        title={label}
      >
        {Icon ? <Icon className="w-4 h-4" /> : <span className="text-[9px] font-body">{label}</span>}
      </div>

      {/* Widget content */}
      <div
        ref={contentRef}
        className="widget-panel-content flex-shrink-0"
        style={{
          width: panelWidth,
          height: '100%',
          background: isDark ? 'rgba(8,8,8,0.94)' : 'rgba(254,252,248,0.96)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: isDark ? '1px solid rgba(255,255,255,0.11)' : '1px solid rgba(74,83,32,0.26)',
          borderLeft: 'none',
          borderRadius: '0 10px 10px 0',
          overflow: 'visible',
        }}
      >
        {children}
      </div>
    </div>
  );
}