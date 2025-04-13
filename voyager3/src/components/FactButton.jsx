export default function FactButton({ title, onClick }) {
    return (
      <button
        onClick={onClick}
        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {title}
      </button>
    );
  }
  