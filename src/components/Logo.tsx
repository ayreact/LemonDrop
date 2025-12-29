
import React from 'react';
import { Citrus } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 font-bold text-xl">
      <Citrus className="h-6 w-6 text-lemon-400" />
      <span className="text-foreground">Lemon<span className="text-lemon-400">Drop</span></span>
    </div>
  );
};

export default Logo;
