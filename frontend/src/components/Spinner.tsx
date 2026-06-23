function Spinner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  )
}

export default Spinner