import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import FloatingContact from '@/components/layout/FloatingContact';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import FloatingChat from '@/components/chat/FloatingChat';
import EditProfileDialog from '@/components/profile/EditProfileDialog';
import EditAvatarDialog from '@/components/profile/EditAvatarDialog';
import { getProfile } from '@/db/api';
import type { Profile } from '@/types/index';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
  const [editAvatarDialogOpen, setEditAvatarDialogOpen] = useState(false);

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
      {/* 顶部导航栏 */}
      <Navbar
        profile={profile}
        onEditProfile={() => setEditProfileDialogOpen(true)}
        onEditAvatar={() => setEditAvatarDialogOpen(true)}
      />

      {/* 第一页：Hero Section */}
      <HeroSection profile={profile} />

      {/* 第二页：详细信息 */}
      <AboutSection profile={profile} />

      {/* 页脚 */}
      <footer className="text-center py-8 text-sm text-muted-foreground border-t">
        <p>© 2026 二川的个人主页</p>
      </footer>

      {/* 悬浮聊天窗口 */}
      <FloatingChat />

      {/* 悬浮联系方式 */}
      <FloatingContact />

      {/* 编辑个人资料对话框 */}
      {profile && (
        <EditProfileDialog
          open={editProfileDialogOpen}
          onOpenChange={setEditProfileDialogOpen}
          profile={profile}
          onSuccess={loadProfile}
        />
      )}

      {/* 编辑头像对话框 */}
      {profile && (
        <EditAvatarDialog
          open={editAvatarDialogOpen}
          onOpenChange={setEditAvatarDialogOpen}
          profile={profile}
          onSuccess={loadProfile}
        />
      )}
    </div>
  );
}
