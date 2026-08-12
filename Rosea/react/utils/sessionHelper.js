const EMPTY_SESSION = {
    isAuthenticated: false,
    user: null,
    role: null
};

export function getSession() {
    const session = window.ROSEA_SESSION;

    if (!session) {
        return EMPTY_SESSION;
    }

    return {
        isAuthenticated:
            Boolean(session.isAuthenticated),

        user:
            session.user || null,

        role:
            session.role || null
    };
}