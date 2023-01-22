const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case "/cc": {
			title = "Character Creator";
			attrs = {
				data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
                                width: "100%",
				height: "100%",

			};
			params = {
				flashvars: {
					apiserver: "/",
					m_mode: "",
				        isLogin: "Y",
					isEmbed: 0,
					ctc: "go",
					bs: "adam",
					tlang: "en_US",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					appCode: "go",
					page: "",
					siteId: "go",
					themeId: "family",
					ut: 30,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc.swf'
			};
			break;
		}

		case "/cc_browser": {
			title = "CC Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "ccbrowser",
                                width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					isEmbed: "0",
					ctc: "go",
					tlang: "en_US",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					appCode: "go",
					siteId: "family",
					st: "",
					ut: 23,
					uisa: 0,
					themeId: "business",
					u_info_school: "OjI6c2xoVVM3MWJIX05DMnA4cmRBQ2dFd3JvNE5xc2JEc2o4UFB2X1dVd2Eya2RPQisxVTl4d3ZHZHJPYnI4QURFNENWMjNkYm12WFdlUGxLT0g0OG4rekF5ajZhWGRGVTlocmJ4S1JhSWhCVXJlTF9BbXdyQUp3PQ==",
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
			};
			break;
		}

		case "/go_full": {
			let presave =
				query.movieId && query.movieId.startsWith("m")
					? query.movieId
					: `m-${fUtil[query.noAutosave ? "getNextFileId" : "fillNextFileId"]("movie-", ".xml")}`;
			title = "Video Editor";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				id: "Studio",
                                swf: process.env.SWF_URL + "/go_full.swf",
                                width: "100%",
                                height: "100%",

                                align: "middle",
                                allowScriptAccess: "always",
                                allowFullScreen: "true",
                                wmode: "window",

                                hasVersion: "10.3"
                      };
                             params = {
			flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					isEmbed: 1,
					ctc: "go",
					ut: 23,
				        u_info_school: "OjI6c2xoVVM3MWJIX05DMnA4cmRBQ2dFd3JvNE5xc2JEc2o4UFB2X1dVd2Eya2RPQisxVTl4d3ZHZHJPYnI4QURFNENWMjNkYm12WFdlUGxLT0g0OG4rekF5ajZhWGRGVTlocmJ4S1JhSWhCVXJlTF9BbXdyQUp3PQ==",
					bs: "default",
					appCode: "go",
					page: "",
					siteId: "go",
				        role: "student",
					lid: 13,
					isLogin: "Y",
					retut: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					themeId: "business",
					tlang: "en_US",
					presaveId: presave,
					goteam_draft_only: 1,
					isWide: 1,
					collab: 0,
					nextUrl: "/html/list.html",
				},
				allowScriptAccess: "always",
			        movie: process.env.SWF_URL + "/go_full.swf"
			     };
			break;
		}

		case "/player": {
			title = "Player";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: 60,
					autostart: 1,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>${stuff.pages[url.pathname] || ""}`
	);
	return true;
};
