import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot } from 'lucide-react';
import { toast } from 'sonner';
import MessageBubble from './MessageBubble';
import { sendStreamRequest } from '@/utils/stream';
import { saveChatMessage, getChatMessages } from '@/db/api';
import type { ChatMessage } from '@/types/index';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 加载历史消息
  useEffect(() => {
    loadChatHistory();
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, streamingContent]);

  const loadChatHistory = async () => {
    const history = await getChatMessages();
    setMessages(history);
  };

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    // 清空输入框
    setInput('');
    setIsLoading(true);
    setStreamingContent('');
    setIsStreaming(true);

    // 保存用户消息
    await saveChatMessage('user', userMessage);
    
    // 添加用户消息到界面
    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // 准备消息历史
    const chatHistory = [...messages, newUserMessage].map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 创建中断控制器
    abortControllerRef.current = new AbortController();

    try {
      let fullContent = '';

      await sendStreamRequest({
        functionUrl: `${SUPABASE_URL}/functions/v1/chat`,
        requestBody: { messages: chatHistory },
        supabaseAnonKey: SUPABASE_ANON_KEY,
        onData: (data) => {
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed.content || '';
            fullContent += chunk;
            setStreamingContent(fullContent);
          } catch (e) {
            console.warn('解析数据失败:', e);
          }
        },
        onComplete: async () => {
          setIsStreaming(false);
          setIsLoading(false);

          if (fullContent) {
            // 保存助手消息
            await saveChatMessage('assistant', fullContent);
            
            // 添加助手消息到界面
            const assistantMessage: ChatMessage = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: fullContent,
              created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setStreamingContent('');
          }
        },
        onError: (error) => {
          console.error('聊天请求失败:', error);
          toast.error('发送消息失败，请重试');
          setIsStreaming(false);
          setIsLoading(false);
          setStreamingContent('');
        },
        signal: abortControllerRef.current.signal,
      });
    } catch (error) {
      console.error('发送消息错误:', error);
      toast.error('发送消息失败');
      setIsStreaming(false);
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full border-primary/20 shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          与数字分身聊天
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* 消息列表 */}
        <ScrollArea ref={scrollAreaRef} className="h-[400px] md:h-[500px] p-4">
          {messages.length === 0 && !streamingContent && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">你好！我是二川的数字分身</p>
              <p className="text-xs mt-2">有什么想了解的吗？</p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}

          {streamingContent && (
            <MessageBubble
              role="assistant"
              content={streamingContent}
              isStreaming={isStreaming}
            />
          )}
        </ScrollArea>

        {/* 输入区域 */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Enter发送，Shift+Enter换行)"
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0 h-[60px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
