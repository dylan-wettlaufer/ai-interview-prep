"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function LoadingScreen({ message }) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="w-20 h-20 flex items-center justify-center"
      >
        <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300"
      >
        {message}
      </motion.p>
      
      <motion.div 
        className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-indigo-600 dark:bg-indigo-500"
          initial={{ width: "0%" }}
          animate={{ 
            width: ["0%", "30%", "70%", "100%", "0%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </motion.div>
    </div>
  )
}