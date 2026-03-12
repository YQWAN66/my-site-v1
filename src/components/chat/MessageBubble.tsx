import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function MessageBubble({ role, content, isStreaming = false }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* 头像 */}
      <Avatar className={cn('w-8 h-8 shrink-0', isUser ? 'bg-primary' : 'bg-secondary')}>
        <AvatarFallback>
          {isUser ? (
            <User className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Bot className="w-4 h-4 text-secondary-foreground" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* 消息内容 */}
      <div
        className={cn(
          'rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[75%]',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
            <Streamdown
              parseIncompleteMarkdown={true}
              isAnimating={isStreaming}
            >
              {content}
            </Streamdown>
          </div>
        )}
      </div>
    </div>
  );
}
