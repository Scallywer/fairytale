export default function StoryLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse motion-reduce:animate-none" aria-label="Učitavanje priče">
      <div className="h-6 w-32 bg-surface-container-high rounded mb-4" />
      <div className="h-8 w-64 bg-surface-container-high rounded mb-2" />
      <div className="h-4 w-40 bg-surface-container-high rounded mb-6" />
      <div className="h-64 w-full bg-surface-container-low rounded mb-6" />
      <div className="space-y-4">
        <div className="h-4 w-full bg-surface-container-low rounded" />
        <div className="h-4 w-11/12 bg-surface-container-low rounded" />
        <div className="h-4 w-10/12 bg-surface-container-low rounded" />
      </div>
    </div>
  )
}
