export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// 个人信息类型
export interface Profile {
  id: string;
  name: string;
  tagline: string;
  about: string;
  interests: string;
  specialty: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// 聊天消息类型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// 更新个人信息的参数类型
export interface UpdateProfileParams {
  name?: string;
  tagline?: string;
  about?: string;
  interests?: string;
  specialty?: string;
  avatar_url?: string;
}
