import Image from 'next/image'

type BrandLogoProps = {
  size?: number
}

export function BrandLogo({ size = 32 }: BrandLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="shrink-0"
    />
  )
}
