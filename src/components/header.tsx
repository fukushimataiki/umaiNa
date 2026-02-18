"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Menu, User, LogOut, Settings, Crown, MapPin, UtensilsCrossed, Home, Plus, ShieldCheck } from "lucide-react"
import { rankConfig } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "ホーム", href: "/", icon: Home },
  { name: "スポット", href: "/spots", icon: MapPin },
  { name: "レシピ", href: "/recipes", icon: UtensilsCrossed },
]

export function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const rankInfo = user ? rankConfig[user.rank] : null
  const isLoggedIn = isAuthenticated;

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-warm-700 shadow-sm transition-transform group-hover:scale-105 sm:h-9 sm:w-9">
            <span className="text-base font-bold text-white sm:text-lg">U</span>
          </div>
          <span className="text-lg font-bold text-foreground sm:text-xl" style={{ fontFamily: 'var(--font-zen-maru), sans-serif' }}>
            umaiNa
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-0.5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/8 hover:text-primary xl:px-4"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Post buttons - Desktop */}
              <div className="hidden items-center gap-2 lg:flex">
                <Button variant="outline" size="sm" asChild className="hidden rounded-xl border-primary/20 bg-transparent text-primary hover:bg-primary/8 hover:text-primary xl:inline-flex">
                  <Link href="/spots/new">
                    <MapPin className="mr-2 h-4 w-4" />
                    スポット投稿
                  </Link>
                </Button>
                <Button size="sm" asChild className="rounded-xl bg-gradient-to-r from-primary to-warm-600 shadow-sm hover:shadow-md">
                  <Link href="/recipes/new">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden xl:inline">レシピ投稿</span>
                    <span className="xl:hidden">投稿</span>
                  </Link>
                </Button>
              </div>

              {/* User menu */}
              {user && rankInfo && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/10 transition-all hover:ring-primary/30">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-warm-200 text-primary font-medium">
                          {user.nickname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {user.isDeviceOwner && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-sm">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-warm-200 text-primary font-medium">
                          {user.nickname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{user.nickname}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ color: rankInfo.color }}
                          >
                            {rankInfo.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{user.points}pt</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex cursor-pointer items-center">
                        <User className="mr-2 h-4 w-4" />
                        マイページ
                      </Link>
                    </DropdownMenuItem>
                    {user.isDeviceOwner && (
                      <DropdownMenuItem asChild>
                        <Link href="/owners-lounge" className="flex cursor-pointer items-center">
                          <Crown className="mr-2 h-4 w-4 text-[#FFD700]" />
                          {"Owner's Lounge"}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex cursor-pointer items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        設定
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      ログアウト
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/login">ログイン</Link>
              </Button>
              <Button size="sm" asChild className="rounded-xl bg-gradient-to-r from-primary to-warm-600 shadow-sm">
                <Link href="/register">新規登録</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">メニューを開く</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-80">
              <nav className="mt-6 flex flex-col gap-1.5">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground transition-all hover:bg-primary/8 hover:text-primary"
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    {item.name}
                  </Link>
                ))}
                <hr className="my-3 border-border" />
                {isLoggedIn && user && (
                  <>
                    <Link
                      href="/spots/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground transition-all hover:bg-primary/8 hover:text-primary"
                    >
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      スポット投稿
                    </Link>
                    <Link
                      href="/recipes/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground transition-all hover:bg-primary/8 hover:text-primary"
                    >
                      <Plus className="h-5 w-5 text-muted-foreground" />
                      レシピ投稿
                    </Link>
                    {user.isDeviceOwner && (
                      <Link
                        href="/owners-lounge"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 text-base font-medium text-foreground"
                      >
                        <Crown className="h-5 w-5 text-[#FFD700]" />
                        {"Owner's Lounge"}
                      </Link>
                    )}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
