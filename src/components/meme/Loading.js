// app/meme/[id]/loading.js
export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-96 bg-gray-300"></div>
                <div className="p-4">
                    <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="flex space-x-4 mt-4">
                        <div className="h-6 w-20 bg-gray-300 rounded"></div>
                        <div className="h-6 w-20 bg-gray-300 rounded"></div>
                    </div>
                    <div className="mt-6">
                        <div className="h-6 bg-gray-300 rounded mb-4 w-1/4"></div>
                        <div className="h-32 bg-gray-300 rounded mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}