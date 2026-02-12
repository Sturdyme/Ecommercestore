import { auth, provider } from "../Firebase"
import { signInWithPopup } from "firebase/auth";

export default function Auth() {
    const logi = async () => {
        await signInWithPopup(auth, provider);
    };

    return (
        <button
        onClick={logi}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
        Sign in with Google

        </button>
    )
}