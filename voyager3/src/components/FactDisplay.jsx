import { motion } from 'framer-motion';

export default function FactDisplay({ fact }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 rounded-2xl backdrop-blur-md
                border border-blue-500/30 shadow-xl shadow-blue-900/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <h3 className="text-xl font-semibold mb-4 text-blue-100">{fact.title}</h3>
      <p className="text-blue-50/90">{fact.content}</p>
    </motion.div>
  );
}