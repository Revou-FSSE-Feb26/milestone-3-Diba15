interface ModalProps {
    msg: string;
    modalType: 'confirmation' | 'alert';
    yesAction?: () => void;
    noAction?: () => void;
}

export default function Modal({ msg, modalType, yesAction, noAction}: ModalProps) {
    return (
        <div className={"fixed inset-0 bg-black/50 flex items-center justify-center z-50"}>
            <div className={"bg-white rounded-lg p-6 w-80 text-center"}>
                <p className={"mb-4"}>{msg}</p>
                <div className={"flex justify-center gap-4"}>
                    {modalType === 'confirmation' ? (
                        <>
                            <button onClick={yesAction} className={"bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"}>
                                Yes
                            </button>
                            <button onClick={noAction} className={"bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"}>
                                No
                            </button>
                        </>
                    ) : (
                        <button onClick={yesAction} className={"bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"}>
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}