import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Image, Video } from 'lucide-react';

// 联系方式数据
const contacts = [
  {
    id: 'wechat',
    icon: MessageCircle,
    label: '微信',
    url: 'https://weixin.qq.com/', // 模拟链接
    color: '#07C160'
  },
  {
    id: 'email',
    icon: Mail,
    label: '邮箱',
    url: 'mailto:example@example.com', // 模拟链接
    color: '#EA4335'
  },
  {
    id: 'xiaohongshu',
    icon: Image,
    label: '小红书',
    url: 'https://www.xiaohongshu.com/', // 模拟链接
    color: '#FE2C55'
  },
  {
    id: 'douyin',
    icon: Video,
    label: '抖音',
    url: 'https://www.douyin.com/', // 模拟链接
    color: '#000000'
  }
];

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 left-6 flex flex-row gap-3 z-40">
      {contacts.map((contact) => {
        const Icon = contact.icon;
        return (
          <Button
            key={contact.id}
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
            onClick={() => window.open(contact.url, contact.id === 'email' ? '_self' : '_blank')}
            title={contact.label}
          >
            <Icon className="w-5 h-5" style={{ color: contact.color }} />
          </Button>
        );
      })}
    </div>
  );
}