'use client';

import { useState } from 'react';
import { CreateTypes } from 'canvas-confetti';
import ConfettiCanvas from './ConfettiCanvas';

export default function Confetti() {
  const [, setAnimationInstance] = useState<CreateTypes>();

  const getInstance = (instance: CreateTypes | null) => {
    if (instance) {
      setAnimationInstance(instance);
      setAnimationInstance({
        options: {
          spread: 50,
          startVelocity: 100,
          origin: { y: 0.8 },
        },
        particleCount: Math.floor(200 * 0.1),
      });
    }
  };

  return <ConfettiCanvas refConfetti={getInstance} className="canvas" />;
}
