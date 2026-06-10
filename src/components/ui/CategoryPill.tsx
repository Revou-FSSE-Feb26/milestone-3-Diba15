export default function CategoryPill({ category }: { category: string }) {
    return (
        <span className="inline-flex w-fit items-center rounded-md bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
            {category}
        </span>
    )
}