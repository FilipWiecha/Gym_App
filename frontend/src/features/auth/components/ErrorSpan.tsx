import { useEffect, useState } from "react";

export const ErrorSpan = ({ error }: { error?: string }) => {

    const [displayError, setDisplayError] = useState(error);
    const [show, setShow] = useState(!!error);

    useEffect(() => {
        if (error) {
            setDisplayError(error);
            setShow(true);
        } else {
            setShow(false);
        }
    }, [error]);

    return (
        <span className={`span-error ${show ? 'show' : ''}`}>
            {displayError}
        </span>
    );
}