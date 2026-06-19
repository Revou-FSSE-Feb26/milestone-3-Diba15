export default function Loading({status}: { status: boolean }) {
    return (
        <div className={`${status ? 'flex' : 'hidden'} items-center justify-center h-screen`}>
            <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
            <span className="ml-2 text-lg">Loading</span>
        </div>
    );
}