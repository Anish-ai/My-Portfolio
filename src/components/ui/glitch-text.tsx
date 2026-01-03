"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
    text: string
    href?: string // Optional: if provided, renders as link
    className?: string
    onClick?: () => void
}

export default function GlitchText({ text, href, className, onClick }: GlitchTextProps) {
    const [displayText, setDisplayText] = useState(text)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&"
    
    const scramble = () => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text.split("")
                    .map((char, index) => {
                        if (index < iterations) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 2; // Speed
        }, 30);
    }

    const content = (
        <span className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-primary transition-colors rotate-45" />
             {displayText}
        </span>
    )
    
    const classes = cn(
        "font-mono text-gray-400 hover:text-primary transition-colors uppercase tracking-wider text-sm group cursor-pointer", 
        className
    )

    if (href) {
        return (
            <a 
                href={href} 
                onMouseEnter={scramble}
                onMouseLeave={() => setDisplayText(text)}
                onClick={onClick}
                className={classes}
            >
                {content}
            </a>
        )
    }

    return (
        <div 
            onMouseEnter={scramble}
            onMouseLeave={() => setDisplayText(text)}
            onClick={onClick}
            className={classes}
        >
             {content}
        </div>
    )
}
