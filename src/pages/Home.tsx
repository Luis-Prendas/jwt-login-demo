import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold">Home Page</h1>
      </motion.section>

      <motion.section
        className="text-lg font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <ul className="flex flex-col items-center gap-2">
          <li>
            <a href="/login" className="text-blue-300 hover:underline">
              Go to Login
            </a>
          </li>
          <li>
            <a href="/dashboard" className="text-blue-300 hover:underline">
              Go to Dashboard
            </a>
          </li>
        </ul>
      </motion.section>
    </div>
  );
}
