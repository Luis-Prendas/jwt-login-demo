import { motion } from 'framer-motion'
import { useState } from 'react'

export default function InfoButton() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="relative flex flex-col items-center justify-center mt-2">
      <motion.button
        type="button"
        className="cursor-pointer"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        animate={{
          x: [0, -2, 2, -2, 2, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatDelay: 1, // tiempo entre cada "temblor"
          duration: 0.3,
        }}
      >
        <svg
          className="w-6 text-yellow-400"
          viewBox="0 0 122.88 122.88"
          fill="currentColor"
        >
          <g>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M61.44,0c33.926,0,61.44,27.514,61.44,61.44c0,33.926-27.514,61.439-61.44,61.439 C27.513,122.88,0,95.366,0,61.44C0,27.514,27.513,0,61.44,0L61.44,0z M79.42,98.215H43.46v-6.053h6.757v-36.96H43.46v-4.816h16.808 c4.245,0,8.422-0.51,12.549-1.551v43.328h6.604V98.215L79.42,98.215z M63.859,21.078c2.785,0,4.975,0.805,6.571,2.396 c1.579,1.59,2.377,3.771,2.377,6.581c0,2.848-1.358,5.381-4.093,7.601c-2.751,2.22-5.941,3.338-9.577,3.338 c-2.733,0-4.905-0.765-6.569-2.297c-1.665-1.551-2.497-3.556-2.497-6.05c0-3.143,1.358-5.853,4.059-8.152 C56.83,22.219,60.072,21.078,63.859,21.078L63.859,21.078z"
            />
          </g>
        </svg>
      </motion.button>

      {showInfo && (
        <motion.div
          className="absolute flex flex-col gap-2 justify-center items-center top-12 bg-[#333] border border-[#f0f0f0]/20 text-[#f0f0f0] text-sm p-2 rounded-lg shadow-lg min-w-[150px]"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
        >
          <span>Username: admin</span>
          <span>Password: admin</span>
        </motion.div>
      )}
    </div>
  )
}
