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

// Skeleton loader for course cards
function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-40 bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
      </div>
    </div>
  );
}

// Skeleton loader for course list grid
function CourseGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton for dashboard stats
function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-5 animate-pulse">
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for learning page
function LearningPageSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar skeleton */}
      <aside className="lg:w-80 bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-4 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
        <div className="mt-4 border-t dark:border-gray-800 pt-4 space-y-1">
          {["Learn", "Quiz", "Assignments", "Discussions", "Certificate"].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 p-6 animate-pulse">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border dark:border-gray-800">
          <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
          <div className="p-6 space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-4" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-4" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-4" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </main>
    </div>
  );
}

// Skeleton for course details page
function CourseDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="p-8 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="p-8 space-y-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="p-8 flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for student dashboard
function StudentDashboardSkeleton() {
  return (
    <div className="animate-fadeInUp animate-pulse space-y-8">
      <div className="flex justify-between">
        <div>
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <DashboardStatsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="flex gap-8">
              <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  Loader,
  CourseCardSkeleton,
  CourseGridSkeleton,
  DashboardStatsSkeleton,
  LearningPageSkeleton,
  CourseDetailsSkeleton,
  StudentDashboardSkeleton,
};
export default Loader;

