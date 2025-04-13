import { motion } from 'framer-motion';

export default function FactButton({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-blue-900/70 to-indigo-900/70 hover:from-blue-800/80 hover:to-indigo-800/80 
                text-white px-2 py-1 rounded-lg backdrop-blur-sm border border-blue-500/30
                transition-all shadow-lg shadow-blue-900/20 w-full h-full flex items-center justify-center
                min-h-[60px]"
    >
      <div className="text-lg text-center">{title}</div>
    </button>
  );
}