import Image from "next/image"
import Link from "next/link"

export const Logo = () => {
    return (
        <Link href="/">
            <div className="hover:opacity-75 transition-opacity">
                <Image
                    src="/logo.svg"
                    alt="logo"
                    width={130}
                    height={130}
                />
            </div>
        </Link>
    )
}