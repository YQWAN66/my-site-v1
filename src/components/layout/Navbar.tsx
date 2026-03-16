import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/index';

interface NavbarProps {
  profile: Profile;
  onEditProfile: () => void;
  onEditAvatar: () => void;
}

export default function Navbar({ profile, onEditProfile, onEditAvatar }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between font-sans">
        {/* 左侧Logo文字 */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">ECh.</h1>
        </div>

        {/* 中间导航菜单 */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Home</a>
          <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Projects</a>
          <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Services</a>
          <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Contact</a>
        </div>

        {/* 右侧下载按钮 */}
        <div className="flex items-center">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-medium">
            Download CV
          </Button>
        </div>
      </div>
    </nav>
  );
}
