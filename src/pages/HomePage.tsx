import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProfileCard from '@/components/profile/ProfileCard';
import EditProfileDialog from '@/components/profile/EditProfileDialog';
import ChatInterface from '@/components/chat/ChatInterface';
import { getProfile } from '@/db/api';
import type { Profile } from '@/types/index';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfile();
      if (data) {
        setProfile(data);
      } else {
        toast.error('加载个人信息失败');
      }
    } catch (error) {
      console.error('加载个人信息错误:', error);
      toast.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">无法加载个人信息</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* 页面标题 */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            欢迎来到我的个人主页
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            了解我，或与我的数字分身聊天
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* 左侧：个人信息 */}
          <div className="flex flex-col">
            <ProfileCard profile={profile} onEdit={() => setEditDialogOpen(true)} />
          </div>

          {/* 右侧：聊天界面 */}
          <div className="flex flex-col">
            <ChatInterface />
          </div>
        </div>

        {/* 页脚 */}
        <footer className="text-center mt-12 md:mt-16 text-sm text-muted-foreground">
          <p>© 2026 二川的个人主页</p>
        </footer>
      </div>

      {/* 编辑对话框 */}
      {profile && (
        <EditProfileDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          profile={profile}
          onSuccess={loadProfile}
        />
      )}
    </div>
  );
}
