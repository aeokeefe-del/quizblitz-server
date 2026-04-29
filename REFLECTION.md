Alyssa O'Keefe- reflection

## Q1

Middleware in Express is a function that runs during the request–response 
cycle and can modify the request, response, or decide whether to pass control 
to the next function. The order matters because middleware executes top to 
bottom, so earlier middleware can prepare data needed later. For example, 
app.use(express.json()) must come before routes so req.body is parsed correctly,
and app.use(cors()) must run early to allow cross-origin requests.

Global middleware (using app.use) applies to all routes, like parsing JSON or 
enabling CORS across the app. In contrast, route-level middleware is applied 
to specific endpoints, such as verifyToken on protected routes, which checks 
authentication only when accessing those routes rather than every request.

## Q2

Passwords must never be stored in plain text because if the database is leaked, 
attackers can immediately read and reuse them, often across multiple sites. 
Instead, we store a hashed version. When calling bcrypt.hash(password, 10), 
bcrypt generates a salt and applies a one-way hashing algorithm to produce a 
secure hash. The number 10 is the cost factor (salt rounds), which controls how 
many times the hashing process is repeated. Higher values increase security, but 
also increase computation time.

bcrypt.compare() works by hashing the input password again using the salt embedded 
in the stored hash, then comparing the results. It doesn’t reverse the hash, it 
just checks if the newly computed hash matches the stored one, enabling verification 
without ever exposing the original password.

## Q3

On registration, the client sends user credentials; the server hashes the password with bcrypt, stores the user, and returns a success response. On login, the client sends credentials again; the server verifies the password with bcrypt.compare() and, if valid, generates a JWT containing the user’s ID (and possibly username). The token is returned to the client.

When submitting a score, the client includes the JWT in the Authorization header. The server’s verifyToken middleware validates the token’s signature and extracts the user ID to associate the score. No database lookup is needed for verification because the signed JWT guarantees the token’s authenticity and integrity.

## Q4
Using an in-memory array like let scores = [] has two main problems: data is lost on server restart, and it does not scale across multiple instances (each server would have its own separate array). This makes it unreliable for real applications. MongoDB solves this by persisting data outside the server process and allowing centralized access.

If the server is redeployed or restarted, the MongoDB data remains intact because it is stored in an external database service. This is different from the in-memory array, which resets to empty every time the server restarts since it only exists in temporary runtime memory.

## Q5 
Making GET /api/scores public makes sense because anyone should be able to view the leaderboard, even if they are not logged in. However, POST /api/scores should be protected because only authenticated users should be allowed to submit scores and attach them to an account.

If GET /api/scores also required authentication, the leaderboard would be less accessible and could break for visitors who are not logged in. The frontend would need to manage tokens just to display scores, adding unnecessary complexity. This could also hurt the user experience because users could not preview rankings before creating an account.