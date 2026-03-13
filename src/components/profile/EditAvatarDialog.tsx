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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/types/index';
import { updateProfile, uploadAvatar } from '@/db/api';

interface EditAvatarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onSuccess: () => void;
}

export default function EditAvatarDialog({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: EditAvatarDialogProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

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
    setSaving(true);
    try {
      const success = await updateProfile(profile.id, {
        avatar_url: avatarUrl || undefined,
      });

      if (success) {
        toast.success('头像更新成功');
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error('更新失败，请重试');
      }
    } catch (error) {
      console.error('保存头像错误:', error);
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>修改头像</DialogTitle>
          <DialogDescription>
            上传新的头像图片
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-6">
          <Avatar className="w-32 h-32 border-4 border-primary/20">
            <AvatarImage src={avatarUrl || undefined} alt={profile.name} />
            <AvatarFallback className="text-3xl bg-primary/10 text-primary">
              {profile.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <input
              type="file"
              id="avatar-upload-simple"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('avatar-upload-simple')?.click()}
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
                  选择图片
                </>
              )}
            </Button>
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
