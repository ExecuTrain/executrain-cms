import Image from '@/components/Image'

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-3">
      <Image
        src="/logo-simple-gray.png"
        alt="logo"
        width={50}
        height={50}
        className="animate-spin-slow"
      />
      <h1 className="text-gray-600 font-[600] text-[24px]">Loading...</h1>
    </div>
  )
}
