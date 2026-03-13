import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react';
import type { Profile } from '@/types/index';

interface HeroSectionProps {
  profile: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要内容 */}
      <div className="text-center space-y-8 animate-float">
        {/* 头像 */}
        <div className="flex justify-center">
          <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary/20 shadow-xl">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
            <AvatarFallback className="text-4xl md:text-5xl bg-primary/10 text-primary">
              {profile.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* 名称 */}
        <h1 className="text-5xl md:text-7xl font-bold gradient-text">
          {profile.name}
        </h1>

        {/* 一句话简介 */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          {profile.tagline}
        </p>
      </div>

      {/* 向下滚动提示 */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer bg-transparent border-none"
        aria-label="向下滚动"
      >
        <ChevronDown className="w-8 h-8 text-primary" />
      </button>
    </section>
  );
}
