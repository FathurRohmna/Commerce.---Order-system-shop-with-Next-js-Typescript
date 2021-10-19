import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="w-full relative py-1 px-6 bg-primary">
      <div className="flex w-full justify-between items-center">
        <div className="">
          <p className="m-0 text-white font-extralight">Untuk penjelajahan lebih Dalam Login dan Register !!</p>
        </div>
        <div className="flex flex-row">
          <div className="px-5 py-2">
            <Link href="/authentication/login">
              <a className="font-semibold text-white rounded-md bg-primary">
                Login
              </a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/authentication/register">
              <a className="font-semibold text-white rounded-md bg-primary">
                Register
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
