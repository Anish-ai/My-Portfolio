"use client"

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MagneticButtonProps {
    children: React.ReactElement;
}

export default function MagneticButton({ children }: MagneticButtonProps) {
    const magnetic = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!magnetic.current) return;

        const xTo = gsap.quickTo(magnetic.current, "x", {duration: 1, ease: "elastic.out(1, 0.3)"})
        const yTo = gsap.quickTo(magnetic.current, "y", {duration: 1, ease: "elastic.out(1, 0.3)"})

        const mouseMove = (e: MouseEvent) => {
            if (!magnetic.current) return;
            const { clientX, clientY } = e;
            const { height, width, left, top } = magnetic.current.getBoundingClientRect();
            const x = clientX - (left + width / 2)
            const y = clientY - (top + height / 2)
            xTo(x * 0.35); // Adjust multiplier for stronger/weaker effect
            yTo(y * 0.35);
        }

        const mouseLeave = () => {
            xTo(0);
            yTo(0);
        }

        magnetic.current.addEventListener("mousemove", mouseMove)
        magnetic.current.addEventListener("mouseleave", mouseLeave)

        return () => {
            if (magnetic.current) {
                magnetic.current.removeEventListener("mousemove", mouseMove)
                magnetic.current.removeEventListener("mouseleave", mouseLeave)
            }
        }
    }, { scope: magnetic }); // Scope ensures cleanups

    return (
        <div ref={magnetic} className="relative inline-block cursor-pointer">
            {React.cloneElement(children, {
                // Ensure the child preserves its own ref if it has one, though complicate here. 
                // For simple usage, we just wrap it.
            })}
        </div>
    )
}
