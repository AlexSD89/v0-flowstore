export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Me² NEXUS 测试页面
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          专业个体超级增强器
        </p>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">
            完整客户体验流程
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
              <div className="font-bold text-blue-300">步骤1</div>
              <div className="text-blue-100">客户对话输入</div>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
              <div className="font-bold text-purple-300">步骤2</div>
              <div className="text-purple-100">MRD智能生成</div>
            </div>
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
              <div className="font-bold text-green-300">步骤3</div>
              <div className="text-green-100">Agent智能分配</div>
            </div>
            <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-500/30">
              <div className="font-bold text-cyan-300">步骤4</div>
              <div className="text-cyan-100">云端托管服务</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-gray-300 text-sm">
              Me² 公式：你的专业Know-How × AI数据源 × 智能决策 = 更强的专业自己
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}