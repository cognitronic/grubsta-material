/**
 * Created by Danny Schreiber on 3/20/15.
 */


module.exports = function(){
	var baseSrc = './app/src/';
	var testFixtures = '../spec/fixtures/';
	var indexDir = './';
	var temp = './.tmp/';
	var root = './';
	var coverage = '../../coverage/';
	var docs = './docs';
	var wiredep = require('wiredep');
	var bowerFiles = wiredep({devDependencies: true})['js'];
	var images = baseSrc + 'assets/images/';
	var specRunnerFile = 'specs.html';

	var config = {
		defaultPort: 8080,
		temp: temp,
		root: root,
		testFixtures: testFixtures,
		alljs: [
			baseSrc + '**/*.js'
		],
		images: images,
		index: 'index.html',
		indexDir: indexDir,
		baseSrc: baseSrc,
		dist: './dist/',
		coverage: coverage,
		docs: docs,
		fonts: ['./app/vendors/font-awesome/fonts/**/*.*'],
		images: baseSrc + 'assets/images/**/*.*',
		js: [
			baseSrc + '**/*.module.js',
			baseSrc + '**/*.js',
			'!' + baseSrc + '**/*.spec.js'
		],

		css: [
			'app/src/assets/css/**/*.css'
		],

		html: baseSrc + '**/*.html',

		cssDir: baseSrc + 'assets/css/',
		htmlTemplates: baseSrc + '**/*.html',

		less: [
			baseSrc + 'assets/less/*.less'
		],
		bower: {
			json: require('./bower.json'),
			directory: './app/vendors/',
			ignorePath: './'
		},
		templateCache: {
			file: 'templates.js',
			options: {
				module: 'grubsta',
				standAlone: false,
				root: './app/src/'
			}
		},
		optimized: {
			libJs: 'lib.js',
			appJs: 'grubsta.js'
		},
		packages: [
			'./bower.json',
			'./package.json'
		],
		specs: indexDir + '**/*.spec.js',
		specRunner: indexDir + specRunnerFile,
		specRunnerFile: specRunnerFile,
		testLibraries: [
			__dirname + '/node_modules/mocha/mocha.js',
			__dirname + '/node_modules/chai/chai.js',
			__dirname + '/node_modules/mocha-clean/index.js',
			__dirname + '/node_modules/sinon-chai/lib/sinon-chai.js',
			__dirname + '/node_modules/chai-as-promised/lib/chai-as-promised.js'
		],
		specHelpers: testFixtures + '**/*.js'
	};

	config.getWiredepDefaultOptions = function(){
		var options = {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		};
		return options;
	};

	config.karma = getkarmaOptions();

	function getkarmaOptions(){
		var options = {
			files: [].concat(
				bowerFiles,
				config.testLibraries,
				config.testFixtures,
				__dirname +'/app/src/**/*.module.js',
				__dirname +'/app/src/**/*.js',
				'../../.tmp/' + config.templateCache.file
			),
			exclude: [
				indexDir + 'node_modules/**/*.js'
			],
			coverage: {
				dir: coverage,
				reporters: [
					{
						type: 'html',
						subdir: 'report-html'
					},
					{
						type: 'lcov',
						subdir: 'report-lcov' // this is for CIs to consume
					},
					{
						type: 'text-summary'
					}
				]
			},
			preprocessors: {
				//'**/*.json': ['html2js']
			},
			autoWatch: false,
			singleRun: true
		};

		options.preprocessors[indexDir + '**/!(*.spec)+(.js)'] = ['coverage'];
		return options;
	}
	return config;
};