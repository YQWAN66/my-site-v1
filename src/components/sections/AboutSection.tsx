import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Wrench, Tv, Dribbble } from 'lucide-react';
import type { Profile } from '@/types/index';

interface AboutSectionProps {
  profile: Profile;
}

// 现在主要在做的项目
const projects = [
  {
    title: '营销AI语音机器人',
    description: '智能营销解决方案',
    icon: '🤖',
    image: 'project-marketing-ai.jpg',
  },
  {
    title: '客服AI语音机器人',
    description: '提升客户服务体验',
    icon: '💬',
    image: 'project-customer-service.jpg',
  },
  {
    title: 'Opneclaw 多Agent协同',
    description: '探索多Agent协同范式',
    icon: '',
    image: 'project-personal-website.jpg',
  },
  {
    title: 'AI提效工具',
    description: '提高工作效率的工具',
    icon: '⚡',
    image: 'project-ai-tools.jpg',
  },
];

// 兴趣爱好
const interests = [
  {
    title: '探索市场AI动态',
    icon: TrendingUp,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: '使用AI做工具',
    icon: Wrench,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: '看动漫',
    icon: Tv,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: '打篮球',
    icon: Dribbble,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-16">
        {/* 产品创新 */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-2xl px-4 py-2 border-none bg-transparent shadow-none">
              产品创新
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20"
              >
                <CardContent className="p-6 space-y-4">
                  {/* 图标/图片占位 */}
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                    {project.icon}
                  </div>
                  {/* 标题 */}
                  <h3 className="font-semibold text-lg text-center">
                    {project.title}
                  </h3>
                  {/* 描述 */}
                  <p className="text-sm text-muted-foreground text-center">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 职业兴趣 */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-2xl px-4 py-2 border-none bg-transparent shadow-none">
              职业兴趣
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {interests.map((interest, index) => {
              const Icon = interest.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 group"
                >
                  {/* 圆形图标 */}
                  <div
                    className={`w-24 h-24 md:w-28 md:h-28 rounded-full ${interest.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className={`w-12 h-12 md:w-14 md:h-14 ${interest.color}`} />
                  </div>
                  {/* 标题 */}
                  <p className="text-sm md:text-base font-medium text-center">
                    {interest.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 深度洞察 */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-2xl px-4 py-2 border-none bg-transparent shadow-none">
              深度洞察
            </Badge>
          </div>
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
                <p className="text-lg text-foreground/90 leading-relaxed">
                  {profile.specialty}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
