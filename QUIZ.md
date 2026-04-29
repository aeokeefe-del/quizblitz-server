Name: Alyssa O'Keefe
Quiz 3 Answers

## Q1

B


## Q2

400 Bad Request means the client sent invalid or incomplete data.
In QuizBlitz, if a user submits a score without required fields like 
playerName or score, the server should return 400 because the request 
format is incorrect.

401 Unauthorized means the request lacks valid authentication.
For example, when a user tries to POST /api/scores without a valid 
JWT or with an invalid token, the verifyToken middleware should 
return 401 because the user is not authenticated.

404 Not Found means the requested resource does not exist.
For example, if a client requests a route like /api/scorez (typo) 
or a specific resource ID that doesn’t exist, the server should 
return 404.


## Q3

The problem: Score.find() is asynchronous, but the code does not wait 
for it to complete. The server immediately sends { message: 'done' } 
before the database query finishes, so no scores are returned.

Corrected Code: 
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10)
    res.json(scores)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scores' })
  }
})

Explanation: This works because await pauses execution until the query 
completes, allowing the server to return the actual scores.


## Q4

B


## Q5

Cookie approach advantage: Cookies can be sent automatically with each 
request by the browser, making authentication simpler for web apps 
since the client does not need to manually attach the token each time.

Authorization header advantage: Using the Authorization header (e.g., Bearer token) 
gives the client explicit control over when and how the token is sent, 
and works consistently across different platforms (web, mobile, APIs).

Overall, for a mobile-accessible game like QuizBlitz, the Authorization 
header approach is more appropriate because it is platform-independent 
and works well with mobile apps and API-based communication. It avoids 
issues with cookie handling, such as cross-site restrictions, and 
provides clearer, more flexible control over authentication in different 
environments.