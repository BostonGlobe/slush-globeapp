all:

	# clean files
	cd templates; rm node_modules.zip package.json;

	# make a blank package.json
	cd templates; echo '{"dependencies":{}}' >> package.json

	# npm install modules
	cd templates; sudo npm install --save \
		archieml \
		browser-sync \
		babel-loader \
		del \
		gulp \
		gulp-autoprefixer \
		gulp-babel \
		gulp-callback \
		gulp-changed \
		gulp-file-include \
		gulp-hb \
		gulp-minify-css \
		gulp-notify \
		gulp-plumber \
		gulp-rename \
		gulp-replace \
		gulp-smoosher \
		gulp-stylus \
		gulp-uglify \
		gulp-util \
		gulp-zip \
		request \
		require-dir \
		run-sequence \
		shelljs \
		'underscore.string' \
		webpack-stream;

	# make node_modules.zip
	cd templates; zip -q -r node_modules.zip node_modules;

	# rm node_modules
	cd templates; sudo rm -rf node_modules;
