/**
 * Created by Danny Schreiber on 3/20/15.
 */

/**
 * Created by Danny Schreiber on 3/17/15.
 */
var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config.js')();
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var port = process.env.PORT || config.defaultPort;
var runSeq = require('run-sequence');

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

gulp.task('vet', function() {
	log('****** Analyzing source with jshint and jscs ******');
	return gulp
		.src(config.alljs)
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jscs())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('clean-styles', function(done) {
	log('******  Cleans css dir ******');
	clean(config.css, done);
});

gulp.task('clean-fonts', function(done) {
	log('******  Cleans dist font dir ******');
	clean(config.dist + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function(done) {
	log('******  Cleans dist images dir ******');
	clean(config.dist + 'images/**/*.*', done);
});

gulp.task('clean-docs', function(done) {
	log('******  Cleans docs ******');
	clean(config.docs + '**/*.*', done);
});

gulp.task('clean-temp', function(done) {
	log('******  Cleans temp dir ******');
	clean(config.temp + '**/*.*', done);
});

gulp.task('clean-code', function(done) {
	log('******  Cleans dist code ******');

	var files = [].concat(
		config.temp + '**/*.js',
		config.dist + '**/*.html',
		config.dist + 'js/**/*.js',
		config.dist + 'css/**/*.css'
	);

	clean(files, done);
});

gulp.task('styles', function() {
	log('****** Compiling less to css ******');
	return gulp
		.src(config.less)
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.autoprefixer({browsers: ['last 2 versions', '> 5%']}))
		.pipe(gulp.dest(config.cssDir));
});

gulp.task('fonts', function(){
	log('****** Copying fonts to dist ******');

	return gulp
		.src(config.fonts)
		.pipe(gulp.dest(config.dist + 'fonts'));
});

gulp.task('images', function(){
	log('****** Copying images to dist and compressing ******');

	return gulp
		.src(config.images)
		.pipe($.imagemin({optimizationLevel: 4}))
		.pipe(gulp.dest(config.dist + 'images'));
});

gulp.task('less-watcher', function() {
	log('****** Less file watcher will auto compile less and create styles when less files change ******');
	gulp.watch(config.less, ['styles']);
});

gulp.task('wiredep', function(){

	log('****** Wires up the bower and custom css/js into the index.html ******');

	var options = config.getWiredepDefaultOptions();
	var wiredep = require('wiredep').stream;
	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js), {relative: true}))
		.pipe(gulp.dest(config.indexDir));
});

gulp.task('templatecache', function(){
	log('****** Create Angular $templateCache ******');

	return gulp
		.src(config.htmlTemplates)
		.pipe($.minifyHtml({empty: true}))
		.pipe($.angularTemplatecache(
			config.templateCache.file,
			config.templateCache.options
		))
		.pipe(gulp.dest(config.temp));
});

gulp.task('inject', function(){

	log('****** Wire up app css to inject into the index.html, then call wiredep ******');
	return gulp
		.src(config.index)
		.pipe($.inject(gulp.src(config.css), {relative: true}))
		.pipe(gulp.dest(config.indexDir));
});

gulp.task('optimize', function(){

	log('****** Optimizing js, css, html for production build ******');

	var assets = $.useref.assets({searchPath: ['./', './app/src']});
	var templateCache = config.temp + config.templateCache.file;
	var cssFilter = $.filter('**/*.css');
	var jsLibFilter = $.filter('**/' + config.optimized.libJs);
	var jsGrubstaFilter = $.filter('**/' + config.optimized.appJs);

	return gulp
		.src(config.index)
		.pipe($.plumber())
		.pipe($.inject(gulp.src(templateCache, {read: false}), {
			starttag: '<!-- inject:templates:js -->'
		}))
		.pipe(assets)
		.pipe(cssFilter)
		.pipe($.csso())
		.pipe(cssFilter.restore())
		.pipe(jsLibFilter)
		.pipe($.uglify())
		.pipe(jsLibFilter.restore())
		.pipe(jsGrubstaFilter)
		.pipe($.babel())
		.pipe($.ngAnnotate())
		.pipe($.uglify({mangle: true}))
		.pipe(jsGrubstaFilter.restore())
		.pipe($.rev())
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe($.revReplace())
		.pipe(gulp.dest(config.dist))
		.pipe($.rev.manifest())
		.pipe(gulp.dest(config.dist));
});

gulp.task('build-notification', function(){
	log('****** Building all assets ******');

	var msg = {
		title: 'Gulp has finished!',
		subtitle: 'The build is complete and has deployed to dist',
		message: 'Make sure to test your code before checking in!!'
	};

	del(config.temp);
	log(msg.message);
	notify(msg);
});

gulp.task('test', function(done){
	log('****** Manual single run tests started ******');

	startTests(true /* single run */, false /* autowatch */,  done);
});

gulp.task('autotest', function(done){
	startTests(false /* single run */, true /* autowatch */, done);
});

gulp.task('docs', function() {
	log('****** Generating documentation ******');

	return gulp
		.src(config.js)
		.pipe($.jsdoc.parser({
			plugins: ['plugins/markdown']
		}))
		.pipe($.jsdoc.generator(config.docs, {
			path: './node_modules/jsdoc3-bootstrap'}));
});

gulp.task('bump', function(){
	var msg = 'Bumping versions';
	var type = args.type;
	var version = args.version;
	var options = {};

	if(version) {
		options.version = version;
		msg += ' to ' + version;
	} else {
		options.type = type;
		msg += ' for a ' + type;
	}
	log(msg);

	return gulp
		.src(config.packages)
		.pipe($.print())
		.pipe($.bump(options))
		.pipe(gulp.dest(config.root));

});

gulp.task('spec-index.html', function(){
	log('****** building the spec runner ******');

	var wiredep = require('wiredep').stream;
	var options = config.getWiredepDefaultOptions();
	options.devDependencies = true;

	return gulp
		.src(config.specRunner)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.testLibraries),
			{name: 'inject:testlibraries', read: false}))
		.pipe($.inject(gulp.src(config.js)))
		.pipe($.inject(gulp.src(config.specHelpers),
			{name: 'inject:spechelpers', read: false}))
		.pipe($.inject(gulp.src(config.specs),
			{name: 'inject:specs', read: false}))
		.pipe($.inject(gulp.src(config.temp + config.templateCache.file),
			{name: 'inject:templates', read: false}))
		.pipe(gulp.dest(config.indexDir));
});




////////////////////// PACKAGED TASKS /////////////////////////////////

gulp.task('clean-all', function(cb){
	runSeq('clean-fonts', 'clean-images', 'clean-code', 'clean-docs', 'clean-temp', cb);
});

gulp.task('build-styles', function(cb) {
	runSeq('clean-styles', 'styles', cb);
});

gulp.task('build-fonts', function(cb) {
	runSeq('clean-fonts', 'fonts', cb);
});

gulp.task('build-images', function(cb) {
	runSeq('clean-images', 'images', cb);
});

gulp.task('build-templatecache', function(cb) {
	runSeq('clean-code', 'templatecache', cb);
});

gulp.task('build-docs', function(cb) {
	runSeq('clean-docs', 'docs', cb);
});

gulp.task('build-index.html', function(cb) {
	runSeq('build-styles', 'wiredep', 'build-templatecache', 'inject', cb);
});

gulp.task('build-spec', function(cb) {
	runSeq('build-templatecache', 'spec-index.html', cb);
});

gulp.task('optimize-build', function(cb) {
	runSeq('build-index.html', 'optimize', cb);
});

gulp.task('build-no-tests', function(cb) {
	runSeq('vet', 'build-styles', 'build-fonts', 'build-images', 'optimize-build', 'build-docs', 'build-notification', cb);
});

gulp.task('run-tests', function(cb) {
	runSeq('vet', 'build-templatecache', 'test', cb);
});

gulp.task('autorun-tests', function(cb) {
	runSeq('vet', 'build-templatecache', 'autotest', cb);
});

gulp.task('build', function(cb) {
	runSeq('run-tests', 'build-no-tests', cb);
});

gulp.task('build-increment-version', function(cb) {
	runSeq('build', 'bump', cb);
});

gulp.task('browser-sync', function() {
	startBrowserSync(true, false);
});

/////////////////////  UTILITY FUNCTIONS /////////////////////////////

/* Configures and kicks of karma server*/
function startTests(singleRun, autowatch, done){
	var karma = require('karma').server;
	var excludeFiles = [];

	karma.start({
		configFile: __dirname + '/karma.conf.js',
		exclude: config.karma.exclude,
		singleRun: !!singleRun,
		autoWatch: !!autowatch
	}, karmaCompleted);

	function karmaCompleted(karmaResult) {
		log('****** Karma completed! ******');
		if(karmaResult === 1) {
			done('Karma: tests failed with code ' + karmaResult);
		} else {
			done();
		}
	}


}

/* Start browser sync */
function startBrowserSync(isDev, specRunner){
	if(args.nosync || browserSync.active){
		return;
	}

	log('****** Starting browser-sync on port' + config.defaultPort + ' ******');

	if(isDev){

		gulp.watch(config.less, ['styles'])
			.on('change', function(event) {
				changeEvent(event);
			});
	} else {

		gulp.watch([config.less, config.js, config.html], ['optimize', browserSync.reload()])
			.on('change', function(event) {
				changeEvent(event);
			});
	}

	var options = {
		proxy: 'localhost:' + config.defaultPort,
		port: 3000,
		files: isDev ? [
			config.baseSrc + '**/*.*',
			'!' + config.baseSrc + '**/*.less'
		] : [],
		ghostMode: {
			clicks: true,
			location: false,
			forms: true,
			scroll: true
		},
		injectChanges: true,
		logFileChanges: true,
		logLevel: 'debug',
		logPrefix: 'gulp-patterns',
		notify: true,
		reloadDelay: 1000
	};

	if(specRunner) {
		options.startPath = config.specRunnerFile;
	}
	browserSync(options);
}

/* Logging */
function log(msg) {
	if(typeof(msg) === 'object') {
		msg.map(function(prop) {
			if(prop.hasOwnProperty(prop)) {
				$.util.log($.util.colors.blue(msg[prop]));
			}
		});
	} else {
		$.util.log($.util.colors.blue(msg));
	}
}

/* Clean paths */
function clean(path, done) {
	log('Cleaning: ' + $.util.colors.blue(path));
	del(path, done);
}

/* Helper function to log out change events */
function changeEvent(event) {
	var srcPattern = new RegExp('/.*(?=/' + config.baseSrc + ')/');
	log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/* Desktop notify toast that displays when build finishes */
function notify(options) {
	var notifier = require('node-notifier');
	var notifyOptions = {
		sound: 'Bottle',
		//contentImage: 'gulp-2x.png',
		icon: 'gulp-2x.png'
	};

	_.assign(notifyOptions, options);
	notifier.notify(notifyOptions);

}

/* Node server config */
function serve(isDev, specRunner){
	var nodeOptions = {
		script: config.nodeServer,
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'dev' : 'build'
		},
		watch: [config.server]
	};

	return $.nodemon(nodeOptions)
		.on('restart', function(ev){
			log('****** nodemon restarted ******');
			log('****** files changed on restart: \n' + ev +' ******');
			setTimout(function(){
				browserSync.notify('reloading now....');
				browserSync.reload({stream: false});
			}, config.browserReloadDelay);
		})
		.on('start', function(){
			log('****** nodemon started ******');
			startBrowserSync(isDev, specRunner);
		})
		.on('crash', function(){
			log('****** nodemon crashed: why you script crashed...why.... ******');
		})
		.on('exit', function(){
			log('****** nodemon exited cleanly ******');
		});
}