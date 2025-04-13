import { motion } from 'framer-motion';

export default function FactButton({ title, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="bg-gradient-to-r from-indigo-800/70 to-blue-900/70 hover:from-indigo-700/80 hover:to-blue-800/80 
                text-white px-5 py-3 rounded-xl backdrop-blur-sm border border-indigo-500/30
                transition-all shadow-lg shadow-blue-900/20"
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 0 15px rgba(100, 150, 255, 0.3)"
      }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="font-medium text-lg">{title}</div>
    </motion.button>
  );
}