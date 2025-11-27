export function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            </div>
        </div>
    )
}

export function LoaderFullPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <Loader />
        </div>
    )
}
