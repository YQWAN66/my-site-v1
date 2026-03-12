-- 创建个人信息表
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default '二川',
  tagline text not null default '建筑学硕士转行中厂担任AI产品经理',
  about text not null default '现在主要在做：整理自己的作品：营销、客服AI语音机器人；分享转行学习经验分享；闲余时间做AI提效工具',
  interests text not null default '探索市场AI动态、使用AI做出更多好玩有用的工具',
  specialty text not null default '喜欢把复杂问题讲成人话',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 创建聊天消息表
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- 创建索引
create index if not exists chat_messages_created_at_idx on chat_messages(created_at desc);

-- 插入默认个人信息
insert into profile (name, tagline, about, interests, specialty)
values (
  '二川',
  '建筑学硕士转行中厂担任AI产品经理',
  '现在主要在做：整理自己的作品：营销、客服AI语音机器人；分享转行学习经验分享；闲余时间做AI提效工具',
  '探索市场AI动态、使用AI做出更多好玩有用的工具',
  '喜欢把复杂问题讲成人话'
)
on conflict (id) do nothing;

-- 创建图片存储bucket
insert into storage.buckets (id, name, public)
values ('app-a7nruqi92jgh_profile_images', 'app-a7nruqi92jgh_profile_images', true)
on conflict (id) do nothing;

-- 设置存储bucket策略（允许所有人上传和读取）
create policy "允许所有人上传头像"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'app-a7nruqi92jgh_profile_images');

create policy "允许所有人读取头像"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'app-a7nruqi92jgh_profile_images');

create policy "允许所有人删除头像"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'app-a7nruqi92jgh_profile_images');

-- 设置profile表策略
create policy "允许所有人读取个人信息"
on profile for select
to anon, authenticated
using (true);

create policy "允许所有人更新个人信息"
on profile for update
to anon, authenticated
using (true);

-- 设置chat_messages表策略
create policy "允许所有人读取聊天消息"
on chat_messages for select
to anon, authenticated
using (true);

create policy "允许所有人插入聊天消息"
on chat_messages for insert
to anon, authenticated
with check (true);