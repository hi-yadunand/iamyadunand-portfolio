"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import "./hover-reel.css";

function ProjectPreview({ project }) {
  if (project.preview) return project.preview;
  return <img src={project.image} width="720" height="480" loading="lazy" decoding="async" alt="" />;
}

export function HoverReel({ projects, className = "" }) {
  const host = useRef(null);
  const thumb = useRef(null);
  const [{ active, open, rolling }, setPreview] = useState({ active: 0, open: false, rolling: false });
  const show = useCallback(index => {
    setPreview(previous => previous.open && previous.active === index
      ? previous
      : { active: index, open: true, rolling: previous.open });
  }, []);

  useEffect(() => {
    const reel = host.current;
    const frame = thumb.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let placed = false;
    let raf = 0;
    let pointer = null;
    let focusedRow = null;

    const write = () => {
      frame.style.translate = `${x}px ${y}px`;
    };

    function tick() {
      raf = 0;
      const distance = Math.abs(targetX - x) + Math.abs(targetY - y);
      const step = reduced.matches || distance <= 0.3 ? 1 : 0.16;
      x += (targetX - x) * step;
      y += (targetY - y) * step;
      write();
      if (step < 1) raf = requestAnimationFrame(tick);
    }

    function aim(clientX, clientY) {
      const bounds = reel.getBoundingClientRect();
      const width = frame.offsetWidth;
      const height = frame.offsetHeight;
      const inset = 16;
      targetX = Math.max(bounds.left + inset, Math.min(bounds.right - width - inset, clientX - width / 2));
      targetY = Math.max(inset, Math.min(window.innerHeight - height - inset, clientY - height / 2));

      if (!placed) {
        placed = true;
        x = targetX;
        y = targetY;
        write();
        return;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function close() {
      setPreview(previous => previous.open ? { ...previous, open: false, rolling: false } : previous);
      pointer = null;
      focusedRow = null;
      placed = false;
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function trackPointer(event) {
      if (event.pointerType !== "mouse" || !hover.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      focusedRow = null;
      aim(pointer.x, pointer.y);
    }

    function positionForFocus() {
      const bounds = focusedRow.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) {
        close();
        return;
      }
      placed = false;
      aim(bounds.right - frame.offsetWidth / 2 - 24, bounds.top + bounds.height / 2);
    }

    function syncOnScroll() {
      if (pointer) {
        // A wheel scroll can move a new project under a stationary pointer.
        const row = document.elementFromPoint(pointer.x, pointer.y)?.closest("[data-reel-index]");
        if (row && reel.contains(row)) show(Number(row.dataset.reelIndex));
        else close();
      } else if (focusedRow) {
        positionForFocus();
      }
    }

    const events = new AbortController();
    const { signal } = events;

    reel.addEventListener("pointerover", trackPointer, { signal });
    reel.addEventListener("pointermove", trackPointer, { signal });
    reel.addEventListener("pointerleave", close, { signal });
    reel.addEventListener("focusin", event => {
      const row = event.target.closest("[data-reel-index]");
      if (!hover.matches || !row?.matches(":focus-visible")) return;
      pointer = null;
      focusedRow = row;
      positionForFocus();
    }, { signal });
    reel.addEventListener("focusout", event => {
      if (!reel.contains(event.relatedTarget)) close();
    }, { signal });
    window.addEventListener("keydown", event => {
      if (event.key === "Escape") close();
    }, { signal });
    window.addEventListener("scroll", syncOnScroll, { passive: true, signal });
    hover.addEventListener("change", close, { signal });

    return () => {
      events.abort();
      cancelAnimationFrame(raf);
    };
  }, [show]);

  return (
    <div ref={host} className={`hover-reel ${className}`}>
      <ul className="border-b border-line">
        {projects.map((project, index) => (
          <li key={project.href} data-reveal="">
            <a
              className="hover-reel__row group grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 border-t border-line py-4 md:grid-cols-12 md:gap-x-6 md:py-5"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reel-index={index}
              data-active={open && active === index ? "" : undefined}
              onPointerEnter={event => {
                if (event.pointerType === "mouse") show(index);
              }}
              onFocus={event => {
                if (event.currentTarget.matches(":focus-visible")) show(index);
              }}
            >
              <span className="label text-signal md:col-span-1">{String(index + 1).padStart(2, "0")}</span>
              <span className="hover-reel__title md:col-span-5">
                <span className="hover-reel__inline" aria-hidden="true"><ProjectPreview project={project} /></span>
                <span className="display text-display-sm transition-transform duration-700 ease-out-soft group-hover:translate-x-3">{project.title}</span>
              </span>
              <span className="label hidden text-graphite md:col-span-2 md:block">{project.location}</span>
              <span className="label hidden text-graphite md:col-span-2 md:block">{project.label}</span>
              <span className="label flex items-baseline justify-end gap-3 text-graphite md:col-span-2">
                {project.year}<span className="project-card__arrow icon-slot"><Icon icon={ArrowUpRight01Icon} size={18} /></span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div ref={thumb} className="hover-reel__thumb" data-open={open ? "" : undefined} aria-hidden="true">
        <div className="hover-reel__window">
          <div className="hover-reel__strip" data-rolling={rolling ? "" : undefined} style={{ translate: `0 ${-100 * active}%` }}>
            {projects.map(project => (
              <div className="hover-reel__shot" key={project.href}><ProjectPreview project={project} /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
