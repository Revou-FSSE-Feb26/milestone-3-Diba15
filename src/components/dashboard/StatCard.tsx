interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-md">
            <div className="flex items-center justify-center gap-2">
                {icon}
                <h2 className="text-2xl font-bold">{value}</h2>
            </div>
            <p className="text-sm text-gray-400">{title}</p>
        </div>
    )
}