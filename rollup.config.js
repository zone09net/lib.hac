export default [
	{
		input: './.dist/lib.hac/src/lib.hac.js',
		output: {
			format: 'es',
			file: './.rollup/lib.hac.js',
			paths: {
				'@zone09.net/foundation': './lib.foundation.js',
				'@zone09.net/paperless': './lib.paperless.js',
				'@zone09.net/hac': './lib.hac.js',
				'@extlib/codemirror': './extlib/codemirror-5.63.0.js',
				'@extlib/cryptojs': './extlib/crypto-es-1.2.7/lib/index.js'
			 }
		},
	},
]
