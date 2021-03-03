import { useState } from "react";
import axios from "./axios";

export function useAthenticate(url, values) {
    const [status, setStatus] = useState({
        error: false,
        loading: false,
    });

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        try {
            setStatus({
                ...status,
                loading: true,
            });
            const { data } = await axios.post(url, values);
            if (data.status == "OK") {
                setStatus({
                    ...status,
                });
                location.replace("/");
            } else if (data.error) {
                setStatus({
                    ...status,
                    error: data.error,
                });
            }
        } catch (err) {
            console.log("error in axios welcomePost", err);
            setStatus({
                ...status,
                error: "No Database Connection",
            });
        }

        // FIXME uncool TimeOut (require Help)
        setTimeout(() => {
            setStatus({
                ...status,
                error: false,
                loading: false,
            });
        }, 5000);
    };
    return [status, handleAuthSubmit];
}

export function useFormEval() {
    const [values, setValues] = useState({});

    const handleChangeEval = (e) => {
        const emailFormat = new RegExp("^[^@]+@[^@]+.[^@]+$", "gi");

        e.target.style.borderBottom = "4px solid orangered";

        let value = e.target.value;

        if (e.target.nodeName == "SELECT") {
            //
        } else {
            if (!value || value.startsWith(" ")) {
                value = false;
            }
            if (
                e.target.attributes.type &&
                e.target.attributes.type.value == "email" &&
                !emailFormat.test(e.target.value)
            ) {
                value = false;
            }
        }

        if (value) {
            setValues({
                ...values,
                [e.target.name]: value,
            });
            e.target.style.borderBottom = "4px solid green";
        } else {
            setValues({
                ...values,
                [e.target.name]: "",
            });
        }
    };
    return [values, handleChangeEval];
}
