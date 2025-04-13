export default function FactDisplay({ fact }) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-w-md mb-8">
        <h3 className="font-bold text-lg mb-2">{fact.title}</h3>
        <p>{fact.content}</p>
      </div>
    );
  }