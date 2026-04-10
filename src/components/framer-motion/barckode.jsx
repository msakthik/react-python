const BarcodeMock = () => (
    <div className="flex justify-center gap-0.5 h-16 w-full opacity-80 mt-4 mix-blend-multiply dark:mix-blend-screen dark:opacity-40">
        {[...Array(40)].map((_, i) => {
            const width = [2, 4, 1, 3, 2, 5, 1, 2][i % 8];
            return <div key={i} className="bg-foreground rounded-sm" style={{ width: `${width}px` }} />
        })}
    </div>
);