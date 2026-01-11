export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(0.45_0.12_25)]" />
    </div>
  )
}
