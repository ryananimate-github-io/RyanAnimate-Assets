const sessions = require('../data/sessions');
const fUtil = require('../fileUtil');
const stuff = require('./info');

function toAttrString(table) {
	return typeof (table) == 'object' ? Object.keys(table).filter(key => table[key] !== null).map(key =>
		`${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`).join('&') : table.replace(/"/g, "\\\"");
}
function toParamString(table) {
	return Object.keys(table).map(key =>
		`<param name="${key}" value="${toAttrString(table[key])}">`
	).join(' ');
}
function toObjectString(attrs, params) {
	return `<object ${Object.keys(attrs).map(key =>
		`${key}="${attrs[key].replace(/"/g, "\\\"")}"`
	).join(' ')}>${toParamString(params)}</object>`;
}

module.exports = function (req, res, url) {
	if (req.method != 'GET') return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case '/charactercreator/': {
			title = 'Character Creator';
			attrs = {
				data: process.env.SWF_URL + '/cc.swf', // data: 'cc_.swf',
				type: 'application/x-shockwave-flash', id: 'char_creator', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver':'/','m_mode':'school','isLogin':'Y','isEmbed':'0','ctc':'go','tlang':'en_US',
          'storePath': process.env.STORE_URL + '/<store>',
          'clientThemePath': process.env.CLIENT_URL + '/<client_theme>',
          'appCode':'go','page':'','siteId':'go','userId':'0TBAAga2Mn6g','themeId':'family','bs':'adam','ut':30,'ft':'_sticky_filter_guy'
				},
				allowScriptAccess: 'always',
				movie: process.env.SWF_URL + '/cc.swf', // 'http://localhost/cc.swf'
			};
			break;
		}

		case '/character_creator/': {
			title = 'Character Creator Browser';
			attrs = {
				data: process.env.SWF_URL + '/cc_browser.swf', // data: 'cc_browser_.swf',
				type: 'application/x-shockwave-flash', id: 'ccbrowser', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver':'/','isEmbed':'0','ctc':'go','tlang':'en_US',
          'storePath': process.env.STORE_URL + '/<store>',
          'clientThemePath': process.env.CLIENT_URL + '/<client_theme>',
          'appCode':'go','siteId':'school','st':'','userId':'0DyHqK6Yj9dM','ut':23,'uisa':0,'themeId':'family',
          'u_info_school':'OjI6c2xoVVM3MWJIX05DMnA4cmRBQ2dFd3JvNE5xc2JEc2o4UFB2X1dVd2Eya2RPQisxVTl4d3ZHZHJPYnI4QURFNENWMjNkYm12WFdlUGxLT0g0OG4rekF5ajZhWGRGVTlocmJ4S1JhSWhCVXJlTF9BbXdyQUp3PQ==',
				},
				allowScriptAccess: 'always',
				movie: process.env.SWF_URL + '/cc_browser.swf', // 'http://localhost/cc_browser.swf'
			};
			break;
		}
		
		case '/videomaker/full/': {
			let presave = query.movieId && query.movieId.startsWith('m') ? query.movieId :
				`m-${fUtil[query.Autosave ? 'getNextFileId' : 'fillNextFileId']('movie-', '.xml')}`;
			title = 'Video Editor';
			attrs = {
				data: process.env.SWF_URL + '/go_full.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'movieId':'','loadas':0,'asId':'','originalId':'','apiserver':'/','storePath': process.env.STORE_URL + '/<store>',
          'clientThemePath': process.env.CLIENT_URL + '/<client_theme>','animationPath': process.env.ANIMATION_URL + '/66453a3ba2cc5e1b','userId':'0cf4CMw1ZNCk',
          'username':'bakeryb40488','uemail':'bakeryb40488@gmail.com','numContact':'0','ut':23,'ve':false,'isEmbed':0,'nextUrl':'/player?movieId=<movieId>',
          'bgload': process.env.SWF_URL + '/go_full.swf','lid':'13','ctc':'go','themeColor':'silver','tlang':'en_US',
          'siteId':'13','templateshow':'false','forceshow':'false','appCode':'go','lang':'en','tmcc':4048901,'fb_app_url':'/','is_published':'0',
          'is_private_shared':'1',
          'is_password_protected':false,'upl':'1','hb':'1','pts':'1','msg_index':'','ad':0,'has_asset_bg':1,'has_asset_char':0,'initcb':'studioLoaded',
          'retut':0,'featured_categories':null,'s3base': process.env.S3BASE_URL + '/thumbnails','st':'','uisa':0,
          'u_info':'OjI6elg5SnZCOUEyTHZiY2lhZGRXTm9Nd0ljVWhNbEpGaXJFdkpEdkltdEp6RWhrQ0VIbXZIVTBjRTlhUGZKMjJoVHVTUE5vZk1XYnFtSE1vZG5TeldyQVJNcDFmUFB2NDVtR0FTSlZZ',
          'tm':'FIN','tray':'custom','isWide':1,'newusr':1,'goteam_draft_only':0,
'

				},
				allowScriptAccess: 'always',
			};
			sessions.set({ movieId: presave }, req);
			break;
		}

		case '/player': {
			title = 'Video Player';
			attrs = {
				data: process.env.SWF_URL + '/player.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>', 'ut': 60,
					'autostart': 1, 'isWide': 1, 'clientThemePath': process.env.CLIENT_URL + '/<client_theme>',
				},
				allowScriptAccess: 'always',
			};
			break;
		}

		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(`<script>document.title='${title}',flashvars=${JSON.stringify(params.flashvars)}</script><body style="margin:0px">${toObjectString(attrs, params)
		}</body>${stuff.pages[url.pathname] || ''}`);
	return true;
}
