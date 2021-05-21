import bodyParser from "body-parser";
import express from "express";
import RateLimit from "express-rate-limit";
import helmet from "helmet";
import { analyticsRouter } from "./serverScripts/analytics.js";
import { authRouter, initialAccessToken } from "./serverScripts/auth.js";
import { appId, redirectURI } from "./serverScripts/config.js";
import {
	__dirname,
	basicRateLimitConfig,
	port,
	redditTokenRateLimitConfig,
	scope,
	tokenDuration,
} from "./serverScripts/consts.js";
import { photonApiRouter } from "./serverScripts/photonApi.js";
import { cacheControl, checkSslAndWww, safeExc, safeExcAsync } from "./serverScripts/utils.js";

const app = express();

// middlewares

app.use(helmet({
	contentSecurityPolicy: false
}));
app.use(safeExc(checkSslAndWww));
app.use(safeExc(cacheControl));
app.use(express.static('src/static'));
app.use(bodyParser.json());

// paths

app.get("/login", RateLimit(basicRateLimitConfig), safeExc((req, res) => {
	const loginUrl = "https://www.reddit.com/api/v1/authorize?" +
		`client_id=${ encodeURIComponent(appId) }&` +
		`response_type=code&` +
		`state=initialLogin&` +
		`redirect_uri=${ encodeURIComponent(redirectURI) }&` +
		`duration=${ tokenDuration }&` +
		`scope=${ encodeURIComponent(scope.join(" ")) }`;

	res.redirect(loginUrl);
}));

// redirect from certain reddit api requests (like login)
app.get("/redirect", RateLimit(redditTokenRateLimitConfig), safeExcAsync(async (req, res) => {
	if (req.query["state"] && req.query["state"] === "initialLogin") {
		try {
			const data = await initialAccessToken(req.query["code"].toString());
			res.redirect(
				`/setAccessToken.html?accessToken=${encodeURIComponent(data["access_token"])}&refreshToken=${encodeURIComponent(data["refresh_token"])}`);
		} catch (e) {
			res.json({ error: `error getting access token` });
		}
	}
	else {
		res.json({ error: "¯\\_(ツ)_/¯"}).status(400);
	}
}));

app.use("/api", photonApiRouter);
app.use("/auth", authRouter);
// /data instead of /analytics used to avoid getting blocked by adblockers
app.use("/data", analyticsRouter);

const indexFile = __dirname + "/src/static/index.html"
// catch all paths and check ssl, since app.use middleware doesn't seem to get called here
app.get("*", [RateLimit(basicRateLimitConfig), checkSslAndWww], safeExc((req, res) => {
	res.sendFile(indexFile);
}));

app.listen(port, () => {
	console.log(`Started app on port ${port}!`)
});
