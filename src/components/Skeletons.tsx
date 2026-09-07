import { cn } from "@/lib/utils";

/**
 * Skeleton primitives — dipakai untuk mengganti blok loading kasar
 * (kotak abu-abu polos) dengan placeholder yang menyerupai layout modul.
 */

function Block({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-gray-100 rounded-lg", className)} />;
}

/** Baris teks pendek-tengah-panjang seperti judul + subtitle halaman. */
export function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2 flex-1 min-w-0">
        <Block className="h-6 w-48 rounded-lg" />
        <Block className="h-3 w-72 rounded-md" />
      </div>
      <Block className="h-10 w-36 rounded-xl shrink-0" />
    </div>
  );
}

/** Baris tab horizontal (meniru tab bar modul Content Management). */
export function TabBarSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Block
          key={i}
          className={cn(
            "h-9 rounded-full shrink-0",
            i === 0 ? "w-28" : i % 2 === 0 ? "w-24" : "w-32",
          )}
        />
      ))}
    </div>
  );
}

/** Satu field form: label + input (meniru SectionCard fields). */
function FieldRow() {
  return (
    <div className="space-y-2">
      <Block className="h-3 w-32 rounded-md" />
      <Block className="h-9 w-full rounded-xl" />
    </div>
  );
}

/** Kartu section dengan header (icon + judul) dan isian field. */
export function SectionCardSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <Block className="w-9 h-9 rounded-xl" />
        <div className="space-y-1.5">
          <Block className="h-4 w-40 rounded-md" />
          <Block className="h-3 w-56 rounded-md" />
        </div>
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <FieldRow key={i} />
        ))}
      </div>
    </div>
  );
}

/** Layout loading halaman content (Pages) yang memakai PageSectionTabs. */
export function ContentPageSkeleton() {
  return (
    <div className="space-y-5">
      <HeaderSkeleton />
      <div className="animate-pulse bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 space-y-2">
        <Block className="h-3 w-40 rounded-md bg-gray-100" />
        <Block className="h-3 w-72 rounded-md bg-gray-100" />
      </div>
      <TabBarSkeleton count={4} />
      <SectionCardSkeleton fields={2} />
    </div>
  );
}

/** Kartu grid tanpa media (PagesIndex, MasterData, Dashboard). */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-4">
            <Block className="w-10 h-10 rounded-xl" />
            <Block className="h-5 w-14 rounded-full" />
          </div>
          <Block className="h-4 w-3/4 rounded-md" />
          <Block className="h-3 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/** Kartu grid dengan media atas (Course, Article, CaseStudy, dll). */
export function MediaGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
          <Block className="h-36 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Block className="h-5 w-20 rounded-full" />
              <Block className="h-5 w-16 rounded-full" />
            </div>
            <Block className="h-4 w-5/6 rounded-md" />
            <Block className="h-3 w-full rounded-md" />
            <Block className="h-3 w-2/3 rounded-md" />
            <Block className="h-9 w-full rounded-xl mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Tabel loading (Users, RoleManagement, MasterDataType, content-tabs list). */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 overflow-hidden">
      <div className="space-y-1.5">
        {Array.from({ length: cols }).map((_, c) => (
          <Block
            key={c}
            className="h-3 w-16 inline-block mr-6 rounded-md"
            // eslint-disable-next-line react/no-array-index-key
          />
        ))}
      </div>
      <div className="mt-4 space-y-4">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Block
                key={c}
                className={cn(
                  "h-4 rounded-md",
                  c === 0 ? "w-24" : c === cols - 1 ? "w-16 ml-auto" : "w-32",
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Satu field form: label + input (meniru SectionCard fields). */
export function FieldRowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-32 animate-pulse bg-gray-100 rounded-md" />
          <div className="h-9 w-full animate-pulse bg-gray-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton nav item sidebar (icon + label). */
export function SidebarMenuSkeleton({ items = 7 }: { items?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <div className="w-4 h-4 animate-pulse bg-gray-200 rounded-md shrink-0" />
          {i < 4 ? (
            <div
              className={cn(
                "h-3 animate-pulse bg-gray-200 rounded-md",
                i % 2 === 0 ? "w-24" : "w-32",
              )}
            />
          ) : (
            <div className="h-3 w-20 animate-pulse bg-gray-200 rounded-md" />
          )}
        </div>
      ))}
    </div>
  );
}

/** Grid kartu menu dashboard (kotak lebih lebar). */
export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Block className="h-4 w-24 rounded-md" />
            <Block className="w-12 h-12 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
