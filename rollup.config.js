export default [
	{
		input: './.dist/lib.hac/src/lib.hac.js',
		output: {
			format: 'es',
			file: './.rollup/lib.hac.js',
			paths: {
				'@zone09.net/foundation': './lib.foundation.js',
				'@zone09.net/paperless': './lib.paperless.js',
				'@extlib/matter': './extlib/matter-0.20.0.min.js',
				'@extlib/poly-decomp': './extlib/poly-decomp-0.2.1.min.js',
				'@extlib/codemirror': './extlib/codemirror-5.63.0.min.js'
			 }
		},
	},
]
