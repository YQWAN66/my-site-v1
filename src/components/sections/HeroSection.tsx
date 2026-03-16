import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Star } from 'lucide-react';
import type { Profile } from '@/types/index';

interface HeroSectionProps {
  profile: Profile;
}

// 评价卡片组件
const ReviewCard = () => {
  return (
    <Card className="relative shadow-lg p-4 border-primary/20 hover:shadow-xl transition-shadow">
      <CardContent className="space-y-3">
        {/* 评分 */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        {/* 评价内容 */}
        <p className="text-sm text-muted-foreground">
          "优秀的AI产品经理，有丰富的经验和创新思维。"
        </p>
        {/* 用户信息 */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              李
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">李总</p>
            <p className="text-xs text-muted-foreground">某科技公司CEO</p>
          </div>
        </div>
      </CardContent>
      {/* 悬浮装饰 */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-primary/10 rounded-full blur-md" />
    </Card>
  );
};

export default function HeroSection({ profile }: HeroSectionProps) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative px-4 py-10">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要内容：左中右三栏布局 */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* 左侧内容 */}
        <div className="space-y-8 animate-float">
          {/* 标题区域 */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">Hi! I Am</h2>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">
              {profile.name}
            </h1>
          </div>
          {/* 经验标签 */}
          <div>
            <Badge variant="outline" className="text-lg px-6 py-3 border-primary/30 bg-primary/5">
              3年AI产品经理大厂工作经验
            </Badge>
          </div>
        </div>

        {/* 中间视觉 */}
        <div className="relative flex justify-center items-center animate-float" style={{ animationDelay: '0.3s' }}>
          {/* 装饰性曲线 */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-pulse" style={{ transform: 'scale(1.2)' }} />
          {/* 淡色圆形背景 */}
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" style={{ transform: 'scale(1.1)' }} />
          {/* 头像 */}
          <Avatar className="w-48 h-48 md:w-64 md:h-64 border-4 border-primary/30 shadow-2xl">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
            <AvatarFallback className="text-5xl md:text-7xl bg-primary/10 text-primary">
              {profile.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {/* 装饰性元素 */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full blur-md" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/5 rounded-full blur-md" />
        </div>

        {/* 右侧内容 */}
        <div className="space-y-8 animate-float" style={{ animationDelay: '0.6s' }}>
          {/* 副标题 */}
          <div>
            <h3 className="text-2xl font-semibold text-muted-foreground">
              AI Product Manager | AI Agent Builder
            </h3>
          </div>
          {/* 评价卡片 */}
          <div className="relative">
            <ReviewCard />
            {/* 悬浮效果装饰 */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full blur-md opacity-70" />
          </div>
        </div>
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
};
