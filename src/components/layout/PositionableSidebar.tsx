'use client';

import { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClockIcon,
  SparklesIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatIconSolid,
  ChartBarIcon as ChartIconSolid,
  CogIcon as CogIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  PlusCircleIcon as PlusCircleIconSolid
} from '@heroicons/react/24/solid';

const getNavigation = (showAdminChats: boolean) => {
  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      count: null,
      color: 'blue'
    },
    {
      name: 'Chats',
      href: '/chats',
      icon: ChatBubbleLeftRightIcon,
      iconSolid: ChatIconSolid,
      count: 23,
      color: 'green'
    },
    {
      name: 'Team',
      href: '/team',
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid,
      count: 5,
      color: 'indigo'
    },
    {
      name: 'Knowledge Base',
      href: '/knowledge-base',
      icon: BookOpenIcon,
      iconSolid: BookOpenIconSolid,
      count: null,
      color: 'teal'
    }
  ];

  // Insert Admin Chats after Team if showAdminChats is true
  if (showAdminChats) {
    baseNavigation.splice(3, 0, {
      name: 'Admin Chats',
      href: '/admin-chats',
      icon: ChatBubbleLeftRightIcon,
      iconSolid: ChatIconSolid,
      count: null,
      color: 'red'
    });
  }

  // Add the rest of the navigation items
  baseNavigation.push(
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      iconSolid: ChartIconSolid,
      count: null,
      color: 'purple'
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: DocumentTextIcon,
      iconSolid: DocumentTextIconSolid,
      count: null,
      color: 'orange'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
      iconSolid: CogIconSolid,
      count: null,
      color: 'gray'
    }
  );

  return baseNavigation;
};

interface PositionableSidebarProps {
  position: 'left' | 'top' | 'bottom';
  onPositionChange?: (position: 'left' | 'top' | 'bottom') => void;
  showPositionSwitcher?: boolean;
}

export default function PositionableSidebar({
  position,
  onPositionChange,
  showPositionSwitcher = false
}: PositionableSidebarProps) {
  const { setPosition } = useSidebar();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminChats, setShowAdminChats] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      setUserProfile({
        name: profile?.name || 'User',
        email: user.email || ''
      });
    }

    fetchUserProfile();
  }, [user]);

  // Handle triple-click on notifications
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);

    // Increment click count
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Clear existing timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    // Check if triple-click
    if (newClickCount === 3) {
      setShowAdminChats(!showAdminChats);
      setClickCount(0);
      setClickTimeout(null);
    } else {
      // Set timeout to reset click count
      const timeout = setTimeout(() => {
        setClickCount(0);
      }, 500); // 500ms window for triple-click
      setClickTimeout(timeout);
    }
  };

  const notifications = [
    {
      id: 1,
      type: 'reply',
      message: 'New reply from Emily Davis',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'update',
      message: 'Order #12345 status updated',
      time: '15 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'reply',
      message: 'New reply from Robert Wilson',
      time: '1 hour ago',
      unread: false
    }
  ];

  const navigation = getNavigation(showAdminChats);

  // Get user initials
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName = userProfile?.name || 'User';
  const displayEmail = userProfile?.email || '';
  const userInitials = getUserInitials(displayName);

  // Render horizontal layout for top/bottom positions
  if (position === 'top' || position === 'bottom') {
    return (
      <div className={`bg-white border-gray-200 flex items-center justify-between px-6 py-3 z-20 relative ${
        position === 'top' ? 'border-b shadow-sm' : 'border-t shadow-sm'
      }`}>
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Logo"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="text-base font-semibold text-gray-900">Beeylo</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = isActive ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                } relative`}
                title={item.name}
              >
                <IconComponent
                  className={`h-5 w-5 mr-2 transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                />
                <span>{item.name}</span>
                {item.count && (
                  <span className="ml-2 h-5 px-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Search Button */}
          <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors group">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          </button>

          {/* User Profile */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center hover:bg-gray-50 rounded-lg p-1.5 transition-colors">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{userInitials}</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400 ml-1" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 top-full mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{displayEmail}</p>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center px-4 py-2.5 text-sm text-gray-700`}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center px-4 py-2.5 text-sm text-gray-700`}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={signOut}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center px-4 py-2.5 text-sm text-red-600 w-full text-left`}
                      >
                        <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    );
  }

  // Render vertical layout for left position
  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4">
        {/* Logo and Title */}
        <div className="flex items-center justify-between mb-4">
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
              title="Expand sidebar"
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            </button>
          ) : (
            <>
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="rounded"
                />
                <span className="text-base font-semibold text-gray-900">Beeylo</span>
              </Link>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronRightIcon className="h-4 w-4 text-gray-500 rotate-180" />
              </button>
            </>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-0.5">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">F</kbd>
            </div>
          </div>
        )}

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
            title="Expand sidebar"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navigation.slice(0, 4)
            .filter(item =>
              !searchQuery ||
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = isActive ? item.iconSolid : item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <IconComponent
                    className={`${isCollapsed ? 'h-5 w-5' : 'h-5 w-5 mr-3'} transition-colors ${
                      isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.count && (
                        <span className="ml-auto h-5 px-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full flex items-center justify-center">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.count && (
                    <span className="absolute top-1 right-1 h-4 w-4 text-xs font-bold text-white bg-blue-500 rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
        </div>

        {/* OTHER Section */}
        {!isCollapsed && (
          <>
            <div className="mt-6 mb-2 px-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Other</h3>
            </div>
            <div className="space-y-1">
              {navigation.slice(4)
                .filter(item =>
                  !searchQuery ||
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = isActive ? item.iconSolid : item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent
                        className={`h-5 w-5 mr-3 transition-colors ${
                          isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                        }`}
                      />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  );
                })}

              {/* Beey Button */}
              <Link
                href="/beey"
                className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/beey'
                    ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-gray-900'
                    : 'bg-amber-50 text-gray-700 hover:bg-amber-100'
                }`}
              >
                <PlusCircleIcon
                  className={`h-5 w-5 mr-3 transition-colors ${
                    pathname === '/beey' ? 'text-amber-600' : 'text-amber-500 group-hover:text-amber-600'
                  }`}
                />
                <span className="flex-1">Beey</span>
              </Link>

            </div>
          </>
        )}

        {isCollapsed && (
          <div className="mt-4 space-y-1">
            {navigation.slice(4).map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = isActive ? item.iconSolid : item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50'
                      : 'hover:bg-gray-50'
                  }`}
                  title={item.name}
                >
                  <IconComponent
                    className={`h-5 w-5 transition-colors ${
                      isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                </Link>
              );
            })}

            {/* Beey Button - Collapsed */}
            <Link
              href="/beey"
              className={`w-full group flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 ${
                pathname === '/beey'
                  ? 'bg-gradient-to-r from-amber-100 to-yellow-100'
                  : 'bg-amber-50 hover:bg-amber-100'
              }`}
              title="Beey"
            >
              <PlusCircleIcon
                className={`h-5 w-5 ${
                  pathname === '/beey' ? 'text-amber-600' : 'text-amber-500 group-hover:text-amber-600'
                }`}
              />
            </Link>
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-gray-200">
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center w-full text-left hover:bg-gray-50 rounded-lg p-2 transition-colors">
            <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-white">{userInitials}</span>
              </div>
              {!isCollapsed && (
                <>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                </>
              )}
            </div>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={`absolute left-0 bottom-full mb-2 origin-bottom bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${
              isCollapsed ? 'w-56 left-full ml-2 bottom-0' : 'w-full'
            }`}>
              <div className="py-1">
                {!isCollapsed && (
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{displayEmail}</p>
                  </div>
                )}
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/settings"
                      className={`${
                        active ? 'bg-gray-50' : ''
                      } flex items-center px-4 py-2.5 text-sm text-gray-700`}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/settings"
                      className={`${
                        active ? 'bg-gray-50' : ''
                      } flex items-center px-4 py-2.5 text-sm text-gray-700`}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <div className="border-t border-gray-100 my-1"></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={signOut}
                      className={`${
                        active ? 'bg-gray-50' : ''
                      } flex items-center px-4 py-2.5 text-sm text-red-600 w-full text-left`}
                    >
                      <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

    </div>
  );
}