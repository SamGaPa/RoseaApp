import { getSession } from "../utils/sessionHelper";

function useSession() {
    return getSession();
}

export default useSession;