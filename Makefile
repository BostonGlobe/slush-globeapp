all:

	# clean files
	cd templates; rm node_modules.zip package.json;

	# make a blank package.json
	cd templates; echo '{"devDependencies":{}}' >> package.json

	# npm install modules
	cd templates; sudo npm install --save-dev \
		archieml \
		browser-sync \
		babel-core \
		babel-loader \
		babel-preset-es2015 \
		babel-preset-stage-1 \
		babel-register \
		cheerio \
		del \
		dsv-loader \
		get-json-lite \
		gulp \
		gulp-autoprefixer \
		gulp-callback \
		gulp-file-include \
		gulp-hb \
		gulp-htmlmin \
		gulp-imagemin \
		gulp-notify \
		gulp-plumber \
		gulp-rename \
		gulp-replace \
		gulp-smoosher \
		gulp-stylus \
		gulp-zip \
		jimp \
		json-loader \
		request \
		require-dir \
		run-sequence \
		shelljs \
		webpack \
		webpack-stream \
		yargs;

	cd templates; sudo npm install --save \
		fontfaceobserver \
		promis;

	# make node_modules.zip
	cd templates; zip -q -r node_modules.zip node_modules;

	# rm node_modules
	cd templates; sudo rm -rf node_modules;
