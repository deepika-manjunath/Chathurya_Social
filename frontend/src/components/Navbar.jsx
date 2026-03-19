export default function Navbar({ openSidebar }) {

  return (

    <div className="navbar bg-base-100 shadow px-6">

      <div className="flex-1 font-bold text-lg">
        Chathurya Student Developer Club
      </div>

      <button
        className="btn btn-sm"
        onClick={openSidebar}
      >
        ☰
      </button>

    </div>

  )
}