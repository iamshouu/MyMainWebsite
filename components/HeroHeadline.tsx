import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppleHelloEnglishEffect } from './ui/apple-hello-effect';

const HeroHeadline: React.FC = () => {
  const [showIdentity, setShowIdentity] = useState(false);

  return (
    <h1
      aria-label={showIdentity ? "i'm shou" : 'hello'}
      className="font-['Outfit'] flex min-h-28 items-center justify-center px-4 py-6 text-white md:min-h-52 md:px-14 md:py-10"
    >
      <AnimatePresence mode="wait">
        {showIdentity ? (
          <motion.span
            key="identity"
            aria-hidden="true"
            className="font-['Dancing_Script'] text-[clamp(3.7rem,10.5vw,7.8rem)] font-medium leading-none tracking-[-0.045em] text-white/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            i&apos;m shou
          </motion.span>
        ) : (
          <motion.div
            key="hello"
            aria-hidden="true"
            className="flex w-full justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
          >
            <AppleHelloEnglishEffect
              speed={1.1}
              onAnimationComplete={() => setShowIdentity(true)}
              className="w-[min(76vw,28rem)] text-white/85 drop-shadow-[0_0_26px_rgba(255,255,255,0.16)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </h1>
  );
};

export default HeroHeadline;
