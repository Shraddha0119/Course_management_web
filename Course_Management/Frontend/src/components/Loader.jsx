function Loader({ size = "md", label }) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizes[size]} rounded-full border-blue-600 border-t-transparent animate-spin`}
      />
      {label && <p className="mt-3 text-gray-500 text-sm">{label}</p>}
    </div>
  );
}

export default Loader;

