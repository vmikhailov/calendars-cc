const loggedInOnceCookieName = 'logged-in';

export function isReturningUser(): boolean {
    const match = document.cookie.match(new RegExp('(^| )' + loggedInOnceCookieName + '=([^;]+)'));
    return !!match;
}

export function markReturningUser(): void {
    document.cookie = `${loggedInOnceCookieName}=1; path=/; max-age=${60 * 60 * 24 * 365}`;
}