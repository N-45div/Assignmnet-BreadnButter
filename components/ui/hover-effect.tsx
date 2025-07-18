import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./button"; // Import Button component
import { ThumbsUp, ThumbsDown } from "lucide-react"; // Import icons
import { Talent } from "@/app/matching/types"; // Import Talent interface

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    talent: Talent; // Add talent object
    handleFeedback: (talentId: string, liked: boolean) => void; // Add feedback handler
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <Link href={item?.link} className="block">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <div className="mt-4 text-zinc-400 text-sm">
                <h4 className="font-semibold text-zinc-300">Categories:</h4>
                <p>{item.talent.categories.join(', ')}</p>
              </div>
              <div className="mt-2 text-zinc-400 text-sm">
                <h4 className="font-semibold text-zinc-300">Skills:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.talent.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="bg-zinc-700 px-2 py-0.5 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2 text-zinc-400 text-sm">
                <h4 className="font-semibold text-zinc-300">Styles:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.talent.style_tags.slice(0, 3).map((style) => (
                    <span key={style} className="bg-zinc-700 px-2 py-0.5 rounded-full text-xs">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => item.handleFeedback(item.talent.id, true)}
              >
                <ThumbsUp className="w-4 h-4 mr-1" /> Like
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => item.handleFeedback(item.talent.id, false)}
              >
                <ThumbsDown className="w-4 h-4 mr-1" /> Dislike
              </Button>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};