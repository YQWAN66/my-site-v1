import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pencil, Sparkles } from 'lucide-react';
import type { Profile } from '@/types/index';

interface ProfileCardProps {
  profile: Profile;
  onEdit: () => void;
}

export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  return (
    <Card className="w-full border-primary/20 shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* 头像区域 */}
          <div className="relative animate-float">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {profile.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {/* 基本信息 */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              {profile.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {profile.tagline}
            </p>
          </div>

          {/* 详细信息 */}
          <div className="w-full space-y-4 text-left">
            <div className="space-y-2">
              <Badge variant="outline" className="mb-2">
                💼 现在主要在做
              </Badge>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {profile.about}
              </p>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="mb-2">
                ⚡ 兴趣
              </Badge>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {profile.interests}
              </p>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="mb-2">
                ✨ 特色特点
              </Badge>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {profile.specialty}
              </p>
            </div>
          </div>

          {/* 编辑按钮 */}
          <Button
            onClick={onEdit}
            variant="outline"
            className="w-full md:w-auto"
          >
            <Pencil className="w-4 h-4 mr-2" />
            编辑个人信息
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
