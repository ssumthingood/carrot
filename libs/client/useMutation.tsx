import { useState } from "react";

interface UseMutationState {
    loading: boolean;
    data?: object;
    error?: object;
}

export default function useMutation(url: string): [(data: any) => void, UseMutationState] {
    const [state, setState] = useState({
        loading: false,
        data: undefined,
        error: undefined,
    });
    // const [loading, setLoading] = useState(false);
    // const [data, setData] = useState<undefined | any>(undefined);
    // const [error, setError] = useState<undefined | any>(undefined);
    // function mutation(data: any) {
    //     setLoading(true);
    //     fetch(url, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //     })
    //         .then((response) => response.json().catch(() => {}))
    //         .then(setData)
    //         .catch(setError)
    //         .finally(() => setLoading(false));
    // }
    // return [mutation, { loading, data, error }];
    function mutation(data: any) {
        setState((prev) => ({ ...prev, loading: true }));
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json().catch(() => {}))
            .then((data) => setState((prev) => ({ ...prev, data })))
            .catch((error) => setState((prev) => ({ ...prev, error })))
            .finally(() => setState((prev) => ({ ...prev, loading: false })));
    }
    return [mutation, { ...state }];
}
