import { supabase } from './supabase';
import type { Profile, ChatMessage, UpdateProfileParams } from '@/types/index';

// 获取个人信息
export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('获取个人信息失败:', error);
    return null;
  }

  return data;
}

// 更新个人信息
export async function updateProfile(
  id: string,
  updates: UpdateProfileParams
): Promise<boolean> {
  const { error } = await supabase
    .from('profile')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('更新个人信息失败:', error);
    return false;
  }

  return true;
}

// 获取聊天历史（最近20条）
export async function getChatMessages(): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(20);

  if (error) {
    console.error('获取聊天历史失败:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// 保存聊天消息
export async function saveChatMessage(
  role: 'user' | 'assistant',
  content: string
): Promise<boolean> {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      role,
      content
    });

  if (error) {
    console.error('保存聊天消息失败:', error);
    return false;
  }

  return true;
}

// 上传头像
export async function uploadAvatar(file: File): Promise<string | null> {
  try {
    // 压缩图片
    const compressedFile = await compressImage(file);
    
    // 生成文件名
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // 上传到Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('app-a7nruqi92jgh_profile_images')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('上传头像失败:', uploadError);
      return null;
    }

    // 获取公开URL
    const { data } = supabase.storage
      .from('app-a7nruqi92jgh_profile_images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('上传头像异常:', error);
    return null;
  }
}

// 压缩图片到1MB以下
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 限制最大分辨率为1080p
        const maxDimension = 1080;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // 尝试不同的质量级别直到文件小于1MB
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('压缩失败'));
                return;
              }

              // 如果文件大于1MB且质量还可以降低，继续压缩
              if (blob.size > 1024 * 1024 && quality > 0.1) {
                quality -= 0.1;
                tryCompress();
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              }
            },
            'image/webp',
            quality
          );
        };

        tryCompress();
      };
      img.onerror = () => reject(new Error('图片加载失败'));
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
  });
}
