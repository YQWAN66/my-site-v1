import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, User } from 'lucide-react';
import type { Profile } from '@/types/index';

interface NavbarProps {
  profile: Profile;
  onEditProfile: () => void;
  onEditAvatar: () => void;
}

export default function Navbar({ profile, onEditProfile, onEditAvatar }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/标题 */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold gradient-text">二川的个人主页</h1>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-3">
          {/* 头像 - 点击修改 */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onEditAvatar}
          >
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {profile.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Button>

          {/* 设置菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditProfile}>
                <User className="w-4 h-4 mr-2" />
                修改个人资料
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
