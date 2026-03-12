import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/types/index';
import { updateProfile, uploadAvatar } from '@/db/api';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onSuccess: () => void;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: EditProfileDialogProps) {
  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [about, setAbout] = useState(profile.about);
  const [interests, setInterests] = useState(profile.interests);
  const [specialty, setSpecialty] = useState(profile.specialty);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    // 验证文件大小（最大5MB，会自动压缩到1MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片文件不能超过5MB');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      if (url) {
        setAvatarUrl(url);
        toast.success('头像上传成功');
      } else {
        toast.error('头像上传失败，请重试');
      }
    } catch (error) {
      console.error('上传头像错误:', error);
      toast.error('头像上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('名字不能为空');
      return;
    }

    if (!tagline.trim()) {
      toast.error('一句话介绍不能为空');
      return;
    }

    setSaving(true);
    try {
      const success = await updateProfile(profile.id, {
        name: name.trim(),
        tagline: tagline.trim(),
        about: about.trim(),
        interests: interests.trim(),
        specialty: specialty.trim(),
        avatar_url: avatarUrl || undefined,
      });

      if (success) {
        toast.success('个人信息更新成功');
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error('更新失败，请重试');
      }
    } catch (error) {
      console.error('保存个人信息错误:', error);
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑个人信息</DialogTitle>
          <DialogDescription>
            更新您的个人信息和头像
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 头像上传 */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 border-2 border-primary/20">
              <AvatarImage src={avatarUrl || undefined} alt={name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    上传头像
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="space-y-2">
            <Label htmlFor="name">名字 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入名字"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">一句话介绍 *</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="请输入一句话介绍"
            />
          </div>

          {/* 详细信息 */}
          <div className="space-y-2">
            <Label htmlFor="about">现在主要在做</Label>
            <Textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="请输入您现在主要在做的事情"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">兴趣</Label>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="请输入您的兴趣"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">特色特点</Label>
            <Textarea
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="请输入您的特色特点"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              '保存'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
