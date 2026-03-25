import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '您好，我是二川，有什么我可以帮助您的吗？',
      sender: 'bot'
    }
  ]);

  // 常见问题列表
  const commonQuestions = [
    '介绍下你自己？',
    '你是男生吗？',
    '你能做什么？'
  ];

  // 模拟发送消息
  const sendMessage = (text: string) => {
    // 添加用户消息
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text,
        sender: 'user'
      }
    ]);

    // 模拟机器人回复
    setTimeout(() => {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text,
          sender: 'user'
        },
        {
          id: Date.now() + 1,
          text: `您刚才问的是："${text}"\n这是一个模拟回复，实际项目中可以连接到真实的AI服务。`,
          sender: 'bot'
        }
      ]);
    }, 1000);
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

          {/* 内容区域 - 本地聊天界面 */}
          {!isMinimized && (
            <CardContent className="p-0 h-[calc(100%-57px)] flex flex-col">
              {/* 消息展示区域 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg ${message.sender === 'bot' 
                        ? 'bg-primary/10 text-foreground rounded-tr-none' 
                        : 'bg-primary text-primary-foreground rounded-tl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* 常见问题区域 */}
              <div className="border-t p-4 space-y-3">
                <p className="text-sm text-muted-foreground">常见问题：</p>
                <div className="flex flex-wrap gap-2">
                  {commonQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="text-xs whitespace-nowrap"
                      onClick={() => sendMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
}
