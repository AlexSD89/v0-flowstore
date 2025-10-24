export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">产品</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/marketplace" className="hover:text-foreground transition-colors">
                  Gate Market
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-foreground transition-colors">
                  定价
                </a>
              </li>
              <li>
                <a href="/#usecases" className="hover:text-foreground transition-colors">
                  使用场景
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">资源</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/tutorial" className="hover:text-foreground transition-colors">
                  安装教程
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-foreground transition-colors">
                  常见问题
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">企业与支持</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/solutions/enterprise" className="hover:text-foreground transition-colors">
                  企业解决方案
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-foreground transition-colors">
                  与我们联系
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-xl">Gate</span>
          </div>

          <p className="text-sm text-muted-foreground">© 2025 Gate by LaunchX. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  )
}
