import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot, MessageCircle, X, Minus } from 'lucide-react';
import { toast } from 'sonner';
import MessageBubble from '@/components/chat/MessageBubble';
import { sendStreamRequest } from '@/utils/stream';
import { saveChatMessage, getChatMessages } from '@/db/api';
import type { ChatMessage } from '@/types/index';
import { cn } from '@/lib/utils';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 加载历史消息
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current && isOpen) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, streamingContent, isOpen]);

  const loadChatHistory = async () => {
    const history = await getChatMessages();
    setMessages(history);
  };

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setIsLoading(true);
    setStreamingContent('');
    setIsStreaming(true);

    await saveChatMessage('user', userMessage);
    
    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    const chatHistory = [...messages, newUserMessage].map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

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
            await saveChatMessage('assistant', fullContent);
            
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
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <Card
          className={cn(
            'fixed bottom-6 right-6 w-[90vw] md:w-[400px] shadow-2xl z-50 border-primary/20 transition-all',
            isMinimized ? 'h-14' : 'h-[600px]'
          )}
        >
          {/* 标题栏 */}
          <CardHeader className="border-b p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="w-5 h-5 text-primary" />
              与数字分身聊天
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* 内容区域 */}
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(100%-57px)]">
              {/* 消息列表 */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
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
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息..."
                    className="min-h-[50px] resize-none text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="shrink-0 h-[50px] w-[50px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
}
