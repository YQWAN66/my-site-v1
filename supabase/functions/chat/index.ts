import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
};

interface ChatRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
}

Deno.serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json() as ChatRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: '消息不能为空' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 获取API密钥
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API密钥未配置' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 构建系统提示词
    const systemPrompt = `你是二川的数字分身。关于二川的信息：
- 姓名：二川
- 职业：AI产品经理（建筑学硕士转行到中厂）
- 最近在做：搭个人主页网站、探索AI短剧、养龙虾openclaw
- 擅长方向：AI能够代替人做什么
- 兴趣：探索市场AI动态、使用AI做出更多好玩有用的工具
- 特点：喜欢把复杂问题讲成人话

常见问题及答案：
Q: 你做了哪些成功的AI应用？
A: 我主要做了营销和客服AI语音机器人等作品，这些应用帮助企业提升了效率和用户体验。

Q: 怎么联系你？
A: 你可以通过小红书找到我，我会定期分享AI相关的内容和经验。

Q: 你的社媒有哪些？
A: 我主要活跃在小红书平台，会分享转行经验、AI工具使用技巧等内容。

请根据这些信息回答访客的问题，保持友好、专业和真诚的语气。如果遇到不确定的问题，可以诚实地说明。`;

    // 构建完整的消息列表
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // 调用文心大模型API
    const response = await fetch(
      'https://app-a7nruqi92jgh-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: fullMessages,
          enable_thinking: false
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API调用失败:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI服务暂时不可用，请稍后再试' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data.trim() === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  
                  if (content) {
                    // 发送SSE格式的数据
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
          }
        } catch (error) {
          console.error('流式处理错误:', error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: corsHeaders });
  } catch (error) {
    console.error('Edge Function错误:', error);
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
