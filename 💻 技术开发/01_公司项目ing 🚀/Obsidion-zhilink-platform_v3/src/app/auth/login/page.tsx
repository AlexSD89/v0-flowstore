'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, User, Building2, Users } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 这里应该是真实的登录逻辑
      // 目前使用模拟登录
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email && password) {
        // 模拟成功登录，重定向到首页
        router.push('/')
      } else {
        setError('请输入邮箱和密码')
      }
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role: 'buyer' | 'vendor' | 'distributor') => {
    setLoading(true)
    setTimeout(() => {
      router.push(`/?demo=${role}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            LaunchX 智链平台
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            登录访问您的AI解决方案市场
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>登录账户</CardTitle>
            <CardDescription>
              输入您的邮箱和密码以访问平台
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">演示访问</CardTitle>
            <CardDescription className="text-center">
              快速体验不同角色的功能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('buyer')}
                disabled={loading}
              >
                <User className="h-4 w-4 mr-2" />
                <div className="flex-1 text-left">
                  <div className="font-medium">企业采购方</div>
                  <div className="text-xs text-muted-foreground">寻找AI解决方案</div>
                </div>
                <Badge variant="secondary">Demo</Badge>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('vendor')}
                disabled={loading}
              >
                <Building2 className="h-4 w-4 mr-2" />
                <div className="flex-1 text-left">
                  <div className="font-medium">AI供应商</div>
                  <div className="text-xs text-muted-foreground">提供AI产品服务</div>
                </div>
                <Badge variant="secondary">Demo</Badge>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('distributor')}
                disabled={loading}
              >
                <Users className="h-4 w-4 mr-2" />
                <div className="flex-1 text-left">
                  <div className="font-medium">分销伙伴</div>
                  <div className="text-xs text-muted-foreground">推广AI解决方案</div>
                </div>
                <Badge variant="secondary">Demo</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          <p>还没有账户？ <span className="text-purple-600 cursor-pointer hover:underline">申请注册</span></p>
          <Separator className="my-4" />
          <div className="flex items-center justify-center space-x-4">
            <span>🚀 S级优化平台</span>
            <span>•</span>
            <span>95+分评估</span>
            <span>•</span>
            <span>6角色AI协作</span>
          </div>
        </div>
      </div>
    </div>
  )
}