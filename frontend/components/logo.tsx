export default function Logo() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-20 md:w-24 md:h-24"
    >
      {/* Background Circle (Basketball texture hint) */}
      <circle cx="80" cy="80" r="76" stroke="#FF9933" strokeWidth="8" className="dark:stroke-orange-500" />

      {/* Radar Chart Lines */}
      <path
        d="M80 20L140 110M80 20L20 110M20 110H140"
        stroke="#3366CC"
        strokeWidth="4"
        className="dark:stroke-blue-500"
      />

      {/* Data Points */}
      <circle cx="80" cy="20" r="6" fill="#3366CC" className="dark:fill-blue-500" />
      <circle cx="20" cy="110" r="6" fill="#3366CC" className="dark:fill-blue-500" />
      <circle cx="140" cy="110" r="6" fill="#3366CC" className="dark:fill-blue-500" />

      {/* Basketball Lines */}
      <path
        d="M30 80C30 80 55 60 80 60C105 60 130 80 130 80"
        stroke="#FF9933"
        strokeWidth="4"
        className="dark:stroke-orange-500"
      />
      <path
        d="M30 90C30 90 55 110 80 110C105 110 130 90 130 90"
        stroke="#FF9933"
        strokeWidth="4"
        className="dark:stroke-orange-500"
      />
    </svg>
  )
}
