// Sort alphabetically by locale
export const sortTopicsAlpha = (t1, t2) => t1.lowercase_name.localeCompare(t2.lowercase_name);
export const sortUsersAlpha = (u1, u2) => u1.lowercase_username.localeCompare(u2.lowercase_username);
