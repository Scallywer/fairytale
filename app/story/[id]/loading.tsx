export default function StoryLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-6 w-32 bg-slate-700 rounded mb-4" />
      <div className="h-8 w-64 bg-slate-700 rounded mb-2" />
      <div className="h-4 w-40 bg-slate-700 rounded mb-6" />
      <div className="h-64 w-full bg-slate-800 rounded mb-6" />
      <div className="space-y-4">
        <div className="h-4 w-full bg-slate-800 rounded" />
        <div className="h-4 w-11/12 bg-slate-800 rounded" />
        <div className="h-4 w-10/12 bg-slate-800 rounded" />
      </div>
    </div>
  )
}

