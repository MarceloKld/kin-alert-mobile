function SkeletonCard() {
  return (
    <div className="bg-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
      <div className="h-3 bg-white/10 rounded w-3/4"></div>
      <div className="h-3 bg-white/10 rounded w-2/3"></div>
    </div>
  )
}

export default SkeletonCard