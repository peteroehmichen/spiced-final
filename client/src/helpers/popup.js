import { parseQuery } from "./helperComponents";

export default function popup(url, name) {
    const windowOpts = `toolbar=no,scrollbars=1,status=1,resizable=1,location=1,menuBar=nop,
    width=600,height=700,left=100,top=100`;
    const authPopup = window.open(url, name, windowOpts);

    const authPromise = new Promise((resolve, reject) => {
        window.addEventListener(
            "message",
            (e) => {
                if (e.origin != location.origin) return;
                if (e.data.oauth) {
                    if (e.data.oauth.length > 1) {
                        resolve(parseQuery(e.data.oauth));
                    } else {
                        reject("Error in Transmission");
                    }
                }
            },
            false
        );
    });

    return authPromise;
}
