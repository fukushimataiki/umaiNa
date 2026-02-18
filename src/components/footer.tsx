import Link from "next/link"

const footerLinks = {
  サービス: [
    { name: "スポット検索", href: "/spots" },
    { name: "レシピ検索", href: "/recipes" },
    { name: "ランキング", href: "/ranking" },
  ],
  サポート: [
    { name: "使い方ガイド", href: "/guide" },
    { name: "よくある質問", href: "/faq" },
    { name: "お問い合わせ", href: "/contact" },
  ],
  会社情報: [
    { name: "運営会社", href: "/company" },
    { name: "利用規約", href: "/terms" },
    { name: "プライバシーポリシー", href: "/privacy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-gradient-to-b from-card to-warm-50/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group flex items-center gap-1.5 sm:gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-warm-700 shadow-sm sm:h-9 sm:w-9">
                <span className="text-base font-bold text-white sm:text-lg">U</span>
              </div>
              <span className="text-lg font-bold text-foreground sm:text-xl" style={{ fontFamily: 'var(--font-zen-maru), sans-serif' }}>
                umaiNa
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm">
              減塩をポジティブに。
              <br />
              美味しさをデザインする。
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-foreground sm:text-sm">{category}</h3>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 sm:mt-12 sm:pt-8">
          <p className="text-center text-xs text-muted-foreground sm:text-sm">
            &copy; {new Date().getFullYear()} umaiNa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
